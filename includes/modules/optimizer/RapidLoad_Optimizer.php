<?php

class RapidLoad_Optimizer
{

    use RapidLoad_Utils;

    static $metrics = ['render-blocking-resources','uses-responsive-images','offscreen-images','unminified-css','unminified-javascript','unused-css-rules',
        'unused-javascript','uses-optimized-images','modern-image-formats','uses-text-compression','uses-rel-preconnect','server-response-time',
        'redirects','uses-rel-preload','efficient-animated-content','duplicated-javascript','legacy-javascript','preload-lcp-image',
        'total-byte-weight','uses-long-cache-ttl','dom-size','user-timings','bootup-time','mainthread-work-breakdown','font-display',
        'third-party-summary','third-party-facades','lcp-lazy-loaded','layout-shift-elements','uses-passive-event-listeners','no-document-write',
        'long-tasks','non-composited-animations','unsized-images','viewport','no-unload-listeners',
        'critical-request-chains',
        'resource-summary',
        'largest-contentful-paint-element'
    ];

    static $options;
    static $previous_options;
    static $global_options;
    static $merged_options = [];
    static $job;
    static $strategy;
    static $revision_limit = 10;

    public function __construct(){

        self::$global_options = RapidLoad_Base::fetch_options();

        add_action('wp_ajax_fetch_page_speed', [$this, 'fetch_page_speed']);
        add_action('wp_ajax_nopriv_fetch_page_speed', [$this, 'fetch_page_speed']);

        add_action('wp_ajax_optimizer_update_settings', [$this,'optimizer_update_settings']);
        add_action('wp_ajax_nopriv_optimizer_update_settings', [$this,'optimizer_update_settings']);

        add_action('wp_ajax_titan_reset_to_default', [$this, 'titan_reset_to_default']);
        add_action('wp_ajax_nopriv_titan_reset_to_default', [$this, 'titan_reset_to_default']);

        if(!isset(self::$global_options['uucss_enable_page_optimizer']) || self::$global_options['uucss_enable_page_optimizer'] != "1"){
            return;
        }

        if(RapidLoad_DB::$current_version < 1.6){
            return;
        }

        add_action('wp_ajax_latest_page_speed', [$this,'latest_page_speed']);

        if(!defined('RAPIDLOAD_PAGE_OPTIMIZER_ENABLED')){
            define('RAPIDLOAD_PAGE_OPTIMIZER_ENABLED', true);
        }

        self::$revision_limit = apply_filters('rapidload/optimizer/revision-limit', 10);

        new OptimizerFont();
        new OptimizerJS();
        new OptimizerImage();
        new OptimizerStyle();
    }

    public function latest_page_speed(){

        self::verify_nonce();

        $job = new RapidLoad_Job([
            'url' => $this->transform_url(site_url())
        ]);
        if(!isset($job->id)){
            wp_send_json_error();
        }

        $last_metrics = $job->get_last_optimization_revision('desktop');

        if(!$last_metrics){
            $last_metrics = $job->get_last_optimization_revision('mobile');
        }

        wp_send_json_success($last_metrics);

    }

    public function titan_reset_to_default(){

        $this->pre_optimizer_function();

        if(isset(self::$strategy)){
            if(self::$strategy == "mobile"){
                self::$job->set_mobile_options(null);
            }else{
                self::$job->set_desktop_options(null);
            }
        }else{
            self::$job->set_desktop_options(null);
            self::$job->set_mobile_options(null);
        }

        self::$job->save();

        wp_send_json_success(self::$global_options);
    }

    public function  pre_optimizer_function(){
        if(isset($_REQUEST['url']) && !empty($_REQUEST['url']) && filter_var($_REQUEST['url'], FILTER_VALIDATE_URL) !== false){
            self::$job = new RapidLoad_Job([
                'url' => $this->transform_url($_REQUEST['url'])
            ]);
            if(!isset(self::$job->id)){
                self::$job->save();
            }
        }
        self::$global_options = RapidLoad_Base::fetch_options();
        if(isset($_REQUEST['strategy']) && isset(self::$job)){
            self::$strategy = $_REQUEST['strategy'];
            self::$options = self::$strategy == "desktop" ? self::$job->get_desktop_options() : self::$job->get_mobile_options();
            self::$previous_options = self::$options;
            foreach (self::$global_options as $key => $value){
                self::$merged_options[$key] = $value;
            }
            foreach (self::$options as $key => $value){
                self::$merged_options[$key] = $value;
            }
        }
    }

    public static function post_optimizer_function($data, $force = false){

        if(!isset(self::$strategy) || !isset(self::$job) || !isset(self::$options)){
            return;
        }

        $global = isset($_REQUEST['global']) && $_REQUEST['global'];

        foreach (self::$options as $key => $option){

            if($key == "individual-file-actions"){

                foreach (self::$options['individual-file-actions'] as $tag_key => $tag){

                    foreach (self::$options['individual-file-actions'][$tag_key] as $file_action_keys => $file_action){

                        if(isset($file_action)){
                            if(!isset($file_action->action)){
                                unset(self::$options['individual-file-actions'][$tag_key][$file_action_keys]);
                                continue;
                            }
                            else if(isset($file_action->action) && isset($file_action->action->value) && $file_action->action->value == "none"){
                                unset(self::$options['individual-file-actions'][$tag_key][$file_action_keys]);
                                continue;
                            }
                            switch ($file_action->url_object->file_type->value){
                                case 'css':{
                                    self::$options['uucss_enable_css'] = "1";
                                    break;
                                }
                                case 'js':{
                                    self::$options['uucss_enable_javascript'] = "1";
                                    break;
                                }
                                case 'image':{
                                    self::$options['uucss_enable_image_delivery'] = "1";
                                    break;
                                }
                                case 'font':{
                                    self::$options['uucss_enable_font_optimization'] = "1";
                                    break;
                                }
                            }
                        }


                    }

                }

            }

            if(isset(self::$options[$key]) && (self::$options[$key] != "" && self::$options[$key] && !empty(self::$options[$key]))){
                switch ($key){
                    case 'uucss_enable_uucss':
                    case 'uucss_inline_css':
                    case 'uucss_enable_cpcss':
                    case 'uucss_minify':
                        if($global){
                            RapidLoad_Base::update_option('rapidload_module_css',"1");
                        }
                        self::$options['uucss_enable_css'] = "1";
                        if($key == "uucss_enable_uucss"){
                            $job_data = new RapidLoad_Job_Data(self::$job, 'uucss');
                            if(!isset($job_data->id)){
                                $job_data->save();
                            }
                            do_action('uucss_async_queue', $job_data, [
                                'immediate' => true,
                                'titan' => true,
                            ]);
                        }
                        if($key == "uucss_enable_cpcss"){
                            $job_data = new RapidLoad_Job_Data(self::$job, 'cpcss');
                            if(!isset($job_data->id)){
                                $job_data->save();
                            }
                            do_action('cpcss_async_queue', $job_data, [
                                'immediate' => true,
                                'titan' => true,
                            ]);
                        }
                        break;
                    case 'uucss_self_host_google_fonts':
                        self::$options['uucss_enable_font_optimization'] = "1";
                        if($global){
                            RapidLoad_Base::update_option('rapidload_module_font',"1");
                        }
                        break;
                    case 'defer_inline_js':
                    case 'delay_javascript':
                    case 'minify_js':
                    case 'uucss_load_js_method':
                        self::$options['uucss_enable_javascript'] = "1";
                        if($global){
                            RapidLoad_Base::update_option('rapidload_module_js',"1");
                        }
                        break;
                    case 'uucss_support_next_gen_formats':
                    case 'uucss_set_width_and_height':
                    case 'uucss_lazy_load_images':
                    case 'uucss_exclude_above_the_fold_image_count':
                    case 'uucss_lazy_load_iframes':
                    case 'uucss_exclude_above_the_fold_images':
                        self::$options['uucss_enable_image_delivery'] = "1";
                        if($global){
                            RapidLoad_Base::update_option('rapidload_module_image',"1");
                        }
                        break;
                }

            }

            $option_type = gettype(self::$options[$key]);

            if(isset(self::$global_options[$key])){
                if($option_type == "string" && self::$global_options[$key] == $option){
                    unset(self::$options[$key]);
                }
                else if (($option_type == "object" || $option_type == "array") && json_encode($option) == json_encode(self::$global_options[$key])){
                    unset(self::$options[$key]);
                }
            }

        }

        if(self::$strategy == "desktop"){
            self::$job->set_desktop_options(self::$options);
        }else{
            self::$job->set_mobile_options(self::$options);
        }

        $hash = self::$job->get_last_optimization_revision_hash(self::$strategy);
        $new_hash = hash('md5', json_encode($data));
        $revision_count = self::$job->get_revision_count(self::$strategy);

        if(($hash != $new_hash && $force) || $revision_count == 0){


            if($revision_count > (self::$revision_limit - 1)){
                self::$job->delete_old_revision(self::$strategy, self::$revision_limit);
            }

            $optimization = new RapidLoad_Job_Optimization(self::$job, self::$strategy);
            $optimization->set_data($data);
            $optimization->save();
        }

        self::$job->save(!self::$job->exist());

        if(isset(self::$options['uucss_enable_cache'])){
            self::$global_options['uucss_enable_cache'] = self::$options['uucss_enable_cache'];
            RapidLoad_Base::update_option('autoptimize_uucss_settings',self::$global_options);
        }

        $options = [
            'uucss_support_next_gen_formats',
            'uucss_image_optimize_level',
            'uucss_self_host_google_fonts',
            'uucss_set_width_and_height',
            'uucss_minify',
            'minify_js',
            'uucss_enable_uucss',
            'uucss_inline_css',
            'uucss_enable_cpcss',
            'uucss_enable_cpcss_mobile',
            'uucss_additional_css',
            'uucss_load_js_method',
            'defer_inline_js',
            'uucss_lazy_load_images',
            'uucss_exclude_above_the_fold_images',
            'uucss_lazy_load_iframes',
            'uucss_enable_javascript',
            'uucss_enable_font_optimization',
        ];

        if($global){
            foreach ($options as $key){
                if(isset(self::$options[$key])){
                    self::$global_options[$key] = self::$options[$key];
                }
            }
            RapidLoad_Base::update_option('autoptimize_uucss_settings',self::$global_options);
        }


    }

    function formatSize($bytes) {
        $sizes = array("Bytes", "KB", "MB", "GB", "TB");
        if ($bytes == 0) return '0 Byte';
        $i = intval(floor(log($bytes, 1024)));
        return round($bytes / pow(1024, $i), 2) . ' ' . $sizes[$i];
    }

    public function fetch_page_speed(){

        self::verify_nonce();

        $this->pre_optimizer_function();

        if(!isset(self::$job) || !isset(self::$strategy)){
            wp_send_json_error();
        }

        $new = isset($_REQUEST['new']) && $_REQUEST['new'] === 'true';

        $body = file_get_contents('php://input');

        $result = ($body) ? json_decode($body) : null;

        if ($result && isset($result->page_speed)) {
            $result = $result->page_speed;
        }

        if(!$result){
            $result = self::$job->get_last_optimization_revision(self::$strategy);
        }

        //$result = self::$job->get_last_optimization_revision(self::$strategy);

        $url = "";

        if(!$result){

            wp_send_json_error([
                'reload' => true
            ]);

            $api = new RapidLoad_Api();

            $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : site_url();
            $isDev = isset($_REQUEST['is_dev']) && $_REQUEST['is_dev'] === 'true';


            if ($isDev || defined('RAPIDLOAD_DEV_MODE')) {

                if (defined('RAPIDLOAD_OPTIMIZER_TEST_URL')) {
                    $url = RAPIDLOAD_OPTIMIZER_TEST_URL;
                }
            }

            $result = $api->post('page-speed', [
                'url' => $url,
                'strategy' => self::$strategy
            ]);

            if(is_wp_error($result)){
                wp_send_json_error($result);
            }

            if (isset($result->errors)) {
                wp_send_json_error($result->errors);
            }

            if(!isset($result->audits)){
                error_log(json_encode($result, JSON_PRETTY_PRINT));
                wp_send_json_error([]);
            }

        }else{

            if(isset($_REQUEST['url']) && !empty($_REQUEST['url'])){
                $url = $_REQUEST['url'];
            }

        }

        if(!isset($result->audits)){
            wp_send_json_error([
                'reload' => true
            ]);
        }

        foreach ($result->audits as $audit){

            if(isset($audit->settings)){
                foreach ($audit->settings as $settings){
                    foreach ($settings->inputs as $input){

                        if(isset($input->control_type) && $input->control_type == "button"){
                            if(isset($input->key)){
                                switch ($input->key){
                                    case 'rapidload_purge_all':{
                                        $input->action = 'action=rapidload_purge_all&job_type=url&clear=false&immediate=true&url=' . $url . '&nonce=' . wp_create_nonce( 'uucss_nonce' );
                                        break;
                                    }
                                    case 'cpcss_purge_url':{
                                        $input->action = 'action=cpcss_purge_url&url=' . $url . '&nonce=' . wp_create_nonce( 'uucss_nonce' );
                                        break;
                                    }
                                    case 'update_htaccess':{
                                        $input->action = 'action=update_htaccess&nonce=' . wp_create_nonce( 'uucss_nonce' );
                                        break;
                                    }
                                }
                            }

                        }

                        if(!isset($input->key)){
                            continue;
                        }
                        if(isset(self::$merged_options[$input->key])){
                            if($input->key == "uucss_load_js_method"){
                                $input->value = self::$merged_options[$input->key] == "defer" || self::$merged_options[$input->key] == "1";
                            }else{
                                $input->value = self::$merged_options[$input->key];
                            }
                        }
                        if($input->key == "uucss_enable_uucss"){
                            $data = new RapidLoad_Job_Data(self::$job, 'uucss');
                            if(!$data->exist()){
                                $data->save();
                            }
                            $settings->{'status'} = [
                                'status' => $data->status,
                                'stats' => $data->get_stats(),
                                'warnings' => $data->get_warnings(),
                                'error' => $data->get_error()
                            ];
                        }
                        if($input->key == "uucss_enable_cpcss"){
                            $data = new RapidLoad_Job_Data(self::$job, 'cpcss');
                            if(!$data->exist()){
                                $data->save();
                            }
                            $settings->{'status'} = [
                                'status' => $data->status,
                                'error' => $data->get_error()
                            ];
                        }
                        $cache_file = RapidLoad_Cache_Store::get_cache_file(self::$job->url);
                        if($input->key == "uucss_enable_cache"){
                            $settings->{'status'} = [
                                'status' => @file_exists($cache_file),
                                'file' => $cache_file,
                                'size' => @file_exists($cache_file) ? $this->formatSize(@filesize($cache_file)) : null,
                            ];
                        }
                    }
                }
            }

            if(isset($audit->files) && isset($audit->files->headings) && count($audit->files->headings) == 0 && isset(self::$merged_options['individual-file-actions-headings'][$audit->id])){
                $audit->files->headings = json_decode(self::$merged_options['individual-file-actions-headings'][$audit->id]);
            }

            if(isset($audit->files) && isset($audit->files->items) && !empty($audit->files->items)){
                foreach ($audit->files->items as $item){

                    if(isset($item->url) && isset($item->url->url)){

                        if(!isset($item->url->regex)){
                            $item->url->regex = self::$job->generateUrlRegex($item->url->url);
                        }

                        if(!isset(self::$merged_options['individual-file-actions'])){
                            self::$merged_options['individual-file-actions'] = [];
                        }

                        if(!isset(self::$merged_options['individual-file-actions'][$audit->id])){
                            self::$merged_options['individual-file-actions'][$audit->id][] = [];
                        }

                        /*$item->action = (object)[
                            "control_type" => "dropdown",
                            "value"         => "none"
                        ];*/

                        if(isset(self::$merged_options['individual-file-actions'][$audit->id]) && is_array(self::$merged_options['individual-file-actions'][$audit->id]) && !empty(self::$merged_options['individual-file-actions'][$audit->id])){

                            $key = array_search($item->url->url, array_column(self::$merged_options['individual-file-actions'][$audit->id], 'url'));

                            if(isset($key) && is_numeric($key)){

                                self::$merged_options['individual-file-actions'][$audit->id] = array_values(self::$merged_options['individual-file-actions'][$audit->id]);

                                if(isset(self::$merged_options['individual-file-actions'][$audit->id][$key]->action)){
                                    $item->action = (object)self::$merged_options['individual-file-actions'][$audit->id][$key]->action;
                                }

                            }else{

                                self::$merged_options['individual-file-actions'][$audit->id][] = (object)[
                                    'url' => $item->url->url,
                                    'action' => isset($item->action) ? $item->action : null,
                                    'url_object' => $item->url
                                ];

                            }

                        }
                    }
                }

            }

            if(isset(self::$merged_options['individual-file-actions'][$audit->id])){

                $passed_heading_exist = false;

                foreach (self::$merged_options['individual-file-actions'][$audit->id] as $fileaction){

                    $found = false;

                    foreach ($audit->files->items as $item){

                        if(isset($item->url) && isset($item->url->url) && isset($fileaction->url)){

                            if($item->url->url == $fileaction->url){
                                $found = true;
                                break;
                            }

                        }

                    }

                    if(!$found && isset( $fileaction->meta) && isset($fileaction->action) && isset($fileaction->action->value) && $fileaction->action->value != "none"){

                        $passed_item = json_decode($fileaction->meta);
                        $passed_item->passed = true;

                        foreach ($audit->files->headings as $heading){
                            $_heading = (array)$heading;
                            if(isset($_heading['key']) && $_heading['key'] == "passed"){
                                $passed_heading_exist = true;
                                break;
                            }
                        }

                        if(!$passed_heading_exist){
                            $audit->files->headings[] = [
                                'key' => 'passed',
                                'label' => 'Passed',
                                'valueType' => 'boolean',
                            ];
                        }
                        $audit->files->items[] = $passed_item;

                    }
                }

            }


        }

        self::post_optimizer_function($result);

        wp_send_json_success([
            'page_speed' => $result,
            'revisions' => self::$job->get_optimization_revisions(self::$strategy, self::$revision_limit),
            'individual-file-actions' => isset(self::$merged_options['individual-file-actions']) ? self::$merged_options['individual-file-actions'] : [],
            'options' => self::$options,
            'merged_options' => self::$merged_options,
        ]);


    }

    public function optimizer_update_settings(){

        self::verify_nonce();

        $data = json_decode(file_get_contents('php://input'));

        if(!isset($data) || !isset($data->data)){
            wp_send_json_error('Missing required data to save the settings!');
        }

        $this->pre_optimizer_function();

        if(!isset(self::$options)){
            wp_send_json_error('Missing options data to save the settings!');
        }

        $result = $data->data;

        $preload_images = [];

        if(isset($result->audits) && is_array($result->audits)){

            foreach ($result->audits as $audit){

                if($audit->id == "prioritize-lcp-image"){

                    if(isset($audit->files) && isset($audit->files->debugData) && !empty($audit->files->debugData->initiatorPath)){

                        foreach ($audit->files->debugData->initiatorPath as $path){

                            if(isset($path->url)){

                                if (preg_match('/\.(jpg|jpeg|jpg|png|gif)$/i', $path->url)) {
                                    $preload_images[] = $path->url;
                                }

                            }

                        }

                    }

                }

                if(isset($audit->settings)){
                    foreach ($audit->settings as $settings){
                        foreach ($settings->inputs as $input){
                            switch($input->control_type ){

                                case 'checkbox' :{
                                    if(isset($input->value) && isset($input->key) && ($input->value || $input->value == "1")){
                                        if($input->key == "uucss_load_js_method"){
                                            self::$options[$input->key] = "defer";
                                        }else{
                                            self::$options[$input->key] = "1";
                                        }
                                    }else if(isset($input->key)){
                                        self::$options[$input->key] = "";
                                    }
                                    break;
                                }
                                case 'dropdown' :
                                case 'text' :
                                case 'options' :
                                case 'textarea' :
                                case 'number' :{
                                    if(isset($input->value) && isset($input->key)){
                                        self::$options[$input->key] = $input->value;
                                    }else if(isset($new_options[$input->key])){
                                        unset(self::$options[$input->key]);
                                    }
                                    break;
                                }
                            }

                            if(isset($input->key) && ($input->key == "uucss_enable_uucss" || $input->key == "uucss_enable_cpcss")){
                                if(isset($input->{'value_data'})){
                                    unset($input->{'value_data'});
                                }
                            }

                        }
                    }
                }

                if(isset($audit->files) && isset($audit->files->items) && !empty($audit->files->items)){

                    if(!isset(self::$options['individual-file-actions-headings'][$audit->id])){
                        if(isset($audit->files->headings)){
                            self::$options['individual-file-actions-headings'][$audit->id] = json_encode($audit->files->headings);
                        }
                    }

                    foreach ($audit->files->items as $item){

                        if(isset($item->url) && isset($item->url->url)){

                            if(!isset($item->url->regex)){
                                $item->url->regex = self::$job->generateUrlRegex($item->url->url);
                            }

                            if(!isset(self::$options['individual-file-actions'][$audit->id])){
                                self::$options['individual-file-actions'][$audit->id] = [];
                            }

                            $key = array_search($item->url->url, array_column(self::$options['individual-file-actions'][$audit->id], 'url'));

                            if(isset($key) && is_numeric($key)){

                                self::$options['individual-file-actions'][$audit->id] = array_values(self::$options['individual-file-actions'][$audit->id]);

                                if(isset(self::$options['individual-file-actions'][$audit->id][$key])){
                                    self::$options['individual-file-actions'][$audit->id][$key]->action = isset($item->action) ? $item->action : (object)[];
                                }

                            }else{
                                self::$options['individual-file-actions'][$audit->id][] = (object)[
                                    'url' => $item->url->url,
                                    'action' => isset($item->action) ? $item->action : null,
                                    'url_object' => $item->url,
                                    'meta' => json_encode($item)
                                ];
                            }

                        }
                    }
                }

            }

        }

        if((isset(self::$options['uucss_lazy_load_images']) && self::$options['uucss_lazy_load_images'] == "1") || (isset(self::$options['uucss_support_next_gen_formats']) && self::$options['uucss_support_next_gen_formats'] == "1" ) || (isset(self::$options['uucss_lazy_load_iframes']) && self::$options['uucss_lazy_load_iframes'] == "1") ){
            self::$options['uucss_enable_image_delivery'] = "1";
            if(isset(self::$options['uucss_lazy_load_iframes']) && self::$options['uucss_lazy_load_iframes'] == "1" ){
                self::$options['uucss_lazy_load_images'] == "1";
            }
        }else{
            unset(self::$options['uucss_enable_image_delivery']);
        }

        if(!empty($preload_images)){
            self::$options['uucss_preload_lcp_image'] = implode("\n",$preload_images);
        }

        if(isset(self::$options['uucss_self_host_google_fonts']) && self::$options['uucss_self_host_google_fonts'] == "1"){
            self::$options['uucss_enable_font_optimization'] = "1";
        }else{
            unset(self::$options['uucss_enable_font_optimization']);
        }

        if(isset(self::$options['uucss_minify']) && self::$options['uucss_minify'] ||
            isset(self::$options['uucss_enable_cpcss']) && self::$options['uucss_enable_cpcss'] ||
            isset(self::$options['uucss_enable_uucss']) && self::$options['uucss_enable_uucss'] ){
            self::$options['uucss_enable_css'] = "1";
        }else{
            unset(self::$options['uucss_enable_css']);
        }

        if(isset(self::$options['minify_js']) && self::$options['minify_js'] ||
            isset(self::$options['delay_javascript']) && self::$options['delay_javascript'] == "1" ||
            isset(self::$options['uucss_load_js_method']) && (self::$options['uucss_load_js_method'] == "defer" || self::$options['uucss_load_js_method'] == "1")){
            self::$options['uucss_enable_javascript'] = "1";
        }else{
            unset(self::$options['uucss_enable_javascript']);
        }

        $cache_enabled = isset(self::$options['uucss_enable_cache']) && self::$options['uucss_enable_cache'] ? "1" : "";
        $cache_enabled_prev_status = isset(self::$global_options['uucss_enable_cache']) && self::$global_options['uucss_enable_cache'] ? "1" : "";

        if($cache_enabled != $cache_enabled_prev_status){
            RapidLoad_Base::update_option('rapidload_module_cache',$cache_enabled);
            RapidLoad_Cache::setup_cache($cache_enabled);
        }

        $cdn_enabled = isset(self::$options['uucss_enable_cdn']) && self::$options['uucss_enable_cdn'] == "1";
        $cdn_enabled_prev_status = isset(self::$global_options['uucss_enable_cdn']) && self::$global_options['uucss_enable_cdn'] == "1";

        if($cdn_enabled != $cdn_enabled_prev_status){
            do_action('rapidload/validate-cdn', !$cdn_enabled);
        }

        $this->associate_domain(false);

        self::post_optimizer_function($result, true);

        wp_send_json_success('optimization updated successfully');

    }

    // old ajax actions here

    /*public function optimizer_enable_cache(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        $status = isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : "";

        RapidLoad_Cache::setup_cache($status);

        wp_send_json_success(true);

    }

    public function optimizer_serve_next_gen_images(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_error('status param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_image_delivery'] = "1";
            self::$options['uucss_support_next_gen_formats'] = "1";
            self::$options['uucss_image_optimize_level'] = "lossless";
        }else if(isset(self::$options['uucss_support_next_gen_formats'])){
            unset(self::$options['uucss_enable_image_delivery']);
            unset(self::$options['uucss_support_next_gen_formats']);
            unset(self::$options['uucss_image_optimize_level']);
        }

        $this->associate_domain(false);

        self::post_optimizer_function();

        wp_send_json_success(true);
    }*/

    public function associate_domain($revoke){
        $api = new RapidLoad_Api();
        if(!$revoke){
            $api->post('spai-associate-host',[
                'url' => trailingslashit(site_url()),
                'action' => 'add-domain'
            ]);
        }else{
            $api->post('spai-associate-host',[
                'url' => trailingslashit(site_url()),
                'action' => 'revoke-domain'
            ]);
        }

    }

    /*public function optimizer_self_host_google_font(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_error('status param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_font_optimization'] = "1";
            self::$options['uucss_self_host_google_fonts'] = "1";
        }else if(isset(self::$options['uucss_self_host_google_fonts'])){
            unset(self::$options['uucss_enable_font_optimization']);
            unset(self::$options['uucss_self_host_google_fonts']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);
    }

    public function optimizer_set_image_width_and_height(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_error('status param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_image_delivery'] = "1";
            self::$options['uucss_set_width_and_height'] = "1";
        }else if(isset(self::$options['uucss_set_width_and_height'])){
            unset(self::$options['uucss_enable_image_delivery']);
            unset(self::$options['uucss_set_width_and_height']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);
    }

    public function optimizer_set_unminified_css(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_css'] = "1";
            self::$options['uucss_minify'] = "1";
        }else if(isset(self::$options['uucss_minify'])){
            unset(self::$options['uucss_enable_css']);
            unset(self::$options['uucss_minify']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_set_unminified_javascript(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_javascript'] = "1";
            self::$options['minify_js'] = "1";
        }else if(isset(self::$options['minify_js'])){
            unset(self::$options['uucss_enable_javascript']);
            unset(self::$options['minify_js']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_set_unused_css_rules(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_enable_uucss'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_enable_uucss'] == "1"){
            self::$options['uucss_enable_css'] = "1";
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_css'] = "1";
            self::$options['uucss_enable_uucss'] = "1";
        }else if(isset(self::$options['uucss_enable_uucss'])){
            unset(self::$options['uucss_enable_css']);
            unset(self::$options['uucss_enable_uucss']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_render_blocking_resources(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_css'] = "1";
            self::$options['uucss_enable_cpcss'] = "1";
        }else if(isset(self::$options['uucss_enable_cpcss'])){
            unset(self::$options['uucss_enable_css']);
            unset(self::$options['uucss_enable_cpcss']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_offscreen_images(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_image_delivery'] = "1";
            self::$options['uucss_lazy_load_images'] = "1";
            self::$options['uucss_lazy_load_iframes'] = "1";
            self::$options['uucss_exclude_above_the_fold_image_count'] = "5";
        }else if(isset(self::$options['uucss_exclude_above_the_fold_image_count'])){
            unset(self::$options['uucss_enable_image_delivery']);
            unset(self::$options['uucss_lazy_load_images']);
            unset(self::$options['uucss_lazy_load_iframes']);
            unset(self::$options['uucss_exclude_above_the_fold_image_count']);
        }

        $this->associate_domain(false);

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_offscreen_images_exclude_above_the_fold(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['count'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_exclude_above_the_fold_image_count'] = $_REQUEST['count'];

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_defer_javascript(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if($_REQUEST['status'] == "on"){
            self::$options['uucss_enable_javascript'] = "1";
            self::$options['uucss_load_js_method'] = "defer";
            self::$options['defer_inline_js'] = "1";
        }else if(isset(self::$options['uucss_load_js_method'])){
            unset(self::$options['uucss_enable_javascript']);
            unset(self::$options['uucss_load_js_method']);
            unset(self::$options['defer_inline_js']);
        }

        self::post_optimizer_function();

        wp_send_json_success(true);

    }

    public function optimizer_load_javascript_file_on_user_interaction(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['pattern']) || !isset($_REQUEST['url']) || !isset($_REQUEST['action'])){
            wp_send_json_success('param missing');
        }

        self::$options['rapidload_load_scripts_on_user_interaction'] = isset(self::$options['rapidload_load_scripts_on_user_interaction']) ? unserialize(self::$options['rapidload_load_scripts_on_user_interaction']) : [];

        self::$options['rapidload_load_scripts_on_user_interaction'][] = [
            'url' => $_REQUEST['url'],
            'pattern' => $_REQUEST['pattern'],
            'action' => $_REQUEST['action']
        ];

        self::$options['rapidload_load_scripts_on_user_interaction'] = serialize(self::$options['rapidload_load_scripts_on_user_interaction']);

        self::post_optimizer_function();

        wp_send_json_success(true);

    }*/

    // old ajax actions ends here

}
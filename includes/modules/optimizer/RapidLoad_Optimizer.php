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
    static $job;
    static $strategy;

    public function __construct(){

        self::$options = RapidLoad_Base::fetch_options();
        self::pre_optimizer_function();

        add_action('wp_ajax_fetch_page_speed', [$this, 'fetch_page_speed']);
        add_action('wp_ajax_nopriv_fetch_page_speed', [$this, 'fetch_page_speed']);

        add_action('wp_ajax_optimizer_enable_cache', [$this,'optimizer_update_settings']);
    }

    public static function pre_optimizer_function(){
        if(isset($_REQUEST['url']) && !empty($_REQUEST['url']) && filter_var($_REQUEST['url'], FILTER_VALIDATE_URL) !== false){
            self::$job = new RapidLoad_Job([
                'url' => $_REQUEST['url']
            ]);
        }
        if(isset($_REQUEST['strategy']) && isset(self::$job)){
            self::$strategy = $_REQUEST['strategy'];
            self::$options = self::$strategy == "desktop" ? self::$job->get_desktop_options() : self::$job->get_mobile_options();
        }
    }

    public static function post_optimizer_function(){

        if(!isset(self::$strategy) || !isset(self::$job) || !isset(self::$options))

        if(self::$strategy == "desktop"){
            self::$job->set_desktop_options(self::$options);
        }else{
            self::$job->set_mobile_options(self::$options);
        }

        self::$job->save(!self::$job->exist());
    }

    public function fetch_page_speed(){

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");

        }

        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // May also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

            exit(0);
        }

        $api = new RapidLoad_Api();

        $size = isset($_REQUEST['size']) && $_REQUEST['size'] == 'mobile';
        $url = "https://viajaya.ec/"; // isset($_REQUEST['url']) ? $_REQUEST['url'] : site_url();

        $result = $api->post('page-speed', [
            'url' => $url,
            'mobile' => $size
        ]);

        if(!isset(self::$options['unused-javascript-files'])){
            self::$options['unused-javascript-files'] = [];
        }

        if(!isset($result->audits)){
            wp_send_json_error([]);
        }

        foreach ($result->audits as $audit){

            if(isset($audit->settings)){
                foreach ($audit->settings as $settings){
                    foreach ($settings->inputs as $input){
                        if(isset(self::$options[$input->key])){
                            $input->value = self::$options[$input->key];
                        }
                    }
                }
            }

            if($audit->id == "unused-javascript"){

                if(isset($audit->files) && isset($audit->files->items) && !empty($audit->files->items)){
                    foreach ($audit->files->items as $item){

                        if(isset(self::$options['unused-javascript-files']) && is_array(self::$options['unused-javascript-files']) && !empty(self::$options['unused-javascript-files'])){

                            $key = array_search($item->url, array_column(self::$options['unused-javascript-files'], 'url'));

                            if(isset($key) && is_numeric($key)){

                                $item->pattern = self::$options['unused-javascript-files'][$key]['pattern'];
                                $item->action = self::$options['unused-javascript-files'][$key]['action'];

                            }

                        }
                    }
                }

            }

        }

        wp_send_json_success([
            'page_speed' => $result,
            'options' => [
                'unused-javascript-files' => isset(self::$options['unused-javascript-files']) ? self::$options['unused-javascript-files'] : []
            ]
        ]);


    }

    public function optimizer_update_settings(){

        self::verify_nonce();

        if(!isset($_REQUEST['page_speed']) || !isset($_REQUEST['options'])){
            wp_send_json_error();
        }

        self::pre_optimizer_function();

        if(!isset(self::$options)){
            wp_send_json_error();
        }

        $result = $_REQUEST['page_speed'];
        $options = $_REQUEST['options'];

        if(!isset(self::$options['unused-javascript-files'])){
            self::$options['unused-javascript-files'] = [];
        }

        if(isset($result->audits) && is_array($result->audits)){

            foreach ($result->audits as $audit){

                if(isset($audit->settings)){
                    foreach ($audit->settings as $settings){
                        foreach ($settings->inputs as $input){

                            switch($input->control_type ){

                                case 'checkbox' :{
                                    if(isset($input->value) && isset($input->key) && $input->value == "1"){
                                        self::$options[$input->key] = "1";
                                    }else if(isset(self::$options[$input->key])){
                                        unset(self::$options[$input->key]);
                                    }
                                    break;
                                }
                                case 'dropdown' :
                                case 'text' :
                                case 'number' :{
                                    if(isset($input->value) && isset($input->key)){
                                        self::$options[$input->key] = $input->value;
                                    }else if(isset(self::$options[$input->key])){
                                        unset(self::$options[$input->key]);
                                    }
                                    break;
                                }
                            }

                        }
                    }
                }

                if($audit->id == "unused-javascript"){

                    if(isset($audit->files) && isset($audit->files->items) && !empty($audit->files->items)){
                        foreach ($audit->files->items as $item){

                            if(isset($item->url)){

                                $key = array_search($item->url, array_column(self::$options['unused-javascript-files'], 'url'));

                                if(isset($key) && is_numeric($key)){

                                    self::$options['unused-javascript-files'][$key]['pattern'] = $item->pattern;
                                    self::$options['unused-javascript-files'][$key]['action'] = $item->action;

                                }else{
                                    self::$options['unused-javascript-files'][] = [
                                        'url' => $item->url,
                                        'pattern' => $item->pattern,
                                        'action' => $item->action
                                    ];
                                }

                            }
                        }
                    }

                }

            }

        }

        if(isset($options['unused-javascript-files']) && !empty($options['unused-javascript-files'])){
            foreach ($options['unused-javascript-files'] as $option){

                $key = array_search($option['url'],array_column(self::$options['unused-javascript-files'], 'url'));

                if(isset($key) && is_numeric($key)){
                    self::$options['unused-javascript-files'][$key]['pattern'] = $option['pattern'];
                    self::$options['unused-javascript-files'][$key]['action'] = $option['action'];
                }

            }
        }

        self::post_optimizer_function();

        wp_send_json_success();

    }

    // old ajax actions here

    public function optimizer_enable_cache(){

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
    }

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

    public function optimizer_self_host_google_font(){

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

    }

    // old ajax actions ends here

}
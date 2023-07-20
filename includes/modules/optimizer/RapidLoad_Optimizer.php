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
        self::init();

        add_action('wp_ajax_fetch_page_speed', [$this, 'fetch_page_speed']);
        add_action('wp_ajax_nopriv_fetch_page_speed', [$this, 'fetch_page_speed']);

        add_action('wp_ajax_optimizer_enable_cache', [$this,'optimizer_enable_cache']);
        add_action('wp_ajax_optimizer_serve_next_gen_images', [$this,'optimizer_serve_next_gen_images']);
        add_action('wp_ajax_optimizer_compression_level', [$this,'optimizer_compression_level']);
        add_action('wp_ajax_optimizer_self_host_google_font', [$this,'optimizer_self_host_google_font']);
        add_action('wp_ajax_optimizer_set_image_width_and_height', [$this,'optimizer_set_image_width_and_height']);
        add_action('wp_ajax_optimizer_set_unminified_css', [$this,'optimizer_set_unminified_css']);
        add_action('wp_ajax_optimizer_set_unminified_javascript', [$this,'optimizer_set_unminified_javascript']);
        add_action('wp_ajax_optimizer_set_unused_css_rules', [$this,'optimizer_set_unused_css_rules']);
        add_action('wp_ajax_optimizer_render_blocking_resources', [$this,'optimizer_render_blocking_resources']);
        add_action('wp_ajax_optimizer_offscreen_images', [$this,'optimizer_offscreen_images']);
        add_action('wp_ajax_optimizer_offscreen_images_exclude_above_the_fold', [$this,'optimizer_offscreen_images_exclude_above_the_fold']);
        add_action('wp_ajax_optimizer_offscreen_images_lazyload_iframes', [$this,'optimizer_offscreen_images_lazyload_iframes']);
    }

    public static function init(){
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
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : site_url();

        $result = $api->post('page-speed', [
            'url' => $url,
            'mobile' => $size
        ]);

        $opportunities = [];

        foreach ($result->Opportunities as $key => $opportunity){
            $opp = apply_filters('page-optimizer/actions/opportunity/' . $opportunity->id, $opportunity);
            array_push($opportunities, $opp);
        }


        wp_send_json_success([
            'result' => $result,
            'opportunities' => $opportunities
        ]);


    }

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

        self::$options['uucss_enable_image_delivery'] = "1";
        self::$options['uucss_support_next_gen_formats'] = $_REQUEST['status'] == "on" ? "1" : null;

        $this->associate_domain(false);

        if($_REQUEST['strategy'] == "desktop"){
            self::$job->set_desktop_options(self::$options);
        }else{
            self::$job->set_mobile_options(self::$options);
        }

        self::$job->save(!self::$job->exist());

        wp_send_json_success(true);
    }

    public function optimizer_compression_level(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['compression_level'])){
            wp_send_json_error('status param missing');
        }

        self::$options['uucss_enable_image_delivery'] = "1";
        self::$options['uucss_image_optimize_level'] = $_REQUEST['compression_level'];

        $this->associate_domain(false);

        if($_REQUEST['strategy'] == "desktop"){
            self::$job->set_desktop_options(self::$options);
        }else{
            self::$job->set_mobile_options(self::$options);
        }

        self::$job->save(!self::$job->exist());

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

        self::$options['uucss_enable_font_optimization'] = "1";
        self::$options['uucss_self_host_google_fonts'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if($_REQUEST['strategy'] == "desktop"){
            self::$job->set_desktop_options(self::$options);
        }else{
            self::$job->set_mobile_options(self::$options);
        }

        self::$job->save(!self::$job->exist());

        wp_send_json_success(true);
    }

    public function optimizer_set_image_width_and_height(){

        if(!isset(self::$job) || !isset(self::$options) || !isset(self::$strategy)){
            wp_send_json_error('optimizer failed');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_error('status param missing');
        }

        self::$options['uucss_enable_image_delivery'] = "1";
        self::$options['uucss_set_width_and_height'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        wp_send_json_success(true);
    }

    public function optimizer_set_unminified_css(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_minify'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_minify'] == "1"){
            self::$options['uucss_enable_css'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_set_unminified_javascript(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['minify_js'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['minify_js'] == "1"){
            self::$options['uucss_enable_javascript'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_set_unused_css_rules(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_enable_uucss'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_enable_uucss'] == "1"){
            self::$options['uucss_enable_css'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_render_blocking_resources(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_enable_cpcss'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_enable_cpcss'] == "1"){
            self::$options['uucss_enable_css'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_offscreen_images(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_lazy_load_images'] =  $_REQUEST['status'] == "on" ? "1" : null;
        self::$options['uucss_exclude_above_the_fold_image_count'] =  "5";

        self::$options['uucss_enable_image_delivery'] = "1";

        $this->associate_domain(false);

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_offscreen_images_exclude_above_the_fold(){

        if(!isset($_REQUEST['exclude_above_the_fold'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_exclude_above_the_fold_image_count'] =  $_REQUEST['exclude_above_the_fold'];

        self::$options['uucss_enable_image_delivery'] = "1";

        $this->associate_domain(false);

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }

    public function optimizer_offscreen_images_lazyload_iframes(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_lazy_load_iframes'] =  $_REQUEST['status'] == "on" ? "1" : null;

        self::$options['uucss_enable_image_delivery'] = "1";

        $this->associate_domain(false);

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);

    }


}
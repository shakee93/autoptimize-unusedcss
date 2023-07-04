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

    public function __construct(){

        self::$options = RapidLoad_Base::fetch_options();

        add_action('wp_ajax_fetch_page_speed', [$this, 'fetch_page_speed']);
        add_action('wp_ajax_nopriv_fetch_page_speed', [$this, 'fetch_page_speed']);

        foreach (self::$metrics as $metric){
            if(method_exists( 'RapidLoad_Optimizer','add_actions_' . str_replace("-", "_", $metric))){
                add_filter('page-optimizer/actions/opportunity/'. $metric , [$this, 'add_actions_' . str_replace("-", "_", $metric)]);
            }
        }

        add_action('wp_ajax_optimizer_enable_cache', [$this,'optimizer_enable_cache']);
        add_action('wp_ajax_optimizer_serve_next_gen_images', [$this,'optimizer_serve_next_gen_images']);
        add_action('wp_ajax_optimizer_enable_font', [$this,'optimizer_enable_font']);
        add_action('wp_ajax_optimizer_set_image_width_and_height', [$this,'optimizer_set_image_width_and_height']);
        add_action('wp_ajax_optimizer_set_unminified_css', [$this,'optimizer_set_unminified_css']);
        add_action('wp_ajax_optimizer_set_unminified_javascript', [$this,'optimizer_set_unminified_javascript']);
        add_action('wp_ajax_optimizer_set_unused_css_rules', [$this,'optimizer_set_unused_css_rules']);
        add_action('wp_ajax_optimizer_render_blocking_resources', [$this,'optimizer_render_blocking_resources']);
    }

    public function fetch_page_speed(){

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

    public function add_actions_server_response_time($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_enable_cache',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;
    }

    public function optimizer_enable_cache(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        $status = isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : "";

        RapidLoad_Cache::setup_cache($status);

        wp_send_json_success(true);

    }

    public function add_actions_modern_image_formats($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ],
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'options',
                'control_values' => ['lossy', 'glossy', 'lossless'],
                'control_payload' => 'compression_level'
            ]
        ];

        return $opp;
    }

    public function optimizer_serve_next_gen_images(){

        if(!isset($_REQUEST['url']) || empty($_REQUEST['url'])){
            wp_send_json_success('param missing');
        }

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        if(!isset($_REQUEST['compression_level'])){
            wp_send_json_success('param missing');
        }

        $job = new RapidLoad_Job([
           'url' => $_REQUEST['url']
        ]);

        if(!$job->exist()){
            $job->save(true);
        }

        self::$options['uucss_support_next_gen_formats'] = isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;
        self::$options['uucss_image_optimize_level'] = isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_support_next_gen_formats'] == "1"){
            $this->associate_domain(false);
            self::$options['uucss_enable_image_delivery'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

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

    public function add_actions_uses_optimized_images($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ],
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'options',
                'control_values' => ['lossy', 'glossy', 'lossless'],
                'control_payload' => 'compression_level'
            ]
        ];

        return $opp;
    }

    public function add_actions_uses_responsive_images($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ],
            (object)[
                'ajax_action' => 'optimizer_serve_next_gen_images',
                'control_type' => 'options',
                'control_values' => ['lossy', 'glossy', 'lossless'],
                'control_payload' => 'compression_level'
            ]
        ];

        return $opp;
    }

    public function add_actions_enable_font($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_enable_font',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;
    }

    public function optimizer_enable_font(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_self_host_google_fonts'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_self_host_google_fonts'] == "1"){
            self::$options['uucss_enable_font_optimization'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);
    }

    public function add_actions_unsized_images($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_set_image_width_and_height',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;

    }

    public function optimizer_set_image_width_and_height(){

        if(!isset($_REQUEST['status'])){
            wp_send_json_success('param missing');
        }

        self::$options['uucss_set_width_and_height'] =  isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : null;

        if(self::$options['uucss_set_width_and_height'] == "1"){
            self::$options['uucss_enable_image_delivery'] = "1";
        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings', self::$options);

        wp_send_json_success(true);
    }

    public function add_actions_unminified_css($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_set_unminified_css',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;

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

    public function add_actions_unminified_javascript($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_set_unminified_javascript',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;

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

    public function add_actions_unused_css_rules($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_set_unused_css_rules',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;

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

    public function add_actions_render_blocking_resources($opp){

        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_render_blocking_resources',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;

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

    public function add_action_offscreen_images($opp){
        $opp->{'actions'} = [
            (object)[
                'ajax_action' => 'optimizer_render_blocking_resources',
                'control_type' => 'checkbox',
                'control_values' => ['on', 'off'],
                'control_payload' => 'status'
            ]
        ];

        return $opp;
    }


}
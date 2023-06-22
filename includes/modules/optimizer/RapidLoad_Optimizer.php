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

    public function __construct(){

        add_action('wp_ajax_fetch_page_speed', [$this, 'fetch_page_speed']);

        foreach (self::$metrics as $metric){
            if(method_exists( 'RapidLoad_Optimizer','add_actions_' . str_replace("-", "_", $metric))){
                add_filter('page-optimizer/actions/opportunity/'. $metric , [$this, 'add_actions_' . str_replace("-", "_", $metric)]);
            }
        }

        add_action('wp_ajax_optimizer_enable_cache', [$this,'optimizer_enable_cache']);
    }

    public function fetch_page_speed(){

        $api = new RapidLoad_Api();

        $size = isset($_REQUEST['size']) && $_REQUEST['size'] == 'mobile';

        $result = $api->post('page-speed', [
            'url' => 'https://www.kathrein-ds.com/',
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
                'control_param' => 'status'
            ]
        ];

        return $opp;
    }

    public function optimizer_enable_cache(){

        $status = isset($_REQUEST['status']) && $_REQUEST['status'] == "on" ? "1" : "";

        RapidLoad_Cache::setup_cache($status);
    }
}
<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Queue
{

    use RapidLoad_Utils;
    public static $interval = 600;
    public static $job_count = 4;
    public $async = false;
    public static $post_types = [];
    public $fileSystem;

    function __construct()
    {
        $this->init();
    }

    function init(){

        $options = RapidLoad_Base::fetch_options();

        if(isset($options['uucss_queue_interval'])){
            self::$interval = (int) $options['uucss_queue_interval'];
        }

        if(isset($options['uucss_jobs_per_queue'])){
            self::$job_count = defined('UUCSS_JOB_COUNT_PER_QUEUE') ? UUCSS_JOB_COUNT_PER_QUEUE : (int) $options['uucss_jobs_per_queue'];
        }

        add_action('uucss_cron_queue', [$this, 'cache'], 2 , 1);

        add_filter( 'cron_schedules', [$this, 'uucss_process_queue_schedule'] );

        $uucss_cron = $this->cron_exist();

        if ( ! wp_next_scheduled( 'cron_uucss_process_queue' ) && !$uucss_cron) {
            self::log([
                'log' => 'job cron scheduled',
                'type' => 'uucss-cron'
            ]);
            wp_schedule_event( time(), 'uucss_cron_interval', 'cron_uucss_process_queue');
        }

        add_action( 'cron_uucss_process_queue', [$this ,'uucss_process_queue'] );

        $this->async = apply_filters('uucss/queue/async',false);

        self::$post_types = apply_filters('uucss/queue/post_types',array(
            'post',
            'page',
            'product',
        ));

        $this->fileSystem = new RapidLoad_FileSystem();
    }

    function cron_exist($cron_name = 'cron_uucss_process_queue'){

        $cron_array = _get_cron_array();

        if(!isset($cron_array) || empty($cron_array)){
            return false;
        }

        $uucss_cron = array_column($cron_array, $cron_name);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        $uucss_cron = array_shift($uucss_cron);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        $uucss_cron = array_shift($uucss_cron);

        if(!isset($uucss_cron) || empty($uucss_cron)){
            return false;
        }

        return $uucss_cron;
    }

    static function get_post_types(){
        return self::$post_types;
    }

    function uucss_process_queue(){

        $this->fetch_job_id();

        $this->fetch_rule_job_id();

        $this->fetch_ccss_job_id();

        $this->uucss_process_result();

    }

    function fetch_ccss_job_id(){

        $current_waiting = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'processing'","'waiting'"], self::$job_count);

        $path_ccss_list = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'queued'"], (self::$job_count - count($current_waiting)));

        if(!empty($path_ccss_list)){

            foreach ($path_ccss_list as $value){

                $this->cache_path_ccss($value);
            }
        }
    }

    function cache_path_ccss($value){

        global $rccss;

        $post_id = url_to_postid($value->url);

        $path_ccss = new \RapidLoad\Service\CriticalCSS_Path([
            'url' => $value->url,
        ]);

        $path_ccss->status = 'waiting';
        $path_ccss->job_id = null;
        $path_ccss->save();

        self::log([
            'log' => 'fetching job id for path critical css',
            'url' => $path_ccss->url,
            'type' => 'uucss-cron'
        ]);

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->post( 's/criticalcss',
            array_merge( $rccss->api_options($post_id),
                [ 'url' => $path_ccss->url ]
            ));

        if($uucss_api->is_error($result)){

            $path_ccss->mark_as_failed($uucss_api->extract_error( $result ));
            $path_ccss->save();

            self::log( [
                'log' => 'fetched data stored status failed',
                'url' => $path_ccss->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $path_ccss->job_id = $result->id;
            $path_ccss->save();
        }

    }

    function fetch_job_id(){

        global $uucss;

        $current_waiting = UnusedCSS_DB::get_links_by_status(["'processing'","'waiting'"], self::$job_count);

        $links = UnusedCSS_DB::get_links_by_status(["'queued'"], (self::$job_count - count($current_waiting)));

        if(!empty($links)){

            foreach ($links as $link){

                UnusedCSS_DB::update_meta([
                    'status' => 'waiting',
                    'job_id' => null
                ], $link->url);

                self::log([
                    'log' => 'status updated to waiting',
                    'url' => $link->url,
                    'type' => 'uucss-cron'
                ]);

                if($this->async){

                    wp_schedule_single_event( time(), 'uucss_cron_queue', [
                        'url'      => $link->url,
                    ] );

                }else{

                    $this->cache($link->url);

                }

            }

        }

    }

    function fetch_rule_job_id(){

        $current_waiting = UnusedCSS_DB::get_rules_by_status(["'processing'","'waiting'"], self::$job_count);

        $rules = UnusedCSS_DB::get_rules_by_status(["'queued'"], (self::$job_count - count($current_waiting)));

        if(!empty($rules)){

            foreach ($rules as $rule){

                $this->cache_rule($rule);
            }

        }

    }

    function uucss_process_result(){

        $links = UnusedCSS_DB::get_links_by_status(["'processing'","'waiting'"], self::$job_count, 'job_id');

        if(!empty($links)){

            foreach ($links as $link){

                $this->update_result($link->url, $link->job_id);

            }

        }

        $rules = UnusedCSS_DB::get_rules_by_status(["'processing'","'waiting'"], self::$job_count, 'job_id');

        if(!empty($rules)){

            foreach ($rules as $rule){

                $this->update_rule_result($rule);

            }

        }

        $path_ccss = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'processing'","'waiting'"], self::$job_count, 'job_id');

        if(!empty($path_ccss)){

            foreach ($path_ccss as $value){

                $this->update_path_ccss_result($value);

            }

        }
    }

    function update_path_ccss_result($path_ccss){

        $path_ccss_object = new \RapidLoad\Service\CriticalCSS_Path([
           'url' => $path_ccss->url
        ]);

        if(!$path_ccss->job_id){
            return;
        }

        self::log( [
            'log' => 'fetching data for job ' . $path_ccss->job_id,
            'url' => $path_ccss->url,
            'type' => 'store'
        ] );

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/criticalcss/' . $path_ccss->job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $path_ccss_object->mark_as_failed($uucss_api->extract_error( $result ));
            $path_ccss_object->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $path_ccss->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->data)){
            $this->add_path_ccss($path_ccss_object, $result);

        }
    }

    function add_path_ccss($css_object, $result = false){

        if($result){
            $this->result = $result;
        }

        $warnings = isset($this->result) && isset($this->result->meta) ? $this->result->meta->warnings : null;

        if(isset($this->result->meta->stats) && isset($this->result->meta->stats->using) && in_array('rapidload', $this->result->meta->stats->using)){

            $warnings[] = [
                "message" => "Clear your page cache"
            ];
        }

        $file_name = 'rccss-' . $this->encode($result->data) . '.css';
        $this->fileSystem->put_contents(\RapidLoad\Service\CriticalCSS::$base_dir . '/' . $file_name, $result->data);
        $css_object->mark_as_success($file_name, null, $warnings);
        $css_object->save();
        do_action( 'uucss/cached', [
            'url' => $css_object->url
        ]);
    }

    function cache($url){
        global $uucss;

        if(apply_filters('uucss/queue/redis', true)){

            $post_id = url_to_postid($url);

            self::log([
                'log' => 'fetching job id',
                'url' => $url,
                'type' => 'uucss-cron'
            ]);

            $uucss_api = new RapidLoad_Api();

            $result = $uucss_api->post( 's/unusedcss',
                array_merge( $uucss->api_options($post_id),
                    [ 'url' => $url ]
                ));

            if($uucss_api->is_error($result)){

                UnusedCSS_DB::update_failed($url, $uucss_api->extract_error( $result ));

                $this->log( [
                    'log' => 'fetched data stored status failed',
                    'url' => $url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            if(isset($result->id)){

                UnusedCSS_DB::update_meta(['job_id' => $result->id ], $url);
            }
        }else{

            $post_id = url_to_postid($url);
            $uucss->init_async_store( $uucss->provider, $url, $uucss->api_options($post_id) );
        }

    }

    function cache_rule($rule){

        global $uucss;

        $post_id = url_to_postid($rule->url);

        $rule = new UnusedCSS_Rule([
            'rule' => $rule->rule,
            'regex' => $rule->regex
        ]);

        $rule->status = 'waiting';
        $rule->job_id = null;
        $rule->save();

        self::log([
            'log' => 'fetching job id',
            'url' => $rule->url,
            'type' => 'uucss-cron'
        ]);

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->post( 's/unusedcss',
            array_merge( $uucss->api_options($post_id),
                [ 'url' => $rule->url ]
            ));

        if($uucss_api->is_error($result)){

            $rule->mark_as_failed($uucss_api->extract_error( $result ));
            $rule->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $rule->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $rule->job_id = $result->id;
            $rule->save();
        }

    }

    function update_result($url, $job_id){

        if(!$job_id){
            return;
        }

        $this->log( [
            'log' => 'fetching data for job ' . $job_id,
            'url' => $url,
            'type' => 'store'
        ] );

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/unusedcss/' . $job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $error = $uucss_api->extract_error( $result );

            if(isset($error['message']) && $error['message'] == 'Job processing failed in queue'){

                UnusedCSS_DB::requeue_urls([
                    $url
                ]);

                $this->log( [
                    'log' => 're-queued due to allowed errors',
                    'url' => $url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            UnusedCSS_DB::update_failed($url, $error);
            do_action( 'uucss/cache_cleared', [
                'url' => $url
            ]);

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->state) && $result->state == 'failed'){

            UnusedCSS_DB::update_failed($url, 'Unknown error occurred');
            do_action( 'uucss/cache_cleared', [
                'url' => $url
            ]);
            return;
        }

        $uucss_store = new RapidLoad_Store(null, $url,null);

        if(isset($result->state)){

            if($result->state == 'waiting' || $result->state == 'delayed' || $result->state == 'created' || $result->state == 'stalling'){
                UnusedCSS_DB::update_meta([
                    'status' => 'waiting'
                ], $url);
            }else if($result->state == 'active'){
                UnusedCSS_DB::update_meta([
                    'status' => 'processing'
                ], $url);
            }

        }

        if(isset($result->completed) && $result->completed && isset($result->data) && is_array($result->data) && count($result->data) > 0){

            $files = $uucss_store->cache_files($result->data);
            $uucss_store->add_link($files, $result);
            $uucss_store->uucss_cached();

        }else if(isset($result->completed) && $result->completed){

            $uucss_store->add_link(null, $result);
        }

    }

    function update_rule_result($uucss_rule){

        $rule = new UnusedCSS_Rule([
            'rule' => $uucss_rule->rule,
            'regex' => $uucss_rule->regex
        ]);

        if(!$rule->job_id){
            return;
        }

        $this->log( [
            'log' => 'fetching data for job ' . $rule->job_id,
            'url' => $rule->url,
            'type' => 'store'
        ] );

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/unusedcss/' . $rule->job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $rule->mark_as_failed($uucss_api->extract_error( $result ));
            $rule->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $rule->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        $uucss_store = new RapidLoad_Store(null, $rule->url,null, $rule);

        if(isset($result->completed) && $result->completed && isset($result->data) && is_array($result->data) && count($result->data) > 0){

            $files = $uucss_store->cache_files($result->data);
            $uucss_store->add_rule($files, $result);
            $uucss_store->uucss_cached();

        }else if(isset($result->completed) && $result->completed){

            $uucss_store->add_rule(null, $result);
        }
    }

    function uucss_process_queue_schedule($schedules){
        $schedules['uucss_cron_interval'] = array(
            'interval' => self::$interval,
            'display'  => __( 'uucss cron interval' ),
        );
        return $schedules;
    }
}

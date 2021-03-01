<?php


class UnusedCSS_Queue
{

    use UnusedCSS_Utils;
    public static $interval = 600;
    public static $job_count = 4;
    public $async = false;
    public static $post_types = [];

    function __construct()
    {
        $this->init();
    }

    function init(){

        $options = UnusedCSS_Autoptimize_Admin::fetch_options();

        if(isset($options['uucss_queue_interval'])){
            self::$interval = (int) $options['uucss_queue_interval'];
        }

        if(isset($options['uucss_jobs_per_queue'])){
            self::$job_count = (int) $options['uucss_jobs_per_queue'];
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

        $uucss_result_cron = $this->cron_exist('cron_uucss_process_result');

        if ( ! wp_next_scheduled( 'cron_uucss_process_result' ) && !$uucss_result_cron) {
            self::log([
                'log' => 'job result cron scheduled',
                'type' => 'uucss-cron'
            ]);
            wp_schedule_event( time(), 'uucss_cron_interval', 'cron_uucss_process_result');
        }

        add_action( 'cron_uucss_process_queue', [$this ,'uucss_process_queue'] );

        add_action( 'cron_uucss_process_result', [$this ,'uucss_process_result'] );

        add_action('wp_ajax_uucss_queue', [$this, 'queue_posts']);

        add_action('uucss_sitemap_queue', [$this, 'queue_sitemap'], 10, 1);

        $this->async = apply_filters('uucss/queue/async',false);

        self::$post_types = apply_filters('uucss/queue/post_types',array(
            'post',
            'page',
            'product',
        ));
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

    function queue_posts(){

    	if(!isset($_REQUEST['post_type'])) {
		    wp_send_json_error('post type not found');
	    }

        $post_type = sanitize_text_field($_REQUEST['post_type']);

        $posts = null;

        global $uucss;

        if($post_type == 'all'){

            $posts = new WP_Query(array(
                'post_type'=> self::$post_types,
	            'posts_per_page' => -1
            ));

        }else if($post_type == 'current'){

            UnusedCSS_Settings::clear_links(true);
            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'processing'){

            UnusedCSS_DB::requeue_jobs('processing');
            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'warnings'){

            UnusedCSS_DB::requeue_jobs('warnings');
            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'failed'){

            UnusedCSS_DB::requeue_jobs();
            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'url'){

            $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

            $url = $uucss->transform_url($url);

            if($url && !$uucss->is_url_allowed($url)){
                wp_send_json_error('url is excluded');
            }

            UnusedCSS_DB::add_link(array(
                'url' => trailingslashit($url),
                'status' => 'queued',
            ));
            wp_send_json_success('successfully link added to the queue');

        }else if($post_type == 'site_map'){

            $sitemap = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

            wp_schedule_single_event( time(), 'uucss_sitemap_queue', [
                'url' => $sitemap
            ] );
            spawn_cron();
            wp_send_json_success('sitemap links schedule to add queue');

        }else{

            $posts = new WP_Query(array(
                'post_type'=> $post_type,
                'posts_per_page' => -1
            ));

        }

        if($posts->have_posts()){
            while ($posts->have_posts()){
                $posts->the_post();

                $url = $uucss->transform_url(get_the_permalink(get_the_ID()));

                if(!UnusedCSS_DB::link_exists($url) && $uucss->is_url_allowed($url)){
                    UnusedCSS_DB::add_link(array(
                        'url' => $url,
                        'status' => 'queued',
                    ));
                }

            }
        }

        wp_reset_query();

        wp_send_json_success('successfully links added to the queue');

    }

    static function queue_sitemap($url = false){

        if(!$url){

            $url = apply_filters('uucss/sitemap/default', stripslashes(get_site_url(get_current_blog_id())) . '/sitemap_index.xml');
        }

        $site_map = new UnusedCSS_Sitemap();
        $urls = $site_map->process_site_map($url);

        global $uucss;

        if(isset($urls) && !empty($urls)){

            foreach ($urls as $url){

                if($uucss->is_url_allowed($url)){

                    UnusedCSS_DB::add_link(array(
                        'url' => $url,
                        'status' => 'queued',
                    ));
                }

            }
        }
    }

    static function get_post_types(){
        return self::$post_types;
    }

    function uucss_process_queue(){

        $links = UnusedCSS_DB::get_links_by_status(["'queued'"], self::$job_count);

        if(!empty($links)){

            foreach ($links as $link){

                UnusedCSS_DB::update_meta([
                    'status' => 'processing',
                    'job_id' => null
                ], $link->url);

                self::log([
                    'log' => 'status updated to processing',
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

    function uucss_process_result(){

        $links = UnusedCSS_DB::get_links_by_status(["'processing'"], self::$job_count);

        if(!empty($links)){

            foreach ($links as $link){

                $this->update_result($link->url, $link->job_id);

            }

        }

    }

    function cache($url){
        global $uucss;

        $post_id = url_to_postid($url);

        self::log([
            'log' => 'fetching job id',
            'url' => $url,
            'type' => 'uucss-cron'
        ]);

        $uucss_api = new UnusedCSS_Api();

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

    }

    public function update_result($url, $job_id){

        $this->log( [
            'log' => 'fetching data for job ' . $job_id,
            'url' => $url,
            'type' => 'store'
        ] );

        $uucss_api = new UnusedCSS_Api();

        $result = $uucss_api->get( 's/unusedcss/' . $job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            UnusedCSS_DB::update_failed($url, $uucss_api->extract_error( $result ));

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        $uucss_store = new UnusedCSS_Store(null, $url,null);

        if(isset($result->data) && count($result->data) > 0){

            $files = $uucss_store->cache_files($result->data);
            $uucss_store->add_link($files, $result);
            $uucss_store->uucss_cached();

        }else{

            $uucss_store->add_link(null, $result);
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
<?php


class UnusedCSS_Queue
{

    use UnusedCSS_Utils;
    public $interval = 600;
    public $job_count = 4;
    public $async = false;
    public static $post_types = [];

    function __construct()
    {
        $this->init();
    }

    function init(){

        $options = UnusedCSS_Autoptimize_Admin::fetch_options();

        if(isset($options['uucss_queue_interval'])){
            $this->interval = (int) $options['uucss_queue_interval'];
        }

        if(isset($options['uucss_jobs_per_queue'])){
            $this->job_count = (int) $options['uucss_jobs_per_queue'];
        }

        add_action('uucss_cron_run_cache', [$this, 'cache'], 2 , 1);

        add_filter( 'cron_schedules', [$this, 'uucss_process_queue_schedule'] );

        if ( ! wp_next_scheduled( 'cron_uucss_process_queue' ) ) {
            wp_schedule_event( time(), 'uucss_cron_interval', 'cron_uucss_process_queue');
        }

        add_action( 'cron_uucss_process_queue', [$this ,'uucss_process_queue'] );

        add_action('wp_ajax_uucss_queue', [$this, 'queue_posts']);

        $this->async = apply_filters('uucss/queue/async',false);

        self::$post_types = apply_filters('uucss/queue/post_types',array(
            'post',
            'page',
            'product',
        ));
    }

    function queue_posts(){

        $post_type = $_REQUEST['post_type'];

        if(!isset($post_type)){
            wp_send_json_error('post type not found');
        }

        $posts = null;

        if($post_type == 'all'){

            $posts = new WP_Query(array(
                'post_type'=> self::$post_types,
            ));

        }else{

            $posts = new WP_Query(array(
                'post_type'=> $post_type,
            ));

        }

        global $uucss;

        if($posts->have_posts()){
            while ($posts->have_posts()){
                $posts->the_post();

                $url = $uucss->transform_url(get_the_permalink(get_the_ID()));

                if(!UnusedCSS_DB::link_exists($url)){
                    UnusedCSS_DB::add_link(array(
                        'url' => $url,
                        'status' => 'queued',
                    ));
                }

            }
        }

        wp_reset_query();

        wp_send_json_success('posts added to queue');

    }

    static function get_post_types(){
        return self::$post_types;
    }

    function uucss_process_queue(){

        global $uucss;

        $links = UnusedCSS_DB::get_links_by_status(["'queued'"], $this->job_count);

        if(!empty($links)){

            foreach ($links as $link){

                UnusedCSS_DB::update_status('processing', $link->url);

                if($this->async){

                    wp_schedule_single_event( time(), 'uucss_cron_run_cache', [
                        'url'      => $link->url,
                    ] );

                }else{

                    $this->cache($link->url);

                }

            }

        }

    }

    function cache($url){
        global $uucss;

        $uucss->init_async_store( $uucss->provider, $url, $uucss->api_options() );
    }

    function uucss_process_queue_schedule($schedules){
        $schedules['uucss_cron_interval'] = array(
            'interval' => $this->interval,
            'display'  => __( 'uucss cron interval' ),
        );
        return $schedules;
    }
}
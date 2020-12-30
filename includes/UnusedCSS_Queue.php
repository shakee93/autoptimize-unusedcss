<?php


class UnusedCSS_Queue
{

    use UnusedCSS_Utils;
    public $interval = 30;
    public $job_count = 1;

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


    }

    function uucss_process_queue(){

        global $uucss;

        $links = UnusedCSS_DB::get_links_by_status(["'queued'"], $this->job_count);

        if(!empty($links)){

            foreach ($links as $link){
                UnusedCSS_Settings::add_link( $link->url, null, "processing", [] );
                wp_schedule_single_event( time(), 'uucss_cron_run_cache', [
                    'url'      => $link->url,
                ] );
                spawn_cron();
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
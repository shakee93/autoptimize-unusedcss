<?php


class UnusedCSS_Queue
{

    use UnusedCSS_Utils;

    function __construct()
    {
        $this->init();
    }

    function init(){

        add_filter( 'cron_schedules', [$this, 'uucss_process_queue_schedule'] );

        if ( ! wp_next_scheduled( 'cron_uucss_process_queue' ) ) {
            wp_schedule_event( time(), 'every_one_minute', 'cron_uucss_process_queue');
        }

        add_action( 'cron_uucss_process_queue', [$this ,'uucss_process_queue'] );
    }

    function uucss_process_queue(){

        global $uucss;

        $link = UnusedCSS_DB::get_links_by_status('queued');

        if(!empty($link)){

            $uucss->init_async_store( $uucss->provider, $link[0]->url, $uucss->api_options() );

            self::log('queued link ' . $link[0]->url . ' processed');

        }

    }

    function uucss_process_queue_schedule($schedules){
        $schedules['every_one_minute'] = array(
            'interval' => 60,
            'display'  => __( 'Every 1 minit' ),
        );
        return $schedules;
    }
}
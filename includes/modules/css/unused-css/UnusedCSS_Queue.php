<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Queue
{
    use RapidLoad_Utils;

    public function __construct()
    {
        if(RapidLoad_DB::$current_version < 1.3){
            return;
        }

        add_action('uucss/queue/task',[$this, 'fetch_job_id'], 10);
        add_action('uucss/queue/task',[$this, 'fetch_result'], 20);
    }

    function fetch_job_id(){

        $current_waiting = UnusedCSS_DB::get_task_count(" WHERE status = 'processing' OR status = 'waiting' AND job_type = 'uucss'" );

        if( (RapidLoad_Queue::$job_count - $current_waiting) <= 0 ){
            return;
        }

        global $wpdb;

        $links = UnusedCSS_DB::get_data(' job_id ', " WHERE status = 'queued' ", RapidLoad_Queue::$job_count - $current_waiting);

        if(!empty($links)){

            foreach ($links as $link){

                $job = RapidLoad_Job::find_or_fail($link->job_id);

                if($job){

                    $job_data = new RapidLoad_Job_Data($job, 'uucss');

                    $store = new UnusedCSS_Store($job_data, apply_filters('rapidload/purge/args', []));
                    $store->purge_css();

                }else{

                    UnusedCSS_DB::delete_by_job_id($link->job_id);

                }

            }

        }

    }

    function fetch_result(){

        $links = UnusedCSS_DB::get_data(' job_id ', " WHERE status = 'processing' OR status = 'waiting' ", RapidLoad_Queue::$job_count, 'queue_job_id');

        if(!empty($links)){

            foreach ($links as $link){

                $job = RapidLoad_Job::find_or_fail($link->job_id);

                if($job){

                    $job_data = new RapidLoad_Job_Data($job, 'uucss');

                    $store = new UnusedCSS_Store($job_data, []);
                    $store->update_css();

                }else{

                    UnusedCSS_DB::delete_by_job_id($link->job_id);

                }

            }

        }

    }
}
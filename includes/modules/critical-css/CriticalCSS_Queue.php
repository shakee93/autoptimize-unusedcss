<?php


class CriticalCSS_Queue
{
    use RapidLoad_Utils;

    public function __construct()
    {
        add_action('uucss/queue/task',[$this, 'fetch_job_id'], 10);
        add_action('uucss/queue/task',[$this, 'fetch_result'], 20);
    }

    function fetch_job_id(){

        $current_waiting = CriticalCSS_DB::get_data_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count);

        $links = CriticalCSS_DB::get_data_by_status(["'queued'"], (RapidLoad_Queue::$job_count - count($current_waiting)));

        if(!empty($links)){

            foreach ($links as $link){

                $job = RapidLoad_Job::find_or_fail($link->job_id);

                if($job){

                    $job_data = new RapidLoad_Job_Data($job, 'cpcss');

                    $store = new CriticalCSS_Store($job_data, []);
                    $store->purge_css();

                }else{

                    CriticalCSS_DB::delete_by_job_id($link->job_id);

                }

            }

        }

    }

    function fetch_result(){

        $links = CriticalCSS_DB::get_data_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count, 'queue_job_id');

        if(!empty($links)){

            foreach ($links as $link){

                $job = RapidLoad_Job::find_or_fail($link->job_id);

                if($job){

                    $job_data = new RapidLoad_Job_Data($job, 'cpcss');

                    $store = new CriticalCSS_Store($job_data, []);
                    $store->update_css();

                }else{

                    CriticalCSS_DB::delete_by_job_id($link->job_id);

                }

            }

        }

    }
}
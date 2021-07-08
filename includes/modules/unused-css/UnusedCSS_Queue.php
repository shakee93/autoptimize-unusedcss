<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Queue {

    use RapidLoad_Utils;

    public function __construct()
    {
        add_action('uucss/queue/task',[$this, 'fetch_job_id'], 10);
        add_action('uucss/queue/task',[$this, 'fetch_result'], 20);

    }

    function fetch_job_id(){

        $current_waiting = UnusedCSS_DB::get_data_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count);

        $data = UnusedCSS_DB::get_data_by_status(["'queued'"], (RapidLoad_Queue::$job_count - count($current_waiting)));

        if(!empty($data)){

            foreach ($data as $value){

                $this->cache($value->job_id);

            }

        }

    }

    function cache($id){

        $job = RapidLoad_Job::find_or_fail($id);

        $job_data = new RapidLoad_Job_Data($job, 'uucss');

        $url = isset($job->parent) ? $job->parent->url : $job->url;

        $post_id = url_to_postid($url);

        $job_data->status = "waiting";
        $job_data->save();

        self::log([
            'log' => 'fetching job id',
            'url' => $url,
            'type' => 'uucss-cron'
        ]);

        $result = rapidload()->api()->post( 's/unusedcss',
            array_merge( rapidload()->uucss->api_options($post_id),
                [ 'url' => $url ]
            ));

        if(rapidload()->api()->is_error($result)){

            $job_data->mark_as_failed(rapidload()->api()->extract_error( $result ));

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $job_data->queue_job_id = $result->id;
            $job_data->save();
        }

    }

    function fetch_result(){

        $data = UnusedCSS_DB::get_data_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count, 'queue_job_id');

        if(!empty($data)){

            foreach ($data as $value){

                $this->update_result($value->job_id, $value->queue_job_id);

            }

        }

    }

    function update_result($job_id, $queue_job_id){

        if(!$queue_job_id || $job_id){
            return;
        }

        $job = RapidLoad_Job::find_or_fail($job_id);

        $job_data = new RapidLoad_Job_Data($job, 'uucss');

        $url = isset($job->parent) ? $job->parent->url : $job->url;

        $this->log( [
            'log' => 'fetching data for job ' . $queue_job_id,
            'url' => $url,
            'type' => 'store'
        ] );

        $result = rapidload()->api()->get( 's/unusedcss/' . $queue_job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $error = rapidload()->api()->extract_error( $result );

            if(isset($error['message']) && $error['message'] == 'Job processing failed in queue'){

                $job_data->status = "queued";
                $job_data->save();

                $this->log( [
                    'log' => 're-queued due to allowed errors',
                    'url' => $url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            $job_data->mark_as_failed($error);
            $job_data->save();
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

            $job_data->mark_as_failed('Unknown error occurred');
            do_action( 'uucss/cache_cleared', [
                'url' => $url
            ]);
            return;
        }

        $uucss_store = new RapidLoad_Store(null, $job_data,null);

        if(isset($result->state)){

            if($result->state == 'waiting' || $result->state == 'delayed' || $result->state == 'created' || $result->state == 'stalling'){
                $job_data->status = "waiting";
                $job_data->save();
            }else if($result->state == 'active'){
                $job_data->status = "processing";
                $job_data->save();
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
}
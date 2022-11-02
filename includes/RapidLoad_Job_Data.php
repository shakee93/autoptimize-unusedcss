<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Job_Data{

    use RapidLoad_Utils;

    public $id;
    public $job_id;
    public $job_type;
    public $queue_job_id;
    public $data;
    public $stats;
    public $warnings;
    public $error;
    public $attempts;
    public $hits;
    public $status;
    public $created_at;

    public $job;

    public function __construct($job, $type)
    {
        $this->job = $job;
        $this->job_type = $type;

        $this->job_id = isset($this->job->parent) && $this->job->parent ? $this->job->parent->id : $this->job->id;

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->queue_job_id = $exist->queue_job_id;
            $this->data = $exist->data;
            $this->stats = $exist->stats;
            $this->warnings = $exist->warnings;
            $this->error = $exist->error;
            $this->attempts = $exist->attempts;
            $this->hits = $exist->hits;
            $this->status = $exist->status;
            $this->created_at = $exist->created_at;

        }else{

            $this->attempts = 0;
            $this->hits = 0;
            $this->status = 'queued';
            $this->created_at = date( "Y-m-d H:m:s", time() );

        }

    }

    public function save(){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);
        unset($data['job']);

        if(isset($this->id)){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_job_data',
                $data,
                [
                    'id' => $this->id
                ]
            );

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_job_data',
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

            }

        }

    }

    public function exist(){

        global $wpdb;

        return $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = '". $this->job_type ."' AND job_id = '" . $this->job_id . "' ORDER BY id LIMIT 1", OBJECT);

    }

    public function requeue($attempts = -1){
        $this->status = 'queued';
        $this->queue_job_id = null;
        $this->attempts = $attempts >= 0 ? $attempts : $this->attempts + 1;
        $this->data = null;
        $this->hits = 0;
        $this->stats = null;
        $this->warnings = null;
        $this->error = null;
        $this->created_at = date( "Y-m-d H:m:s", time() );
        $this->clearFiles();
    }

    public function clearFiles(){

    }

    public function mark_as_failed($error){
        $this->data = null;
        $this->status = 'failed';
        $this->error = serialize($error);
        $this->hits = 0;
        $this->clearFiles();
    }

    public function mark_as_success($data, $stats, $warnings){
        $this->data = isset($data) ? is_string($data) ? $data : serialize($data) : null;
        $this->status = 'success';
        $this->hits = 0;
        $this->stats = isset($stats) ? serialize($stats) : null;
        $this->warnings = isset($warnings) && count($warnings) > 0 ? $warnings : null;
        $this->error = null;
    }

    public function mark_as_successful_hit(){
        $this->hits++;
        $this->error = NULL;
    }

    public function get_warnings(){
        if(isset($this->warnings)){
            return $this->warnings;
        }
        return [];
    }

    public function get_files(){
        if(isset($this->data) && !empty($this->data)){
            return unserialize($this->data);
        }
        return [];
    }

    public function get_stats(){
        if(isset($this->stats) && !empty($this->stats)){
            return unserialize($this->stats);
        }
        return [];
    }

    public static function find_or_fail($id, $job_type){
        global $wpdb;
        $job_data = false;

        $exist = $wpdb->get_row("SELECT job_id FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = '". $job_type ."' AND id = '" . $id . "' ORDER BY id LIMIT 1", OBJECT);

        if($exist){
            $job = RapidLoad_Job::find_or_fail($exist->job_id);
            $job_data = new RapidLoad_Job_Data($job, $job_type);
        }

        return $job_data;
    }
}
<?php

defined( 'ABSPATH' ) or die();

abstract class UnusedCSS_Job
{
    use UnusedCSS_Utils;

    static $table;
    public $type;

    public $id;
    public $job_id;
    public $url;
    public $rule;
    public $stats;
    public $files;
    public $warnings;
    public $review;
    public $error;
    public $attempts;
    public $hits;
    public $status;
    public $created_at;

    public function __construct($args)
    {
        $this->init($args);
    }

    abstract public function init($args);

    abstract public function save();

    public function get_files(){
        if(isset($this->files)){
            return unserialize($this->files);
        }
        return [];
    }

    public function get_warnings(){
        if(isset($this->warnings)){
            return unserialize($this->warnings);
        }
        return [];
    }

    public function get_stats(){
        if(isset($this->stats)){
            return unserialize($this->stats);
        }
        return null;
    }

    public function is_type($type){
        return $type == $this->type;
    }

    public function requeue(){
        $this->status = 'queued';
        $this->attempts++;
        $this->hits = 0;
        $this->created_at = date( "Y-m-d H:m:s", time() );
    }

    public function mark_as_success($files, $stats, $warnings){
        $this->files = isset($files) ? serialize($files) : null;
        $this->status = 'success';
        $this->hits = 0;
        $this->stats = isset($stats) ? serialize($stats) : null;
        $this->warnings = isset($warnings) && count($warnings) > 0 ? serialize($warnings) : null;
        $this->error = null;
    }

    public function mark_as_failed($error){
        $this->files = null;
        $this->status = 'failed';
        $this->error = serialize($error);
        $this->hits = 0;
    }

    public function mark_as_successful_hit(){
        $this->attempts = 0;
        $this->hits++;
        if(UnusedCSS_DB::$current_version < 1.2){
            $stats = $this->get_stats();
            if(isset($stats)){
                if(!isset($stats->success_count)){
                    $stats->success_count = 1;
                }else{
                    $stats->success_count++;
                }
            }
            $this->stats = isset($stats) ? serialize($stats) : null;
        }
    }

    public function set_warnings($warnings){
        if(isset($warnings) && count($warnings) > 0){
            $this->hits = 0;
            $this->warnings = serialize($warnings);
        }
    }
}
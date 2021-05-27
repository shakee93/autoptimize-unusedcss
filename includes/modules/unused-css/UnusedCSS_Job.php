<?php

defined( 'ABSPATH' ) or die();

abstract class UnusedCSS_Job
{
    use RapidLoad_Utils;

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

    abstract public function clearFiles();

    public function get_files(){
        if(isset($this->files)){
            return unserialize($this->files);
        }
        return [];
    }

    public function get_warnings(){
        if(isset($this->warnings)){
            return $this->warnings;
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
        $this->files = null;
        $this->hits = 0;
        $this->stats = null;
        $this->warnings = null;
        $this->error = null;
        $this->created_at = date( "Y-m-d H:m:s", time() );
        $this->clearFiles();
    }

    public function mark_as_success($files, $stats, $warnings){
        $this->files = isset($files) ? serialize($files) : null;
        $this->status = 'success';
        $this->hits = 0;
        $this->stats = isset($stats) ? serialize($stats) : null;
        $this->warnings = isset($warnings) && count($warnings) > 0 ? $warnings : null;
        $this->error = null;
    }

    public function mark_as_failed($error){
        $this->files = null;
        $this->status = 'failed';
        $this->error = serialize($error);
        $this->hits = 0;
        $this->clearFiles();
    }

    public function remove_file_missing_warnings(){

        if(!isset($this->warnings)){
            return;
        }

        $warnings = [];

        foreach ($this->warnings as $warning){

            if(isset($warning['message']) && $warning['message'] == 'RapidLoad optimized version for the file missing.'){
                continue;
            }

            array_push($warnings, $warning);
        }

        if(count($warnings) > 0){
            $this->set_warnings($warnings);
        }else{
            $this->warnings = null;
        }

    }

    public function mark_as_successful_hit(){
        $this->attempts = 0;
        $this->hits++;
        $this->remove_file_missing_warnings();
        $this->error = NULL;
        if(RapidLoad_DB::$current_version < 1.2){
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
            $this->warnings = $warnings;
        }else{
            $this->warnings = null;
        }
    }

    public function reset_success_hits(){
        $this->hits = 0;
        if(RapidLoad_DB::$current_version < 1.2){
            $stats = $this->get_stats();
            if(isset($stats)){
                $stats->success_count = 0;
            }
            $this->stats = isset($stats) ? serialize($stats) : null;
        }
    }

    public function add_warning($warning){
        if(!isset($this->warnings)){
            $this->warnings = [];
        }
        $this->warnings[] = $warning;
    }
}
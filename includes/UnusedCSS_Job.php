<?php

defined( 'ABSPATH' ) or die();

abstract class UnusedCSS_Job
{
    use UnusedCSS_Utils;

    static $table;

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
    public $ignore_rule;
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
}
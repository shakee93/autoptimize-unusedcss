<?php

defined( 'ABSPATH' ) or die();

abstract class CriticalCSS_Job
{
    use RapidLoad_Utils;

    public $type;

    public $id;
    public $job_id;
    public $url;
    public $rule;
    public $critical_css;
    public $exceptional_css;
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

    public function is_type($type){
        return $type == $this->type;
    }

}
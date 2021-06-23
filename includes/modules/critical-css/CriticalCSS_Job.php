<?php

namespace RapidLoad\Service;

abstract class CriticalCSS_Job
{
    use \RapidLoad_Utils;

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
        $this->job_init($args);
        $this->init($args);
    }

    function job_init($args){
        $job = new \RapidLoad_Job([
            'url' => isset($args['url']) ? $args['url'] : null,
            'rule' => isset($args['rule']) ? $args['rule'] : null,
            'regex' => isset($args['regex']) ? $args['regex'] : null
        ], strtolower($this->type));

        $job->save();
        $this->url_id = $job->id;
    }

    abstract public function init($args);

    abstract public function save();

    public function is_type($type){
        return $type == $this->type;
    }

    public function requeue(){
        $this->status = 'queued';
        $this->attempts++;
        $this->critical_css = null;
        $this->exceptional_css = null;
        $this->hits = 0;
        $this->warnings = null;
        $this->error = null;
        $this->created_at = date( "Y-m-d H:m:s", time() );
        //$this->clearFiles();
    }

    public function mark_as_failed($error){
        $this->critical_css = null;
        $this->exceptional_css = null;
        $this->status = 'failed';
        $this->error = serialize($error);
        $this->hits = 0;
        //$this->clearFiles();
    }

    public function mark_as_success($critical_css, $exceptional_css = null, $warnings = null){
        $this->critical_css = $critical_css;
        $this->exceptional_css = $exceptional_css;
        $this->status = 'success';
        $this->hits = 0;
        $this->warnings = isset($warnings) && count($warnings) > 0 ? $warnings : null;
        $this->error = null;
    }

}
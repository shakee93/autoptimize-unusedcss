<?php

class RapidLoad_HTML_Minifier
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['rapidload_minify_html']) || $this->options['rapidload_minify_html'] == ""){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'minify_html'], 90, 2);

    }

    public function minify_html($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_html'] )){
            return false;
        }

        new RapidLoad_HTML_Minifier_Enqueue($job);

    }
}
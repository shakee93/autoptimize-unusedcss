<?php

class RapidLoad_Font
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_font_optimization'])){
            //return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_font'], 30, 2);
    }

    public function optimize_font($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_image'] )){
            return false;
        }

        new RapidLoad_Font_Enqueue($job);

    }
}
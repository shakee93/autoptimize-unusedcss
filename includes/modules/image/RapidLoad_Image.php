<?php

class RapidLoad_Image
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_image_delivery'])){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_image'], 30, 2);

    }

    public function optimize_image($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_image'] )){
            return false;
        }

        new RapidLoad_Image_Enqueue($job);

    }
}
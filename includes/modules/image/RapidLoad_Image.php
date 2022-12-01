<?php

class RapidLoad_Image
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_image_delivery'])){
            //return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_image'], 30, 2);

    }

    public function optimize_image($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_image'] )){
            return false;
        }

        new RapidLoad_Image_Enqueue($job);

    }

    public static function get_replaced_url($url, $cdn, $width = false, $height = false )
    {

        $options = 'q_lossy+to_auto+ret_img';

        if($width && $height){

            $options .= '+w_' . $width . '+h_' . $height;
        }

        return $cdn . $options . '/' . $url;
    }

}
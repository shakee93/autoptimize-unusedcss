<?php

class RapidLoad_CDN
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        if(!isset($this->options['uucss_enable_cdn'])){
            //return;
        }

        add_filter('uucss/enqueue/cache-file-url/cdn', [$this, 'replace_cdn'], 30);
    }

    public function replace_cdn($url){
        error_log($url);
        return $url;
    }
}
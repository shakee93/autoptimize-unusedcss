<?php

class RapidLoad_CDN
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_cdn'])){
            return;
        }

        add_filter('uucss/enqueue/cache-file-url/cdn', [$this, 'replace_cdn'], 30);
    }

    public function replace_cdn($url){

        if(isset($this->options['uucss_cdn_url']) && !empty($this->options['uucss_cdn_url'])){
             return trailingslashit($this->options['uucss_cdn_url']);
        }

        return $url;
    }


}
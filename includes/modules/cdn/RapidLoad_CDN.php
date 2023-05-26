<?php

class RapidLoad_CDN
{
    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_cdn']) || $this->options['uucss_enable_cdn'] == ""){
            return;
        }

        //add_filter('uucss/enqueue/cache-file-url/cdn', [$this, 'replace_cdn'], 30);

        add_action('rapidload/job/handle', [$this, 'replace_cdn_html'], 40, 2);

        add_filter('uucss/enqueue/cdn', [$this, 'replace_cdn_url'], 30);

        add_action('rapidload/vanish', [ $this, 'vanish' ]);

    }

    public function vanish(){

        $api = new RapidLoad_Api();

        if($this->options['uucss_cdn_zone_id'] && !empty($this->options['uucss_cdn_zone_id'])){
            $result = $api->post('purge-cdn/' . $this->options['uucss_cdn_zone_id']);
        }

    }

    public function replace_cdn_url($url){

        $cdn = '';

        if($this->is_cdn_enabled()){
            $cdn = $this->options['uucss_cdn_url'];
        }

        $parsed_url = parse_url($url);

        if($parsed_url['path'] && !empty($cdn)){
            return untrailingslashit($cdn) . $parsed_url['path'];
        }

        return $url;
    }

    public function replace_cdn($url){

        if($this->is_cdn_enabled()){
            return trailingslashit($this->options['uucss_cdn_url']);
        }

        return $url;
    }

    public function replace_cdn_html($job){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_cdn'] )){
            return false;
        }

        if(!$this->is_cdn_enabled()){
            return false;
        }

        new RapidLoad_CDN_Enqueue($job);
    }

    public function is_cdn_enabled(){
        return isset($this->options['uucss_cdn_url']) && !empty($this->options['uucss_cdn_url'])
            && isset($this->options['uucss_cdn_dns_id']) && !empty($this->options['uucss_cdn_dns_id'])
            && isset($this->options['uucss_cdn_zone_id']) && !empty($this->options['uucss_cdn_zone_id']);
    }

}
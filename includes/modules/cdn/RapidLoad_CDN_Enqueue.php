<?php

class RapidLoad_CDN_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 90);
    }

    public function update_content($state){

        if(isset($state['dom'])){
            $this->dom = $state['dom'];
        }

        if(isset($state['inject'])){
            $this->inject = $state['inject'];
        }

        if(isset($state['options'])){
            $this->options = $state['options'];
        }

        $links = $this->dom->find( 'link' );

        foreach ($links as $link){

            if($this->str_contains($link->href, site_url())){

                if($this->is_cdn_enabled()){
                    $link->href = str_replace(trailingslashit(site_url()),trailingslashit($this->options['uucss_cdn_url']),$link->href);
                }

            }

        }

        $scripts = $this->dom->find( 'script' );

        foreach ($scripts as $script){

            if($this->str_contains($script->src, site_url())){

                if($this->is_cdn_enabled()){
                    $script->src = str_replace(trailingslashit(site_url()),trailingslashit($this->options['uucss_cdn_url']),$script->src);
                }

            }

        }

        return $state;

    }

    public function is_cdn_enabled(){
        return isset($this->options['uucss_cdn_url']) && !empty($this->options['uucss_cdn_url'])
            && isset($this->options['uucss_cdn_dns_id']) && !empty($this->options['uucss_cdn_dns_id'])
            && isset($this->options['uucss_cdn_zone_id']) && !empty($this->options['uucss_cdn_zone_id']);
    }
}
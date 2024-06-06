<?php

class RapidLoad_CDN_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $strategy;

    private $frontend_data = [];

    public function __construct($job)
    {
        $this->job = $job;

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 80);
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

        if(isset($state['strategy'])){
            $this->strategy = $state['strategy'];
        }

        $links = $this->dom->find( 'link' );

        foreach ($links as $link){

            if(isset($link->rel) && $link->rel == "canonical"){
                continue;
            }

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

        $images = $this->dom->find( 'img' );

        foreach ($images as $image){

            if($this->str_contains($image->src, RapidLoad_Image::$image_indpoint)){
                continue;
            }

            if($this->str_contains($image->src, site_url())){

                if($this->is_cdn_enabled()){
                    $image->src = str_replace(trailingslashit(site_url()),trailingslashit($this->options['uucss_cdn_url']),$image->src);
                }

            }

        }

        $head = $this->dom->find('head', 0);
        $preconnect = '<link href="' . $this->options['uucss_cdn_url'] . '" rel="preconnect" crossorigin>';
        $first_child = $head->first_child();
        $first_child->__set('outertext', $preconnect . $first_child->outertext);

        add_filter('rapidload/optimizer/frontend/data', function ($data){
            return array_merge($data,['cdn' => 'enabled']);
        });

        return [
            'dom' => $this->dom,
            'inject' => $this->inject,
            'options' => $this->options,
            'strategy' => $this->strategy
        ];

    }

    public function is_cdn_enabled(){
        return isset($this->options['uucss_cdn_url']) && !empty($this->options['uucss_cdn_url'])
            && isset($this->options['uucss_cdn_dns_id']) && !empty($this->options['uucss_cdn_dns_id'])
            && isset($this->options['uucss_cdn_zone_id']) && !empty($this->options['uucss_cdn_zone_id']);
    }
}
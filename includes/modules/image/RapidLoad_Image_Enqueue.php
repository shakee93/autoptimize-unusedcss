<?php

class RapidLoad_Image_Enqueue
{
    use RapidLoad_Utils;

    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $file_system;
    private $settings;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 40);
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

        $images = $this->dom->find( 'img[src]' );

        foreach ( $images as $img ) {

            error_log($img->src);

        }

        $inline_styles = $this->dom->find( "style" );

        foreach ( $inline_styles as $style ) {

            error_log($style->innertext);

        }

    }
}
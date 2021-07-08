<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Enqueue {

    private $dom;
    private $inject;
    private $options;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();
        add_filter('uucss/enqueue/content', [$this, 'the_content'], 10, 1);
    }

    function the_content($html){

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
            self::log( 'Dom parser not loaded' );
            return $html;
        }

        $this->dom = new \simplehtmldom\HtmlDocument(
            null,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        $this->dom->load(
            $html,
            false,
            false,
            \simplehtmldom\DEFAULT_TARGET_CHARSET,
            false
        );

        if ( $this->dom ) {

            $this->before_enqueue();

            $state = apply_filters('uucss/enqueue/content/update',[
                'dom' => $this->dom,
                'inject' => $this->inject,
                'options' => $this->options
            ]) ;

            if(isset($state['dom'])){
                $this->dom = $state['dom'];
            }

            if(isset($state['inject'])){
                $this->inject = $state['inject'];
            }

            if(isset($state['options'])){
                $this->options = $state['options'];
            }

            $this->after_enqueue();

            return $this->dom;
        }

        return $html;
    }

    public function before_enqueue(){

        $this->inject = (object) [
            "parsed_html"           => false,
            "found_sheets"          => false,
            "found_css_files"       => [],
            "found_css_cache_files" => [],
            "ao_optimized_css" => [],
            "injected_css_files"    => [],
            "successfully_injected"    => true,
        ];

        $this->inject->parsed_html = true;

        $this->dom->find( 'html' )[0]->uucss = true;
    }

    public function after_enqueue(){

        if($this->inject->successfully_injected){
            $this->dom->find( 'body' )[0]->uucss = true;
        }

        header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $this->inject->found_css_files ) . count( $this->inject->found_css_cache_files ) . count( $this->inject->injected_css_files ) . ']' );
    }

}
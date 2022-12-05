<?php

class MinifyCSS_Enqueue
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

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 50);
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

        foreach ( $links as $link ) {


            $this->minify_css($link);

        }

        $styles = $this->dom->find( 'style' );

        foreach ($styles as $style){

            $this->minify_inline_css($style);

        }

        return $state;
    }

    public function minify_css($link){

        if(!self::is_css($link) || $this->is_file_excluded($this->options, $link->href)){
            return;
        }

        $file_path = self::get_file_path_from_url($link->href);

        if(!$file_path){
            return;
        }

        $version = substr(hash_file('md5', $file_path), 0, 12);

        $filename = basename(preg_replace('/\?.*/', '', $link->href));

        if(!$filename){
            return;
        }

        if($this->str_contains($filename, ".min.css")){
            $filename = str_replace(".min.css","-{$version}.rapidload.min.css", $filename);
        }else if($this->str_contains($filename, ".css")){
            $filename = str_replace(".css","-{$version}.rapidload.min.css", $filename);
        }

        $minified_file = MinifyCSS::$base_dir . '/' . $filename;
        $minified_url = apply_filters('uucss/enqueue/css-minified-url', $filename);

        $file_exist = $this->file_system->exists($minified_file);

        if(!$file_exist){
            $minifier = new \MatthiasMullie\Minify\CSS($file_path);
            $minifier->minify($minified_file);

        }

        $link->href = $minified_url;

    }

    public function minify_inline_css($style){

        $version = substr(md5($style->innertext), 0, 12);

        $filename = $version . 'rapidload.min.css';

        $minified_file = MinifyCSS::$base_dir . '/' . $filename;

        $file_exist = $this->file_system->exists($minified_file);

        if(!$file_exist){
            $minifier = new \MatthiasMullie\Minify\CSS();
            $minifier->add($style->innertext);
            $minifier->minify($minified_file);

        }

        if($this->file_system->exists($minified_file)){
            $style->__set('innertext',file_get_contents($minified_file));
        }
    }

    private static function is_css( $el ) {
        return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
    }
}
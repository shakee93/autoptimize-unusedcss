<?php

use MatthiasMullie\Minify;

class Javascript_Enqueue
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

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 60);
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

        global $post;

        if(isset($post->ID)){

            $this->settings = get_post_meta($post->ID, 'rapidload_js_settings');

            if(isset($this->settings[0])){

                $this->settings = $this->settings[0];

            }

        }

        $links = $this->dom->find( 'script' );

        foreach ( $links as $link ) {

            if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){
                $this->load_scripts_on_user_interaction($link);
            }

            $this->minify_js($link);

            $this->optimize_js_delivery($link);

        }

        if(isset($this->options['delay_javascript']) && $this->options['delay_javascript'] == "1"){
            $body = $this->dom->find('body', 0);
            $node = $this->dom->createElement('script', "document.addEventListener('DOMContentLoaded',function(event){
                ['mousemove', 'touchstart', 'keydown'].forEach(function (event) {
                    var listener = function () {
                        removeEventListener(event, listener);
                        document.querySelectorAll('[data-rapidload-src]').forEach(function(el){ el.setAttribute('src', el.getAttribute('data-rapidload-src')) })
                        Array.from(document.getElementsByTagName('noscript')).forEach(function(e){
                            var tag = e.getAttribute('data-rapidload-delayed');
                            if(tag !== null && tag !== undefined) {
                                var newScript = document.createElement('script');
                                var inlineScript = document.createTextNode(e.innerHTML);
                                newScript.appendChild(inlineScript);
                                e.parentNode.insertBefore(newScript, e);
                            }}
                        );
                    }
                    addEventListener(event, listener);
                });
            });");

            $node->setAttribute('type', 'text/javascript');
            $body->appendChild($node);
        }

        return $state;
    }

    public function load_scripts_on_user_interaction($link){

        if(!isset($link->src) || self::is_file_excluded($link->src)){
            return;
        }

        if(self::is_load_on_user_interaction($link->src)){
            $data_attr = "data-rapidload-src";
            $link->{$data_attr} = $link->src;
            unset($link->src);
        }

    }

    public function minify_js($link){

        if(!isset($this->options['minify_js'])){
            return;
        }

        if(!self::is_js($link) || self::is_file_excluded($link->src)){
            return;
        }

        $file_path = self::get_file_path_from_url($link->src);

        if(!file_exists($file_path)){
            return;
        }

        $version = "";

        if(is_file($file_path)){
            $version = substr(hash_file('md5', $file_path), 0, 12);
        }

        if(!$file_path){
            return;
        }

        $filename = basename(preg_replace('/\?.*/', '', $link->src));

        if(!$filename){
            return;
        }

        if($this->str_contains($filename, ".min.js")){
            $filename = str_replace(".min.js","-{$version}.rapidload.min.js", $filename);
        }else if($this->str_contains($filename, ".js" )){
            $filename = str_replace(".js","-{$version}.rapidload.min.js", $filename);
        }

        $minified_file = JavaScript::$base_dir . '/' . $filename;
        $minified_url = apply_filters('uucss/enqueue/js-minified-url', $filename);

        $file_exist = $this->file_system->exists($minified_file);

        if(!$file_exist){

            $minifier = new \MatthiasMullie\Minify\JS($file_path);
            $minifier->minify($minified_file);

        }

        $link->setAttribute('src', $minified_url);

    }

    public function optimize_js_delivery($link){

        $method = false;

        if(!isset($link->type)){
            $link->type = 'text/javascript';
        }

        if(apply_filters('rapidload/webfont/handle', false, $link)){
            return;
        }

        if(isset($this->settings['js_files'])){

            $key = array_search($link->src, array_column($this->settings['js_files'], 'url'));

            if(isset($key) && is_numeric($key)){
                $method = $this->settings['js_files'][$key]['action'];
            }
        }

        if((!$method || $method == 'none') && isset($this->options['uucss_load_js_method'])){
            $method = $this->options['uucss_load_js_method'];
        }

        if($method){
            switch ($method){
                case 'defer' : {
                    if(self::is_js($link) && !self::is_file_excluded($link->src) && !self::is_file_excluded($link->src, 'uucss_excluded_js_files_from_defer')){
                        $link->defer = true;
                        unset($link->async);
                    }else if(self::is_inline_script($link) && isset($this->options['defer_inline_js'])){
                        if(isset($link->{"data-rapidload-delayed"})){
                            unset($link->{"data-rapidload-delayed"});
                            $link->__set('outertext',"<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");
                        }else{
                            $inner_text = $link->innertext();
                            if(!empty($inner_text)){
                                $link->__set('outertext','<script ' . ( $link->id ? 'id="' . $link->id . '"' : '' ) .' type="text/javascript" src="data:text/javascript;base64,' . base64_encode($inner_text) . '" defer></script>');
                            }
                        }
                    }else{
                        if(isset($link->{"data-rapidload-delayed"})){
                            unset($link->{"data-rapidload-delayed"});
                            $link->__set('outertext',"<noscript data-rapidload-delayed>" . $link->innertext() . "</noscript>");
                        }
                    }
                    break;
                }
                case 'on-user-interaction' : {
                    if(self::is_js($link) && !self::is_file_excluded($link->src)){
                        $data_attr = "data-rapidload-src";
                        $link->{$data_attr} = $link->src;
                        unset($link->src);
                    }
                    break;
                }
                default:{

                }
            }
        }

    }

    private static function is_js( $el ) {
        return !empty($el->src) && strpos($el->src,".js");
    }

    private static function is_inline_script( $el ) {
        return !empty($el->type) && $el->type == "text/javascript" && !isset($el->src);
    }

    private function is_file_excluded($file, $option_name = 'uucss_excluded_js_files'){

        $exclude_files = isset($this->options[$option_name]) && !empty($this->options[$option_name]) ? explode("\n", $this->options[$option_name]) : [];

        $excluded = false;

        foreach ($exclude_files as $exclude_file){

            $exclude_file = str_replace("\r", "", $exclude_file);

            if(self::is_regex_expression($exclude_file)){

                $excluded = preg_match($exclude_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $exclude_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }

    private function is_load_on_user_interaction($file){

        $files = isset($this->options['uucss_load_scripts_on_user_interaction']) && !empty($this->options['uucss_load_scripts_on_user_interaction']) ? explode("\n", $this->options['uucss_load_scripts_on_user_interaction']) : [];

        $excluded = false;

        foreach ($files as $_file){

            $_file = str_replace("\r", "", $_file);

            if(self::is_regex_expression($_file)){

                $excluded = preg_match($_file, $file);

            }

            if(!$excluded){

                $excluded = $this->str_contains($file, $_file);

            }

            if($excluded){

                break;
            }

        }

        return $excluded;
    }
}
<?php

use MatthiasMullie\Minify;

class Javascript_Enqueue
{
    use RapidLoad_Utils;

    private $job_data = [];
    private $job = null;

    private $dom;
    private $inject;
    private $options;
    private $tobe_minified = [];
    private $file_system;

    public function __construct($job)
    {
        $this->job = $job;
        $this->file_system = new RapidLoad_FileSystem();

        add_filter('uucss/enqueue/content/update', [$this, 'update_content'], 20);
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

            $settings = get_post_meta($post->ID, 'rapidload_js_settings');

            if(isset($settings[0])){

                $settings = $settings[0];

            }

        }

        $links = $this->dom->find( 'script' );

        foreach ( $links as $link ) {

            $this->minify_js($link);

            $this->optimize_js_delivery($link);

        }

        $body = $this->dom->find('body', 0);
        $node = $this->dom->createElement('script', "document.addEventListener('DOMContentLoaded',function(event){['mousemove', 'touchstart', 'keydown'].forEach(function (event) {var listener = function () { document.querySelectorAll('[data-rapidload-src]').forEach(function(el){ el.setAttribute('src', el.getAttribute('data-rapidload-src'))})
                    removeEventListener(event, listener);
                    } 
                    addEventListener(event, listener);
                    });
                });");

        $node->setAttribute('type', 'text/javascript');
        $body->appendChild($node);

        if(!empty($this->tobe_minified)){

            do_action('rapidload/js/minify', $this->job_data, $this->tobe_minified);

        }

        return $state;
    }

    public function minify_js($link){

        if(!isset($this->options['minify_js'])){
            return;
        }

        if(!self::is_js($link) || self::is_file_excluded($link->src)){
            return;
        }

        $filename = md5($link->src) . '-minified.js';
        $minified_file = JavaScript::$base_dir . '/' . $filename;
        $minified_url = apply_filters('uucss/enqueue/js-minified-url', $filename);

        $file_exist = $this->file_system->exists($minified_file);

        if(!$file_exist){

            $file_path = $this->get_file_path_from_url($link->src);
            if($file_path){
                $minifier = new \MatthiasMullie\Minify\JS($file_path);
                $minifier->minify($minified_file);
            }

        }

        $link->src = $minified_url;

    }

    public function optimize_js_delivery($link){

        $method = false;

        if(isset($settings['js_files'])){

            $key = array_search($link->src, array_column($settings['js_files'], 'url'));

            if(isset($key) && is_numeric($key)){
                $method = $settings['js_files'][$key]['action'];
            }
        }

        if(!$method || $method == 'none'){
            $method = $this->options['uucss_load_js_method'];
        }

        if($method){

            switch ($method){

                case 'defer' : {

                    if(self::is_js($link) && !self::is_file_excluded($link->src)){

                        $link->defer = true;
                        unset($link->async);

                    }else if(self::is_inline_script($link)){

                        $parent = $link->parent;
                        $script = $this->dom->createElement('script', "");

                        $script->setAttribute('type', 'text/javascript');
                        $script->setAttribute('src', 'data:text/javascript,'.  rawurlencode($link->innertext()));
                        $script->setAttribute('defer', true);
                        $parent->appendChild($script);
                        $link->remove();

                    }

                    break;
                }
                case 'on_user_interaction' : {
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
        return !empty($el->src);
    }

    private static function is_inline_script( $el ) {
        return !empty($el->type) && $el->type == "text/javascript";
    }

    private function is_file_excluded($file){

        $exclude_files = isset($this->options['uucss_excluded_js_files']) && !empty($this->options['uucss_excluded_js_files']) ? explode("\n", $this->options['uucss_excluded_js_files']) : [];

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
}
<?php

namespace RapidLoad\Service;

abstract class CriticalCSS{

    public function __construct()
    {
        add_filter('uucss/path/critical-css', [$this, 'get_path_critical_css'], 10, 2);
    }

    public function get_path_critical_css($critical_css, $url){

        if(CriticalCSS_DB::path_ccss_exist($url)){

            $path = new CriticalCSS_Path([
                'url' => $url
            ]);
            if(isset($path->critical_css)){
                $critical_css = $path->critical_css;
            }

        }

        return $critical_css;
    }

    public function api_options( $post_id = false ) {

        $cacheBusting = false;

        if(isset($this->options['uucss_cache_busting_v2'])){

            $cacheBusting = apply_filters('uucss/cache/bust',[]);

        }

        return apply_filters('uucss/api/options', [
            "cacheBusting"          => $cacheBusting,
        ]);
    }
}
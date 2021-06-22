<?php

namespace RapidLoad\Service;

abstract class CriticalCSS{

    use \RapidLoad_Utils;

    public static $base_dir;

    public function __construct()
    {

        self::$base_dir = \RapidLoad_Admin::$base_dir . 'cpcss';

        if ( ! rapidload()->admin()->initFileSystem('cpcss') ) {
            self::add_admin_notice( 'RapidLoad : couldn\'t access wordpress cache directory <b>(' . self::$base_dir . ')</b>. check for file permission issues in your site.' );

            return;
        }

        add_filter('uucss/path/critical-css', [$this, 'get_path_critical_css'], 10, 2);

        new CriticalCSS_Queue();
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
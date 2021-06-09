<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base{

    public static function init(){

    }

    public static function fetch_options()
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);

        }
        return get_site_option( 'autoptimize_uucss_settings', false );
    }

    public static function critical_css_enabled(){
        $options = self::fetch_options();
        return isset($options['cpcss_enable_critical_css']) &&
            $options['cpcss_enable_critical_css'] == "1";
    }
}
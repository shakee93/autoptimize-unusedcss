<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Base
{
    public static function init(){

        new RapidLoad_Buffer();

        global $uucss;

        $provider_class = defined('RAPIDLOAD_PROVIDER') ? RAPIDLOAD_PROVIDER : UnusedCSS_Autoptimize::class;

        if(class_exists($provider_class)){

            $uucss = new $provider_class();

            RapidLoad_ThirdParty::initialize();

        }

    }

    public static function fetch_options()
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);

        }
        return get_site_option( 'autoptimize_uucss_settings', false );
    }

    public static function get_option($name, $default)
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), $name, $default);

        }
        return get_site_option( $name, $default );
    }

    public static function update_option($name, $default)
    {
        if(is_multisite()){

            return update_blog_option(get_current_blog_id(), $name, $default);

        }
        return update_site_option( $name, $default );
    }

    public static function uucss_activate() {
        $default_options = [
            'uucss_load_original' => "1"
        ];
        self::update_option('autoptimize_uucss_settings', $default_options);
        add_option( 'uucss_do_activation_redirect', true );
    }
}
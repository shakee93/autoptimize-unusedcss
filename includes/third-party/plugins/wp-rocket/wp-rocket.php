<?php

defined( 'ABSPATH' ) or die();

class WP_Rocket_Compatible{

    use UnusedCSS_Utils;

    function __construct()
    {

        add_filter('uucss/cache/bust', [$this, 'add_cache_busting_params'], 10, 1);
        add_action( 'uucss/cached', [$this, 'flush_page_cache'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'flush_page_cache'], 10, 2 );

    }

    function add_cache_busting_params($cacheBusting){

        array_push($cacheBusting, [
            'type' => 'query',
            'rule' => 'nowprocket'
        ]);

        return $cacheBusting;
    }

    function flush_page_cache($args){

        if ( function_exists( 'rocket_clean_post' ) && function_exists( 'rocket_clean_domain' ) && function_exists( 'rocket_clean_home' ) ) {

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            $post_id = url_to_postid( $url );

            if(stripslashes($url) == stripslashes(home_url())){
                self::log([
                    'url' => $url,
                    'log' => 'wprocket home url page cache cleared',
                    'type' => 'purging'
                ]);
                rocket_clean_home();
            } else if ( $post_id ) {
                self::log([
                    'url' => $url,
                    'log' => 'wprocket post url page cache cleared',
                    'type' => 'purging'
                ]);
                rocket_clean_post( $post_id );
            } else {
                self::log([
                    'url' => $url,
                    'log' => 'wprocket domain cache cleared',
                    'type' => 'purging'
                ]);
                rocket_clean_domain();
            }

        }

    }

}











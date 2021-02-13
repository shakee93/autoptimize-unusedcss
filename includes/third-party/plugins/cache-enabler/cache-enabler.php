<?php

defined( 'ABSPATH' ) or die();

class Cache_Enabler_Compatible{

    use UnusedCSS_Utils;

    function __construct()
    {

        add_action( 'uucss/cached', [$this, 'flush_page_cache'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'flush_page_cache'], 10, 2 );

    }

    function flush_page_cache($args){

        if ( class_exists( 'Cache_Enabler' ) ) {

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            $post_id = url_to_postid( $url );

            if(stripslashes($url) == stripslashes(home_url())){
                self::log([
                    'url' => $url,
                    'log' => 'cache enabler home url page cache cleared',
                    'type' => 'purging'
                ]);
                Cache_Enabler::clear_page_cache_by_url( $url );
            } else if ( $post_id ) {
                self::log([
                    'url' => $url,
                    'log' => 'cache enabler post url page cache cleared',
                    'type' => 'purging'
                ]);
                Cache_Enabler::clear_page_cache_by_post_id( $post_id );
            } else {
                self::log([
                    'url' => $url,
                    'log' => 'cache enabler domain cache cleared',
                    'type' => 'purging'
                ]);
                Cache_Enabler::clear_site_cache();
            }

        }

    }
}




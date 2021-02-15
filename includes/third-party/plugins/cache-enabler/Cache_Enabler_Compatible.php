<?php

defined( 'ABSPATH' ) or die();

class Cache_Enabler_Compatible  extends RapidLoad_ThirdParty {

    function __construct(){

        $this->init_hooks();
    }

    public function init_hooks(){

        add_action( 'uucss/cached', [$this, 'purge_cache'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'purge_cache'], 10, 2 );

    }

    public function purge_cache($args){

        if ( class_exists( 'Cache_Enabler' ) ) {

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                self::log([
                    'url' => $url,
                    'log' => 'Cache Enabler url page cache cleared',
                    'type' => 'purging'
                ]);
                Cache_Enabler::clear_page_cache_by_url( $url );

            }

        }

    }
}




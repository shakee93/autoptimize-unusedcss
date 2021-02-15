<?php

defined( 'ABSPATH' ) || exit;

class LiteSpeed_Cache_Compatible  extends RapidLoad_ThirdParty{

    function __construct(){

        $this->init_hooks();
    }

    public function init_hooks(){

        add_action( 'uucss/cached', [$this, 'purge_cache'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'purge_cache'], 10, 2 );

    }

    public function purge_cache($args){

        if(class_exists('\LiteSpeed\Purge')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                self::log([
                    'url' => $url,
                    'log' => 'LS Cache url page cache cleared',
                    'type' => 'purging'
                ]);
                \LiteSpeed\Purge::purge_url($url);

            }

        }

    }
}
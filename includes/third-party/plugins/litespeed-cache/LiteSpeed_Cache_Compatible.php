<?php

defined( 'ABSPATH' ) || exit;

class LiteSpeed_Cache_Compatible  extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'litespeed-cache/litespeed-cache.php';
        $this->catgeory = 'cache';
        $this->name = 'lightspeed-cache';

        parent::__construct();
    }

    public function init_hooks(){

        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );

    }

    public function handle($args){

        if(class_exists('\LiteSpeed\Purge')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                \LiteSpeed\Purge::purge_url($url);
                self::log([
                    'url' => $url,
                    'log' => 'LS Cache url page cache cleared',
                    'type' => 'purging'
                ]);

            }

        }

    }

    public function is_mu_plugin()
    {
        return false;
    }
}
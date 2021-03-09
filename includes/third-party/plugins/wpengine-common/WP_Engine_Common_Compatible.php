<?php

defined( 'ABSPATH' ) || exit;

class WP_Engine_Common_Compatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'wpengine-common/dify-widget.php';
        $this->catgeory = 'cache';
        $this->name = 'wpengine-common';

        parent::__construct();
    }

    public function init_hooks()
    {
        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );
    }

    public function handle($args)
    {
        if(class_exists('WpeCommon')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                WpeCommon::purge_memcached();
                WpeCommon::clear_maxcdn_cache();
                WpeCommon::purge_varnish_cache();

            }

        }
    }
}
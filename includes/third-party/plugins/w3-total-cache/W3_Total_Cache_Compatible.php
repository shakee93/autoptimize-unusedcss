<?php

defined( 'ABSPATH' ) or die();

class W3_Total_Cache_Compatible extends RapidLoad_ThirdParty {

    function __construct(){

        $this->plugin = 'w3-total-cache/w3-total-cache.php';
        $this->catgeory = 'cache';
        $this->name = 'w3-total-cache';
        $this->has_conflict = true;

        parent::__construct();
    }

    public function init_hooks()
    {
        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );
    }

    public function handle($args)
    {
        if(function_exists('w3tc_flush_url')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                w3tc_flush_url( $url );

            }

        }
    }

    public function is_mu_plugin()
    {
        return false;
    }
}
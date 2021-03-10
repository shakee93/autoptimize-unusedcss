<?php

defined( 'ABSPATH' ) || exit;

class Kinsta_Cache_Compatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'kinsta-mu-plugins.php';
        $this->catgeory = 'cache';
        $this->name = 'kinsta-cache';

        parent::__construct();
    }

    public function is_mu_plugin(){
        return class_exists('Cache_Purge');
    }

    public function init_hooks()
    {
        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );
    }

    public function handle($args)
    {
        if(class_exists('Cache_Purge')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if($url){

                $cp = new Cache_Purge();
                $cp->purge_complete_caches();

            }

        }
    }
}
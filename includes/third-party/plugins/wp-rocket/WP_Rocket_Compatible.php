<?php

defined( 'ABSPATH' ) or die();

class WP_Rocket_Compatible extends RapidLoad_ThirdParty {

    function __construct(){

        $this->plugin = 'wp-rocket/wp-rocket.php';
        $this->catgeory = 'cache';
        $this->name = 'wp-rocket';

        parent::__construct();
    }

    public function init_hooks(){

        add_filter('uucss/cache/bust', [$this, 'add_cache_busting_params'], 10, 1);
        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );

    }

    public function add_cache_busting_params($cacheBusting){

        array_push($cacheBusting, [
            'type' => 'query',
            'rule' => 'nowprocket'
        ]);

        return $cacheBusting;
    }

    public function handle($args){

        if ( function_exists( 'rocket_clean_post' ) && function_exists( 'rocket_clean_files' ) ) {

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            if ( $url ) {

                rocket_clean_files($url);
                self::log([
                    'url' => $url,
                    'log' => 'wprocket post url page cache cleared',
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











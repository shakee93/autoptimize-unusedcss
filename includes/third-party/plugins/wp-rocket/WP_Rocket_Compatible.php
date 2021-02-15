<?php

defined( 'ABSPATH' ) or die();

class WP_Rocket_Compatible extends RapidLoad_ThirdParty {

    function __construct(){

        $this->init_hooks();
    }

    public function init_hooks(){

        add_filter('uucss/cache/bust', [$this, 'add_cache_busting_params'], 10, 1);
        add_action( 'uucss/cached', [$this, 'purge_cache'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'purge_cache'], 10, 2 );

    }

    public function add_cache_busting_params($cacheBusting){

        array_push($cacheBusting, [
            'type' => 'query',
            'rule' => 'nowprocket'
        ]);

        return $cacheBusting;
    }

    public function purge_cache($args){

        if ( function_exists( 'rocket_clean_post' ) && function_exists( 'rocket_clean_domain' ) && function_exists( 'rocket_clean_home' ) ) {

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            $post_id = url_to_postid( $url );

            if(stripslashes($url) == stripslashes(home_url())){
                self::log([
                    'url' => $url,
                    'log' => 'Wp Rocket home url page cache cleared',
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
            }

        }

    }

}











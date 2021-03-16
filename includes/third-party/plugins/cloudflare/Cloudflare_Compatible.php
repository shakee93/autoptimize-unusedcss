<?php

defined( 'ABSPATH' ) || exit;

class Cloudflare_Compatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'cloudflare/cloudflare.php';
        $this->catgeory = 'cache';
        $this->name = 'cloudflare';

        parent::__construct();
    }

    public function init_hooks()
    {
        add_action( 'uucss/cached', [$this, 'handle'], 10, 2 );
        add_action( 'uucss/cache_cleared', [$this, 'handle'], 10, 2 );
    }

    public function handle($args)
    {
        if(class_exists('\CF\WordPress\Hooks')){

            $url = null;

            if ( isset( $args['url'] ) ) {
                $url = $this->transform_url( $args['url'] );
            }

            $post_id = url_to_postid( $url );

            if($post_id){

                self::log([
                    'url' => $url,
                    'log' => 'Cloudflare url page cache cleared',
                    'type' => 'purging'
                ]);
                $hooks = '\CF\WordPress\Hooks';
                $cfHooks = new $hooks();
                $cfHooks->purgeCacheByRelevantURLs($post_id);

            }

        }
    }

    public function is_mu_plugin()
    {
        return false;
    }
}
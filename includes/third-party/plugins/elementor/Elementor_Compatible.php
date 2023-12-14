<?php

defined( 'ABSPATH' ) || exit;

class Elementor_Compatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'elementor/elementor.php';
        $this->catgeory = 'theme-builder';
        $this->name = 'elementor';

        parent::__construct();
    }

    public function init_hooks()
    {
        add_filter('uucss/url/exclude', [$this, 'handle']);
        add_filter('rapidload/js/script-append-after', [$this, 'handle_script_deps_priority'], 10, 2);
    }

    public function handle_script_deps_priority($value, $handle)
    {

        if (
            $handle === 'elementor-frontend' ||
            $handle === 'elementor-frontend-js'
        ) {
            return 'pro-preloaded-elements-handlers';
        }

        return $value;
    }

    public function handle($args)
    {
        $url_parts = parse_url( $args );

        if(isset($url_parts['query']) &&
            ( $this->str_contains($url_parts['query'], 'elementor-preview') ||
                $this->str_contains($url_parts['query'], 'preview_id') ||
                $this->str_contains($url_parts['query'], 'elementor_library'))
        ){
            return false;
        }

        return $args;
    }

    public function is_mu_plugin()
    {
        return false;
    }
}
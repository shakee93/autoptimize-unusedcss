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
        add_filter('rapidload/js/script-after', [$this, 'handle_script_deps_priority'], 10, 2);
//        add_filter('rapidload/js/script-dependencies', [$this, 'handle_script_deps'], 10, 2);
    }

    public function handle_script_deps_priority($value, $script)
    {

        if ($script->handle === 'pro-elements-handlers' || $script->handle === 'elementor-pro-frontend') {
            return 'elementor-frontend';
        }

        return $value;
    }

    public function handle_script_deps($value, $handle)
    {

        if ($handle === 'elementor-pro-frontend') {
            $key = array_search('wp-i18n', $value);

            if ($key !== false) {
                unset($value[$key]);
            }

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
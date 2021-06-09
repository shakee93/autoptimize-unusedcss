<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_WP_Rocket extends UnusedCSS {

    use RapidLoad_Utils;

    public $deps_available = false;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        $this->provider = 'wp-rocket';

        self::$provider_path = 'wp-rocket/wp-rocket.php';

        $this->options = RapidLoad_Base::fetch_options();

        parent::__construct();

        if ( ! $this->check_dependencies() ) {
            return;
        }

        add_filter('uucss/enqueue/provider-handled-file', function ($handled , $link ){
            return true;
        },10,2);

        add_filter('uucss/enqueue/cache-file-url', function ($uucss_file){
            return $this->get_cached_file($uucss_file, null);
        },10,1);

        new UnusedCSS_WP_Rocket_Admin( $this );
    }

    public function get_css()
    {
        return [];
    }

    public function replace_css()
    {
        add_filter( 'rocket_buffer', function ( $html ) {
            return apply_filters('uucss/enqueue/content', $html);
        }, 99 );
    }

    public function check_dependencies() {

        if(function_exists('rocket_init')) {
            $this->deps_available = true;
        }else {
            /*$notice = [
                'action'  => 'on-board',
                'title'   => 'RapidLoad Power Up',
                'message' => 'Complete on-boarding steps, it only takes 2 minutes.',

                'main_action' => [
                    'key'   => 'Get Started',
                    'value' => admin_url( 'options-general.php?page=uucss-onboarding' )
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);*/
        }

        return $this->deps_available;
    }

    public function enabled() {

        if (!parent::enabled()) {
            return false;
        }

        if (!UnusedCSS_WP_Rocket_Admin::enabled()) {
            return false;
        }

        return true;
    }
}
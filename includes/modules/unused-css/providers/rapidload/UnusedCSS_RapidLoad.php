<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_RapidLoad extends UnusedCSS {

    use RapidLoad_Utils;

    public $deps_available = false;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        $this->provider = 'rapidload';

        self::$provider_path = 'unusedcss/unusedcss.php';

        $this->options = RapidLoad_Base::fetch_options();

        parent::__construct();

        add_action( 'template_redirect', [$this, 'uucss_notfound_fallback'] );

        RapidLoad_Base::activate();
        /*
            On-boarding
        */

        if ( ! $this->check_dependencies() ) {
            return;
        }

        add_filter('uucss/enqueue/provider-handled-file', function ($handled , $link ){
            return true;
        },10,2);

        add_filter('uucss/enqueue/cache-file-url', function ($uucss_file){
            return $this->get_cached_file($uucss_file, null);
        },10,1);

        new UnusedCSS_RapidLoad_Admin( $this );
    }

    public static function uucss_notfound_fallback() {

        $original_request = strtok( $_SERVER['REQUEST_URI'], '?' );

        if ( strpos( $original_request, wp_basename( WP_CONTENT_DIR ) . UUCSS_CACHE_CHILD_DIR ) !== false && is_404() ) {

            global $wp_query;
            $wp_query->is_404 = false;

            $fallback_target = UnusedCSS_DB::get_original_file_name($original_request);

            if ( isset($fallback_target) ) {

                wp_redirect( $fallback_target, 302 );
            } else {

                status_header( 410 );
            }
        }
    }

    public function get_css()
    {
        return [];
    }

    public function replace_css()
    {
        add_filter( 'rapidload_buffer', function ( $html ) {
            return apply_filters('uucss/enqueue/content', $html);
        }, 99 );
    }

    public function check_dependencies() {

        if(class_exists('UnusedCSS')) {
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

        if (!UnusedCSS_RapidLoad_Admin::enabled()) {
            return false;
        }

        return true;
    }
}
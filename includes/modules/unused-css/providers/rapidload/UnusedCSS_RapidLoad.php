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

        /*if(!isset($this->options['uucss_enable_uucss'])){
            return;
        }*/

        parent::__construct();

        if(apply_filters('uucss/enable/notfound_fallback', true)){
            add_action( 'template_redirect', [$this, 'uucss_notfound_fallback'] );
        }

        if(is_admin()){
            new UnusedCSS_RapidLoad_Onboard( $this );
        }

        $this->check_dependencies();

        add_filter('uucss/enqueue/provider-handled-file', function ($handled , $link ){
            return true;
        },10,2);

        add_filter('uucss/enqueue/cache-file-url', function ($uucss_file){
            return $this->get_cached_file($uucss_file, apply_filters('uucss/enqueue/cache-file-url/cdn', null));
        },10,1);

        new UnusedCSS_RapidLoad_Admin( $this );
    }

    public function uucss_notfound_fallback() {

        $original_request = strtok( $_SERVER['REQUEST_URI'], '?' );
        $original_path = WP_CONTENT_DIR . apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR)  . 'uucss' . "/" . basename($original_request);

        $options = RapidLoad_Base::fetch_options(false);

        if ( strpos( $original_request, wp_basename( WP_CONTENT_DIR ) . apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR)  . 'uucss' ) !== false
            && !file_exists($original_path) && isset($options['uucss_disable_add_to_re_queue']) && $options['uucss_disable_add_to_re_queue'] == "1") {

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

    public function check_dependencies() {

        if(UnusedCSS_Admin::is_api_key_verified()) {
            $this->deps_available = true;
        }else {
            $notice = [
                'action'  => 'on-board',
                'title'   => 'RapidLoad Power Up',
                'message' => 'Complete on-boarding steps, it only takes 2 minutes.',

                'main_action' => [
                    'key'   => 'Get Started',
                    'value' => admin_url( 'options-general.php?page=rapidload-onboarding' )
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            UnusedCSS_RapidLoad_Onboard::display_get_start_link();
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
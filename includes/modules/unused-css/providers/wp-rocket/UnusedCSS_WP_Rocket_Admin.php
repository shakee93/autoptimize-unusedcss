<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_WP_Rocket_Admin extends UnusedCSS_Admin {

    use RapidLoad_Utils;

    public static $deactivating = false;
    public static $activating = false;

    /**
     * UnusedCSS constructor.
     *
     * @param UnusedCSS_Autoptimize $ao_uucss
     */
    public function __construct( $wp_rocket_uucss ) {

        $this->uucss = $wp_rocket_uucss;

        parent::__construct( $wp_rocket_uucss );
    }

    public static function enabled() {

        if( !self::wp_rocket_active() ||
            ! self::is_api_key_verified() && ! self::$deactivating
        ){
            /*$notice = [
                'action'      => 'on-board',
                'title'       => 'RapidLoad Power Up',
                'message'     => 'Complete on-boarding steps, it only takes 2 minutes.',
                'main_action' => [
                    'key'   => 'Get Started',
                    'value' => admin_url( 'options-general.php?page=uucss-onboarding' )
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);*/
            return false;
        }

        return true;
    }

    public static function wp_rocket_active(){

        if ( ! function_exists( 'is_plugin_active' ) ) {
            require_once(ABSPATH . '/wp-admin/includes/plugin.php');
        }

        return is_plugin_active( UnusedCSS_Autoptimize::$provider_path );
    }
}
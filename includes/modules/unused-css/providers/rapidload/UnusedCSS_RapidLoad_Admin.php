<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_RapidLoad_Admin extends UnusedCSS_Admin {

    use RapidLoad_Utils;

    public static $deactivating = false;
    public static $activating = false;

    /**
     * UnusedCSS constructor.
     *
     * @param UnusedCSS_RapidLoad $rapidload_uucss
     */
    public function __construct( $rapidload_uucss ) {

        $this->uucss = $rapidload_uucss;

        parent::__construct( $rapidload_uucss );

        if ( ! self::enabled() ) {
            self::$enabled = false;
            return;
        }
    }

    public static function enabled() {

        if(! self::is_api_key_verified() && ! self::$deactivating
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
}
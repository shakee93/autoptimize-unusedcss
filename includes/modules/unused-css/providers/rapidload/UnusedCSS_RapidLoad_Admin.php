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

        add_action('admin_bar_menu', [$this, 'add_uucss_admin_bar_menu'], 100);

        if ( ! self::enabled() ) {
            self::$enabled = false;
        }
    }

    function add_uucss_admin_bar_menu($wp_admin_bar){

        $color = 'green';

        if(UnusedCSS_DB::get_total_job_count(" WHERE status = 'failed' ") > 0){
            $color = 'red';
        }elseif (UnusedCSS_DB::get_total_job_count(" WHERE status = 'success' AND warnings IS NOT NULL ") > 0){
            $color = 'yellow';
        }

        if(apply_filters('uucss/tool-bar-menu',true)){

            $wp_admin_bar->add_node( array(
                'id'    => 'rapidload',
                'title' => '<span class="ab-icon"></span><span class="ab-label">' . __( 'RapidLoad', 'rapidload' ) . '</span>',
                'href'  => admin_url( 'options-general.php?page=uucss' ),
                'meta'  => array( 'class' => 'bullet-' . $color ),
            ));

            $wp_admin_bar->add_node( array(
                'id'    => 'rapidload-clear-cache',
                'title' => '<span class="ab-label">' . __( 'Remove All', 'remove_all' ) . '</span>',
                'href'  => admin_url( 'options-general.php?action=uucss_purge_cache' ),
                'meta'  => array( 'class' => 'rapidload-clear-all' ),
                'parent' => 'rapidload'
            ));
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
<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Module{

    public function __construct()
    {
        $this->hooks();
    }

    function hooks(){

        if(is_admin()){

            add_action( 'wp_ajax_rapidload_module_activation', [ $this, 'activate_module' ] );

        }

    }

    function activate_module(){

        $module = isset($_REQUEST['module']) ? $_REQUEST['module'] : false;
        $active = isset($_REQUEST['activate']) ? $_REQUEST['activate'] : 'off';

        if(!$module){
            wp_send_json_error('Rapidload module required');
        }

        $stored = get_option( 'rapidload_modules', [] );

        $stored[$module] = $active;

        update_option( 'rapidload_modules', $stored );

        wp_send_json_success();
    }

    public static function update_modules( $modules ) {

        foreach ( $modules as $module => $action ) {
            if ( 'off' === $action ) {
                if ( in_array( $module, $stored, true ) ) {
                    $stored = array_diff( $stored, [ $module ] );
                }
                continue;
            }

            $stored[] = $module;
            //Installer::create_tables( [ $module ] );
        }

        update_option( 'rank_math_modules', array_unique( $stored ) );
    }
}
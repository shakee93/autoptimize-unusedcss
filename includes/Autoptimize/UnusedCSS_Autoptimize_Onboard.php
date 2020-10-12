<?php

/**
 * Class UnusedCSS
 */

class UnusedCSS_Autoptimize_Onboard
{
    public function __construct() {

        register_activation_hook(UUCSS_PLUGIN_FILE, [$this,'register_plugin_activation_hook']);

        add_action('admin_menu', [$this,'uucss_register_on_board_page']);

        add_action('admin_init', [$this,'uucss_redirect']);

        add_action( "wp_ajax_ao_installed", [ $this, 'ao_installed' ] );

        add_action( "wp_ajax_ao_css_enabled", [ $this, 'ao_css_enabled' ] );

        add_action( "wp_ajax_uucss_connected", [ $this, 'uucss_connected' ] );
    }

    function ao_installed(){
        $status = [];
        $status['installed'] = file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php');
        $status['active'] = is_plugin_active('autoptimize/autoptimize.php');
        wp_send_json_success($status);
    }

    function ao_css_enabled(){
        wp_send_json_success(!( autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == ""));
    }

    function uucss_connected(){
        wp_send_json_success(UnusedCSS_Autoptimize_Admin::is_api_key_verified());
    }

    function uucss_on_boarding_page(){
        wp_enqueue_script('post');

        ?>
        <div class="uucss-on-board">
            <?php
                include 'parts/onboarding.php';
            ?>
        </div>
        <?php
    }

    function uucss_redirect() {
        if (get_option('uucss_do_activation_redirect', false)) {
            delete_option('uucss_do_activation_redirect');
            wp_redirect('/wp-admin/options-general.php?page=uucss-onboarding');
        }
    }

    function register_plugin_activation_hook(){
        add_option('uucss_do_activation_redirect', true);
    }

    function uucss_register_on_board_page() {
        add_options_page(
            'UnusedCSS',
            'UnusedCSS',
            'manage_options',
            'uucss-onboarding',
            [$this, 'uucss_on_boarding_page']
        );
    }
}
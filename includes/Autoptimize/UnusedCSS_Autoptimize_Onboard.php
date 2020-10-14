<?php

/**
 * Class UnusedCSS
 */

class UnusedCSS_Autoptimize_Onboard
{
    public function __construct($ao_uucss) {

        $this->uucss = $ao_uucss;

        register_activation_hook(UUCSS_PLUGIN_FILE, [$this,'register_plugin_activation_hook']);

        add_action('admin_menu', [$this,'uucss_register_on_board_page']);

        add_action('admin_init', [$this,'uucss_redirect']);

        add_action( "wp_ajax_ao_installed", [ $this, 'ao_installed' ] );

        add_action( "wp_ajax_run_first_job", [ $this, 'run_first_job' ] );

        add_action('admin_head', [ $this, 'remove_notices' ]);
    }

    function run_first_job(){
        if(!UnusedCSS_Autoptimize_Admin::ao_active()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::ao_css_option_enabled()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::is_api_key_verified()){
            wp_send_json_error(false);
        }

        $this->uucss->async = false;
        $this->uucss->url = get_site_url();
        $this->uucss->purge_css();

        $this->ao_installed();
    }

    function remove_notices(){
        if(!isset($_REQUEST['action'])){
            return;
        }
        if(!isset($_REQUEST['plugin'])){
            return;
        }

        if(get_current_screen() &&
            get_current_screen()->base == 'update' &&
            $_REQUEST['action'] = 'install-plugin' &&
                $_REQUEST['plugin'] == 'autoptimize'){
                echo '<style>div.notice{display: none !important;}</style>';
        }
    }

    function ao_installed(){
        $status = [];
        $status['installed'] = UnusedCSS_Autoptimize_Admin::ao_installed();
        $status['active'] = UnusedCSS_Autoptimize_Admin::ao_active();
        $status['css_enabled'] = UnusedCSS_Autoptimize_Admin::ao_css_option_enabled();
        $status['uucss_connected'] = UnusedCSS_Autoptimize_Admin::is_api_key_verified();
        $status['uucss_first_job_done'] = UnusedCSS_Settings::get_first_link() ? true : false;

        if(wp_doing_ajax()){
            wp_send_json_success($status);
        }else{
            return $status;
        }
    }

    public static function get_on_board_steps(){
        return [
            'Install and Actvate',
            'Enable',
            'Connnect',
            'Run First Job'
        ];
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

    public static function get_on_board_step(){
        if(!UnusedCSS_Autoptimize_Admin::ao_active()){
            return 1;
        }
        else if(!UnusedCSS_Autoptimize_Admin::ao_css_option_enabled()){
            return 2;
        }else if(
            UnusedCSS_Autoptimize_Admin::ao_active() &&
            UnusedCSS_Autoptimize_Admin::ao_css_option_enabled() &&
            ! UnusedCSS_Autoptimize_Admin::is_api_key_verified()
        ) {
            return 3;
        } else if ( UnusedCSS_Autoptimize_Admin::is_api_key_verified() ) {
            return 4;
        }
        return 1;
    }
}
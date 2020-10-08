<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Onboard {
	public function __construct() {

		register_activation_hook( UUCSS_PLUGIN_FILE, [ $this, 'register_plugin_activation_hook' ] );

        add_action('admin_menu', [$this,'uucss_register_on_board_page']);

        add_action('admin_init', [$this,'uucss_redirect']);

        add_action( "wp_ajax_activate_ao_plugin", [ $this, 'activate_ao_plugin' ] );

    }

    function activate_ao_plugin(){
        $active_plugins = get_option('active_plugins');
        if (isset($active_plugins['autoptimize/autoptimize.php']))
            return;

    }

    function uucss_on_boarding_page(){
        wp_enqueue_script('post');
        ?>
        <div class="uucss-on-board">
            <h2>My Plugin Page Title</h2>
            <div class="footer">
                <span><a href="<?php echo admin_url() ?>">Skip</a></span>
                <span><a class="js-install-ao" href="<?php echo network_admin_url( 'plugin-install.php?tab=plugin-information&plugin=autoptimize' ) ?>" target="_blank">Install</a></span>
                <span><a class="js-install-ao" href="<?php echo UnusedCSS_Utils::activate_plugin( 'autoptimize/autoptimize.php' ) ?>" target="_blank">Activate</a></span>
            </div>
            <div class="uucss-on-board-popup">
                <div class="uucss-popup-model">
                    <div class="on-board-popup-content">
                        <iframe id="on-board-popup-frame" src="<?php echo network_admin_url( 'plugin-install.php?tab=plugin-information&plugin=autoptimize' ) ?>" frameborder="0" width="500" height="450"></iframe>
                    </div>
                </div>
            </div>
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
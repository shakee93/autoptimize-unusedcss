<?php
/*
Plugin Name: Autoptimize UnusedCSS Power-Up
Plugin URI:  unusedcss.io
Description: Removes Unused CSS from your website pages.
Version:     0.0.1
Author:      Shakeeb Sadikeen
Author URI:  https://shakeeb.dev/
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UUCSS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'UUCSS_PLUGIN_FILE', __FILE__ );

if ( ! defined( 'UUCSS_ACTIVATION_URL' ) ) {
    define( 'UUCSS_ACTIVATION_URL', 'https://app.unusedcss.io/activate' );
}


if ( ! defined( 'UUCSS_DEBUG' ) ) {
	define( 'UUCSS_DEBUG', true );
}

require( 'vendor/autoload.php' );


add_action( 'plugins_loaded', function () {

	$ao_uucss = new UnusedCSS_Autoptimize();
	new UnusedCSS_Autoptimize_Admin( $ao_uucss );

} );

add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function ( $links ) {
	$_links = array(
		'<a href="' . admin_url( 'options-general.php?page=uucss' ) . '">Settings</a>',
	);

	return array_merge( $_links, $links );
} );

register_activation_hook(UUCSS_PLUGIN_FILE, function(){
    add_option('uucss_do_activation_redirect', true);
});

add_action('admin_init', 'uucss_redirect');

function uucss_redirect() {
    if (get_option('uucss_do_activation_redirect', false)) {
        delete_option('uucss_do_activation_redirect');
        wp_redirect('/wp-admin/options-general.php?page=uucss-onboarding');
    }
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

function uucss_register_on_board_page() {
    add_options_page(
        'UnusedCSS',
        'UnusedCSS',
        'manage_options',
        'uucss-onboarding',
        'uucss_on_boarding_page'
    );
}

add_action('admin_menu', 'uucss_register_on_board_page');



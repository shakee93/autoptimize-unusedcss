<?php
/*
Plugin Name: RapidLoad Power-Up for Autoptimize
Plugin URI:  https://rapidload.io/
Description: Makes your site even faster and lighter by automatically removing Unused CSS from your website.
Version:     1.1.0
Author:      RapidLoad
Author URI:  https://rapidload.io/
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UUCSS_VERSION', '1.1.0' );
define( 'UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'UUCSS_PLUGIN_FILE', __FILE__ );

require __DIR__ . '/vendor/autoload.php';

register_activation_hook( UUCSS_PLUGIN_FILE, 'UnusedCSS_Autoptimize_Onboard::uucss_activate' );

register_activation_hook( UUCSS_PLUGIN_FILE, 'UnusedCSS_DB::initialize' );

register_uninstall_hook(UUCSS_PLUGIN_FILE, 'UnusedCSS_DB::drop');

add_action( 'plugins_loaded', function () {

	new UnusedCSS_Autoptimize();

} );


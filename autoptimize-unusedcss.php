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


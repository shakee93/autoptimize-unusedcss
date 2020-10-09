<?php
/*
Plugin Name: Autoptimize UnusedCSS Power-Up
Plugin URI:  unusedcss.io
Description: Makes your site even faster and lighter by automatically removing Unused CSS from your website.
Version:     0.0.2
Author:      Shakeeb Sadikeen
Author URI:  https://shakeeb.dev/
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'UUCSS_PLUGIN_FILE', __FILE__ );

//require( 'vendor/autoload.php' );
//
//add_action( 'plugins_loaded', function () {
//
//    new UnusedCSS_Autoptimize_Onboard();
//
//	$ao_uucss = new UnusedCSS_Autoptimize();
//	new UnusedCSS_Autoptimize_Admin( $ao_uucss );
//
//} );


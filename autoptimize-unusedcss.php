<?php
/*
Plugin Name: Autoptimize UnusedCSS Power-Up
Plugin URI:  unusedcss.io
Description: Removes Unused CSS from your website pages.
Version:     1.0.0
Author:      Shakeeb Sadikeen
Author URI:  http://shakee93.me/
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'UUCSS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'UUCSS_PLUGIN_FILE', __FILE__ );
define( 'UUCSS_DEBUG', true );

require('vendor/autoload.php');

add_action('plugins_loaded', function () {

	$ao_uucss = new UnusedCSS_Autoptimize();
	new UnusedCSS_Autoptimize_Admin($ao_uucss);

});

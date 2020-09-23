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

add_action('admin_enqueue_scripts',function(){
    wp_enqueue_style( 'uucss_global_admin', UUCSS_PLUGIN_URL . 'assets/uucss_global.css?v=' . getRandomNum() );
    wp_enqueue_script('uucss_global_admin_js', UUCSS_PLUGIN_URL . 'assets/uucss_global.js?v=' . getRandomNum());
});


add_action('init', function (){
    if(AUTOPTIMIZE_PLUGIN_FILE){
        register_activation_hook( __FILE, function(){
            error_log(plugin_dir_path());
        });
    }
});


function getRandomNum(){
    if(is_user_logged_in()){
        return rand();
    }else{
        return '1.0';
    }
}


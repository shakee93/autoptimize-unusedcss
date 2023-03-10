<?php
/*
Plugin Name: RapidLoad Power-Up for Autoptimize
Plugin URI:  https://rapidload.io/
Description: Makes your site even faster and lighter by automatically removing Unused CSS from your website.
Version:     1.7.2
Author:      RapidLoad
Author URI:  https://rapidload.io/
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if(isset($_REQUEST['no_rapidload'])){
    return;
}

define( 'UUCSS_VERSION', '1.7.2' );
define( 'UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'UUCSS_PLUGIN_FILE', __FILE__ );
define( 'UUCSS_CACHE_CHILD_DIR', '/cache/rapidload/' );

if ( is_multisite() ) {
    $blog_id = get_current_blog_id();
    define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] . '/rapidload/' . date('Ymd') . '/' . $blog_id . '/');
} else {
    define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] .  '/rapidload/' . date('Ymd') . '/');
}


require __DIR__ . '/vendor/autoload.php';

if(is_admin()){

    register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_Base::uucss_activate' );

    register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_DB::initialize' );

    register_uninstall_hook(UUCSS_PLUGIN_FILE, 'RapidLoad_DB::drop');

}

/**
 * @type $uucss UnusedCSS_Autoptimize
 */

global $rapidload;

$rapidload = RapidLoad_Base::get();




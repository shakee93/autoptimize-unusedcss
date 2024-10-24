<?php
/*
Plugin Name: RapidLoad - Optimize Web Vitals Automatically
Plugin URI:  https://rapidload.io/
Description: Makes your site even faster and lighter by automatically removing Unused CSS from your website.
Version:     2.4.0
Author:      RapidLoad
Author URI:  https://rapidload.io/
*/


if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if(isset($_REQUEST['no_rapidload'])){
    return;
}

require_once __DIR__ . '/constants.php';

define( 'UUCSS_PLUGIN_FILE', __FILE__ );
define('UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ));
define('UUCSS_ABSPATH', str_replace(wp_basename(WP_CONTENT_DIR), '', WP_CONTENT_DIR));
define('RAPIDLOAD_BASE',  ( function_exists( 'wp_normalize_path' ) ) ? plugin_basename( __DIR__ . '/' . basename(__FILE__) ) : null);

if (file_exists(dirname(__FILE__) . '/includes/RapidLoad_CLI_Command.php')) {
    require_once dirname(__FILE__) . '/includes/RapidLoad_CLI_Command.php';
}

if ( is_multisite() ) {
    $blog_id = get_current_blog_id();
    define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] . '/rapidload/' . date('Ymd') . '/' . $blog_id . '/');
} else {
    define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] .  '/rapidload/' . date('Ymd') . '/');
}


require_once __DIR__ . '/vendor/autoload.php';

if(is_admin()){

    register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_Base::uucss_activate' );

    register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_DB::initialize' );

    register_uninstall_hook(UUCSS_PLUGIN_FILE, 'RapidLoad_DB::drop');

    register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_Cache::on_activation' );

    register_deactivation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_Cache::on_deactivation' );

}

/**
 * @type $uucss UnusedCSS_Autoptimize
 */

global $rapidload;

$rapidload = RapidLoad_Base::get();




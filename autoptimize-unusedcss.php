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

if (is_multisite()) {
    $blog_id = get_current_blog_id();
    define( 'AO_UUCSS_DIR', WP_CONTENT_DIR . '/uploads/ao_uucss/' . $blog_id . '/' );
} else {
    define( 'AO_UUCSS_DIR', WP_CONTENT_DIR . '/uploads/ao_uucss/' );
}

require('includes/UnusedCSS_Utils.php');
require('includes/UnusedCSS_Api.php');
require('includes/UnusedCSS.php');
require('includes/UnusedCSS_Autoptimize.php');

new UnusedCSS_Autoptimize();


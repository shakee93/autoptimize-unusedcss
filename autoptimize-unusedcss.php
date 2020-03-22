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

require('includes/UnusedCSS_Utils.php');
require('includes/UnusedCSS_Api.php');
require('includes/UnusedCSS.php');
require('includes/Autoptimize/UnusedCSS_Autoptimize.php');
require('includes/Autoptimize/UnusedCSS_Autoptimize_Admin.php');

if (is_admin()) {
    new UnusedCSS_Autoptimize_Admin();
}

new UnusedCSS_Autoptimize();


<?php
/*
Plugin Name: Autoptimize UnusedCSS
Plugin URI:  unusedcss.io
Description: Removes Unused CSS from your website pages.
Version:     1.0.0
Author:      Shakeeb Sadikeen
Author URI:  http://shakee93.me/
*/


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require('vendor/autoload.php');
require('includes/UnusedCSS.php');

new UnusedCSS();


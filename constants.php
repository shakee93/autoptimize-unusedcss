<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! defined( 'RAPIDLOAD_PLUGIN_DIR' ) ) {
    define( 'RAPIDLOAD_PLUGIN_DIR', __DIR__ );
}

if ( ! defined( 'RAPIDLOAD_SETTINGS_DIR' ) ) {
    define( 'RAPIDLOAD_SETTINGS_DIR', WP_CONTENT_DIR . '/settings/rapidload' );
}

if ( ! defined( 'RAPIDLOAD_CACHE_DIR' ) ) {
    define( 'RAPIDLOAD_CACHE_DIR', WP_CONTENT_DIR . '/cache/rapidload-cache' );
}

if ( ! defined( 'RAPIDLOAD_CONSTANT_FILE' ) ) {
    define( 'RAPIDLOAD_CONSTANT_FILE', __DIR__ . '/constants.php' );
}

if ( ! defined( 'RAPIDLOAD_INDEX_FILE' ) ) {
    define( 'RAPIDLOAD_INDEX_FILE', ABSPATH . 'index.php' );
}

if ( ! defined( 'UUCSS_VERSION' ) ) {
    define( 'UUCSS_VERSION', '2.4.0' );
}

if ( ! defined( 'UUCSS_CACHE_CHILD_DIR' ) ) {
    define( 'UUCSS_CACHE_CHILD_DIR', '/cache/rapidload/' );
}

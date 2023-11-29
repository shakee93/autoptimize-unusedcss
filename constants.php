<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'RAPIDLOAD_PLUGIN_DIR', __DIR__ );
define( 'RAPIDLOAD_SETTINGS_DIR', WP_CONTENT_DIR . '/settings/rapidload' );
define( 'RAPIDLOAD_CACHE_DIR', WP_CONTENT_DIR . '/cache/rapidload-cache' );
define( 'RAPIDLOAD_CONSTANT_FILE', __DIR__ . '/constants.php' );
define( 'RAPIDLOAD_INDEX_FILE', ABSPATH . 'index.php' );
define( 'UUCSS_VERSION', '2.2.0' );
define( 'UUCSS_CACHE_CHILD_DIR', '/cache/rapidload/' );
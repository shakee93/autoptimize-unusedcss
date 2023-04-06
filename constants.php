<?php

$rapidload_constants = [

    'RAPIDLOAD_PLUGIN_DIR' => __DIR__,
    'RAPIDLOAD_SETTINGS_DIR'   => WP_CONTENT_DIR . '/settings/rapidload',
    'RAPIDLOAD_CACHE_DIR' => WP_CONTENT_DIR . '/cache/rapidload/cache',
    'RAPIDLOAD_CONSTANT_FILE' => __DIR__ . 'constants.php'
];

foreach ( $rapidload_constants as $rapidload_constant_name => $rapidload_constant_value ) {
    if ( ! defined( $rapidload_constant_name ) && $rapidload_constant_value !== null ) {
        define( $rapidload_constant_name, $rapidload_constant_value );
    }
}

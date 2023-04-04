<?php

$rapidload_constants = [

    'RAPIDLOAD_PLUGIN_DIR' => __DIR__,

];

foreach ( $rapidload_constants as $rapidload_constant_name => $rapidload_constant_value ) {
    if ( ! defined( $rapidload_constant_name ) && $rapidload_constant_value !== null ) {
        define( $rapidload_constant_name, $rapidload_constant_value );
    }
}

<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$rapidload_constants_file = '/your/path/to/rapidload/constants.php';

if(file_exists($rapidload_constants_file)){
    require $rapidload_constants_file;

    $rapidload_cache_store_file = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/cache/RapidLoad_Cache_Store.php';
    $rapidload_cache_file = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/cache/RapidLoad_Cache_Engine.php';

    if ( file_exists( $rapidload_cache_file ) && file_exists( $rapidload_cache_store_file ) ) {

        require_once $rapidload_cache_file;
        require_once $rapidload_cache_store_file;

        RapidLoad_Cache_Engine::start() &&  RapidLoad_Cache_Engine::deliver_cache();

    }

}


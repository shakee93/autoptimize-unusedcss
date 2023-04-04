<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$rapidload_constants_file = '/your/path/to/constant/file';

if ( file_exists( $rapidload_constants_file ) ) {
    require $rapidload_constants_file;

    $rapidload_cache_engine_file = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/cache/RapidLoad_Cache.php';

    if(file_exists($rapidload_cache_engine_file)){
        require_once $rapidload_cache_engine_file;

        RapidLoad_Cache::get();

        RapidLoad_Cache::deliver_cache();
    }



} elseif ( __DIR__ === WP_CONTENT_DIR ) {
    @unlink( __FILE__ );
}

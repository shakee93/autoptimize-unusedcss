<?php

class RapidLoad_Cache_Store
{
    public function __construct()
    {

    }

    public static function create_advanced_cache_file(){

        if ( ! is_writable( WP_CONTENT_DIR ) ) {
            return false;
        }

        $advanced_cache_sample_file = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/cache/advanced-cache.php';

        if ( ! is_readable( $advanced_cache_sample_file ) ) {
            return false;
        }

        $advanced_cache_file          = WP_CONTENT_DIR . '/advanced-cache.php';
        $advanced_cache_file_contents = file_get_contents( $advanced_cache_sample_file );

        $search  = '/your/path/to/rapidload/constants.php';
        $replace = RAPIDLOAD_CONSTANT_FILE;

        $advanced_cache_file_contents = str_replace( $search, $replace, $advanced_cache_file_contents );
        $advanced_cache_file_created  = file_put_contents( $advanced_cache_file, $advanced_cache_file_contents, LOCK_EX );

        return ( $advanced_cache_file_created === false ) ? false : $advanced_cache_file;

    }

    public static function set_wp_cache_constant( $set = true ) {

        if ( file_exists( ABSPATH . 'wp-config.php' ) ) {
            // The config file resides in ABSPATH.
            $wp_config_file = ABSPATH . 'wp-config.php';
        } elseif ( @file_exists( dirname( ABSPATH ) . '/wp-config.php' ) && ! @file_exists( dirname( ABSPATH ) . '/wp-settings.php' ) ) {
            // The config file resides one level above ABSPATH but is not part of another installation.
            $wp_config_file = dirname( ABSPATH ) . '/wp-config.php';
        } else {
            // The config file could not be found.
            return false;
        }

        if ( ! is_writable( $wp_config_file ) ) {
            return false;
        }

        $wp_config_file_contents = file_get_contents( $wp_config_file );

        if ( ! is_string( $wp_config_file_contents ) ) {
            return false;
        }

        if ( $set ) {
            $default_wp_config_file = ( strpos( $wp_config_file_contents, '/** Sets up WordPress vars and included files. */' ) !== false );

            if ( ! $default_wp_config_file ) {
                return false;
            }

            $found_wp_cache_constant = preg_match( '#define\s*\(\s*[\'\"]WP_CACHE[\'\"]\s*,.+\);#', $wp_config_file_contents );

            if ( $found_wp_cache_constant ) {
                return false;
            }

            $new_wp_config_lines  = '/** Enables page caching for RapidLoad. */' . PHP_EOL;
            $new_wp_config_lines .= "if ( ! defined( 'WP_CACHE' ) ) {" . PHP_EOL;
            $new_wp_config_lines .= "\tdefine( 'WP_CACHE', true );" . PHP_EOL;
            $new_wp_config_lines .= '}' . PHP_EOL;
            $new_wp_config_lines .= PHP_EOL;

            $new_wp_config_file_contents = preg_replace( '#(/\*\* Sets up WordPress vars and included files\. \*/)#', $new_wp_config_lines . '$1', $wp_config_file_contents );
        } else { // Unset.
            if ( strpos( $wp_config_file_contents, '/** Enables page caching for RapidLoad. */' ) !== false ) {
                $new_wp_config_file_contents = preg_replace( '#/\*\* Enables page caching for RapidLoad\. \*/' . PHP_EOL . '.+' . PHP_EOL . '.+' . PHP_EOL . '\}' . PHP_EOL . PHP_EOL . '#', '', $wp_config_file_contents );
            } elseif ( strpos( $wp_config_file_contents, '// Added by RapidLoad' ) !== false ) { // < 1.5.0
                $new_wp_config_file_contents = preg_replace( '#.+Added by RapidLoad\r\n#', '', $wp_config_file_contents );
            } else {
                return false; // Not previously set by the plugin.
            }
        }

        if ( ! is_string( $new_wp_config_file_contents ) || empty( $new_wp_config_file_contents ) ) {
            return false;
        }

        $wp_config_file_updated = file_put_contents( $wp_config_file, $new_wp_config_file_contents, LOCK_EX );

        return ( $wp_config_file_updated === false ) ? false : $wp_config_file;
    }

    public static function clean(){

        $advanced_cache_file = WP_CONTENT_DIR . '/advanced-cache.php';

        if(file_exists($advanced_cache_file)){
            @unlink($advanced_cache_file);
            RapidLoad_Cache_Store::set_wp_cache_constant(false);
        }

    }

}
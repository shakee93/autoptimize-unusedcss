<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Utils {

    public static function url_origin( $s, $use_forwarded_host = false )
    {
        $ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
        $sp       = strtolower( $s['SERVER_PROTOCOL'] );
        $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
        $port     = $s['SERVER_PORT'];
        $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
        $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
        $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    public static function get_current_url()
    {
        return static::url_origin( $_SERVER, false ) . $_SERVER['REQUEST_URI'];
    }

    public static function is_cli(){

        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return true;
        }

        return false;
        
    }

    public static function log($object) {

        $data = is_string($object) ? $object : json_encode($object, JSON_PRETTY_PRINT);
        error_log( "[UUCSS_LOG] " . $data);
        
        return $object;
    }

    public static function add_admin_notice($message, $type='error') {

        add_action('admin_notices', function () use ($message, $type) {

            echo "<div class=\"notice notice-$type is-dismissible\">
                    <p>$message</p>
                 </div>";

        });

    }

}

function uucss_log($object) {

    return UnusedCSS_Utils::log($object);
    
}
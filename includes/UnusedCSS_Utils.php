<?php

/**
 * Class UnusedCSS
 */
trait UnusedCSS_Utils {

    public function url_origin( $s, $use_forwarded_host = false )
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

    public function get_current_url($post_id = null)
    {
	    if ( $post_id ) {
		    return get_permalink( get_post( $post_id ) );
	    }

        return $this->url_origin( $_SERVER, false ) . $_SERVER['REQUEST_URI'];
    }

    public function is_cli(){

        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return true;
        }

        return false;
        
    }

    public static function log( $object, $callee = false ) {

	    if ( ! defined( 'UUCSS_DEBUG' ) || UUCSS_DEBUG == false ) {
		    return false;
	    }

	    $data = is_string( $object ) ? $object : json_encode( $object, JSON_PRETTY_PRINT );
	    error_log( "[UUCSS_LOG] " . $data );

	    if ( $callee ) {

		    error_log( "[UUCSS_LOG] " . json_encode( [
				    "file" => debug_backtrace()[1]['file'],
				    "function" => debug_backtrace()[1]['function'],
				    "class" => debug_backtrace()[1]['class'],
				    "args" => debug_backtrace()[1]['args'],
			    ], JSON_PRETTY_PRINT));

	    }

	    return $object;
    }

    public static function add_admin_notice($message, $type='error') {

        add_action('admin_notices', function () use ($message, $type) {

            echo "<div class=\"notice notice-$type is-dismissible\">
                    <p>$message</p>
                 </div>";

        });

    }

    protected function encode($data)
    {
        return rtrim(md5($data));
    }

    function dirSize($directory) {
        $size = 0;
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file){
            $size+=$file->getSize();
        }
        return $size;
    }


    function human_file_size($bytes, $decimals = 2) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }


    protected function file_name($file, $hash_suffix = null){
    	$file_hash = $this->encode($file . json_encode($hash_suffix));
        return 'uucss-' . $file_hash . '-'. explode("?", basename($file))[0];
    }

    function str_contains($string, $find){
	    if (strpos( $string, $find ) !== false ) {
		    return true;
	    }

	    return false;
    }

}
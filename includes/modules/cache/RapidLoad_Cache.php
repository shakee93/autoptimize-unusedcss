<?php

class RapidLoad_Cache
{

    public static $cache_dir;
    public static $cache_file;
    public static $request_headers;
    public static $base_dir;
    public static $settings;
    public static $started;

    public static $base_instance;

    public static function get(){
        if(!self::$base_instance){
            self::$base_instance = new RapidLoad_Cache();
        }
        return self::$base_instance;
    }

    public function __construct()
    {
        self::$started = true;
        self::$request_headers = self::get_request_headers();



        //self::$settings = self::fetch_options();

        if(!self::$base_instance){
            add_filter('uucss/enqueue/content/update', [$this, 'cache_page'], 100);
            self::$base_instance = $this;
        }
    }

    public function cache_page($state){

        if(self::$started){
            $this->forceFilePutContents(RapidLoad_Cache::$cache_file, $state['dom']);
        }

        return $state;
    }

    public static function setup_cache($status){

        if($status == "1"){
            self::create_advanced_cache_file();
        }else{
            @unlink(WP_CONTENT_DIR . '/advanced-cache.php');
        }

    }

    public static function deliver_cache(){

        $cache_file = self::get_cache_file();

        error_log($cache_file);

        if ( self::cache_exists( $cache_file ) && ! self::cache_expired( $cache_file ) ) {
            header( 'X-Cache-Handler: rapidload-cache-engine' );

            if ( strtotime( self::$request_headers['If-Modified-Since'] >= filemtime( $cache_file ) ) ) {
                header( self::sanitize_server_input( $_SERVER['SERVER_PROTOCOL'] ) . ' 304 Not Modified', true, 304 );
                exit; // Deliver empty body.
            }

            switch ( substr( $cache_file, -2, 2 ) ) {
                case 'br':
                    header( 'Content-Encoding: br' );
                    break;
                case 'gz':
                    header( 'Content-Encoding: gzip' );
                    break;
            }

            readfile( $cache_file );
            exit;
        }

        return false;

    }

    public static function create_advanced_cache_file() {

        if ( ! is_writable( WP_CONTENT_DIR ) ) {
            return false;
        }

        if(!defined('RAPIDLOAD_PLUGIN_DIR')){
            error_log('return here');
            return false;
        }

        $advanced_cache_sample_file = RAPIDLOAD_PLUGIN_DIR . '/includes/modules/cache/advanced-cache.php';

        if ( ! is_readable( $advanced_cache_sample_file ) ) {
            return false;
        }

        $advanced_cache_file          = WP_CONTENT_DIR . '/advanced-cache.php';
        $advanced_cache_file_contents = file_get_contents( $advanced_cache_sample_file );

        $search  = '/your/path/to/constant/file';
        $replace = RAPIDLOAD_PLUGIN_DIR . '/constants.php';

        $advanced_cache_file_contents = str_replace( $search, $replace, $advanced_cache_file_contents );
        $advanced_cache_file_created  = file_put_contents( $advanced_cache_file, $advanced_cache_file_contents, LOCK_EX );

        return ( $advanced_cache_file_created === false ) ? false : $advanced_cache_file;
    }

    public static function get_cache_file() {

        if ( ! empty( self::$cache_file ) ) {
            return self::$cache_file;
        }

        self::$cache_file = sprintf(
            '%s/%s',
            self::get_cache_dir(),
            self::get_cache_file_name()
        );

        return self::$cache_file;
    }

    private static function get_cache_dir( $url = null ) {

        if ( empty ( $url ) ) {
            $url = 'http://' . self::$request_headers['Host'] . self::sanitize_server_input( $_SERVER['REQUEST_URI'], false );
        }

        $url_host = parse_url( $url, PHP_URL_HOST );
        if ( ! is_string( $url_host ) ) {
            return self::get_base_dir();
        }

        $url_path = parse_url( $url, PHP_URL_PATH );
        if ( ! is_string( $url_path ) ) {
            $url_path = '';
        } elseif ( substr( $url_path, -1, 1 ) === '*' ) {
            $url_path = dirname( $url_path );
        }

        $cache_dir = sprintf(
            '%s/%s%s',
            self::get_base_dir(),
            strtolower( $url_host ),
            $url_path
        );

        $cache_dir = rtrim( $cache_dir, '/\\' );

        return $cache_dir;
    }

    public static function get_cache_file_name(){
        $cache_keys      = self::get_cache_keys();
        $cache_file_name = $cache_keys['scheme'] . 'index' . $cache_keys['device'] . $cache_keys['webp'] . '.html' . $cache_keys['compression'];

        return $cache_file_name;
    }

    private static function get_cache_keys() {

        $cache_keys = array(
            'scheme'      => 'http-',
            'device'      => '',
            'webp'        => '',
            'compression' => '',
        );

        if ( isset( $_SERVER['HTTPS'] ) && ( strtolower( $_SERVER['HTTPS'] ) === 'on' || $_SERVER['HTTPS'] == '1' ) ) {
            $cache_keys['scheme'] = 'https-';
        } elseif ( isset( $_SERVER['SERVER_PORT'] ) && $_SERVER['SERVER_PORT'] == '443' ) {
            $cache_keys['scheme'] = 'https-';
        } elseif ( self::$request_headers['X-Forwarded-Proto'] === 'https'
            || self::$request_headers['X-Forwarded-Scheme'] === 'https'
        ) {
            $cache_keys['scheme'] = 'https-';
        }

        if ( isset(self::$settings['mobile_cache']) && self::$settings['mobile_cache'] == "1" ) {
            if ( strpos( self::$request_headers['User-Agent'], 'Mobile' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'Android' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'Silk/' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'Kindle' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'BlackBerry' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'Opera Mini' ) !== false
                || strpos( self::$request_headers['User-Agent'], 'Opera Mobi' ) !== false
            ) {
                $cache_keys['device'] = '-mobile';
            }
        }

        if ( isset(self::$settings['convert_image_urls_to_webp']) && self::$settings['convert_image_urls_to_webp'] == "1" ) {
            if ( strpos( self::$request_headers['Accept'], 'image/webp' ) !== false ) {
                $cache_keys['webp'] = '-webp';
            }
        }

        if ( isset(self::$settings['compress_cache']) && self::$settings['compress_cache'] == "1" ) {
            if ( function_exists( 'brotli_compress' )
                && $cache_keys['scheme'] === 'https-'
                && strpos( self::$request_headers['Accept-Encoding'], 'br' ) !== false
            ) {
                $cache_keys['compression'] = '.br';
            } elseif ( strpos( self::$request_headers['Accept-Encoding'], 'gzip' ) !== false ) {
                $cache_keys['compression'] = '.gz';
            }
        }

        return $cache_keys;
    }

    private static function get_request_headers() {

        if ( ! empty( self::$request_headers ) ) {
            return self::$request_headers;
        }

        $request_headers = function_exists( 'apache_request_headers' ) ? apache_request_headers() : array();

        $request_headers = array(
            'Accept'             => isset( $request_headers['Accept'] ) ? self::sanitize_server_input( $request_headers['Accept'] ) : ( isset( $_SERVER['HTTP_ACCEPT'] ) ? self::sanitize_server_input( $_SERVER['HTTP_ACCEPT'] ) : '' ),
            'Accept-Encoding'    => isset( $request_headers['Accept-Encoding'] ) ? self::sanitize_server_input( $request_headers['Accept-Encoding'] ) : ( isset( $_SERVER['HTTP_ACCEPT_ENCODING'] ) ? self::sanitize_server_input( $_SERVER['HTTP_ACCEPT_ENCODING'] ) : '' ),
            'Host'               => isset( $request_headers['Host'] ) ? self::sanitize_server_input( $request_headers['Host'] ) : ( isset( $_SERVER['HTTP_HOST'] ) ? self::sanitize_server_input( $_SERVER[ 'HTTP_HOST' ] ) : '' ),
            'If-Modified-Since'  => isset( $request_headers['If-Modified-Since'] ) ? self::sanitize_server_input( $request_headers['If-Modified-Since'] ) : ( isset( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) ? self::sanitize_server_input( $_SERVER['HTTP_IF_MODIFIED_SINCE'] ) : '' ),
            'User-Agent'         => isset( $request_headers['User-Agent'] ) ? self::sanitize_server_input( $request_headers['User-Agent'] ) : ( isset( $_SERVER['HTTP_USER_AGENT'] ) ? self::sanitize_server_input( $_SERVER['HTTP_USER_AGENT'] ) : '' ),
            'X-Forwarded-Proto'  => isset( $request_headers['X-Forwarded-Proto'] ) ? self::sanitize_server_input( $request_headers['X-Forwarded-Proto'] ) : ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ? self::sanitize_server_input( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) : '' ),
            'X-Forwarded-Scheme' => isset( $request_headers['X-Forwarded-Scheme'] ) ? self::sanitize_server_input( $request_headers['X-Forwarded-Scheme'] ) : ( isset( $_SERVER['HTTP_X_FORWARDED_SCHEME'] ) ? self::sanitize_server_input( $_SERVER['HTTP_X_FORWARDED_SCHEME'] ) : '' ),
        );

        return $request_headers;
    }

    public static function sanitize_server_input($str, $strict = true) {

        if ( is_object( $str ) || is_array( $str ) ) {
            return '';
        }

        $str = (string) $str;
        if ( 0 === strlen( $str ) ) {
            return '';
        }

        $filtered = preg_replace( '/[\r\n\t ]+/', ' ', $str );
        $filtered = trim( $filtered );

        if ( $strict ) {
            $found = false;
            while ( preg_match( '/%[a-f0-9]{2}/i', $filtered, $match ) ) {
                $filtered = str_replace( $match[0], '', $filtered );
                $found    = true;
            }

            if ( $found ) {
                $filtered = trim( preg_replace( '/ +/', ' ', $filtered ) );
            }
        }

        return $filtered;
    }

    public static function get_base_dir(){

        if(!self::$base_dir){
            self::$base_dir = WP_CONTENT_DIR . '/cache/rapidload/cache';
        }

        return self::$base_dir;
    }

    public static function fetch_options($cache = true)
    {

        if(isset(self::$settings) && $cache){
            return self::$settings;
        }

        if(is_multisite()){

            self::$settings = get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', []);

        }else{

            self::$settings = get_option( 'autoptimize_uucss_settings', [] );
        }

        return self::$settings;
    }

    public static function cache_exists( $cache_file ) {

        return is_readable( $cache_file );
    }

    public static function cache_expired( $cache_file ) {

        if ( ! self::$settings['cache_expires'] || self::$settings['cache_expiry_time'] === 0 ) {
            return false;
        }

        $expires_seconds = 3600 * self::$settings['cache_expiry_time'];

        if ( ( filemtime( $cache_file ) + $expires_seconds ) <= time() ) {
            return true;
        }

        return false;
    }

    public static function should_start() {

        $valid_engine_running = ( ( ! is_multisite() || ! ms_is_switched() ) );
        $early_ajax_request   = ( defined( 'DOING_AJAX' ) && DOING_AJAX );
        $rest_request         = ( defined( 'REST_REQUEST' ) && REST_REQUEST );
        $xmlrpc_request       = ( defined( 'XMLRPC_REQUEST' ) && XMLRPC_REQUEST );
        $bad_request_uri      = ( str_replace( array( '.ico', '.txt', '.xml', '.xsl' ), '', $_SERVER['REQUEST_URI'] ) !== $_SERVER['REQUEST_URI'] );
        $doing_cron           = wp_doing_cron();

        self::$started = !$early_ajax_request && !$rest_request && !$xmlrpc_request && !$doing_cron && !$bad_request_uri && class_exists( 'RapidLoad_Cache' );

        return self::$started;
    }

    function forceFilePutContents ($filepath, $message){
        try {
            $isInFolder = preg_match("/^(.*)\/([^\/]+)$/", $filepath, $filepathMatches);
            if($isInFolder) {
                $folderName = $filepathMatches[1];
                $fileName = $filepathMatches[2];
                if (!is_dir($folderName)) {
                    mkdir($folderName, 0777, true);
                }
            }
            file_put_contents($filepath, $message);
        } catch (Exception $e) {
            echo "ERR: error writing '$message' to '$filepath', ". $e->getMessage();
        }
    }
}
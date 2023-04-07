<?php

class RapidLoad_Cache
{

    public static $options = [];

    public static function init() {

        new self();
    }

    public function __construct()
    {
        self::$options = RapidLoad_Base::fetch_options();

        if(!isset(self::$options['uucss_enable_cache']) || self::$options['uucss_enable_cache'] != "1" ){
            return;
        }

        RapidLoad_Cache_Engine::start();

        add_filter('uucss/enqueue/content/update', [$this, 'cache_page'], 100);

    }

    public function cache_page($state){

        if(isset($state['dom']) && RapidLoad_Cache_Engine::$to_be_cached){

            $content = $state['dom']->__toString();

            if (RapidLoad_Cache_Engine::is_cacheable( $content ) && !RapidLoad_Cache_Engine::bypass_cache()) {

                RapidLoad_Cache_Store::cache_page( $content );
            }

        }

        return $state;
    }

    public static function setup_cache($status){

        if($status == "1"){

            RapidLoad_Cache_Store::create_advanced_cache_file();
            RapidLoad_Cache_Store::set_wp_cache_constant();

        }else{

            RapidLoad_Cache_Store::clean();

        }

    }

    public static function get_settings( $update = true ) {

        $settings = get_option( 'rapidload_cache' );

        if ( $settings === false || ! isset( $settings['version'] ) || $settings['version'] !== UUCSS_VERSION ) {
            if ( $update ) {
                self::update();
                $settings = self::get_settings( false );
            }
        }

        return $settings;
    }

    public static function update() {

        self::update_disk();
        self::update_backend();
        self::clear_site_cache();
    }

    public static function update_backend() {

        delete_metadata( 'user', 0, '_clear_post_cache_on_update', '', true ); // < 1.5.0

        $old_value = get_option( 'rapidload_cache', array() );
        $value     = self::upgrade_settings( $old_value );
        $value     = self::validate_settings( $value );

        update_option( 'cache_enabler', $value );

        if ( has_action( 'update_option', array( __CLASS__, 'on_update_option' ) ) === false ) {
            self::on_update_backend( 'cache_enabler', $value );
        }

        return $value;
    }

    public static function on_update_backend( $option, $value ) {

        RapidLoad_Cache_Store::create_settings_file( $value );

        self::unschedule_events();
    }

    public static function unschedule_events() {

        $events = self::get_events();

        foreach ( $events as $hook => $recurrence ) {
            wp_unschedule_event( wp_next_scheduled( $hook ), $hook );
        }
    }

    private static function get_events() {

        $events = array( 'rapidload_clear_expired_cache' => 'hourly' );

        return $events;
    }

    private static function upgrade_settings( $settings ) {

        if ( empty( $settings ) ) {
            return $settings;
        }

        // < 1.5.0
        if ( isset( $settings['expires'] ) && $settings['expires'] > 0 ) {
            $settings['cache_expires'] = 1;
        }

        // < 1.5.0
        if ( isset( $settings['minify_html'] ) && $settings['minify_html'] === 2 ) {
            $settings['minify_html'] = 1;
            $settings['minify_inline_css_js'] = 1;
        }

        $settings_names = array(
            'excl_regexp'                            => 'excluded_page_paths',
            'incl_attributes'                        => '',
            'expires'                                => 'cache_expiry_time',
            'new_post'                               => 'clear_site_cache_on_saved_post',
            'update_product_stock'                   => '',
            'new_comment'                            => 'clear_site_cache_on_saved_comment',
            'clear_on_upgrade'                       => 'clear_site_cache_on_changed_plugin',
            'webp'                                   => 'convert_image_urls_to_webp',
            'compress'                               => 'compress_cache',
            'excl_ids'                               => 'excluded_post_ids',
            'excl_paths'                             => 'excluded_page_paths',
            'excl_cookies'                           => 'excluded_cookies',
            'incl_parameters'                        => '',
            'clear_complete_cache_on_saved_post'     => 'clear_site_cache_on_saved_post',
            'clear_complete_cache_on_new_comment'    => 'clear_site_cache_on_saved_comment',
            'clear_complete_cache_on_changed_plugin' => 'clear_site_cache_on_changed_plugin',
            'clear_site_cache_on_new_comment'        => 'clear_site_cache_on_saved_comment',
        );

        foreach ( $settings_names as $old_name => $new_name ) {
            if ( array_key_exists( $old_name, $settings ) ) {
                if ( ! empty( $new_name ) ) {
                    $settings[ $new_name ] = $settings[ $old_name ];
                }

                unset( $settings[ $old_name ] );
            }
        }

        return $settings;
    }

    private static function get_default_settings( $settings_type = '' ) {

        switch ( $settings_type ) {
            case 'system':
                return self::get_default_system_settings();
            case 'user':
                return self::get_default_user_settings();
            default:
                return wp_parse_args( self::get_default_user_settings(), self::get_default_system_settings() );
        }
    }

    private static function get_default_user_settings() {

        $default_user_settings = array(
            'cache_expires'                      => 0,
            'cache_expiry_time'                  => 0,
            'clear_site_cache_on_saved_post'     => 0,
            'clear_site_cache_on_saved_comment'  => 0,
            'clear_site_cache_on_saved_term'     => 0,
            'clear_site_cache_on_saved_user'     => 0,
            'clear_site_cache_on_changed_plugin' => 0,
            'convert_image_urls_to_webp'         => 0,
            'mobile_cache'                       => 0,
            'compress_cache'                     => 0,
            'minify_html'                        => 0,
            'minify_inline_css_js'               => 0,
            'excluded_post_ids'                  => '',
            'excluded_page_paths'                => '',
            'excluded_query_strings'             => '',
            'excluded_cookies'                   => '',
        );

        return $default_user_settings;
    }

    private static function get_default_system_settings() {

        $default_system_settings = array(
            'version'              => (string) UUCSS_VERSION,
            'use_trailing_slashes' => (int) ( substr( get_option( 'permalink_structure' ), -1, 1 ) === '/' ),
            'permalink_structure'  => (string) self::get_permalink_structure(), // Deprecated in 1.8.0.
        );

        return $default_system_settings;
    }

    private static function get_permalink_structure() {

        $permalink_structure = get_option( 'permalink_structure' );

        if ( $permalink_structure && preg_match( '/\/$/', $permalink_structure ) ) {
            return 'has_trailing_slash';
        }

        if ( $permalink_structure && ! preg_match( '/\/$/', $permalink_structure ) ) {
            return 'no_trailing_slash';
        }

        if ( empty( $permalink_structure ) ) {
            return 'plain';
        }
    }

    public static function validate_settings( $settings ) {

        $settings = (array) apply_filters( 'rapidload_settings_before_validation', $settings );
        $settings = wp_parse_args( $settings, self::get_default_settings( 'user' ) );

        $validated_settings = wp_parse_args( array(
            'cache_expires'                      => (int) ( ! empty( $settings['cache_expires'] ) ),
            'cache_expiry_time'                  => absint( $settings['cache_expiry_time'] ),
            'clear_site_cache_on_saved_post'     => (int) ( ! empty( $settings['clear_site_cache_on_saved_post'] ) ),
            'clear_site_cache_on_saved_comment'  => (int) ( ! empty( $settings['clear_site_cache_on_saved_comment'] ) ),
            'clear_site_cache_on_saved_term'     => (int) ( ! empty( $settings['clear_site_cache_on_saved_term'] ) ),
            'clear_site_cache_on_saved_user'     => (int) ( ! empty( $settings['clear_site_cache_on_saved_user'] ) ),
            'clear_site_cache_on_changed_plugin' => (int) ( ! empty( $settings['clear_site_cache_on_changed_plugin'] ) ),
            'convert_image_urls_to_webp'         => (int) ( ! empty( $settings['convert_image_urls_to_webp'] ) ),
            'mobile_cache'                       => (int) ( ! empty( $settings['mobile_cache'] ) ),
            'compress_cache'                     => (int) ( ! empty( $settings['compress_cache'] ) ),
            'minify_html'                        => (int) ( ! empty( $settings['minify_html'] ) ),
            'minify_inline_css_js'               => (int) ( ! empty( $settings['minify_inline_css_js'] ) ),
            'excluded_post_ids'                  => (string) sanitize_text_field( $settings['excluded_post_ids'] ),
            'excluded_page_paths'                => (string) self::validate_regex( $settings['excluded_page_paths'] ),
            'excluded_query_strings'             => (string) self::validate_regex( $settings['excluded_query_strings'] ),
            'excluded_cookies'                   => (string) self::validate_regex( $settings['excluded_cookies'] ),
        ), self::get_default_settings( 'system' ) );

        if ( ! empty( $settings['clear_site_cache_on_saved_settings'] ) ) {
            self::clear_site_cache();
            set_transient( self::get_cache_cleared_transient_name(), 1 );
        }

        return $validated_settings;
    }

    public static function validate_regex( $regex ) {

        if ( ! empty( $regex ) ) {
            if ( ! preg_match( '/^\/.*\/$/', $regex ) ) {
                $regex = '/' . $regex . '/';
            }

            if ( @preg_match( $regex, null ) === false ) {
                return '';
            }

            $validated_regex = sanitize_text_field( $regex );

            return $validated_regex;
        }

        return '';
    }

    private static function get_cache_cleared_transient_name() {

        $transient_name = 'rapidlaod_cache_cleared_' . get_current_user_id();

        return $transient_name;
    }

    public static function clear_site_cache( $site = null ) {

        self::clear_page_cache_by_site( $site );
    }

    public static function clear_page_cache_by_site( $site, $args = array() ) {

        $blog_id = self::get_blog_id( $site );

        if ( $blog_id === 0 ) {
            return; // Page cache does not exist.
        }

        if ( is_array( $args ) ) {
            $args['subpages']['exclude'] = self::get_root_blog_exclusions();

            if ( ! isset( $args['hooks']['include'] ) ) {
                $args['hooks']['include'] = 'cache_enabler_complete_cache_cleared,cache_enabler_site_cache_cleared';
            }
        }

        self::clear_page_cache_by_url( get_home_url( $blog_id ), $args );
    }

    public static function clear_page_cache_by_url( $url, $args = array() ) {

        if ( is_array( $args ) ) {
            $args['clear'] = 1;

            if ( ! isset( $args['hooks']['include'] ) ) {
                $args['hooks']['include'] = 'rapidload_page_cache_cleared';
            }
        }

        RapidLoad_Cache_Store::cache_iterator( $url, $args );
    }

    public static function get_blog_path_from_url( $url ) {

        $url_path        = (string) parse_url( $url, PHP_URL_PATH );
        $url_path_pieces = explode( '/', trim( $url_path, '/' ) );
        $blog_path       = '/';
        $blog_paths      = self::get_blog_paths();

        foreach ( $url_path_pieces as $url_path_piece ) {
            $url_path_piece = '/' . $url_path_piece . '/';

            if ( in_array( $url_path_piece, $blog_paths, true ) ) {
                $blog_path = $url_path_piece;
                break;
            }
        }

        return $blog_path;
    }

    private static function get_root_blog_exclusions() {

        if ( ! is_multisite() || is_subdomain_install() ) {
            return array();
        }

        $current_blog_path  = self::get_blog_path();
        $network_blog_paths = self::get_blog_paths();

        if ( ! in_array( $current_blog_path, $network_blog_paths, true ) ) {
            return $network_blog_paths;
        }

        return array();
    }

    public static function get_blog_paths() {

        if ( is_multisite() ) {
            global $wpdb;
            $blog_paths = $wpdb->get_col( "SELECT path FROM $wpdb->blogs" );
        } else {
            $blog_paths = array( '/' );
        }

        return $blog_paths;
    }

    public static function get_blog_path() {

        $site_url_path        = (string) parse_url( home_url(), PHP_URL_PATH );
        $site_url_path_pieces = explode( '/', trim( $site_url_path, '/' ) );

        $blog_path = end( $site_url_path_pieces );
        $blog_path = ( ! empty( $blog_path ) ) ? '/' . $blog_path . '/' : '';

        return $blog_path;
    }

    private static function get_blog_id( $site = null ) {

        if ( empty( $site ) ) {
            return get_current_blog_id();
        }

        if ( $site instanceof WP_Site ) {
            return (int) $site->blog_id;
        }

        if ( is_numeric( $site ) ) {
            $blog_id = (int) $site;

            if ( in_array( $blog_id, self::get_blog_ids(), true ) ) {
                return $blog_id;
            }
        }

        return 0;
    }

    public static function update_disk() {

        if ( is_multisite() ) {
            if ( get_site_transient( 'rapidload_disk_updated' ) !== UUCSS_VERSION ) {
                self::each_site( true, 'RapidLoad_Cash_Store::clean' );
                RapidLoad_Cache_Store::setup();
                set_site_transient( 'rapidload_disk_updated', UUCSS_VERSION, HOUR_IN_SECONDS );
            }
        } else {
            RapidLoad_Cache_Store::clean();
            RapidLoad_Cache_Store::setup();
        }
    }

    private static function each_site( $sites, $callback, $callback_params = array(), $restart_engine = false ) {

        $blog_ids          = $sites ? self::get_blog_ids() : array( get_current_blog_id() );
        $last_blog_id      = end( $blog_ids );
        $skip_active_check = ! self::is_rapidload_active();
        $callback_return   = array();

        foreach ( $blog_ids as $blog_id ) {
            self::switch_to_blog( $blog_id, $restart_engine, $skip_active_check );

            if ( $skip_active_check || self::is_rapidload_active() ) {
                $callback_return[ $blog_id ] = call_user_func_array( $callback, $callback_params );
            }

            $_restart_engine = ( $restart_engine && $blog_id === $last_blog_id ) ? true : false;

            self::restore_current_blog( $_restart_engine, $skip_active_check );
        }

        return $callback_return;
    }

    private static function get_blog_ids() {

        if ( is_multisite() ) {
            global $wpdb;
            $blog_ids = array_map( 'absint', $wpdb->get_col( "SELECT blog_id FROM $wpdb->blogs" ) );
        } else {
            $blog_ids = array( 1 );
        }

        return $blog_ids;
    }

    private static function is_rapidload_active() {

        if ( in_array( CACHE_ENABLER_BASE, (array) get_option( 'active_plugins', array() ), true ) ) {
            return true;
        }

        if ( ! is_multisite() ) {
            return false;
        }

        $plugins = get_site_option( 'active_sitewide_plugins' );
        if ( isset( $plugins[ RAPIDLOAD_BASE ] ) ) {
            return true;
        }

        return false;
    }

    public static function switch_to_blog( $blog_id, $restart_engine = false, $force_restart = false ) {

        if ( ! is_multisite() || $blog_id === get_current_blog_id() ) {
            return false;
        }

        switch_to_blog( $blog_id );

        if ( ( $force_restart || self::is_rapidload_active() ) && $restart_engine ) {
            RapidLoad_Cache_Engine::start();
        }

        return true;
    }

    public static function restore_current_blog( $restart_engine = false, $force_restart = false  ) {

        if ( ! is_multisite() || ! ms_is_switched() ) {
            return false;
        }

        restore_current_blog();

        if ( ( $force_restart || self::is_rapidload_active() ) && $restart_engine ) {
            Cache_Enabler_Engine::start( true );
        }

        return true;
    }

    public static function get_cache_index() {

        $args['subpages']['exclude'] = self::get_root_blog_exclusions();
        $cache = RapidLoad_Cache_Store::cache_iterator( home_url(), $args );
        $cache_index = $cache['index'];

        return $cache_index;
    }
}
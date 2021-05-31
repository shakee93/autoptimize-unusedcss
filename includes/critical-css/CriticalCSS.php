<?php

namespace RapidLoad\Service;

abstract class CriticalCSS{

    use \RapidLoad_Utils;

    public static $base_dir;
    public $file_system;

    public function __construct()
    {
        $this->file_system = new \RapidLoad_FileSystem();

        self::$base_dir = apply_filters('rccss/cache-base-dir', WP_CONTENT_DIR . '/cache/rapidload/') . 'rccss';

        if ( ! $this->initFileSystem() ) {
            self::add_admin_notice( 'RapidLoad : couldn\'t access wordpress cache directory <b>(' . self::$base_dir . ')</b>. check for file permission issues in your site.' );

            return;
        }

        add_filter('uucss/path/critical-css', [$this, 'get_path_critical_css'], 10, 2);
    }

    public function initFileSystem()
    {
        if ( ! $this->file_system ) {
            return false;
        }

        if ( ! $this->init_base_dir() ) {
            return false;
        }

        $this->init_log_dir();

        return true;
    }

    public function init_log_dir()
    {

        if ( $this->file_system->exists( UUCSS_LOG_DIR ) ) {
            return true;
        }

        $created = $this->file_system->mkdir( UUCSS_LOG_DIR , 0755, !$this->file_system->exists( wp_get_upload_dir()['basedir'] . '/rapidload/' ));

        if (!$created || ! $this->file_system->is_writable( UUCSS_LOG_DIR ) || ! $this->file_system->is_readable( UUCSS_LOG_DIR ) ) {
            return false;
        }

        return true;
    }

    public function init_base_dir() {

        if ( $this->file_system->exists( self::$base_dir ) ) {
            return true;
        }

        // make dir if not exists
        $created = $this->file_system->mkdir( self::$base_dir );

        if (!$created || ! $this->file_system->is_writable( self::$base_dir ) || ! $this->file_system->is_readable( self::$base_dir ) ) {
            return false;
        }

        return true;
    }

    public function get_path_critical_css($critical_css, $url){

        if(CriticalCSS_DB::path_ccss_exist($url)){

            $path = new CriticalCSS_Path([
                'url' => $url
            ]);
            if(isset($path->critical_css)){
                $critical_css = $path->critical_css;
            }

        }

        return $critical_css;
    }

    public function api_options( $post_id = false ) {

        $cacheBusting = false;

        if(isset($this->options['uucss_cache_busting_v2'])){

            $cacheBusting = apply_filters('uucss/cache/bust',[]);

        }

        return apply_filters('uucss/api/options', [
            "cacheBusting"          => $cacheBusting,
        ]);
    }
}
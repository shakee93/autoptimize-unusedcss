<?php
/*
Plugin Name: RapidLoad Power-Up for Autoptimize
Plugin URI:  https://rapidload.io/
Description: Makes your site even faster and lighter by automatically removing Unused CSS from your website.
Version:     1.4.11.12
Author:      RapidLoad
Author URI:  https://rapidload.io/
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class RapidLoad{

    public $version = '1.4.11.12';
    public $db_version = '1.2';
    private $container = [];
    private $messages = [];
    protected static $instance = null;

    public function __isset( $prop ) {
        return isset( $this->{$prop} ) || isset( $this->container[ $prop ] );
    }

    public function __get( $prop ) {
        if ( array_key_exists( $prop, $this->container ) ) {
            return $this->container[ $prop ];
        }

        if ( isset( $this->{$prop} ) ) {
            return $this->{$prop};
        }

        return null;
    }

    public static function get() {
        if ( is_null( self::$instance ) && ! ( self::$instance instanceof RapidLoad ) ) {
            self::$instance = new RapidLoad();
            self::$instance->setup();
        }

        return self::$instance;
    }

    private function setup() {

        $this->define_constants();

        if ( ! $this->is_requirements_meet() ) {
            return;
        }

        $this->includes();

        $this->instantiate();

        do_action( 'rapidload/loaded' );

    }

    private function is_requirements_meet(){
        return true;
    }

    private function define_constants() {

        define( 'UUCSS_VERSION', '1.4.11.12' );
        define( 'UUCSS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
        define( 'UUCSS_PLUGIN_FILE', __FILE__ );

        if ( is_multisite() ) {
            $blog_id = get_current_blog_id();
            define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] . '/rapidload/' . date('Ymd') . '/' . $blog_id . '/');
        } else {
            define('UUCSS_LOG_DIR', wp_get_upload_dir()['basedir'] .  '/rapidload/' . date('Ymd') . '/');
        }
    }

    private function includes() {

        require __DIR__ . '/vendor/autoload.php';

    }

    private function instantiate() {

        $this->container['file_system'] = new RapidLoad_FileSystem();

        RapidLoad_Base::init();

        $this->load_3rd_party();

        $this->init_actions();

    }

    private function load_3rd_party() {

        RapidLoad_ThirdParty::initialize();

    }

    private function init_actions() {

        register_activation_hook( UUCSS_PLUGIN_FILE, 'UnusedCSS_Autoptimize_Onboard::uucss_activate' );

        register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_DB::initialize' );

        register_uninstall_hook(UUCSS_PLUGIN_FILE, 'RapidLoad_DB::drop');

    }

}

function rapidload() {
    return RapidLoad::get();
}

add_action( 'plugins_loaded', function () {

    rapidload();
});


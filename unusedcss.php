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

        $this->init_actions();

        add_action('plugins_loaded', function (){
            $this->instantiate();
        });

        do_action( 'rapidload/loaded' );

    }

    private function is_requirements_meet(){

        if(empty($this->messages)){
            return true;
        }

        add_action( 'admin_init', [ $this, 'auto_deactivate' ] );
        add_action( 'admin_notices', [ $this, 'activation_error' ] );

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

        $this->container['rapidload_admin'] = new RapidLoad_Admin();;
        $this->container['file_system'] = new RapidLoad_FileSystem();
        $this->container['rapidload_module'] = new RapidLoad_Module();

        $this->load_3rd_party();

        RapidLoad_Base::init();
    }

    public function admin(){
        return $this->__get('rapidload_admin');
    }

    public function file_system(){
        return $this->__get('file_system');
    }

    public function rapidload_module(){
        return $this->__get('rapidload_module');
    }

    private function load_3rd_party() {

        RapidLoad_ThirdParty::initialize();

    }

    private function init_actions() {

        register_activation_hook( UUCSS_PLUGIN_FILE, 'UnusedCSS_Autoptimize_Onboard::uucss_activate' );

        register_activation_hook( UUCSS_PLUGIN_FILE, 'RapidLoad_DB::initialize' );

        register_uninstall_hook(UUCSS_PLUGIN_FILE, 'RapidLoad_DB::drop');

    }

    public function auto_deactivate() {
        deactivate_plugins( plugin_basename( UUCSS_PLUGIN_FILE ) );
        if ( isset( $_GET['activate'] ) ) { // phpcs:ignore
            unset( $_GET['activate'] ); // phpcs:ignore
        }
    }

    public function activation_error() {
        ?>
        <div class="notice rapidload-notice notice-error">
            <p>
                <?php echo join( '<br>', $this->messages ); // phpcs:ignore ?>
            </p>
        </div>
        <?php
    }

}

function rapidload() {
    return RapidLoad::get();
}

rapidload();


<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin extends UnusedCSS_Admin {

    use UnusedCSS_Utils;


    /**
     * UnusedCSS constructor.
     * @param UnusedCSS_Autoptimize $ao_uucss
     */
    public function __construct($ao_uucss)
    {

	    if ( !$ao_uucss->deps_available ) {
		    return;
	    }

	    if ( is_admin() ) {

		    add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
		    add_filter( 'autoptimize_filter_settingsscreen_tabs', [ $this, 'add_ao_tab' ], 20, 1 );
		    add_action( 'updated_option', [ $this, 'clear_cache_on_option_update' ] );
		    add_action( "wp_ajax_verify_api_key", [ $this, 'verify_api_key' ] );
	    }

	    add_action( 'wp_print_scripts', function () {
		    wp_enqueue_script( 'wp-util' );
	    } );

	    if ( ! self::enabled() ) {
		    self::$enabled = false;

		    return;
	    }

	    add_action( 'admin_bar_menu', function () {


		    global $wp_admin_bar;

		    $wp_admin_bar->add_node( array(
			    'id'     => 'autoptimize-uucss',
			    'title'  => $this->get_node_text(),
			    'parent' => 'autoptimize',
			    'tag' => 'div'
		    ));

	    }, 1 );

	    parent::__construct($ao_uucss);

    }



    public function get_node_text()
    {
        ob_start();

        include('parts/admin-node.html.php');

        $output = ob_get_contents();
        ob_end_clean();

        return $output;
    }

    public static function fetch_options()
    {
        return autoptimizeOptionWrapper::get_option( 'autoptimize_uucss_settings' );
    }

    public static function enabled() {

	    if ( autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "" ) {
		    self::add_admin_notice( "Autoptimize UnusedCSS Plugin only works css optimization is enabled", 'warning' );

		    return false;
	    }

	    if ( ! self::enabled_via_ao() ) {
		    return false;
	    }

	    if ( ! self::is_api_key_verified() ) {
		    return false;
	    }

	    if ( is_multisite() ) {
		    self::add_admin_notice( "UnusedCSS not supported for multisite" );

		    return false;
	    }

	    return true;
    }


	public static function enabled_via_ao() {
		return isset( static::fetch_options()['autoptimize_uucss_enabled'] );
	}

	public static function is_api_key_verified() {

		$api_key_status = isset( static::fetch_options()['uucss_api_key_verified'] ) ? static::fetch_options()['uucss_api_key_verified'] : '';

		return $api_key_status == '1';

	}


	public function add_ao_tab( $in ) {

		$in = array_merge( $in, array(
			'uucss' => __( '🔥 UnusedCSS', 'autoptimize' ),
		) );

		return $in;
	}


    public function add_ao_page()
    {

        add_submenu_page(null, 'UnusedCSS', 'UnusedCSS', 'manage_options', 'uucss', function () {
            wp_enqueue_script('post');

            ?>
            <div class="wrap">
                <h1><?php _e('Autoptimize Settings', 'autoptimize'); ?></h1>
                <?php echo autoptimizeConfig::ao_admin_tabs(); ?>
                <div>
                    <?php $this->render_form() ?>
                </div>
            </div>

            <?php
        });

        register_setting('autoptimize_uucss_settings', 'autoptimize_uucss_settings');

    }


    public function render_form()
    {
        $options       = $this->fetch_options();
        include('parts/options-page.html.php');
    }

	public function clear_cache_on_option_update( $option ) {

		if ( $option == 'autoptimize_uucss_settings' && $this->uucss ) {
			$this->uucss->clear_cache();
		}

	}
}

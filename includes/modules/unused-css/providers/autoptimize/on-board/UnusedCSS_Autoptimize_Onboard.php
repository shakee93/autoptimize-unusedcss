<?php

/**
 * Class UnusedCSS
 */

class UnusedCSS_Autoptimize_Onboard {
	use RapidLoad_Utils;

	/**
	 * @var UnusedCSS_Autoptimize
	 */
	private $uucss;


	public function __construct( $ao_uucss ) {

		$this->uucss = $ao_uucss;

		RapidLoad_Base::activate();

//		UnusedCSS_Autoptimize_Admin::delete_site_option( 'autoptimize_uucss_settings' );

        add_action( 'current_screen', function () {

            if ( get_current_screen() && get_current_screen()->base == 'settings_page_uucss-onboarding' ) {
                add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
            }
        } );

		add_action( 'admin_menu', [ $this, 'uucss_register_on_board_page' ] );
		add_action( 'admin_init', [ $this, 'uucss_redirect' ] );
		add_action( "wp_ajax_ao_installed", [ $this, 'ao_installed' ] );
		add_action( "wp_ajax_run_first_job", [ $this, 'run_first_job' ] );
		add_action( 'admin_head', [ $this, 'remove_notices' ] );
		add_filter('uucss/on-board/complete', function ($value){
		    return self::on_board_completed();
        }, 10, 1);
	}

	function enqueueScripts(){

        wp_enqueue_script( 'uucss_onboard', plugin_dir_url(__FILE__) . 'assets/uucss-on-board.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

    }

	function run_first_job(){

        self::verify_nonce();

		if(!UnusedCSS_Autoptimize_Admin::ao_active()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::ao_css_option_enabled()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::is_api_key_verified()){
            wp_send_json_error(false);
        }

        add_filter('uucss/purge/async', function ($async){ return false;}, 10, 1);

        $site_url = $this->transform_url(get_site_url());

        $this->uucss->cache($site_url, ['first_job' => true]);

        $this->ao_installed();

	}

	function remove_notices(){

		if(!isset($_REQUEST['action'])){
            return;
        }
        if(!isset($_REQUEST['plugin'])){
            return;
        }

        if(get_current_screen() &&
            get_current_screen()->base == 'update' &&
            $_REQUEST['action'] = 'install-plugin' &&
                $_REQUEST['plugin'] == 'autoptimize'){
                echo '<style>div.notice{display: none !important;}</style>';
        }
    }

    public static function on_board_completed(){
	    return UnusedCSS_Autoptimize_Admin::ao_active() && UnusedCSS_Autoptimize_Admin::ao_css_option_enabled() && UnusedCSS_Autoptimize_Admin::is_api_key_verified();
    }

    function ao_installed(){
        self::verify_nonce();
        $status = [];
        $status['installed'] = UnusedCSS_Autoptimize_Admin::ao_installed();
        $status['active'] = UnusedCSS_Autoptimize_Admin::ao_active();
        $status['css_enabled'] = UnusedCSS_Autoptimize_Admin::ao_css_option_enabled();
        $status['uucss_connected'] = UnusedCSS_Autoptimize_Admin::is_api_key_verified();
        $status['uucss_first_job_done'] = (bool)RapidLoad_Settings::get_first_link();
        $status['uucss_first_job'] = RapidLoad_Settings::get_first_link();

        if(wp_doing_ajax()){
            wp_send_json_success($status);
        }else{
            return $status;
        }
    }

    public static function get_on_board_steps(){
        return [
            'Connect',
            'Install and Activate',
            'Enable',
            'Run First Job'
        ];
    }

    function uucss_on_boarding_page(){
        wp_enqueue_script('post');
        ?>
        <div class="rapidload-on-board uucss-on-board">
            <?php
                include 'assets/onboarding.html.php';
            ?>
        </div>
        <?php
    }

    function uucss_redirect() {
	    if ( strpos( home_url( $_SERVER['REQUEST_URI'] ), '/options-general.php?page=uucss-onboarding' ) &&
	         self::on_board_completed() ) {
		    wp_redirect( admin_url( 'options-general.php?page=uucss' ) );
	    } else if ( UnusedCSS_Autoptimize_Admin::get_site_option( 'rapidload_do_activation_redirect' ) ) {
		    UnusedCSS_Autoptimize_Admin::delete_site_option( 'rapidload_do_activation_redirect' );
		    wp_redirect( '/wp-admin/options-general.php?page=uucss-onboarding' );
	    }
    }

	function uucss_register_on_board_page() {
		global $submenu;
		add_options_page(
			'UnusedCSS',
			'UnusedCSS',
			'manage_options',
			'uucss-onboarding',
            [$this, 'uucss_on_boarding_page']
        );
        $key = null;

        if(!isset($submenu['options-general.php'])){
            return;
        }

        $key = array_search(["UnusedCSS","manage_options","uucss-onboarding","UnusedCSS"], $submenu['options-general.php']);

	    if(isset($submenu['options-general.php'][$key])){
            unset($submenu['options-general.php'][$key]);
        }
    }

    public static function get_on_board_step(){
	    if ( ! UnusedCSS_Autoptimize_Admin::is_api_key_verified() ) {
		    return 1;
	    } else if ( ! UnusedCSS_Autoptimize_Admin::ao_active() ) {
		    return 2;
	    } else if ( ! UnusedCSS_Autoptimize_Admin::ao_css_option_enabled() ) {
		    return 3;
	    } else if ( ! UnusedCSS_Autoptimize_Admin::first_job_done() ) {
		    return 4;
	    }
        return 1;
    }

	public static function display_get_start_link() {
		add_filter( 'plugin_action_links_' . plugin_basename( UUCSS_PLUGIN_FILE ), function ( $links ) {
			$_links = array(
				'<a href="' . admin_url( 'options-general.php?page=rapidload-onboarding' ) . '">Get Started <span>⚡️</span> </a>',
			);

			return array_merge( $_links, $links );
		} );
	}

}
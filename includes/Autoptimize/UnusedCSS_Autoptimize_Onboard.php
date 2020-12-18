<?php

/**
 * Class UnusedCSS
 */

class UnusedCSS_Autoptimize_Onboard {
	use UnusedCSS_Utils;

	/**
	 * @var UnusedCSS_Autoptimize
	 */
	private $uucss;


	public function __construct( $ao_uucss ) {

		$this->uucss = $ao_uucss;

		self::activate();

//		delete_option( 'autoptimize_uucss_settings' );

		add_action( 'admin_menu', [ $this, 'uucss_register_on_board_page' ] );
		add_action( 'admin_init', [ $this, 'uucss_redirect' ] );
		add_action( "wp_ajax_ao_installed", [ $this, 'ao_installed' ] );
		add_action( "wp_ajax_run_first_job", [ $this, 'run_first_job' ] );
		add_action( 'admin_head', [ $this, 'remove_notices' ] );
	}


	function run_first_job(){

		if(!UnusedCSS_Autoptimize_Admin::ao_active()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::ao_css_option_enabled()){
            wp_send_json_error(false);
        }
        if(!UnusedCSS_Autoptimize_Admin::is_api_key_verified()){
            wp_send_json_error(false);
        }

        $this->uucss->async = false;
        $this->uucss->url = $this->uucss->get_current_url();
        $this->uucss->purge_css();

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
        $status = [];
        $status['installed'] = UnusedCSS_Autoptimize_Admin::ao_installed();
        $status['active'] = UnusedCSS_Autoptimize_Admin::ao_active();
        $status['css_enabled'] = UnusedCSS_Autoptimize_Admin::ao_css_option_enabled();
        $status['uucss_connected'] = UnusedCSS_Autoptimize_Admin::is_api_key_verified();
        $status['uucss_first_job_done'] = UnusedCSS_Settings::get_first_link() ? true : false;
        $status['uucss_first_job'] = UnusedCSS_Settings::get_first_link();

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
        <div class="uucss-on-board">
            <?php
                include 'parts/onboarding.html.php';
            ?>
        </div>
        <?php
    }

    function uucss_redirect() {
	    if ( strpos( home_url( $_SERVER['REQUEST_URI'] ), '/options-general.php?page=uucss-onboarding' ) &&
	         self::on_board_completed() ) {
		    wp_redirect( admin_url( 'options-general.php?page=uucss' ) );
	    } else if ( get_option( 'uucss_do_activation_redirect', false ) ) {
		    delete_option( 'uucss_do_activation_redirect' );
		    wp_redirect( '/wp-admin/options-general.php?page=uucss-onboarding' );
	    }
    }

	public static function uucss_activate() {
		add_option( 'uucss_do_activation_redirect', true );
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
				'<a href="' . admin_url( 'options-general.php?page=uucss-onboarding' ) . '">Get Started <span>⚡️</span> </a>',
			);

			return array_merge( $_links, $links );
		} );
	}


	public static function activate() {

		if ( ! isset( $_REQUEST['token'] ) || empty( $_REQUEST['token'] ) ) {
			return;
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
			self::add_admin_notice( 'RapidLoad : Request verification failed for Activation. Contact support if the problem persists.', 'error' );

			return;
		}

		$token = sanitize_text_field( $_REQUEST['token'] );

		if ( strlen( $token ) !== 32 ) {
			self::add_admin_notice( 'RapidLoad : Invalid Api Token Received from the Activation. Contact support if the problem persists.', 'error' );

			return;
		}

		$options = get_option( 'autoptimize_uucss_settings' );

		// Hey 👋 you stalker ! you can set this key to true, but its no use ☹️ api_key will be verified on each server request
		$options['uucss_api_key_verified'] = 1;
		$options['uucss_api_key']          = $token;

		update_option( 'autoptimize_uucss_settings', $options );

		$data        = UnusedCSS_Autoptimize_Admin::suggest_whitelist_packs();
		$white_packs = $data->data;

		$options['whitelist_packs'] = array();
		foreach ( $white_packs as $white_pack ) {
			$options['whitelist_packs'][] = $white_pack->id . ':' . $white_pack->name;
		}

		update_option( 'autoptimize_uucss_settings', $options );

		self::add_admin_notice( 'RapidLoad : 🙏 Thank you for using our plugin. if you have any questions feel free to contact us.', 'success' );
	}

}
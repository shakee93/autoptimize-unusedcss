<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin extends UnusedCSS_Admin {

	use UnusedCSS_Utils;

	public static $deactivating = false;
	public static $activating = false;

	/**
	 * UnusedCSS constructor.
	 *
	 * @param UnusedCSS_Autoptimize $ao_uucss
	 */
	public function __construct( $ao_uucss ) {

		$this->uucss = $ao_uucss;

		if ( ! $ao_uucss->deps_available ) {
			return;
		}

		if ( ! defined( 'UUCSS_ACTIVATION_URL' ) ) {
			define( 'UUCSS_ACTIVATION_URL', 'https://app.unusedcss.io/activate' );
		}

		add_filter( 'plugin_action_links_' . plugin_basename( UUCSS_PLUGIN_FILE ), [
			$this,
			'add_plugin_action_link'
		] );

		add_action( 'current_screen', function () {

			if ( get_current_screen() && get_current_screen()->base == 'settings_page_uucss' ) {
				add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
			}
		} );

		if ( is_admin() ) {

            $this->activate();
            $this->deactivate();

            $this->validate_domain();

		    add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
		    add_filter( 'autoptimize_filter_settingsscreen_tabs', [ $this, 'add_ao_tab' ], 20, 1 );
		    add_action( 'updated_option', [ $this, 'clear_cache_on_option_update' ] );

		    add_action( "wp_ajax_verify_api_key", [ $this, 'verify_api_key' ] );
		    add_action( "wp_ajax_suggest_whitelist_packs", [ $this, 'suggest_whitelist_packs' ] );
		    add_action( "wp_ajax_uucss_data", [ $this, 'uucss_data' ] );

		    add_action( 'admin_notices', [ $this, 'first_uucss_job' ] );

	    }

	    if ( ! self::enabled() ) {
		    self::$enabled = false;
		    return;
	    }

	    add_action( 'admin_bar_menu', function () {

		    wp_enqueue_script( 'wp-util' );

		    if ( self::$deactivating ) {
			    return;
		    }

		    global $wp_admin_bar;

		    $wp_admin_bar->add_node( array(
			    'id'     => 'autoptimize-uucss',
			    'title'  => $this->get_node_text(),
			    'parent' => 'autoptimize',
			    'tag'    => 'div'
		    ) );

	    }, 1 );

	    parent::__construct( $ao_uucss );

    }

	public function enqueueScripts() {

		wp_enqueue_script( 'select2', UUCSS_PLUGIN_URL . 'assets/select2/select2.min.js', array( 'jquery' ) );

		wp_enqueue_script( 'datatables', UUCSS_PLUGIN_URL . 'assets/datatables/jquery.dataTables.min.js', array(
			'jquery',
			'uucss_admin'
		) );
		wp_enqueue_style( 'datatables', UUCSS_PLUGIN_URL . 'assets/datatables/jquery.dataTables.min.css' );


		wp_enqueue_script( 'popper', UUCSS_PLUGIN_URL . 'assets/tippy/popper.min.js', array( 'jquery' ) );
		wp_enqueue_script( 'tippy', UUCSS_PLUGIN_URL . 'assets/tippy/tippy-bundle.umd.min.js', array( 'jquery' ) );
		wp_enqueue_style( 'tippy', UUCSS_PLUGIN_URL . 'assets/tippy/tippy.css' );

		wp_register_script( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/uucss_admin.js?v=1.6', array( 'jquery', 'wp-util' ) );
        wp_enqueue_style( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/uucss_admin.css?v=1.3' );

		$data = array(
			'api'   => UnusedCSS_Api::get_key(),
			'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'url' => site_url(),
		);

		wp_localize_script( 'uucss_admin', 'uucss', $data );

		wp_enqueue_script( 'uucss_admin' );

		wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/select2/select2.min.css' );

	}


	public function add_plugin_action_link( $links ) {

		$_links = array(
			'<a href="' . admin_url( 'options-general.php?page=uucss' ) . '">Settings</a>',
		);

		return array_merge( $_links, $links );
	}


	function first_uucss_job() {

		if ( ! PAnD::is_admin_notice_active( 'first-uucss-job-forever' ) ) {
			return;
		}

		$job = UnusedCSS_Settings::get_first_link();

		if ( $job && $job['status'] == 'success' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="updated notice uucss-notice notice-success is-dismissible">
                <h4><span class="dashicons dashicons-yes-alt"></span> UnusedCSS successfully ran your first job!</h4>
                <p><?php _e( 'You slashed <strong>' . $job['meta']['stats']->reductionSize . ' </strong> of unused CSS - that\'s <strong>' . $job['meta']['stats']->reduction . '% </strong> of your total CSS file size. Way to go 👏', 'sample-text-domain' ); ?></p>
            </div>
	    <?php endif;

	    if ( $job && $job['status'] == 'failed' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="error notice uucss-notice notice-error is-dismissible">
                <h4><span class="dashicons dashicons-no-alt"></span> UnusedCSS : We were unable to remove unusedcss from
                    your site 🤕</h4>

                <div>
                    <p> Our team can help. Get in touch with support <a target="_blank"
                                                                        href="mailto:support@unusedcss.io">here</a></p>
                    <blockquote class="error notice">
                        <strong>Link :</strong> <?php echo $job['url'] ?> <br>
                        <strong>Error :</strong> <?php echo $job['meta']['error']['code'] ?> <br>
                        <strong>Message :</strong> <?php echo $job['meta']['error']['message'] ?>
                    </blockquote>
                </div>

            </div>
		<?php endif;
	}

	function uucss_data() {

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_nonce' ) ) {
			wp_send_json_error( 'UnusedCSS - Malformed Request Detected, Contact Support.' );
		}

		wp_send_json_success( UnusedCSS_Settings::get_links() );
	}

	public function get_node_text() {
		ob_start();

		include( 'parts/admin-node.html.php' );

		$output = ob_get_contents();
		ob_end_clean();

		return $output;
    }

    public static function fetch_options()
    {
        if(class_exists('autoptimizeOptionWrapper')){
            return autoptimizeOptionWrapper::get_option( 'autoptimize_uucss_settings' );
        }else{
            return  false;
        }
    }


    public static function enabled() {

        if(!self::ao_active() ||
            !self::ao_css_option_enabled() ||
            !self::is_api_key_verified() && ! self::$deactivating ||
            !self::first_job_done()
        ){
            $notice = [
                'action'      => 'on-board',
                'title'       => 'UnusedCSS Power Up',
                'message'     => 'Please Complete UnusedCSS Onboarding',
                'main_action' => [
                    'key'   => 'Get Start',
                    'value' => admin_url('options-general.php?page=uucss-onboarding')
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);

	        return false;
        }

	    if ( is_multisite() ) {
		    self::add_admin_notice( "UnusedCSS not supported for multisite" );

		    return false;
	    }

	    return true;
    }


	public static function is_api_key_verified() {

		$api_key_status = isset( static::fetch_options()['uucss_api_key_verified'] ) ? static::fetch_options()['uucss_api_key_verified'] : '';

		return $api_key_status == '1';

	}

	public function validate_domain() {

		$uucss_api = new UnusedCSS_Api();
		$options   = get_option( 'autoptimize_uucss_settings' );

		if ( ! isset( $options['uucss_api_key'] ) ) {
			return;
		}

		$results = $uucss_api->get( 'verify', [ 'url' => site_url() ] );

        $data = json_decode(json_encode($results),true);
        if(isset($data['errors'])){
            $options['valid_domain'] = false;
            update_option('autoptimize_uucss_settings', $options);
            return;
        }
        $options['valid_domain'] = true;
        update_option('autoptimize_uucss_settings', $options);
    }

	public static function is_domain_verified(){
        $options = get_option( 'autoptimize_uucss_settings' );
        return  $options['valid_domain'];
    }


	public function add_ao_tab( $in ) {

		$in = array_merge( $in, array(
			//'uucss' => __( '🔥 UnusedCSS', 'autoptimize' ),
			'uucss' => __( '<span class="uucss-tab-title"><img src="/wp-content/plugins/autoptimize-unusedcss/assets/logo-icon.svg" width="15" alt="UnusedCSS.io logo"><span>UnusedCSS</span></span>', 'autoptimize' ),
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


	public function render_form() {
		$options = $this->fetch_options();
		include( 'parts/options-page.html.php' );
	}

	public function activate() {

		if ( ! isset( $_REQUEST['token'] ) || empty( $_REQUEST['token'] ) ) {
			return;
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
			self::add_admin_notice( 'UnusedCSS : Request verification failed for Activation. Contact support if the problem persists.', 'error' );
			return;
		}

		$token = $_REQUEST['token'];

		if ( strlen( $token ) !== 32 ) {
			self::add_admin_notice( 'UnusedCSS : Invalid Api Token Received from the Activation. Contact support if the problem persists.', 'error' );

			return;
		}

		$options = get_option( 'autoptimize_uucss_settings' );

		// Hey 👋 you stalker ! you can set this key to true, but its no use ☹️ api_key will be verified on each server request
		$options['uucss_api_key_verified']    = 1;
		$options['uucss_api_key']             = $token;

        update_option( 'autoptimize_uucss_settings', $options );

        $data = self::suggest_whitelist_packs();
        $white_packs = $data->data;

        $options['whitelist_packs'] = array();
        foreach ($white_packs as $white_pack){
            $options['whitelist_packs'][] = $white_pack->id . ':' . $white_pack->name;
        }

		update_option( 'autoptimize_uucss_settings', $options );

		self::$activating = true;

		self::add_admin_notice( 'UnusedCSS : 🙏 Thank you for using our plugin. if you have any questions feel free to contact us.', 'success' );
	}


	public function deactivate() {


		if ( ! isset( $_REQUEST['deactivated'] ) || empty( $_REQUEST['deactivated'] ) ) {
			return;
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
			self::add_admin_notice( 'UnusedCSS : Request verification failed for Activation. Contact support if the problem persists.', 'error' );
			return;
		}

		$options = get_option( 'autoptimize_uucss_settings' );

		unset( $options['uucss_api_key_verified'] );
		unset( $options['uucss_api_key'] );
		unset( $options['whitelist_packs'] );

		update_option( 'autoptimize_uucss_settings', $options );

		$cache_key = 'pand-' . md5( 'first-uucss-job' );
		delete_site_option( $cache_key );

		$this->uucss->vanish();

		self::$deactivating = true;

		$notice = [
			'action'      => 'activate',
			'message'     => 'UnusedCSS : Deactivated your license for this site.',
			'main_action' => [
				'key'   => 'Reactivate',
				'value' => self::activation_url( 'authorize' )
			],
            'type' => 'success'
        ];
        self::add_advanced_admin_notice($notice);
        return;
	}


	public function clear_cache_on_option_update( $option ) {

		if ( $option == 'autoptimize_uucss_settings' && $this->uucss ) {
			$this->uucss->clear_cache();
		}

	}

    public static function ao_installed(){
	    return file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php') ||
            file_exists(ABSPATH . PLUGINDIR . '/autoptimize-beta/autoptimize.php');
    }

    public static function ao_active(){
        return is_plugin_active('autoptimize/autoptimize.php') ||
            is_plugin_active('autoptimize-beta/autoptimize.php');
    }

    public static function ao_css_option_enabled(){
        return class_exists('autoptimizeOptionWrapper') &&
        autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "on";
    }

    public static function get_installed_ao_plugin(){
	    if(file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php')){
	        return 'autoptimize/autoptimize.php';
        }
	    if(file_exists(ABSPATH . PLUGINDIR . '/autoptimize-beta/autoptimize.php')){
	        return 'autoptimize-beta/autoptimize.php';
        }
	    return null;
    }

    public static function first_job_done(){
	    return (UnusedCSS_Settings::get_first_link() ? true :  false);
    }
}

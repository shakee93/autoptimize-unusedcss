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

			$this->deactivate();

			add_action('current_screen', [$this, 'validate_domain']);

			add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
			add_filter( 'autoptimize_filter_settingsscreen_tabs', [ $this, 'add_ao_tab' ], 20, 1 );
			add_action( 'updated_option', [ $this, 'clear_cache_on_option_update' ], 10, 3 );

			add_action( "wp_ajax_verify_api_key", [ $this, 'verify_api_key' ] );
			add_action( "wp_ajax_suggest_whitelist_packs", [ $this, 'suggest_whitelist_packs' ] );
			add_action( "wp_ajax_uucss_license", [ $this, 'uucss_license' ] );
			add_action( "wp_ajax_uucss_deactivate", [ $this, 'ajax_deactivate' ] );
			add_action( "wp_ajax_uucss_data", [ $this, 'uucss_data' ] );
			add_action( "wp_ajax_uucss_connect", [ $this, 'uucss_connect' ] );
			add_action( "wp_ajax_uucss_test_url", [ $this, 'uucss_test_url' ] );
            add_action('wp_ajax_uucss_logs', [$this, 'uucss_logs']);
            add_action('wp_ajax_clear_uucss_logs', [$this, 'clear_uucss_logs']);
            add_action('wp_ajax_frontend_logs', [$this, 'frontend_logs']);
            add_action('wp_ajax_clear_page_cache', [$this, 'clear_page_cache']);
            add_action('wp_ajax_mark_faqs_read', [$this, 'mark_faqs_read']);

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

    function mark_faqs_read(){

	    $options = self::fetch_options();
	    $options['faqs_read'] = true;
        self::update_site_option('autoptimize_uucss_settings', $options);
        wp_send_json_success(true);
    }

    function clear_page_cache(){

	    $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

	    $status = isset($_REQUEST['status']) ? $_REQUEST['status'] : false;

        if($url){

            do_action( 'uucss/cached', [
                'url' => $url
            ] );
        }

        $links = false;

        if($status && $status == 'warnings'){

            $links = UnusedCSS_DB::get_links_where(' WHERE warnings IS NOT NULL ');

        }

        if($links && !empty($links)){

            foreach ($links as $link){

                if(isset($link['url'])){

                    do_action( 'uucss/cached', [
                        'url' => $link['url']
                    ] );
                }
            }
        }

	    wp_send_json_success('page cache cleared');
    }

    function frontend_logs(){

	    $args = [];

	    $args['type'] = isset($_REQUEST['type']) && !empty($_REQUEST['type']) ? $_REQUEST['type'] : 'frontend';
	    $args['log'] = isset($_REQUEST['log']) && !empty($_REQUEST['log']) ? $_REQUEST['log'] : '';
	    $args['url'] = isset($_REQUEST['url']) && !empty($_REQUEST['url']) ? $_REQUEST['url'] : '';

	    self::log($args);

	    wp_send_json_success(true);
    }

    function uucss_logs(){

	    $file_system = new UnusedCSS_FileSystem();

	    if(!$file_system->exists(UUCSS_LOG_DIR . 'debug.log')){
            wp_send_json_success([]);
        }

	    $data = $file_system->get_contents(UUCSS_LOG_DIR . 'debug.log');

	    if(empty($data)){
	        wp_send_json_success([]);
        }

	    $data = '[' . $data . ']';

        wp_send_json_success(json_decode($data));
    }

    function clear_uucss_logs(){
        $file_system = new UnusedCSS_FileSystem();

        if(!$file_system->exists(WP_CONTENT_DIR . '/uploads/rapidload/')){
            wp_send_json_success(true);
        }

        $file_system->delete_folder(WP_CONTENT_DIR . '/uploads/rapidload/');
        wp_send_json_success(true);
    }

    public function get_faqs(){

        $options = self::fetch_options();

        if(isset($options['faqs_read'])){
            return [];
        }

        $api = new UnusedCSS_Api();

        $result = $api->get('faqs');

        $default = [
	        [
		        "title" => "My Site is broken after using RapidLoad. What can i do?",
		        "message" => "There is a possibility the page can be broken with RapidLoad as it does the removal automatically. you can easily fix broken elements with safelist rules. we recommend to turn on “Load Original CSS files” and add safelist rules. if you are not sure how to add safelist rules create a support ticket in <a href='https://rapidload.zendesk.com/hc/en-us' target='_blank'>https://rapidload.zendesk.com/hc/en-us</a> one of our support member will help you out .",
	        ],
	        [
		        "title" => "Still seeing remove unused css flag in Google page speed insights?",
		        "message" => "Run a GPSI status test on your optimization url to confirm whether RapidLoad optimizations are properly reflected to public users. if it is pending it is because of the page cache in your site. clear your page cache and try again.",
	        ],
	        [
		        "title" => "Will this plugin work with other caching plugins?",
		        "message" => "RapidLoad works with all major caching plugins. If you are using a little known caching plugin and are experiencing issues with RapidLoad, please submit your issue and caching plugin name to our support team and we will review.",
	        ],
	        [
		        "title" => "Do I need to run this every time I make a change?",
		        "message" => "No! RapidLoad works in the background, so any new stylesheets that are added will be analyzed and optimized on the fly. Just set it and forget it!",
	        ],
	        [
		        "title" => "Do you offer support if I need it?",
		        "message" => "Yes, our team is standing by to assist you! Submit a support ticket any time from the Support tab in the plugin and we’ll be happy to help.",
	        ]
        ];

        return !$api->is_error($result) && isset($result->data) ? $result->data : $default;
    }

    public function get_public_notices(){

        $api = new UnusedCSS_Api();

        $result = $api->get('notification');

        return !$api->is_error($result) && isset($result->data) ? $result->data : [];
    }

	public function getNotifications() {
		$notifications = [];

		if (!(bool) autoptimizeOptionWrapper::get_option( 'autoptimize_cache_nogzip' )) {
		    $notifications[] = [
			    "title" => "Incompatible Autoptimize option enabled",
			    "message" => "It is recommended to enable <strong>'Save aggregated script/css as static files?'</strong> in Autoptimize to RapidLoad to work properly.",
			    "type" => "error"
		    ];
		}

        if(autoptimizeOptionWrapper::get_option( 'autoptimize_css_inline' ) == 'on'){
            $notifications[] = [
                "title" => "Incompatible Autoptimize option enabled",
                "message" => "It is recommended to disable <strong>'inline all css?'</strong> in Autoptimize to RapidLoad to work properly.",
                "type" => "warning"
            ];
        }

		return $notifications;
    }

	public function enqueueScripts() {

		wp_enqueue_script( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.js', array( 'jquery' ) );

		wp_enqueue_script( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.js', array(
			'jquery',
			'uucss_admin'
		) );
		wp_enqueue_style( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.css' );

		wp_register_script( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/js/uucss_admin.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

        wp_register_script( 'uucss_log', UUCSS_PLUGIN_URL . 'assets/js/uucss_log.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

		wp_enqueue_style( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_admin.css', [], UUCSS_VERSION );



		$data = array(
			'api' => UnusedCSS_Api::get_key(),
			'nonce' => wp_create_nonce( 'uucss_nonce' ),
			'url' => site_url(),
			'ajax_url'          => admin_url( 'admin-ajax.php' ),
			'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
			'on_board_complete' => UnusedCSS_Autoptimize_Onboard::on_board_completed(),
			'api_key_verified' => UnusedCSS_Autoptimize_Admin::is_api_key_verified(),
            'notifications' => $this->getNotifications(),
            'faqs' => $this->get_faqs(),
            'public_notices' => $this->get_public_notices()
		);

		wp_localize_script( 'uucss_admin', 'uucss', $data );

		wp_enqueue_script( 'uucss_admin' );
		wp_enqueue_script( 'uucss_log' );

		wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.css' );

	}

	public function add_on_board_action_link($links){

        $_links = array(
            '<a href="' . admin_url( 'options-general.php?page=uucss-onboarding' ) . '">Get Start</a>',
        );

        return array_merge( $_links, $links );
    }

	public function add_plugin_action_link( $links ) {

		$_links = array(
			'<a href="' . admin_url( 'options-general.php?page=uucss' ) . '">Settings</a>',
		);

		return array_merge( $_links, $links );
	}

	function uucss_test_url(){

	    if(!isset($_REQUEST['url'])){
	        wp_send_json_error('url required');
        }

	    $url = $_REQUEST['url'];

        $uucss_api = new UnusedCSS_Api();

        $link = UnusedCSS_DB::get_link($url);

        $cached_files = [];
        $original_files = [];

        if(isset($link['files']) && !empty($link['files'])){

            $cached_files = array_filter($link['files'], function ($file){
               return !$this->str_contains($file['original'], '//inline-style@');
            });

            $original_files = array_filter($link['files'], function ($file){
                return !$this->str_contains($file['original'], '//inline-style@');
            });
        }

        $result = $uucss_api->post( 'test/wordpress',
            [
                'url' => urldecode($url),
                'files' => !empty($cached_files) ? array_column($cached_files, 'uucss') : [],
                'aoFiles' => !empty($original_files) ? array_column($original_files, 'original') : []
            ]);

        if ( $uucss_api->is_error( $result ) ) {
            if(isset($result->errors) && isset($result->errors[0])){
                wp_send_json_error($result->errors[0]->detail);
            }else{
                wp_send_json_error($result);
            }
        }

        wp_send_json_success($result);
    }


	function first_uucss_job() {

		if ( ! PAnD::is_admin_notice_active( 'first-uucss-job-forever' ) ) {
			return;
		}

		$job = UnusedCSS_Settings::get_first_link();

		if ( $job && $job['status'] == 'success' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="updated notice uucss-notice notice-success is-dismissible">
                <h4><span class="dashicons dashicons-yes-alt"></span> RapidLoad successfully ran your first job!</h4>
                <p><?php _e( 'You slashed <strong>' . $job['meta']['stats']->reductionSize . ' </strong> of unused CSS - that\'s <strong>' . $job['meta']['stats']->reduction . '% </strong> of your total CSS file size. Way to go 👏', 'sample-text-domain' ); ?></p>
            </div>
	    <?php endif;

	    if ( $job && $job['status'] == 'failed' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="error notice uucss-notice notice-error is-dismissible">
                <h4><span class="dashicons dashicons-no-alt"></span> RapidLoad : We were unable to remove unused css
                    from
                    your site 🤕</h4>

                <div>
                    <p> Our team can help. Get in touch with support <a target="_blank"
                                                                        href="https://rapidload.zendesk.com/hc/en-us/requests/new">here</a>
                    </p>
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

		$start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
		$length = isset($_REQUEST['length']) ? $_REQUEST['length'] : 10;
		$draw = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : 1;

		$status_filter = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][0]) &&
        isset($_REQUEST['columns'][0]['search']) &&
        isset($_REQUEST['columns'][0]['search']['value']) ?
            $_REQUEST['columns'][0]['search']['value'] : false;

		$filters = [];

		if($status_filter){

		    if($status_filter == 'warning'){

                $filters[] = " warnings IS NOT NULL ";
            }else{

                $filters[] = " status = '". $status_filter . "' AND warnings IS NULL ";
            }

        }

        $url_filter = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][1]) &&
        isset($_REQUEST['columns'][1]['search']) &&
        isset($_REQUEST['columns'][1]['search']['value']) ?
            $_REQUEST['columns'][1]['search']['value'] : false;

        $url_regex = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][1]) &&
        isset($_REQUEST['columns'][1]['search']) &&
        isset($_REQUEST['columns'][1]['search']['regex']) ?
            $_REQUEST['columns'][1]['search']['regex'] : false;

        if($url_regex == 'true' && $url_filter){

            $filters[] = " url = '". $url_filter . "' ";

        }

        if($url_regex == 'false' && $url_filter){

            $filters[] = " url LIKE '%". $url_filter . "%' ";

        }

        $where_clause = '';

        foreach ($filters as $key => $filter){

            if($key == 0){

                $where_clause = ' WHERE ';
                $where_clause .= $filter;
            }else{

                $where_clause .= ' AND ';
                $where_clause .= $filter;
            }

        }

		$data  = UnusedCSS_Settings::get_links($start, $length, $where_clause);

		wp_send_json([
            'data' => $data,
            "draw" => (int)$draw,
            "recordsTotal" => UnusedCSS_DB::get_total_job_count(),
            "recordsFiltered" => UnusedCSS_DB::get_total_job_count($where_clause),
            "success" => true
        ]);
	}

	function uucss_connect(){

		if ( ! isset( $_REQUEST['license_key'] ) || empty( $_REQUEST['license_key'] ) ) {
			wp_send_json_error( 'License Key required' );
		}

		$license_key = $_REQUEST['license_key'];

		$uucss_api         = new UnusedCSS_Api();
		$uucss_api->apiKey = $license_key;
		$results           = $uucss_api->post( 'connect', [ 'url' => get_site_url(), 'type' => 'wordpress' ] );

		if ( $uucss_api->is_error( $results ) ) {
		    if(isset($results->errors) && isset($results->errors[0])){
                wp_send_json_error($results->errors[0]->detail);
            }else{
		        wp_send_json_error('License Key verification fail');
            }
        }

        wp_send_json_success([
            'success' => true,
            'message' => 'License Key verification success',
            'activation_nonce' => wp_create_nonce( 'uucss_activation' ),
        ]);
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
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);

        }
	    return get_site_option( 'autoptimize_uucss_settings', false );
    }

    public static function get_site_option($name)
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), $name, false);

        }
        return get_site_option( $name, false );
    }

    public static function update_site_option($name, $value){

        if(is_multisite()){

            return update_blog_option(get_current_blog_id(), $name, $value);

        }
        return update_site_option($name, $value);
    }

    public static function delete_site_option($name){

        if(is_multisite()){

            return delete_blog_option(get_current_blog_id(), $name);

        }
        return delete_site_option($name);
    }


    public static function enabled() {

        if( !self::ao_active() ||
            !self::ao_css_option_enabled() ||
            ! self::is_api_key_verified() && ! self::$deactivating
        ){
            $notice = [
	            'action'      => 'on-board',
	            'title'       => 'RapidLoad Power Up',
	            'message'     => 'Complete on-boarding steps, it only takes 2 minutes.',
	            'main_action' => [
		            'key'   => 'Get Started',
		            'value' => admin_url( 'options-general.php?page=uucss-onboarding' )
	            ],
	            'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            UnusedCSS_Autoptimize_Onboard::display_get_start_link();
	        return false;
        }

	    /*if ( is_multisite() ) {
		    self::add_admin_notice( "UnusedCSS not supported for multisite" );

		    return false;
	    }*/

        return apply_filters('uucss/enabled', true);
    }


	public static function is_api_key_verified() {

		$api_key_status = isset( static::fetch_options()['uucss_api_key_verified'] ) ? static::fetch_options()['uucss_api_key_verified'] : '';

		return $api_key_status == '1';

	}

	public function validate_domain() {

		if ( get_current_screen() && get_current_screen()->base != 'settings_page_uucss' ) {
			return;
		}

		$options   = self::get_site_option( 'autoptimize_uucss_settings' );

	    if(!isset( $options['uucss_api_key_verified'] ) || $options['uucss_api_key_verified'] != '1'){
	        return;
        }

		$uucss_api = new UnusedCSS_Api();

		if ( ! isset( $options['uucss_api_key'] ) ) {
			return;
		}

		$results = $uucss_api->get( 'verify', [ 'url' => site_url(), 'token' => $options['uucss_api_key'] ] );

		if($uucss_api->is_error($results)){
			$options['valid_domain'] = false;
            self::update_site_option('autoptimize_uucss_settings', $options);
			return;
		}

		if(!isset($options['valid_domain']) || !$options['valid_domain']){
			$options['valid_domain'] = true;
            self::update_site_option('autoptimize_uucss_settings', $options);
		}
    }

	public static function is_domain_verified(){
        $options = self::get_site_option( 'autoptimize_uucss_settings' );
        return  $options['valid_domain'];
    }


	public function add_ao_tab( $in ) {

		$tab = 'RapidLoad';

		$in = array_merge( $in, array(
			'uucss' => __( '<span class="uucss-tab-title"><img src="' . UUCSS_PLUGIN_URL . '/assets/images/logo-icon.svg' . '" width="15" alt="RapidLoad.io logo"><span>' . $tab . '</span></span>', 'autoptimize' ),
		) );

		return $in;
	}


    public function add_ao_page() {

	    add_submenu_page( 'options-general.php', 'RapidLoad', 'RapidLoad', 'manage_options', 'uucss', function () {
		    wp_enqueue_script( 'post' );

		    ?>
            <div class="wrap">
                <h1><?php _e( 'Autoptimize Settings', 'autoptimize' ); ?></h1>
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



	public function deactivate() {


		if ( ! isset( $_REQUEST['deactivated'] ) || empty( $_REQUEST['deactivated'] ) ) {
			return;
		}

		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
			self::add_admin_notice( 'RapidLoad : Request verification failed for Activation. Contact support if the problem persists.', 'error' );

			return;
		}

		$options = self::get_site_option( 'autoptimize_uucss_settings' );

		unset( $options['uucss_api_key_verified'] );
		unset( $options['uucss_api_key'] );
		unset( $options['whitelist_packs'] );

        self::update_site_option( 'autoptimize_uucss_settings', $options );

		$cache_key = 'pand-' . md5( 'first-uucss-job' );
        self::delete_site_option( $cache_key );

		$this->uucss->vanish();

		self::$deactivating = true;

		$notice = [
			'action'      => 'activate',
			'message'     => 'RapidLoad : Deactivated your license for this site.',
			'main_action' => [
				'key'   => 'Reactivate',
				'value' => self::activation_url( 'authorize' )
			],
			'type'        => 'success'
		];
		self::add_advanced_admin_notice( $notice );

		return;
	}


	public function ajax_deactivate() {

		$options = self::get_site_option( 'autoptimize_uucss_settings' );

		$cache_key = 'pand-' . md5( 'first-uucss-job' );
        self::delete_site_option( $cache_key );

		$this->uucss->vanish();

		$api = new UnusedCSS_Api();

		// remove domain from authorized list
		$api->post( 'deactivate', [
			'url' => site_url()
		] );

		unset( $options['uucss_api_key_verified'] );
		unset( $options['uucss_api_key'] );
		unset( $options['whitelist_packs'] );

        self::update_site_option( 'autoptimize_uucss_settings', $options );

		wp_send_json_success( true );
	}


	public function clear_cache_on_option_update( $option, $old_value, $value ) {

		if ( $option == 'autoptimize_uucss_settings' && $this->uucss ) {

			$needs_to_cleared = false;

			$diffs = [];
			$diffs_invert = [];

			if ( $old_value && $value ) {
				$diffs        = array_diff_key( $old_value, $value );
				$diffs_invert = array_diff_key( $value, $old_value );
			}

			if ( isset( $diffs_invert['valid_domain'] ) ) {
				unset( $diffs_invert['valid_domain'] );
			}
			if ( isset( $diffs['valid_domain'] ) ) {
				unset( $diffs['valid_domain'] );
			}

			$diffs = array_merge( $diffs, $diffs_invert );

			// if these settings are changed cache will be cleared
			if ( isset( $diffs['uucss_minify'] ) ||
			     isset( $diffs['uucss_keyframes'] ) ||
			     isset( $diffs['uucss_fontface'] ) ||
			     isset( $diffs['uucss_analyze_javascript'] ) ||
			     isset( $diffs['uucss_safelist'] ) ||
			     isset( $diffs['whitelist_packs'] ) ||
			     isset( $diffs['uucss_blocklist'] ) ||
			     isset( $diffs['uucss_variables'] ) ) {
				$needs_to_cleared = true;
			}

			foreach ( [ 'whitelist_packs', 'uucss_safelist', 'uucss_blocklist' ] as $compare_value ) {
				if ( isset( $value[ $compare_value ] ) && isset( $old_value[ $compare_value ] ) && $old_value[ $compare_value ] !== $value[ $compare_value ] ) {
					$needs_to_cleared = true;
					break;
				}
			}

			if ( $needs_to_cleared ) {
				$this->uucss->clear_cache( null, [
					'soft' => true
				] );
			}
		}

	}

	public static function ao_installed() {
	    return file_exists(ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php') ||
            file_exists(ABSPATH . PLUGINDIR . '/autoptimize-beta/autoptimize.php');
    }

    public static function ao_active(){

	    if ( ! function_exists( 'is_plugin_active' ) ) {
		    require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
	    }

	    return is_plugin_active( 'autoptimize/autoptimize.php' ) ||
	           is_plugin_active( 'autoptimize-beta/autoptimize.php' );
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

<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin extends UnusedCSS_Admin {

	use RapidLoad_Utils;

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

		if ( is_admin() ) {

			add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
			add_filter( 'autoptimize_filter_settingsscreen_tabs', [ $this, 'add_ao_tab' ], 20, 1 );
			add_filter('uucss/notifications', [$this, 'addNotifications'], 10, 1);

		}

        parent::__construct( $ao_uucss );

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

    public function add_ao_tab( $in ) {

        $tab = 'RapidLoad';

        $in = array_merge( $in, array(
            'uucss' => __( '<span class="uucss-tab-title"><img src="' . UUCSS_PLUGIN_URL . '/assets/images/logo-icon.svg' . '" width="15" alt="RapidLoad.io logo"><span>' . $tab . '</span></span>', 'autoptimize' ),
        ) );

        return $in;
    }

	public function addNotifications($notifications) {

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

	public function add_on_board_action_link($links){

        $_links = array(
            '<a href="' . admin_url( 'options-general.php?page=uucss-onboarding' ) . '">Get Start</a>',
        );

        return array_merge( $_links, $links );
    }

	public function get_node_text() {
		ob_start();

		include('parts/admin-node.html.php');

		$output = ob_get_contents();
		ob_end_clean();

		return $output;
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

        return true;
    }

    public function render_form() {
        $options = RapidLoad_Base::fetch_options();

        if(isset($options) && !isset($options['uucss_jobs_per_queue'])){
            $this->update_defaults($options);
        }

        include('parts/options-page.html.php');
    }

    public function update_defaults($options){
        $options['uucss_load_original'] = "1";
        UnusedCSS_Admin::update_site_option('autoptimize_uucss_settings', $options);
    }

	public static function ao_installed() {
	    return file_exists(ABSPATH . PLUGINDIR . '/' . UnusedCSS_Autoptimize::$provider_path) ||
            file_exists(ABSPATH . PLUGINDIR . '/autoptimize-beta/autoptimize.php');
    }

    public static function ao_active(){

	    if ( ! function_exists( 'is_plugin_active' ) ) {
		    require_once(ABSPATH . '/wp-admin/includes/plugin.php');
	    }

	    return is_plugin_active( UnusedCSS_Autoptimize::$provider_path ) ||
	           is_plugin_active( 'autoptimize-beta/autoptimize.php' );
    }

    public static function ao_css_option_enabled(){
        return class_exists('autoptimizeOptionWrapper') &&
        autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "on";
    }

    public static function get_installed_ao_plugin(){
	    if(file_exists(ABSPATH . PLUGINDIR . '/' . UnusedCSS_Autoptimize::$provider_path)){
	        return '/' . UnusedCSS_Autoptimize::$provider_path;
        }
	    if(file_exists(ABSPATH . PLUGINDIR . '/autoptimize-beta/autoptimize.php')){
	        return 'autoptimize-beta/autoptimize.php';
        }
	    return null;
    }

}

<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

	use UnusedCSS_Utils;

	public $base = 'cache/autoptimize/uucss';
	public $provider = null;

	public $url = null;
	public $css = [];
	public $store = null;
	public $options = [];
	public $async = true;

	/**
	 * @var WP_Filesystem_Direct
	 */
	public $file_system;

	public $base_dir;


	abstract public function get_css();


    abstract public function replace_css();


    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
	    if ( ! $this->initFileSystem() ) {
		    self::add_admin_notice( 'RapidLoad : couldn\'t access wordpress file system. check for file permission issues in your site.' );

		    return;
	    }

        add_action('uucss_async_queue', [$this, 'init_async_store'], 2, 3);

	    add_action( 'wp_enqueue_scripts', function () {

		    $this->url = $this->get_current_url();

		    if ( $this->enabled() ) {
			    $this->purge_css();
		    }

	    } );
    }


	public function frontend_scripts( $data ) {

		if ( ! isset( $this->options['uucss_load_original'] ) ) {
			return;
		}

		wp_register_script( 'rapidload', UUCSS_PLUGIN_URL . 'assets/js/rapidload.frontend.min.js', [ 'jquery' ] );
		wp_localize_script( 'rapidload', 'rapidload', $data['files'] );
		wp_enqueue_script( 'rapidload' );

	}


	public static function enqueueGlobalScript() {
		add_action( 'admin_enqueue_scripts', function () {
			wp_enqueue_script( 'popper', UUCSS_PLUGIN_URL . 'assets/libs/tippy/popper.min.js', array( 'jquery' ) );
			wp_enqueue_script( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy-bundle.umd.min.js', array( 'jquery' ) );
			wp_enqueue_style( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy.css' );

			wp_register_script( 'uucss_global_admin_script', UUCSS_PLUGIN_URL . 'assets/js/uucss_global.js', [ 'jquery' ], UUCSS_VERSION );
			$data = array(
		        'ajax_url'          => admin_url( 'admin-ajax.php' ),
		        'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
		        'on_board_complete' => UnusedCSS_Autoptimize_Onboard::on_board_completed(),
		        'home_url' => home_url(),
		        'api_url' => UnusedCSS_Api::get_key()
	        );
	        wp_localize_script( 'uucss_global_admin_script', 'uucss', $data );
	        wp_enqueue_script( 'uucss_global_admin_script' );
	        wp_enqueue_style( 'uucss_global_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_global.css', [], UUCSS_VERSION );

        });

		add_action('admin_bar_menu', function (){

			global $post;

			$data = array(
				'post_id'         => ($post) ? $post->ID : null,
				'post_link'       => ($post) ? get_permalink($post) : null,
			);

			wp_register_script( 'uucss_admin_bar_script', UUCSS_PLUGIN_URL . 'assets/js/admin_bar.js', [ 'jquery' ], UUCSS_VERSION );
			wp_localize_script( 'uucss_admin_bar_script', 'uucss_admin_bar', $data );
			wp_enqueue_script( 'uucss_admin_bar_script' );
		});
    }


	public function initFileSystem() {

		// load wp filesystem related files;
		require_once( ABSPATH . 'wp-admin/includes/file.php' );

		if ( function_exists( 'WP_Filesystem' ) ) {
			WP_Filesystem();
		}

		global $wp_filesystem;

		$this->file_system = $wp_filesystem;

		if ( ! $this->file_system || ! $this->file_system->is_writable( WP_CONTENT_DIR ) || ! $this->file_system->is_readable( WP_CONTENT_DIR ) ) {
			return false;
		}

		$this->set_base_dir();

		return true;

	}


    public function enabled() {

	    if ( $this->is_doing_api_fetch() ) {
		    return false;
	    }

	    // fix for uucss fallback css files being purged as url's
	    if ( $this->is_uucss_file() ) {
		    return false;
	    }

	    if ( ! $this->is_url_allowed() ) {
		    return false;
	    }

	    if ( is_admin() ) {
		    return false;
	    }

	    if ( wp_doing_ajax() ) {
		    return false;
	    }

	    if ( is_404() ) {
		    return false;
	    }

	    if ( is_preview() ) {
		    return false;
	    }

	    if ( $this->is_cli() ) {
		    return false;
	    }

	    if ( is_search() ) {
		    return false;
	    }

	    if ( defined( 'DOING_CRON' ) ) {
		    return false;
	    }

	    return true;

    }


    function enabled_frontend() {

	    if ( is_user_logged_in() ) {
		    return false;
	    }

	    if ( is_admin() ) {
		    return false;
	    }

	    return true;
    }


    public function init_async_store($provider, $url, $args)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args);
    }

    public function is_url_allowed($url = null, $args = null)
    {

	    // remove .css .js files from being analyzed
	    if ( preg_match( '/(.js|.css)$/', $url ) ) {
		    return false;
	    }

	    global $post;

	    if ( isset( $args['post_id'] ) ) {
		    $post = get_post( $args['post_id'] );
	    }

	    if ( $post ) {
		    $page_options = UnusedCSS_Admin::get_page_options( $post->ID );
		    if ( isset( $page_options['exclude'] ) && $page_options['exclude'] == "on" ) {
			    return false;
		    }

	    }

	    return true;
    }


	public function purge_css() {

		$this->url = $this->transform_url( $this->url );

		// disabled exceptions only for frontend
		if ( $this->enabled_frontend() ) {
			$this->get_css();
			$this->replace_css();
		}

		if ( ! UnusedCSS_Settings::link_exists( $this->url ) ) {
			$this->cache( $this->url );
		}

	}

    public function cache($url = null, $args = []) {

	    if ( ! $this->is_url_allowed( $url, $args ) ) {
		    return false;
	    }

	    global $post;

	    if ( ! isset( $args['post_id'] ) && $post ) {
		    $args['post_id'] = $post->ID;
	    }

	    if ( ! isset( $args['options'] ) ) {
		    $args['options'] = $this->api_options();
	    }

	    UnusedCSS_Settings::add_link( $url, null, "queued", [] );

	    if ( $this->async ) {
		    wp_schedule_single_event( time(), 'uucss_async_queue', [
			    'provider' => $this->provider,
			    'url'      => $url,
			    'args'     => $args
		    ] );
		    spawn_cron();
	    } else {
		    $this->init_async_store( $this->provider, $url, $args );
	    }

	    return true;
    }


	public function refresh( $url, $args = [] ) {
		$this->clear_cache( $url );
		$this->cache( $url, $args );
	}


	public function api_options( $post_id = null ) {
		global $post;

		if ( $post ) {
			$post_id = $post->ID;
		}

	    $whitelist_packs = [ 'wp' ];
	    if ( isset( $this->options['whitelist_packs'] ) ) {

		    foreach ( $this->options['whitelist_packs'] as $whitelist_pack ) {

			    // 9:wordpress
			    $pack              = $name = explode( ':', $whitelist_pack );
			    $whitelist_packs[] = $pack[0];

		    }

	    }

		$post_options = UnusedCSS_Admin::get_page_options( $post_id );

		$safelist = isset( $this->options['uucss_safelist'] ) ? json_decode( $this->options['uucss_safelist'] ) : [];

		$blocklist = isset( $this->options['uucss_blocklist'] ) ? json_decode( $this->options['uucss_blocklist'] ) : [];

		// merge post and global safelists
		if ( ! empty( $post_options['safelist'] ) ) {
			$safelist = array_merge( $safelist, json_decode( $post_options['safelist'] ) );
		}

		return [
			"keyframes"         => isset( $this->options['uucss_keyframes'] ),
			"fontFace"          => isset( $this->options['uucss_fontface'] ),
			"variables"         => isset( $this->options['uucss_variables'] ),
			"minify"            => isset( $this->options['uucss_minify'] ),
			"analyzeJavascript" => isset( $this->options['uucss_analyze_javascript'] ),
			"whitelistPacks"    => $whitelist_packs,
			"safelist"          => $safelist,
			"blocklist"          => $blocklist,
		];
    }

    protected function is_doing_api_fetch(){

	    $user_agent = '';
	    $headers    = [];

	    if ( function_exists( 'getallheaders' ) ) {
		    $headers = getallheaders();
	    }

	    if ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
		    $user_agent = $_SERVER['HTTP_USER_AGENT'];
	    }

	    if ( isset( $headers['User-Agent'] ) ) {
		    $user_agent = $headers['User-Agent'];
	    }

	    return strpos( $user_agent, 'UnusedCSS_bot' ) !== false ||
	           strpos( $user_agent, 'RapidLoad' ) !== false;
    }


    public function set_base_dir(){
        $this->base_dir = $this->file_system->wp_content_dir()  . $this->base;
    }


    protected function cache_file_exists($file){
        return $this->file_system->exists( $this->base_dir . '/' . $file );
    }


    public function clear_cache($url = null, $args = []) {

	    $args['url'] = $url;

	    self::log( 'cleared : ' . $url );

	    if ( $url && UnusedCSS_Settings::link_exists_with_error( $url ) ) {

		    if ( UnusedCSS_Settings::link_exists( $url ) ) {

			    // get unused files
			    $unused_files = UnusedCSS_DB::migrated() ? UnusedCSS_DB::link_files_used_elsewhere($url) : UnusedCSS_Settings::link_files_used_elsewhere( $url );

			    // remove unused files from filesystem
			    foreach ( $unused_files as $unused_file ) {
				    $this->file_system->delete( $this->base_dir . '/' . $unused_file );
			    }

			    do_action( 'uucss/cache_cleared', $args );
		    }

		    UnusedCSS_Settings::delete_link( $url );

		    return true;
	    }

	    if ( $url ) {
		    return false;
	    }

	    $results = $this->file_system->delete( $this->base_dir, true );

	    // if soft sets the status to queued
	    UnusedCSS_Settings::clear_links( isset( $args['soft'] ) );


	    do_action( 'uucss/cache_cleared', $args );

	    return ! is_wp_error( $results );
    }


    public function size() {

	    if ( ! $this->file_system || ! $this->file_system->exists( $this->base_dir ) ) {
		    return "0 KB";
	    }

	    $size = $this->dirSize( $this->base_dir );

	    return $this->human_file_size( $size );
    }


	protected function get_cached_file( $file_url, $cdn = null ) {

		if ( ! $cdn || empty( $cdn ) ) {
			$cdn = content_url();
		} else {

			// see if we can do this dynamically
			$cdn = rtrim( $cdn, '/' ) . '/wp-content';

		}

		return implode( '/', [
			$cdn,
			$this->base,
			$file_url
		] );
	}

	protected function get_inline_content( $file_url ) {

		$file = implode( '/', [
			$this->base_dir,
			$file_url
		] );

		return [
			'size'    => $this->file_system->size( $file ),
			'content' => $this->file_system->get_contents( $file )
		];
	}


    public function vanish() {
	    if ( ! $this->initFileSystem() ) {
		    return;
	    }

	    $delete = $this->file_system->wp_content_dir() . $this->base;

	    if ( ! $this->file_system->exists( $delete ) ) {
		    return;
	    }

	    UnusedCSS_Settings::clear_links();

	    $this->file_system->delete( $delete, true );
    }


}
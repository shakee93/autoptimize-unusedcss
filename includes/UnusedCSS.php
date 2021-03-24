<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

	use UnusedCSS_Utils;

	public $base = null;
	public $provider = null;

	public $url = null;
	public $css = [];
	public $store = null;
	public $options = [];
	public $async = true;

	public $file_system;

	public static $base_dir;


	abstract public function get_css();


    abstract public function replace_css();


    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        $this->file_system = new UnusedCSS_FileSystem();

        $this->base = apply_filters('uucss/cache-file-base-dir','/cache/rapidload/') . 'uucss';

	    if ( ! $this->initFileSystem() ) {
		    self::add_admin_notice( 'RapidLoad : couldn\'t access wordpress cache directory <b>(' . self::$base_dir . ')</b>. check for file permission issues in your site.' );

		    return;
	    }

        add_action('uucss_async_queue', [$this, 'init_async_store'], 2, 3);

	    add_action( 'wp_enqueue_scripts', function () {

		    $this->url = $this->get_current_url();

		    if ( $this->enabled() ) {
			    $this->purge_css();
		    }

	    }, 99);

    }


	public function frontend_scripts( $data ) {

		if ( ! isset( $this->options['uucss_load_original'] ) ) {
			return;
		}

		wp_register_script( 'rapidload', UUCSS_PLUGIN_URL . 'assets/js/rapidload.frontend.min.js', [ 'jquery' ], UUCSS_VERSION );
		wp_localize_script( 'rapidload', 'rapidload', $data['files'] );
		wp_enqueue_script( 'rapidload' );

	}


	public static function enqueueGlobalScript() {
		add_action( 'admin_enqueue_scripts', function () {
			wp_enqueue_script( 'popper', UUCSS_PLUGIN_URL . 'assets/libs/tippy/popper.min.js', array( 'jquery' ) );
			wp_enqueue_script( 'noty', UUCSS_PLUGIN_URL . 'assets/libs/noty/noty.js', array( 'jquery' ) );
			wp_enqueue_script( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy-bundle.umd.min.js', array( 'jquery' ) );
			wp_enqueue_style( 'tippy', UUCSS_PLUGIN_URL . 'assets/libs/tippy/tippy.css' );
			wp_enqueue_style( 'noty', UUCSS_PLUGIN_URL . 'assets/libs/noty/noty.css' );
			wp_enqueue_style( 'noty-animate', UUCSS_PLUGIN_URL . 'assets/libs/noty/animate.css' );
			wp_enqueue_style( 'noty-theme', UUCSS_PLUGIN_URL . 'assets/libs/noty/themes/mint.css' );
			wp_enqueue_style( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.css' );
            wp_enqueue_script( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.js' , array( 'jquery' ) );

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

		if ( ! $this->file_system ) {
			return false;
		}

		if ( ! $this->init_base_dir() ) {
			return false;
		}

        $this->init_log_dir();

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

	    return apply_filters('uucss/frontend/enabled', true);
    }


    public function init_async_store($provider, $url, $args)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args);
    }

    public function is_url_allowed($url = null, $args = null)
    {

	    // remove .css .js files from being analyzed
	    if ( preg_match( '/cache\/autoptimize/', $url ) ) {
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

        self::log([
            'log' => 'purging css started',
            'url' => $this->url,
            'type' => 'purging'
        ]);

		$this->url = $this->transform_url( $this->url );

		// disabled exceptions only for frontend
		if ( $this->enabled_frontend() ) {

            self::log([
                'log' => 'frontend enabled',
                'url' => $this->url,
                'type' => 'purging'
            ]);

			$this->get_css();

			if(UnusedCSS_Settings::link_exists( $this->url ) && !isset( $_REQUEST['no_uucss'] )){

                $data = UnusedCSS_Settings::get_link( $this->url );

                if ( $data['status'] === 'success' && isset($data['files']) ) {

                    $this->frontend_scripts($data);

                    new UnusedCSS_Enqueue($data);

                    $this->replace_css();
                }

            }


		}

        if ( isset( $this->options['uucss_disable_add_to_queue'] ) && $this->options['uucss_disable_add_to_queue'] == "1" ) {
            return;
        }

		if ( ! UnusedCSS_Settings::link_exists( $this->url ) ) {
			$this->cache( $this->url );
		}

	}

    public function cache($url = null, $args = []) {

	    if ( ! $this->is_url_allowed( $url, $args ) ) {
            self::log([
                'log' => 'url not allowed to purge',
                'url' => $url,
                'type' => 'purging'
            ]);
		    return false;
	    }

	    if ( ! isset( $args['post_id'] )) {
		    $args['post_id'] = url_to_postid($url);
	    }

	    if ( ! isset( $args['options'] ) ) {

	        $post_id = $args['post_id'] ? $args['post_id'] : false;

		    $args['options'] = $this->api_options($post_id);
	    }

        $exist_link = UnusedCSS_DB::get_link($url);

        if($exist_link && $exist_link['status'] == 'failed' && $exist_link['attempts'] >= 3 && !isset($args['immediate'])){
            self::log([
                'log' => 'url not purged due to failed attempts exceeded',
                'url' => $url,
                'type' => 'purging'
            ]);
            return false;
        }

        $link_data = array(
            'url' => $url,
            'files' => null,
            'status' => 'queued',
            'meta' => null
        );

        $link_data = UnusedCSS_DB::transform_link($link_data, false);

        UnusedCSS_DB::add_link($link_data);

        $this->async = apply_filters('uucss/purge/async',true);

	    if (! $this->async ) {
		    $this->init_async_store( $this->provider, $url, $args );
	    }

	    if ( isset( $args['immediate'] ) ) {

	    	UnusedCSS_DB::update_status('processing', $url);

	    	$spawned = $this->schedule_cron('uucss_async_queue', [
                'provider' => $this->provider,
                'url'      => $url,
                'args'     => $args
            ]);

            self::log([
                'log' => 'cron spawned : ' . $spawned,
                'url' => $url,
                'type' => 'queued'
            ]);

	    }
	    self::log([
		    'log' => 'link added to queue',
		    'url' => $url,
		    'type' => 'queued'
	    ]);
	    return true;
    }


	public function refresh( $url, $args = [] ) {
		$this->clear_cache( $url );
		$this->cache( $url, $args );
	}


	public function api_options( $post_id = false ) {

	    $whitelist_packs = [ 'wp' ];
	    if ( isset( $this->options['whitelist_packs'] ) ) {

		    foreach ( $this->options['whitelist_packs'] as $whitelist_pack ) {

			    // 9:wordpress
			    $pack              = $name = explode( ':', $whitelist_pack );
			    $whitelist_packs[] = $pack[0];

		    }

	    }

		$post_options = $post_id ? UnusedCSS_Admin::get_page_options( $post_id ) : [];

		$safelist = isset( $this->options['uucss_safelist'] ) ? json_decode( $this->options['uucss_safelist'] ) : [];

		$blocklist = isset( $this->options['uucss_blocklist'] ) ? json_decode( $this->options['uucss_blocklist'] ) : [];

		// merge post and global safelists
		if ( ! empty( $post_options['safelist'] ) ) {
			$safelist = array_merge( $safelist, json_decode( $post_options['safelist'] ) );
		}

        if ( ! empty( $post_options['blocklist'] ) ) {
            $blocklist = array_merge( $blocklist, json_decode( $post_options['blocklist'] ) );
        }

        $cacheBusting = false;

        if(isset($this->options['uucss_cache_busting_v2'])){

            $cacheBusting = apply_filters('uucss/cache/bust',[
                [
                    'type' => 'query',
                    'rule' => 'no_uucss=true'
                ]
            ]);

        }

		return apply_filters('uucss/api/options', [
			"keyframes"         => isset( $this->options['uucss_keyframes'] ),
			"fontFace"          => isset( $this->options['uucss_fontface'] ),
			"variables"         => isset( $this->options['uucss_variables'] ),
			"minify"            => isset( $this->options['uucss_minify'] ),
			"analyzeJavascript" => isset( $this->options['uucss_analyze_javascript'] ),
            "inlineCss"          => isset( $this->options['uucss_include_inline_css'] ),
			"whitelistPacks"    => $whitelist_packs,
			"safelist"          => $safelist,
			"blocklist"          => $blocklist,
            "cacheBusting"          => $cacheBusting,
		]);
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


	public function init_base_dir() {

		self::$base_dir = WP_CONTENT_DIR . $this->base;

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

	public function init_log_dir(){

        if ( $this->file_system->exists( UUCSS_LOG_DIR ) ) {
            return true;
        }

        $created = $this->file_system->mkdir( UUCSS_LOG_DIR );

        if (!$created || ! $this->file_system->is_writable( UUCSS_LOG_DIR ) || ! $this->file_system->is_readable( UUCSS_LOG_DIR ) ) {
            return false;
        }

        return true;
    }


    protected function cache_file_exists($file){
        return $this->file_system->exists( self::$base_dir . '/' . $file );
    }


    public function clear_cache($url = null, $args = []) {

	    $args['url'] = $url;

	    self::log( [
	        'log' => 'cleared',
	        'url' => $url,
            'type' => 'store'
        ] );

	    if ( $url && UnusedCSS_Settings::link_exists_with_error( $url ) ) {

		    if ( UnusedCSS_Settings::link_exists( $url ) ) {

			    // get unused files
			    $unused_files = UnusedCSS_DB::migrated() ? UnusedCSS_DB::link_files_used_elsewhere($url) : UnusedCSS_Settings::link_files_used_elsewhere( $url );

			    // remove unused files from filesystem
			    foreach ( $unused_files as $unused_file ) {
				    $this->file_system->delete( self::$base_dir . '/' . $unused_file );
			    }

			    do_action( 'uucss/cache_cleared', $args );
		    }

		    UnusedCSS_Settings::delete_link( $url );

		    return true;
	    }

	    if ( $url ) {
		    return false;
	    }

	    $results = $this->file_system->delete( self::$base_dir, true );

	    // if soft sets the status to queued
	    UnusedCSS_Settings::clear_links( isset( $args['soft'] ) );


	    do_action( 'uucss/cache_cleared', $args );

	    return ! is_wp_error( $results );
    }


    public function size() {

	    if ( ! $this->file_system || ! $this->file_system->exists( self::$base_dir ) ) {
		    return "0 KB";
	    }

	    $size = $this->dirSize( self::$base_dir );

	    return $this->human_file_size( $size );
    }


	public function get_cached_file( $file_url, $cdn = null ) {

		if ( ! $cdn || empty( $cdn ) ) {
			$cdn = content_url();
		} else {

            $url_parts = parse_url( content_url() );

			$cdn = rtrim( $cdn, '/' ) . (isset($url_parts['path']) ? rtrim( $url_parts['path'], '/' ) : '/wp-content');

		}

		return implode( '/', [
			$cdn,
            trim($this->base, "/"),
			$file_url
		] );
	}

	protected function get_inline_content( $file_url ) {

		$file = implode( '/', [
			self::$base_dir,
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

	    $delete = self::$base_dir;

	    if ( ! $this->file_system->exists( $delete ) ) {
		    return;
	    }

	    UnusedCSS_Settings::clear_links();

	    $this->file_system->delete( $delete, true );
    }

    public function cache_file_count(){
        $files = scandir(UnusedCSS::$base_dir);
        $files = array_filter($files, function ($file){
           return false !== strpos($file, '.css');
        });
        return count($files);
    }
}
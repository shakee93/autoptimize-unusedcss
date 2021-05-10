<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

	use UnusedCSS_Utils;

	public $base = null;
	public $provider = null;
	public static $provider_path = null;

	public $url = null;
	public $rule = null;
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
        register_deactivation_hook( UUCSS_PLUGIN_FILE, [ $this, 'vanish' ] );

        new UnusedCSS_Feedback();

        add_filter('plugin_row_meta',[$this, 'add_plugin_row_meta_links'],10,4);

        $this->add_update_message();

        self::enqueueGlobalScript();

        UnusedCSS_DB::check_db_updates();

        $this->file_system = new UnusedCSS_FileSystem();

        $this->base = apply_filters('uucss/cache-base-dir','/cache/rapidload/') . 'uucss';

	    if ( ! $this->initFileSystem() ) {
		    self::add_admin_notice( 'RapidLoad : couldn\'t access wordpress cache directory <b>(' . self::$base_dir . ')</b>. check for file permission issues in your site.' );

		    return;
	    }

        add_action( 'uucss/content_updated', [ $this, 'refresh' ], 10, 1 );

        add_action('uucss_async_queue', [$this, 'init_async_store'], 2, 3);

        add_action('uucss_async_queue_rule', [$this, 'init_async_store_rule'], 2, 4);

	    add_action( 'wp_enqueue_scripts', function () {

		    $this->url = $this->get_current_url();

		    if ( $this->enabled() ) {
			    $this->purge_css();
		    }

	    }, 99);

        add_filter('uucss/rules', [$this, 'uucss_rule_types'], 90 , 1);

        new UnusedCSS_Queue();
    }

    function uucss_rule_types($rules){

        $custom_posts = get_post_types();

        $rules[] = [
            'name' => 'front_page',
            'rule' => 'is_front_page',
            'callback' => is_front_page(),
        ];

        $rules[] = [
            'name' => '404',
            'rule' => 'is_404',
            'callback' => is_404(),
        ];

        $rules[] = [
            'name' => 'archive',
            'rule' => 'is_archive',
            'callback' => is_archive(),
        ];

        foreach ($custom_posts as $key => $value){
            if($value == 'page' || $value == 'post' || $value == 'product'){
                continue;
            }
            if(( $key = array_search($value, array_column($rules, 'name')) ) === false){
                $rules[] = [
                    'name' => $value,
                    'rule' => 'is_' . $value,
                    'callback' => get_post_type( get_the_ID() ) == $value,
                ];
            }
        }


        $rules[] = [
            'name' => 'author',
            'rule' => 'is_author',
            'callback' => is_author(),
        ];

        $rules[] = [
            'name' => 'category',
            'rule' => 'is_category',
            'callback' => is_category(),
        ];

        $rules[] = [
            'name' => 'home',
            'rule' => 'is_home',
            'callback' => is_home(),
        ];

        $rules[] = [
            'name' => 'page',
            'rule' => 'is_page',
            'callback' => is_page(),
        ];

        $rules[] = [
            'name' => 'post',
            'rule' => 'is_post',
            'callback' => is_singular(),
        ];

        $rules[] = [
            'name' => 'search',
            'rule' => 'is_search',
            'callback' => is_search(),
        ];

        $rules[] = [
            'name' => 'attachment',
            'rule' => 'is_attachment',
            'callback' => is_attachment(),
        ];

        $rules[] = [
            'name' => 'single',
            'rule' => 'is_single',
            'callback' => is_single(),
        ];

        $rules[] = [
            'name' => 'sticky',
            'rule' => 'is_sticky',
            'callback' => is_sticky(),
        ];

        $rules[] = [
            'name' => 'paged',
            'rule' => 'is_paged',
            'callback' => is_paged(),
        ];

        return $rules;
    }

    function add_plugin_row_meta_links($plugin_meta, $plugin_file, $plugin_data, $status)
    {
        if(isset($plugin_data['TextDomain']) && $plugin_data['TextDomain'] == 'autoptimize-unusedcss'){
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us" target="_blank">Documentation</a>';
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Submit Ticket</a>';
        }
        return $plugin_meta;
    }

    function add_update_message(){

        global $pagenow;

        if ( 'plugins.php' === $pagenow )
        {
            $file   = basename( UUCSS_PLUGIN_FILE );
            $folder = basename( dirname( UUCSS_PLUGIN_FILE ) );
            $hook = "in_plugin_update_message-{$folder}/{$file}";
            add_action( $hook, [$this, 'render_update_message'], 20, 2 );
        }

    }

    function render_update_message($plugin_data, $r ){

        $data = file_get_contents( 'https://raw.githubusercontent.com/shakee93/autoptimize-unusedcss/master/readme.txt?format=txt' );

        $changelog  = stristr( $data, '== Changelog ==' );

        $changelog = preg_split("/\=(.*?)\=/", str_replace('== Changelog ==','',$changelog));

        if(isset($changelog[1])){

            $changelog = explode('*', $changelog[1]);

            array_shift($changelog);

            echo '<div style="margin-bottom: 1em"><strong style="padding-left: 25px;">What\'s New ?</strong><ol style="list-style-type: disc;margin: 5px 50px">';

            foreach ($changelog as $index => $log){
                if($index == 3){
                    break;
                }
                echo '<li style="margin-bottom: 0">' . preg_replace("/\r|\n/","",$log) . '</li>';
            }

            echo '</ol></div><p style="display: none" class="empty">';

        }
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
		        'on_board_complete' => apply_filters('uucss/on-board/complete', false),
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

	    return apply_filters('uucss/enabled', true);

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

    public function init_async_store_rule($provider, $url, $args, $rule)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args, $rule);
        $this->store->purge_rule();
    }

    public function init_async_store($provider, $url, $args)
    {
        $this->store = new UnusedCSS_Store($provider, $url, $args);
        $this->store->purge_css();
    }

    public function is_url_allowed($url = null, $args = null)
    {

        if ( ! $url ) {
            $url = $this->url;
        }

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

        if ( isset( $this->options['uucss_excluded_links'] ) && ! empty( $this->options['uucss_excluded_links'] ) ) {
            $exploded = explode( ',', $this->options['uucss_excluded_links'] );

            foreach ( $exploded as $pattern ) {

                if ( filter_var( $pattern, FILTER_VALIDATE_URL ) ) {

                    $pattern = parse_url( $pattern );

                    $path = $pattern['path'];
                    $query = isset($pattern['query']) ? '?' . $pattern['query'] : '';

                    $pattern = $path . $query;

                }

                if(self::str_contains( $pattern, '*' ) && self::is_path_glob_matched(urldecode($url), $pattern)){
                    $this->log( 'skipped : ' . $url );
                    return false;
                }else if ( self::str_contains( urldecode($url), $pattern ) ) {
                    $this->log( 'skipped : ' . $url );
                    return false;
                }

            }
        }

        $url_parts = parse_url( $url );

        if(isset($url_parts['query']) && $this->str_contains($url_parts['query'], 'customize_changeset_uuid')){
            $this->log( 'skipped : ' . $url );
            return false;
        }

        if(!apply_filters('uucss/url/exclude', $url)){
            $this->log( 'skipped : ' . $url );
            return false;
        }

	    return true;
    }

    public function rules_enabled(){
        return
            isset( $this->options['uucss_enable_rule_based'] ) &&
            $this->options['uucss_enable_rule_based'] == "1" &&
            UnusedCSS_DB::$current_version > 1.2 &&
            apply_filters('uucss/rules/enable', false);
    }

	public function purge_css() {

		$this->url = $this->transform_url( $this->url );

        $this->rule = UnusedCSS_Rule::get_related_rule();

        if (    !UnusedCSS_Settings::link_exists( $this->url ) &&
            (!isset( $this->options['uucss_disable_add_to_queue'] ) ||
                isset( $this->options['uucss_disable_add_to_queue'] ) &&
                $this->options['uucss_disable_add_to_queue'] != "1"))
        {
            $this->cache( $this->url , $this->rule);
        }

		// disabled exceptions only for frontend
		if ( $this->enabled_frontend() && $this->is_url_allowed( $this->url, [] ) && !isset( $_REQUEST['no_uucss'] )) {

			$this->get_css();

            $data = null;

            if( !$this->rules_enabled() &&
                UnusedCSS_Settings::link_exists( $this->url )
            ){

                $data = new UnusedCSS_Path([
                    'url' => $this->url,
                    'rule' => isset($this->rule['rule']) ? $this->rule['rule'] : null
                ]);

            }
            else if($this->rules_enabled() &&
                UnusedCSS_Settings::link_exists( $this->url )){

                $data = new UnusedCSS_Path([
                    'url' => $this->url,
                    'rule' => isset($this->rule['rule']) ? $this->rule['rule'] : null,
                    'status' => isset($this->rule['rule']) ? 'rule-based' : 'queued'
                ]);

                if(isset($data->rule) && isset($data->ignore_rule) && $data->ignore_rule == '0') {

                    $applicable_rule = UnusedCSS_DB::get_applied_rule($data->rule, $data->url);

                    if($applicable_rule){

                        $data = new UnusedCSS_Rule([
                            'rule' => $applicable_rule->rule,
                            'regex' => $applicable_rule->regex
                        ]);

                    }

                }

            }

			if(isset($data) && $data->status === 'success'){

                $files = $data->get_files();

                if (count($files) > 0 ) {

                    $this->frontend_scripts([
                        'files' => $files
                    ]);

                    new UnusedCSS_Enqueue($data);

                    $this->replace_css();
                }

            }

		}

	}

	/*public function cache_rule($related_rule = null, $args = []){

        if ( ! $this->is_url_allowed( $this->url, $args ) ) {
            self::log([
                'log' => 'url not allowed to purge',
                'url' => $this->url,
                'type' => 'purging'
            ]);
            return false;
        }

        if(UnusedCSS_Settings::link_exists_with_error( $this->url )){

            $path = new UnusedCSS_Path([
                'url' => $this->url,
            ]);

            $path->ignore_rule = '1';
            return false;
        }

        if($related_rule && isset($related_rule['rule'])){

            new UnusedCSS_Rule([
                'rule' => $related_rule['rule'],
                'url' => $this->url
            ]);
        }

        if (    !UnusedCSS_Settings::link_exists( $this->url ) &&
            (!isset( $this->options['uucss_disable_add_to_queue'] ) ||
                isset( $this->options['uucss_disable_add_to_queue'] ) &&
                $this->options['uucss_disable_add_to_queue'] != "1"))
        {
            new UnusedCSS_Path([
                'url' => $this->url,
                'rule' => isset($related_rule['rule']) ? $related_rule['rule'] : null,
                'status' => isset($related_rule['rule']) ? 'rule-based' : 'queued',
            ]);
        }

    }*/

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

        $applicable_rule = false;
        $rules_enabled = $this->rules_enabled();

	    if(isset($args['rule']) && $rules_enabled){

            $applicable_rule = UnusedCSS_DB::get_applied_rule($args['rule'], $url);

        }

        $path = new UnusedCSS_Path([
            'url' => $url,
            'rule' => isset($args['rule']) ? $args['rule'] : null,
            'status' => $applicable_rule ? 'rule-based' : 'queued'
        ]);

	    if($rules_enabled && $applicable_rule){
            return true;
        }

        if($path->status == 'failed' && $path->attempts >= 3 && !isset($args['immediate'])){
            self::log([
                'log' => 'url not purged due to failed attempts exceeded',
                'url' => $url,
                'type' => 'purging'
            ]);
            return false;
        }

        $path->requeue();
        $path->save();

        $this->async = apply_filters('uucss/purge/async',true);

	    if (! $this->async || isset($args['first_job'])) {

            if($path->is_type('path')){
                $this->init_async_store($this->provider, $url, $args);
            }else{
                $this->init_async_store_rule($this->provider, $url, $args, $path);
            }

            self::log([
                'log' => 'link purged',
                'url' => $url,
                'type' => 'queued'
            ]);

        }else if ( isset( $args['immediate'] ) ) {

            $spawned = false;

            if($path->is_type('path')){
                $spawned = $this->schedule_cron('uucss_async_queue', [
                    'provider' => $this->provider,
                    'url'      => $url,
                    'args'     => $args
                ]);
            }else{
                $spawned = $this->schedule_cron('uucss_async_queue_rule', [
                    'provider' => $this->provider,
                    'url'      => $url,
                    'args'     => $args,
                    'rule'     => $path
                ]);
            }

	    	if($spawned){
                $path->status = 'processing';
                $path->save();
            }

            self::log([
                'log' => 'cron spawned : ' . $spawned,
                'url' => $url,
                'type' => 'queued'
            ]);

            self::log([
                'log' => 'link added to queue',
                'url' => $url,
                'type' => 'queued'
            ]);
	    }

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

            $cacheBusting = apply_filters('uucss/cache/bust',[]);

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
	    $rule = isset($args['rule']) ? $args['rule'] : false;
	    $regex = isset($args['regex']) ? $args['regex'] : false;

	    self::log( [
	        'log' => 'cleared',
	        'url' => $url,
            'type' => 'store'
        ] );

	    if ( $url && UnusedCSS_Settings::link_exists_with_error( $url ) ) {

		    if ( UnusedCSS_Settings::link_exists( $url ) ) {

			    // get unused files
			    $unused_files = UnusedCSS_DB::migrated() ? UnusedCSS_DB::link_files_used_elsewhere($url, $rule) : UnusedCSS_Settings::link_files_used_elsewhere( $url );

			    // remove unused files from filesystem
			    foreach ( $unused_files as $unused_file ) {
				    $this->file_system->delete( self::$base_dir . '/' . $unused_file );
			    }

			    do_action( 'uucss/cache_cleared', $args );
		    }

		    UnusedCSS_Settings::delete_link( $url );
	    }

        if($rule && UnusedCSS_DB::rule_exists_with_error( $rule , $regex)){

            UnusedCSS_DB::delete_rule($args);
        }

	    if ( $url || $rule) {
		    return false;
	    }

	    self::uucss_log('here');

	    $results = $this->file_system->delete( self::$base_dir, true );

	    // if soft sets the status to queued
	    UnusedCSS_Settings::clear_links( isset( $args['soft'] ) );

        if(isset($_POST['type']) && $_POST['type'] == 'rule'){
            UnusedCSS_DB::clear_rules( isset( $args['soft'] ));
        }


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

    public function is_provider_installed() {
        $file = ABSPATH . PLUGINDIR . '/' . self::$provider_path;

        return file_exists( $file );
    }
}
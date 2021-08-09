<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS {

	use RapidLoad_Utils;

	public $base = null;
	public $provider = null;
	public static $provider_path = null;

	public $url = null;
	public $rule = null;
	public $applicable_rule = null;
	public $existing_link = null;
	public $css = [];
	public $store = null;
	public $options = [];
	public $async = true;

	public $file_system;

	public static $base_dir;


	abstract public function get_css();

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        add_action('rapidload/vanish', [ $this, 'vanish' ]);

        $this->file_system = new RapidLoad_FileSystem();

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

        add_action('uucss/clear', function (){
            $args['soft'] = true;
            $this->clear_cache(null, $args);
        });

        add_action('rapidload/job/updated', function ($job, $status){

            if($status && $job && isset($job->id)){
                new UnusedCSS_Path([
                   'url' => $job->url
                ]);
            }

        }, 10 , 2);

        new UnusedCSS_Queue();
    }

    function uucss_rule_types($rules){

        $custom_posts = get_post_types(
            array(
                'public'   => true,
                '_builtin' => false,
            ),
            'names',
            'and'
        );

        $taxonomies = get_taxonomies([
            'public' => true
        ]);

        $rules[] = [
            'name' => 'front_page',
            'rule' => 'is_front_page',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_front_page();
            },
        ];

        $rules[] = [
            'name' => '404',
            'rule' => 'is_404',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_404();
            },
        ];

        $rules[] = [
            'name' => 'archive',
            'rule' => 'is_archive',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_archive();
            },
        ];

        foreach ($custom_posts as $key => $value){
            if($value == 'page' || $value == 'post' || $value == 'product'){
                continue;
            }
            if(( $key = array_search($value, array_column($rules, 'name')) ) === false){

                $rules[] = [
                    'name' => $value,
                    'rule' => 'is_' . $value,
                    'category' => 'Custom Post Types',
                    'priority' => 5,
                    'callback' => function() use($value){
                        return get_post_type( get_the_ID() ) == $value;
                    }
                ];
            }
        }

        foreach ($taxonomies as $key => $value){
            if(( $key = array_search($value, array_column($rules, 'name')) ) === false){

                $rules[] = [
                    'name' => $value,
                    'rule' => 'is_' . $value,
                    'category' => 'Taxonomies',
                    'priority' => 5,
                    'callback' => function() use($value){
                        return is_tax($value);
                    },
                ];
            }
        }

        $rules[] = [
            'name' => 'author',
            'rule' => 'is_author',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_author();
            },
        ];

        $rules[] = [
            'name' => 'home',
            'rule' => 'is_home',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_home();
            },
        ];

        $rules[] = [
            'name' => 'page',
            'rule' => 'is_page',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_page();
            },
        ];

        $rules[] = [
            'name' => 'post',
            'rule' => 'is_post',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_singular();
            },
        ];

        $rules[] = [
            'name' => 'search',
            'rule' => 'is_search',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_search();
            },
        ];

        $rules[] = [
            'name' => 'attachment',
            'rule' => 'is_attachment',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_attachment();
            },
        ];

        $rules[] = [
            'name' => 'single',
            'rule' => 'is_single',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_single();
            },
        ];

        $rules[] = [
            'name' => 'sticky',
            'rule' => 'is_sticky',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_sticky();
            },
        ];

        $rules[] = [
            'name' => 'paged',
            'rule' => 'is_paged',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_paged();
            },
        ];

        return $rules;
    }

	public function frontend_scripts( $data ) {

		if ( ! isset( $this->options['uucss_load_original'] ) ) {
			return;
		}

		wp_register_script( 'rapidload', UUCSS_PLUGIN_URL . 'assets/js/rapidload.frontend.min.js', [ 'jquery' ], UUCSS_VERSION );
		wp_localize_script( 'rapidload', 'rapidload', $data['files'] );
		wp_enqueue_script( 'rapidload' );

	}

	public function initFileSystem() {

        $this->file_system = new RapidLoad_FileSystem();

        // Todo cache base setup
        /*$cache_base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR);

        $cache_base_option = RapidLoad_Base::get_option('rapidload_cache_base', null);

        if(!isset($cache_base_option)){

            $cache_base_option = $cache_base;
            RapidLoad_Base::update_option('rapidload_cache_base', $cache_base_option);
        }

        $this->base = RapidLoad_ThirdParty::plugin_exists('autoptimize') ? $cache_base_option . 'uucss' : $cache_base . 'uucss';*/

        $this->base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR)  . 'uucss';

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

	    if ( ! $this->is_url_allowed($this->url) ) {
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
        $this->store = new RapidLoad_Store($provider, $url, $args, $rule);
        $this->store->purge_rule();
    }

    public function init_async_store($provider, $url, $args)
    {
        $this->store = new RapidLoad_Store($provider, $url, $args);
        $this->store->purge_css();
    }

	public function purge_css() {

        global $rapidload;

		$this->url = $this->transform_url( $this->url );

        $this->rule = UnusedCSS_Rule::get_related_rule();

        $data = null;
        $link = null;

        $this->existing_link = RapidLoad_Settings::link_exists( $this->url );

        if(isset($this->rule['rule']) && $rapidload->rules_enabled()){

            $this->applicable_rule = UnusedCSS_DB::get_applied_rule($this->rule['rule'], $this->url);

        }

        if (    !$this->existing_link &&
            (!isset( $this->options['uucss_disable_add_to_queue'] ) ||
                isset( $this->options['uucss_disable_add_to_queue'] ) &&
                $this->options['uucss_disable_add_to_queue'] != "1") || $this->applicable_rule)
        {

            $this->cache( $this->url , $this->rule);
        }

		// disabled exceptions only for frontend
		if ( $this->is_url_allowed( $this->url) ) {

			$this->get_css();

            if( !$rapidload->rules_enabled() &&
                $this->existing_link
            ){

                self::log([
                    'log' => 'success link exist',
                    'url' => $this->url,
                    'type' => 'purging'
                ]);

                $data = new UnusedCSS_Path([
                    'url' => $this->url
                ]);

            }
            else if($rapidload->rules_enabled() &&
                $this->existing_link){

                self::log([
                    'log' => 'success link exist with rules ',
                    'url' => $this->url,
                    'type' => 'purging'
                ]);

                $data = new UnusedCSS_Path([
                    'url' => $this->url,
                    'rule' => isset($this->rule['rule']) ? $this->rule['rule'] : null,
                    'status' => isset($this->rule['rule']) ? 'rule-based' : 'queued'
                ]);

                if(isset($data->rule_id)) {

                    $applicable_rule = UnusedCSS_Rule::get_rule_from_id($data->rule_id);

                    if($applicable_rule){

                        $link = $data;
                        $data = $applicable_rule;

                    }

                }elseif (isset($this->rule['rule']) && $data->is_type('Path') && $data->rule_note != 'detached'){

                    if($this->applicable_rule){

                        $data->attach_rule($this->applicable_rule->id, $this->applicable_rule->rule);
                        $data->save();

                        $link = $data;
                        $data = new UnusedCSS_Rule([
                           'rule' => $this->applicable_rule->rule,
                           'regex' => $this->applicable_rule->regex,
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

                }

            }

		}

        if($this->existing_link){
            new UnusedCSS_Enqueue($data, $this->url, $link);
        }

	}

    public function cache($url = null, $args = []) {

	    if ( ! $this->is_url_allowed( $url, $args) ) {
            self::log([
                'log' => 'url not allowed to purge',
                'url' => $url,
                'type' => 'purging'
            ]);
		    return false;
	    }

	    if(isset( $args['rule'] )){
            self::log([
                'log' => 'url caching with ' . $args['rule'],
                'url' => $url,
                'type' => 'purging'
            ]);
        }

	    if ( ! isset( $args['post_id'] )) {
		    $args['post_id'] = url_to_postid($url);
	    }

	    if ( ! isset( $args['options'] ) ) {

	        $post_id = $args['post_id'] ? $args['post_id'] : false;

		    $args['options'] = $this->api_options($post_id);
	    }

	    if(!$this->applicable_rule && isset($args['rule'])){

            $this->applicable_rule = UnusedCSS_DB::get_applied_rule($args['rule'], $url);

        }

	    if($this->applicable_rule){

            $this->existing_link = new UnusedCSS_Rule([
                'rule' => $this->applicable_rule->rule,
                'regex' => $this->applicable_rule->regex
            ]);

            new UnusedCSS_Path([
                'url' => $url,
                'rule' => $this->applicable_rule->rule,
                'status' => 'rule-based',
                'rule_id' => $this->existing_link->id
            ]);

        }else{

            $this->existing_link = new UnusedCSS_Path([
                'url' => $url,
                'status' => 'queued'
            ]);

        }

        if($this->existing_link->status == 'failed' && $this->existing_link->attempts > 2 && !isset($args['immediate'])){
            self::log([
                'log' => 'url not purged due to failed attempts exceeded',
                'url' => $url,
                'type' => 'purging'
            ]);
            return false;
        }

        if($this->existing_link->is_type('Path')){

            $this->existing_link->rule_id = NULL;
            $this->existing_link->requeue();
            $this->existing_link->save();

        }else{

            if($this->existing_link->status == 'failed'){

                $this->existing_link->requeue();
                $this->existing_link->save();

            }

        }

        $this->async = apply_filters('uucss/purge/async',true);

	    if (! $this->async || isset($args['first_job'])) {

            if($this->existing_link->is_type('Path')){
                $this->init_async_store($this->provider, $url, $args);
            }else{
                $this->init_async_store_rule($this->provider, $url, $args, $this->existing_link);
            }

            self::log([
                'log' => 'link purged',
                'url' => $url,
                'type' => 'queued'
            ]);

        }else if ( isset( $args['immediate'] ) ) {

            $spawned = false;

            if($this->existing_link->is_type('Path')){
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
                    'rule'     => $this->existing_link
                ]);
            }

            $this->existing_link->status = 'processing';
            $this->existing_link->save();

	    	if(!$spawned){

                if($this->existing_link->is_type('Path')){
                    $this->init_async_store($this->provider, $url, $args);
                }else{
                    $this->init_async_store_rule($this->provider, $url, $args, $this->existing_link);
                }

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

		$post_options = $post_id ? RapidLoad_Base::get_page_options( $post_id ) : [];

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

        $created = $this->file_system->mkdir( UUCSS_LOG_DIR , 0755, !$this->file_system->exists( wp_get_upload_dir()['basedir'] . '/rapidload/' ));

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

	    if ( $url && RapidLoad_Settings::link_exists_with_error( $url ) || $rule && $regex && UnusedCSS_DB::rule_exists_with_error($rule, $regex)) {

		    $this->clear_files($url, $args, $rule, $regex);
	    }

	    if ( $url || $rule && $regex) {
		    return false;
	    }

        $results = false;

	    if(isset($args['type']) && $args['type'] == 'rule'){

            $rules = UnusedCSS_DB::get_rules_where(' WHERE id > 0');

            foreach ($rules as $rule){

                $this->clear_files($rule['url'], [ 'url' => $rule['url'] , 'soft' => isset( $args['soft']) ] , $rule['rule'], $rule['regex']);

            }

        }else{

            $this->file_system->delete( self::$base_dir, true );

            RapidLoad_Settings::clear_links( isset( $args['soft'] ) );
            UnusedCSS_DB::update_rule_status();

            do_action( 'uucss/cache_cleared', $args );
        }

	    return true;
    }

    public function remove_unused_files($url, $rule = false, $regex = false){

        // get unused files
        $unused_files = RapidLoad_DB::migrated() ? UnusedCSS_DB::link_files_used_elsewhere($url, $rule, $regex) : RapidLoad_Settings::link_files_used_elsewhere( $url );

        // remove unused files from filesystem
        foreach ( $unused_files as $unused_file ) {
            $this->file_system->delete( self::$base_dir . '/' . $unused_file );
        }

    }

    public function clear_files($url, $args, $rule = false, $regex = false ){

        if ( RapidLoad_Settings::link_exists( $url ) || UnusedCSS_DB::rule_exists($rule, $regex)) {

            $this->remove_unused_files($url, $rule, $regex);

        }

        if($url && !$rule && !$regex){

            RapidLoad_Settings::delete_link($url);

        }else{

            UnusedCSS_DB::requeue_urls([
                $url
            ]);

        }

        if($rule && $regex){
            UnusedCSS_DB::delete_rule([
                'rule' => $rule,
                'regex' => $regex
            ]);
        }

        do_action( 'uucss/cache_cleared', $args );

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

	    RapidLoad_Settings::clear_links();

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

    public function cleanCacheFiles(){

        $links = UnusedCSS_DB::get_links_where(" WHERE status = 'success' ");
        $rules = UnusedCSS_DB::get_rules_where(" WHERE status = 'success' ");

        $used_files = [];

        foreach ($links as $link){

            if(isset($link['files']) && !empty($link['files'])){
                $uucss_files = array_column($link['files'],'uucss');
                if(isset($uucss_files) && !empty($uucss_files)){
                    $used_files = array_merge($used_files, $uucss_files);
                }
            }

        }

        foreach ($rules as $rule){

            if(isset($rule['files']) && !empty($rule['files'])){
                $uucss_files = array_column($rule['files'],'uucss');
                if(isset($uucss_files) && !empty($uucss_files)){
                    $used_files = array_merge($used_files, $uucss_files);
                }
            }

        }

        if ($handle = opendir(UnusedCSS::$base_dir)) {
            while (false !== ($file = readdir($handle))) {
                if ('.' === $file) continue;
                if ('..' === $file) continue;

                if(!in_array($file, $used_files) && $this->file_system->exists(UnusedCSS::$base_dir . '/' . $file)){
                    $this->file_system->delete(UnusedCSS::$base_dir . '/' . $file);
                }
            }
            closedir($handle);
        }
    }
}
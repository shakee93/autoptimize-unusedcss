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

            $this->url = $this->transform_url( $this->url );

		    if ( $this->enabled() ) {

                if(RapidLoad_Base::get()->rules_enabled()){

                    $this->rule = $this->get_current_rule($this->url);

                    self::log([
                        'log' => 'UnusedCSS->rules_enabled-'. json_encode($this->rule),
                        'type' => 'purging' ,
                        'url' => $this->url
                    ]);
                }

                self::log([
                    'log' => 'UnusedCSS->enabled',
                    'type' => 'purging' ,
                    'url' => $this->url
                ]);

			    $this->purge_css();
		    }else{

                self::log([
                    'log' => 'UnusedCSS->enabled:failed',
                    'type' => 'purging' ,
                    'url' => $this->url
                ]);

            }

	    }, 99);

        add_filter('uucss/rules', [$this, 'uucss_rule_types'], 90 , 1);

        add_action('uucss/clear', function (){
            $args['soft'] = true;
            $this->clear_cache(null, $args);
        });

        add_action('rapidload/job/updated', function ($job, $status){

            if($job && isset($job->id) && isset($job->rule) ){
                if($job->rule == 'is_url'){
                    new UnusedCSS_Path([
                        'url' => $job->url
                    ]);
                }else{
                    new UnusedCSS_Rule([
                        'url' => $job->url,
                        'rule' => $job->rule,
                        'regex' => $job->regex
                    ]);
                }
            }

        }, 10 , 2);

        new UnusedCSS_Queue();
    }

    function get_current_rule($url)
    {
        $rules = RapidLoad_Base::get()->get_pre_defined_rules();
        $user_defined_rules = UnusedCSS_DB::get_rule_names();

        $related_rule = false;

        foreach ($user_defined_rules as $rule_name){

            $key = array_search($rule_name, array_column($rules, 'rule'));

            if(is_numeric($key) && isset($rules[$key]) &&
                isset($rules[$key]['callback']) && is_callable($rules[$key]['callback']) && $rules[$key]['callback']() ){

                $_related_rule = UnusedCSS_DB::get_applied_rule($rules[$key]['rule'], $url);

                if($_related_rule){

                    $related_rule = $_related_rule;
                    break;
                }

            }
        }

        return $related_rule;
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
            if ( (( $key = array_search($value, array_column($rules, 'name')) ) === false) && (! in_array($value, array( 'category', 'post_tag' )) ) ) {
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

        $rules[] = [
            'name' => 'path',
            'rule' => 'is_path',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return true;
            },
        ];

        $rules[] = [
            'name' => 'tag',
            'rule' => 'is_tag',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_tag();
            },
        ];

        $rules[] = [
            'name' => 'category',
            'rule' => 'is_category',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_category();
            },
        ];

        return $rules;
    }

	public function frontend_scripts( $data ) {

		if ( ! isset( $this->options['uucss_load_original'] ) ) {
			return;
		}

		$data['frontend_debug'] = RapidLoad_Enqueue::$frontend_debug;
		$data['remove_cpcss_on_ui'] = apply_filters('rapidload/cpcss/remove_on_user_interaction', true);
		wp_register_script( 'rapidload', UUCSS_PLUGIN_URL . 'assets/js/rapidload.frontend.min.js', [ 'jquery' ], UUCSS_VERSION );
		wp_localize_script( 'rapidload', 'rapidload', $data );
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

        self::log([
            'log' => 'UnusedCSS->purge_css:after_transform',
            'type' => 'purging' ,
            'url' => $this->url
        ]);

        $data = null;
        $link = null;

        $this->existing_link = RapidLoad_Settings::link_exists( $this->url );

        if (    !$this->existing_link &&
            (!isset( $this->options['uucss_disable_add_to_queue'] ) ||
                isset( $this->options['uucss_disable_add_to_queue'] ) &&
                $this->options['uucss_disable_add_to_queue'] != "1") || $this->rule)
        {

            self::log([
                'log' => 'UnusedCSS->purge_css:url_not_exist',
                'type' => 'purging' ,
                'url' => $this->url
            ]);

            $this->cache( $this->url , []);
        }

		// disabled exceptions only for frontend
		if ( $this->is_url_allowed( $this->url) ) {

			$this->get_css();

            self::log([
                'log' => 'UnusedCSS->purge_css:is_url_allowed',
                'type' => 'purging' ,
                'url' => $this->url
            ]);

            if( !$rapidload->rules_enabled() &&
                $this->existing_link
            ){

                if(gettype($this->existing_link) == "boolean"){
                    $data = new UnusedCSS_Path([
                        'url' => $this->url
                    ]);
                }else{
                    $data = $this->existing_link;
                }

                self::log([
                    'log' => 'UnusedCSS->purge_css:url_exist',
                    'type' => 'purging' ,
                    'url' => $this->url
                ]);

            }
            else if($rapidload->rules_enabled() &&
                $this->existing_link){

                $data = new UnusedCSS_Path([
                    'url' => $this->url,
                    'rule' => $this->rule ? $this->rule->rule : null,
                    'status' => $this->rule ? 'rule-based' : 'queued'
                ]);

                if(isset($data->rule_id)) {

                    $link = $data;
                    if(gettype($this->existing_link) == "boolean"){
                        $data = UnusedCSS_Rule::get_rule_from_id($data->rule_id);
                    }else{
                        $data = $this->existing_link;
                    }


                }elseif ($this->rule && $data->is_type('Path') && $data->rule_note != 'detached'){

                    $data->attach_rule($this->rule->id, $this->rule->rule);
                    $data->save();

                    $link = $data;

                    if(gettype($this->existing_link) == "boolean"){
                        $data = new UnusedCSS_Rule([
                            'rule' => $this->rule->rule,
                            'regex' => $this->rule->regex,
                        ]);
                    }else{
                        $data = $this->existing_link;
                    }

                }

                self::log([
                    'log' => 'UnusedCSS->purge_css:url_exist',
                    'type' => 'purging' ,
                    'url' => $this->url
                ]);

            }

			if(isset($data) && $data->status === 'success'){

                $files = $data->get_files();

                if (is_array($files) && count($files) > 0 ) {

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
		    return false;
	    }

	    if ( ! isset( $args['post_id'] )) {
		    $args['post_id'] = url_to_postid($url);
	    }

	    if ( ! isset( $args['options'] ) ) {

	        $post_id = $args['post_id'] ? $args['post_id'] : false;

		    $args['options'] = $this->api_options($post_id);
	    }

	    if(RapidLoad_Base::get()->rules_enabled() && !$this->rule && isset($args['rule_id'])){

            $this->rule = UnusedCSS_Rule::get_rule_from_id($args['rule_id']);

        }

	    if($this->rule){

            $this->existing_link = new UnusedCSS_Rule([
                'rule' => $this->rule->rule,
                'regex' => $this->rule->regex
            ]);

            new UnusedCSS_Path([
                'url' => $url,
                'rule' => $this->existing_link->rule,
                'status' => 'rule-based',
                'rule_id' => $this->existing_link->id
            ]);

            self::log([
                'log' => 'UnusedCSS->cache:get_url_for_rule',
                'type' => 'purging' ,
                'url' => $url
            ]);

        }else{

            $this->existing_link = new UnusedCSS_Path([
                'url' => $url,
                'status' => 'queued'
            ]);

            self::log([
                'log' => 'UnusedCSS->cache:get_url',
                'type' => 'purging' ,
                'url' => $url
            ]);
        }

        if($this->existing_link->status == 'failed' && $this->existing_link->attempts > 2 && !isset($args['immediate'])){

            self::log([
                'log' => 'UnusedCSS->cache:url_failed_attempts',
                'type' => 'purging' ,
                'url' => $url
            ]);
            return false;
        }

        if($this->existing_link->is_type('Path')){

            $this->existing_link->rule_id = NULL;
            $this->existing_link->requeue(isset($args['immediate']) ? 0 : -1);
            $this->existing_link->save();

            self::log([
                'log' => 'UnusedCSS->cache:url_status_updated-queued',
                'type' => 'purging' ,
                'url' => $url
            ]);

        }else{

            if($this->existing_link->status == 'failed'){

                $this->existing_link->requeue(isset($args['immediate']) ? 0 : -1);
                $this->existing_link->save();

                self::log([
                    'log' => 'UnusedCSS->cache:rule_status_updated-queued',
                    'type' => 'purging' ,
                    'url' => $url
                ]);

            }

        }

        $this->async = apply_filters('uucss/purge/async',true);

	    if (! $this->async || isset($args['first_job'])) {

            if($this->existing_link->is_type('Path')){
                $this->init_async_store($this->provider, $url, $args);
                self::log([
                    'log' => 'UnusedCSS->cache:init_async_store',
                    'type' => 'purging' ,
                    'url' => $url
                ]);
            }else{
                $this->init_async_store_rule($this->provider, $url, $args, $this->existing_link);
                self::log([
                    'log' => 'UnusedCSS->cache:init_async_store_rule',
                    'type' => 'purging' ,
                    'url' => $url
                ]);
            }

        }else if ( isset( $args['immediate'] ) ) {

            $spawned = false;

            if($this->existing_link->is_type('Path')){
                $spawned = $this->schedule_cron('uucss_async_queue', [
                    'provider' => $this->provider,
                    'url'      => $url,
                    'args'     => $args
                ]);
                self::log([
                    'log' => 'UnusedCSS->cache:schedule_cron-uucss_async_queue-' . $spawned,
                    'type' => 'purging' ,
                    'url' => $url
                ]);
            }else{

                $spawned = $this->schedule_cron('uucss_async_queue_rule', [
                    'provider' => $this->provider,
                    'url'      => $url,
                    'args'     => $args,
                    'rule'     => $this->existing_link
                ]);
                self::log([
                    'log' => 'UnusedCSS->cache:schedule_cron-uucss_async_queue_rule-' . $spawned,
                    'type' => 'purging' ,
                    'url' => $url
                ]);
            }

            $this->existing_link->status = 'processing';
            $this->existing_link->save();

            self::log([
                'log' => 'UnusedCSS->cache:url_status_updated-processing',
                'type' => 'purging' ,
                'url' => $url
            ]);

	    	if(!$spawned){

                if($this->existing_link->is_type('Path')){
                    $this->init_async_store($this->provider, $url, $args);
                    self::log([
                        'log' => 'UnusedCSS->cache:init_async_store',
                        'type' => 'purging' ,
                        'url' => $url
                    ]);
                }else{
                    $this->init_async_store_rule($this->provider, $url, $args, $this->existing_link);
                    self::log([
                        'log' => 'UnusedCSS->cache:init_async_store_rule',
                        'type' => 'purging' ,
                        'url' => $url
                    ]);
                }

            }
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

		self::$base_dir = get_option('upload_path', WP_CONTENT_DIR) . $this->base;

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

        if(!self::get_log_option()){
            return false;
        }

        if ( $this->file_system->exists( UUCSS_LOG_DIR ) ) {
            return true;
        }

        if( $this->file_system->is_writable( UUCSS_LOG_DIR ) ){
            return false;
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
			$cdn = get_option('upload_url_path',WP_CONTENT_URL);
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

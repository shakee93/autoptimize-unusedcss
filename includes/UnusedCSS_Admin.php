<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS_Admin {

	use UnusedCSS_Utils;

	/**
	 * @var UnusedCSS_Autoptimize
     */
    public $uucss;

    /**
     * @var bool
     */
    public static $enabled = true;

    /**
     * Page related meta options
     * @var array
     */
    public static $page_options = [
	    'safelist',
	    'exclude',
	    'blocklist'
    ];

    /**
     * UnusedCSS constructor.
     * @param UnusedCSS $uucss
     */
    public function __construct($uucss)
    {

        $this->uucss = $uucss;


	    if (!self::$enabled) {
		    return;
	    }

	    $this->cache_trigger_hooks();
	    add_action( 'add_meta_boxes', [$this, 'add_meta_boxes'] );
	    add_action( 'save_post', [$this, 'save_meta_box_options'] , 10, 2);

        add_action('wp_ajax_clear_page_cache', [$this, 'clear_page_cache']);
        add_action('wp_ajax_mark_faqs_read', [$this, 'mark_faqs_read']);
        add_action('wp_ajax_frontend_logs', [$this, 'frontend_logs']);
        add_action('wp_ajax_uucss_logs', [$this, 'uucss_logs']);
        add_action('wp_ajax_clear_uucss_logs', [$this, 'clear_uucss_logs']);
        add_action( "wp_ajax_uucss_test_url", [ $this, 'uucss_test_url' ] );

        add_filter( 'plugin_action_links_' . plugin_basename( UUCSS_PLUGIN_FILE ), [
            $this,
            'add_plugin_action_link'
        ] );

    }

    public function getNotifications() {

        return apply_filters('uucss/notifications', []);
    }

    public function get_public_notices(){

        return [];
        /*$api = new UnusedCSS_Api();

        $result = $api->get('notification');

        return !$api->is_error($result) && isset($result->data) ? $result->data : [];*/
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

    public function get_faqs(){

        $rapidload_faqs_read = self::get_site_option('rapidload_faqs_read');

        if(!empty($rapidload_faqs_read)){
            return [];
        }

        $api = new UnusedCSS_Api();

        $result = $api->get('faqs');

        $default = [
            [
                "title" => "I enabled RapidLoad and now my site is broken. What do I do?",
                "message" => "If you are encountering layout or styling issues on a RapidLoad optimized page, try enabling the “Load Original CSS Files” option or <a href='https://rapidload.zendesk.com/hc/en-us/articles/360063292673-Sitewide-Safelists-Blocklists'>adding safelist rules</a> for affected elements in the plugin Advanced Settings. Always remember to requeue affected pages after making plugin changes. Need more help? Head over to the RapidLoad docs for more information or to submit a Support request: <a href='https://rapidload.zendesk.com/hc/en-us'>https://rapidload.zendesk.com/hc/en-us</a>",
            ],
            [
                "title" => "Why am I still seeing the “Removed unused CSS” flag in Google Page Speed Insights?",
                "message" => "It’s possible that the RapidLoad optimized version of the page is not yet being served. Try clearing your page cache and running the GPSI test again.",
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

    function clear_uucss_logs(){
        $file_system = new UnusedCSS_FileSystem();

        if(!$file_system->exists(WP_CONTENT_DIR . '/uploads/rapidload/')){
            wp_send_json_success(true);
        }

        $file_system->delete_folder(WP_CONTENT_DIR . '/uploads/rapidload/');
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

    function frontend_logs(){

        $args = [];

        $args['type'] = isset($_REQUEST['type']) && !empty($_REQUEST['type']) ? $_REQUEST['type'] : 'frontend';
        $args['log'] = isset($_REQUEST['log']) && !empty($_REQUEST['log']) ? $_REQUEST['log'] : '';
        $args['url'] = isset($_REQUEST['url']) && !empty($_REQUEST['url']) ? $_REQUEST['url'] : '';

        self::log($args);

        wp_send_json_success(true);
    }

    function mark_faqs_read(){

        self::update_site_option('rapidload_faqs_read', true);
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

    public static function is_api_key_verified() {

        $api_key_status = isset( static::fetch_options()['uucss_api_key_verified'] ) ? static::fetch_options()['uucss_api_key_verified'] : '';

        return $api_key_status == '1';

    }

    public function add_plugin_action_link( $links ) {

        $_links = array(
            '<a href="' . admin_url( 'options-general.php?page=uucss' ) . '">Settings</a>',
        );

        return array_merge( $_links, $links );
    }

    public function add_meta_boxes()
    {
        add_meta_box(
            'uucss-options',
            __( 'RapidLoad Options', 'uucss' ),
            [$this, 'meta_box'],
            get_post_types(),
            'side'
        );
    }

    function meta_box( $post ) {

        $options = $this->get_page_options($post->ID);

        include('parts/admin-post.html.php');
    }

    public static function get_page_options($post_id)
    {
        $options = [];

        if($post_id){

            foreach (self::$page_options as $option) {
                $options[$option] = get_post_meta( $post_id, '_uucss_' . $option, true );
            }

        }

        return $options;
    }

    public function save_meta_box_options($post_id, $post)
    {
        if ( !isset( $_POST['uucss_nonce'] ) || !wp_verify_nonce( $_POST['uucss_nonce'], 'uucss_option_save' ) ) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        $this->update_meta($post_id);

    }


	public function cache_trigger_hooks() {
		add_action( 'save_post', [ $this, 'cache_on_actions' ], 110, 3 );
		add_action( 'untrash_post', [ $this, 'cache_on_actions' ], 10, 1 );
		add_action( 'wp_trash_post', [ $this, 'clear_on_actions' ], 10, 1 );
		add_action( "wp_ajax_uucss_purge_url", [ $this, 'ajax_purge_url' ] );

	}

	public static function suggest_whitelist_packs() {

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins        = get_plugins();
		$active_plugins = array_map( function ( $key, $item ) {

			$item['slug'] = $key;

			return $item;
		}, array_keys( $plugins ), $plugins );

		$api = new UnusedCSS_Api();

		$data = $api->post( 'whitelist-packs/wp-suggest', [
			'plugins' => $active_plugins,
			'theme'   => get_template(),
			'url'     => site_url()
		] );

		if ( wp_doing_ajax() ) {
			wp_send_json_success( $data->data );
		}

		return $data;
	}


	public function uucss_license() {


		$api = new UnusedCSS_Api();

		$data = $api->get( 'license', [
			'url' => trailingslashit(get_site_url())
		] );

		if ( ! is_wp_error( $data ) ) {

			if ( isset( $data->errors ) ) {
				wp_send_json_error( $data->errors[0]->detail );
			}

			if ( gettype( $data ) === 'string' ) {
				wp_send_json_error( $data );
			}

			do_action( 'uucss/license-verified' );

			wp_send_json_success( $data->data );
		}

		wp_send_json_error( 'unknown error occurred' );
	}


	public function verify_api_key() {

		if ( ! isset( $_POST['api_key'] ) ) {
			wp_send_json_error();

			return;
		}

		$uucss_api         = new UnusedCSS_Api();
		$uucss_api->apiKey = sanitize_text_field( $_POST['api_key'] );

		$results = $uucss_api->get( 'verify' );

		if ( isset( $results->data ) ) {
			wp_send_json_success( true );
		}

		wp_send_json_error();

	}

    public function ajax_purge_url() {

	    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'uucss_nonce' ) ) {
		    wp_send_json_error( 'authentication failed' );

		    return;
	    }

	    $args = [];

	    if ( ! isset( $_POST['url'] ) ) {
		    wp_send_json_error();

		    return;
	    }

	    if ( isset( $_POST['args'] ) ) {
		    $args['post_id'] = ( isset( $_POST['args']['post_id'] ) ) ? intval( $_POST['args']['post_id'] ) : null;
	    }

	    $url = esc_url_raw( $_POST['url'] );

	    if ( isset( $_POST['clear'] ) && boolval($_POST['clear'] == 'true') ) {
	        $list = isset($_POST['url_list']) ? $_POST['url_list'] : null;

	        if(isset($list) && is_array($list) && !empty($list)){
	            foreach ($list as $item){
                    $this->uucss->clear_cache( $item, $args );
                }
            }else{
                $this->uucss->clear_cache( $url, $args );
            }

		    wp_send_json_success( true );
		    return;
	    }

	    if ( isset( $args["post_id"] ) ) {
		    $args['options'] = $this->uucss->api_options( $args["post_id"] );
	    }

	    $args['immediate'] = true;

	    wp_send_json_success( $this->uucss->cache( $url, $args ) );
    }

    /**
     * @param $post_id
     * @param $post WP_Post
     * @param $update
     */
    public function cache_on_actions($post_id, $post = null, $update = null)
    {
        $post = get_post($post_id);
        if($post->post_status == "publish") {
	        $this->clear_on_actions( $post->ID );
	        $this->uucss->cache( get_permalink( $post ) );
        }
    }

    public function clear_on_actions($post_ID)
    {
        $link = get_permalink($post_ID);
        $this->uucss->clear_cache($link);
    }

    public function update_meta($post_id)
    {
        foreach (self::$page_options as $option) {

	        if ( ! isset( $_POST[ 'uucss_' . $option ] ) ) {
		        delete_post_meta( $post_id, '_uucss_' . $option );
		        continue;
	        }

	        $value = sanitize_text_field( $_POST[ 'uucss_' . $option ] );

	        update_post_meta( $post_id, '_uucss_' . $option, $value );
        }
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
}

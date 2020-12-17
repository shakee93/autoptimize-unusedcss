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
	    'exclude'
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

    }



    public function add_meta_boxes()
    {
        add_meta_box(
            'uucss-options',
            __( 'Unused CSS Options', 'uucss' ),
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
        foreach (self::$page_options as $option) {
            $options[$option] = get_post_meta( $post_id, '_uucss_' . $option, true );
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
			'url' => get_site_url()
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

	    if ( isset( $_POST['clear'] ) ) {
		    wp_send_json_success( $this->uucss->clear_cache( $url, $args ) );

		    return;
	    }

	    if ( isset( $args["post_id"] ) ) {
		    $args['options'] = $this->uucss->api_options( $args["post_id"] );
	    }

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

}

<?php

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS_Admin {

    use UnusedCSS_Utils;

    /**
     * @var UnusedCSS_Autoptimize
     */
    public $uucss;

    public static $enabled = true;

    /**
     * UnusedCSS constructor.
     * @param UnusedCSS $uucss
     */
    public function __construct($uucss)
    {

        $this->uucss = $uucss;


        add_action('admin_init', function () {

            if (!self::$enabled) {
                return;
            }


            $this->cache_trigger_hooks();
            add_action( 'add_meta_boxes', [$this, 'add_meta_boxes'] );
            add_action( 'save_post', [$this, 'save_meta_box_options'] , 10, 2);
        });

    }

    public function add_meta_boxes()
    {
        add_meta_box(
            'uucsss-options',
            __( 'Unused CSS Options', 'uucss' ),
            [$this, 'meta_box'],
            ['post', 'page'],
            'side'
        );
    }

    function meta_box( $post ) {

        $whitelist = get_post_meta( $post->ID, '_uucss_whitelist_classes', true );
        $exclude = get_post_meta( $post->ID, '_uucss_exclude', true );

        include('parts/admin-post.html.php');
    }

    public function save_meta_box_options($post_id, $post)
    {

        $options = [
            'whitelist_classes',
            'exclude'
        ];

        if ( !isset( $_POST['uucss_nonce'] ) || !wp_verify_nonce( $_POST['uucss_nonce'], 'uucss_option_save' ) ) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        foreach ($options as $option) {

            if (!isset($_POST['uucss_' . $option] )) {
                delete_post_meta($post_id, '_uucss_' . $option);
                continue;
            }

            $value = sanitize_text_field($_POST['uucss_' . $option]);
            update_post_meta($post_id, '_uucss_' . $option, $value);
        }

    }


    public function cache_trigger_hooks()
    {
        add_action( 'save_post', [$this, 'cache_on_actions'], 10, 3 );
        add_action( 'untrash_post', [$this, 'cache_on_actions'], 10, 1 );
        add_action( 'wp_trash_post', [$this, 'clear_on_actions'], 10, 1 );
        add_action( "wp_ajax_uucss_purge_url", [$this, 'ajax_purge_url']);
    }

    public function ajax_purge_url()
    {
        $args = [];

        if (!isset($_POST['url'])){
            wp_send_json_error();
            return;
        }

        if (isset($_POST['args'])){
            $args = $_POST['args'];
        }

        if (isset($_POST['clear'])) {
            wp_send_json_success($this->uucss->clear_cache($_POST['url'], $args));
            return;
        }


        $this->uucss->cache($_POST['url'], $args);

        wp_send_json_success();
    }

    /**
     * @param $post_ID
     * @param $post WP_Post
     * @param $update
     */
    public function cache_on_actions($post_ID, $post = null, $update = null)
    {
        $post = get_post($post_ID);
        if($post->post_status == "publish") {
            $this->uucss->cache(get_permalink($post));
        }
    }

    public function clear_on_actions($post_ID)
    {
        $link = get_permalink($post_ID);
        $this->uucss->clear_cache($link);
    }

}

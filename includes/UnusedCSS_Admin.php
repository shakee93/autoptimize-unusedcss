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

    /**
     * UnusedCSS constructor.
     * @param UnusedCSS $uucss
     */
    public function __construct($uucss)
    {

        $this->uucss = $uucss;


        add_action('admin_init', function () {

            if (!self::enabled()) {
                return;
            }

            $this->cache_trigger_hooks();
            add_action( 'admin_print_footer_scripts', [$this, 'show_purge_button']);

        });

    }


    public static function enabled(){
        return true;
    }


    public function cache_trigger_hooks()
    {
        add_action( 'save_post', [$this, 'cache_on_actions'], 10, 3 );
        add_action( 'untrash_post', [$this, 'cache_on_actions'], 10, 1 );
        add_action( 'wp_trash_post', [$this, 'clear_on_actions'], 10, 1 );
        add_action( "wp_ajax_uucss_purge_url", [$this, 'ajax_purge_url']);
    }


    public function show_purge_button()
    {
        global $hook_suffix, $post;

        if ('post.php' !== $hook_suffix) {
            return;
        }

        ?><script type="text/javascript"><?php include('Autoptimize/parts/admin-post.js.php') ?></script><?php
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

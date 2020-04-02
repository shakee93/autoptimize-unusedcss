<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin {

    use UnusedCSS_Utils;

    /**
     * @var UnusedCSS_Autoptimize
     */
    public $ao_uucss;

    /**
     * UnusedCSS constructor.
     * @param $ao_uucss
     */
    public function __construct($ao_uucss)
    {

        $this->ao_uucss = $ao_uucss;

        add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
        add_filter( 'autoptimize_filter_settingsscreen_tabs', [$this, 'add_ao_tab'], 20, 1 );

        add_action('admin_init', function () {

            if (!self::enabled()) {
                return;
            }

            $this->cache_trigger_hooks();

            add_action( 'admin_bar_menu', function () {

                global $wp_admin_bar;

                $wp_admin_bar->add_node( array(
                    'id'     => 'autoptimize-uucss',
                    'title'  => $this->get_node_text(),
                    'parent' => 'autoptimize',
                    'href' =>   admin_url('options-general.php?page=uucss'),
                    'tag' => 'div'
                ));

            }, 1 );
        });



    }

    public function get_node_text()
    {
        ob_start();

        include('parts/admin-node.html.php');

        $output = ob_get_contents();
        ob_end_clean();

        return $output;
    }

    public static function fetch_options()
    {
        return autoptimizeOptionWrapper::get_option( 'autoptimize_uucss_settings' );
    }

    public static function enabled(){

        if(!function_exists('autoptimize') || autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "") {
            self::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled");
            return false;
        }


        if (empty(static::fetch_options()['autoptimize_uucss_enabled'])) {
            return false;
        }

        return true;
    }

    public function add_ao_tab($in){

        $in = array_merge( $in, array(
            'uucss' => __( '🔥 UnusedCSS', 'autoptimize' ),
        ) );

        return $in;
    }


    public function add_ao_page(){

        add_submenu_page( null, 'UnusedCSS', 'UnusedCSS', 'manage_options', 'uucss', function () {

            ?>
            <div class="wrap">
                <h1><?php _e( 'Autoptimize Settings', 'autoptimize' ); ?></h1>
                <?php echo autoptimizeConfig::ao_admin_tabs(); ?>
                <div>
                    <?php $this->render_form() ?>
                </div>
            </div>

            <?php
        } );

        register_setting( 'autoptimize_uucss_settings', 'autoptimize_uucss_settings' );

    }


    public function render_form()
    {
        $options       = $this->fetch_options();
        include('parts/options-page.html.php');
    }

    public function cache_trigger_hooks()
    {
        add_action( 'save_post', [$this, 'cache_on_actions'], 10, 3 );
        add_action( 'untrash_post', [$this, 'cache_on_actions'], 10, 1 );
        add_action( 'wp_trash_post', [$this, 'clear_on_actions'], 10, 1 );
        add_action( "wp_ajax_uucss_purge_url", [$this, 'ajax_purge_url']);
        add_action( 'admin_print_footer_scripts', [$this, 'show_purge_button']);
    }

    public function show_purge_button()
    {
        global $hook_suffix, $post;

        if ('post.php' !== $hook_suffix) {
            return;
        }

        ?><script type="text/javascript"><?php include('parts/admin-post.js.php') ?></script><?php
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
            wp_send_json_success($this->ao_uucss->clear_cache($_POST['url'], $args));
            return;
        }


        $this->ao_uucss->cache($_POST['url'], $args);

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
           // uucss_log('triggered via save' . get_permalink($post));
            $this->ao_uucss->cache(get_permalink($post));
        }
    }

    public function clear_on_actions($post_ID)
    {
        $link = get_permalink($post_ID);
        $this->ao_uucss->clear_cache($link);
    }

}

<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin_Frontend
{

    use RapidLoad_Utils;

    public $options;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('admin_menu', [$this, 'menu_item']);

        if($this->is_rapidload_legacy_page()){

            $this->load_legacy_scripts();

        }

        if ($this->is_rapidload_page()) {

            $this->load_scripts();

            // TODO: temporary should be removed so it supports all the browsers
            add_filter('script_loader_tag', function ($tag, $handle) {

                if ( 'rapidload_admin_frontend' !== $handle )
                    return $tag;

                return str_replace( ' src', ' type="module" src', $tag );

            }, 10, 2);

        }

        if(is_admin()){
            add_action( 'admin_menu', array( $this, 'add_developer_settings_page' ) );
        }

    }

    public function add_developer_settings_page() {

        add_submenu_page( 'options-general.php', 'RapidLoad', 'RapidLoad', 'manage_options', 'uucss', function () {
            wp_enqueue_script( 'post' );

            ?>
            <div class="wrap">
                <h1><?php _e( 'RapidLoad Settings', 'autoptimize' ); ?></h1>
                <?php
                do_action('uucss/options/before_render_form');
                ?>
                <div>
                    <?php $this->render_developer_settings_page() ?>
                </div>
            </div>

            <?php
        });

        register_setting('autoptimize_uucss_settings', 'autoptimize_uucss_settings');

    }

    public function render_developer_settings_page(){
        $options = RapidLoad_Base::fetch_options();

        include('views/developer-settings-page.html.php');
    }

    public function is_rapidload_page()
    {
        return isset($_GET['page']) && $_GET['page'] === 'rapidload';
    }

    public function is_rapidload_legacy_page()
    {
        return isset($_GET['page']) && $_GET['page'] === 'uucss';
    }

    public function load_scripts()
    {

        wp_enqueue_style( 'rapidload_admin_frontend', UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist/assets/index.css');

        wp_register_script( 'rapidload_admin_frontend', UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist/assets/index.js');

        $data = array(
            'frontend_base' => UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist'
        );

        wp_localize_script( 'rapidload_admin_frontend', 'rapidload_admin', $data );

        wp_enqueue_script( 'rapidload_admin_frontend' );



    }

    public function load_legacy_scripts(){

        $deregister_scripts = apply_filters('uucss/scripts/deregister', ['select2']);

        if(isset($deregister_scripts) && is_array($deregister_scripts)){
            foreach ($deregister_scripts as $deregister_script){
                wp_dequeue_script($deregister_script);
                wp_deregister_script($deregister_script);
            }
        }

        wp_enqueue_script( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.js', array( 'jquery' ) );

        wp_enqueue_script( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.js', array(
            'jquery',
            'uucss_admin'
        ) );
        wp_enqueue_style( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.css' );

        wp_register_script( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/js/uucss_admin.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

        wp_register_script( 'uucss_log', UUCSS_PLUGIN_URL . 'assets/js/uucss_log.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

        $deregister_styles = apply_filters('uucss/styles/deregister',[]);

        if(isset($deregister_styles) && is_array($deregister_styles)){
            foreach ($deregister_styles as $deregister_style){
                wp_dequeue_style($deregister_style);
            }
        }

        wp_enqueue_style( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_admin.css', [], UUCSS_VERSION );

        global $rapidload;

        $data = array(
            'api' => RapidLoad_Api::get_key(),
            'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'url' => site_url(),
            'ajax_url'          => admin_url( 'admin-ajax.php' ),
            'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
            'on_board_complete' => apply_filters('uucss/on-board/complete', false),
            'api_key_verified' => RapidLoad_Base::is_api_key_verified(),
            'notifications' => $this->getNotifications(),
            'faqs' => [],
            'public_notices' => [],
            'dev_mode' => apply_filters('uucss/dev_mode', isset($this->options['uucss_dev_mode'])) && $this->options['uucss_dev_mode'] == "1",
            'rules_enabled' => $rapidload->rules_enabled(),
            'cpcss_enabled' => $rapidload->critical_css_enabled(),
            'home_url' => home_url(),
            'uucss_enable_debug' => ! empty( $this->options['uucss_enable_debug'] ) && '1' === $this->options['uucss_enable_debug'],
        );

        wp_localize_script( 'uucss_admin', 'uucss', $data );

        wp_enqueue_script( 'uucss_admin' );
        wp_enqueue_script( 'uucss_log' );

        wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.css' );

    }

    public function getNotifications() {

        return apply_filters('uucss/notifications', []);
    }

    public function menu_item()
    {

        add_menu_page(
            'RapidLoad',
            'RapidLoad',
            'edit_posts',
            'rapidload',
            [$this, 'page'],
            UUCSS_PLUGIN_URL. 'assets/images/logo-icon-light.svg'
        );

    }


    public function page()
    {

        ?><div id="rapidload-app"> RapidLoad loading... </div><?php

    }
}
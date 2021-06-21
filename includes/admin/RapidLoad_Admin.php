<?php


class RapidLoad_Admin
{
    use RapidLoad_Utils;

    public static $base;
    public static $base_dir;

    public function __construct()
    {
        $this->hooks();

        new RapidLoad_Feedback();

        add_filter('plugin_row_meta',[$this, 'add_plugin_row_meta_links'],10,4);

        $this->add_update_message();

        RapidLoad_DB::check_db_updates();

        $this->init_cache_dir();

        new RapidLoad_Queue();

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

    function add_plugin_row_meta_links($plugin_meta, $plugin_file, $plugin_data, $status)
    {
        if(isset($plugin_data['TextDomain']) && $plugin_data['TextDomain'] == 'autoptimize-unusedcss'){
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us" target="_blank">Documentation</a>';
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Submit Ticket</a>';
        }
        return $plugin_meta;
    }

    function hooks(){

        if(is_admin()){
            add_action( 'admin_menu', [ $this, 'add_menu' ] );
            add_action('admin_bar_menu', [$this, 'add_rapidload_admin_bar_menu'], 100);
            add_action('admin_enqueue_scripts', [$this, 'enqueue_global_scripts']);
            add_action( 'current_screen', function (){
                if(get_current_screen() && ( get_current_screen()->base == 'settings_page_rapidload' || get_current_screen()->base == 'settings_page_uucss')){
                    add_action( 'admin_enqueue_scripts', [$this, 'enqueue_scripts']);
                }
            });
            add_action( "wp_ajax_uucss_license", [ $this, 'uucss_license' ] );
        }

    }

    function enqueue_global_scripts(){

        $deregister_scripts = apply_filters('uucss/scripts/global/deregister', ['popper']);

        if(isset($deregister_scripts) && is_array($deregister_scripts)){
            foreach ($deregister_scripts as $deregister_script){
                wp_dequeue_script($deregister_script);
                wp_deregister_script($deregister_script);
            }
        }

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
            'api_url' => RapidLoad_Api::get_key(),
            'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'api_key_verified' => UnusedCSS_Admin::is_api_key_verified(),
        );
        wp_localize_script( 'uucss_global_admin_script', 'uucss', $data );
        wp_enqueue_script( 'uucss_global_admin_script' );
        wp_enqueue_style( 'uucss_global_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_global.css', [], UUCSS_VERSION );

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

    function add_rapidload_admin_bar_menu($wp_admin_bar){

        if(apply_filters('uucss/tool-bar-menu',true)){

            $wp_admin_bar->add_node( array(
                'id'    => 'rapidload',
                'title' => '<span class="ab-icon"></span><span class="ab-label">' . __( 'RapidLoad', 'rapidload' ) . '</span>',
                'href'  => admin_url( 'options-general.php?page=rapidload' ),
                'meta'  => array( 'class' => 'bullet-green'),
            ));

        }
    }

    function uucss_license() {

        $data = rapidload()->api()->get( 'license', [
            'url' => $this->transform_url(get_site_url())
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

    function enqueue_scripts(){

        $deregister_scripts = apply_filters('uucss/scripts/deregister', ['select2']);

        if(isset($deregister_scripts) && is_array($deregister_scripts)){
            foreach ($deregister_scripts as $deregister_script){
                wp_dequeue_script($deregister_script);
                wp_deregister_script($deregister_script);
            }
        }

        wp_enqueue_script( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.js', array( 'jquery' ) );

        wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.css' );

        wp_enqueue_style( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.css' );

        wp_enqueue_script( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.js', array(
            'jquery',
        ) );

        wp_enqueue_style( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/css/dashboard.css' , [], UUCSS_VERSION);

        wp_enqueue_script( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/js/dashboard.js', ['jquery'], UUCSS_VERSION );

        wp_enqueue_style( 'uucss_log', UUCSS_PLUGIN_URL . 'assets/css/uucss_log.css' , [], UUCSS_VERSION);

        wp_enqueue_script( 'uucss_log', UUCSS_PLUGIN_URL . 'assets/js/uucss_log.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

    }

    function add_menu(){

        $this->add_submenu_page(
            'options-general.php',
            'RapidLoad',
            'RapidLoad',
            'manage_options',
            'rapidload',
            [$this, 'render_dashboard'],
            1
        );

    }

    public function add_submenu_page($paren_slug, $title, $menu_title, $capability, $menu_slug, $callback, $position = 1){
        add_submenu_page(
            $paren_slug,
            $title,
            $menu_title,
            $capability,
            $menu_slug,
            $callback,
            $position
        );
    }

    function render_dashboard(){
        $options = RapidLoad_Base::fetch_options();
        $rapidload_modules = rapidload()->rapidload_module()->modules;
        include ('views/dashboard.html.php');
    }

    public function init_cache_dir(){

        $cache_base_option = RapidLoad_Base::get_option('rapidload_cache_base', null);

        if(!isset($cache_base_option)){
            $cache_base_option = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR);
            RapidLoad_Base::update_option('rapidload_cache_base', $cache_base_option);
        }

        self::$base = $cache_base_option;

        self::$base_dir = WP_CONTENT_DIR . UUCSS_CACHE_CHILD_DIR;

        return $this->initFileSystem();
    }

    public function initFileSystem($base = '') {

        if ( ! $this->init_base_dir($base) ) {
            return false;
        }

        $this->init_log_dir();

        return true;
    }

    public function init_base_dir($base) {
        self::uucss_log(self::$base_dir . $base);
        if ( rapidload()->file_system()->exists( self::$base_dir . $base ) ) {
            return true;
        }

        // make dir if not exists
        $created = rapidload()->file_system()->mkdir( self::$base_dir . $base );

        if (!$created || ! rapidload()->file_system()->is_writable( self::$base_dir . $base ) || ! rapidload()->file_system()->is_readable( self::$base_dir . $base ) ) {
            return false;
        }

        return true;
    }

    public function init_log_dir(){

        if ( rapidload()->file_system()->exists( UUCSS_LOG_DIR ) ) {
            return true;
        }

        $created = rapidload()->file_system()->mkdir( UUCSS_LOG_DIR , 0755, !rapidload()->file_system()->exists( wp_get_upload_dir()['basedir'] . '/rapidload/' ));

        if (!$created || ! rapidload()->file_system()->is_writable( UUCSS_LOG_DIR ) || ! rapidload()->file_system()->is_readable( UUCSS_LOG_DIR ) ) {
            return false;
        }

        return true;
    }
}
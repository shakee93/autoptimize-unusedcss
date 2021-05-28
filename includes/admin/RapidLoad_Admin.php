<?php


class RapidLoad_Admin
{
    public function __construct()
    {
        $this->hooks();
    }

    function hooks(){

        add_action( 'admin_menu', [ $this, 'add_menu' ] );
        add_action( 'current_screen', [$this, 'enqueue_scripts']);

    }

    function enqueue_scripts(){
        error_log(get_current_screen()->base);
        if ( get_current_screen() && get_current_screen()->base == 'rapidload_page_rapidload' ) {
            add_action( 'admin_enqueue_scripts', function(){
                wp_enqueue_style( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/css/dashboard.css' , [], UUCSS_VERSION);
                wp_enqueue_script( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/js/dashboard.js', ['jquery'], UUCSS_VERSION );
            });
        }
    }

    function add_menu(){

        add_menu_page(
            esc_html__( 'Dashboard', 'rapidload' ),
            esc_html__( 'RapidLoad', 'rapidload' ),
            'manage_options',
            'rapidload-main',
            [ $this, 'render_dashboard' ],
            'dashicons-performance',
            50
        );

        $this->add_submenu_page(
            'rapidload-main',
            'Dashboard',
            'Dashboard',
            'manage_options',
            'rapidload',
            [$this, 'render_dashboard'],
            1
        );

        remove_submenu_page('rapidload-main','rapidload-main');
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
        $rapidload_modules = get_option( 'rapidload_modules', [] );
        include ('views/dashboard.html.php');
    }
}
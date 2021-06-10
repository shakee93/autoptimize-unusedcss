<?php


class RapidLoad_Admin
{
    use RapidLoad_Utils;

    public function __construct()
    {
        $this->hooks();
    }

    function hooks(){

        if(is_admin()){
            add_action( 'admin_menu', [ $this, 'add_menu' ] );
            add_action( 'current_screen', [$this, 'enqueue_scripts']);
            add_action( "wp_ajax_uucss_license", [ $this, 'uucss_license' ] );
        }

    }

    function uucss_license() {

        $api = new RapidLoad_Api();

        $data = $api->get( 'license', [
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

        if ( get_current_screen() && get_current_screen()->base == 'settings_page_rapidload' ) {
            add_action( 'admin_enqueue_scripts', function(){
                wp_enqueue_style( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/css/dashboard.css' , [], UUCSS_VERSION);
                wp_enqueue_script( 'rapidload-dashboard', UUCSS_PLUGIN_URL . 'includes/admin/assets/js/dashboard.js', ['jquery'], UUCSS_VERSION );
            });
        }

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
}
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
            add_action( 'current_screen', function (){
                if(get_current_screen() && ( get_current_screen()->base == 'settings_page_rapidload' || get_current_screen()->base == 'settings_page_uucss')){
                    add_action( 'admin_enqueue_scripts', [$this, 'enqueue_scripts']);
                }
            });
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
}
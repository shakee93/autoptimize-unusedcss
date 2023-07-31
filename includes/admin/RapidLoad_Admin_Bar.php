<?php

class RapidLoad_Admin_Bar {
    use RapidLoad_Utils;

    public function __construct()
    {

        add_action( 'admin_bar_init', [$this,'rapidload_admin_bar_css'] );
        add_action('admin_bar_menu', [$this, 'add_rapidload_admin_bar_menu'], 100);

//        wp_register_script( 'rapidload-page-optimizer-data', UUCSS_PLUGIN_URL .  'includes/admin/assets/js/page-optimizer/dist/page-optimizer-data.min.js', null, 111);
//
//        // Localize the script with new data
//        $script_data_array = array(
//            'ajax_url' => admin_url( 'admin-ajax.php' ),
//            'plugin_url' => UUCSS_PLUGIN_URL
//        );
//        wp_localize_script( 'rapidload-page-optimizer-data', 'rapidload', $script_data_array );
//
//        // Enqueued script with localized data.
//        wp_enqueue_script( 'rapidload-page-optimizer-data' );
//
//        wp_enqueue_script( 'rapidload-speed-popover-js', UUCSS_PLUGIN_URL .  'includes/admin/assets/js/speed-popover/build/static/js/main.js', null, 'xx.xx', true);
//        wp_enqueue_style( 'rapidload-speed-popover-css', UUCSS_PLUGIN_URL .  'includes/admin/assets/js/speed-popover/build/static/css/main.css', null, 'xx.xx');

        $this->load_optimizer_scripts();

        add_action('wp_after_admin_bar_render', function () {
            echo '<div id="rapidload-page-optimizer"></div>';
        });
    }

    public function load_optimizer_scripts()
    {

        wp_enqueue_style( 'rapidload_page_optimizer', UUCSS_PLUGIN_URL .  'includes/admin/page-optimizer/dist/assets/index.css',[],'1.71');

        wp_register_script( 'rapidload_page_optimizer', UUCSS_PLUGIN_URL .  'includes/admin/page-optimizer/dist/assets/index.js',[], '1.71');

        $data = array(
            'page_optimizer_base' => UUCSS_PLUGIN_URL .  'includes/admin/page-optimizer/dist',
            'plugin_url' => UUCSS_PLUGIN_URL,
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'optimizer_url' => $this->get_current_url()
        );

        wp_localize_script( 'rapidload_page_optimizer', 'rapidload', $data );

        wp_enqueue_script( 'rapidload_page_optimizer' );



    }
    public function rapidload_admin_bar_css()
    {

        if ( is_admin_bar_showing() ) { ?>


            <style id="rapidload-admin-bar-css">

                #wp-admin-bar-rapidload .rl-node-wrapper {
                    display: flex;
                    gap: 6px;
                }

                #wp-admin-bar-rapidload .rl-icon {
                    display: inline-flex;
                }

                #wp-admin-bar-rapidload .rl-icon img {
                    margin: 0 !important;
                }

                body.rapidload-optimizer-open {
                    overflow: hidden;
                }

            </style>

        <?php }
    }

    public function add_rapidload_admin_bar_menu($wp_admin_bar){

        if(apply_filters('rapidload/tool-bar-menu',true)){

            $current_user = wp_get_current_user();

            if(!$current_user){
                return;
            }

            $user_role = $current_user->roles[0];

            if ( $user_role !== 'customer' && $user_role !== 'subscriber' ) {

                $wp_admin_bar->add_node( array(
                    'id'    => 'rapidload',
                    'title' => '<div id="rl-node-wrapper" class="rl-node-wrapper"><span class="rl-icon"><img src="'. UUCSS_PLUGIN_URL .'/assets/images/logo-icon-light.svg" alt=""></span><span class="rl-label">'.__( 'RapidLoad', 'rapidload' ) . '</span></div>',
                    'href'  => admin_url( 'admin.php?page=rapidload' ),
                    'meta'  => array( 'class' => '' ),
                ));

//                $wp_admin_bar->add_node( array(
//                    'id'    => 'rapidload-clear-cache',
//                    'title' => '<span class="ab-label">' . __( 'Clear CSS/JS Optimizations', 'clear_optimization' ) . '</span>',
//                    //'href'  => admin_url( 'admin.php?page=rapidload&action=rapidload_purge_all' ),
//                    'href'   => wp_nonce_url( add_query_arg( array(
//                        '_action' => 'rapidload_purge_all',
//                    ) ), 'uucss_nonce', 'nonce' ),
//                    'meta'  => array( 'class' => 'rapidload-clear-all', 'title' => 'RapidLoad will clear all the cached files' ),
//                    'parent' => 'rapidload'
//                ));

            }

        }


    }
}
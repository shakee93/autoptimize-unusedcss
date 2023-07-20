<?php

class RapidLoad_Admin_Bar {

    public function __construct()
    {

        if (!is_admin()) {
            return;
        }

        // add styles to admin bar menu
        add_action( 'admin_head', [$this,'rapidload_admin_bar_css'] );
        add_action( 'wp_head', [$this,'rapidload_admin_bar_css'] );


        wp_register_script( 'rapidload-page-optimizer-data', UUCSS_PLUGIN_URL .  'includes/admin/assets/js/page-optimizer/dist/page-optimizer-data.min.js', null, 'xx.xx');

        // Localize the script with new data
        $script_data_array = array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
        );
        wp_localize_script( 'rapidload-page-optimizer-data', 'rapidload', $script_data_array );

        // Enqueued script with localized data.
        wp_enqueue_script( 'rapidload-page-optimizer-data' );
    }

    public function register_admin_bar_item()
    {

    }

}
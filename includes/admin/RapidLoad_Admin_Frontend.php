<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin_Frontend
{


    public function __construct()
    {

        add_action('admin_menu', [$this, 'menu_item']);


        if ($this->is_rapidload_page()) {

            $this->load_scripts();


            // TODO: temporary should be removed so it supports all the browsers
            add_filter('script_loader_tag', function ($tag, $handle) {

                if ( 'rapidload_admin_frontend' !== $handle )
                    return $tag;

                return str_replace( ' src', ' type="module" src', $tag );

            }, 10, 2);

        }



    }

    public function is_rapidload_page()
    {
        return isset($_GET['page']) && $_GET['page'] === 'rapidload';
    }


    public function load_scripts()
    {

        wp_register_script( 'rapidload_admin_frontend', UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist/assets/index.js');

        $data = array(
            'frontend_base' => UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist'
        );

        wp_localize_script( 'rapidload_admin_frontend', 'rapidload_admin', $data );

        wp_enqueue_script( 'rapidload_admin_frontend' );


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
<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin_Frontend
{


    public function __construct()
    {

        add_action('admin_menu', [$this, 'menu_item']);

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

        ?>

        <div id="rapidload-app"> RapidLoad loading... </div>
<?php

    }
}
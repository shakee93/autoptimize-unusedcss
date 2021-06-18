<?php

defined( 'ABSPATH' ) or die();

class Autoptimize_Beta_Compatible extends RapidLoad_ThirdParty {

    private $uucss_ao_base;

    function __construct(){

        $this->plugin = 'autoptimize-beta/autoptimize.php';
        $this->catgeory = 'optimize';
        $this->name = 'autoptimize';

        parent::__construct();
    }

    public function init_hooks(){

        global $uucss;

        if($uucss->provider == 'rapidload'){

            add_action('uucss/options/before_render_form', [$this, 'render_option_page_ao_admin_tabs']);
            add_filter( 'autoptimize_filter_settingsscreen_tabs', [$this, 'handle'], 10, 1 );
            add_filter('uucss/notifications', [$this, 'addNotifications'], 10, 1);
            add_action( 'admin_bar_menu', function () {

                wp_enqueue_script( 'wp-util' );

                global $wp_admin_bar;

                $wp_admin_bar->add_node( array(
                    'id'     => 'autoptimize-uucss',
                    'title'  => $this->get_node_text(),
                    'parent' => 'autoptimize',
                    'tag'    => 'div'
                ) );

            }, 1 );

        }

    }

    public function addNotifications($notifications) {

        if(!class_exists('autoptimizeOptionWrapper')){
            return $notifications;
        }

        if (!(bool) autoptimizeOptionWrapper::get_option( 'autoptimize_cache_nogzip' )) {
            $notifications[] = [
                "title" => "Incompatible Autoptimize option enabled",
                "message" => "It is recommended to enable <strong>'Save aggregated script/css as static files?'</strong> in Autoptimize to RapidLoad to work properly.",
                "type" => "error"
            ];
        }

        if(autoptimizeOptionWrapper::get_option( 'autoptimize_css_inline' ) == 'on'){
            $notifications[] = [
                "title" => "Incompatible Autoptimize option enabled",
                "message" => "It is recommended to disable <strong>'inline all css?'</strong> in Autoptimize to RapidLoad to work properly.",
                "type" => "warning"
            ];
        }

        return $notifications;
    }

    public function get_node_text() {
        ob_start();

        include('parts/admin-node.html.php');

        $output = ob_get_contents();
        ob_end_clean();

        return $output;
    }

    public function handle($args){

        if(function_exists('autoptimize') ){

            $tab = 'RapidLoad';

            $args = array_merge( $args, array(
                'uucss' => __( '<span class="uucss-tab-title"><img src="' . UUCSS_PLUGIN_URL . '/assets/images/logo-icon.svg' . '" width="15" alt="RapidLoad.io logo"><span>' . $tab . '</span></span>', 'autoptimize' ),
            ) );

            return $args;

        }

    }

    public function render_option_page_ao_admin_tabs(){

        if(class_exists('autoptimizeConfig')){

            echo autoptimizeConfig::ao_admin_tabs();

        }

    }

    public function is_mu_plugin()
    {
        return false;
    }
}
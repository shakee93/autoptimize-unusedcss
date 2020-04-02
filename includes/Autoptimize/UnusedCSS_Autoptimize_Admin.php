<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin extends UnusedCSS_Admin {

    use UnusedCSS_Utils;


    /**
     * UnusedCSS constructor.
     * @param $ao_uucss
     */
    public function __construct($ao_uucss)
    {

        add_action( 'admin_menu', array( $this, 'add_ao_page' ) );

        add_action('admin_init', function () {

            if (!self::enabled()) {
                return;
            }

            add_filter( 'autoptimize_filter_settingsscreen_tabs', [$this, 'add_ao_tab'], 20, 1 );

            add_action( 'admin_bar_menu', function () {

                global $wp_admin_bar;

                $wp_admin_bar->add_node( array(
                    'id'     => 'autoptimize-uucss',
                    'title'  => $this->get_node_text(),
                    'parent' => 'autoptimize',
                    'href' =>   admin_url('options-general.php?page=uucss'),
                    'tag' => 'div'
                ));

            }, 1 );

        });

        parent::__construct($ao_uucss);
    }

    public function get_node_text()
    {
        ob_start();

        include('parts/admin-node.html.php');

        $output = ob_get_contents();
        ob_end_clean();

        return $output;
    }

    public static function fetch_options()
    {
        return autoptimizeOptionWrapper::get_option( 'autoptimize_uucss_settings' );
    }

    public static function enabled(){

        if(!function_exists('autoptimize') || autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "") {
            self::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled");
            return false;
        }

        if (empty(static::fetch_options()['autoptimize_uucss_enabled'])) {
            return false;
        }

        return true;
    }

    public function add_ao_tab($in){

        $in = array_merge( $in, array(
            'uucss' => __( '🔥 UnusedCSS', 'autoptimize' ),
        ) );

        return $in;
    }


    public function add_ao_page(){

        add_submenu_page( null, 'UnusedCSS', 'UnusedCSS', 'manage_options', 'uucss', function () {

            ?>
            <div class="wrap">
                <h1><?php _e( 'Autoptimize Settings', 'autoptimize' ); ?></h1>
                <?php echo autoptimizeConfig::ao_admin_tabs(); ?>
                <div>
                    <?php $this->render_form() ?>
                </div>
            </div>

            <?php
        } );

        register_setting( 'autoptimize_uucss_settings', 'autoptimize_uucss_settings' );

    }


    public function render_form()
    {
        $options       = $this->fetch_options();
        include('parts/options-page.html.php');
    }

}

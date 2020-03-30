<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin {

    /**
     * UnusedCSS constructor. 
     */
    public function __construct()
    {


        add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
        add_filter( 'autoptimize_filter_settingsscreen_tabs', [$this, 'add_ao_tab'], 10, 1 );

        add_action( 'admin_bar_menu', function () {

            global $wp_admin_bar;

            $wp_admin_bar->add_node( array(
                'id'     => 'autoptimize-uucss',
                'title'  => __( '🔥 Unused CSS', 'autoptimize' ),
                'parent' => 'autoptimize',
                'href' =>   admin_url('options-general.php?page=uucss')
            ));

        }, 100 );

    }

    public static function fetch_options()
    {
        return autoptimizeOptionWrapper::get_option( 'autoptimize_uucss_settings' );
    }

    public static function enabled(){

        if(!function_exists('autoptimize') || autoptimizeOptionWrapper::get_option( 'autoptimize_css' ) == "") {

            UnusedCSS_Utils::add_admin_notice("Autoptimize UnusedCSS Plugin only works when autoptimize is installed and css optimization is enabled");

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

        ?>
        <style>
            #ao_settings_form {background: white;border: 1px solid #ccc;padding: 1px 15px;margin: 15px 10px 10px 0;}
            #ao_settings_form .form-table th {font-weight: normal;}
            #autoptimize_imgopt_descr{font-size: 120%;}
        </style>
        <script>document.title = "Autoptimize: UnusedCSS " + document.title;</script>
        <form id='ao_settings_form' action='<?php echo admin_url( 'options.php' ); ?>' method='post'>
            <?php settings_fields( 'autoptimize_uucss_settings' ); ?>
            <h2><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></h2>
            <span id='autoptimize_imgopt_descr'><?php _e( 'Boost  your site speed by removing all unwanted CSS files. Get your Google Page Speed Scores Spiked UP !!', 'autoptimize' ); ?></span>
            <table class="form-table">
                <tr>
                    <th scope="row"><?php _e( 'Remove Unused CSS', 'autoptimize' ); ?></th>
                    <td>
                        <label><input id='autoptimize_uucss_enabled' type='checkbox' name='autoptimize_uucss_settings[autoptimize_uucss_enabled]' <?php if ( ! empty( $options['autoptimize_uucss_enabled'] ) && '1' === $options['autoptimize_uucss_enabled'] ) { echo 'checked="checked"'; } ?> value='1'></label>
                    </td>
                </tr>
            </table>
            <p class="submit"><input type="submit" name="submit" id="submit" class="button button-primary" value="<?php _e( 'Save Changes', 'autoptimize' ); ?>" /></p>
        </form>
        
<?php
    }

}

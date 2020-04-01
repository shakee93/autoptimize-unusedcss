<?php

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize_Admin {

    use UnusedCSS_Utils;

    /**
     * @var UnusedCSS_Autoptimize
     */
    public $ao_uucss;

    /**
     * UnusedCSS constructor.
     * @param $ao_uucss
     */
    public function __construct($ao_uucss)
    {

        $this->ao_uucss = $ao_uucss;

        add_action( 'admin_menu', array( $this, 'add_ao_page' ) );
        add_filter( 'autoptimize_filter_settingsscreen_tabs', [$this, 'add_ao_tab'], 10, 1 );

        add_action('admin_init', function () {

            if (!self::enabled()) {
                return;
            }

            $this->cache_trigger_hooks();

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



    }

    public function get_node_text()
    {
        ob_start();

        ?>

        <style>

            li#wp-admin-bar-autoptimize-uucss {
                display: inline-block !important;
                padding: 12px 0 5px !important;
                background: #01579B !important;
            }

            .uucss-stats span {
                line-height: 0 !important;
            }

            li#wp-admin-bar-autoptimize-uucss a{
                height: auto;
            }

            li#wp-admin-bar-autoptimize-uucss a:hover{
                color : whitesmoke !important;
            }

            .uucss-stats {
                line-height: 0 !important;
            }

            span.uucss-stats__size {
                font-size: .7em !important;
            }

        </style>

        <div class="uucss-stats">
            <span>UnusedCSS</span>
            <div class="uucss-stats__actions">
                <span class="uucss-stats__size">
                    Size : <?php echo $this->ao_uucss->size(); ?>
                </span>
            </div>

        </div>
        <?php

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

    public function cache_trigger_hooks()
    {
        add_action( 'save_post', [$this, 'cache_on_actions'], 10, 3 );
        add_action( "wp_ajax_uucss_purge_url", [$this, 'ajax_purge_url']);
        add_action( 'admin_print_footer_scripts', [$this, 'show_purge_button']);
    }

    public function show_purge_button()
    {
        global $hook_suffix, $post;

        if ('post.php' !== $hook_suffix) {
            return;
        }

        ?>
        <script type="text/javascript">

            (function ($) {

                var el = $('<button type="button"></button>')
                    .addClass('button button-small hide-if-no-js').css('margin-left', '5px').text('Purge CSS');

                el.click(function (e) {
                    e.preventDefault();
                    var $this = $(this);

                    $this.text('loading...');
                    wp.ajax.post('uucss_purge_url', {
                        url : '<?php echo get_permalink($post) ?>',
                        args: {
                            post_id: <?php echo $post->ID ?>
                        }
                    }).done(function (d) {
                        $this.text('Job Queued');
                        console.log(d);
                    })
                });

                var el_clear = el.clone().text('Clear Cache').off()
                    .click(function (e) {

                    e.preventDefault();

                        var $this = $(this);

                        $this.text('loading...');
                    wp.ajax.post('uucss_purge_url', {
                        clear: true,
                        url: '<?php echo get_permalink($post) ?>',
                        args: {
                            post_id: <?php echo $post->ID ?>
                        }
                    }).done(function (d) {
                        $this.text('Cleared');
                        console.log(d);
                    })

                });

                var slugButtons = $('#edit-slug-buttons');
                var appendTo = (slugButtons.length) ? slugButtons : $('#sample-permalink');
                appendTo.after(el_clear)
                    .after(el);

            }(jQuery))

        </script>
        <?php
    }

    public function ajax_purge_url()
    {
        $args = [];


        if (!isset($_POST['url'])){
            wp_send_json_error();
            return;
        }

        if (isset($_POST['args'])){
            $args = $_POST['args'];
        }

        if (isset($_POST['clear'])) {
            wp_send_json_success($this->ao_uucss->clear_cache($_POST['url'], $args));
            return;
        }


        $this->ao_uucss->cache($_POST['url'], $args);

        wp_send_json_success();
    }

    /**
     * @param $post_ID
     * @param $post WP_Post
     * @param $update
     */
    public function cache_on_actions($post_ID, $post, $update)
    {
        if($post->post_status == "publish") {
           // uucss_log('triggered via save' . get_permalink($post));
            $this->ao_uucss->cache(get_permalink($post));
        }
    }

}

<?php

class JavaScript
{

    use RapidLoad_Utils;

    public $options = [];

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('uucss/options/js', [$this, 'render_options']);

        if(!isset($this->options['uucss_enable_javascript'])){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'optimize_javascript'], 30, 2);

        add_action( 'admin_bar_menu', [$this, 'add_admin_bar_items' ], 90 );

        $this->enqueue_admin_scripts();

        $this->ajax_calls();
    }

    public function ajax_calls(){

        if(is_admin()){

            add_action('wp_ajax_update_js_settings', [$this, 'update_js_settings']);

        }

    }

    public function update_js_settings(){

        $post_id = isset($_REQUEST['post_id']) ? $_REQUEST['post_id'] : null;
        $settings = isset($_REQUEST['settings']) ? $_REQUEST['settings'] : [];

        if(!isset($post_id) || !isset($settings)){
            wp_send_json_error('requierd field missing');
        }

        update_post_meta($post_id, 'rapidload_js_settings', $settings);

        wp_send_json_success(true);
    }

    public function enqueue_admin_scripts(){
        if(is_user_logged_in()){

            add_action('wp', function (){

                global $post;

                if(isset($post->ID)){

                    wp_enqueue_style( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.css' );
                    wp_enqueue_style('rapidload-optimizer', UUCSS_PLUGIN_URL . 'includes/modules/javascript/assets/css/style.css', UUCSS_VERSION);

                    wp_enqueue_script( 'featherlight', UUCSS_PLUGIN_URL . 'assets/libs/popup/featherlight.js' , array( 'jquery' ) );
                    wp_register_script( 'rapidload-js-optimizer', UUCSS_PLUGIN_URL . 'includes/modules/javascript/assets/js/js-core.js', array(
                        'jquery',
                    ) , UUCSS_VERSION);

                    wp_localize_script( 'rapidload-js-optimizer', 'rapidload_js_optimizer', [
                        'post_id' => $post->ID,
                        'current_url' => $this->transform_url(get_permalink($post->ID)),
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'settings' => get_post_meta($post->ID, 'rapidload_js_settings')
                    ] );

                    wp_enqueue_script('rapidload-js-optimizer');
                }

            });

        }
    }

    public function add_admin_bar_items($wp_admin_bar){

        global $post;

        if(isset($post->ID)){

            $wp_admin_bar->add_menu(
                array(
                    'id'     => 'rapidload_psa',
                    'parent' => 'top-secondary',
                    'title'  => '<span class="ab-item">RapidLoad Optimizer</span>',
                    'meta'   => array( 'title' => 'RapidLoad Optimizer' ),
                )
            );

        }


    }

    public function render_options($args){
        $options = $args;
        include_once 'parts/options.html.php';

    }

    public function optimize_javascript($job, $args){

        new Javascript_Enqueue($job);

    }
}
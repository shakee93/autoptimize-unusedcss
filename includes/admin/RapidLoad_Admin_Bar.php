<?php

class RapidLoad_Admin_Bar {
    use RapidLoad_Utils;

    public function __construct()
    {

        add_action( 'wp_after_admin_bar_render', [$this,'rapidload_admin_bar_css'] );
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

        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';

        if (
            (!is_admin() && is_user_logged_in() && defined('RAPIDLOAD_PAGE_OPTIMIZER_ENABLED')) ||
            (is_admin() && $page === 'rapidload')
        ) {
            $this->load_optimizer_scripts();

            add_action('wp_after_admin_bar_render', function () {
                echo '<div id="rapidload-page-optimizer"></div>';
            });
        }



    }

    public function load_optimizer_scripts()
    {
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';

        $package = 'https://unpkg.com/@rapidload/page-optimizer/dist';

        if (defined('RAPIDLOAD_DEV_MODE')) {
            $package = UUCSS_PLUGIN_URL . 'includes/admin/page-optimizer/dist';
        }

        $debug_titan = apply_filters('rapidload/titan/debug', false);

        if ($debug_titan) {
            $package .= '-debug';
        }

        //wp_enqueue_style( 'rapidload_page_optimizer', $package .  '/assets/index.css',[],UUCSS_VERSION);

        wp_register_script( 'rapidload_page_optimizer', $package .  '/assets/index.js',[], UUCSS_VERSION);

        $current_url = isset($_SERVER['REQUEST_URI']) ? home_url($_SERVER['REQUEST_URI']) : $this->get_current_url();

        if($this->is_admin_url($current_url)){
            $current_url = site_url();
        }

        $data = array(
            'titan_stylesheet_url' => $package .  '/assets/index.css',
            'load_optimizer' => !(is_admin() && $page === 'rapidload'),
            'page_optimizer_package_base' => $package,
            'page_optimizer_base' => UUCSS_PLUGIN_URL .  'includes/admin/page-optimizer/dist',
            'plugin_url' => UUCSS_PLUGIN_URL,
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'admin_url' => admin_url(),
            'dashboard_url' => admin_url( 'admin.php?page=rapidload' ),
            'optimizer_url' => defined('RAPIDLOAD_OPTIMIZER_TEST_URL') ? RAPIDLOAD_OPTIMIZER_TEST_URL : $this->transform_url($current_url),
            'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'timezone' => get_option('timezone_string', 'UTC'),
            'rapidload_version' => UUCSS_VERSION,
            'actions' => [
                [
                    'tooltip' => 'Clear Site Cache',
                    'href' => wp_nonce_url( add_query_arg( array(
                        '_cache'  => 'rapidload-cache',
                        '_action' => 'clear',
                    ) ), 'rapidload_cache_clear_cache_nonce' ),
                    'icon' => 'clear_cache'
                ],
                [
                    'tooltip' => 'Clear Page Cache',
                    'href' => wp_nonce_url( add_query_arg( array(
                        '_cache'  => 'rapidload-cache',
                        '_action' => 'clearurl',
                        '_url' => $this->transform_url($this->get_current_url()),
                    ) ), 'rapidload_cache_clear_cache_nonce' ),
                    'icon' => 'clear_page_cache'
                ],
                [
                    'tooltip' => 'Clear CSS/JS/Font Optimizations',
                    'href' => wp_nonce_url( add_query_arg( array(
                        '_action' => 'rapidload_purge_all',
                        '_job_type' => 'url'
                    ) ), 'uucss_nonce', '_nonce' ),
                    'icon' => 'clear_optimization'
                ]
            ],
            /*'group_by_conditions' => [
                [
                    'label' => 'Entire Site',
                    'value' => 'all'
                ],
                [
                    'label' => 'Archives',
                    'value' => 'archive',
                    'options' => [
                        [
                            'label' => 'All Archives',
                            'value' => 'all',
                            'group' => null
                        ],
                        [
                            'label' => 'Author Archive',
                            'value' => 'author',
                            'group' => null
                        ],
                        [
                            'label' => 'Date Archive',
                            'value' => 'date',
                            'group' => null
                        ],
                        [
                            'label' => 'Posts Archive',
                            'value' => 'author',
                            'group' => 'Posts Archive'
                        ],
                        [
                            'label' => 'Categories',
                            'value' => 'category',
                            'group' => 'Posts Archive'
                        ],
                        [
                            'label' => 'Tags',
                            'value' => 'tag',
                            'group' => 'Posts Archive'
                        ],
                    ]
                ]
            ],*/
            'api_root' => defined('UUCSS_API_URL') ? UUCSS_API_URL : 'https://api.rapidload.io/api/v1',
            'enable_entire_site' => RapidLoad_DB::get_optimization_count() < 2,
            'rest_url' => RapidLoadRestApi::rest_url(),
        );

        wp_localize_script( 'rapidload_page_optimizer', 'rapidload_optimizer', $data );

        wp_enqueue_script( 'rapidload_page_optimizer' );

        function add_module_script_type($tag, $handle) {

            if ($handle === 'rapidload_page_optimizer') {
                $tag = preg_replace("/type=['\"]text\/javascript['\"]/", "type='module'", $tag);

                if (!preg_match("/type=/", $tag)) {
                    $tag = preg_replace("/<script /", "<script type=\"module\" ", $tag);
                }
            }
            return $tag;
        }
        add_filter('script_loader_tag', 'add_module_script_type', 10, 2);

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

                html.rapidload-optimizer-open,
                .rapidload-optimizer-open body,
                body.rapidload-optimizer-open {
                    overflow: hidden !important;
                }

                .rpo-loaded\:with-popup #wp-admin-bar-rapidload .ab-sub-wrapper {
                    display: none !important;
                }

                #wp-admin-bar-rapidload .ab-item {
                    padding: 0 8px 0 7px;
                }

                /*.rl-page-optimizer-loaded #wp-admin-bar-rapidload *,*/
                /*.rl-page-optimizer-loaded #wpadminbar .ab-top-menu > li.hover > .ab-item, #wpadminbar.nojq .quicklinks .ab-top-menu > li > .ab-item:focus,*/
                /*.rl-page-optimizer-loaded #wpadminbar:not(.mobile) .ab-top-menu > li:hover > .ab-item, #wpadminbar:not(.mobile) .ab-top-menu > li > .ab-item:focus {*/
                /*    color: #0c0c0c !important;*/

                /*}*/

            </style>

        <?php }
    }

    public function add_rapidload_admin_bar_menu($wp_admin_bar){

        if(apply_filters('rapidload/tool-bar-menu',true)){

            if ( current_user_can( 'manage_options' ) ) {

                $wp_admin_bar->add_node( array(
                    'id'    => 'rapidload',
                    'title' => '<div id="rl-node-wrapper" class="rl-node-wrapper"><span class="rl-icon"><img src="'. UUCSS_PLUGIN_URL .'/assets/images/logo-icon-light.svg" alt=""></span><span class="rl-label">'.__( 'RapidLoad', 'rapidload' ) . '</span></div>',
                    'href'  => admin_url( 'admin.php?page=rapidload' ),
                    'meta'  => array( 'class' => '' ),
                ));

                $wp_admin_bar->add_node( array(
                    'id'    => 'rapidload-clear-cache',
                    'title' => '<span class="ab-label">' . __( 'Clear CSS/JS/Font Optimizations', 'clear_optimization' ) . '</span>',
                    //'href'  => admin_url( 'admin.php?page=rapidload&action=rapidload_purge_all' ),
                    'href'   => wp_nonce_url( add_query_arg( array(
                        '_action' => 'rapidload_purge_all',
                        'job_type' => 'url',
                    ) ), 'uucss_nonce', 'nonce' ),
                    'meta'  => array( 'class' => 'rapidload-clear-all', 'title' => 'RapidLoad will clear all the cached files' ),
                    'parent' => 'rapidload'
                ));

            }

        }


    }

    function is_admin_url($url){
        $_url = parse_url(untrailingslashit(admin_url()));
        if(isset($_url['path']) && $this->str_contains($url, $_url['path'])){
            return true;
        }
        return false;
    }
}
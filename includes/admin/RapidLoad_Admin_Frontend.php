<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin_Frontend
{

    use RapidLoad_Utils;

    public $options;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        add_action('admin_menu', [$this, 'menu_item']);

        if($this->is_rapidload_legacy_page()){

            $this->load_legacy_scripts();
            $this->load_legacy_ajax();

        }

        if ($this->is_rapidload_page()) {

            $this->load_scripts();

            // TODO: temporary should be removed so it supports all the browsers
            add_filter('script_loader_tag', function ($tag, $handle) {

                if ( 'rapidload_admin_frontend' !== $handle )
                    return $tag;

                return str_replace( ' src', ' type="module" src', $tag );

            }, 10, 2);

        }

        if(is_admin()){
            add_action( 'admin_menu', array( $this, 'add_developer_settings_page' ) );
        }

    }

    public function load_legacy_ajax(){

        if(is_admin()){

            add_action('uucss/rule/saved', [$this, 'update_rule'], 10, 2);
            add_action('wp_ajax_get_all_rules', [$this, 'get_all_rules']);
            add_action('wp_ajax_upload_rules', [$this, 'upload_rules']);
            add_action('wp_ajax_rapidload_purge_all', [$this, 'rapidload_purge_all']);

        }

    }

    public function rapidload_purge_all(){

        $job_type = isset($_REQUEST['job_type']) ? $_REQUEST['job_type'] : 'all';
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;
        $rule = isset($_REQUEST['rule']) ? $_REQUEST['rule'] : false;
        $regex = isset($_REQUEST['regex']) ? $_REQUEST['regex'] : false;
        $clear = isset($_REQUEST['clear']) && boolval($_REQUEST['clear'] == 'true') ? true : false;
        $url_list = isset($_REQUEST['url_list']) ? $_REQUEST['url_list'] : [];

        if($clear){

            if(!empty($url_list)){

                if($job_type == 'url'){

                    foreach ($url_list as $value){

                        RapidLoad_DB::clear_job_data($job_type, [
                            'url' => $value
                        ]);
                        RapidLoad_DB::clear_jobs($job_type, [
                            'url' => $value
                        ]);

                    }

                }else{

                    foreach ($url_list as $value){

                        if(isset($value['rule']) && isset($value['regex'])){
                            RapidLoad_DB::clear_job_data($job_type, [
                                'rule' => $value['rule'],
                                'regex' => $value['regex']
                            ]);
                            RapidLoad_DB::clear_jobs($job_type, [
                                'rule' => $value['rule'],
                                'regex' => $value['regex']
                            ]);
                        }

                    }

                }

            }else{

                if($rule && $regex){
                    RapidLoad_DB::clear_job_data($job_type, [
                        'rule' => $rule,
                        'regex' => $regex
                    ]);
                    RapidLoad_DB::clear_jobs($job_type, [
                        'rule' => $rule,
                        'regex' => $regex
                    ]);
                }elseif ($url){
                    RapidLoad_DB::clear_job_data($job_type, [
                        'url' => $url
                    ]);
                    RapidLoad_DB::clear_jobs($job_type, [
                        'url' => $url
                    ]);
                }else{
                    RapidLoad_DB::clear_job_data($job_type);
                    RapidLoad_DB::clear_jobs($job_type);
                }

            }

        }
        else{

            switch ($job_type){

                case 'url':{

                    if($url){

                        if($url && $this->is_url_allowed($url)){

                            $job = new RapidLoad_Job(['url' => $url]);
                            $job->save(true);

                        }
                    }
                    break;
                }
                case 'rule':{

                    if($url && $rule && $regex){

                        $this->update_rule((object)[
                            'url' => $url,
                            'rule' => $rule,
                            'regex' => $regex
                        ]);
                    }
                    break;
                }
                case 'site_map':{

                    if($url){

                        $spawned = $this->schedule_cron('add_sitemap_to_jobs',[
                            'url' => $url
                        ]);
                    }
                    break;
                }
                default:{

                    $posts = new WP_Query(array(
                        'post_type'=> $job_type,
                        'posts_per_page' => -1
                    ));

                    if($posts && $posts->have_posts()){

                        while ($posts->have_posts()){

                            $posts->the_post();

                            $url = $this->transform_url(get_the_permalink(get_the_ID()));

                            if($this->is_url_allowed($url)){

                                $job = new RapidLoad_Job(['url' => $url]);
                                $job->save(true);
                            }
                        }
                    }

                    wp_reset_query();

                    break;
                }
            }
        }
        wp_send_json_success('Successfully purged');
    }

    public function upload_rules(){

        if(!isset($_REQUEST['rules'])){
            wp_send_json_error('rules required');
        }

        $rules = json_decode(stripslashes($_REQUEST['rules']));

        if(!$rules){
            wp_send_json_error('rules required');
        }

        foreach ($rules as $rule){

            $rule_job = new RapidLoad_Job([
                'url' => $rule->url,
                'rule' => $rule->rule,
                'regex' => $rule->regex
            ]);
            $rule_job->save(true);
        }

        wp_send_json_success('success');
    }

    public function get_all_rules(){

        wp_send_json_success(RapidLoad_Job::all());

    }

    public function add_developer_settings_page() {

        add_submenu_page( 'options-general.php', 'RapidLoad', 'RapidLoad', 'manage_options', 'uucss', function () {
            wp_enqueue_script( 'post' );

            ?>
            <div class="wrap">
                <h1><?php _e( 'RapidLoad Settings', 'autoptimize' ); ?></h1>
                <?php
                do_action('uucss/options/before_render_form');
                ?>
                <div>
                    <?php $this->render_developer_settings_page() ?>
                </div>
            </div>

            <?php
        });

        register_setting('autoptimize_uucss_settings', 'autoptimize_uucss_settings');

    }

    public function render_developer_settings_page(){
        $options = RapidLoad_Base::fetch_options();

        include('views/developer-settings-page.html.php');
    }

    public function is_rapidload_page()
    {
        return isset($_GET['page']) && $_GET['page'] === 'rapidload';
    }

    public function is_rapidload_legacy_page()
    {
        return isset($_GET['page']) && $_GET['page'] === 'uucss';
    }

    public function load_scripts()
    {

        wp_enqueue_style( 'rapidload_admin_frontend', UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist/assets/index.css');

        wp_register_script( 'rapidload_admin_frontend', UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist/assets/index.js');

        $data = array(
            'frontend_base' => UUCSS_PLUGIN_URL .  'includes/admin/frontend/dist'
        );

        wp_localize_script( 'rapidload_admin_frontend', 'rapidload_admin', $data );

        wp_enqueue_script( 'rapidload_admin_frontend' );



    }

    public function load_legacy_scripts(){

        $deregister_scripts = apply_filters('uucss/scripts/deregister', ['select2']);

        if(isset($deregister_scripts) && is_array($deregister_scripts)){
            foreach ($deregister_scripts as $deregister_script){
                wp_dequeue_script($deregister_script);
                wp_deregister_script($deregister_script);
            }
        }

        wp_enqueue_script( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.js', array( 'jquery' ) );

        wp_enqueue_script( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.js', array(
            'jquery',
            'uucss_admin'
        ) );
        wp_enqueue_style( 'datatables', UUCSS_PLUGIN_URL . 'assets/libs/datatables/jquery.dataTables.min.css' );

        wp_register_script( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/js/uucss_admin.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

        wp_register_script( 'uucss_log', UUCSS_PLUGIN_URL . 'assets/js/uucss_log.js', array(
            'jquery',
            'wp-util'
        ), UUCSS_VERSION );

        $deregister_styles = apply_filters('uucss/styles/deregister',[]);

        if(isset($deregister_styles) && is_array($deregister_styles)){
            foreach ($deregister_styles as $deregister_style){
                wp_dequeue_style($deregister_style);
            }
        }

        wp_enqueue_style( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_admin.css', [], UUCSS_VERSION );

        global $rapidload;

        $data = array(
            'api' => RapidLoad_Api::get_key(),
            'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'url' => site_url(),
            'ajax_url'          => admin_url( 'admin-ajax.php' ),
            'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
            'on_board_complete' => apply_filters('uucss/on-board/complete', false),
            'api_key_verified' => RapidLoad_Base::is_api_key_verified(),
            'notifications' => $this->getNotifications(),
            'faqs' => [],
            'public_notices' => [],
            'dev_mode' => apply_filters('uucss/dev_mode', isset($this->options['uucss_dev_mode'])) && $this->options['uucss_dev_mode'] == "1",
            'rules_enabled' => $rapidload->rules_enabled(),
            'cpcss_enabled' => $rapidload->critical_css_enabled(),
            'home_url' => home_url(),
            'uucss_enable_debug' => ! empty( $this->options['uucss_enable_debug'] ) && '1' === $this->options['uucss_enable_debug'],
        );

        wp_localize_script( 'uucss_admin', 'uucss', $data );

        wp_enqueue_script( 'uucss_admin' );
        wp_enqueue_script( 'uucss_log' );

        wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.css' );

    }

    public function getNotifications() {

        return apply_filters('uucss/notifications', []);
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

    public function update_rule($args, $old = false){

        if($old && isset($old['url'])){

            $job = new RapidLoad_Job([
                'url' => $old['url']
            ]);

            $job->url = $args->url;
            $job->rule = $args->rule;
            $job->regex = $args->regex;

            $job->save();

        }else{

            $job = new RapidLoad_Job([
                'url' => $args->url
            ]);
            $job->rule = $args->rule;
            $job->regex = $args->regex;

            $job->save();

        }

    }

    public function page()
    {

        ?><div id="rapidload-app"> RapidLoad loading... </div><?php

    }
}
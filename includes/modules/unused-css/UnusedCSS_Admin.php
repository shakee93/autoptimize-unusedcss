<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
abstract class UnusedCSS_Admin {

	use RapidLoad_Utils;

	/**
	 * @var UnusedCSS_Autoptimize
     */
    public $uucss;

    /**
     * @var bool
     */
    public static $enabled = true;

    /**
     * Page related meta options
     * @var array
     */
    public static $page_options = [
	    'safelist',
	    'exclude',
	    'blocklist'
    ];

    /**
     * UnusedCSS constructor.
     * @param UnusedCSS $uucss
     */
    public function __construct($uucss)
    {

        $this->uucss = $uucss;

        if(is_admin()){

            add_action( 'admin_menu', array( $this, 'add_uucss_option_page' ) );

        }


	    if (!self::$enabled) {
		    return;
	    }

        add_action( 'current_screen', function () {

            if ( get_current_screen() && get_current_screen()->base == 'settings_page_uucss' ) {
                add_action( 'admin_enqueue_scripts', [ $this, 'enqueueScripts' ] );
            }
        } );

	    $this->cache_trigger_hooks();

	    add_action( 'add_meta_boxes', [$this, 'add_meta_boxes'] );
	    add_action( 'save_post', [$this, 'save_meta_box_options'] , 10, 2);
        add_action( "uucss_run_gpsi_test_for_all", [ $this, 'run_gpsi_test_for_all' ]);
        add_action( "uucss_apply_rules", [ $this, 'apply_rules' ]);

        add_filter( 'plugin_action_links_' . plugin_basename( UUCSS_PLUGIN_FILE ), [
            $this,
            'add_plugin_action_link'
        ] );

        if(is_admin()){

            $this->deactivate();

            add_action('current_screen', [$this, 'validate_domain']);
            add_action('wp_ajax_clear_page_cache', [$this, 'clear_page_cache']);
            add_action('wp_ajax_mark_faqs_read', [$this, 'mark_faqs_read']);
            add_action('wp_ajax_mark_notice_read', [$this, 'mark_notice_read']);
            add_action('wp_ajax_frontend_logs', [$this, 'frontend_logs']);
            add_action('wp_ajax_uucss_logs', [$this, 'uucss_logs']);
            add_action('wp_ajax_clear_uucss_logs', [$this, 'clear_uucss_logs']);
            add_action( "wp_ajax_uucss_test_url", [ $this, 'uucss_test_url' ] );
            add_action( "wp_ajax_uucss_run_gpsi_status_check_for_all", [ $this, 'run_gpsi_status_check_for_all' ] );
            add_action( "wp_ajax_uucss_data", [ $this, 'uucss_data' ] );
            add_action( "wp_ajax_uucss_license", [ $this, 'uucss_license' ] );
            add_action( "wp_ajax_uucss_status", [ $this, 'uucss_status' ] );
            add_action( "wp_ajax_uucss_rule_stats", [ $this, 'uucss_rule_stats' ] );
            add_action( "wp_ajax_suggest_whitelist_packs", [ $this, 'suggest_whitelist_packs' ] );
            add_action( "wp_ajax_verify_api_key", [ $this, 'verify_api_key' ] );
            add_action( "wp_ajax_uucss_deactivate", [ $this, 'ajax_deactivate' ] );
            add_action( "wp_ajax_uucss_connect", [ $this, 'uucss_connect' ] );
            add_action( "wp_ajax_attach_rule", [ $this, 'attach_rule' ] );
            add_action( "wp_ajax_uucss_update_rule", [ $this, 'uucss_update_rule' ] );
            add_action( 'wp_ajax_uucss_queue', [$this, 'queue_posts']);
            add_action( 'uucss_sitemap_queue', [$this, 'queue_sitemap'], 10, 1);
            add_action( 'admin_notices', [ $this, 'first_uucss_job' ] );
            add_action( 'updated_option', [ $this, 'clear_cache_on_option_update' ], 10, 3 );
        }

    }

    function queue_posts(){

        if(!isset($_REQUEST['post_type'])) {
            wp_send_json_error('post type not found');
        }

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'path';
        $rule = isset($_REQUEST['rule']) ? $_REQUEST['rule'] : false;
        $regex = isset($_REQUEST['regex']) ? $_REQUEST['regex'] : false;

        $post_type = sanitize_text_field($_REQUEST['post_type']);

        $list = isset($_POST['url_list']) ? $_POST['url_list'] : null;

        $posts = null;

        global $uucss;

        if(isset($list) && is_array($list) && !empty($list)){

            if($type == 'path'){
                UnusedCSS_DB::requeue_urls($list);
            }else{
                UnusedCSS_DB::requeue_rules($list);
            }

            $this->uucss->cleanCacheFiles();

            wp_send_json_success('successfully links added to the queue');
        }else if($post_type == 'current'){

            if($type == 'path'){
                RapidLoad_Settings::clear_links(true);
            }else{
                UnusedCSS_DB::clear_rules(true);
            }

            $this->uucss->cleanCacheFiles();

            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'processing'){

            if($type == 'path'){
                UnusedCSS_DB::requeue_jobs('processing');
                UnusedCSS_DB::requeue_jobs('waiting');
            }else{
                UnusedCSS_DB::requeue_rule_jobs('processing');
                UnusedCSS_DB::requeue_rule_jobs('waiting');
            }

            $this->uucss->cleanCacheFiles();

            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'warnings'){

            if($type == 'path'){
                UnusedCSS_DB::requeue_jobs('warnings');
            }else{
                UnusedCSS_DB::requeue_rule_jobs('warnings');
            }

            $this->uucss->cleanCacheFiles();

            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'failed'){

            if($type == 'path'){
                UnusedCSS_DB::requeue_jobs();
            }else{
                UnusedCSS_DB::requeue_rule_jobs();
            }

            $this->uucss->cleanCacheFiles();

            wp_send_json_success('successfully links added to the queue');

        }else if($post_type == 'url'){

            $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

            $url = $this->transform_url($url);

            if(!$uucss->is_valid_url($url)){
                wp_send_json_error('url is not valid');
            }

            if($url && !$uucss->is_url_allowed($url)){
                wp_send_json_error('url is excluded');
            }

            $url_object = false;

            if($type == 'path'){

                $url_object = new UnusedCSS_Path([
                    'url' => $url
                ]);

            }else{

                $url_object = new UnusedCSS_Rule([
                    'rule' => $rule,
                    'regex' => $regex
                ]);

            }

            if(!$url_object){

                wp_send_json_error('Invalid URL');

            }

            $url_object->requeue();
            $url_object->save();

            wp_send_json_success('successfully link added to the queue');

        }else if($post_type == 'site_map'){

            $sitemap = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

            if(!$sitemap){

                wp_send_json_error('site map url required');
            }

            $spawned = $this->schedule_cron('uucss_sitemap_queue',[
                'url' => $sitemap
            ]);

            self::log([
                'log' => 'cron spawned : ' . $spawned,
                'url' => $sitemap,
                'type' => 'queued'
            ]);

            wp_send_json_success('Sitemap links scheduled to be added to the queue.');

        }else{

            $posts = new WP_Query(array(
                'post_type'=> $post_type,
                'posts_per_page' => -1
            ));

        }

        if($posts && $posts->have_posts()){
            while ($posts->have_posts()){
                $posts->the_post();

                $url = $this->transform_url(get_the_permalink(get_the_ID()));

                if($uucss->is_url_allowed($url)){
                    new UnusedCSS_Path([
                        'url' => $url
                    ]);
                }

            }
        }

        wp_reset_query();

        wp_send_json_success('successfully links added to the queue');

    }

    function queue_sitemap($url = false){

        if(!$url){

            $url = apply_filters('uucss/sitemap/default', stripslashes(get_site_url(get_current_blog_id())) . '/sitemap_index.xml');
        }

        $site_map = new RapidLoad_Sitemap();
        $urls = $site_map->process_site_map($url);

        global $uucss;

        if(isset($urls) && !empty($urls)){

            foreach ($urls as $url){

                if($uucss->is_url_allowed($url)){

                    new UnusedCSS_Path([
                        'url' => $url
                    ]);
                }

            }
        }
    }

    public function add_uucss_option_page() {

        add_submenu_page( 'options-general.php', 'RapidLoad', 'RapidLoad', 'manage_options', 'uucss', function () {
            wp_enqueue_script( 'post' );

            ?>
            <div class="wrap">
                <h1><?php _e( 'RapidLoad Settings', 'autoptimize' ); ?></h1>
                <?php
                    do_action('uucss/options/before_render_form');
                ?>
                <div>
                    <?php $this->render_form() ?>
                </div>
            </div>

            <?php
        });

        register_setting('autoptimize_uucss_settings', 'autoptimize_uucss_settings');

    }

    public function render_form() {
        $options = RapidLoad_Base::fetch_options();

        if(isset($options) && !isset($options['uucss_jobs_per_queue'])){
            $this->update_defaults($options);
        }

        include('parts/options-page.html.php');
    }

    public function uucss_rule_stats(){

        wp_send_json_success([
            'duplicateFiles' => UnusedCSS_DB::get_duplicate_files()
        ]);

    }

    public function uucss_status(){

        wp_send_json_success([
            'cssStyleSheetsCount' => $this->uucss->cache_file_count(),
            'cssStyleSheetsSize' => $this->uucss->size(),
            'hits' => UnusedCSS_DB::get_total_job_count(' WHERE hits > 0 '),
            'success' => UnusedCSS_DB::get_total_job_count(' WHERE status = "success" AND warnings IS NULL '),
            'ruleBased' => UnusedCSS_DB::get_total_job_count(" WHERE status = 'rule-based'"),
            'queued' => UnusedCSS_DB::get_total_job_count(' WHERE status = "queued" '),
            'waiting' => UnusedCSS_DB::get_total_job_count(' WHERE status = "waiting" '),
            'processing' => UnusedCSS_DB::get_total_job_count(' WHERE status = "processing" '),
            'warnings' => UnusedCSS_DB::get_total_job_count(' WHERE warnings IS NOT NULL '),
            'failed' => UnusedCSS_DB::get_total_job_count(' WHERE status = "failed" '),
            'total' => UnusedCSS_DB::get_total_job_count(),
        ]);
    }

    public function uucss_update_rule(){

        if( !isset($_REQUEST['rule']) || empty($_REQUEST['rule']) ||
            !isset($_REQUEST['url']) || empty($_REQUEST['url'])
        ){
            wp_send_json_error('Required fields missing');
        }

        $rule = $_REQUEST['rule'];
        $url = $_REQUEST['url'];
        $regex = isset($_REQUEST['regex']) ? $_REQUEST['regex'] : '/';

        $url = $this->transform_url($url);

        global $uucss;

        if(!$uucss->is_url_allowed($url)){
            wp_send_json_error('URL not allowed');
        }

        if(!self::is_url_glob_matched($url, $regex)){
            wp_send_json_error('Invalid regex for the url');
        }

        if(isset($_REQUEST['old_rule']) && isset($_REQUEST['old_regex'])){

            if(UnusedCSS_DB::rule_exists_with_error($_REQUEST['old_rule'], $_REQUEST['old_regex'])){

                $ruleObject = new UnusedCSS_Rule([
                   'rule' => $_REQUEST['old_rule'],
                   'regex' => $_REQUEST['old_regex']
                ]);

                if(isset($_REQUEST['old_url']) && $_REQUEST['old_url'] != $url ||
                    $_REQUEST['old_rule'] != $rule || $_REQUEST['old_regex'] != $regex){
                    $ruleObject->requeue();
                    $ruleObject->releaseRule();
                }

                $ruleObject->url = $url;
                $ruleObject->rule = $rule;
                $ruleObject->regex = $regex;
                $ruleObject->save();

                wp_send_json_success('Rule updated successfully');
            }

        }

        if(UnusedCSS_DB::rule_exists_with_error($_REQUEST['rule'], $_REQUEST['regex'])){
            wp_send_json_error('Rule already exist');
        }

        new UnusedCSS_Rule([
            'rule' => $rule,
            'url' => $url,
            'regex' => $regex,
        ]);

        /*$spawned = $this->schedule_cron('uucss_apply_rules', [] );

        if($spawned){
            self::log([
                'log' => 'apply rules initiated',
                'url' => $url,
                'type' => 'uucss-cron'
            ]);
        }*/

        wp_send_json_success('Rule updated successfully');
    }

    public function apply_rules(){

        $links = UnusedCSS_DB::get_links_where(" WHERE rule_note != 'detached' ");

        if(isset($links) && !empty($links)){

            foreach ($links as $link){

                $rule = false;

                if(isset($link['rule'])){
                    $rule = $link['rule'];
                }else{
                    $post_id = url_to_postid($link['url']);
                    if($post_id){
                        $rule = get_post_type($post_id);
                        if($rule){
                            $rule = 'is_' . $rule;
                        }
                    }
                }

                $applicable_rule = UnusedCSS_DB::get_applied_rule($rule, $link['url']);

                if(!$applicable_rule){

                    $applicable_rule = UnusedCSS_DB::get_applied_rule('is_path', $link['url']);

                }

                if($applicable_rule){

                    $path = new UnusedCSS_Path([
                        'url' => $link['url']
                    ]);
                    $path->attach_rule($applicable_rule->id, $applicable_rule->rule);
                    $path->save();

                    do_action( 'uucss/cached', [
                        'url' => $link['url']
                    ]);

                }

                self::log([
                    'log' => 'rule validated : ' . $rule,
                    'url' => $link['url'],
                    'type' => 'uucss-cron'
                ]);

            }

        }
    }

    public function attach_rule(){

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : false;
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;
        $rule_id = isset($_REQUEST['rule_id']) ? $_REQUEST['rule_id'] : false;

        if(!$type || !$url){
            wp_send_json_error('Required field missing');
        }

        if($type == 'detach' && UnusedCSS_DB::rule_exist_by_url($url)){
            wp_send_json_error('Rule exist with same url');
        }

        if($type == 'detach' && UnusedCSS_DB::link_exists_with_error($url)){

            $path = new UnusedCSS_Path([
               'url' => $url
            ]);
            $path->attach_rule();
            $path->save();
            wp_send_json_success('Successfully detached from rule');
        }

        if(!$type || $type == 'attach' && !$rule_id){
            wp_send_json_error('Required field missing');
        }

        if($type == 'attach'){

            $rule = UnusedCSS_Rule::get_rule_from_id($rule_id);

            if(!$rule){
                wp_send_json_error('Rule not found');
            }

            $path = new UnusedCSS_Path([
                'url' => $url
            ]);

            if(!self::is_url_glob_matched($url, $rule->regex)){
                wp_send_json_success('Pattern not matched');
            }

            $path->attach_rule($rule->id, $rule->rule);
            $path->save();
            wp_send_json_success('Successfully attached to rule');
        }

    }

    public static function is_domain_verified(){
        $options = self::get_site_option( 'autoptimize_uucss_settings' );
        return  $options['valid_domain'];
    }

    public function clear_cache_on_option_update( $option, $old_value, $value ) {

        if ( $option == 'autoptimize_uucss_settings' && $this->uucss ) {

            $needs_to_cleared = false;

            $diffs = [];
            $diffs_invert = [];

            if ( $old_value && $value ) {
                $diffs        = array_diff_key( $old_value, $value );
                $diffs_invert = array_diff_key( $value, $old_value );
            }

            if ( isset( $diffs_invert['valid_domain'] ) ) {
                unset( $diffs_invert['valid_domain'] );
            }
            if ( isset( $diffs['valid_domain'] ) ) {
                unset( $diffs['valid_domain'] );
            }

            $diffs = array_merge( $diffs, $diffs_invert );

            // if these settings are changed cache will be cleared
            if ( isset( $diffs['uucss_minify'] ) ||
                isset( $diffs['uucss_keyframes'] ) ||
                isset( $diffs['uucss_fontface'] ) ||
                isset( $diffs['uucss_analyze_javascript'] ) ||
                isset( $diffs['uucss_safelist'] ) ||
                isset( $diffs['whitelist_packs'] ) ||
                isset( $diffs['uucss_blocklist'] ) ||
                isset( $diffs['uucss_variables'] ) ) {
                $needs_to_cleared = true;
            }

            foreach ( [ 'whitelist_packs', 'uucss_safelist', 'uucss_blocklist' ] as $compare_value ) {
                if ( isset( $value[ $compare_value ] ) && isset( $old_value[ $compare_value ] ) && $old_value[ $compare_value ] !== $value[ $compare_value ] ) {
                    $needs_to_cleared = true;
                    break;
                }
            }

            if(isset( $diffs['uucss_enable_rules'] )){
                UnusedCSS_DB::detach_all_rules();
            }

            if ( $needs_to_cleared ) {

                $this->uucss->clear_cache( null, [
                    'soft' => true
                ] );
            }
        }

    }

    public function deactivate() {

        if ( ! isset( $_REQUEST['deactivated'] ) || empty( $_REQUEST['deactivated'] ) ) {
            return;
        }

        if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_activation' ) ) {
            self::add_admin_notice( 'RapidLoad : Request verification failed for Activation. Contact support if the problem persists.', 'error' );

            return;
        }

        $options = self::get_site_option( 'autoptimize_uucss_settings' );

        unset( $options['uucss_api_key_verified'] );
        unset( $options['uucss_api_key'] );
        unset( $options['whitelist_packs'] );

        self::update_site_option( 'autoptimize_uucss_settings', $options );

        $cache_key = 'pand-' . md5( 'first-uucss-job' );
        self::delete_site_option( $cache_key );

        $this->uucss->vanish();

        self::$deactivating = true;

        $notice = [
            'action'      => 'activate',
            'message'     => 'RapidLoad : Deactivated your license for this site.',
            'main_action' => [
                'key'   => 'Reactivate',
                'value' => self::activation_url( 'authorize' )
            ],
            'type'        => 'success'
        ];
        self::add_advanced_admin_notice( $notice );

        return;
    }

    public function first_uucss_job() {

        if ( class_exists('PAnD') && ! PAnD::is_admin_notice_active( 'first-uucss-job-forever' ) ) {
            return;
        }

        $job = RapidLoad_Settings::get_first_link();

        if ( $job && $job['status'] == 'success' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="updated notice uucss-notice notice-success is-dismissible">
                <h4><span class="dashicons dashicons-yes-alt"></span> RapidLoad successfully ran your first job!</h4>
                <p><?php _e( 'You slashed <strong>' . $job['meta']['stats']->reductionSize . ' </strong> of unused CSS - that\'s <strong>' . $job['meta']['stats']->reduction . '% </strong> of your total CSS file size. Way to go 👏', 'sample-text-domain' ); ?></p>
            </div>
        <?php endif;

        if ( $job && $job['status'] == 'failed' ) : ?>
            <div data-dismissible="first-uucss-job-forever"
                 class="error notice uucss-notice notice-error is-dismissible">
                <h4><span class="dashicons dashicons-no-alt"></span> RapidLoad : We were unable to remove unused css
                    from
                    your site 🤕</h4>

                <div>
                    <p> Our team can help. Get in touch with support <a target="_blank"
                                                                        href="https://rapidload.zendesk.com/hc/en-us/requests/new">here</a>
                    </p>
                    <blockquote class="error notice">
                        <strong>Link :</strong> <?php echo $job['url'] ?> <br>
                        <strong>Error :</strong> <?php echo $job['meta']['error']['code'] ?> <br>
                        <strong>Message :</strong> <?php echo $job['meta']['error']['message'] ?>
                    </blockquote>
                </div>

            </div>
        <?php endif;
    }

    public function uucss_connect(){

        if ( ! isset( $_REQUEST['license_key'] ) || empty( $_REQUEST['license_key'] ) ) {
            wp_send_json_error( 'License Key required' );
        }

        $license_key = $_REQUEST['license_key'];

        $uucss_api         = new RapidLoad_Api();
        $uucss_api->apiKey = $license_key;
        $results           = $uucss_api->post( 'connect', [ 'url' => $this->transform_url(get_site_url()), 'type' => 'wordpress' ] );

        if ( $uucss_api->is_error( $results ) ) {
            if(isset($results->errors) && isset($results->errors[0])){
                wp_send_json_error($results->errors[0]->detail);
            }else{
                wp_send_json_error('License Key verification fail');
            }
        }

        wp_send_json_success([
            'success' => true,
            'message' => 'License Key verification success',
            'activation_nonce' => wp_create_nonce( 'uucss_activation' ),
        ]);
    }

    public function ajax_deactivate() {

        $options = self::get_site_option( 'autoptimize_uucss_settings' );

        $cache_key = 'pand-' . md5( 'first-uucss-job' );
        self::delete_site_option( $cache_key );

        $this->uucss->vanish();

        $api = new RapidLoad_Api();

        // remove domain from authorized list
        $api->post( 'deactivate', [
            'url' => site_url()
        ] );

        unset( $options['uucss_api_key_verified'] );
        unset( $options['uucss_api_key'] );
        unset( $options['whitelist_packs'] );

        self::update_site_option( 'autoptimize_uucss_settings', $options );

        wp_send_json_success( true );
    }

    public function validate_domain() {

        if ( get_current_screen() && get_current_screen()->base != 'settings_page_uucss' ) {
            return;
        }

        $options   = self::get_site_option( 'autoptimize_uucss_settings' );

        if(!isset( $options['uucss_api_key_verified'] ) || $options['uucss_api_key_verified'] != '1'){
            return;
        }

        $uucss_api = new RapidLoad_Api();

        if ( ! isset( $options['uucss_api_key'] ) ) {
            return;
        }

        $results = $uucss_api->get( 'verify', [ 'url' => site_url(), 'token' => $options['uucss_api_key'] ] );

        if($uucss_api->is_error($results)){
            $options['valid_domain'] = false;
            self::update_site_option('autoptimize_uucss_settings', $options);
            return;
        }

        if(!isset($options['valid_domain']) || !$options['valid_domain']){
            $options['valid_domain'] = true;
            self::update_site_option('autoptimize_uucss_settings', $options);
        }
    }

    public function uucss_data() {

        if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( $_REQUEST['nonce'], 'uucss_nonce' ) ) {
            wp_send_json_error( 'UnusedCSS - Malformed Request Detected, Contact Support.' );
        }

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'path';

        $start = isset($_REQUEST['start']) ? $_REQUEST['start'] : 0;
        $length = isset($_REQUEST['length']) ? $_REQUEST['length'] : 10;
        $draw = isset($_REQUEST['draw']) ? $_REQUEST['draw'] : 1;

        $status_filter = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][0]) &&
        isset($_REQUEST['columns'][0]['search']) &&
        isset($_REQUEST['columns'][0]['search']['value']) ?
            $_REQUEST['columns'][0]['search']['value'] : false;

        $filters = [];

        if($status_filter){

            if($status_filter == 'warning'){

                $filters[] = " warnings IS NOT NULL ";
            }else{

                $filters[] = " status = '". $status_filter . "' AND warnings IS NULL ";
            }

        }

        $url_filter = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][1]) &&
        isset($_REQUEST['columns'][1]['search']) &&
        isset($_REQUEST['columns'][1]['search']['value']) ?
            $_REQUEST['columns'][1]['search']['value'] : false;

        $url_regex = isset($_REQUEST['columns']) &&
        isset($_REQUEST['columns'][1]) &&
        isset($_REQUEST['columns'][1]['search']) &&
        isset($_REQUEST['columns'][1]['search']['regex']) ?
            $_REQUEST['columns'][1]['search']['regex'] : false;

        if($url_regex == 'true' && $url_filter){

            $filters[] = " url = '". $url_filter . "' ";

        }

        if($url_regex == 'false' && $url_filter){

            $filters[] = " url LIKE '%". $url_filter . "%' ";

        }

        $where_clause = '';

        foreach ($filters as $key => $filter){

            if($key == 0){

                $where_clause = ' WHERE ';
                $where_clause .= $filter;
            }else{

                $where_clause .= ' AND ';
                $where_clause .= $filter;
            }

        }

        $data  = $type == 'path' ?
            UnusedCSS_DB::get_links($start, $length, $where_clause):
            UnusedCSS_DB::get_rules($start, $length, $where_clause);

        wp_send_json([
            'data' => $data,
            "draw" => (int)$draw,
            "recordsTotal" => $type == 'path' ? UnusedCSS_DB::get_total_job_count() : UnusedCSS_DB::get_total_rule_count(),
            "recordsFiltered" => $type == 'path' ? UnusedCSS_DB::get_total_job_count($where_clause) : UnusedCSS_DB::get_total_rule_count($where_clause),
            "success" => true
        ]);
    }

    public function enqueueScripts() {

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

        wp_enqueue_style( 'uucss_admin', UUCSS_PLUGIN_URL . 'assets/css/uucss_admin.css', [], UUCSS_VERSION );



        $data = array(
            'api' => RapidLoad_Api::get_key(),
            'nonce' => wp_create_nonce( 'uucss_nonce' ),
            'url' => site_url(),
            'ajax_url'          => admin_url( 'admin-ajax.php' ),
            'setting_url'       => admin_url( 'options-general.php?page=uucss' ),
            'on_board_complete' => apply_filters('uucss/on-board/complete', false),
            'api_key_verified' => self::is_api_key_verified(),
            'notifications' => $this->getNotifications(),
            'faqs' => $this->get_faqs(),
            'public_notices' => $this->get_public_notices(),
            'dev_mode' => apply_filters('uucss/dev_mode', isset($this->uucss->options['uucss_dev_mode'])) && $this->uucss->options['uucss_dev_mode'] == "1",
            'rules_enabled' => $this->uucss->rules_enabled(),
        );

        wp_localize_script( 'uucss_admin', 'uucss', $data );

        wp_enqueue_script( 'uucss_admin' );
        wp_enqueue_script( 'uucss_log' );

        wp_enqueue_style( 'select2', UUCSS_PLUGIN_URL . 'assets/libs/select2/select2.min.css' );

    }

    public function getNotifications() {

        return apply_filters('uucss/notifications', []);
    }

    public function run_gpsi_test_for_all(){

        $links = UnusedCSS_DB::get_links_where(" WHERE status IN('success','rule-based') ");

        if(!empty($links)){

            foreach ($links as $link){

                if(isset($link['meta']) &&
                    isset($link['meta']['stats']) &&
                    isset($link['meta']['stats']->success_count) &&
                    $link['meta']['stats']->success_count > 0 ||
                    isset($link['success_count']) && $link['success_count']
                ){
                    continue;
                }

                $this->get_gpsi_test_result($link);

            }

        }

    }

    public function run_gpsi_status_check_for_all(){

        $spawned = wp_schedule_single_event( time() + 5, 'uucss_run_gpsi_test_for_all');

        wp_send_json_success([
            'spawned' => $spawned
        ]);
    }

    public function get_public_notices(){

        $api = new RapidLoad_Api();

        $result = $api->get('notification');

        $data = !$api->is_error($result) && isset($result->data) ? $result->data : [];

        $data = array_filter($data, function ($notice){
            $notice_read = UnusedCSS_Admin::get_site_option('uucss_notice_' . $notice->id . '_read');
            return empty($notice_read);
        });

        $keys = array_keys($data);

        if(empty($keys)){
            return $data;
        }

        $notices = [];

        foreach ($data as $key => $notice){
            array_push($notices, $notice);
        }

        return $notices;
    }

    public function get_gpsi_test_result($link){

        $uucss_api = new RapidLoad_Api();

        $cached_files = [];
        $original_files = [];

        if(isset($link['files']) && !empty($link['files'])){

            $cached_files = array_filter($link['files'], function ($file){
                return !$this->str_contains($file['original'], '//inline-style@');
            });

            $original_files = array_filter($link['files'], function ($file){
                return !$this->str_contains($file['original'], '//inline-style@');
            });
        }

        return $uucss_api->post( 'test/wordpress',
            [
                'url' => urldecode($link['url']),
                'files' => !empty($cached_files) ? array_column($cached_files, 'uucss') : [],
                'aoFiles' => !empty($original_files) ? array_column($original_files, 'original') : []
            ]);

    }

    public function uucss_test_url(){

        global $uucss;

        if(!isset($_REQUEST['url'])){
            wp_send_json_error('url required');
        }

        $url = $_REQUEST['url'];
        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 'path';

        if($type == 'rule'){

            if(!isset($_REQUEST['rule']) || !isset($_REQUEST['regex'])){
                wp_send_json_error('rule and regex required');
            }

        }

        $uucss_api = new RapidLoad_Api();

        $link = $type == 'path' ? UnusedCSS_DB::get_link($url) : UnusedCSS_DB::get_rule($_REQUEST['rule'],$_REQUEST['regex']);

        $result = $this->get_gpsi_test_result($link);

        if ( $uucss_api->is_error( $result ) ) {
            if(isset($result->errors) && isset($result->errors[0])){
                wp_send_json_error($result->errors[0]->detail);
            }else{
                wp_send_json_error($result);
            }
        }

        wp_send_json_success($result);
    }

    public function get_faqs(){

        $rapidload_faqs_read = self::get_site_option('rapidload_faqs_read');

        if(!empty($rapidload_faqs_read)){
            return [];
        }

        $api = new RapidLoad_Api();

        $result = $api->get('faqs');

        $default = [
            [
                "title" => "I enabled RapidLoad and now my site is broken. What do I do?",
                "message" => "If you are encountering layout or styling issues on a RapidLoad optimized page, try enabling the “Load Original CSS Files” option or <a href='https://rapidload.zendesk.com/hc/en-us/articles/360063292673-Sitewide-Safelists-Blocklists'>adding safelist rules</a> for affected elements in the plugin Advanced Settings. Always remember to requeue affected pages after making plugin changes. Need more help? Head over to the RapidLoad docs for more information or to submit a Support request: <a href='https://rapidload.zendesk.com/hc/en-us'>https://rapidload.zendesk.com/hc/en-us</a>",
            ],
            [
                "title" => "Why am I still seeing the “Removed unused CSS” flag in Google Page Speed Insights?",
                "message" => "It’s possible that the RapidLoad optimized version of the page is not yet being served. Try clearing your page cache and running the GPSI test again.",
            ],
            [
                "title" => "Will this plugin work with other caching plugins?",
                "message" => "RapidLoad works with all major caching plugins. If you are using a little known caching plugin and are experiencing issues with RapidLoad, please submit your issue and caching plugin name to our support team and we will review.",
            ],
            [
                "title" => "Do I need to run this every time I make a change?",
                "message" => "No! RapidLoad works in the background, so any new stylesheets that are added will be analyzed and optimized on the fly. Just set it and forget it!",
            ],
            [
                "title" => "Do you offer support if I need it?",
                "message" => "Yes, our team is standing by to assist you! Submit a support ticket any time from the Support tab in the plugin and we’ll be happy to help.",
            ]
        ];

        return !$api->is_error($result) && isset($result->data) ? $result->data : $default;
    }

    public function clear_uucss_logs(){
        $file_system = new RapidLoad_FileSystem();

        if(!$file_system->exists(WP_CONTENT_DIR . '/uploads/rapidload/')){
            wp_send_json_success(true);
        }

        $file_system->delete_folder(WP_CONTENT_DIR . '/uploads/rapidload/');
        wp_send_json_success(true);
    }

    public function uucss_logs(){

        $file_system = new RapidLoad_FileSystem();

        if(!$file_system->exists(UUCSS_LOG_DIR . 'debug.log')){
            wp_send_json_success([]);
        }

        $data = $file_system->get_contents(UUCSS_LOG_DIR . 'debug.log');

        if(empty($data)){
            wp_send_json_success([]);
        }

        $data = '[' . $data . ']';

        wp_send_json_success(json_decode($data));
    }

    public function frontend_logs(){

        $args = [];

        $args['type'] = isset($_REQUEST['type']) && !empty($_REQUEST['type']) ? $_REQUEST['type'] : 'frontend';
        $args['log'] = isset($_REQUEST['log']) && !empty($_REQUEST['log']) ? $_REQUEST['log'] : '';
        $args['url'] = isset($_REQUEST['url']) && !empty($_REQUEST['url']) ? $_REQUEST['url'] : '';

        self::log($args);

        wp_send_json_success(true);
    }

    public function mark_faqs_read(){

        self::update_site_option('rapidload_faqs_read', true);
        wp_send_json_success(true);
    }

    public function mark_notice_read(){

        $notice_id = isset($_REQUEST['notice_id']) ? $_REQUEST['notice_id'] : false;

        if($notice_id){
            self::update_site_option('uucss_notice_' . $notice_id . '_read', true);
        }

        wp_send_json_success(true);
    }

    public function clear_page_cache(){

        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;

        $status = isset($_REQUEST['status']) ? $_REQUEST['status'] : false;

        $type = isset($_REQUEST['type']) ? $_REQUEST['status'] : 'path';

        if($url){

            UnusedCSS_DB::reset_hits($url);
            do_action( 'uucss/cached', [
                'url' => $url
            ] );
        }

        $links = false;

        if($status){

            UnusedCSS_DB::reset_hits();

            if($type == 'path'){

                $links = UnusedCSS_DB::get_links_where(' ');

            }else{

                $links = UnusedCSS_DB::get_rules_where(' ');

            }

        }

        if($links && !empty($links)){

            foreach ($links as $link){

                if(isset($link['url'])){

                    do_action( 'uucss/cached', [
                        'url' => $link['url']
                    ] );
                }
            }
        }

        wp_send_json_success('page cache cleared');
    }

    public static function is_api_key_verified() {

        $api_key_status = isset( RapidLoad_Base::fetch_options()['uucss_api_key_verified'] ) ? RapidLoad_Base::fetch_options()['uucss_api_key_verified'] : '';

        return $api_key_status == '1';

    }

    public function add_plugin_action_link( $links ) {

        $_links = array(
            '<a href="' . admin_url( 'options-general.php?page=uucss' ) . '">Settings</a>',
        );

        return array_merge( $_links, $links );
    }

    public function add_meta_boxes()
    {
        add_meta_box(
            'uucss-options',
            __( 'RapidLoad Options', 'uucss' ),
            [$this, 'meta_box'],
            get_post_types(),
            'side'
        );
    }

    public function meta_box( $post ) {

        $options = $this->get_page_options($post->ID);

        include('parts/admin-post.html.php');
    }

    public static function get_page_options($post_id)
    {
        $options = [];

        if($post_id){

            foreach (self::$page_options as $option) {
                $options[$option] = get_post_meta( $post_id, '_uucss_' . $option, true );
            }

        }

        return $options;
    }

    public function save_meta_box_options($post_id, $post)
    {
        if ( !isset( $_POST['uucss_nonce'] ) || !wp_verify_nonce( $_POST['uucss_nonce'], 'uucss_option_save' ) ) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        $this->update_meta($post_id);

    }

	public function cache_trigger_hooks() {
		add_action( 'save_post', [ $this, 'cache_on_actions' ], 110, 3 );
		add_action( 'untrash_post', [ $this, 'cache_on_actions' ], 10, 1 );
		add_action( 'wp_trash_post', [ $this, 'clear_on_actions' ], 10, 1 );
		add_action( "wp_ajax_uucss_purge_url", [ $this, 'ajax_purge_url' ] );

	}

	public static function suggest_whitelist_packs() {

		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins        = get_plugins();
		$active_plugins = array_map( function ( $key, $item ) {

			$item['slug'] = $key;

			return $item;
		}, array_keys( $plugins ), $plugins );

		$api = new RapidLoad_Api();

		$data = $api->post( 'whitelist-packs/wp-suggest', [
			'plugins' => $active_plugins,
			'theme'   => get_template(),
			'url'     => site_url()
		] );

		if ( wp_doing_ajax() ) {
			wp_send_json_success( $data->data );
		}

		return $data;
	}

	public function uucss_license() {

		$api = new RapidLoad_Api();

		$data = $api->get( 'license', [
			'url' => $this->transform_url(get_site_url())
		] );

		if ( ! is_wp_error( $data ) ) {

			if ( isset( $data->errors ) ) {
				wp_send_json_error( $data->errors[0]->detail );
			}

			if ( gettype( $data ) === 'string' ) {
				wp_send_json_error( $data );
			}

			do_action( 'uucss/license-verified' );

			wp_send_json_success( $data->data );
		}

		wp_send_json_error( 'unknown error occurred' );
	}

	public function verify_api_key() {

		if ( ! isset( $_POST['api_key'] ) ) {
			wp_send_json_error();

			return;
		}

		$uucss_api         = new RapidLoad_Api();
		$uucss_api->apiKey = sanitize_text_field( $_POST['api_key'] );

		$results = $uucss_api->get( 'verify' );

		if ( isset( $results->data ) ) {
			wp_send_json_success( true );
		}

		wp_send_json_error();

	}

    public function ajax_purge_url() {

	    if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'uucss_nonce' ) ) {
		    wp_send_json_error( 'authentication failed' );

		    return;
	    }

	    $args = isset($_POST['args']) ? $_POST['args'] : [];

	    if ( ! isset( $_POST['url'] ) ) {
		    wp_send_json_error();

		    return;
	    }

	    if ( isset( $_POST['args'] ) ) {
		    $args['post_id'] = ( isset( $_POST['args']['post_id'] ) ) ? intval( $_POST['args']['post_id'] ) : null;
	    }

	    $url = esc_url_raw( $_POST['url'] );

	    if(isset($args['rule_id'])){
            $rule = UnusedCSS_Rule::get_rule_from_id($args['rule_id']);
            if($rule){
                $url = $rule->url;
                $args['rule'] = $rule->rule;
            }
        }

	    if ( isset( $_POST['clear'] ) && boolval($_POST['clear'] == 'true') ) {
	        $list = isset($_POST['url_list']) ? $_POST['url_list'] : null;

	        if(isset($list) && is_array($list) && !empty($list)){
	            foreach ($list as $item){

	                $url = is_array($item) && isset($item['url']) ? $item['url'] : $item;

	                if(is_array($item) && isset($item['rule'])){
	                    $args['rule'] = $item['rule'];
                    }

                    if(is_array($item) && isset($item['regex'])){
                        $args['regex'] = $item['regex'];
                    }

                    $this->uucss->clear_cache( $url, $args );
                }
            }else{
                $this->uucss->clear_cache( $url, $args );
            }

		    wp_send_json_success( true );
		    return;
	    }

	    if ( isset( $args["post_id"] ) ) {
		    $args['options'] = $this->uucss->api_options( $args["post_id"] );
	    }

	    $args['immediate'] = true;
	    $args['priority'] = true;

	    wp_send_json_success( $this->uucss->cache( $url, $args ) );
    }

    /**
     * @param $post_id
     * @param $post WP_Post
     * @param $update
     */
    public function cache_on_actions($post_id, $post = null, $update = null)
    {
        $post = get_post($post_id);
        if($post->post_status == "publish") {
	        $this->clear_on_actions( $post->ID );
	        $this->uucss->cache( get_permalink( $post ) );
        }
    }

    public function clear_on_actions($post_ID)
    {
        $link = get_permalink($post_ID);

        if($link){
            $this->uucss->clear_cache($link);
        }
    }

    public function update_meta($post_id)
    {
        foreach (self::$page_options as $option) {

	        if ( ! isset( $_POST[ 'uucss_' . $option ] ) ) {
		        delete_post_meta( $post_id, '_uucss_' . $option );
		        continue;
	        }

	        $value = sanitize_text_field( $_POST[ 'uucss_' . $option ] );

	        update_post_meta( $post_id, '_uucss_' . $option, $value );
        }
    }

    public static function get_site_option($name)
    {
        if(is_multisite()){

            return get_blog_option(get_current_blog_id(), $name, false);

        }
        return get_site_option( $name, false );
    }

    public static function update_site_option($name, $value){

        if(is_multisite()){

            return update_blog_option(get_current_blog_id(), $name, $value);

        }
        return update_site_option($name, $value);
    }

    public static function delete_site_option($name){

        if(is_multisite()){

            return delete_blog_option(get_current_blog_id(), $name);

        }
        return delete_site_option($name);
    }

    public static function first_job_done(){
        return (RapidLoad_Settings::get_first_link() ? true :  false);
    }

    public static function get_robots_text($url){
        $robotsUrl = $url . "/robots.txt";

        $robot = new stdClass();
        $robot->disAllow = [];
        $robot->allow = [];

        $fh = fopen($robotsUrl,'r');

        while ($fh && ($line = fgets($fh)) != false) {

            if (preg_match("/user-agent.*/i", $line) ){
                $robot->userAgent = trim(explode(':', $line, 2)[1]);
            }
            else if (preg_match("/disallow.*/i", $line)){
                array_push($robot->disAllow, trim(explode(':', $line, 2)[1]));
            }
            else if (preg_match("/^allow.*/i", $line)){
                array_push($robot->allow, trim(explode(':', $line, 2)[1]));
            }
            else if(preg_match("/sitemap.*/i", $line)){
                $robot->sitemap = trim(explode(':', $line, 2)[1]);
            }

        }

        return $robot;
    }
}

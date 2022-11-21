<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin
{
    use RapidLoad_Utils;

    public function __construct()
    {
        if(is_admin()){

            add_action('current_screen', [$this, 'validate_domain']);
            add_action('updated_option', [$this, 'update_cloudflare_settings'], 10, 3 );
            add_action('updated_option', [ $this, 'clear_cache_on_option_update' ], 10, 3 );
            add_action('uucss/options/after_settings_section',[$this, 'render_cloudflare_settings']);
            add_action('wp_ajax_get_robots_text', [$this, 'get_robots_text']);
            add_action('wp_ajax_frontend_logs', [$this, 'frontend_logs']);
            add_action('wp_ajax_uucss_logs', [$this, 'rapidload_logs']);
            add_action('wp_ajax_clear_uucss_logs', [$this, 'clear_rapidload_logs']);
            add_action('wp_ajax_uucss_license', [ $this, 'uucss_license' ] );
            add_action('wp_ajax_uucss_deactivate', [ $this, 'ajax_deactivate' ] );
            add_action('wp_ajax_uucss_connect', [ $this, 'uucss_connect' ] );
            add_action('wp_ajax_clear_page_cache', [$this, 'clear_page_cache']);
            add_action('wp_ajax_verify_api_key', [ $this, 'verify_api_key' ] );
            add_action('wp_ajax_attach_rule', [ $this, 'attach_rule' ] );
            add_action('wp_ajax_activate_module', [ $this, 'activate_module' ] );
            add_action('wp_ajax_list_module', [ $this, 'list_module' ] );
            add_action('wp_ajax_update_rapidload_settings', [$this, 'update_rapidload_settings']);
        }

        add_filter('uucss/api/options', [$this, 'inject_cloudflare_settings'], 10 , 1);
        add_filter('uucss/rules', [$this, 'rapidload_rule_types'], 90 , 1);
        add_action('add_sitemap_to_jobs', [$this, 'add_sitemap_to_jobs'], 10, 1);

    }

    public function update_rapidload_settings(){

        $options = RapidLoad_Base::fetch_options();

        // update  css options

        if(isset($_REQUEST['uucss_minify'])){

            $options['uucss_minify'] = ($_REQUEST['uucss_minify'] == 'true' ? "1" : null);

        }

        if(isset($_REQUEST['uucss_enable_cpcss'])){

            $options['uucss_enable_cpcss'] = ($_REQUEST['uucss_enable_cpcss'] == 'true' ? "1" : null);

            if(isset($_REQUEST['uucss_enable_cpcss_mobile'])){

                $options['uucss_enable_cpcss_mobile'] = ($_REQUEST['uucss_enable_cpcss_mobile'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_additional_css'])){

                $options['uucss_additional_css'] = $_REQUEST['uucss_additional_css'];

            }

        }

        if(isset($_REQUEST['uucss_enable_uucss'])){

            $options['uucss_enable_uucss'] = ($_REQUEST['uucss_enable_uucss'] == 'true' ? "1" : null);

            if(isset($_REQUEST['uucss_variables'])){

                $options['uucss_variables'] = ($_REQUEST['uucss_variables'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_keyframes'])){

                $options['uucss_keyframes'] = ($_REQUEST['uucss_keyframes'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_fontface'])){

                $options['uucss_fontface'] = ($_REQUEST['uucss_fontface'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_include_inline_css'])){

                $options['uucss_include_inline_css'] = ($_REQUEST['uucss_include_inline_css'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_cache_busting_v2'])){

                $options['uucss_cache_busting_v2'] = ($_REQUEST['uucss_cache_busting_v2'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_inline_css'])){

                $options['uucss_inline_css'] = ($_REQUEST['uucss_inline_css'] == 'true' ? "1" : null);

            }

            if(isset($_REQUEST['uucss_excluded_files'])){

                $value = explode("\r\n", $_REQUEST['uucss_excluded_files']);

                $value = array_filter($value, function ($v){
                    return !empty($v);
                });

                $value = implode(",",array_values($value));

                $options['uucss_excluded_files'] = $value;

            }

            if(isset($_REQUEST['uucss_safelist'])){

                $value = explode("\r\n", $_REQUEST['uucss_safelist']);

                $value = array_filter($value, function ($v){
                    return !empty($v);
                });

                $value = array_map(function ($v){
                    return (object)[
                        'type' => 'greedy',
                        'rule' => $v
                    ];
                }, array_values($value));

                $options['uucss_safelist'] = json_encode($value);

            }

            if(isset($_REQUEST['uucss_blocklist'])){

                $value = explode("\r\n", $_REQUEST['uucss_blocklist']);

                $value = array_filter($value, function ($v){
                   return !empty($v);
                });

                $options['uucss_blocklist'] = json_encode(array_values($value));

            }

            if(isset($_REQUEST['whitelist_packs'])){

                $options['whitelist_packs'] = $_REQUEST['whitelist_packs'];

            }


        }

        if(isset($_REQUEST['uucss_enable_rules'])){

            $options['uucss_enable_rules'] = ($_REQUEST['uucss_enable_rules'] == 'true' ? "1" : null);

        }

        if(isset($_REQUEST['uucss_load_original'])){

            $options['uucss_load_original'] = ($_REQUEST['uucss_load_original'] == 'true' ? "1" : null);

        }


        // update js options

        if(isset($_REQUEST['uucss_load_js_method'])){

            $options['uucss_load_js_method'] = $_REQUEST['uucss_load_js_method'];

        }

        if(isset($_REQUEST['defer_inline_js'])){

            $options['defer_inline_js'] = ($_REQUEST['defer_inline_js'] == 'true' ? "1" : null);

        }

        if(isset($_REQUEST['minify_js'])){

            $options['minify_js'] = ($_REQUEST['minify_js'] == 'true' ? "1" : null);

        }

        if(isset($_REQUEST['uucss_excluded_js_files'])){

            $options['uucss_excluded_js_files'] = $_REQUEST['uucss_excluded_js_files'];

        }

        RapidLoad_Base::update_option('autoptimize_uucss_settings',$options);

        wp_send_json_success(true);
    }

    public function list_module(){
        wp_send_json_success(RapidLoad_Base::get()->modules()->active_modules());
    }

    public function activate_module(){

        RapidLoad_Base::get()->modules()->activate_module();

    }

    public function attach_rule(){

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : false;
        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;
        $rule_id = isset($_REQUEST['rule_id']) ? $_REQUEST['rule_id'] : false;

        if(!$type || !$url){
            wp_send_json_error('Required field missing');
        }

        if($type == 'detach'){

            $path = new RapidLoad_Job([
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

            $rule = RapidLoad_Job::find_or_fail($rule_id);

            if(!$rule){
                wp_send_json_error('Rule not found');
            }

            $path = new RapidLoad_Job([
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

    public function clear_rapidload_logs(){
        $file_system = new RapidLoad_FileSystem();

        if(!$file_system->exists(WP_CONTENT_DIR . '/uploads/rapidload/')){
            wp_send_json_success(true);
        }

        $file_system->delete_folder(WP_CONTENT_DIR . '/uploads/rapidload/');
        wp_send_json_success(true);
    }

    public function rapidload_logs(){

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

    public function clear_page_cache(){

        $url = isset($_REQUEST['url']) ? $_REQUEST['url'] : false;
        $rule = isset($_REQUEST['rule']) ? $_REQUEST['rule'] : false;
        $regex = isset($_REQUEST['regex']) ? $_REQUEST['regex'] : false;

        $status = isset($_REQUEST['status']) ? $_REQUEST['status'] : false;

        $type = isset($_REQUEST['type']) ? $_REQUEST['status'] : 'path';

        if($url){

            RapidLoad_DB::resetHits($url);
            do_action( 'uucss/cached', [
                'url' => $url
            ] );
        }

        $links = false;

        if($rule && $regex){

            $rule_object = new RapidLoad_Job([
                'rule' => $rule,
                'regex' => $regex
            ]);

            if(isset($rule_object->id)){

                RapidLoad_DB::resetRuleHits($rule_object->id);
                $links = $rule_object->get_urls();
                array_push($links, $rule_object->url);

            }
        }

        if($status == 'warnings'){

            RapidLoad_DB::resetWarningHits();
            $links = RapidLoad_DB::getUrlsWithWarnings();

        }

        if($links && !empty($links)){

            foreach ($links as $link){
                do_action( 'uucss/cached', [
                    'url' => $link
                ] );
            }
        }

        wp_send_json_success('page cache cleared');
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


    public function validate_domain() {

        if ( get_current_screen() && get_current_screen()->base != 'settings_page_uucss' ) {
            return;
        }

        $options   = RapidLoad_Base::get_option( 'autoptimize_uucss_settings' );

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
            RapidLoad_Base::update_option('autoptimize_uucss_settings', $options);
            return;
        }

        if(!isset($options['valid_domain']) || !$options['valid_domain']){
            $options['valid_domain'] = true;
            RapidLoad_Base::update_option('autoptimize_uucss_settings', $options);
        }
    }

    public function ajax_deactivate() {

        $options = RapidLoad_Base::get_option( 'autoptimize_uucss_settings' );

        $cache_key = 'pand-' . md5( 'first-uucss-job' );
        RapidLoad_Base::delete_option( $cache_key );

        do_action('rapidload/vanish');

        $api = new RapidLoad_Api();

        // remove domain from authorized list
        $api->post( 'deactivate', [
            'url' => site_url()
        ] );

        unset( $options['uucss_api_key_verified'] );
        unset( $options['uucss_api_key'] );
        unset( $options['whitelist_packs'] );

        RapidLoad_Base::update_option( 'autoptimize_uucss_settings', $options );

        wp_send_json_success( true );
    }

    function rapidload_rule_types($rules){

        $custom_posts = get_post_types(
            array(
                'public'   => true,
                '_builtin' => false,
            ),
            'names',
            'and'
        );

        $taxonomies = get_taxonomies([
            'public' => true
        ]);

        $rules[] = [
            'name' => 'front_page',
            'rule' => 'is_front_page',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_front_page();
            },
        ];

        $rules[] = [
            'name' => '404',
            'rule' => 'is_404',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_404();
            },
        ];

        $rules[] = [
            'name' => 'archive',
            'rule' => 'is_archive',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_archive();
            },
        ];

        foreach ($custom_posts as $key => $value){
            if($value == 'page' || $value == 'post' || $value == 'product'){
                continue;
            }
            if(( $key = array_search($value, array_column($rules, 'name')) ) === false){

                $rules[] = [
                    'name' => $value,
                    'rule' => 'is_' . $value,
                    'category' => 'Custom Post Types',
                    'priority' => 5,
                    'callback' => function() use($value){
                        return get_post_type( get_the_ID() ) == $value;
                    }
                ];
            }
        }

        foreach ($taxonomies as $key => $value){
            if(( $key = array_search($value, array_column($rules, 'name')) ) === false){

                $rules[] = [
                    'name' => $value,
                    'rule' => 'is_' . $value,
                    'category' => 'Taxonomies',
                    'priority' => 5,
                    'callback' => function() use($value){
                        return is_tax($value);
                    },
                ];
            }
        }

        $rules[] = [
            'name' => 'author',
            'rule' => 'is_author',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_author();
            },
        ];

        $rules[] = [
            'name' => 'home',
            'rule' => 'is_home',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_home();
            },
        ];

        $rules[] = [
            'name' => 'page',
            'rule' => 'is_page',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_page();
            },
        ];

        $rules[] = [
            'name' => 'post',
            'rule' => 'is_post',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_singular();
            },
        ];

        $rules[] = [
            'name' => 'search',
            'rule' => 'is_search',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_search();
            },
        ];

        $rules[] = [
            'name' => 'attachment',
            'rule' => 'is_attachment',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_attachment();
            },
        ];

        $rules[] = [
            'name' => 'single',
            'rule' => 'is_single',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_single();
            },
        ];

        $rules[] = [
            'name' => 'sticky',
            'rule' => 'is_sticky',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_sticky();
            },
        ];

        $rules[] = [
            'name' => 'paged',
            'rule' => 'is_paged',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return is_paged();
            },
        ];

        $rules[] = [
            'name' => 'path',
            'rule' => 'is_path',
            'category' => 'Standard Conditional Tags',
            'priority' => 10,
            'callback' => function(){
                return true;
            },
        ];

        return $rules;
    }


    public function clear_cache_on_option_update( $option, $old_value, $value ) {

        if ( $option == 'autoptimize_uucss_settings' ) {

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
            if ( isset( $diffs['uucss_keyframes'] ) ||
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
                RapidLoad_DB::detach_all_rules();
            }

            if ( $needs_to_cleared ) {

                /*$this->uucss->clear_cache( null, [
                    'soft' => true
                ] );*/
            }

            RapidLoad_Base::fetch_options(false);
        }

    }

    public function uucss_license() {

        $api = new RapidLoad_Api();

        $data = $api->get( 'license', [
            'url' => $this->transform_url(get_site_url()),
            'version' => UUCSS_VERSION,
            'db_version' => RapidLoad_DB::$db_version,
            'db_version_exist' => RapidLoad_DB::$current_version
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

    public function frontend_logs(){

        $args = [];

        $args['type'] = isset($_REQUEST['type']) && !empty($_REQUEST['type']) ? $_REQUEST['type'] : 'frontend';
        $args['log'] = isset($_REQUEST['log']) && !empty($_REQUEST['log']) ? $_REQUEST['log'] : '';
        $args['url'] = isset($_REQUEST['url']) && !empty($_REQUEST['url']) ? $_REQUEST['url'] : '';

        self::log($args);

        wp_send_json_success(true);
    }

    public function inject_cloudflare_settings($data){

        $options = RapidLoad_Base::fetch_options();

        if(isset($options['cf_bot_toggle_mode']) && $options['cf_bot_toggle_mode'] == "1"){

            if(isset($options['cf_email']) && isset($options['cf_token']) && isset($options['cf_zone_id'])){
                $data['cloudflare'] = [
                    'auth_email' => $options['cf_email'],
                    'zone_id' => $options['cf_zone_id'],
                    'token' => $options['cf_token'],
                ];
            }

        }

        return $data;

    }

    public function update_cloudflare_settings( $option, $old_value, $value ){

        if ( $option != 'autoptimize_uucss_settings' ) {
            return;
        }

        if(isset($value['cf_token']) && isset($value['cf_email']) && isset($value['cf_zone_id'])){

            wp_remote_request('https://api.cloudflare.com/client/v4/zones/'. $value['cf_zone_id'] .'/settings/development_mode',[
                'method'     => 'PATCH',
                'headers' => [
                    'X-Auth-Email' => $value['cf_email'],
                    'Authorization' => 'Bearer ' . $value['cf_token'],
                    'Content-Type' => 'application/json'
                ],
                'body' => json_encode((object)[
                    'value' => isset($value['cf_is_dev_mode']) && $value['cf_is_dev_mode'] == "1" ? 'on' : 'off'
                ])
            ]);

        }

    }

    public function render_cloudflare_settings(){

        if(apply_filters('rapidload/cloudflare/bot-fight-mode/disable', true)){
            return;
        }

        $options = RapidLoad_Base::fetch_options();

        ?>

        <li>
            <h2>
                Cloudflare Settings
                <span class="uucss-toggle-section rotate">
                    <span class="dashicons dashicons-arrow-up-alt2"></span>
                </span>
            </h2>
            <div class="content" style="display: none; ">
                <table class="cf-table">
                    <tr>
                        <td>
                            <label for="cloudflare-dev-mode">Enable Bot toggle mode</label>
                        </td>
                        <td>
                            <input type="checkbox" name="autoptimize_uucss_settings[cf_bot_toggle_mode]" id="cf_bot_toggle_mode" value="1" <?php if(isset($options['cf_bot_toggle_mode']) && $options['cf_bot_toggle_mode'] == "1") : echo 'checked'; endif; ?>>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 150px">
                            <label for="cloudflare-api-key">Api Token</label>
                        </td>
                        <td>
                            <input type="text" name='autoptimize_uucss_settings[cf_token]' id="cf_token" style="width: 450px" value="<?php if(isset($options['cf_token'])) : echo $options['cf_token']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-account-email" >Account Email</label>
                        </td>
                        <td>
                            <input type="text" name="autoptimize_uucss_settings[cf_email]" id="cf_email" style="width: 350px" value="<?php if(isset($options['cf_email'])) : echo $options['cf_email']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-zone-id">Zone ID</label>
                        </td>
                        <td>
                            <input type="text" name="autoptimize_uucss_settings[cf_zone_id]" id="cf_zone_id" style="width: 350px" value="<?php if(isset($options['cf_zone_id'])) : echo $options['cf_zone_id']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-dev-mode">Development Mode</label>
                        </td>
                        <td>
                            <input type="checkbox" name="autoptimize_uucss_settings[cf_is_dev_mode]" id="cf_is_dev_mode" value="1" <?php if(isset($options['cf_is_dev_mode']) && $options['cf_is_dev_mode'] == "1") : echo 'checked'; endif; ?>>
                        </td>
                    </tr>
                </table>
            </div>
        </li>

        <?php
    }

    public function get_robots_text(){

        $robotsUrl = trailingslashit(get_site_url()) . "robots.txt";

        $robot = new stdClass();
        $robot->disAllow = [];
        $robot->allow = [];

        try {

            $fh = wp_remote_get($robotsUrl);

            if(!is_wp_error($fh) && isset($fh['body'])){

                foreach(preg_split("/((\r?\n)|(\r\n?))/", $fh['body']) as $line){

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

            }

            wp_send_json_success($robot);

        }catch (Exception $ex){

            wp_send_json_error();
        }

    }

    function add_sitemap_to_jobs($url = false){

        if(!$url){

            $url = apply_filters('uucss/sitemap/default', stripslashes(get_site_url(get_current_blog_id())) . '/sitemap_index.xml');
        }

        $site_map = new RapidLoad_Sitemap();
        $urls = $site_map->process_site_map($url);

        if(isset($urls) && !empty($urls)){

            foreach ($urls as $value){

                $_url = $this->transform_url($value);

                if($this->is_url_allowed($_url)){

                    $job = new RapidLoad_Job([
                       'url' => $_url
                    ]);
                    $job->save(true);
                }

            }
        }
    }



}
<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin
{
    use RapidLoad_Utils;

    public function __construct()
    {
        if(is_admin()){

            add_action('uucss/rule/saved', [$this, 'update_rule'], 10, 2);
            add_action('wp_ajax_rapidload_purge_all', [$this, 'rapidload_purge_all']);
            add_action('wp_ajax_get_robots_text', [$this, 'get_robots_text']);
            add_action('wp_ajax_get_all_rules', [$this, 'get_all_rules']);
            add_action('wp_ajax_upload_rules', [$this, 'upload_rules']);
            add_action('updated_option', [$this, 'update_cloudflare_settings'], 10, 3 );
            add_action('uucss/options/after_settings_section',[$this, 'render_cloudflare_settings']);

        }

        add_action( 'add_sitemap_to_jobs', [$this, 'add_sitemap_to_jobs'], 10, 1);
        add_filter('uucss/api/options', [$this, 'inject_cloudflare_settings'], 10 , 1);
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

    public function upload_rules(){

        self::verify_nonce();

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

        self::verify_nonce();

        wp_send_json_success(RapidLoad_Job::all());

    }

    public function get_robots_text(){

        self::verify_nonce();

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

    public function rapidload_purge_all(){

        self::verify_nonce();

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

}
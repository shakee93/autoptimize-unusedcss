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
            add_action('wp_ajax_update_cloudflare_settings', [$this, 'update_cloudflare_settings']);
            add_action('uucss/options/after_settings_section',[$this, 'render_cloudflare_settings']);

        }

        add_action( 'add_sitemap_to_jobs', [$this, 'add_sitemap_to_jobs'], 10, 1);
        add_filter('uucss/api/options', [$this, 'inject_cloudflare_settings'], 10 , 1);
    }

    public function inject_cloudflare_settings($data){

        $options = RapidLoad_Base::fetch_options();

        if(isset($options['cf_email']) && isset($options['cf_token']) && isset($options['cf_zone_id'])){
            $data['cloudflare'] = [
              'auth_email' => $options['cf_email'],
              'zone_id' => $options['cf_zone_id'],
              'token' => $options['cf_token'],
            ];
        }

        return $data;

    }

    public function update_cloudflare_settings(){

        if(!isset($_REQUEST['token']) || !isset($_REQUEST['email']) || !isset($_REQUEST['zone_id']) ||
            empty($_REQUEST['token']) || empty($_REQUEST['email']) || empty($_REQUEST['zone_id'])){

            wp_send_json_error([
                'message' => 'required field missing'
            ]);

        }

        if(strlen($_REQUEST['token']) != 37 && strlen($_REQUEST['token']) != 40){

            wp_send_json_error([
                'message' => 'invalid token'
            ]);
        }

        $options = RapidLoad_Base::fetch_options();

        $options['cf_email'] = $_REQUEST['email'];
        $options['cf_token'] = $_REQUEST['token'];
        $options['cf_zone_id'] = $_REQUEST['zone_id'];
        $options['cf_is_dev_mode'] = isset($_REQUEST['is_dev_mode']) && $_REQUEST['is_dev_mode'] == "1" ? $_REQUEST['is_dev_mode'] : null;

        $uucss_api = new RapidLoad_Api();

        $response = $uucss_api->post('cloudflare-credentials',[
            'email' => $options['cf_email'],
            'token' => $options['cf_token'],
            'zone_id' => $options['cf_zone_id'],
            'is_dev_mode' => $options['cf_is_dev_mode'],
        ]);

        if($uucss_api->is_error($response)){
            wp_send_json_error($uucss_api->extract_error($response));
        }

        wp_remote_request('https://api.cloudflare.com/client/v4/zones/'. $options['cf_zone_id'] .'/settings/development_mode',[
            'method'     => 'PATCH',
            'headers' => [
                'X-Auth-Email' => $options['cf_email'],
                'Authorization' => 'Bearer ' . $options['cf_token'],
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode((object)[
                'value' => $options['cf_is_dev_mode'] ? 'on' : 'off'
            ])
        ]);

        RapidLoad_Base::update_option('autoptimize_uucss_settings',$options);

        wp_send_json_success(true);
    }

    public function render_cloudflare_settings(){

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
                        <td style="width: 150px">
                            <label for="cloudflare-api-key">Api Token</label>
                        </td>
                        <td>
                            <input type="text" name="cloudflare-api-key" id="cloudflare-api-key" style="width: 450px" value="<?php if(isset($options['cf_token'])) : echo $options['cf_token']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-account-email" >Account Email</label>
                        </td>
                        <td>
                            <input type="text" name="cloudflare-account-email" id="cloudflare-account-email" style="width: 350px" value="<?php if(isset($options['cf_email'])) : echo $options['cf_email']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-zone-id">Zone ID</label>
                        </td>
                        <td>
                            <input type="text" name="cloudflare-zone-id" id="cloudflare-zone-id" style="width: 350px" value="<?php if(isset($options['cf_zone_id'])) : echo $options['cf_zone_id']; endif; ?>">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="cloudflare-dev-mode">Development Mode</label>
                        </td>
                        <td>
                            <input type="checkbox" name="cloudflare-dev-mode" id="cloudflare-dev-mode" value="1" <?php if(isset($options['cf_is_dev_mode']) && $options['cf_is_dev_mode'] == "1") : echo 'checked'; endif; ?>>
                        </td>
                    </tr>
                </table>
                <div>
                    <input class="button button-primary" type="button" value="Update" id="cloudflare-settings-update">
                </div>
            </div>
        </li>

        <?php
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
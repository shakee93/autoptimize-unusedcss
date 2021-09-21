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

        }

        add_action( 'add_sitemap_to_jobs', [$this, 'add_sitemap_to_jobs'], 10, 1);
    }

    public function upload_rules(){

        if(!isset($_REQUEST['rules'])){
            wp_send_json_error('rules required');
        }

        error_log(stripslashes($_REQUEST['rules']));

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

        if($old && isset($old['rule']) && isset($old['regex'])){

            $job = new RapidLoad_Job([
                'rule' => $old['rule'],
                'regex' => $old['regex'],
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
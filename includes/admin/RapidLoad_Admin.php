<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Admin
{
    public function __construct()
    {
        if(is_admin()){

            add_action('uucss/rule/saved', [$this, 'handle_uucss_rule'], 10, 2);
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

    }

    public function handle_uucss_rule($args, $old){

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
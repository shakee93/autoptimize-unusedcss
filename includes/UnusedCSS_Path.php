<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Path extends UnusedCSS_Job {

    use UnusedCSS_Utils;

    public $rule_id;

    public function init($args){

        global $wpdb;

        $this->type = 'Path';

        $rule = isset($args['rule']) ? $args['rule'] : get_post_type( get_the_ID() );
        $url = isset($args['url']) ? $args['url'] : null;

        $path_exist = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'", OBJECT);

        if(isset($path_exist) && !empty($path_exist)){

            $this->id = $path_exist[0]->id;
            $this->url = $path_exist[0]->url;
            $this->rule = isset($path_exist[0]->rule) ? $path_exist[0]->rule : null;
            $this->job_id = $path_exist[0]->job_id;
            $this->stats = $path_exist[0]->stats;
            $this->files = $path_exist[0]->files;
            $this->warnings = $path_exist[0]->warnings;
            $this->review = $path_exist[0]->review;
            $this->error = $path_exist[0]->error;
            $this->attempts = isset($path_exist[0]->attempts) ? $path_exist[0]->attempts : 0;
            $this->hits = isset($path_exist[0]->hits) ? $path_exist[0]->hits : 0;
            $this->rule_id = isset($path_exist[0]->rule_id) ? $path_exist[0]->rule_id : 0;
            $this->status = $path_exist[0]->status;
            $this->created_at = $path_exist[0]->created_at;

        }else{

            $this->url = $url;
            $this->rule = $rule;
            $this->status = isset($args['status']) ? $args['status'] : 'queued';
            $this->rule_id = isset($args['rule_id']) ? $args['rule_id'] : null;
            $this->attempts = 0;
            $this->hits = 0;
            $this->created_at = date( "Y-m-d H:m:s", time() );

            $data = (array) $this;

            if(UnusedCSS_DB::$current_version < 1.2){
                unset($data['rule']);
                unset($data['hits']);
                unset($data['rule_id']);
            }

            unset($data['type']);

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_uucss_job',
                $data
            );

            $id = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $this->url . "'");

            if(isset($id) && !empty($id)){

                $this->id = $id;
            }
        }
    }

    public function save(){

        if(isset($this->id)){

            global $wpdb;

            $data = (array) $this;

            $id = $data['id'];

            unset($data['id']);
            unset($data['type']);

            if(UnusedCSS_DB::$current_version < 1.2){
                unset($data['rule']);
                unset($data['hits']);
                unset($data['rule_id']);
            }

            $wpdb->update(
                $wpdb->prefix . 'rapidload_uucss_job',
                $data,
                [
                    'id' => $id
                ]
            );

        }
    }

    public function attach_rule($rule_id = false ){
        if(!$rule_id){
            $this->rule_id = NULL;
            $this->status = 'queued';
        }else{
            $this->rule_id = $rule_id;
            $this->status = 'rule-based';
        }
    }
}
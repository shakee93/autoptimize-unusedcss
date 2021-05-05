<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_Path extends UnusedCSS_Job {

    use UnusedCSS_Utils;

    public function init($args){

        global $wpdb;

        self::$table = $wpdb->prefix . 'rapidload_uucss_job';

        $rule = isset($args['rule']) ? $args['rule'] : null;
        $url = isset($args['url']) ? $this->transform_url($args['url']) : null;

        $path_exist = $wpdb->get_results("SELECT * FROM ". self::$table ." WHERE url = '" . $url . "'", OBJECT);

        if(isset($path_exist) && !empty($path_exist)){

            $this->id = $path_exist[0]->id;
            $this->url = $path_exist[0]->url;
            $this->rule = $path_exist[0]->rule;
            $this->job_id = $path_exist[0]->job_id;
            $this->stats = $path_exist[0]->stats;
            $this->files = $path_exist[0]->files;
            $this->warnings = $path_exist[0]->warnings;
            $this->review = $path_exist[0]->review;
            $this->error = $path_exist[0]->error;
            $this->attempts = $path_exist[0]->attempts;
            $this->hits = $path_exist[0]->hits;
            $this->ignore_rule = $path_exist[0]->ignore_rule;
            $this->status = $path_exist[0]->status;
            $this->created_at = $path_exist[0]->created_at;

        }else{

            $this->url = $url;
            $this->rule = $rule;
            $this->status = isset($args['status']) ? $args['status'] : 'queued';
            $this->attempts = 0;
            $this->hits = 0;
            $this->ignore_rule = 0;
            $this->created_at = date( "Y-m-d H:m:s", time() );

            $data = (array) $this;

            $wpdb->insert(
                self::$table,
                $data
            );

            $id = $wpdb->get_var("SELECT id FROM ". self::$table . " WHERE url = '" . $this->url . "'");

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

            $wpdb->update(
                self::$table,
                $data,
                [
                    'id' => $id
                ]
            );

        }
    }
}
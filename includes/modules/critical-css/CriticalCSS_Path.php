<?php

namespace RapidLoad\Service;

class CriticalCSS_Path extends CriticalCSS_Job {

    public $rule_id;
    public $rule_note;

    public function init($args)
    {
        global $wpdb;

        $this->type = 'Path';

        $rule = isset($args['rule']) ? $args['rule'] : null;
        $url = isset($args['url']) ? $args['url'] : null;

        $path_exist = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_cpcss_job WHERE url = '" . $url . "'", OBJECT);

        if(isset($path_exist) && !empty($path_exist)){

            $this->id = $path_exist[0]->id;
            $this->url = $path_exist[0]->url;
            $this->rule = isset($path_exist[0]->rule) ? $path_exist[0]->rule : null;
            $this->job_id = $path_exist[0]->job_id;
            $this->critical_css = $path_exist[0]->critical_css;
            $this->exceptional_css = $path_exist[0]->exceptional_css;
            $this->warnings = isset($path_exist[0]->warnings) ? unserialize($path_exist[0]->warnings) : null;
            $this->error = $path_exist[0]->error;
            $this->attempts = isset($path_exist[0]->attempts) ? $path_exist[0]->attempts : 0;
            $this->hits = isset($path_exist[0]->hits) ? $path_exist[0]->hits : 0;
            $this->rule_id = isset($path_exist[0]->rule_id) ? $path_exist[0]->rule_id : null;
            $this->rule_note = isset($path_exist[0]->rule_note) ? $path_exist[0]->rule_note : null;
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

            unset($data['type']);

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_cpcss_job',
                $data
            );

            $id = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}rapidload_cpcss_job WHERE url = '" . $this->url . "'");

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

            if(isset($data['warnings'])){
                $data['warnings'] = serialize($data['warnings']);
            }

            $wpdb->update(
                $wpdb->prefix . 'rapidload_cpcss_job',
                $data,
                [
                    'id' => $id
                ]
            );

        }
    }
}
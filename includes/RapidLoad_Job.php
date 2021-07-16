<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Job{

    use RapidLoad_Utils;

    public $id;
    public $url;
    public $rule;
    public $regex;
    public $status;
    public $rule_id = null;
    public $rule_note;
    public $created_at;

    public $parent;

    public function __construct($args = [])
    {

        if(isset($args['url'])){
            $this->url = $args['url'];
        }

        if(isset($args['rule']) && isset($args['regex'])){
            $this->rule = $args['rule'];
            $this->regex = $args['regex'];
        }else{
            $this->rule = 'is_url';
            $this->regex = '/';
        }

        if(isset($args['status'])){
            $this->status = $args['status'];
        }else{
            $this->status = 'processing';
        }

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->url = $exist->url;
            $this->rule = $exist->rule;
            $this->regex = $exist->regex;
            $this->status = $exist->status;
            $this->rule_id = $exist->rule_id;
            $this->rule_note = $exist->rule_note;
            $this->created_at = $exist->created_at;

            if(isset($this->rule_id)){
                $this->parent = RapidLoad_Job::find_or_fail($this->rule_id);
            }

        }else{

            $this->created_at = date( "Y-m-d H:m:s", time() );
        }

    }

    public function exist(){
        global $wpdb;

        return $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE url = '" . $this->url . "'", OBJECT);
    }

    public function save(){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);
        unset($data['parent']);

        if($this->exist()){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_job',
                $data,
                [
                    'id' => $this->id
                ]
            );

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_job',
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

            }

        }

    }

    static function find_or_fail($id){

        global $wpdb;

        $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE id = '" . $id . "'", OBJECT);

        if(!$exist){
            return null;
        }

        return new RapidLoad_Job([
            'url' => $exist->url
        ]);

    }

    static function find_by_url($url, $include_failed = false){

        global $wpdb;

        $exist = false;

        if(!$include_failed){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' AND status IN('cached','rule-based')", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' ", OBJECT);
        }

        if(!$exist){
            return null;
        }

        return new RapidLoad_Job([
            'url' => $exist->url
        ]);

    }

    static function create($args){
        (new RapidLoad_Job($args))->save();
    }
}
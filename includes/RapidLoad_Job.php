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

            if(isset($this->rule_id) && $this->rule_id != $this->id && $this->rule == 'is_url'){
                $this->parent = RapidLoad_Job::find_or_fail($this->rule_id);
            }

        }else{

            $this->created_at = date( "Y-m-d H:m:s", time() );
        }

    }

    public function exist($id = false){
        global $wpdb;

        $exist = null;

        if(!$id && isset($this->id)){
            $id = $this->id;
        }

        if($id){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE id = " . $id, OBJECT);
        }
        else if($this->rule == 'is_url'){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE url = '" . $this->url . "' LIMIT 1", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = '" . $this->rule . "' AND regex = '" . $this->regex . "' LIMIT 1", OBJECT);
        }

        return $exist;
    }

    public function save($notify = false){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);
        unset($data['parent']);

        if(isset($this->id)){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_job',
                $data,
                [
                    'id' => $this->id
                ]
            );

            if($notify){
                do_action('rapidload/job/updated', $this, false);
            }

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_job',
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

                if($notify){
                    do_action('rapidload/job/updated', $this, true);
                }
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
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' AND status IN('cached','rule-based') LIMIT 1", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' LIMIT 1", OBJECT);
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

    static function all(){

        return RapidLoad_DB::get_rules_where();

    }

    function delete(){

        global $wpdb;

        $query = $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id = " . $this->id);
        $query = $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_job WHERE id = " . $this->id);

    }

    function get_urls(){

        if($this->rule == "is_url"){
            return [];
        }

        global $wpdb;

        $data = $wpdb->get_results("SELECT url FROM {$wpdb->prefix}rapidload_job WHERE rule_id = " . $this->id . " AND rule = 'is_url'" , ARRAY_A);

        if(!empty($data))
        {
            return array_column($data, 'url');
        }

        return [];
    }

    function attach_rule($rule_id = false , $rule = null){
        if(!$rule_id){
            $this->rule_id = NULL;
            $this->rule = 'is_url';
            $this->regex = '/';
            $this->rule_note = 'detached';
            $this->status = 'queued';
        }else{
            $this->rule_id = $rule_id;
            $this->rule_note = NULL;
            $this->status = 'rule-based';
        }

    }
}
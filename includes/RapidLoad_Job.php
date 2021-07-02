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
    public $created_at;

    public function __construct($args = [])
    {

        if(isset($args['url'])){
            $this->url = $args['url'];
        }

        if(isset($args['rule'])){
            $this->rule = $args['rule'];
        }else{
            $this->rule = 'is_url';
        }

        if(isset($args['regex'])){
            $this->regex = $args['regex'];
        }else{
            $this->regex = '/';
        }

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->url = $exist->url;
            $this->rule = $exist->rule;
            $this->regex = $exist->regex;
            $this->status = $exist->status;
            $this->rule_id = $exist->rule_id;
            $this->created_at = $exist->created_at;

        }else{

            $this->created_at = date( "Y-m-d H:m:s", time() );
        }

    }

    public function exist(){
        global $wpdb;

        $exist = false;

        if($this->rule == 'is_url'){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE url = '" . $this->url . "'", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = '" . $this->rule . "' AND regex = '" . $this->regex . "'", OBJECT);
        }

        return $exist;
    }

    public function save(){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);

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

}
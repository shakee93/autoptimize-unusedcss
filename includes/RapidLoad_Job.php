<?php

defined( 'ABSPATH' ) or die();

class RapidLoad_Job{

    use RapidLoad_Utils;

    public $type;

    public $id;
    public $url;
    public $rule;
    public $regex;
    public $rule_id = null;
    public $created_at;

    public function __construct($args = [], $type = 'path')
    {
        $this->type = $type;

        if(isset($args['url'])){
            $this->url = $args['url'];
        }

        if(isset($args['rule'])){
            $this->rule = $args['rule'];
        }

        if(isset($args['regex'])){
            $this->regex = $args['regex'];
        }

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->created_at = $exist->created_at;

            if($this->is_type('rule')){
                $this->url = $exist->url;
            }else{
                $this->rule_id = $exist->rule_id;
            }

        }else{

            $this->created_at = date( "Y-m-d H:m:s", time() );
        }

    }

    public function is_type($type = 'path'){
        return $this->type == $type;
    }

    public function exist(){
        global $wpdb;

        $exist = false;

        if($this->is_type()){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_{$this->type} WHERE url = '" . $this->url . "'", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_{$this->type} WHERE rule = '" . $this->rule . "' AND regex = '" . $this->regex . "'", OBJECT);
        }

        return $exist;
    }

    public function save(){

        global $wpdb;
        $data = (array) $this;

        unset($data['type']);
        unset($data['id']);

        if($this->is_type()){
            unset($data['regex']);
        }else{
            unset($data['rule_id']);
        }

        if($this->exist()){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_' . $this->type,
                $data,
                [
                    'id' => $this->id
                ]
            );

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_' . $this->type,
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

            }

        }



    }



}
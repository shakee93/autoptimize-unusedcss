<?php

defined( 'ABSPATH' ) or die();

class CriticalCSS_DB extends RapidLoad_DB{

    static function clear_data($soft = false){

        global $wpdb;

        if($soft){
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'queued', job_id = NULL, data = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE job_type='cpcss'");
        }else{
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type='cpcss'");
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function data_used_elsewhere( $id , $data){

        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE data = '" . $data . "' AND id !=" . $id);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $count;
    }

    static function requeue_where($where = ''){

        global $wpdb;

        if(empty($where)){
            $where = " WHERE job_type='cpcss' ";
        }else{
            $where .= " AND job_type='cpcss' ";
        }

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'queued', job_id = NULL, queue_job_id = NULL, data = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

    }
}
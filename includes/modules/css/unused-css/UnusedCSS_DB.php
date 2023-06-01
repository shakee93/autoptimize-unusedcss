<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_DB extends RapidLoad_DB{

    static function requeue_where($where = ''){

        global $wpdb;

        if(empty($where)){
            $where = " WHERE job_type='uucss' ";
        }else{
            $where .= " AND job_type='uucss' ";
        }

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'queued', queue_job_id = NULL, data = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

    }

    static function clear_data($soft = false){

        global $wpdb;

        if($soft){
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'queued', queue_job_id = NULL, data = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE job_type='uucss'");
        }else{
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type='uucss'");
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function get_data_where($where = '')
    {
        global $wpdb;

        if(empty($where)){
            $where = " WHERE job_type='uucss' ";
        }else{
            $where .= " AND job_type='uucss' ";
        }

        $data = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}rapidload_job_data {$where} ", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $data;
    }

    static function get_data($select = ' * ' , $where = '', $limit = 1, $order_by = 'id DESC')
    {
        global $wpdb;

        if(empty($where)){
            $where = " WHERE job_type='uucss' ";
        }else{
            $where .= " AND job_type='uucss' ";
        }

        $data = $wpdb->get_results( "SELECT {$select} FROM {$wpdb->prefix}rapidload_job_data {$where} ORDER BY {$order_by} LIMIT " . round($limit, 0), OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $data;
    }

    static function get_task_count($where = ''){

        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data {$where} ");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return (int)$count;
    }

    static function delete_by_job_id($id){

        if(!$id){
            return;
        }

        global $wpdb;

        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type='uucss' AND job_id = " . $id);

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function get_used_files_exclude($id){

        if(!$id){
            return [];
        }

        $used_files = [];

        global $wpdb;

        $result = $wpdb->get_results( "SELECT data FROM {$wpdb->prefix}rapidload_job_data WHERE job_type='uucss' AND status = 'success' AND job_id != " . $id, ARRAY_A);

        if(!empty($error)){
            self::show_db_error($error);
        }

        $used = [];

        foreach ($result as $res){

            if(isset($res) && !empty($res)){

                if(is_array($res)){
                    $used = $res;
                }elseif (gettype($res) == 'string'){
                    $used = unserialize($res);
                }

            }

            if(is_array($used)){
                $used_files = array_merge($used_files, $used);
            }
        }

        if(!empty($used_files)){
            return array_unique(array_column($used_files, 'uucss'));
        }

        return $used_files;
    }

    static function get_original_file_name($path){

        $orinal_file_name = null;

        global $wpdb;

        $files_list = $wpdb->get_col("SELECT data FROM {$wpdb->prefix}rapidload_job_data WHERE data IS NOT NULL AND job_type = 'uucss'");

        foreach ($files_list as $value){

            $files = isset($value) ? unserialize($value) : [];

            foreach ($files as $file){

                if($file['uucss'] == basename($path)){
                    $orinal_file_name = $file['original'];
                    break;
                }

            }

        }

        return $orinal_file_name;
    }
}
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

}
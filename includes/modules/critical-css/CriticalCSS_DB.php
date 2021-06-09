<?php

namespace RapidLoad\Service;

class CriticalCSS_DB extends \RapidLoad_DB
{

    static function path_ccss_exist($url){

        global $wpdb;

        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_cpcss_job WHERE url = '" . $url . "' AND status IN('success','processing','waiting','rule-based')", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return isset($result) && !empty($result );
    }

    static function get_path_ccss_by_status($status, $limit = 1, $order_by = 'id DESC'){
        global $wpdb;

        $status = implode(",", $status);

        $status = str_replace('"', '', $status);

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_cpcss_job WHERE status IN(" . $status . ") ORDER BY {$order_by} LIMIT " . $limit, OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $links;
    }
}
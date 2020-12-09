<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_DB
{
    use UnusedCSS_Utils;

    static $db_version = "1.0";
    static $db_option = "rapidload_uucss_db_version";

    function __construct()
    {

    }

    static function check_db_updates(){

        if ( get_site_option( self::$db_option ) != self::$db_version ) {
            $notice = [
                'action'  => 'rapidload-db-update',
                'title'   => 'RapidLoad Power Up',
                'message' => 'Please update database',

                'main_action' => [
                    'key'   => 'Update Database',
                    'value' => '#'
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            add_action( "wp_ajax_rapidload_db_update", 'UnusedCSS_DB::update_db' );
        }
    }

    static function update_db(){
        if ( get_site_option( self::$db_option ) != self::$db_version ) {

            self::create_tables();

            if(!get_site_option(self::$db_option)){
                self::seed();
            }

            update_option( self::$db_option, self::$db_version );

            wp_send_json_success([
                'db_updated' => true
            ]);
        }
        wp_send_json_error(null);
    }

    static function seed(){
        $maps = get_option('uucss_map');
        foreach ($maps as $map){
            $data = array();
            if(isset($map['meta']['id'])) $data['job_id'] = $map['meta']['id'];
            $data['url'] = $map['url'];
            if(isset($map['meta']['stats'])) $data['stats'] = serialize($map['meta']['stats']);
            if(isset($map['files'])) $data['files'] = serialize($map['files']);
            if(isset($map['meta']['warnings'])) $data['warnings'] = serialize($map['meta']['warnings']);
            if(isset($map['meta']['review'])) $data['review'] = serialize($map['meta']['review']);
            if(isset($map['meta']['error'])) $data['error'] = serialize($map['meta']['error']);
            $data['status'] = $map['status'];
            $data['created_time'] = current_time('mysql');

            self::add_link($data);
        }
    }

    static function add_link($data){
        global $wpdb;

        $exist = self::get_link($data['url']);

        if($exist){

            self::update($data, array(
               'url' => $data['url']
            ));

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_uucss_job',
                $data
            );

        }

    }

    static function get_link($url){
        global $wpdb;
        $link = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'", OBJECT);
        if(!empty($link)){
	        return self::transform_link($link[0]);
        }else{
        	return null;
        }
    }

    static function migrated(){
        $option = get_option(self::$db_option);
        return isset($option) && !empty($option);
    }

    static function get_links(){
        global $wpdb;
        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job", OBJECT);
        $links = array_map(function ($link){
            return self::transform_link($link);
        }, $links);
        return $links;
    }

    static function get_links_exclude($url){
        global $wpdb;
        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url != '" . $url . "'", OBJECT);
        $links = array_map(function ($link){
            return self::transform_link($link);
        }, $links);
        return $links;
    }

    static function transform_link($link){

        if(empty($link)){
            return null;
        }

        $data = array();
        $data['files'] = isset($link->files) ? unserialize($link->files) : $data['files'] = null;
        $data['meta']['id'] = isset($link->job_id) ? $link->job_id : null;
        $data['meta']['stats'] = isset($link->stats) ? unserialize($link->stats) : null;
        $data['meta']['review'] = isset($link->review) ? unserialize($link->review) : null;
        $data['meta']['warnings'] = isset($link->warnings) ? unserialize($link->warnings) : null;
        $data['meta']['error'] = isset($link->error) ? unserialize($link->error) : null;
        $data['status'] = isset($link->status) ? $link->status : null;
        $data['time'] = isset($link->created_time) ? $link->created_time : null;
        $data['url'] = isset($link->url) ? $link->url : null;
        $data['id'] = isset($link->id) ? $link->id : null;
        return $data;
    }

    static function get_first_link(){
        global $wpdb;
        $link = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE id = " . 1, OBJECT);
        return self::transform_link($link);
    }

    static function link_exists($url){
        global $wpdb;
        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "' AND status='success'", OBJECT);
        return isset($result) && !empty($result);
    }

    static function link_exists_with_error($url){
        global $wpdb;
        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'", OBJECT);
        return isset($result) && !empty($result);
    }

    static function delete_link($url){
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'");
    }

    static function clear_links(){
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE id > " . 0);
    }

    static function update($data, $where){
        global $wpdb;
        return $wpdb->update(
            $wpdb->prefix . 'rapidload_uucss_job',
            $data,
            $where
        );
    }

    static function initialize(){
        self::create_tables();
        update_option( self::$db_option, self::$db_version );
    }

    static function link_files_used_elsewhere( $link ){

        $links = self::get_links_exclude($link);

        $file = (array) self::get_link($link);

        $used   = [];
        $unused = [];

        if($file){

	        $files = $file['files'];

            foreach ( $files as $item ) {

                foreach ( $links as $key => $value ) {

                    if ( in_array( $item['uucss'], array_column( $value['files'], 'uucss' ) ) ) {
                        $used[] = $item['uucss'];
                        break;
                    }
                }

            }

            $unused = array_column( $files, 'uucss' );

            foreach ( $used as $item ) {

                if ( ( $key = array_search( $item, $unused ) ) !== true ) {
                    unset( $unused[ $key ] );
                }

            }
        }

        return $unused;
    }

    static function create_tables(){
        global $wpdb;

        $table_name = $wpdb->prefix . 'rapidload_uucss_job';

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		job_id mediumint(9) NULL,
		url varchar(500) NOT NULL,
		stats longtext NULL,
		files longtext NULL,
		warnings longtext NULL,
		review longtext NULL,
		error longtext NULL,
		attempts mediumint(2) NULL,
		status varchar(15) NOT NULL,
		created_time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
		PRIMARY KEY  (id),
		KEY url (url(500))
	) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

    static function drop(){
        global $wpdb;

        $tableArray = [
            $wpdb->prefix . "rapidload_uucss_job",
        ];

        foreach ($tableArray as $tablename) {
            $wpdb->query("DROP TABLE IF EXISTS $tablename");
        }

        delete_option(self::$db_option);
    }
}
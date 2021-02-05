<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_DB
{
    use UnusedCSS_Utils;

    static $db_version = "1.0";
    static $db_option = "rapidload_migration";

    static function uninitialize_site($old_site){

        if(!isset($old_site)){
            return;
        }

        self::drop();
    }

    static function initialize_site($new_site, $args){

        if(!isset($new_site)){
           return;
        }

        $error = self::create_tables($new_site->blog_id . '_');

        if(empty($error)){
            UnusedCSS_Autoptimize_Admin::update_site_option( self::$db_option, self::$db_version );
        }
    }

    static function check_db_updates(){

        add_action( 'wp_initialize_site', [get_called_class(), 'initialize_site'] , 10 , 2);

        add_action('wp_uninitialize_site', [get_called_class(), 'uninitialize_site'], 10, 1);

        if ( UnusedCSS_Autoptimize_Admin::get_site_option( self::$db_option ) != self::$db_version ) {
            $notice = [
	            'action'  => 'rapidload-db-update',
	            'title'   => 'RapidLoad Power Up',
	            'message' => 'Migrate your database to the latest version. to enjoy optimized data handling.',

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
        if ( UnusedCSS_Autoptimize_Admin::get_site_option( self::$db_option ) != self::$db_version ) {

            try{
	            $status = self::create_tables();

	            if(!empty($status)){
		            wp_send_json_error(array(
		            	'error' => $status
		            ));
	            }

	            if(!UnusedCSS_Autoptimize_Admin::get_site_option(self::$db_option)){
		            self::seed();
	            }

                UnusedCSS_Autoptimize_Admin::update_site_option( self::$db_option, self::$db_version );

	            wp_send_json_success([
		            'db_updated' => true
	            ]);

            }catch(Exception $e){
	            wp_send_json_error(null);
            }

        }

    }


	static function seed() {

		$maps = UnusedCSS_Autoptimize_Admin::get_site_option( UnusedCSS_Settings::$map_key );

		if ( empty( $maps ) ) {
			return;
		}

		foreach ( $maps as $map ) {
			$data = array();
			if ( isset( $map['meta']['id'] ) ) {
				$data['job_id'] = $map['meta']['id'];
			}
			$data['url'] = $map['url'];
			if ( isset( $map['meta']['stats'] ) ) {
				$data['stats'] = serialize( $map['meta']['stats'] );
			}
			if ( isset( $map['files'] ) ) {
				$data['files'] = serialize( $map['files'] );
			}
			if ( isset( $map['meta']['warnings'] ) ) {
				$data['warnings'] = serialize( $map['meta']['warnings'] );
			}
			if ( isset( $map['meta']['review'] ) ) {
				$data['review'] = serialize( $map['meta']['review'] );
			}
			if ( isset( $map['meta']['error'] ) ) {
				$data['error'] = serialize( $map['meta']['error'] );
			}
			$data['status']     = $map['status'];
			$data['created_at'] = date( "Y-m-d H:m:s", $map['time'] );

			self::add_link( $data );
		}

		// remove old option after seeding completed
        UnusedCSS_Autoptimize_Admin::delete_site_option( UnusedCSS_Settings::$map_key );
	}


	static function add_link( $data , $count_attempts = false) {

    	if(!$data['url']){
    		return;
	    }

		global $wpdb;

		$exist = self::get_link( $data['url'] );

		if ( $exist ) {

			if(!isset($exist['attempts']) || !is_numeric($exist['attempts'])){

                $exist['attempts'] = 0;

            }

            if($count_attempts){

                $data['attempts'] = $exist['attempts'] + 1;

                if($data['status'] == 'failed' && $data['attempts'] <= 3){

                    $data['status'] = 'queued';
                }
            }

            $data['created_at'] =  date( "Y-m-d H:m:s", time() );

			self::update( $data, array(
				'url' => $data['url']
			));

        }else{

			if($data['status'] == 'failed' || $data['status'] == 'queued'){

				$data['attempts'] = 0;

			}

			$wpdb->insert(
				$wpdb->prefix . 'rapidload_uucss_job',
				$data
			);

			$error = $wpdb->last_error;

			if(!empty($error)){
				self::show_db_error($error);
			}

		}

	}



    static function get_link($url){
        global $wpdb;

	    $link = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'", OBJECT);

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }

	    if(!empty($link)){

		    return self::transform_link($link[0]);

	    }else{

		    return null;
	    }
    }

    static function get_links_by_status($status, $limit = 1){
        global $wpdb;

        $status = implode(",", $status);

        $status = str_replace('"', '', $status);

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE status IN(" . $status . ") ORDER BY created_at DESC LIMIT " . $limit, OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        $transformed_links = array();

        if(!empty($links)){

            foreach ($links as $link){

                array_push($transformed_links, $link);

            }

        }

        return $transformed_links;
    }


    static function migrated(){
        $option = UnusedCSS_Autoptimize_Admin::get_site_option(self::$db_option);
        return isset($option) && !empty($option );
    }



    static function get_links(){
        global $wpdb;

	    $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job", OBJECT);

	    $links = array_map(function ($link){
		    return self::transform_link($link);
	    }, $links);

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }

	    return $links;
    }



    static function get_links_exclude($url){
        global $wpdb;

	    $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url != '" . $url . "'", OBJECT);

	    $links = array_map(function ($link){
		    return self::transform_link($link);
	    }, $links);

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }

	    return $links;
    }



    static function transform_link($link, $get = true){

        if(empty($link)){
            return null;
        }

        $data = array();

        if($get){

            $data['files'] = isset($link->files) ? unserialize($link->files) : null;
            $data['meta']['id'] = isset($link->job_id) ? $link->job_id : null;
            $data['meta']['stats'] = isset($link->stats) ? unserialize($link->stats) : null;
            $data['meta']['review'] = isset($link->review) ? unserialize($link->review) : null;
            $data['meta']['warnings'] = isset($link->warnings) ? unserialize($link->warnings) : [];
            $data['meta']['error'] = isset($link->error) ? unserialize($link->error) : null;
            $data['meta']['status'] = isset( $link->status ) ? $link->status : null;
            $data['status'] = isset( $link->status ) ? $link->status : null;
            $data['time'] = isset( $link->created_at ) ? strtotime( $link->created_at ) : null;
            $data['attempts'] = isset( $link->attempts ) ? $link->attempts : null;
            $data['url'] = isset( $link->url ) ? $link->url : null;
            $data['id'] = isset($link->id) ? $link->id : null;

        }else{

            if(isset($link['id'])) $data['job_id'] = $link['id'];

            $data['url'] = $link['url'];

            if(isset($link['meta'])){

                $data['stats'] = isset($link['meta']['stats']) ? serialize($link['meta']['stats']) : null;
                $data['warnings'] = isset($link['meta']['warnings']) ? serialize($link['meta']['warnings']) : null;
                $data['review'] = isset($link['meta']['review']) ? serialize($link['meta']['review']) : null;
                $data['error'] = isset($link['meta']['error']) ? serialize($link['meta']['error']) : null;

            }

            $data['files'] = isset($link['files']) ? serialize($link['files']) : null;
            $data['status'] = $link['status'];

        }

        return $data;

    }

    static function get_first_link(){
	    global $wpdb;

	    $link = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}rapidload_uucss_job LIMIT 1", OBJECT );

	    $error = $wpdb->last_error;

	    if ( ! empty( $error ) ) {
		    self::show_db_error( $error );
	    }

	    if ( count( $link ) > 0 ) {
		    return self::transform_link( $link[0] );
	    }

	    return false;
    }



    static function link_exists($url){
        global $wpdb;

	    $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "' AND status IN('success','processing')", OBJECT);

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }

	    return isset($result) && !empty($result );
    }



    static function link_exists_with_error($url){
        global $wpdb;

	    $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'", OBJECT);

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }

	    return isset($result) && !empty($result);
    }



    static function delete_link($url){
        global $wpdb;

	    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "'" );

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }
    }

	static function update_status($status = 'queued', $link = false){
		global $wpdb;

		if(!$link){

			$wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' WHERE id > 1");

		}else{

			$wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' WHERE url = '" . $link . "'" );

		}

		$error = $wpdb->last_error;

		if(!empty($error)){
			self::show_db_error($error);
		}
	}

    static function reset_attempts($link){
        global $wpdb;

        if(!$link){

            return;

        }


        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET attempts = 0 WHERE url = '" . $link . "'" );

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::log($error);
        }
    }

    static function update_meta($data, $link){

        if(isset($data['warnings'])){

            $data['warnings'] = serialize($data['warnings']);

        }

        self::update($data, [
            'url' => $link
        ]);
    }

    static function clear_links(){
        global $wpdb;

	    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE id > " . 0 );

	    $error = $wpdb->last_error;

	    if(!empty($error)){
		    self::show_db_error($error);
	    }
    }



    static function update($data, $where){
        global $wpdb;

	    $wpdb->update(
		    $wpdb->prefix . 'rapidload_uucss_job',
		    $data,
		    $where
	    );

	    $error = $wpdb->last_error;

	    if(!empty($error)){
	    	self::show_db_error($error);
	    }
    }



    static function initialize(){
        $error = self::create_tables();

        if(!empty($error)){
        	self::show_db_error($error);
        	return;
        }

        UnusedCSS_Autoptimize_Admin::update_site_option( self::$db_option, self::$db_version );
        UnusedCSS_Autoptimize_Admin::delete_site_option(UnusedCSS_Settings::$map_key );
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

                    if ( isset($value['files']) && in_array( $item['uucss'], array_column( $value['files'], 'uucss' ) ) ) {
                        $used[] = $item['uucss'];
                        break;
                    }
                }

            }

            if(isset($files) && !empty($files)){

                $unused = array_column( $files, 'uucss' );

                foreach ( $used as $item ) {

                    if ( ( $key = array_search( $item, $unused ) ) !== true ) {
                        unset( $unused[ $key ] );
                    }

                }

            }
        }

        return $unused;
    }



    static function create_tables($blog_id = ''){
        global $wpdb;

        $table_name = $wpdb->prefix . $blog_id . 'rapidload_uucss_job';

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
		id mediumint(9) NOT NULL AUTO_INCREMENT,
		job_id mediumint(9) NULL,
		url varchar(191) NOT NULL,
		stats longtext NULL,
		files longtext NULL,
		warnings longtext NULL,
		review longtext NULL,
		error longtext NULL,
		attempts mediumint(2) NULL,
		status varchar(15) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY  (id),
		KEY url (url(191))
	) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
	    return $wpdb->last_error;
    }



    static function drop(){
        global $wpdb;

        $tableArray = [
            $wpdb->prefix . "rapidload_uucss_job",
        ];

        foreach ($tableArray as $tablename) {
            $wpdb->query("DROP TABLE IF EXISTS $tablename");
        }

        if(empty($wpdb->last_error)){

            UnusedCSS_Autoptimize_Admin::delete_site_option(self::$db_option);

		}

    }

    static function show_db_error($message){
        self::log($message);
        //self::add_admin_notice($message, 'error');
    }
}
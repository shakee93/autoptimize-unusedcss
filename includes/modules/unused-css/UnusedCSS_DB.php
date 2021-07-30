<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS_DB extends RapidLoad_DB
{

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

    static function get_task_count($job, $where = ''){

        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_{$job} {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return (int)$count;
    }

    static function get_data($job, $select = ' * ' , $where = '', $limit = 1, $order_by = 'id DESC')
    {
        global $wpdb;

        $data = $wpdb->get_results( "SELECT {$select} FROM {$wpdb->prefix}rapidload_uucss_{$job} {$where} ORDER BY {$order_by} LIMIT " . $limit, OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $data;
    }

    static function get_links_by_status($status, $limit = 1, $order_by = 'id DESC'){
        global $wpdb;

        $status = implode(",", $status);

        $status = str_replace('"', '', $status);

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE status IN(" . $status . ") ORDER BY {$order_by} LIMIT " . $limit, OBJECT);

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

    static function get_job_counts(){

        global $wpdb;

        $counts = $wpdb->get_results(
            "SELECT 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE hits > 0) as hits,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'success' AND warnings IS NULL) as success,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'rule-based') as rule_based,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'waiting') as waiting, 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'queued') as queued,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'processing') as processing, 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE warnings IS NOT NULL) as warnings,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job WHERE status = 'failed') as failed,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_uucss_job) as total", OBJECT);

        if(!empty($counts)){
            return $counts[0];
        }

        return (object)[
            'hits' => 0,
            'success' => 0,
            'rule_based' => 0,
            'waiting' => 0,
            'queued' => 0,
            'processing' => 0,
            'warnings' => 0,
            'failed' => 0,
            'total' => 0,
        ];
    }

    static function get_total_job_count($where = ''){

        if(self::$current_version < 1.2 && strpos( $where, 'hits' ) !== false){
            return 0;
        }

        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}rapidload_uucss_job {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return (int)$count;
    }

    static function get_links($start_from = 0, $limit = 10, $where = '', $order_by = 'id DESC'){
        global $wpdb;

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job {$where} ORDER BY {$order_by} LIMIT {$start_from},{$limit}", OBJECT);

        $links = array_map(function ($link){
            return self::transform_link($link);
        }, $links);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $links;
    }

    static function get_links_where($where = ''){
        global $wpdb;

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_job {$where} ORDER BY id DESC ", OBJECT);

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

    static function get_first_link(){
        global $wpdb;

        $link = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}rapidload_uucss_job WHERE status != 'rule-based' LIMIT 1", OBJECT );

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

        $result = $wpdb->get_results("SELECT id FROM {$wpdb->prefix}rapidload_uucss_job WHERE url = '" . $url . "' AND status IN('success','processing','waiting','rule-based')", OBJECT);

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

            if(RapidLoad_DB::$current_version < 1.2){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' , job_id = NULL, warnings = NULL WHERE id > 0");
            }else{
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' , job_id = NULL, warnings = NULL WHERE id > 0 AND rule_id IS NULL");
            }

        }else{

            if(RapidLoad_DB::$current_version < 1.2){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' , job_id = NULL WHERE url = '" . $link . "'" );
            }else{
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = '". $status ."' , job_id = NULL WHERE url = '" . $link . "' AND rule_id IS NULL" );
            }

        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function requeue_urls($list = false){

        global $wpdb;

        if($list){

            $urls = implode("','", $list);

            if(RapidLoad_DB::$current_version < 1.2){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued', job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE url IN('{$urls}')");
            }else{
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued', job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE rule_id IS NULL AND url IN('{$urls}')");
            }

        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function requeue_jobs($status = 'failed'){

        global $wpdb;

        if($status == 'warnings'){

            if(RapidLoad_DB::$current_version < 1.2){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued' , job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE warnings IS NOT NULL");
            }else{
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued' , job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE warnings IS NOT NULL AND rule_id IS NULL");
            }

        }else{

            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued' , job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE status ='{$status}'");
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

    static function update_failed($link, $error){

        $path = new UnusedCSS_Path([
            'url' => $link
        ]);

        $path->files = null;
        $path->status = 'failed';
        $path->error = serialize($error);
        $path->hits = 0;
        $path->save();

    }

    static function clear_links(){
        global $wpdb;

        if(RapidLoad_DB::$current_version < 1.2){
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE id > 0");
        }else{
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE id > 0");
            //$wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE id > 0 AND rule_id IS NULL");
        }

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

    static function get_rule($rule, $regex = '/'){
        global $wpdb;

        $link = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $rule . "' AND regex = '" . $regex . "'", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        if(!empty($link)){

            return self::transform_link($link[0], 'rule');

        }else{

            return null;
        }
    }

    static function unlink_rule($rule_id = false){

        if(!$rule_id){
            return;
        }

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET rule_id = NULL, status = 'queued' WHERE rule_id = " . $rule_id );

        if(!empty($error)){
            self::show_db_error($error);
        }

    }

    static function get_total_rule_count($where = ''){

        if(self::$current_version < 1.2){
            return 0;
        }

        global $wpdb;

        $count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}rapidload_uucss_rule {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return (int)$count;
    }

    static function get_rule_names(){

        if(self::$current_version < 1.2){
            return [];
        }

        global $wpdb;

        $names = $wpdb->get_results("SELECT rule FROM {$wpdb->prefix}rapidload_uucss_rule", ARRAY_A);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return array_unique(array_column($names, 'rule'));
    }

    static function get_rules($start_from = 0, $limit = 10, $where = '', $order_by = 'id DESC'){

        if(self::$current_version < 1.2){
            return [];
        }

        global $wpdb;

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule {$where} ORDER BY {$order_by} LIMIT {$start_from},{$limit}", OBJECT);

        $links = array_map(function ($link){
            return self::transform_link($link, 'rule');
        }, $links);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $links;
    }

    static function get_rules_where($where = '', $object = false){
        global $wpdb;

        $links = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule {$where} ORDER BY id DESC ", OBJECT);

        if(!$object){
            $links = array_map(function ($link){
                return self::transform_link($link, 'rule');
            }, $links);
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $links;
    }

    static function get_rules_exclude($rule, $regex = '/'){
        global $wpdb;

        $links = $wpdb->get_results(
            "SELECT id,job_id,url,stats,files,warnings,review,error,attempts,status,created_at,rule,hits
            FROM {$wpdb->prefix}rapidload_uucss_rule WHERE id NOT IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule  = '" . $rule . "' AND regex = '" . $regex . "')
            UNION
            SELECT id,job_id,url,stats,files,warnings,review,error,attempts,status,created_at,rule,hits
            FROM {$wpdb->prefix}rapidload_uucss_job WHERE rule_id IS NULL OR rule_id NOT IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule  = '" . $rule . "' AND regex = '" . $regex . "')", OBJECT);

        $links = array_map(function ($link){
            return self::transform_link($link);
        }, $links);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $links;
    }

    static function get_applied_rule($rule, $url){

        global $wpdb;

        $rules = $wpdb->get_results("SELECT id, rule, regex FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $rule . "' ORDER BY id DESC ", OBJECT);

        $applied_rule = false;

        if(empty($rules)){
            return $rules;
        }

        foreach ($rules as $rule){
            if(self::is_url_glob_matched($url,$rule->regex)){
                $applied_rule = $rule;
                break;
            }
        }

        return $applied_rule;
    }

    static function get_applied_rule_by_id($id){

        $applied_rule = self::get_rules_where("WHERE id = " . $id, true);

        if(isset($applied_rule) && !empty($applied_rule)){
            return $applied_rule[0];
        }

        return false;
    }

    static function detach_all_rules(){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET rule_id = NULL, status = 'queued' WHERE status = 'rule-based'" );

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

    }

    static function rule_exists($rule, $regex = '/'){

        if(self::$current_version < 1.2){
            return false;
        }

        global $wpdb;

        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $rule . "' AND status IN('success','processing','waiting') AND regex = '" . $regex ."'", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return isset($result) && !empty($result );
    }

    static function rule_exists_with_error($rule, $regex = '/'){
        global $wpdb;

        $result = $wpdb->get_results("SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $rule . "' AND regex = '" . $regex . "'", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return isset($result) && !empty($result);
    }

    static function rule_exist_by_url($url){
        global $wpdb;

        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule WHERE url = '" . $url . "'", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return isset($result) && !empty($result);
    }

    static function delete_rule($args = []){
        global $wpdb;

        if(isset($args['rule']) && isset($args['regex'])){
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET status = 'queued' , rule_id = NULL, rule = NULL WHERE rule_id IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $args['rule'] . "' AND regex = '" . $args['regex'] . "')" );
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $args['rule'] . "' AND regex = '" . $args['regex'] . "'" );
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function update_rule_status($status = 'queued', $rule = false, $regex = '/'){
        global $wpdb;

        if(RapidLoad_DB::$current_version < 1.2){
            return false;
        }

        if(!$rule){

            if($status == 'queued'){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE rule_id IS NOT NULL");
            }
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_rule SET status = '". $status ."' , job_id = NULL WHERE id > 0");

        }else{

            if($status == 'queued'){
                $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE rule_id IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $rule . "' AND regex = '" . $regex . "')");
            }
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_rule SET status = '". $status ."' , job_id = NULL WHERE rule = '" . $rule . "' AND regex = '" . $regex . "'" );

        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function requeue_rules($list = false){

        global $wpdb;

        if($list){

            foreach ($list as $item){

                if(isset($item['rule']) && isset($item['regex'])){

                    $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE rule_id IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule ='". $item['rule'] ."' AND regex ='" . $item['regex'] ."')");
                    $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_rule SET status = 'queued', job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE rule ='". $item['rule'] ."' AND regex ='" . $item['regex'] ."'" );
                }
            }
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function requeue_rule_jobs($status = 'failed'){

        global $wpdb;

        if($status == 'warnings'){

            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE rule_id IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE warnings IS NOT NULL)");
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_rule SET status = 'queued' , job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE warnings IS NOT NULL");

        }else{

            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE rule_id IN(SELECT id FROM {$wpdb->prefix}rapidload_uucss_rule WHERE status ='{$status}')");
            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_uucss_rule SET status = 'queued' , job_id = NULL, files = NULL, stats = NULL, warnings = NULL, error = NULL, hits = 0 WHERE status ='{$status}'");
        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }
    }

    static function clear_rules($soft = false, $args = []){

        if($soft){

            if(isset($args['rule']) && isset($args['regex'])){

                self::update_rule_status('queued', $args['rule'], $args['regex']);

            }else{

                self::update_rule_status();
            }

        }else{

            global $wpdb;

            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_rule WHERE id > 0");

            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_uucss_job WHERE rule IS NOT NULL AND rule_id IS NOT NULL" );

            $error = $wpdb->last_error;

            if(!empty($error)){
                self::show_db_error($error);
            }

        }
    }

    static function get_rules_by_status($status = ['queued'], $limit = 1, $order_by = 'id DESC'){

        if(self::$current_version < 1.2){
            return [];
        }

        global $wpdb;

        $status = implode(",", $status);

        $status = str_replace('"', '', $status);

        $rules = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule WHERE status IN(" . $status . ") ORDER BY {$order_by} LIMIT  " . $limit, OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $rules;
    }

    static function link_files_used_elsewhere( $link , $rule = false, $regex = false){

        $links = $rule && $regex ? self::get_rules_exclude($rule, $regex) : self::get_links_exclude($link);

        $file = $rule && $regex ? (array) self::get_rule($rule, $regex) : (array) self::get_link($link);

        $files = $file && isset($file['files']) ? $file['files'] : [];

        $used   = [];
        $unused = [];

        if($file){

            if(isset($files) && !empty($files)){

                foreach ( $files as $item ) {

                    foreach ( $links as $key => $value ) {

                        if ( isset($value['files']) && in_array( $item['uucss'], array_column( $value['files'], 'uucss' ) ) ) {
                            $used[] = $item['uucss'];
                            break;
                        }
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

    static function transform_link($link, $rule = 'path'){

        if(empty($link)){
            return null;
        }

        $data = array();

        $data['id'] = isset($link->id) ? $link->id : null;
        $data['url'] = isset( $link->url ) ? $link->url : null;
        $data['status'] = isset( $link->status ) ? $link->status : null;
        $data['success_count'] = isset( $link->hits ) ? $link->hits : 0;
        $data['meta']['warnings'] = isset($link->warnings) ? unserialize($link->warnings) : [];

        if($rule == 'path'){
            $data['rule_id'] = isset( $link->rule_id ) ? $link->rule_id : null;

            if(isset($data['rule_id'])){

                $appied_rule = self::get_applied_rule_by_id($data['rule_id']);
                if($appied_rule){
                    $link = $appied_rule;
                    $data['rule'] = $link->rule ? $link->rule : null;
                    $data['base'] = $link->url ? $link->url : null;
                    $data['rule_status'] = $link->status ? $link->status : null;
                    $data['rule_hits'] = $link->hits ? $link->hits : 0;
                }

            }
        }

        if($rule == 'rule'){
            $data['regex'] = isset( $link->regex ) ? $link->regex : '/';
            $data['applied_links'] = self::get_total_job_count(" WHERE rule_id = " . $link->id);
            $data['applied_successful_links'] = $link->status == 'success' && $link->hits > 0 ?
                self::get_total_job_count(" WHERE hits > 0 AND rule_id = " . $link->id) : 0;
        }

        $data['files'] = isset($link->files) ? unserialize($link->files) : null;
        $data['job_id'] = isset($link->job_id) ? $link->job_id : null;
        $data['meta']['id'] = isset($link->job_id) ? $link->job_id : null;
        $data['meta']['stats'] = isset($link->stats) ? unserialize($link->stats) : null;
        $data['meta']['review'] = isset($link->review) ? unserialize($link->review) : null;

        $data['meta']['error'] = isset($link->error) ? unserialize($link->error) : null;
        $data['meta']['status'] = isset( $link->status ) ? $link->status : null;
        $data['time'] = isset( $link->created_at ) ? strtotime( $link->created_at ) : null;
        $data['attempts'] = isset( $link->attempts ) ? $link->attempts : null;
        $data['rule'] = isset( $link->rule ) ? $link->rule : null;

        return apply_filters('uucss/link', $data);

    }

    static function reset_hits($link = false){

        if(self::$current_version < 1.2){
            return false;
        }

        global $wpdb;

        if($link){
            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE url = '" . $link . "'");
            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_rule SET hits = 0 WHERE url = '" . $link . "'");
        }else{
            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0 WHERE id > 0");
            $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_rule SET hits = 0 WHERE id > 0");
        }

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;
    }

    static function get_duplicate_files(){

        global $wpdb;

        $duplicate_files = [];

        $duplicates = $wpdb->get_results(
            "SELECT *, 
            (SELECT url FROM {$wpdb->prefix}rapidload_uucss_job WHERE files = derivedTable.files LIMIT 1) as url FROM 
            (
            SELECT files, count(files) as count
            FROM (SELECT * FROM {$wpdb->prefix}rapidload_uucss_job ORDER BY files) job_table
            WHERE files IS NOT NULL
            GROUP BY files
            HAVING count >1
            ) derivedTable ORDER BY url", OBJECT);

        foreach ($duplicates as $duplicate){
            array_push($duplicate_files, [
                'url' => $duplicate->url,
                'files' => isset($duplicate->files) ? unserialize($duplicate->files) : [],
                'count' => $duplicate->count,
                'otherUrls' => self::get_urls_with_same_files(isset($duplicate->files) ? $duplicate->files : null)
            ]);
        }

        return $duplicate_files;

    }

    static function get_urls_with_same_files($files){

        if(!$files){
            return [];
        }

        global $wpdb;

        $urls = $wpdb->get_col("SELECT url FROM {$wpdb->prefix}rapidload_uucss_job WHERE files = '" . $files . "' ORDER BY url");

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $urls;
    }

    static function get_original_file_name($path){

	    $orinal_file_name = null;

        global $wpdb;

        $files_list = $wpdb->get_col("SELECT files FROM {$wpdb->prefix}rapidload_uucss_job WHERE files IS NOT NULL UNION ALL SELECT files FROM {$wpdb->prefix}rapidload_uucss_rule WHERE files IS NOT NULL");

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

    static function reset_rule_warnings($rule_id){

        if(self::$current_version < 1.2){
            return false;
        }

        global $wpdb;

        $wpdb->query("UPDATE {$wpdb->prefix}rapidload_uucss_job SET hits = 0, warnings = NULL WHERE rule_id = " . $rule_id );

        return true;
    }
}
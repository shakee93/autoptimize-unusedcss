<?php

defined( 'ABSPATH' ) or die();

abstract class RapidLoad_DB
{
    use RapidLoad_Utils;

    static $db_version = "1.5";
    static $db_option = "rapidload_migration";
    static $current_version = "1.4";
    static $map_key = 'uucss_map';

    static function initialize_site($new_site, $args){

        if(!isset($new_site)){
            return;
        }

        $error = self::create_tables($new_site->blog_id . '_');

        if(empty($error)){
            RapidLoad_Base::update_option( self::$db_option, self::$db_version );
        }
    }

    static function uninitialize_site($old_site){

        if(!isset($old_site)){
            return;
        }

        self::drop();
    }

    static function drop(){
        global $wpdb;

        $tableArray = [
            $wpdb->prefix . "rapidload_uucss_job",
            $wpdb->prefix . "rapidload_uucss_rule",
            $wpdb->prefix . "rapidload_job",
            $wpdb->prefix . "rapidload_job_data",
        ];

        foreach ($tableArray as $tablename) {
            $wpdb->query("DROP TABLE IF EXISTS $tablename");
        }

        if(empty($wpdb->last_error)){

            RapidLoad_Base::delete_option(self::$db_option);

        }

    }

    static function create_tables($blog_id = ''){
        global $wpdb;

        $rapidload_uucss_job = $wpdb->prefix . $blog_id . 'rapidload_uucss_job';
        $rapidload_uucss_rule = $wpdb->prefix . $blog_id . 'rapidload_uucss_rule';
        $rapidload_job = $wpdb->prefix . $blog_id . 'rapidload_job';
        $rapidload_job_data = $wpdb->prefix . $blog_id . 'rapidload_job_data';

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

        if(self::$current_version < 1.1 && in_array($blog_id . 'rapidload_uucss_job', $wpdb->tables)){
            $index = 'url';
            $wpdb->query( "ALTER TABLE `$rapidload_uucss_job` DROP INDEX `$index`" );
        }

        $sql = "CREATE TABLE $rapidload_uucss_job (
		id INT NOT NULL AUTO_INCREMENT,
		job_id INT NULL,
		rule longtext NULL,
		url longtext NOT NULL,
		stats longtext NULL,
		files longtext NULL,
		warnings longtext NULL,
		review longtext NULL,
		error longtext NULL,
		attempts mediumint(2) NULL DEFAULT 0,
		hits mediumint(3) NULL DEFAULT 0,
		rule_id INT NULL,
		rule_note longtext NULL,
		status varchar(15) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY  (id)
	) ;
	    CREATE TABLE $rapidload_uucss_rule (
		id INT NOT NULL AUTO_INCREMENT,
		job_id INT NULL,
		rule longtext NOT NULL,
		url longtext NOT NULL,
		regex longtext NOT NULL,
		stats longtext NULL,
		files longtext NULL,
		warnings longtext NULL,
		review longtext NULL,
		error longtext NULL,
		attempts mediumint(2) NULL,
		hits mediumint(3) NULL,
		status varchar(15) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY  (id)
	) ;
	    CREATE TABLE $rapidload_job (
		id INT NOT NULL AUTO_INCREMENT,
		url longtext NOT NULL,
		rule longtext NOT NULL,
		regex longtext NOT NULL,
		rule_id INT NULL,
		rule_note longtext NULL,
		status varchar(15) NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY  (id)
	) ;
	    CREATE TABLE $rapidload_job_data (
		id INT NOT NULL AUTO_INCREMENT,
		job_id INT NOT NULL,
		job_type varchar(15) NOT NULL,
		queue_job_id INT NULL,
		data longtext NULL,
		stats longtext NULL,
		warnings longtext NULL,
		error longtext NULL,
		attempts mediumint(2) NULL,
		hits mediumint(3) NULL,
		status varchar(15) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY  (id),
		KEY idx_rapidload_job_data_job_id (job_id),       
		KEY idx_rapidload_job_data_job_type (job_type)            
	) ;";

        dbDelta( $sql );
        return $wpdb->last_error;
    }

    static function update_db_version(){
        self::$current_version = RapidLoad_Base::get_option( self::$db_option , "0");
    }

    static function check_db_updates(){

        add_action( 'wp_initialize_site', [get_called_class(), 'initialize_site'] , 10 , 2);

        add_action('wp_uninitialize_site', [get_called_class(), 'uninitialize_site'], 10, 1);

        if(self::$current_version < 1.5){

            self::rules_migration_two_point_zero();

        }

        if (self::$current_version  < self::$db_version ) {
            $notice = [
                'action'  => 'rapidload-db-update',
                'title'   => 'RapidLoad Power Up',
                'message' => 'Migrate your database to the latest version to enjoy optimized data handling.',

                'main_action' => [
                    'key'   => 'Update Database',
                    'value' => '#'
                ],
                'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            add_action( "wp_ajax_rapidload_db_update", 'RapidLoad_DB::update_db' );
        }

    }

    static function rules_migration_two_point_zero(){

        try {
            global $wpdb;

            $rules = $wpdb->get_results("SELECT url, rule, regex FROM {$wpdb->prefix}rapidload_job WHERE rule != 'is_url' ORDER BY id", OBJECT);

            foreach ($rules as $rule){

                $job = new RapidLoad_Job([
                    'url' => $rule->url,
                    'rule' => $rule->rule,
                    'regex' => $rule->regex
                ]);

                $job_data = new RapidLoad_Job_Data($job, 'uucss');

                $data = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_uucss_rule WHERE rule = '" . $job->rule ."' and url = '" . $job->url ."'  and regex = '" . $job->regex ."' ", OBJECT);

                if(isset($data) && $data[0]){
                    $job_data->data = $data[0]->files;
                    $job_data->stats = $data[0]->stats;
                    $job_data->warnings = $data[0]->warnings;
                    $job_data->error = $data[0]->error;
                    $job_data->status = $data[0]->status;
                    $job_data->attempts = $data[0]->attempts;
                    $job_data->hits = $data[0]->hits;
                }

                $job_data->save();

            }

            //RapidLoad_Base::update_option( self::$db_option, self::$db_version );
            //self::$current_version = self::$db_version;

        }catch (Exception $ex){

        }

    }

    static function update_db(){

        self::verify_nonce();

        if ( self::$current_version < self::$db_version ) {

            try{
                $status = self::create_tables();

                if(!empty($status)){
                    wp_send_json_error(array(
                        'error' => $status
                    ));
                }

                if(self::$current_version < 1.3){
                    self::seed();
                }

                RapidLoad_Base::update_option( self::$db_option, self::$db_version );

                wp_send_json_success([
                    'db_updated' => true
                ]);

            }catch(Exception $e){
                wp_send_json_error(null);
            }

        }

    }

    static function seed(){

        global $wpdb;

        $wpdb->query("INSERT INTO {$wpdb->prefix}rapidload_job (url, rule, regex, created_at, status) 
        SELECT url, rule, regex, created_at, 'processing' AS status FROM {$wpdb->prefix}rapidload_uucss_rule");

        $wpdb->query("INSERT INTO {$wpdb->prefix}rapidload_job (url, rule, regex, rule_id, created_at, status) 
        SELECT url, 'is_url' as rule, '/' as regex, rule_id, created_at, 'processing' AS status FROM {$wpdb->prefix}rapidload_uucss_job WHERE status != 'rule-based'");

        $wpdb->query("INSERT INTO {$wpdb->prefix}rapidload_job_data (job_id, job_type, attempts, hits, status, created_at) 
        SELECT id, 'cpcss' as job_type, 1 as attempts, 0 as hits, 'queued' AS status, created_at  FROM {$wpdb->prefix}rapidload_job");
    }

    static function migrated(){
        return true;
    }

    static function show_db_error($message){
        self::log([
            'log' => $message,
            'type' => 'general',
            'url' => get_site_url()
        ]);
    }

    static function initialize(){
        $error = self::create_tables();

        if(!empty($error)){
            self::show_db_error($error);
            return;
        }

        RapidLoad_Base::update_option( self::$db_option, self::$db_version );
        RapidLoad_Base::delete_option(self::$map_key );
    }

    static function get_rule_names(){

        global $wpdb;

        $names = $wpdb->get_results("SELECT rule FROM {$wpdb->prefix}rapidload_job WHERE rule != 'is_url' ORDER BY id", ARRAY_A);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return array_unique(array_column($names, 'rule'));
    }

    static function get_applied_rule($rule, $url){

        $rules = self::get_rules_where("WHERE rule = '" . $rule . "'");
        $applied_rule = false;

        foreach ($rules as $rule){
            if(self::is_url_glob_matched($url,$rule->regex)){
                $applied_rule = $rule;
                break;
            }
        }

        return $applied_rule;
    }

    static function get_rules_where($where = ''){

        global $wpdb;

        if(!empty($where)){
            $where .= " AND rule != 'is_url' ";
        }else{
            $where = " WHERE rule != 'is_url' ";
        }

        $rules = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_job {$where} ORDER BY id DESC ", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $rules;
    }

    static function rule_exists_with_error($rule, $regex = '/'){
        global $wpdb;

        $result = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = '" . $rule . "' AND regex = '" . $regex . "'", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return isset($result) && !empty($result);
    }

    static function clear_jobs( $type = 'all', $args = [], $ids = []){

        global $wpdb;

        if(!empty($ids)){

            $ids = implode(",", $ids);
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job WHERE id IN (". $ids .")");

        }else{

            switch ($type){

                case 'all':{
                    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job ");
                    break;
                }

                case 'url':{
                    if(isset($args['url'])){
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job WHERE url ='" . $args['url'] . "' and rule = 'is_url'");
                    }else{
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job WHERE rule ='is_url'");
                    }
                    break;
                }

                case 'rule':{
                    if(isset($args['rule']) && isset($args['regex'])){
                        $id = $wpdb->get_var("SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule ='" . $args['rule'] . "' AND regex ='" . $args['regex'] . "' LIMIT 1");
                        if(!empty($id)){
                            $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job SET regex = '/', rule_id = NULL, status = 'processing' WHERE rule='is_url' AND  rule_id = " . $id );
                        }
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job WHERE rule ='" . $args['rule'] . "' AND regex ='" . $args['regex'] . "'");
                    }else{
                        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job SET regex = '/', rule_id = NULL, status = 'processing' WHERE status = 'rule-based'");
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job WHERE rule != 'is_url'");
                    }

                    break;
                }

            }

        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

    }

    static function clear_job_data( $type = 'all', $args = [], $ids = []){

        global $wpdb;

        if(!empty($ids)){

            $ids = implode(",", $ids);
            $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id IN (". $ids .")");

        }else{

            switch ($type){

                case 'all':{
                    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data ");
                    break;
                }

                case 'url':{
                    if(isset($args['url'])){
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id IN(SELECT id FROM {$wpdb->prefix}rapidload_job WHERE url  = '" . $args['url'] . "')");
                    }else{
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id IN(SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule  = 'is_url')");
                    }
                    break;
                }

                case 'rule':{
                    if(isset($args['rule']) && isset($args['regex'])){
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id IN(SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule  = '" . $args['rule'] . "' AND regex ='" . $args['regex'] . "')");
                    }else{
                        $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id IN(SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule != 'is_url')");
                    }
                    break;
                }

                case 'uucss':{
                    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = 'uucss'");
                    break;
                }

                case 'cpcss':{
                    $wpdb->query( "DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = 'cpcss'");
                    break;
                }
            }

        }

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

    }

    static function get_jobs_where($where = ''){

        global $wpdb;

        $jobs = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_job {$where} ORDER BY id DESC ", OBJECT);

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return $jobs;
    }

    static function get_total_job_count($where = ''){

        global $wpdb;

        $where = str_replace("[job_table_name]","{$wpdb->prefix}rapidload_job", $where);

        $count = $wpdb->get_var("SELECT COUNT(*) FROM (select * from (select 
        job.id, job.url, job.rule, job.regex, job.rule_id, job.rule_note, job.status as job_status, job.created_at as job_created_at,
        uucss.data as files, uucss.stats, uucss.warnings, uucss.attempts, uucss.hits, CASE WHEN job.rule = 'is_url' AND job.rule_id IS NOT NULL THEN 'rule-based' ELSE uucss.status END AS status, 
        cpcss.data as cpcss, cpcss.stats as cpcss_stats, cpcss.warnings as cpcss_warnings, cpcss.attempts as cpcss_attempts, cpcss.hits as cpcss_hits, cpcss.status as cpcss_status 
        
        from (select (case when rule_id is not null then rule_id else id end) as id, url, rule, regex, rule_id, rule_note, status, created_at from {$wpdb->prefix}rapidload_job) as job
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'uucss') as uucss on job.id = uucss.job_id
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'cpcss') as cpcss on job.id = cpcss.job_id) as dervied_table) as derived_tbale_2 {$where}");

        $error = $wpdb->last_error;

        if(!empty($error)){
            self::show_db_error($error);
        }

        return (int)$count;
    }

    static function get_job_counts(){

        global $wpdb;

        $counts = $wpdb->get_results(
            "SELECT 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE hits > 0 and job_type = 'uucss') as hits,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'success' AND warnings IS NULL) as success,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job WHERE status = 'rule-based') as rule_based,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'waiting') as waiting, 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'queued') as queued,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'processing') as processing, 
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE warnings IS NOT NULL) as warnings,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'failed') as failed,
            (SELECT COUNT(id) FROM {$wpdb->prefix}rapidload_job_data WHERE job_type = 'uucss') as total", OBJECT);

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

    static function get_merged_data($start_from = 0, $limit = 10, $where = '', $order_by = 'id DESC'){

        global $wpdb;

        $data = $wpdb->get_results("select * from (select 
        job.id, job.url, job.rule, job.regex, job.rule_id, job.rule_note, job.status as job_status, job.created_at as job_created_at,
        (case when job.rule = 'is_url' then 0 else (select count(id) from {$wpdb->prefix}rapidload_job where rule_id = job.id and rule = 'is_url') end) as applied_successful_links,
        uucss.data as files, uucss.stats, uucss.warnings, uucss.attempts, uucss.hits, CASE WHEN job.rule = 'is_url' AND job.rule_id IS NOT NULL THEN 'rule-based' ELSE uucss.status END AS status, 
        cpcss.data as cpcss, cpcss.stats as cpcss_stats, cpcss.warnings as cpcss_warnings, cpcss.attempts as cpcss_attempts, cpcss.hits as cpcss_hits, cpcss.status as cpcss_status 
        
        from (select (case when rule_id is not null then rule_id else id end) as id, url, rule, regex, rule_id, rule_note, status, created_at from {$wpdb->prefix}rapidload_job) as job
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'uucss') as uucss on job.id = uucss.job_id
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'cpcss') as cpcss on job.id = cpcss.job_id) as dervied_table {$where} ORDER BY {$order_by} LIMIT {$start_from},{$limit}", OBJECT);

        $data = array_map(function ($job){
            return self::transform_link($job);
        }, $data);

        return $data;
    }

    static function transform_link($link, $rule = 'path'){

        if(empty($link)){
            return null;
        }

        $data = array();

        $data['id'] = isset($link->id) ? $link->id : null;
        $data['url'] = isset( $link->url ) ? $link->url : null;
        $data['regex'] = isset( $link->regex ) ? $link->regex : null;
        $data['rule'] = isset( $link->rule ) ? $link->rule : null;
        $data['rule_id'] = isset( $link->rule_id ) ? $link->rule_id : null;
        $data['job_status'] = isset( $link->job_status ) ? $link->job_status : null;
        $data['created_at'] = isset( $link->job_created_at ) ? $link->job_created_at : null;
        $data['hits'] = isset( $link->hits ) ? $link->hits : null;
        $data['applied_successful_links'] = isset( $link->applied_successful_links ) ? $link->applied_successful_links : 0;

        if(isset($data['rule_id'])){
            $job_url = RapidLoad_Job::find_or_fail($data['rule_id']);
            $data['base'] = $job_url->url;
            if($data['rule'] == "is_url"){
                $data['status'] = 'rule-based';
            }

        }

        return apply_filters('uucss/link', $data);

    }

    static function detach_all_rules(){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job SET rule = 'is_url' , regex = null , status = 'processing'");

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;
    }

    static function requeueJob($id){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = 'queued' WHERE job_id = " . $id);

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function updateUrlJobDataStatusWhere($status = 'queued', $where = "", $ids = []){

        global $wpdb;

        $ids = !empty($ids) ? implode(",", $ids) : "SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url'";

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = '". $status ."' WHERE job_id IN (". $ids .") " . $where);

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function updateRuleJobDataStatusWhere($status = 'queued', $where = "", $ids = []){

        global $wpdb;

        $ids = !empty($ids) ? implode(",", $ids) : "SELECT id FROM {$wpdb->prefix}rapidload_job WHERE rule != 'is_url'";

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET status = '". $status ."' WHERE job_id IN (" . $ids . ") " . $where);

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function resetHits($url){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET hits = 0 WHERE job_id IN (SELECT id FROM {$wpdb->prefix}rapidload_job WHERE url = '". $url ."') ");

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function resetRuleHits($id){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET hits = 0 WHERE job_id = ". $id);

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function resetWarningHits(){

        global $wpdb;

        $wpdb->query( "UPDATE {$wpdb->prefix}rapidload_job_data SET hits = 0 WHERE status = 'success' AND warnings IS NOT NULL");

        if(!empty($error)){
            self::show_db_error($error);
        }

        return true;

    }

    static function getUrlsWithWarnings(){

        global $wpdb;

        $data = $wpdb->get_results("SELECT url FROM {$wpdb->prefix}rapidload_job WHERE id IN (SELECT job_id FROM {$wpdb->prefix}rapidload_job_data WHERE status = 'success' AND warnings IS NOT NULL)" , ARRAY_A);

        if(!empty($data))
        {
            return array_unique(array_column($data, 'url'));
        }

        return [];

    }

    static function get_first_link(){

        global $wpdb;

        $first_link = false;

        $link = $wpdb->get_results( "select * from (select 
        job.id, job.url, job.rule, job.regex, job.rule_id, job.rule_note, job.status as job_status, job.created_at as job_created_at,
        uucss.data as files, uucss.stats, uucss.warnings, uucss.attempts, uucss.hits, CASE WHEN job.rule = 'is_url' AND job.rule_id IS NOT NULL THEN 'rule-based' ELSE uucss.status END AS status, 
        cpcss.data as cpcss, cpcss.stats as cpcss_stats, cpcss.warnings as cpcss_warnings, cpcss.attempts as cpcss_attempts, cpcss.hits as cpcss_hits, cpcss.status as cpcss_status 
        
        from {$wpdb->prefix}rapidload_job as job
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'uucss') as uucss on job.id = uucss.job_id
        left join (select * from {$wpdb->prefix}rapidload_job_data where job_type = 'cpcss') as cpcss on job.id = cpcss.job_id) as dervied_table WHERE rule = 'is_url' LIMIT 1", OBJECT );

        $error = $wpdb->last_error;

        if ( ! empty( $error ) ) {
            self::show_db_error( $error );
        }

        if ( count( $link ) > 0 ) {
            $first_link = self::transform_link($link[0]);
        }

        if(!isset($first_link['status']) || ($first_link['status'] != "success" && $first_link['status'] != "failed")){
            return false;
        }

        return $first_link;

    }
}
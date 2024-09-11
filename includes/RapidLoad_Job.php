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
    public $rule_note;
    public $created_at;
    public $desktop_options;
    public $mobile_options;

    public $parent;

    public function __construct($args = [])
    {

        if(isset($args['url'])){
            $this->url = $args['url'];
        }

        if(isset($args['rule']) && isset($args['regex'])){
            $this->rule = $args['rule'];
            $this->regex = $args['regex'];
        }else{
            $this->rule = 'is_url';
            $this->regex = '/';
        }

        if(isset($args['status'])){
            $this->status = $args['status'];
        }else{
            $this->status = 'processing';
        }

        $exist = $this->exist();

        if($exist){

            $this->id = $exist->id;
            $this->url = $exist->url;
            $this->rule = $exist->rule;
            $this->regex = $exist->regex;
            $this->status = $exist->status;
            $this->rule_id = $exist->rule_id;
            $this->rule_note = $exist->rule_note;
            $this->created_at = $exist->created_at;
            $this->desktop_options = isset($exist->desktop_options) ? $exist->desktop_options : null;
            $this->mobile_options = isset($exist->mobile_options) ? $exist->mobile_options : null;

            if(isset($this->rule_id) && $this->rule_id != $this->id && $this->rule == 'is_url'){
                $this->parent = RapidLoad_Job::find_or_fail($this->rule_id);
            }

        }else{

            $this->created_at = date( "Y-m-d H:m:s", time() );
        }

    }

    public function exist($id = false){
        global $wpdb;

        $exist = null;

        if(!$id && isset($this->id)){
            $id = $this->id;
        }

        if($id){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE id = " . $id, OBJECT);
        }
        else if($this->rule == 'is_url'){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE url = '" . $this->url . "' LIMIT 1", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = '" . $this->rule . "' AND regex = '" . $this->regex . "' LIMIT 1", OBJECT);
        }

        return $exist;
    }

    public function save($notify = false){

        global $wpdb;
        $data = (array) $this;

        unset($data['id']);
        unset($data['parent']);

        if(RapidLoad_DB::$current_version < 1.6){
            if(isset($data['desktop_options'])){
                unset($data['desktop_options']);
            }
            if(isset($data['mobile_options'])){
                unset($data['mobile_options']);
            }
        }

        if(isset($this->id)){

            $wpdb->update(
                $wpdb->prefix . 'rapidload_job',
                $data,
                [
                    'id' => $this->id
                ]
            );

            if($notify){
                do_action('rapidload/job/updated', $this, false);
            }

        }else{

            $wpdb->insert(
                $wpdb->prefix . 'rapidload_job',
                $data
            );

            $exist = $this->exist();

            if($exist){

                $this->id = $exist->id;

                if($notify){
                    do_action('rapidload/job/updated', $this, true);
                }
            }

        }
    }

    static function find_or_fail($id){

        global $wpdb;

        $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE id = '" . $id . "'", OBJECT);

        if(!$exist){
            return null;
        }

        return new RapidLoad_Job([
            'url' => $exist->url
        ]);

    }

    static function find_by_url($url, $include_failed = false){

        global $wpdb;

        $exist = false;

        if(!$include_failed){
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' AND status IN('cached','rule-based') LIMIT 1", OBJECT);
        }else{
            $exist = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}rapidload_job WHERE rule = 'is_url' AND url = '" . $url . "' LIMIT 1", OBJECT);
        }

        if(!$exist){
            return null;
        }

        return new RapidLoad_Job([
            'url' => $exist->url
        ]);

    }

    static function create($args){
        (new RapidLoad_Job($args))->save();
    }

    static function all(){

        return RapidLoad_DB::get_rules_where();

    }

    function delete(){

        global $wpdb;

        $query = $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_job_data WHERE job_id = " . $this->id);
        $query = $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_job WHERE id = " . $this->id);

    }

    function get_urls(){

        if($this->rule == "is_url"){
            return [];
        }

        global $wpdb;

        $data = $wpdb->get_results("SELECT url FROM {$wpdb->prefix}rapidload_job WHERE rule_id = " . $this->id . " AND rule = 'is_url'" , ARRAY_A);

        if(!empty($data))
        {
            return array_column($data, 'url');
        }

        return [];
    }

    function attach_rule($rule_id = false , $rule = null){
        if(!$rule_id){
            $this->rule_id = NULL;
            $this->rule = 'is_url';
            $this->regex = '/';
            $this->rule_note = 'detached';
            $this->status = 'queued';
        }else{
            $this->rule_id = $rule_id;
            $this->rule_note = NULL;
            $this->status = 'rule-based';
        }

    }

    function get_desktop_options($transformed = false, $recursive = false){

        if(isset($this->desktop_options) && !empty($this->desktop_options)){
            return !$transformed ? unserialize($this->desktop_options) : $this->transform_individual_file_actions(unserialize($this->desktop_options));
        }
        if(!$recursive){
            return $this->get_mobile_options($transformed, true);
        }
        return [];
    }

    function get_mobile_options($transformed = false, $recursive = false){

        if(isset($this->mobile_options) && !empty($this->mobile_options)){
            return !$transformed ? unserialize($this->mobile_options) : $this->transform_individual_file_actions(unserialize($this->mobile_options));
        }
        if(!$recursive){
            return $this->get_desktop_options($transformed, true);
        }
        return [];
    }

    function set_desktop_options($options){

        if(isset($options) && is_array($options) && !empty($options)){
            $this->desktop_options = serialize($options);
        }else{
            $this->desktop_options = null;
        }
    }

    function set_mobile_options($options){

        if(isset($options) && is_array($options) && !empty($options)){
            $this->mobile_options = serialize($options);
        }else{
            $this->mobile_options = null;
        }
    }

    function get_optimization_revisions($strategy, $limit = 10){

        global $wpdb;

        if(!isset($this->id)){
            return [];
        }

        $data = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}rapidload_job_optimizations WHERE strategy = '" . $strategy . "' AND job_id = " . $this->id . " ORDER BY id DESC LIMIT "  . $limit . " OFFSET 1", OBJECT);

        $transformed_data = [];

        foreach ($data as $d) {

            $d->data = json_decode($d->data);

            $transformed_object = new stdClass();
            $transformed_object->id = $d->id;
            $transformed_object->created_at = $d->created_at;

            $transformed_object->data = new stdClass();
            if (isset($d->data) && isset($d->data->performance)) {
                $transformed_object->data->performance = $d->data->performance;
            }

            try {
                $date = new DateTime($d->created_at);
                $date->setTimezone(new DateTimeZone('UTC'));
                $transformed_object->timestamp = $date->getTimestamp();
            } catch (Exception $exception) {
                $transformed_object->timestamp = null;
            }

            $transformed_data[] = $transformed_object;
        }

        return $transformed_data;
    }

    function get_last_optimization_revision_hash($strategy){
        global $wpdb;

        if(!isset($this->id)){
            return (object)[];
        }

        $data = $wpdb->get_var("SELECT data FROM {$wpdb->prefix}rapidload_job_optimizations WHERE strategy = '" . $strategy . "' AND job_id = " . $this->id . " ORDER BY id DESC LIMIT 1 ");

        if(!$data){
            return false;
        }else{
            return hash('md5',$data);
        }
    }

    function get_last_optimization_revision($strategy){
        global $wpdb;

        if(!isset($this->id)){
            return (object)[];
        }

        $data = $wpdb->get_var("SELECT data FROM {$wpdb->prefix}rapidload_job_optimizations WHERE strategy = '" . $strategy . "' AND job_id = " . $this->id . " ORDER BY id DESC LIMIT 1 ");

        if(!$data){
            return false;
        }else{
            return json_decode($data);
        }
    }

    function get_revision_count($strategy){

        global $wpdb;
        return $wpdb->get_var("SELECT count(id) FROM {$wpdb->prefix}rapidload_job_optimizations WHERE strategy = '" . $strategy . "' AND job_id = " . $this->id );

    }

    function delete_old_revision($strategy, $revision_count){
        $revsions = $this->get_revision_ids($strategy);

        if(!empty($revsions) && count($revsions) > ($revision_count -1 )){
            $revsions = array_slice($revsions, (-1 * ($revision_count -1 )));
            $revsions = array_map(function ($r){
                return (double)$r[0];
            },$revsions);
            $revsions = implode(",",$revsions);
            global $wpdb;
            $wpdb->query("DELETE FROM {$wpdb->prefix}rapidload_job_optimizations WHERE id NOT IN( $revsions ) AND strategy = '$strategy'");
        }

    }

    function get_revision_ids($strategy){

        global $wpdb;

        return $wpdb->get_results("SELECT id FROM {$wpdb->prefix}rapidload_job_optimizations WHERE strategy = '" . $strategy . "' AND job_id = " . $this->id , ARRAY_N);

    }

    function transform_individual_file_actions($options){

        $files = [];

        if(isset($options['individual-file-actions']) && !empty($options['individual-file-actions'])){

            foreach ($options['individual-file-actions'] as $tag){

                foreach ($tag as $action){

                    $files[] = (object)[
                        'url' => $action->url,
                        'type' => $action->url_object->file_type->value,
                        'action' => isset($action->action) && isset($action->action->value) ? $action->action->value : (object)[],
                        'regex' => isset($action->url_object) && isset($action->url_object->regex) ? $action->url_object->regex : $this->generateUrlRegex($action->url)
                    ];

                }

            }

            $files = array_map('serialize', $files);

            $files = array_unique($files);

            $files = array_map('unserialize', $files);

            if(!empty($files)){
                $options['individual-file-actions'] = array_values($files);
            }
        }

        return $options;
    }

    function generateUrlRegex($url) {
        // Escape characters with special meanings in regex
        $urlParts = parse_url($url);
        if (isset($urlParts['path'])) {
            $path = $urlParts['path'];
        } else {
            return false; // Invalid URL
        }

        $regexPattern = null;

        $patterns = [
            /*[
                'find' => '/^https:\/\/script\.hotjar\.com\/modules\.[a-zA-Z0-9]+\.js$/',
                'regex' => '/static\.hotjar\.com\/c\/hotjar/'
            ],
            [
                'find' => '/^https:\/\/www\.gstatic\.com\/recaptcha\/releases\/[A-Za-z0-9-]+\/recaptcha__en\.js$/',
                'regex' => '/https:\/\/www\.google\.com\/recaptcha\/api\.js/'
            ],
            [
                'find' => '/^https:\/\/connect\.facebook\.net\/signals\/config\/\d+/',
                'regex' => '/https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js/'
            ]*/
        ];

        $patterns = apply_filters('rapidload/optimizer/regex/js-scripts', $patterns);

        foreach ($patterns as $pattern){

            if(isset($pattern['find']) && isset($pattern['regex'])){

                if(preg_match($pattern['find'], $url)){
                    $regexPattern = $pattern['regex'];
                    break;
                }
            }
        }

        if($regexPattern){
            return $regexPattern;
        }

        // Escape characters with special meanings in regex
        $escapedPath = preg_quote($path, '/');

        // Replace placeholders for dynamic parts of the path with regex patterns
        $escapedPath = preg_replace('/\\\\\{[^\\\\]+\}/', '([^/]+)', $escapedPath);

        // Add regex anchors to match the entire path
        $regexPattern = '/' . $escapedPath . '/';

        return $regexPattern;
    }

}
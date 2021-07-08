<?php


class UnusedCSS_Queue
{
    use RapidLoad_Utils;

    public function __construct()
    {
        add_action('uucss/queue/task',[$this, 'fetch_path_job_id'], 10);
        add_action('uucss/queue/task',[$this, 'fetch_path_result'], 20);
        add_action('uucss/queue/task',[$this, 'fetch_rule_job_id'], 10);
        add_action('uucss/queue/task',[$this, 'fetch_rule_result'], 20);
    }

    function fetch_path_job_id(){

        global $uucss;

        $current_waiting = UnusedCSS_DB::get_links_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count);

        $links = UnusedCSS_DB::get_links_by_status(["'queued'"], (RapidLoad_Queue::$job_count - count($current_waiting)));

        if(!empty($links)){

            foreach ($links as $link){

                $this->cache_path($link->url);

            }

        }

    }

    function fetch_rule_job_id(){

        $current_waiting = UnusedCSS_DB::get_rules_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count);

        $rules = UnusedCSS_DB::get_rules_by_status(["'queued'"], (RapidLoad_Queue::$job_count - count($current_waiting)));

        if(!empty($rules)){

            foreach ($rules as $rule){

                $this->cache_rule($rule);
            }

        }

    }

    function cache_path($url){

        global $uucss;

        $post_id = url_to_postid($url);

        $path = new UnusedCSS_Path([
            'url' => $url
        ]);

        $path->status = 'waiting';
        $path->job_id = null;
        $path->save();

        self::log([
            'log' => 'fetching job id',
            'url' => $url,
            'type' => 'uucss-cron'
        ]);

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->post( 's/unusedcss',
            array_merge( $uucss->api_options($post_id),
                [ 'url' => $url ]
            ));

        if($uucss_api->is_error($result)){

            $path->mark_as_failed($uucss_api->extract_error( $result ));
            $path->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $path->job_id = $result->id;
            $path->save();
        }

    }

    function cache_rule($rule){

        global $uucss;

        $post_id = url_to_postid($rule->url);

        $rule = new UnusedCSS_Rule([
            'rule' => $rule->rule,
            'regex' => $rule->regex
        ]);

        $rule->status = 'waiting';
        $rule->job_id = null;
        $rule->save();

        self::log([
            'log' => 'fetching job id',
            'url' => $rule->url,
            'type' => 'uucss-cron'
        ]);

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->post( 's/unusedcss',
            array_merge( $uucss->api_options($post_id),
                [ 'url' => $rule->url ]
            ));

        if($uucss_api->is_error($result)){

            $rule->mark_as_failed($uucss_api->extract_error( $result ));
            $rule->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $rule->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $rule->job_id = $result->id;
            $rule->save();
        }

    }

    function fetch_path_result(){

        $links = UnusedCSS_DB::get_links_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count, 'job_id');

        if(!empty($links)){

            foreach ($links as $link){

                $this->update_path_result($link->url, $link->job_id);

            }

        }

    }

    function fetch_rule_result(){

        $rules = UnusedCSS_DB::get_rules_by_status(["'processing'","'waiting'"], RapidLoad_Queue::$job_count, 'job_id');

        if(!empty($rules)){

            foreach ($rules as $rule){

                $this->update_rule_result($rule);

            }

        }

    }

    function update_path_result($url, $job_id){

        if(!$job_id){
            return;
        }

        $this->log( [
            'log' => 'fetching data for job ' . $job_id,
            'url' => $url,
            'type' => 'store'
        ] );

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/unusedcss/' . $job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $error = $uucss_api->extract_error( $result );

            if(isset($error['message']) && $error['message'] == 'Job processing failed in queue'){

                UnusedCSS_DB::requeue_urls([
                    $url
                ]);

                $this->log( [
                    'log' => 're-queued due to allowed errors',
                    'url' => $url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            UnusedCSS_DB::update_failed($url, $error);
            do_action( 'uucss/cache_cleared', [
                'url' => $url
            ]);

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->state) && $result->state == 'failed'){

            UnusedCSS_DB::update_failed($url, 'Unknown error occurred');
            do_action( 'uucss/cache_cleared', [
                'url' => $url
            ]);
            return;
        }

        $uucss_store = new RapidLoad_Store(null, $url,null);

        if(isset($result->state)){

            if($result->state == 'waiting' || $result->state == 'delayed' || $result->state == 'created' || $result->state == 'stalling'){
                UnusedCSS_DB::update_meta([
                    'status' => 'waiting'
                ], $url);
            }else if($result->state == 'active'){
                UnusedCSS_DB::update_meta([
                    'status' => 'processing'
                ], $url);
            }

        }

        if(isset($result->completed) && $result->completed && isset($result->data) && is_array($result->data) && count($result->data) > 0){

            $files = $uucss_store->cache_files($result->data);
            $uucss_store->add_link($files, $result);
            $uucss_store->uucss_cached();

        }else if(isset($result->completed) && $result->completed){

            $uucss_store->add_link(null, $result);
        }

    }

    function update_rule_result($uucss_rule){

        $rule = new UnusedCSS_Rule([
            'rule' => $uucss_rule->rule,
            'regex' => $uucss_rule->regex
        ]);

        if(!$rule->job_id){
            return;
        }

        $this->log( [
            'log' => 'fetching data for job ' . $rule->job_id,
            'url' => $rule->url,
            'type' => 'store'
        ] );

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/unusedcss/' . $rule->job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $rule->mark_as_failed($uucss_api->extract_error( $result ));
            $rule->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $rule->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        $uucss_store = new RapidLoad_Store(null, $rule->url,null, $rule);

        if(isset($result->completed) && $result->completed && isset($result->data) && is_array($result->data) && count($result->data) > 0){

            $files = $uucss_store->cache_files($result->data);
            $uucss_store->add_rule($files, $result);
            $uucss_store->uucss_cached();

        }else if(isset($result->completed) && $result->completed){

            $uucss_store->add_rule(null, $result);
        }
    }
}
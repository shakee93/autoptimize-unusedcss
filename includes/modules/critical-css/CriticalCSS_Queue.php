<?php


namespace RapidLoad\Service;


class CriticalCSS_Queue {

    use \RapidLoad_Utils;

    public function __construct()
    {
        add_action('uucss/queue/task',[$this, 'fetch_path_job_id'], 10);

        add_action('uucss/queue/task',[$this, 'fetch_path_result'], 20);
    }

    function fetch_path_job_id(){

        $current_waiting = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'processing'","'waiting'"], \RapidLoad_Queue::$job_count);

        $path_ccss_list = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'queued'"], (\RapidLoad_Queue::$job_count - count($current_waiting)));

        if(!empty($path_ccss_list)){

            foreach ($path_ccss_list as $value){

                $this->cache_path($value);
            }
        }
    }

    function cache_path($value){

        $post_id = url_to_postid($value->url);

        $path_ccss = new \RapidLoad\Service\CriticalCSS_Path([
            'url' => $value->url,
        ]);

        $path_ccss->status = 'waiting';
        $path_ccss->job_id = null;
        $path_ccss->save();

        self::log([
            'log' => 'fetching job id for path critical css',
            'url' => $path_ccss->url,
            'type' => 'uucss-cron'
        ]);

        $result = rapidload()->api()->post( 's/criticalcss',
            array_merge( rapidload()->cpcss->api_options($post_id),
                [ 'url' => $path_ccss->url ]
            ));

        if(rapidload()->api()->is_error($result)){

            $path_ccss->mark_as_failed(rapidload()->api()->extract_error( $result ));
            $path_ccss->save();

            self::log( [
                'log' => 'fetched data stored status failed',
                'url' => $path_ccss->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->id)){

            $path_ccss->job_id = $result->id;
            $path_ccss->save();
        }

    }

    function fetch_path_result(){

        $path_ccss = \RapidLoad\Service\CriticalCSS_DB::get_path_ccss_by_status(["'processing'","'waiting'"], \RapidLoad_Queue::$job_count, 'job_id');

        if(!empty($path_ccss)){

            foreach ($path_ccss as $value){

                $this->update_path_result($value);

            }

        }

    }

    function update_path_result($path_ccss){

        $path_ccss_object = new \RapidLoad\Service\CriticalCSS_Path([
            'url' => $path_ccss->url
        ]);

        if(!$path_ccss->job_id){
            return;
        }

        self::log( [
            'log' => 'fetching data for job ' . $path_ccss->job_id,
            'url' => $path_ccss->url,
            'type' => 'store'
        ] );

        $result = rapidload()->api()->get( 's/criticalcss/' . $path_ccss->job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $path_ccss_object->mark_as_failed(rapidload()->api()->extract_error( $result ));
            $path_ccss_object->save();

            $this->log( [
                'log' => 'fetched data stored status failed',
                'url' => $path_ccss->url,
                'type' => 'uucss-cron'
            ] );

            return;
        }

        if(isset($result->data)){

            $this->add_path_ccss($path_ccss_object, $result);

        }
    }

    function add_path_ccss($css_object, $result = false){

        if($result){
            $this->result = $result;
        }

        $warnings = isset($this->result) && isset($this->result->meta) ? $this->result->meta->warnings : null;

        if(isset($this->result->meta->stats) && isset($this->result->meta->stats->using) && in_array('rapidload', $this->result->meta->stats->using)){

            $warnings[] = [
                "message" => "Clear your page cache"
            ];
        }

        $file_name = 'cpcss-' . $this->encode($result->data) . '.css';
        rapidload()->file_system()->put_contents(\RapidLoad\Service\CriticalCSS::$base_dir . '/' . $file_name, $result->data);
        $css_object->mark_as_success($file_name, null, $warnings);
        $css_object->save();
        do_action( 'uucss/cached', [
            'url' => $css_object->url
        ]);
    }

}
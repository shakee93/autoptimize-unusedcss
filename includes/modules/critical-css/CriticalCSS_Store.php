<?php


class CriticalCSS_Store
{
    use RapidLoad_Utils;

    public $job_data;
    public $args;
    public $options;

    public $purged_css;
    public $result;

    /**
     * @var WP_Filesystem_Direct
     */
    public $file_system;

    public function __construct($job_data, $args){

        $this->job_data = $job_data;
        $this->args = $args;
        $this->options = RapidLoad_Base::fetch_options();
        $this->file_system = new RapidLoad_FileSystem();

    }

    function purge_css(){

        $uucss_api = new RapidLoad_Api();

        if(isset($this->args['immediate'])){

            $result = $uucss_api->post( 'purger/cpcss',
                array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
                    [ 'url' => $this->job_data->job->url, 'service' => true ]
                ) );

            if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

                $this->job_data->mark_as_failed($uucss_api->extract_error( $result ));
                $this->job_data->save();

                return;
            }

            $this->result       = $result;
            $this->purged_css = $result->data;

            $this->cache_file($this->purged_css);
            $this->cpcss_cached();

        }else{

            $result = $uucss_api->post( 's/criticalcss',
                array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
                    [ 'url' => $this->job_data->job->url, 'priority' => isset($this->args['priority']), 'wp_nonce' => wp_create_nonce('uucss_job_hook'), 'hook_end_point' => trailingslashit(get_site_url())]
                ) );

            if($uucss_api->is_error($result)){

                $this->job_data->mark_as_failed($uucss_api->extract_error( $result ));
                $this->job_data->save();

                $this->log( [
                    'log' => 'fetched data stored status failed',
                    'url' => $this->job_data->job->url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            if(isset($result->id)){

                $this->job_data->queue_job_id = $result->id;
                $this->job_data->status = 'waiting';
                $this->job_data->save();
            }

        }
    }

    function cache_file($purged_css, $result = false){

        if($result){
            $this->result = $result;
        }

        $warnings = isset($this->result) && isset($this->result->meta) ? $this->result->meta->warnings : null;

        if(isset($this->result->meta->stats) && isset($this->result->meta->stats->using) && in_array('rapidload', $this->result->meta->stats->using)){

            $warnings[] = [
                "message" => "Clear your page cache"
            ];
        }

        $file_name = 'cpcss-' . $this->encode($purged_css) . '.css';

        if(!empty($purged_css)){

            if(!$this->file_system->exists( CriticalCSS::$base_dir . '/' . $file_name)){
                $this->file_system->put_contents(CriticalCSS::$base_dir . '/' . $file_name, $purged_css);
            }
        }

        if($this->job_data){

            $this->job_data->mark_as_success($file_name, null, $warnings);
            $this->job_data->save();
            $this->cpcss_cached();

        }

    }

    public function cpcss_cached(){
        do_action( 'uucss/cached', [
            'url' => $this->url
        ]);
    }

    function update_css(){

        if(!$this->job_data->queue_job_id){
            return;
        }

        $uucss_api = new RapidLoad_Api();

        $result = $uucss_api->get( 's/criticalcss/' . $this->job_data->queue_job_id);

        if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

            $error = $uucss_api->extract_error( $result );

            if(isset($error['message']) && ($error['message'] == 'Job processing failed in queue' || $error['message'] == 'Error')){

                $this->job_data->requeue();
                $this->job_data->save();

                return;
            }

            $this->job_data->mark_as_failed($error);
            $this->job_data->save();

            do_action( 'uucss/cache_cleared', [
                'url' => $this->job_data->job->url
            ]);

            return;
        }

        if(isset($result->state) && $result->state == 'failed'){

            $this->job_data->mark_as_failed('Unknown error occurred');
            $this->job_data->save();

            do_action( 'uucss/cache_cleared', [
                'url' => $this->job_data->job->url
            ]);

            return;
        }

        if(isset($result->state)){

            if($result->state == 'waiting' || $result->state == 'delayed' || $result->state == 'created' || $result->state == 'stalling'){
                $this->job_data->status = 'waiting';
                $this->job_data->save();
            }else if($result->state == 'active'){
                $this->job_data->status = 'processing';
                $this->job_data->save();
            }

        }

        if(isset($result->completed) && $result->completed && isset($result->data)){

            $this->cache_file($result->data, $result);

        }
    }
}
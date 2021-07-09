<?php


class CriticalCSS_Store
{
    use RapidLoad_Utils;

    public $job_data;
    public $args;
    public $options;

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

        if(apply_filters('uucss/queue/redis', true) && apply_filters('uucss/queue/purger-enabled', false)){

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
                $this->job_data->save();
            }

        }else{

        }
    }
}
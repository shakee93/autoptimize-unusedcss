<?php


class CriticalCSS
{
    use RapidLoad_Utils;

    public $base;
    public $file_system;
    public $options = [];

    public $async = true;

    public static $base_dir;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_cpcss'])){
            return;
        }

        $this->file_system = new RapidLoad_FileSystem();

        if( ! $this->initFileSystem() ){
            return;
        }

        add_action('rapidload/job/handle', [$this, 'cache_cpcss'], 10, 2);

        add_action('rapidload/job/handle', [$this, 'enqueue_cpcss'], 20, 2);

        add_action('cpcss_async_queue', [$this, 'init_async_store'], 10, 2);

        add_filter('uucss/link', [$this, 'update_link']);

        if(is_admin()){

            add_action('wp_ajax_cpcss_purge_url', [$this, 'cpcss_purge_url']);

        }

        new CriticalCSS_Queue();
    }

    function cpcss_purge_url(){

        if(!isset($_REQUEST['url'])){
            wp_send_json_error('url required');
        }

        $job = new RapidLoad_Job([
            'url' => $_REQUEST['url']
        ]);

        if(!$job->exist()){
            wp_send_json_error('job not found');
        }

        $this->cache_cpcss($job, []);

        wp_send_json_success('Successfully purged');
    }

    function update_link($link){

        if(isset($link['url'])){

            $job = new RapidLoad_Job([
               'url' => $link['url']
            ]);

            if($job->exist()){

                $job_data = new RapidLoad_Job_Data($job, 'cpcss');

                if($job_data->exist() && $job_data->status = "success"){

                    $link['cpcss'] = $job_data->data;

                }

            }
        }

        return $link;
    }

    function cache_cpcss($job, $args){

        $job_data = new RapidLoad_Job_Data($job, 'cpcss');

        if(!$job_data->exist()){

            $job_data->save();

        }

        if($job_data->status == 'failed' && $job_data->attempts > 2 && !isset($args['immediate'])){
            return false;
        }

        if(!in_array($job_data->status, ['success', 'waiting', 'processing'])){
            $job_data->requeue();
            $job_data->save();
        }

        $this->async = apply_filters('uucss/purge/async',true);

        if (! $this->async ) {

            $this->init_async_store($job_data, $args);

        }else if(isset( $args['immediate'] )){

            $spawned = false;

            $spawned = $this->schedule_cron('cpcss_async_queue', [
                'job_data' => $job_data,
                'args'     => $args
            ]);

            $job_data->status = 'processing';
            $job_data->save();

            if(!$spawned){
                $this->init_async_store($job_data, $args);
            }
        }

        return true;
    }

    function enqueue_cpcss($job, $args){

        $job_data = new RapidLoad_Job_Data($job, 'cpcss');

        if($job_data->exist() && $job_data->status == 'success'){

            new CriticalCSS_Enqueue($job_data);

        }

    }

    public function initFileSystem() {

        $cache_base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR);

        $cache_base_option = RapidLoad_Base::get_option('rapidload_cache_base', null);

        if(!isset($cache_base_option)){

            $cache_base_option = $cache_base;
            RapidLoad_Base::update_option('rapidload_cache_base', $cache_base_option);
        }

        $this->base = RapidLoad_ThirdParty::plugin_exists('autoptimize') ? $cache_base_option . 'cpcss' : $cache_base . 'cpcss';

        if ( ! $this->file_system ) {
            return false;
        }

        if ( ! $this->init_base_dir() ) {
            return false;
        }

        return true;
    }

    public function init_base_dir() {

        self::$base_dir = WP_CONTENT_DIR . $this->base;

        if ( $this->file_system->exists( self::$base_dir ) ) {
            return true;
        }

        // make dir if not exists
        $created = $this->file_system->mkdir( self::$base_dir );

        if (!$created || ! $this->file_system->is_writable( self::$base_dir ) || ! $this->file_system->is_readable( self::$base_dir ) ) {
            return false;
        }

        return true;
    }

    public function init_async_store($job_data, $args)
    {
        $store = new CriticalCSS_Store($job_data, $args);
        $store->purge_css();
    }

}
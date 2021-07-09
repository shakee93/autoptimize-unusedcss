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

        add_action('uucss_async_queue', [$this, 'init_async_store'], 10, 2);

        new CriticalCSS_Queue();
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

        if($this->enabled_frontend() && !isset( $_REQUEST['no_uucss'] )){

            $job_data = new RapidLoad_Job_Data($job, 'cpcss');

            if($job_data->exist() && $job_data->status == 'success'){

                new CriticalCSS_Enqueue($job_data);

            }

        }

    }

    function enabled_frontend() {

        if ( is_user_logged_in() ) {
            return false;
        }

        if ( is_admin() ) {
            return false;
        }

        return apply_filters('uucss/frontend/enabled', true);
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
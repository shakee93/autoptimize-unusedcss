<?php

defined( 'ABSPATH' ) or die();

class UnusedCSS
{
    use RapidLoad_Utils;

    public $base;
    public $file_system;
    public $options = [];

    public $async = true;

    public static $base_dir;

    public $job_data = null;

    public function __construct()
    {
        $this->options = RapidLoad_Base::fetch_options();

        if(!isset($this->options['uucss_enable_uucss'])){
            //return;
        }

        $this->file_system = new RapidLoad_FileSystem();

        if( ! $this->initFileSystem() ){
            return;
        }

        add_action('rapidload/vanish', [ $this, 'vanish' ]);

        $this->cache_trigger_hooks();

        add_action('rapidload/job/handle', [$this, 'cache_uucss'], 10, 2);

        add_action('rapidload/job/handle', [$this, 'enqueue_uucss'], 20, 2);

        add_action('uucss_async_queue', [$this, 'init_async_store'], 10, 2);

        add_action('rapidload/job/updated', [$this, 'handle_job_updated'], 10 , 2);

        add_filter('uucss/enqueue/cache-file-url', function ($uucss_file){
            return $this->get_cached_file($uucss_file, apply_filters('uucss/enqueue/cache-file-url/cdn', null));
        },10,1);

        new UnusedCSS_Queue();
    }

    public function get_cached_file( $file_url, $cdn = null ) {

        if ( ! $cdn || empty( $cdn ) ) {
            $cdn = content_url();
        } else {

            $url_parts = parse_url( content_url() );

            $cdn = rtrim( $cdn, '/' ) . (isset($url_parts['path']) ? rtrim( $url_parts['path'], '/' ) : '/wp-content');

        }

        return implode( '/', [
            $cdn,
            trim($this->base, "/"),
            $file_url
        ] );
    }

    public function handle_job_updated($job, $new){

        if($new){

            $job_data = new RapidLoad_Job_Data($job, 'uucss');

            if(!isset($job_data->id)){

                $job_data->save();

            }
        }
    }

    public function cache_trigger_hooks() {
        add_action( 'save_post', [ $this, 'cache_on_actions' ], 110, 3 );
        add_action( 'untrash_post', [ $this, 'cache_on_actions' ], 10, 1 );
        add_action( 'wp_trash_post', [ $this, 'clear_on_actions' ], 10, 1 );
        add_action('wp_ajax_uucss_purge_url', [$this, 'uucss_purge_url']);
    }

    function enqueue_uucss($job, $args){

        if(!$job || !isset($job->id) || isset( $_REQUEST['no_uucss'] )){
            return false;
        }

        if(!$this->job_data){
            $this->job_data = new RapidLoad_Job_Data($job, 'uucss');
        }

        self::log([
            'log' => 'UnusedCSS->enqueue_uucss',
            'url' => $job->url,
            'type' => 'injection'
        ]);

        new UnusedCSS_Enqueue($this->job_data);

    }

    public function cache_on_actions($post_id, $post = null, $update = null)
    {
        if(!$post_id){
            return;
        }

        $post = get_post($post_id);

        if($post->post_status == "publish") {

            $this->clear_on_actions( $post->ID );

            $job = new RapidLoad_Job([
                'url' => get_permalink( $post )
            ]);

            if(isset($job->id) || !RapidLoad_Base::get()->rules_enabled()){

                $this->cache_uucss($job);

            }

        }
    }

    function cache_uucss($job, $args = []){

        if(!$job || !isset($job->id)){
            return false;
        }

        if(!$this->is_url_allowed($job->url, $args)){
            return false;
        }

        $this->job_data = new RapidLoad_Job_Data($job, 'uucss');

        if(!isset($this->job_data->id)){
            $this->job_data->save();
        }

        if($this->job_data->status == 'failed' && $this->job_data->attempts > 2 && !isset($args['immediate'])){
            return false;
        }

        if(!in_array($this->job_data->status, ['success', 'waiting', 'processing','queued']) || isset( $args['immediate'])){
            $this->job_data->requeue(isset( $args['immediate']) ? 0 : -1);
            $this->job_data->save();
        }

        $this->async = apply_filters('uucss/purge/async',true);

        if (! $this->async ) {

            $this->init_async_store($this->job_data, $args);

        }else if(isset( $args['immediate'] )){

            $spawned = $this->schedule_cron('uucss_async_queue', [
                'job_data' => $this->job_data,
                'args'     => $args
            ]);

            if(!$spawned){
                $this->init_async_store($this->job_data, $args);
            }

        }

        return true;
    }

    function uucss_purge_url()
    {

        if (isset($_REQUEST['url']) && !empty($_REQUEST['url'])) {

            $url = $_REQUEST['url'];

            if(!$this->is_url_allowed($url)){
                wp_send_json_error('url not allowed');
            }

            $job = new RapidLoad_Job([
                'url' => $this->transform_url($url)
            ]);

            if (!isset($job->id)) {
                $job->save();
            }

            $this->cache_uucss($job, ['immediate' => true]);

        }

        if (isset($_REQUEST['post_type'])){

            switch ($_REQUEST['post_type']) {

                case 'url':
                case 'post':
                case 'page':
                case 'site_map':
                {
                    break;
                }
                case 'warnings':
                {
                    UnusedCSS_DB::requeue_where(" WHERE status ='success' AND warnings IS NOT NULL ");
                    break;
                }
                case 'failed':
                {
                    UnusedCSS_DB::requeue_where(" WHERE status ='failed' ");
                    break;
                }
                case 'processing':
                {
                    UnusedCSS_DB::requeue_where(" WHERE status ='processing' ");
                    break;
                }
                default:
                {
                    UnusedCSS_DB::requeue_where();
                    break;
                }
            }
        }

        if ( isset( $_REQUEST['clear'] ) && boolval($_REQUEST['clear'] == 'true') ) {

            $this->clear_cache();

        }

        $this->cleanCacheFiles();

        wp_send_json_success('Successfully purged');
    }

    public function cleanCacheFiles(){

    }

    public function clear_on_actions($post_id)
    {
        if(!$post_id){
            return;
        }

        $link = get_permalink($post_id);

        if($link){

            $job = new RapidLoad_Job([
                'url' => $link
            ]);

            if(isset($job->id)){

                $this->clear_cache($job);

            }
        }
    }

    function clear_cache($job = null, $args = []){

        if($job){

            $job_data = new RapidLoad_Job_Data($job, 'uucss');

            if(isset($job_data->id)){

                $this->clear_files($job_data);
                $job_data->requeue();
                $job_data->save();

            }

        }else{

            UnusedCSS_DB::clear_data(isset($args['soft']));
            $this->clear_files();

        }

    }

    function clear_files($job_data = null){

        if($job_data){

            if(!empty($job_data->data)){

                $files = isset($job_data->data) && !empty($job_data->data) ? unserialize($job_data->data) : [];

                $used_files = UnusedCSS_DB::get_used_files_exclude($job_data->id);

                foreach ($files as $file){

                    $key = array_search($file['uucss'], $used_files);

                    if ( !isset($key) || empty($key)){

                        $this->file_system->delete( self::$base_dir . '/' . $file['uucss'] );

                    }
                }
            }

        }else{

            $this->file_system->delete( self::$base_dir );

        }

    }

    public function initFileSystem() {

        $this->base = apply_filters('uucss/cache-base-dir', UUCSS_CACHE_CHILD_DIR) . 'uucss';

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
        $store = new UnusedCSS_Store($job_data, $args);
        $store->purge_css();
    }

    public function vanish() {

        UnusedCSS_DB::clear_data();

        if ( $this->file_system->exists( self::$base_dir ) ){
            $this->file_system->delete( self::$base_dir, true );
        }

    }
}
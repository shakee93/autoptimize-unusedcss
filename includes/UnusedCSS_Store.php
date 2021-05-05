<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Store {

	use UnusedCSS_Utils;

	public $provider;

    public $url;
    public $rule;
    public $args;
    public $purged_files = [];
	public $result;

    public $options;

    /**
     * @var WP_Filesystem_Direct
     */
    public $file_system;


    /**
     * UnusedCSS_Store constructor.
     * @param $provider
     * @param $url
     * @param $args
     * @param $rule
     */
    public function __construct($provider, $url, $args = [], $rule = false)
    {

        $this->provider = $provider;
        $this->args = $args;
        $this->options = UnusedCSS_Admin::fetch_options();

        $this->file_system = new UnusedCSS_FileSystem();

        if(!$rule){

            $this->url = $url;
        }else{

            $this->rule = $rule;
        }
    }

    public function purge_css() {

	    $this->log( [
	        'log' => 'fetching data',
            'url' => $this->url,
            'type' => 'store'
        ] );

	    $uucss_api = new UnusedCSS_Api();

        if(apply_filters('uucss/queue/redis', true) && !isset($this->args['first_job']) && apply_filters('uucss/queue/purger-enabled', false)){

            $result = $uucss_api->post( 's/unusedcss',
                array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
                    [ 'url' => $this->url, 'priority' => isset($this->args['priority']), 'wp_nonce' => wp_create_nonce('uucss_job_hook'), 'hook_end_point' => trailingslashit(get_site_url())]
                ) );

            if($uucss_api->is_error($result)){

                UnusedCSS_DB::update_failed($this->url, $uucss_api->extract_error( $result ));

                $this->log( [
                    'log' => 'fetched data stored status failed',
                    'url' => $this->url,
                    'type' => 'uucss-cron'
                ] );

                return;
            }

            if(isset($result->id)){

                UnusedCSS_DB::update_meta(['job_id' => $result->id ], $this->url);
            }

        }else{

            $result = $uucss_api->post( 'purger',
                array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
                    [ 'url' => $this->url, 'service' => true ]
                ) );

            $this->log( [
                'log' => 'data fetched',
                'url' => $this->url,
                'type' => 'store'
            ] );

            if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

                UnusedCSS_DB::update_failed($this->url, $uucss_api->extract_error( $result ));

                $this->log( [
                    'log' => 'fetched data stored status failed',
                    'url' => $this->url,
                    'type' => 'store'
                ] );

                return;
            }

            $this->result       = $result;
            $this->purged_files = $result->data;

            if ( $this->purged_files && count( $this->purged_files ) > 0 ) {

                $files = $this->cache_files($this->purged_files);
                $this->add_link($files);
                $this->uucss_cached();

            }else{

                $this->add_link(null);
            }

        }


    }

    public function uucss_cached(){
        do_action( 'uucss/cached', [
            'url' => $this->url
        ]);
    }

    public function cache_files($purged_files) {

	    $files              = [];
	    $found_uucssed_file = false;

	    foreach ( $purged_files as $file ) {

		    if ( $this->is_uucss_file( $file->file ) ) {
			    $found_uucssed_file = true;
			    continue;
		    }

		    // don't cache excluded files
		    if ( $this->is_file_excluded( $this->options, $file->file ) ) {
			    continue;
		    }

            if(!$this->str_contains($file->file,'//inline-style@'))
            {

                $file_location = $this->append_cache_file_dir( $file->file, $file->css );

                $files[] = [
                    'original' => $file->file,
                    'uucss'    => $this->hashed_file_name( $file->file, $file->css ),
                ];

                $css = '';

                if ( $this->endsWith($file->file, '.php')) {
                    $css = '<?php header("Content-type: text/css; charset=utf-8"); ?>';
                }

                $css .=  $file->css;

                $this->file_system->put_contents( $file_location, $css );

                do_action( 'uucss/cache_file_created', $file_location, $file->css );

            }else{

                $files[] = [
                    'original' => $file->file,
                    'uucss'    => $file->css,
                ];
            }

	    }

	    return $files;
    }

    public function add_rule($files, $result = false){

        if($result){
            $this->result = $result;
        }

        $warnings = [];

        if(isset($this->result->meta->stats) && isset($this->result->meta->stats->using) && in_array('rapidload', $this->result->meta->stats->using)){

            $warnings[] = [
                "message" => "Clear your page cache"
            ];
        }

        $this->rule->status = 'success';
        $this->rule->hits = 0;
        $this->rule->files = $files ? serialize($files) : null;
        $this->rule->stats = isset($this->result->meta->stats) ? serialize($this->result->meta->stats) : null;
        $this->rule->warnings = isset($warnings) && count($warnings) > 0 ? serialize($warnings) : null;
        $this->rule->save();

    }

    public function add_link($files, $result = false){

        if($result){
            $this->result = $result;
        }

        $stats = isset($this->result) && isset($this->result->meta) ? $this->result->meta->stats : null;
        $warnings = isset($this->result) && isset($this->result->meta) ? $this->result->meta->warnings : null;

        if ( isset( $stats->beforeBytes ) ) {
            unset( $stats->beforeBytes );
        }
        if ( isset( $stats->afterBytes ) ) {
            unset( $stats->afterBytes );
        }

        if(isset($stats) && isset($stats->using) && in_array('rapidload', $stats->using)){

            $warnings[] = [
                "message" => "Clear your page cache"
            ];
        }

        if(isset($this->result) && isset($this->result->meta) && isset($this->result->meta->options) && isset($this->result->meta->options->redirectUrls)){

            $stats->redirectUrls = $this->result->meta->options->redirectUrls;
        }

        $path = new UnusedCSS_Path([
           'url' => $this->url
        ]);

        $path->files = isset($files) ? serialize($files) : null;
        $path->status = 'success';
        $path->hits = 0;
        $path->stats = isset($stats) ? serialize($stats) : null;
        $path->warnings = isset($warnings) && count($warnings) > 0 ? serialize($warnings) : null;
        $path->error = null;
        $path->save();

        $this->log( [
            'log' => 'fetched data stored status success',
            'url' => $this->url,
            'type' => 'store'
        ] );
    }


    protected function get_cache_page_dir()
    {
        $hash = $this->encode($this->url);

	    $source_dir = UnusedCSS::$base_dir . '/' . $hash;

	    if ( ! $this->file_system->exists( $source_dir ) ) {
		    $this->file_system->mkdir( $source_dir );
	    }

	    return $source_dir;
    }


	protected function append_cache_file_dir( $file, $content ) {
		return UnusedCSS::$base_dir . '/' . $this->hashed_file_name( $file, $content );
	}

	protected function hashed_file_name( $file, $content ) {

		$hash_made_from            = $this->options;
		$hash_made_from['content'] = $content;

		return $this->file_name( $file, $hash_made_from );
	}


}
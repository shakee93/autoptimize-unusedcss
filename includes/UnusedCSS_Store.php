<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Store {

	use UnusedCSS_Utils;

	public $provider;

    public $url;
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
     */
    public function __construct($provider, $url, $args = [])
    {

        $this->provider = $provider;
        $this->url = $url;
        $this->args = $args;
        $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

        $this->file_system = new UnusedCSS_FileSystem();

        $this->purge_css();

    }


    protected function purge_css() {

	    $this->log( [
	        'log' => 'fetching data',
            'url' => $this->url,
            'type' => 'store'
        ] );
	    $uucss_api = new UnusedCSS_Api();

	    $result = $uucss_api->post( 'purger',
		    array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
			    [ 'url' => $this->url ]
		    ) );

        $this->log( [
            'log' => 'data fetched',
            'url' => $this->url,
            'type' => 'store'
        ] );

	    if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {

	        $link_data = array(
	            'url' => $this->url,
                'files' => null,
                'status' => 'failed',
                'meta' => [
                    "error" => $this->extract_error( $result )
                ]
            );

            $link_data = UnusedCSS_DB::transform_link($link_data, false);

            UnusedCSS_DB::add_link($link_data, true);

	        /*UnusedCSS_Settings::add_link( $this->url, null, "failed", [
			    "error" => $this->extract_error( $result )
		    ] );*/

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
		    $this->cache_files();
	    }else{
            $this->add_link(null);
        }

    }


    protected function cache_files() {

	    $files              = [];
	    $found_uucssed_file = false;

	    foreach ( $this->purged_files as $file ) {

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

	    $this->add_link($files);

	    $this->args['url'] = $this->url;
	    do_action( 'uucss/cached', $this->args );

    }

    public function add_link($files){
        $stats = $this->result->meta->stats;
        $warnings = $this->result->meta->warnings;

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

        $link_data = array(
            'url' => $this->url,
            'files' => $files,
            'status' => 'success',
            'meta' => [
                "id" => $this->result->meta->id,
                "stats" => $stats,
                "warnings" => $warnings
            ]
        );

        $link_data = UnusedCSS_DB::transform_link($link_data, false);

        UnusedCSS_DB::add_link($link_data);

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

	protected function extract_error( $result ) {
		if ( gettype( $result ) === 'string' ) {
			return [
				'code'    => 500,
				'message' => $result
			];
		}

		if ( gettype( $result ) === 'object' && isset( $result->errors ) ) {

			return [
				'code'    => $result->errors[0]->code,
				'message' => $result->errors[0]->detail
			];

		}

		return [
			'code'    => 500,
			'message' => 'Unknown Error Occurred'
		];
	}


}
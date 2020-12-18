<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Store {

	use UnusedCSS_Utils;

	public $base = 'cache/autoptimize/uucss';
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

        // load wp filesystem related files;
        if (!class_exists('WP_Filesystem_Base')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            WP_Filesystem();
        }

        global $wp_filesystem;
        $this->file_system = $wp_filesystem;

        $this->purge_css();

    }


    protected function purge_css() {

	    $this->log( 'is caching now : ' . $this->url );
	    $uucss_api = new UnusedCSS_Api();

	    $result = $uucss_api->post( 'purger',
		    array_merge( ( isset( $this->args['options'] ) ) ? $this->args['options'] : [],
			    [ 'url' => $this->url ]
		    ) );

	    if ( ! isset( $result ) || isset( $result->errors ) || ( gettype( $result ) === 'string' && strpos( $result, 'cURL error' ) !== false ) ) {
		    UnusedCSS_Settings::add_link( $this->url, null, "failed", [
			    "error" => $this->extract_error( $result )
		    ] );

		    return;
	    }

	    $this->result       = $result;
	    $this->purged_files = $result->data;

	    if ( $this->purged_files && count( $this->purged_files ) > 0 ) {
		    $this->cache_files();
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

		    $file_location = $this->append_cache_file_dir( $file->file, $file->css );

		    $files[] = [
			    'original' => $file->file,
			    'uucss'    => $this->hashed_file_name( $file->file, $file->css ),
		    ];

		    $this->file_system->put_contents( $file_location, $file->css, FS_CHMOD_FILE );

		    do_action( 'uucss/cache_file_created', $file_location, $file->css );

	    }

	    if ( $found_uucssed_file ) {
		    self::log( 'uucssed file found : ' . $this->url );

		    return;
	    }

	    $stats = $this->result->meta->stats;
	    $warnings = $this->result->meta->warnings;

	    if ( isset( $stats->beforeBytes ) ) {
		    unset( $stats->beforeBytes );
	    }
	    if ( isset( $stats->afterBytes ) ) {
		    unset( $stats->afterBytes );
	    }

	    UnusedCSS_Settings::add_link( $this->url, $files, "success", [
	        "id" => $this->result->meta->id,
		    "stats" => $stats,
		    "warnings" => $warnings
	    ] );

	    $this->args['url'] = $this->url;
	    do_action( 'uucss/cached', $this->args );

    }


	public function is_file_excluded( $options, $file ) {

		if ( isset( $options['uucss_excluded_files'] ) && !empty($options['uucss_excluded_files']) ) {
			$files = explode( ',', $options['uucss_excluded_files'] );

			foreach ( $files as $excluded_file ) {

				if ( $this->str_contains( $file, trim($excluded_file) ) ) {
					return true;
				}

			}
		}

		return false;
    }


    public function get_base_dir(){

        $root = $this->file_system->wp_content_dir()  . $this->base;

        if(!$this->file_system->exists($root)) {
            $this->file_system->mkdir($root);
        }

        return $root;
    }


    protected function get_cache_page_dir()
    {
        $hash = $this->encode($this->url);

	    $source_dir = $this->get_base_dir() . '/' . $hash;

	    if ( ! $this->file_system->exists( $source_dir ) ) {
		    $this->file_system->mkdir( $source_dir );
	    }

	    return $source_dir;
    }


	protected function append_cache_file_dir( $file, $content ) {
		return $this->get_base_dir() . '/' . $this->hashed_file_name( $file, $content );
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
<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {

    use UnusedCSS_Utils;

	public $deps_available = false;

	private $uucss_ao_base;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {

	    new UnusedCSS_Feedback();

        add_filter('plugin_row_meta',[$this, 'add_plugin_row_meta_links'],10,4);

        $this->add_update_message();

	    parent::enqueueGlobalScript();

	    $this->provider = 'autoptimize';

	    UnusedCSS_DB::check_db_updates();

	    register_deactivation_hook( UUCSS_PLUGIN_FILE, [ $this, 'vanish' ] );

	    /**
	     * initialize on-boarding functions
	     */
	    new UnusedCSS_Autoptimize_Onboard( $this );

	    if ( ! $this->check_dependencies() ) {
		    return;
	    }

        $this->uucss_ao_base = new autoptimizeStyles(null);
        $this->uucss_ao_base->cdn_url = autoptimizeOptionWrapper::get_option( 'autoptimize_cdn_url' );

	    $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

	    add_action( 'autoptimize_action_cachepurged', [ $this, 'clear_cache' ] );


	    add_action( 'uucss/content_updated', [ $this, 'refresh' ], 10, 1 );
	    add_action( 'uucss/cached', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_cleared', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_file_created', [ $this, 'create_server_compressed_files' ], 10, 2 );

	    parent::__construct();

	    /**
	     * Initialize admin area functions
	     */
	    new UnusedCSS_Autoptimize_Admin( $this );

	    new UnusedCSS_Queue();
    }

    function add_update_message(){

        global $pagenow;

        if ( 'plugins.php' === $pagenow )
        {
            $file   = basename( UUCSS_PLUGIN_FILE );
            $folder = basename( dirname( UUCSS_PLUGIN_FILE ) );
            $hook = "in_plugin_update_message-{$folder}/{$file}";
            add_action( $hook, [$this, 'render_update_message'], 20, 2 );
        }

    }

    function render_update_message($plugin_data, $r ){

        $data = file_get_contents( 'https://raw.githubusercontent.com/shakee93/autoptimize-unusedcss/master/readme.txt?format=txt' );

        $changelog  = stristr( $data, '== Changelog ==' );

        $changelog = preg_split("/\=(.*?)\=/", str_replace('== Changelog ==','',$changelog));

        if(isset($changelog[1])){

            $changelog = explode('*', $changelog[1]);

            array_shift($changelog);

            echo '<div style="margin-bottom: 1em"><strong style="padding-left: 25px;">What\'s New ?</strong><ol style="list-style-type: disc;margin: 5px 50px">';

            foreach ($changelog as $index => $log){
                if($index == 3){
                    break;
                }
                echo '<li style="margin-bottom: 0">' . preg_replace("/\r|\n/","",$log) . '</li>';
            }

            echo '</ol></div><p style="display: none" class="empty">';

        }
    }

    function add_plugin_row_meta_links($plugin_meta, $plugin_file, $plugin_data, $status)
    {
        if(isset($plugin_data['TextDomain']) && $plugin_data['TextDomain'] == 'autoptimize-unusedcss'){
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us" target="_blank">Documentation</a>';
            $plugin_meta[] = '<a href="https://rapidload.zendesk.com/hc/en-us/requests/new" target="_blank">Submit Ticket</a>';
        }
        return $plugin_meta;
    }

    public function is_url_allowed($url = null, $args = null)
    {
	    if ( ! $url ) {
		    $url = $this->url;
	    }

	    if ( ! parent::is_url_allowed( $url, $args ) ) {
		    return false;
	    }

	    if ( isset( $this->options['uucss_excluded_links'] ) && ! empty( $this->options['uucss_excluded_links'] ) ) {
		    $exploded = explode( ',', $this->options['uucss_excluded_links'] );

		    foreach ( $exploded as $pattern ) {

			    if ( filter_var( $pattern, FILTER_VALIDATE_URL ) ) {

                    $pattern = parse_url( $pattern );

				    $path = $pattern['path'];
				    $query = isset($pattern['query']) ? '?' . $pattern['query'] : '';

				    $pattern = $path . $query;

			    }

			    // check using string contains instead of regex
			    if ( self::str_contains( $url, $pattern ) ) {
				    $this->log( 'skipped : ' . $url );
                    return false;
                }

            }
        }

        return true;
    }

	public function check_dependencies() {

		if(function_exists('autoptimize')) {
			$this->deps_available = true;
		}else {
            $notice = [
	            'action'  => 'on-board',
	            'title'   => 'RapidLoad Power Up',
	            'message' => 'Complete on-boarding steps, it only takes 2 minutes.',

	            'main_action' => [
		            'key'   => 'Get Started',
		            'value' => admin_url( 'options-general.php?page=uucss-onboarding' )
	            ],
	            'type'        => 'warning'
            ];
            self::add_advanced_admin_notice($notice);
            UnusedCSS_Autoptimize_Onboard::display_get_start_link();
		}

		return $this->deps_available;
	}


    public function enabled() {

        if (!parent::enabled()) {
            return false;
        }

        if (!UnusedCSS_Autoptimize_Admin::enabled()) {
            return false;
        }

        return true;
    }


    public function get_css(){


        add_action('autoptimize_filter_cache_getname', function($ao_css){
            $this->css[] = $ao_css;
        });


    }


    public function replace_css(){

        self::log([
            'log' => 'replacing css initiated',
            'url' => $this->url,
            'type' => 'injection'
        ]);

	    $this->url = $this->transform_url( $this->url );

	    if ( ! UnusedCSS_Settings::link_exists( $this->url ) ) {
		    return;
	    }

	    if ( isset( $_REQUEST['no_uucss'] ) ) {
		    return;
	    }

	    $data = UnusedCSS_Settings::get_link( $this->url );

	    if ( $data['status'] !== 'success' && ! $data['files'] ) {
		    return;
	    }

	    // inject frontend scripts
	    $this->frontend_scripts( $data );

	    add_action( 'autoptimize_html_after_minify', function ( $html ) use ( $data ) {

            self::log([
                'log' => 'injecting css initiated after autoptimize minify',
                'url' => $data['url'],
                'type' => 'injection'
            ]);

            $html = $this->inject_css( $html, $data );

		    return $html;
	    }, 99 );

        self::log([
            'log' => 'injection initialized',
            'url' => $this->url,
            'type' => 'injection'
        ]);
    }

	public static function is_css( $el ) {
		return $el->rel === 'stylesheet' || ($el->rel === 'preload' && $el->as === 'style');
	}


	public function inject_css( $html, $data ) {

        self::log([
            'log' => 'injection started',
            'url' => $data['url'],
            'type' => 'injection'
        ]);

        if ( ! class_exists( \simplehtmldom\HtmlDocument::class ) ) {
			self::log( 'Dom parser not loaded' );
			return $html;
		}

		$dom = new \simplehtmldom\HtmlDocument(
			$html,
			false,
			false,
			\simplehtmldom\DEFAULT_TARGET_CHARSET,
			false
		);

		$inject = (object) [
			"parsed_html"           => false,
			"found_sheets"          => false,
			"found_css_files"       => [],
			"found_css_cache_files" => [],
			"ao_optimized_css" => [],
			"injected_css_files"    => [],
			"successfully_injected"    => true,
		];

		if ( $dom ) {
			$inject->parsed_html = true;

			$dom->find( 'html' )[0]->uucss = true;

            self::log([
                'log' => 'header injection done',
                'url' => $data['url'],
                'type' => 'injection'
            ]);


			$sheets = $dom->find( 'link' );

			foreach ( $sheets as $sheet ) {

			    $parent = $sheet->parent();

                if(isset($parent) && $parent->tag == 'noscript'){
                    continue;
                }

                $link = $sheet->href;

				$inject->found_sheets = true;

			    if ( self::is_css( $sheet ) ) {

				    array_push( $inject->found_css_files, $link );

				    $link = apply_filters('uucss/cdn_url', $link);

				    $file = array_search( $link, array_column( $data['files'], 'original' ) );

				    if ( ! $file ) {
				    	// Retry to see if file can be found with CDN url
					    $file = array_search( $this->uucss_ao_base->url_replace_cdn($link), array_column( $data['files'], 'original' ) );
				    }

				    $key = isset($data['files']) ? $file : null;

				    // check if we found a script index and the file exists
				    if ( is_numeric( $key ) && $this->cache_file_exists( $data['files'][ $key ]['uucss'] ) ) {
					    $uucss_file = $data['files'][ $key ]['uucss'];

					    array_push( $inject->found_css_cache_files, $link );

					    $newLink = $this->get_cached_file( $uucss_file, $this->uucss_ao_base->cdn_url );

					    // check the file is processed via AO
					    $is_ao_css = $this->ao_handled($link);

					    if($is_ao_css){

					        array_push($inject->ao_optimized_css, $link);

                        }

					    if ( $is_ao_css || isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {

						    $sheet->uucss = true;
						    $sheet->href  = $newLink;

						    if ( isset( $this->options['uucss_inline_css'] ) ) {
							    $this->inline_sheet( $sheet, $uucss_file );
						    }

                            array_push( $inject->injected_css_files, $newLink );

					    }

				    }
				    else {

				        $uucss_injected = $sheet->getAttribute('uucss');

				        if(!$uucss_injected && !$this->is_file_excluded($this->options, $link)){

                            $inject->successfully_injected = false;

                            if(!in_array($link, array_column($data['meta']['warnings'], 'file'))){

                                $data['meta']['warnings'][] = [
                                    "file" => $link,
                                    "message" => "RapidLoad optimized version for the file missing."
                                ];

                            }

                        }

				    }
			    }

		    }

			$time_diff = 0;

			if(isset($data['time'])){
                $time_diff = time() - $data['time'];
            }

            self::log([
                'log' => json_encode((array) $inject),
                'url' => $data['url'],
                'type' => 'injection'
            ]);


            if($inject->successfully_injected && $data['attempts'] > 0){

                UnusedCSS_DB::reset_attempts($data['url']);

                $dom->find( 'body' )[0]->uucss = true;

                UnusedCSS_DB::update_success_count($data['url']);

                self::log([
                    'log' => 'injection success and attempts reset to 0',
                    'url' => $data['url'],
                    'type' => 'injection'
                ]);

            }else if(!$inject->successfully_injected && ($data['attempts'] <= 3 || ($time_diff > 86400 && $data['attempts'] <= 6))){

                UnusedCSS_DB::update_meta([
                    'status' => 'queued',
                    'attempts' => $data['attempts'] + 1
                ], $data['url']);

                self::log([
                    'log' => 're-queued due to warnings',
                    'url' => $data['url'],
                    'type' => 'injection'
                ]);

            }else if(!$inject->successfully_injected){

                UnusedCSS_DB::update_meta([
                    'warnings' => $data['meta']['warnings']
                ], $data['url']);

                self::log([
                    'log' => 'file not found warnings added',
                    'url' => $data['url'],
                    'type' => 'injection'
                ]);

            }else{

                $dom->find( 'body' )[0]->uucss = true;

                UnusedCSS_DB::update_success_count($data['url']);

                self::log([
                    'log' => 'injection success',
                    'url' => $data['url'],
                    'type' => 'injection'
                ]);

            }

			header( 'uucss:' . 'v' . UUCSS_VERSION . ' [' . count( $inject->found_css_files ) . count( $inject->found_css_cache_files ) . count( $inject->injected_css_files ) . ']' );

			return $dom;

		}

		return $html;
	}

	public function ao_handled($link){
        $ao_base = $this->uucss_ao_base;
        return array_filter( $this->css, function ( $item ) use ( $link, $ao_base ) {
            return $this->str_contains( $ao_base->url_replace_cdn($item), $link );
        } );
    }

	protected function inline_sheet( $sheet, $link ) {

		$inline = $this->get_inline_content( $link );

		if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/inline-css-limit', 5 * 1000 ) ) {
			return;
		}

		$sheet->outertext = '<style inlined-uucss="' . basename( $link ) . '">' . $inline['content'] . '</style>';

	}


	public function flush_page_cache( $args ) {
		$url = null;

		//autoptimizeCache::flushPageCache();

		if ( isset( $args['url'] ) ) {
			$url = $this->transform_url( $args['url'] );
		}

		$this->flush_lw_varnish( $url );

	}

    public function flush_lw_varnish($url = null)
    {
        if (!class_exists('LW_Varnish_Cache_Purger')) {
            return;
        }

	    if ( $url ) {
		    LW_Varnish_Cache_Purger::get_instance()->purge_url( $url );
		    LW_Varnish_Cache_Purger::get_instance()->do_purge();

		    return;
	    }

	    LW_Varnish_Cache_Purger::get_instance()->do_purge_all();
    }


	public function is_autoptimize_installed() {
		$file = ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php';

		return file_exists( $file );
	}


	public function create_server_compressed_files( $file_location, $css ) {

		if ( apply_filters( 'autoptimize_filter_cache_create_static_gzip', false ) ) {

			// Create an additional cached gzip file.
			file_put_contents( $file_location . '.gz', gzencode( $css, 9, FORCE_GZIP ) );

			// If PHP Brotli extension is installed, create an additional cached Brotli file.
			if ( function_exists( 'brotli_compress' ) ) {
				file_put_contents( $file_location . '.br', brotli_compress( $css, 11, BROTLI_GENERIC ) );
			}

		}

	}

}



<?php


/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {

    use UnusedCSS_Utils;

	public $deps_available = false;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {
        parent::enqueueGlobalScript();

        $this->provider = 'autoptimize';

	    register_deactivation_hook(UUCSS_PLUGIN_FILE, [$this, 'vanish']);

	    //$this->register_dependency_activation_hook();

	    if ( ! $this->check_dependencies() ) {
		    return;
	    }

	    $this->options = UnusedCSS_Autoptimize_Admin::fetch_options();

	    add_action( 'autoptimize_action_cachepurged', [ $this, 'clear_cache' ] );


	    add_action( 'uucss/content_updated', [ $this, 'refresh' ], 10, 1 );
	    add_action( 'uucss/cached', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_cleared', [ $this, 'flush_page_cache' ], 10, 2 );
	    add_action( 'uucss/cache_file_created', [ $this, 'create_server_compressed_files' ], 10, 2 );


	    add_filter( 'query_vars', function ( $vars ) {

		    $vars[] = 'no_uucss';

		    return $vars;

	    } );

	    parent::__construct();

    }


    public function register_dependency_activation_hook(){

	    if ( $this->is_autoptimize_installed() && ! is_plugin_active(AUTOPTIMIZE_PLUGIN_FILE)) {

		    if ( get_option( 'ao_css_options_updated' ) != null ) {
			    return;
		    }

		    register_activation_hook( ABSPATH . PLUGINDIR . '/autoptimize/autoptimize.php', function () {

			    $fields = [
				    "autoptimize_css"                => true,
				    "autoptimize_css_aggregate"      => true,
                    "autoptimize_css_include_inline" => true,
                    "autoptimize_cache_nogzip" => true,
                    "autoptimize_minify_excluded" => true,
                    "autoptimize_cache_fallback" => true,
                    "autoptimize_optimize_logged" => true
                ];
                foreach ($fields as $key => $value){
                    autoptimizeOptionWrapper::update_option($key,$value);
                }
                update_option('ao_css_options_updated', true);
            });
        }
    }

    public function is_url_allowed($url = null, $args = null)
    {
        if (!$url) {
            $url = $this->url;
        }

        if(!parent::is_url_allowed($url, $args)){
            return false;
        }

        $options = UnusedCSS_Autoptimize_Admin::fetch_options();

        if (isset($options['uucss_excluded_links']) && !empty($options['uucss_excluded_links'])) {
            $exploded = explode(',', $options['uucss_excluded_links']);

            // TODO : improve this
            foreach ($exploded as $pattern) {

	            if (filter_var($pattern, FILTER_VALIDATE_URL)) {
		            $pattern = parse_url($pattern)['path'];
	            }

            	// check using string contains instead of regex
                if (self::str_contains( $url, $pattern )) {
                    $this->log('skipped : ' . $url);
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
			$notice = null;
			if ( $this->is_autoptimize_installed() ) {
				$notice = [
					'action'      => 'activate',
					'title'       => 'UnusedCSS Power Up',
					'message'     => 'Please activate autoptimize plugin',
					'main_action' => [
						'key'   => 'Activate Autoptimize',
						'value' => self::activate_plugin( 'autoptimize/autoptimize.php' )
					],
					'type'        => 'warning'
				];
            }else{
                $notice = [
                    'action' => 'install',
                    'message' => 'Autoptimize UnusedCSS Plugin only works when autoptimize is installed',
                    'main_action' => [
                        'key' => 'Install',
                        'value' =>  network_admin_url( 'plugin-install.php?tab=plugin-information&plugin=autoptimize' )
                    ],
                    'type' => 'danger'
                ];
            }


            self::add_advanced_admin_notice($notice);
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

	    $this->url = $this->transform_url( $this->url );

	    if ( ! UnusedCSS_Settings::link_exists( $this->url ) ) {
		    return;
	    }

	    if ( get_query_var( 'no_uucss' ) == 'true' ) {
		    return;
	    }

	    $data = UnusedCSS_Settings::get_link( $this->url );

	    if ( $data['status'] !== 'success' && ! $data['files'] ) {
		    return;
	    }

	    add_action( 'autoptimize_html_after_minify', function ( $html ) use ( $data ) {

		    $html = $this->inject_css( $html, $data );

		    return $html;
	    }, 99 );

    }

	public static function is_css( $el ) {
		return $el->rel === 'stylesheet' || $el->rel === 'preload' && $el->as === 'style';
	}


	public function inject_css( $html, $data ) {
		$dom = HungCP\PhpSimpleHtmlDom\HtmlDomParser::str_get_html( $html );

		$inject = (object) [
			"parsed_html"           => false,
			"found_sheets"          => false,
			"found_css_files"       => [],
			"found_css_cache_files" => [],
			"injected_css_files"    => [],
		];

	    if ( $dom ) {
		    $inject->parsed_html = true;


		    if ( $head = $dom->find( 'head', 0 ) ) {

			    // dont inject if we found content is being updated
			    if ( UnusedCSS_Settings::content_hash( $this->url, md5( $head->innertext ) ) ) {
				    return $dom;
			    }

		    }

		    $dom->find( 'html' )[0]->uucss = true;

		    $sheets = $dom->find( 'link' );

		    foreach ( $sheets as $sheet ) {
			    $link = $sheet->href;

			    $inject->found_sheets = true;

			    if ( self::is_css( $sheet ) ) {

				    array_push( $inject->found_css_files, $link );

				    $key = array_search( $link, array_column( $data['files'], 'original' ) );

				    if ( isset( $data['files'][ $key ] ) && $this->cache_file_exists( $data['files'][ $key ]['uucss'] ) ) {

					    array_push( $inject->found_css_cache_files, $link );

					    $newLink = $this->get_cached_file( $data['files'][ $key ]['uucss'], autoptimizeOptionWrapper::get_option( 'autoptimize_cdn_url', '' ) );

					    array_push( $inject->injected_css_files, $newLink );

					    if ( in_array( $link, $this->css ) || isset( $this->options['autoptimize_uucss_include_all_files'] ) ) {

						    $sheet->uucss = true;
						    $sheet->href  = $newLink;

						    if ( isset( $this->options['uucss_inline_css'] ) ) {
							    $this->inline_sheet( $sheet, $data['files'][ $key ]['uucss'] );
						    }

					    }

				    }
			    }

		    }

//		    self::log( $inject );

		    return $dom;

	    }

//	    self::log( $inject );

		return $html;
	}


	protected function inline_sheet( $sheet, $link ) {

		$inline = $this->get_inline_content( $link );

		if ( ! isset( $inline['size'] ) || $inline['size'] >= apply_filters( 'uucss/inline-css-limit', 15 * 1000 ) ) {
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

		if ( class_exists( 'Cache_Enabler' ) ) {

			if ( $url ) {
				Cache_Enabler::clear_page_cache_by_url( $url );
			} else {
				Cache_Enabler::clear_total_cache();
			}

		}

		if ( function_exists( 'rocket_clean_post' ) && function_exists( 'rocket_clean_domain' ) ) {
			if ( $url ) {
				rocket_clean_post( url_to_postid( $url ) );
			} else {
				rocket_clean_domain();
			}
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

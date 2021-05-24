<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
class UnusedCSS_Autoptimize extends UnusedCSS {

    use RapidLoad_Utils;

	public $deps_available = false;

	public $uucss_ao_base;

    /**
     * UnusedCSS constructor.
     */
    public function __construct()
    {

	    $this->provider = 'autoptimize';

	    self::$provider_path = 'autoptimize/autoptimize.php';

        $this->options = UnusedCSS_Admin::fetch_options();

        add_filter('uucss/cache-base-dir', function ($value){
            return trailingslashit(defined('AUTOPTIMIZE_CACHE_CHILD_DIR') ? AUTOPTIMIZE_CACHE_CHILD_DIR : '/cache/autoptimize/');
        });

        parent::__construct();

        new UnusedCSS_Autoptimize_Onboard( $this );

        if ( ! $this->check_dependencies() ) {
            return;
        }

        $this->uucss_ao_base = new autoptimizeStyles(null);
        $this->uucss_ao_base->cdn_url = autoptimizeOptionWrapper::get_option( 'autoptimize_cdn_url' );

	    if(apply_filters('uucss/autoptimize/clear-on-purge', true)){

            add_action( 'autoptimize_action_cachepurged', function (){
                $args['soft'] = true;
                self::log([
                    'log' => 'autoptimize cache purge fired',
                    'url' => null,
                    'type' => 'purging'
                ]);
                $this->clear_cache(null, $args);
            });

        }

	    add_filter('uucss/enqueue/provider-cdn-url', function ($link){
	        return $this->uucss_ao_base->url_replace_cdn($link);
        },10,1);

	    add_filter('uucss/enqueue/provider-handled-file', function ($handled , $link ){
	        return count($this->ao_handled($link)) > 0;
        },10,2);

	    add_filter('uucss/enqueue/cache-file-url', function ($uucss_file){
	        return $this->get_cached_file($uucss_file, $this->uucss_ao_base->cdn_url);
        },10,1);

	    add_filter('uucss/enqueue/inline-css-enabled', function ($value){
	        return autoptimizeOptionWrapper::get_option( 'autoptimize_css_include_inline' ) != 'on';
        },10,1);

	    add_action( 'uucss/cache_file_created', [ $this, 'create_server_compressed_files' ], 10, 2 );

	    /**
	     * Initialize admin area functions
	     */
	    new UnusedCSS_Autoptimize_Admin( $this );
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

	    add_action( 'autoptimize_html_after_minify', function ( $html ) {
            return apply_filters('uucss/enqueue/content', $html);
	    }, 99 );

    }

	public function ao_handled($link){
        $ao_base = $this->uucss_ao_base;
        return array_filter( $this->css, function ( $item ) use ( $link, $ao_base ) {
            return $this->str_contains( $ao_base->url_replace_cdn($item), preg_replace('/\?.*/', '', $link) );
        } );
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



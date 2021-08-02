<?php

defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS
 */
trait RapidLoad_Utils {

    private static $log_file_system = null;

	public function url_origin( $s, $use_forwarded_host = false ) {
		$ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
		$sp       = strtolower( $s['SERVER_PROTOCOL'] );
        $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
        $port     = $s['SERVER_PORT'];
        $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
        $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
        $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    public function get_current_url($post_id = null)
    {
	    if ( $post_id ) {
		    return get_permalink( get_post( $post_id ) );
	    }


	    global $wp;

	    if ( $wp ) {

		    $query = ( isset( $_SERVER['QUERY_STRING'] ) && ! empty( $_SERVER['QUERY_STRING'] ) ) ? '?' . $_SERVER['QUERY_STRING'] : '';
		    $url   = home_url( $wp->request );

		    if ( ! empty( $url ) && substr( $url, - 1 ) !== '/' ) {
			    $url = $url . '/';
		    }

		    $url = $url . $query;

		    if ( ! empty( $url ) ) {
			    return $url;
		    }


	    }

	    return $this->url_origin( $_SERVER, false ) . $_SERVER['REQUEST_URI'];
    }

    public function get_current_rule($user_defined_rules = []){

        $rules = RapidLoad_Base::get()->get_pre_defined_rules();

        $related_rule = false;

        foreach ($rules as $rule){

            if(!isset($rule['rule']) || isset($rule['rule']) && !in_array($rule['rule'], $user_defined_rules)){

                continue;
            }

            if(isset($rule['callback']) && is_callable($rule['callback']) && $rule['callback']()){

                $related_rule = $rule;
                break;
            }
        }

        return $related_rule;
    }

    public static function get_defined_rules( $with_permalink = false){

        $rules = apply_filters('uucss/rules', []);

        $rules_with_permalink = [];
        foreach ($rules as $rule){
            if(!isset($rule['permalink']) && isset($rule['name']) && isset($rule['custom_post']) && $with_permalink){
                $posts = get_posts([
                    'posts_per_page' => 1,
                    'post_type' => $rule['name']
                ]);
                $rule['permalink'] = !empty($posts) ? get_permalink($posts[0]->ID) : trailingslashit(get_site_url());
            }else{
                $rule['permalink'] = trailingslashit(get_site_url());
            }
            array_push($rules_with_permalink, $rule);
        }
        usort($rules_with_permalink, function ($a, $b){
            return $a['priority'] > $b['priority'];
        });
        return $rules_with_permalink;
    }

    public function is_cli(){

        if ( defined( 'WP_CLI' ) && WP_CLI ) {
            return true;
        }

        return false;
        
    }

    private static function get_log_instance(){
	    if(!self::$log_file_system){
	        return new RapidLoad_FileSystem();
        }
	    return self::$log_file_system;
    }

    private static function get_log_option(){
        if(is_multisite()){

            $option = get_blog_option(get_current_blog_id(), 'autoptimize_uucss_settings', false);
            return isset($option['uucss_enable_debug']);
        }

        $option = get_site_option( 'autoptimize_uucss_settings', false );
        return  isset($option['uucss_enable_debug']);
    }

    public static function log( $object, $callee = false ) {

	    if ( ! self::get_log_option() || (defined( 'UUCSS_DEBUG' ) && UUCSS_DEBUG == false)) {
		    return false;
	    }

	    $data = is_string( $object ) ? $object : json_encode( $object, JSON_PRETTY_PRINT );
	    //error_log( "[UUCSS_LOG] " . $data );

        $data = is_string( $object ) ? [ 'log' => $object] : $object;

        if(!isset($data['time'])){
            $data['time'] = time();
        }

        if(!isset($data['type'])){
            $data['type'] = 'general';
        }

        $data = json_encode($data);

        $log_instance = self::get_log_instance();

        if($log_instance->exists(UUCSS_LOG_DIR .'debug.log') && !empty($log_instance->get_contents(UUCSS_LOG_DIR .'debug.log'))){
            $data = ",\n" . $data;
        }

        $log_instance->put_contents(UUCSS_LOG_DIR .'debug.log', $data, FILE_APPEND);

	    if ( $callee ) {

		    error_log( "[UUCSS_LOG] " . json_encode( [
				    "file" => debug_backtrace()[1]['file'],
				    "function" => debug_backtrace()[1]['function'],
				    "class" => debug_backtrace()[1]['class'],
				    "args" => debug_backtrace()[1]['args'],
			    ], JSON_PRETTY_PRINT));

	    }

	    return $object;
    }

    public static function uucss_log($object){

	    if ( ! self::get_log_option() || (defined( 'UUCSS_DEBUG' ) && UUCSS_DEBUG == false)) {
		    return false;
	    }

	    $data = is_string( $object ) ? $object : json_encode( $object, JSON_PRETTY_PRINT );
	    error_log( "[UUCSS_LOG] " . $data );
    }

    public static function add_admin_notice($message, $type='error') {

        add_action('admin_notices', function () use ($message, $type) {

            echo "<div class=\"notice notice-$type is-dismissible\">
                    <p>$message</p>
                 </div>";

        });

    }

    public static function add_advanced_admin_notice($notice) {

        if(!isset($notice)){
            return;
        }
        add_action('admin_notices', function () use ($notice) {

            if(!isset($notice['action'])){
                $notice['action'] = 'uucss-action';
            }

            if(!isset($notice['type'])){
                $notice['type'] = 'error';
            }

            if(!isset($notice['title'])){
                $notice['title'] = 'RapidLoad Power Up';
            }

            if(!isset($notice['message'])){
                $notice['message'] = null;
            }

            if(!isset($notice['actions'])){
                $notice['actions'] = [];
            }

	        if ( ! isset( $notice['main_action'] ) ) {
		        $notice['main_action'] = [];
	        }

	        ?>
            <div class="uucss-notice-action notice notice-action notice-action-<?php echo $notice['action']; ?> notice-<?php echo $notice['type']; ?>">
                <div class="notice-action-inner">
                    <div class="notice-icon">
                        <div class="logo-wrapper">
                            <img
                                    src="<?php echo UUCSS_PLUGIN_URL . 'assets/images/logo-icon.svg' ?>" width="40"
                                    alt="RapidLoad logo">
                        </div>
                    </div>
                    <div class="notice-icon-content">
		                <?php if ( isset( $notice['title'] ) ) : ?>
                            <h2 class="uucss-notice-title"><?php echo $notice['title'] ?></h2>
				        <?php endif; ?>
                        <p>
					        <?php echo $notice['message']; ?>
                        </p>
                        <?php if(!empty($notice['actions'])): ?>
                            <p>
                                <?php foreach ($notice['actions'] as $key => $value) : ?>
                                    <a class="button button-primary" href="<?php echo $value?>"><?php echo $key?></a>
                                <?php endforeach; ?>
                            </p>
                        <?php endif;  ?>

                    </div>
                    <?php if(!empty($notice['main_action'])): ?>
                    <div class="notice-main-action">
                        <p>
                            <a class="button button-primary" href="<?php echo $notice['main_action']['value'] ?>"><?php echo $notice['main_action']['key']?></a>
                        </p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            <?php

        });

    }

    protected function encode($data)
    {
        return rtrim(md5($data));
    }

    function dirSize($directory) {
        $size = 0;
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file){
            $size+=$file->getSize();
        }
        return $size;
    }


    function human_file_size($bytes, $decimals = 2) {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }


    protected function file_name($file, $hash_suffix = null){
    	$file_hash = $this->encode($file . json_encode($hash_suffix));

	    $file_name = explode( "?", basename( $file ) )[0];

	    $final_file_name = 'uucss-' . $file_hash;

	    if ( apply_filters( 'uucss/suffix-original-filename', true ) ) {
            $final_file_name .= '-' . $file_name;
	    }

	    if ( !$this->str_contains( $final_file_name, '.' ) ) {
		    $final_file_name .= '.css';
	    }

	    return $final_file_name;
    }

	function str_contains( $string, $find ) {

	    if(empty($find)){
	        return false;
        }

		if ( strpos( $string, $find ) !== false ) {
			return true;
		}

		return false;
	}

	function endsWith( $haystack, $needle ) {
		$length = strlen( $needle );
		if( !$length ) {
			return true;
		}
		return substr( $haystack, -$length ) === $needle;
	}

	function transform_url( $url ) {

		$url_parts = parse_url( $url );

		$options = RapidLoad_Base::fetch_options();

		if ( ! isset( $url_parts['host'] ) || ! isset( $url_parts['scheme'] ) ) {
			return $url;
		}

		if ( ! isset( $options['uucss_query_string'] ) || empty( $options['uucss_query_string'] ) ) {
			$path = ( isset( $url_parts['path'] ) ) ? $url_parts['path'] : '';
			$url  = $url_parts['scheme'] . '://' . $url_parts['host'] . $path;

            if(apply_filters('uucss/url/trailingslash', true)){
                $url = trailingslashit($url);
            }else{
                $url = rtrim($url,'/');
            }

		}elseif (!isset($url_parts['query']) || empty($url_parts['query'])){

            if(apply_filters('uucss/url/trailingslash', true)){
                $url = trailingslashit($url);
            }else{
                $url = rtrim($url,'/');
            }

        }

		return apply_filters('uucss/url', $url);
	}

	public static function activate_plugin( $plugin, $action = 'activate' ) {

		if ( strpos( $plugin, '/' ) ) {
			$plugin = str_replace( '\/', '%2F', $plugin );
		}

		$url = sprintf( admin_url( 'plugins.php?action=' . $action . '&plugin=%s&plugin_status=all&paged=1&s' ), $plugin );

		$_REQUEST['plugin'] = sanitize_text_field( $plugin );
		$url                = wp_nonce_url( $url, $action . '-plugin_' . $plugin );

		return $url;
	}

	public function is_uucss_file( $url = null ) {

		if ( ! $url ) {
			return false;
		}

		return preg_match( '/uucss\/uucss-[a-z0-9]{32}-/', $url );
	}

    public static function activation_url( $action, $to = 'options-general.php?page=uucss' ) {

	    if ( ! defined( 'UUCSS_ACTIVATION_URL' ) ) {
		    define( 'UUCSS_ACTIVATION_URL', 'https://app.rapidload.io/activate' );
	    }

	    return UUCSS_ACTIVATION_URL . '?' . build_query( [
			    'action' => $action,
			    'nonce'  => wp_create_nonce( 'uucss_activation' ),
			    'site'   => trailingslashit(get_site_url()),
			    'back'   => admin_url( $to ),
			    'goto'   => UUCSS_ACTIVATION_URL,
                'utm_source' => RapidLoad_ThirdParty::plugin_exists('autoptimize') ? 'connect_autoptimize' : 'connect_rapidload',
		        'utm_medium' => 'plugin'
            ] );
    }

    public static function serialize($data){
        if(isset($data)){
            return serialize($data);
        }else{
            return null;
        }
    }

    public static function unserialize($data){
        if(isset($data)){
            return unserialize($data);
        }else{
            return null;
        }
    }

    public function is_file_excluded( $options, $file ) {

        if ( isset( $options['uucss_excluded_files'] ) && !empty($options['uucss_excluded_files']) ) {
            $files = explode( ',', $options['uucss_excluded_files'] );

            foreach ( $files as $excluded_file ) {

                if($this->str_contains( trim($excluded_file), '*' ) && self::is_path_glob_matched($file, trim($excluded_file))){
                    return true;
                }else if ( $this->str_contains( $file, trim($excluded_file) ) ) {
                    return true;
                }

            }
        }

        return false;
    }

    public static function is_url_glob_matched($path, $pattern, $ignoreCase = FALSE) {

        $expr = preg_replace_callback('/[\\\\^.?*+\\/]/', function($matches) {
            switch ($matches[0]) {
                case '*':
                    return '.*';
                case '?':
                    return '.';
                default:
                    return '\\'.$matches[0];
            }
        }, $pattern);

        $expr = '/'.$expr.'/';
        if ($ignoreCase) {
            $expr .= 'i';
        }

        return (bool) preg_match($expr, $path);

    }

    public static function is_path_glob_matched($path, $pattern, $ignoreCase = FALSE) {

        $expr = preg_replace_callback('/[\\\\^$.[\\]|()?*+{}\\-\\/]/', function($matches) {
            switch ($matches[0]) {
                case '*':
                    return '.*';
                case '?':
                    return '.';
                default:
                    return '\\'.$matches[0];
            }
        }, $pattern);

        $expr = '/'.$expr.'/';
        if ($ignoreCase) {
            $expr .= 'i';
        }

        return (bool) preg_match($expr, $path);

    }

    public static function remove_white_space($str){

        return preg_replace('/[\n\s+]/', '', $str);
    }

    public function schedule_cron($hook_name, $args){
        return wp_schedule_single_event( time() + 5, $hook_name, $args);
    }

    public function size() {

	    $file_system = new RapidLoad_FileSystem();

        if ( ! $file_system || ! $file_system->exists( UnusedCSS::$base_dir ) ) {
            return "0 KB";
        }

        $size = $this->dirSize( UnusedCSS::$base_dir );

        return $this->human_file_size( $size );
    }

    protected function is_doing_api_fetch(){

        $user_agent = '';
        $headers    = [];

        if ( function_exists( 'getallheaders' ) ) {
            $headers = getallheaders();
        }

        if ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
            $user_agent = $_SERVER['HTTP_USER_AGENT'];
        }

        if ( isset( $headers['User-Agent'] ) ) {
            $user_agent = $headers['User-Agent'];
        }

        return strpos( $user_agent, 'UnusedCSS_bot' ) !== false ||
            strpos( $user_agent, 'RapidLoad' ) !== false;
    }

    public function is_valid_url($url){
        return filter_var($url, FILTER_VALIDATE_URL);
    }

    public function is_url_allowed($url = null, $args = null)
    {

        if ( ! $url ) {
            return false;
        }

        if(!$this->is_valid_url($url)){
            return false;
        }

        // remove .css .js files from being analyzed
        if ( preg_match( '/cache\/autoptimize/', $url ) ) {
            return false;
        }

        if ( preg_match( '/cache\/rapidload/', $url ) ) {
            return false;
        }

        global $post;

        if ( !$post && isset( $args['post_id'] )) {
            $post = get_post( $args['post_id'] );
        }

        if ( $post ) {
            $page_options = RapidLoad_Base::get_page_options( $post->ID );
            if ( isset( $page_options['exclude'] ) && $page_options['exclude'] == "on" ) {
                return false;
            }

        }

        $options = RapidLoad_Base::fetch_options();

        if ( isset( $options['uucss_excluded_links'] ) && ! empty( $options['uucss_excluded_links'] ) ) {
            $exploded = explode( ',', $options['uucss_excluded_links'] );

            foreach ( $exploded as $pattern ) {

                if ( filter_var( $pattern, FILTER_VALIDATE_URL ) ) {

                    $pattern = parse_url( $pattern );

                    $path = $pattern['path'];
                    $query = isset($pattern['query']) ? '?' . $pattern['query'] : '';

                    $pattern = $path . $query;

                }

                if(self::str_contains( $pattern, '*' ) && self::is_path_glob_matched(urldecode($url), $pattern)){
                    $this->log( 'skipped : ' . $url );
                    return false;
                }else if ( self::str_contains( urldecode($url), $pattern ) ) {
                    $this->log( 'skipped : ' . $url );
                    return false;
                }

            }
        }

        $url_parts = parse_url( $url );

        if(isset($url_parts['query']) && $this->str_contains($url_parts['query'], 'customize_changeset_uuid')){
            $this->log( 'skipped : ' . $url );
            return false;
        }

        if(!apply_filters('uucss/url/exclude', $url)){
            $this->log( 'skipped : ' . $url );
            return false;
        }

        return true;
    }
}
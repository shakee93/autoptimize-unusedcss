<?php

class RapidLoad_htaccess
{

    public static function update_htaccess($remove = false){

        global $is_apache;

        if ( ! $is_apache || ( apply_filters( 'rapidload_disable_htaccess', false ) && ! $remove ) ) {
            return false;
        }

        $htaccess_file = get_home_path() . '.htaccess';

        $file_system = new RapidLoad_FileSystem();

        if(!$file_system->is_writable($htaccess_file)){
            wp_send_json_error('no access');
        }

        $htaccess_content = $file_system->get_contents( $htaccess_file );

        if ( false === $htaccess_content ) {
            return false;
        }

        $has_wp_rules = self::has_wp_rules( $htaccess_content );

        $htaccess_content = preg_replace( '/\s*# BEGIN RapidLoad.*# END RapidLoad\s*?/isU', PHP_EOL . PHP_EOL, $htaccess_content );
        $htaccess_content = ltrim( $htaccess_content );

        if ( !$remove ) {
            $htaccess_content = self::get_htaccess_marker() . PHP_EOL . $htaccess_content;
        }

        if ( $has_wp_rules && ! self::has_wp_rules( $htaccess_content ) ) {
            return false;
        }

        $file_system->copy(get_home_path() . '.htaccess', get_home_path() . '.htaccess-backup');

        return $file_system->put_contents( $htaccess_file, $htaccess_content );
    }

    public static function get_htaccess_marker(){

        $content = '# BEGIN RapidLoad v' . UUCSS_VERSION . PHP_EOL;

        $content .= apply_filters( 'before_rapidload_htaccess_rules', '' );

        $content .= self::get_htaccess_charset();
        $content .= self::get_htaccess_etag();
        $content .= self::get_htaccess_web_fonts_access();
        $content .= self::get_htaccess_files_match();
        $content .= self::get_htaccess_mod_expires();
        $content .= self::get_htaccess_mod_deflate();

       /* if ( \WP_Rocket\Buffer\Cache::can_generate_caching_files() && ! is_rocket_generate_caching_mobile_files() ) {
            $marker .= get_rocket_htaccess_mod_rewrite();
        }*/

        $content .= apply_filters( 'after_rapidload_htaccess_rules', '' );

        $content .= '# END RapidLoad' . PHP_EOL;

        $content = apply_filters( 'rapidload_htaccess_marker', $content );

        return $content;
    }

    public static function get_htaccess_mod_deflate() {
        $rules = '# Gzip compression' . PHP_EOL;
        $rules .= '<IfModule mod_deflate.c>' . PHP_EOL;
        $rules .= '# Active compression' . PHP_EOL;
        $rules .= 'SetOutputFilter DEFLATE' . PHP_EOL;
        $rules .= '# Force deflate for mangled headers' . PHP_EOL;
        $rules .= '<IfModule mod_setenvif.c>' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'SetEnvIfNoCase ^(Accept-EncodXng|X-cept-Encoding|X{15}|~{15}|-{15})$ ^((gzip|deflate)\s*,?\s*)+|[X~-]{4,13}$ HAVE_Accept-Encoding' . PHP_EOL;
        $rules .= 'RequestHeader append Accept-Encoding "gzip,deflate" env=HAVE_Accept-Encoding' . PHP_EOL;
        $rules .= '# Don’t compress images and other uncompressible content' . PHP_EOL;
        $rules .= 'SetEnvIfNoCase Request_URI \\' . PHP_EOL;
        $rules .= '\\.(?:gif|jpe?g|png|rar|zip|exe|flv|mov|wma|mp3|avi|swf|mp?g|mp4|webm|webp|pdf)$ no-gzip dont-vary' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL . PHP_EOL;
        $rules .= '# Compress all output labeled with one of the following MIME-types' . PHP_EOL;
        $rules .= '<IfModule mod_filter.c>' . PHP_EOL;
        $rules .= 'AddOutputFilterByType DEFLATE application/atom+xml \
		                          application/javascript \
		                          application/json \
		                          application/rss+xml \
		                          application/vnd.ms-fontobject \
		                          application/x-font-ttf \
		                          application/xhtml+xml \
		                          application/xml \
		                          font/opentype \
		                          image/svg+xml \
		                          image/x-icon \
		                          text/css \
		                          text/html \
		                          text/plain \
		                          text/x-component \
		                          text/xml' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'Header append Vary: Accept-Encoding' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL . PHP_EOL;

        $rules = apply_filters( 'rapidload_htaccess_mod_deflate', $rules );

        return $rules;
    }

    public static function get_htaccess_mod_expires() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
        $rules = <<<HTACCESS
<IfModule mod_mime.c>
	AddType image/avif                                  avif
    AddType image/avif-sequence                         avifs
</IfModule>
# Expires headers (for better cache control)
<IfModule mod_expires.c>
	ExpiresActive on
	ExpiresDefault                              "access plus 1 month"
	# cache.appcache needs re-requests in FF 3.6 (thanks Remy ~Introducing HTML5)
	ExpiresByType text/cache-manifest           "access plus 0 seconds"
	# Your document html
	ExpiresByType text/html                     "access plus 0 seconds"
	# Data
	ExpiresByType text/xml                      "access plus 0 seconds"
	ExpiresByType application/xml               "access plus 0 seconds"
	ExpiresByType application/json              "access plus 0 seconds"
	# Feed
	ExpiresByType application/rss+xml           "access plus 1 hour"
	ExpiresByType application/atom+xml          "access plus 1 hour"
	# Favicon (cannot be renamed)
	ExpiresByType image/x-icon                  "access plus 1 week"
	# Media: images, video, audio
	ExpiresByType image/gif                     "access plus 4 months"
	ExpiresByType image/png                     "access plus 1 year"
	ExpiresByType image/jpeg                    "access plus 1 year"
	ExpiresByType image/webp                    "access plus 4 months"
	ExpiresByType video/ogg                     "access plus 4 months"
	ExpiresByType audio/ogg                     "access plus 4 months"
	ExpiresByType video/mp4                     "access plus 4 months"
	ExpiresByType video/webm                    "access plus 4 months"
	ExpiresByType image/avif                    "access plus 4 months"
	ExpiresByType image/avif-sequence           "access plus 4 months"
	# HTC files  (css3pie)
	ExpiresByType text/x-component              "access plus 1 month"
	# Webfonts
	ExpiresByType font/ttf                      "access plus 4 months"
	ExpiresByType font/otf                      "access plus 4 months"
	ExpiresByType font/woff                     "access plus 4 months"
	ExpiresByType font/woff2                    "access plus 4 months"
	ExpiresByType image/svg+xml                 "access plus 4 months"
	ExpiresByType application/vnd.ms-fontobject "access plus 1 month"
	# CSS and JavaScript
	ExpiresByType text/css                      "access plus 1 year"
	ExpiresByType application/javascript        "access plus 1 year"
</IfModule>

HTACCESS;

        $rules = apply_filters( 'rapidload_htaccess_mod_expires', $rules );

        return $rules;
    }

    public static function get_htaccess_files_match() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
        $rules = '<IfModule mod_alias.c>' . PHP_EOL;
        $rules .= '<FilesMatch "\.(html|htm|rtf|rtx|txt|xsd|xsl|xml)$">' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'Header set X-Powered-By "RapidLoad/' . UUCSS_VERSION . '"' . PHP_EOL;
        $rules .= 'Header unset Pragma' . PHP_EOL;
        $rules .= 'Header append Cache-Control "public,max-age=31536000"' . PHP_EOL;
        $rules .= 'Header unset Last-Modified' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '</FilesMatch>' . PHP_EOL . PHP_EOL;
        $rules .= '<FilesMatch "\.(css|htc|js|asf|asx|wax|wmv|wmx|avi|bmp|class|divx|doc|docx|eot|exe|gif|gz|gzip|ico|jpg|jpeg|jpe|json|mdb|mid|midi|mov|qt|mp3|m4a|mp4|m4v|mpeg|mpg|mpe|mpp|otf|odb|odc|odf|odg|odp|ods|odt|ogg|pdf|png|pot|pps|ppt|pptx|ra|ram|svg|svgz|swf|tar|tif|tiff|ttf|ttc|wav|wma|wri|xla|xls|xlsx|xlt|xlw|zip)$">' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'Header unset Pragma' . PHP_EOL;
        $rules .= 'Header append Cache-Control "public,max-age=31536000"' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '</FilesMatch>' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL . PHP_EOL;

        /**
         * Filter rules for cache control
         *
         * @since 1.1.6
         *
         * @param string $rules Rules that will be printed.
         */
        $rules = apply_filters( 'rocket_files_match', $rules );

        return $rules;
    }

    public static function get_htaccess_etag() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
        $rules  = '# FileETag None is not enough for every server.' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'Header unset ETag' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL . PHP_EOL;
        $rules .= '# Since we’re sending far-future expires, we don’t need ETags for static content.' . PHP_EOL;
        $rules .= '# developer.yahoo.com/performance/rules.html#etags' . PHP_EOL;
        $rules .= 'FileETag None' . PHP_EOL . PHP_EOL;

        /**
         * Filter rules to remove the etag
         *
         * @since 1.0
         *
         * @param string $rules Rules that will be printed.
         */
        $rules = apply_filters( 'rapidload_htaccess_etag', $rules );

        return $rules;
    }

    public static function get_htaccess_charset() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
        // Get charset of the blog.
        $charset = preg_replace( '/[^a-zA-Z0-9_\-\.:]+/', '', get_bloginfo( 'charset', 'display' ) );

        if ( empty( $charset ) ) {
            return '';
        }

        $rules = "# Use $charset encoding for anything served text/plain or text/html" . PHP_EOL;
        $rules .= "AddDefaultCharset $charset" . PHP_EOL;
        $rules .= "# Force $charset for a number of file formats" . PHP_EOL;
        $rules .= '<IfModule mod_mime.c>' . PHP_EOL;
        $rules .= "AddCharset $charset .atom .css .js .json .rss .vtt .xml" . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL . PHP_EOL;

        /**
         * Filter rules for default charset on static files
         *
         * @since 1.0
         *
         * @param string $rules Rules that will be printed.
         */
        $rules = apply_filters( 'rapidload_htaccess_charset', $rules );

        return $rules;
    }

    public static function get_htaccess_web_fonts_access() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
        if ( !apply_filters('rapidload/cdn/enabled', false) ) {
            return;
        }

        $rules  = '# Send CORS headers if browsers request them; enabled by default for images.' . PHP_EOL;
        $rules  .= '<IfModule mod_setenvif.c>' . PHP_EOL;
        $rules  .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules  .= '# mod_headers, y u no match by Content-Type?!' . PHP_EOL;
        $rules  .= '<FilesMatch "\.(avifs?|cur|gif|png|jpe?g|svgz?|ico|webp)$">' . PHP_EOL;
        $rules  .= 'SetEnvIf Origin ":" IS_CORS' . PHP_EOL;
        $rules  .= 'Header set Access-Control-Allow-Origin "*" env=IS_CORS' . PHP_EOL;
        $rules  .= '</FilesMatch>' . PHP_EOL;
        $rules  .= '</IfModule>' . PHP_EOL;
        $rules  .= '</IfModule>' . PHP_EOL . PHP_EOL;

        $rules  .= '# Allow access to web fonts from all domains.' . PHP_EOL;
        $rules  .= '<FilesMatch "\.(eot|otf|tt[cf]|woff2?)$">' . PHP_EOL;
        $rules .= '<IfModule mod_headers.c>' . PHP_EOL;
        $rules .= 'Header set Access-Control-Allow-Origin "*"' . PHP_EOL;
        $rules .= '</IfModule>' . PHP_EOL;
        $rules .= '</FilesMatch>' . PHP_EOL . PHP_EOL;
        // @codingStandardsIgnoreEnd
        /**
         * Filter rules to Cross-origin fonts sharing
         *
         * @since 1.0
         *
         * @param string $rules Rules that will be printed.
         */
        $rules = apply_filters( 'rapidload_htaccess_web_fonts_access', $rules );

        return $rules;
    }

    public static function has_wp_rules($content){
        if ( is_multisite() ) {
            $has_wp_rules = strpos( $content, '# add a trailing slash to /wp-admin' ) !== false;
        } else {
            $has_wp_rules = strpos( $content, '# BEGIN WordPress' ) !== false;
        }
        return $has_wp_rules;
    }

    public static function has_rapidload_rules() {

        global $is_apache;

        if ( ! $is_apache ) {
            return [
                'apache' => false,
                'has_rapidload_rules' => false,
                'status' => 'failed',
                'error' => [
                    'code' => 422,
                    'message' => 'Server not support'
                ]
            ];
        }

        $htaccess_file = get_home_path() . '.htaccess';

        $file_system = new RapidLoad_FileSystem();

        if(!$file_system->is_readable($htaccess_file)){
            return [
                'server' => 'apache',
                'has_rapidload_rules' => false,
                'status' => 'failed',
                'error' => [
                    'code' => 422,
                    'message' => 'File cannot access'
                ]
            ];
        }

        $htaccess_content = $file_system->get_contents( $htaccess_file );

        if ( false === $htaccess_content ) {
            return [
                'server' => 'apache',
                'has_rapidload_rules' => false,
                'status' => 'failed',
                'error' => [
                    'code' => 422,
                    'message' => 'File content empty'
                ]
            ];
        }

        $has_rapidload_rules = (strpos($htaccess_content, '# BEGIN RapidLoad') !== false && strpos($htaccess_content, '# END RapidLoad') !== false);

        return [
            'server' => 'apache',
            'has_rapidload_rules' => $has_rapidload_rules,
            'status' => $has_rapidload_rules ? 'success' : 'failed',
            'error' => [
                'code' => null,
                'message' => null
            ]
        ];
    }


}
<?php


class UnusedCSS_Settings {

	use UnusedCSS_Utils;

	static $map_key = 'uucss_map';


	public static function add_link( $link, $files ) {

		$map = get_option( self::$map_key );

		$map[ md5( $link ) ] = [
			"files" => $files
		];

		update_option( self::$map_key, $map );
	}


	public static function get_link( $link ) {

		$map = get_option( self::$map_key );

		if ( $map && isset( $map[ md5( $link ) ] ) ) {

			return $map[ md5( $link ) ];

		}

		return null;

	}

	public static function link_exists( $link ) {


		$map = get_option( self::$map_key );

		if ( $map && isset( $map[ md5( $link ) ] ) ) {

			return true;

		}

		return false;

	}

	public static function delete_link( $link ) {

		$map = get_option( self::$map_key );

		unset( $map[ md5( $link ) ] );

		update_option( self::$map_key, $map );
	}

	public static function clear_links() {

		delete_option( self::$map_key );

	}


}
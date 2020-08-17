<?php


class UnusedCSS_Settings {

	use UnusedCSS_Utils;

	static $map_key = 'uucss_map';

	public static function get_links() {

		return get_option( self::$map_key );

	}

	public static function add_link( $link, $files = null, $status = 'success', $meta = null ) {

		$map = get_option( self::$map_key );

		$map[ md5( $link ) ] = [
			"url"    => $link,
			"files"  => $files,
			"status" => $status,
			"meta"   => $meta,
			"time"   => current_time( 'timestamp' )
		];

		update_option( self::$map_key, $map );
	}

	public static function get_link( $link ) {

		$map = get_option( self::$map_key );

		if ( $map && isset( $map[ md5( $link ) ] ) && $map[ md5( $link ) ]['status'] == 'success' ) {

			return $map[ md5( $link ) ];

		}

		return null;

	}

	public static function link_exists( $link ) {


		$map = get_option( self::$map_key );

		if ( $map && isset( $map[ md5( $link ) ] ) && $map[ md5( $link ) ]['status'] == 'success' ) {

			return true;

		}

		return false;

	}


	public static function link_exists_with_error( $link ) {


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

	public static function link_files_used_elsewhere( $link ) {

		$map = get_option( self::$map_key );

		$files = self::get_link( $link );

		$used   = [];
		$unused = [];

		if ( $files ) {

			$files = $files['files'];

			foreach ( $files as $file ) {

				foreach ( $map as $key => $value ) {

					if ( md5( $link ) !== $key ) {

						if ( in_array( $file['uucss'], array_column( $value['files'], 'uucss' ) ) ) {
							$used[] = $file['uucss'];
							break;
						}

					}
				}

			}

			$unused = array_column( $files, 'uucss' );

			foreach ( $used as $item ) {

				if ( ( $key = array_search( $item, $unused ) ) !== true ) {
					unset( $unused[ $key ] );
				}

			}

		}


		return $unused;

	}

}
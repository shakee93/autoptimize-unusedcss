<?php
defined( 'ABSPATH' ) or die();

/**
 * Class UnusedCSS_FileSystem
 */

class UnusedCSS_FileSystem
{
    public function put_contents( $file_location, $css , $mode = null){
        return file_put_contents($file_location, $css, $mode);
    }

    public function exists( $dir ){
        return file_exists($dir);
    }

    public function mkdir( $dir , $mode = 0755){
        return mkdir($dir, $mode, true);
    }

    public function is_writable( $dir ){
        return is_writeable($dir);
    }

    public function is_readable( $dir ){
        return is_readable($dir);
    }

    public function delete($path, $recursive = true){
        if(is_dir($path)){
            array_map('unlink', glob("$path/*.*"));
            rmdir($path);
        }else{
            unlink($path);
        }
    }

    public function size($file){
        return filesize($file);
    }

    public function get_contents($file){
        return file_get_contents($file);
    }
}
<?php
defined( 'ABSPATH' ) or die();

/**
 * Class RapidLoad_FileSystem
 */

class RapidLoad_FileSystem
{
    public function put_contents( $file_location, $css , $mode = null){
        return file_put_contents($file_location, $css, $mode);
    }

    public function exists( $dir ){
        return file_exists($dir);
    }

    public function mkdir( $dir , $mode = 0755, $recursive = true){
        if($this->exists($dir)) {
            return true;
        }
        try{
            return mkdir($dir, 0755, true);
        }catch(Exception $exception){
            error_log(json_encode($dir));
            return false;
        }
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
            if($this->exists($path)){
                unlink($path);
            }
        }
        return true;
    }

    public function size($file){
        return filesize($file);
    }

    public function get_contents($file){
        return file_get_contents($file);
    }

    public function delete_folder($dir){
        $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it,
            RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        rmdir($dir);
    }
}
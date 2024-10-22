<?php
defined( 'ABSPATH' ) or die();

/**
 * Class RapidLoad_FileSystem
 */

class RapidLoad_FileSystem
{
    public function put_contents( $file_location, $css , $mode = null){
        return @file_put_contents($file_location, $css, $mode);
    }

    public function exists( $dir ){
        return file_exists($dir);
    }

    public function mkdir( $dir , $mode = 0755, $recursive = true){
        if($this->exists($dir)) {
            return true;
        }
        try{
            return @mkdir($dir, 0755, true);
        }catch(Exception $exception){
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

    public function copy($source, $destination){
        @copy($source, $destination);
    }

    public function format_size_units($bytes) {
        if ($bytes >= 1073741824) {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            $bytes = $bytes . ' bytes';
        } elseif ($bytes == 1) {
            $bytes = '1 byte';
        } else {
            $bytes = '0 bytes';
        }

        return $bytes;
    }

    public function get_folder_size_in_bytes($dir) {
        $size = 0;
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }
        return $size;
    }

    public function get_folder_size($dir) {
        $size = 0;
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }
        return $this->format_size_units($size);
    }
}
<?php


class RapidLoad_ThirdParty
{
    use UnusedCSS_Utils;

    public static function initialize(){

        $third_party_plugins_dir = plugin_dir_path(UUCSS_PLUGIN_FILE) . '/includes/third-party/plugins';

        $class_iterator = new RecursiveTreeIterator(new RecursiveDirectoryIterator($third_party_plugins_dir, RecursiveDirectoryIterator::SKIP_DOTS));

        foreach($class_iterator as $class_path) {

            if(substr_compare($class_path, '.php', -strlen('.php')) === 0){

                $class = str_replace('.php', '', basename($class_path));

                if(class_exists($class)){
                    new $class;
                }
            }
        }

    }

}
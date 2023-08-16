<?php

class OptimizerFont
{

    public function __construct()
    {
        add_filter('rapidload/enqueue/preload/fonts', function ($urls, $job, $strategy){

            $options = $strategy === "mobile" ? $job->get_mobile_options() : $job->get_desktop_options();

            if(isset($options['individual-file-actions']) && isset($options['individual-file-actions']['font-display'])){

                foreach ($options['individual-file-actions']['font-display'] as $value){

                    if (isset($value->url) && isset($value->url->url) && filter_var($value->url->url, FILTER_VALIDATE_URL) !== false) {

                        $path_parts = pathinfo($value->url->url);

                        if(isset($path_parts['extension'])){
                            $file_extension = strtolower($path_parts['extension']);

                            if(in_array($file_extension, ['woff2', 'woff' , 'ttf'])){

                                if(isset($value->action) && $value->action == "preload"){
                                    $urls[] = $value->url->url;
                                }
                            }
                        }
                    }
                }
            }
            return $urls;
        }, 10, 3);
    }

}
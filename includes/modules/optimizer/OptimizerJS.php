<?php

class OptimizerJS
{

    static $js_files;

    public function __construct()
    {
        add_action('rapidload/enqueue/optimize-js', function ($link, $job, $strategy){

            $options = $strategy == "mobile" ? $job->get_mobile_options() : $job->get_desktop_options();

            if(!isset(self::$js_files)){

                self::$js_files = [];

                if(isset($options['individual-file-actions'])){

                    foreach ($options['individual-file-actions'] as $option){

                        if(isset($option->url) && gettype($option->url) == "object" && isset($option->url->url) && isset($option->url->file_type) && $option->url->file_type == "js"){

                            if(isset($option->action) && gettype($option->action) == "object" && isset($option->action) && isset($option->action->value)){
                                self::$js_files[] = [
                                    'url' =>  $option->url->url,
                                    'action' => $option->action->value
                                ];

                            }

                        }

                    }

                }

            }



        }, 10 , 1);
    }

}
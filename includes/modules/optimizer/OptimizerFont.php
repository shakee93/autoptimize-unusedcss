<?php

class OptimizerFont
{

    public function __construct()
    {
        add_filter('rapidload/enqueue/preload/fonts', function ($urls, $job, $strategy){

            $options = $strategy === "mobile" ? $job->get_mobile_options(true) : $job->get_desktop_options(true);

            error_log(json_encode($options, JSON_PRETTY_PRINT));

            return $urls;
        }, 10, 3);
    }

}
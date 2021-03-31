<?php

defined( 'ABSPATH' ) || exit;

class GoogleModPageSpeedCompatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'kagg-pagespeed-module/mod-pagespeed.php';
        $this->catgeory = 'cache-bust';
        $this->name = 'mod-pagespeed';

        parent::__construct();
    }

    public function is_mu_plugin()
    {
        return false;
    }

    public function init_hooks()
    {
        add_filter('uucss/cache/bust', [$this, 'handle']);
    }

    public function handle($args)
    {
        $args[] = [
            'type' => 'query',
            'rule' => 'ModPagespeed=off'
        ];
        return $args;
    }
}
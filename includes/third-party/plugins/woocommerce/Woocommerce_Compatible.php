<?php

defined( 'ABSPATH' ) || exit;

class Woocommerce_Compatible extends RapidLoad_ThirdParty{

    function __construct(){

        $this->plugin = 'woocommerce/woocommerce.php';
        $this->catgeory = 'e-commerce';
        $this->name = 'woocommerce';

        parent::__construct();
    }

    public function init_hooks()
    {
        add_filter('uucss/rules', [$this, 'handle'], 50, 1);
    }

    public function handle($args)
    {
        if(function_exists('is_product')){
            $args[] = [
                'name' => 'product',
                'rule' => 'is_product',
                'category' => 'Woocommerce',
                'priority' => 5,
                'callback' => is_product(),
            ];
        }

        if(function_exists('is_product_category')){
            $args[] = [
                'name' => 'product_category',
                'rule' => 'is_product_category',
                'category' => 'Woocommerce',
                'priority' => 5,
                'callback' => is_product_category(),
            ];
        }

        if(function_exists('is_product_tag')){
            $args[] = [
                'name' => 'product_tag',
                'rule' => 'is_product_tag',
                'category' => 'Woocommerce',
                'priority' => 5,
                'callback' => is_product_tag(),
            ];
        }

        return $args;
    }

    public function is_mu_plugin()
    {
        return false;
    }
}
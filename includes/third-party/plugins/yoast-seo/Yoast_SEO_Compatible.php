<?php

defined( 'ABSPATH' ) || exit;

class Yoast_SEO_Compatible extends RapidLoad_ThirdParty {

    private $yoast_seo_xml;
    private $yoast_seo;

    function __construct(){

        if ( defined( 'WPSEO_VERSION' ) && class_exists( 'WPSEO_Sitemaps_Router' ) ){

            $this->yoast_seo_xml = get_option( 'wpseo_xml' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals

            if ( version_compare( WPSEO_VERSION, '7.0' ) >= 0 ) {
                $this->yoast_seo = get_option( 'wpseo' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
                $this->yoast_seo_xml['enablexmlsitemap'] = isset( $this->yoast_seo['enable_xml_sitemap'] ) && $this->yoast_seo['enable_xml_sitemap']; // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals
            }
        }

        if ( true === $this->yoast_seo_xml['enablexmlsitemap'] ) {

            $this->init_hooks();
        }


    }

    function init_hooks(){

        add_filter( 'uucss_sitemap_preload_list', [$this, 'uucss_add_yoast_seo_sitemap'] );

    }

    function uucss_add_yoast_seo_sitemap( $sitemaps ) {
        $sitemaps[] = WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' );

        return $sitemaps;
    }
}
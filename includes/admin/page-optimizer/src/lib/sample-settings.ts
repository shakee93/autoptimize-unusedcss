export default [
    {
        "name": "Page Cache X",
        "description": "Optimize and cache static HTML pages to provide a snappier page experience.",
        "category": "cache",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Page Cache",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_enable_cache"
            }
        ],
        "status": {
            "status": false,
            "file": "/Users/shakee93/Local Sites/rapidload/app/public/wp-content/cache/rapidload-cache/http-index.html",
            "size": null
        }
    },
    {
        "name": "Delay Javascript",
        "description": "Loading JS files on user interaction",
        "category": "javascript",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Delay Javascript",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "delay_javascript"
            },
            {
                "control_type": "button",
                "control_label": "Exclude Files",
                "value": [],
                "key": "uucss_exclude_files_from_delay_js",
                "description": "",
                "control_values": [
                    {
                        "type": "third_party",
                        "name": "Amazon Ads",
                        "id": "amazon_ads",
                        "exclusions": [
                            "amazon-adsystem.com"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google AdSense",
                        "id": "google_adsense",
                        "exclusions": [
                            "adsbygoogle"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google Analytics",
                        "id": "google_analytics",
                        "exclusions": [
                            "/google-analytics\\.com\\/analytics\\.js/",
                            "/ga\\( '/",
                            "/ga\\('/"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google Maps",
                        "id": "google_maps",
                        "exclusions": [
                            "maps.googleapis.com",
                            "maps.google.com"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google Optimize",
                        "id": "google_optimize",
                        "exclusions": [
                            "a,s,y,n,c,h,i,d,e",
                            "/googleoptimize.com\\/optimize.js/",
                            "async-hide"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google Recaptcha",
                        "id": "google_recaptcha",
                        "exclusions": [
                            "recaptcha"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Google Tag Manager",
                        "id": "google_tag_manager",
                        "exclusions": [
                            "/gtag\\/js/",
                            "/gtag\\(/",
                            "/gtm.js/",
                            "async-hide"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Facebook",
                        "id": "facebook",
                        "exclusions": [
                            "connect.facebook.net/en_US/fbevents.js"
                        ]
                    },
                    {
                        "type": "third_party",
                        "name": "Hotjar",
                        "id": "hotjar",
                        "exclusions": [
                            "/static.hotjar.com/c/hotjar/"
                        ]
                    },
                    {
                        "type": "plugins",
                        "name": "Test Delay",
                        "id": "test_delay",
                        "exclusions": [
                            "/plugins/delay/",
                            "/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js/",
                            "/jquery-migrate(.min)?.js/"
                        ]
                    },
                    {
                        "type": "plugins",
                        "name": "Elementor Pro",
                        "id": "elementor_pro",
                        "exclusions": [
                            "/plugins/elementor-pro/",
                            "/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js/",
                            "/jquery-migrate(.min)?.js/"
                        ]
                    },
                    {
                        "type": "plugins",
                        "name": "Elementor",
                        "id": "elementor",
                        "exclusions": [
                            "/plugins/elementor/",
                            "/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js/",
                            "/jquery-migrate(.min)?.js/"
                        ]
                    },
                    {
                        "type": "theme",
                        "name": "twentytwentythree",
                        "id": "twentytwentythree",
                        "exclusions": [
                            "http://rapidload.local/wp-content/themes/twentytwentythree",
                            "/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js/",
                            "/jquery-migrate(.min)?.js/"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "Lazy Load Iframes",
        "category": "image",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Lazy Load Iframes",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_lazy_load_iframes"
            }
        ]
    },
    {
        "name": "Exclude Above-the-fold Images from Lazy Load",
        "category": "image",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Exclude LCP image from Lazy Load",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_exclude_above_the_fold_images"
            }
        ]
    },
    {
        "name": "Remove Unused CSS",
        "description": "Remove unused CSS for each page and reduce page size.",
        "category": "css",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Minify Javascript",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_enable_uucss"
            },
            {
                "control_type": "button",
                "control_label": "Regenerate Unused CSS",
                "action": "action=rapidload_purge_all&job_type=url&clear=false&immediate=true&url=https://rapidload.io/&nonce=95f5ecf57b",
                "key": "rapidload_purge_all",
                "description": ""
            }
        ],
        "status": {
            "status": "success",
            "stats": {
                "beforeBytes": 1049961,
                "afterBytes": 291033,
                "before": "1 MB",
                "after": "284.21 KB",
                "reduction": "72.28",
                "reductionSize": "741.14 KB"
            },
            "warnings": [],
            "error": {
                "code": null,
                "message": null
            }
        }
    },
    {
        "name": "Serve next-gen Images (AVIF, WEBP)",
        "description": "Serve the images in next-gen image formats to all the browsers that support them.",
        "category": "image",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Serve next-gen Images",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_support_next_gen_formats"
            },
            {
                "control_type": "options",
                "control_label": "Image Optimize Level",
                "control_values": [
                    "lossy",
                    "glossy",
                    "lossless"
                ],
                "value": "lossless",
                "key": "uucss_image_optimize_level"
            }
        ]
    },
    {
        "name": "Critical CSS",
        "description": "Extract and prioritize above-the-fold CSS.",
        "category": "css",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Enable Critical CSS",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_enable_cpcss",
                "main_input": true
            },
            {
                "control_type": "checkbox",
                "control_label": "Enable Separate CSS for Mobile",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": false,
                "key": "uucss_enable_cpcss_mobile",
                "main_input": false
            },
            {
                "control_type": "textarea",
                "control_label": "Additional Critical CSS",
                "control_values": null,
                "value": "",
                "key": "uucss_additional_css"
            },
            {
                "control_type": "button",
                "control_label": "Regenerate Critical CSS",
                "action": "action=cpcss_purge_url&url=https://rapidload.io/&nonce=95f5ecf57b",
                "key": "cpcss_purge_url",
                "description": ""
            }
        ],
        "status": {
            "status": "success",
            "error": {
                "code": null,
                "message": null
            }
        }
    },
    {
        "name": "Self Host Google Fonts",
        "description": "Self host all your Google fonts and load fonts faster. Turn on CDN to serve these fonts faster through RapidLoad CDN.",
        "category": "font",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Self Host Google Fonts",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_self_host_google_fonts"
            }
        ]
    },
    {
        "name": "Defer Javascript",
        "description": "Render-blocking JS on website can be resolved with defer javaScript.",
        "category": "javascript",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Defer Javascript",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_load_js_method"
            },
            {
                "control_type": "checkbox",
                "control_label": "Defer Inline JS scripts",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": false,
                "key": "defer_inline_js"
            }
        ]
    },
    {
        "name": "Lazy Load Images",
        "category": "image",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Lazy Load Images",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_lazy_load_images"
            }
        ]
    },
    {
        "name": "Minify CSS",
        "description": "Remove unnecessary spaces, lines and comments from CSS files.",
        "category": "css",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Minify CSS",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_minify"
            }
        ]
    },
    {
        "name": "Minify Javascript",
        "description": "Remove unnecessary spaces, lines and comments from JS files.",
        "category": "javascript",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Minify Javascript",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "minify_js"
            }
        ]
    },
    {
        "name": "RapidLoad CDN",
        "description": "Load resource files faster by using 112 edge locations with only 27ms latency.",
        "category": "cdn",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "RapidLoad CDN",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_enable_cdn"
            }
        ]
    },
    {
        "name": "Cache Policy",
        "category": "cache",
        "inputs": [
            {
                "control_type": "button",
                "control_label": "Setup Policies",
                "value": false,
                "key": "update_htaccess_file",
                "description": ""
            }
        ]
    },
    {
        "name": "Add Width and Height Attributes",
        "description": "Include width and height attributes for these images.",
        "category": "image",
        "inputs": [
            {
                "control_type": "checkbox",
                "control_label": "Add Width and Height Attributes",
                "control_values": [
                    "1",
                    "0"
                ],
                "value": true,
                "key": "uucss_set_width_and_height"
            }
        ]
    },
    {
        "name": "Performance Gears",
        "description": "Include width and height attributes for these images.",
        "category": "gear",
        "inputs": [
            {
                "control_type": "gear",
                "control_label": "Select performance gear",
                "control_values": [
                    "starter",
                    "accelerate",
                    "turbo-max"
                ],
                "value": true,
                "key": "active_gear"
            }
        ]
    }
]
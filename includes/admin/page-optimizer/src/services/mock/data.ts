
export const mockSettings = {
    "success": true,
    "data": {
        "general": {
            "performance_gear": "turboMax",
            "test_mode": "0"
        },
        "performance": [
            {
                "name": "Critical CSS",
                "description": "Extract and prioritize above-the-fold CSS.",
                "category": "css",
                "status": {
                    "status": "success",
                    "error": {
                        "code": null,
                        "message": null
                    },
                    "desktop": "cpcss-457522cecab7f98485972347d68dd016.css",
                    "mobile": "cpcss-457522cecab7f98485972347d68dd016-mobile.css"
                },
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Enable Critical CSS",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "main_input": true,
                        "key": "uucss_enable_cpcss",
                        "value": ""
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Mobile Critical CSS",
                        "control_description": "Extract Critical CSS for mobile screens",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "main_input": false,
                        "key": "uucss_enable_cpcss_mobile",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Above-the-fold CSS",
                        "control_description": "Include any CSS content you need to load above the fold.",
                        "default": "",
                        "key": "uucss_additional_css",
                        "value": ""
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Remove Critical CSS on User Interaction",
                        "control_description": "Remove Critical CSS when users engage",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "remove_cpcss_on_user_interaction",
                        "value": ""
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Enable CSS File Chunck",
                        "control_description": "Enable Splits large critical CSS files",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "rapidload_enable_cpcss_file_chunk",
                        "value": ""
                    },
                    {
                        "control_type": "input",
                        "control_props": {
                            "type": "number"
                        },
                        "control_label": "CSS Chunck File Size",
                        "control_description": "Splits large critical CSS files into smaller chunks to improve speed",
                        "default": 0,
                        "control_visibility": [
                            {
                                "key": "rapidload_enable_cpcss_file_chunk",
                                "value": true
                            }
                        ],
                        "key": "rapidload_cpcss_file_character_length",
                        "value": 0
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Enable Remove Unused CSS with Critical CSS",
                        "control_description": "Enable Remove Unused CSS with Critical CSS",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "global": true,
                        "key": "enable_uucss_on_cpcss",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Preload Fonts",
                        "control_description": "Preload critical font files to avoid FOUT and signal browsers to download fonts earlier.",
                        "default": "",
                        "key": "uucss_preload_font_urls",
                        "value": ""
                    },
                    {
                        "control_type": "button",
                        "control_label": "Regenerate Critical CSS",
                        "action": "action=cpcss_purge_url&url=https://staging.rapidload.io/&nonce=36fda26563",
                        "description": "",
                        "key": "cpcss_purge_url",
                        "value": null
                    }
                ]
            },
            {
                "name": "Defer Javascript",
                "description": "Render-blocking JS on website can be resolved with defer JavaScript.",
                "category": "javascript",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Defer Javascript",
                        "control_description": "Render-blocking JS on website can be resolved with defer javaScript.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_load_js_method",
                        "value": true
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Javascript from Deferring",
                        "control_description": "These JS files will be excluded from deferring.",
                        "default": "",
                        "key": "uucss_excluded_js_files_from_defer",
                        "value": ""
                    }
                ]
            },
            {
                "name": "Serve next-gen Images (AVIF, WEBP)",
                "description": "Serve the images in next-gen image formats to all the browsers that support them.",
                "category": "image",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Serve next-gen Images",
                        "control_description": "Serve the images in next-gen image formats to all the browsers that support them.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_support_next_gen_formats",
                        "value": "1"
                    },
                    {
                        "control_type": "options",
                        "control_label": "Image Optimize Level",
                        "control_description": "Choose the image compression level.",
                        "control_values": [
                            "lossy",
                            "glossy",
                            "lossless"
                        ],
                        "default": "lossless",
                        "key": "uucss_image_optimize_level",
                        "value": "lossless"
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Low Quality Image placeholders (LQIP)",
                        "control_description": "Generate low quality blurry SVG image placeholders.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_generate_blurry_place_holder",
                        "value": ""
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Enable adaptive Image delivery",
                        "control_description": "Resize your images based on device screen size to reduce download times.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "main_input": false,
                        "key": "uucss_adaptive_image_delivery",
                        "value": "0"
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Images from modern image urls",
                        "control_description": "These images will be excluded from being converted to modern formats.",
                        "default": "",
                        "key": "uucss_exclude_images_from_modern_images",
                        "value": ""
                    }
                ]
            },
            {
                "name": "Lazy Load Images",
                "description": "Delay loading of images until needed.",
                "category": "image",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Image Lazy Load",
                        "control_description": "Lazy load images.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_lazy_load_images",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Images from Lazy Load",
                        "control_description": "These images will be excluded from lazy-loading.",
                        "default": "",
                        "key": "uucss_exclude_images_from_lazy_load",
                        "value": ""
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
                        "default": "0",
                        "key": "minify_js",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Javascript from Minify",
                        "control_description": "These JS files will be excluded from being minified.",
                        "default": "",
                        "key": "uucss_exclude_files_from_minify_js",
                        "value": ""
                    }
                ]
            },
            {
                "name": "Remove Unused CSS",
                "description": "Remove unused CSS for each page and reduce page size.",
                "category": "css",
                "status": {
                    "status": "success",
                    "stats": {
                        "beforeBytes": 1555835,
                        "afterBytes": 440235,
                        "before": "1.48 MB",
                        "after": "429.92 KB",
                        "reduction": "71.70",
                        "reductionSize": "1.06 MB"
                    },
                    "warnings": [],
                    "error": {
                        "code": null,
                        "message": null
                    }
                },
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Remove Unused CSS",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_enable_uucss",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude CSS from Remove Unused CSS",
                        "control_description": "These CSS files will be excluded from Remove Unused CSS optimization.",
                        "default": "",
                        "key": "uucss_excluded_files",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Force Include selectors",
                        "control_description": "These selectors will be forcefully included into optimization.",
                        "default": "",
                        "key": "uucss_safelist",
                        "value": ""
                    },
                    {
                        "control_type": "accordion",
                        "inputs": [
                            {
                                "control_type": "checkbox",
                                "control_label": "CSS Variables",
                                "control_description": "Remove unused CSS variables.",
                                "control_values": [
                                    "1",
                                    "0"
                                ],
                                "key": "uucss_variables",
                                "default": "0",
                                "value": "0"
                            },
                            {
                                "control_type": "checkbox",
                                "control_accordion_name": "uucss-misc-options",
                                "control_label": "CSS Animation keyframes",
                                "control_description": "Remove unused keyframe animations.",
                                "control_values": [
                                    "1",
                                    "0"
                                ],
                                "key": "uucss_keyframes",
                                "default": "0",
                                "value": "0"
                            },
                            {
                                "control_type": "checkbox",
                                "control_accordion_name": "uucss-misc-options",
                                "control_label": "CSS @font-face rules",
                                "control_description": "Remove unused @font-face rules.",
                                "control_values": [
                                    "1",
                                    "0"
                                ],
                                "key": "uucss_fontface",
                                "default": "0",
                                "value": "0"
                            },
                            {
                                "control_type": "checkbox",
                                "control_accordion_name": "uucss-misc-options",
                                "control_label": "Inline CSS",
                                "control_description": "Optimize inline CSS.",
                                "control_values": [
                                    "1",
                                    "0"
                                ],
                                "key": "uucss_include_inline_css",
                                "default": "0",
                                "value": "0"
                            },
                            {
                                "control_type": "checkbox",
                                "control_accordion_name": "uucss-misc-options",
                                "control_label": "Cache Busting",
                                "control_description": "Enable RapidLoad crawler to view pages with a random query string.",
                                "control_values": [
                                    "1",
                                    "0"
                                ],
                                "key": "uucss_cache_busting_v2",
                                "default": "0",
                                "value": "0"
                            }
                        ],
                        "key": "uucss_misc_options",
                        "value": "All Files"
                    },
                    {
                        "control_type": "button",
                        "control_label": "Regenerate Unused CSS",
                        "action": "action=rapidload_purge_all&job_type=url&clear=false&immediate=true&url=https://staging.rapidload.io/&nonce=36fda26563",
                        "description": "",
                        "key": "rapidload_purge_all",
                        "value": null
                    }
                ]
            },
            {
                "name": "Delay Javascript",
                "description": "Loading JS files on user interaction",
                "category": "javascript",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Delay Javascript",
                        "control_description": "Loading JS files on user interaction",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "control_visibility": [
                            {
                                "key": "rapidload_js_delay_method",
                                "value": "All Files"
                            }
                        ],
                        "key": "delay_javascript",
                        "value": "1"
                    },
                    {
                        "control_type": "radio",
                        "control_label": "Delay Method",
                        "control_description": "Delay Method",
                        "control_values": [
                            "All Files",
                            "Selected Files"
                        ],
                        "control_values_description": [
                            {
                                "value": "All Files",
                                "description": "Every JavaScript file will be delayed."
                            },
                            {
                                "value": "Selected Files",
                                "description": "The files listed below will be delayed."
                            }
                        ],
                        "default": "All Files",
                        "key": "rapidload_js_delay_method",
                        "value": "All Files"
                    },
                    {
                        "control_type": "tab",
                        "control_label": "Exclude Javascript from Delaying",
                        "control_description": "These JS files will be excluded from delaying.",
                        "default": "",
                        "control_visibility": [
                            {
                                "key": "rapidload_js_delay_method",
                                "value": "All Files"
                            }
                        ],
                        "key": "uucss_exclude_files_from_delay_js",
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
                                    "https://rapidload.local/wp-content/themes/twentytwentythree",
                                    "/jquery-?[0-9.](.*)(.min|.slim|.slim.min)?.js/",
                                    "/jquery-migrate(.min)?.js/"
                                ]
                            }
                        ],
                        "value": []
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Callback Script",
                        "control_description": "These scripts will be executed on DOMContentLoaded",
                        "default": "",
                        "control_visibility": [
                            {
                                "key": "rapidload_js_delay_method",
                                "value": "All Files"
                            }
                        ],
                        "key": "delay_javascript_callback",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Javascript",
                        "control_description": "These JS files will be excluded from all optimizations.",
                        "default": "",
                        "control_visibility": [
                            {
                                "key": "rapidload_js_delay_method",
                                "value": "All Files"
                            }
                        ],
                        "key": "uucss_excluded_js_files",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Delaying only selected Javascript",
                        "control_description": "Add JavaScript files to forcefully delay.",
                        "default": "",
                        "control_visibility": [
                            {
                                "key": "rapidload_js_delay_method",
                                "value": "Selected Files"
                            }
                        ],
                        "key": "uucss_load_scripts_on_user_interaction",
                        "value": ""
                    }
                ]
            },
            {
                "name": "Preload Links",
                "description": "Intelligent preload and pre-render pages to faster page load times.",
                "category": "cache",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Preload Links",
                        "control_description": "Intelligent preload and pre-render pages to faster page load times.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "preload_internal_links",
                        "value": "0"
                    }
                ]
            },
            {
                "name": "Page Cache",
                "description": "Optimize and cache static HTML pages to provide a snappier page experience.",
                "category": "cache",
                "status": {
                    "status": "processing",
                    "file": "/Users/shakee93/Local Sites/rapidload/app/public/wp-content/cache/rapidload-cache/staging.rapidload.io/https-index.html",
                    "size": null,
                    "error": {
                        "code": 422,
                        "message": "Cache file not found"
                    },
                    "url": "https://staging.rapidload.io/"
                },
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Page Cache",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_enable_cache",
                        "value": "1"
                    },
                    {
                        "control_type": "number-range",
                        "control_label": "Cache Expiration",
                        "control_description": "Cached pages expire.",
                        "control_values": [
                            "0",
                            "2",
                            "6",
                            "12",
                            "24"
                        ],
                        "control_values_suffix": "h",
                        "default": "0",
                        "key": "cache_expiry_time",
                        "value": "0"
                    },
                    {
                        "control_type": "checkbox",
                        "control_label": "Mobile Cache",
                        "control_description": "Create a cached version for mobile devices.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "mobile_cache",
                        "value": "1"
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Pages",
                        "control_description": "These pages will exclude from cache.",
                        "default": "",
                        "key": "excluded_page_paths",
                        "value": ""
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
                        "default": "0",
                        "key": "uucss_enable_cdn",
                        "value": ""
                    },
                    {
                        "control_type": "input",
                        "readonly": true,
                        "placeholder": "Your CDN url is not populated yet.",
                        "control_label": "CDN Endpoint",
                        "control_description": "Your CDN endpoint to store and serve all your resources across the CDN network",
                        "actions": [
                            {
                                "key": "copy_cdn_url",
                                "control_type": "button",
                                "control_label": "Copy CDN URL",
                                "control_icon": "clipboard",
                                "control_description": "Copy to clipboard",
                                "action": "clipboard"
                            },
                            {
                                "key": "validate_cdn_url",
                                "control_type": "button",
                                "control_label": "Validate CDN URL",
                                "control_icon": "check-circle",
                                "control_description": "Check if the CDN url is working",
                                "action": "action=validate_cdn&dashboard_cdn_validator&nonce=36fda26563",
                                "action_response_mutates": [
                                    "uucss_cdn_url"
                                ]
                            },
                            {
                                "key": "clear_cdn_cache",
                                "control_type": "button",
                                "control_label": "Clear CDN Cache",
                                "control_icon": "rotate-cw",
                                "control_description": "Clear resources caches across the CDN network",
                                "action": "action=purge_rapidload_cdn&nonce=36fda26563"
                            }
                        ],
                        "key": "uucss_cdn_url",
                        "value": "https://rapidload-local.rapidload-cdn.io/"
                    }
                ]
            },
            {
                "name": "Cache Policy",
                "description": "Set up cache-control header to increase the browser cache expiration",
                "category": "cache",
                "status": {
                    "server": "apache",
                    "has_rapidload_rules": true,
                    "status": "success",
                    "error": {
                        "code": null,
                        "message": null
                    }
                },
                "inputs": [
                    {
                        "control_type": "button",
                        "control_label": "Setup Policies",
                        "action": "update_htaccess_file",
                        "default": "",
                        "key": "update_htaccess_file"
                    }
                ]
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
                        "default": "0",
                        "key": "uucss_self_host_google_fonts",
                        "value": "1"
                    }
                ]
            },
            {
                "name": "Lazy Load Iframes",
                "description": "Delay loading of iframes until needed.",
                "category": "image",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Iframes Lazy Load",
                        "control_description": "Lazy load all iframes in your website.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_lazy_load_iframes",
                        "value": ""
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Iframes from Lazy Load",
                        "control_description": "These iframes will be excluded from lazy-loading.",
                        "default": "",
                        "key": "uucss_exclude_iframes_from_lazy_load",
                        "value": ""
                    }
                ]
            },
            {
                "name": "Exclude Above-the-fold Images from Lazy Load",
                "description": "Improve your LCP images.",
                "category": "image",
                "inputs": [
                    {
                        "control_type": "checkbox",
                        "control_label": "Exclude LCP image from Lazy Load",
                        "control_description": "Choose the image count to exclude from above-the-fold",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_exclude_above_the_fold_images",
                        "value": ""
                    },
                    {
                        "control_type": "number-range",
                        "control_label": "Exclude Above-the-fold Images from Lazy Load",
                        "control_description": "Choose the image count to exclude from above-the-fold",
                        "control_values": [
                            "1",
                            "2",
                            "3",
                            "4",
                            "5"
                        ],
                        "default": "5",
                        "key": "uucss_exclude_above_the_fold_image_count",
                        "value": 3
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
                        "control_description": "Remove unnecessary spaces, lines and comments from CSS files.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_minify",
                        "value": "1"
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude CSS from Minify",
                        "control_description": "These CSS files will be excluded from being minified.",
                        "default": "",
                        "key": "uucss_minify_excluded_files",
                        "value": ""
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
                        "control_description": "Include width and height attributes for these images.",
                        "control_values": [
                            "1",
                            "0"
                        ],
                        "default": "0",
                        "key": "uucss_set_width_and_height",
                        "value": "1"
                    },
                    {
                        "control_type": "textarea",
                        "control_label": "Exclude Images from being set width and height",
                        "control_description": "These images will be excluded from inserting a width and height.",
                        "default": "",
                        "key": "uucss_exclude_images_from_set_width_and_height",
                        "value": ""
                    }
                ]
            }
        ],
        "actions": [
            {
                "control_type": "button",
                "category": "general",
                "control_label": "Flush Cache",
                "control_icon": "clear_page_cache",
                "control_description": "Clear Page Cache",
                "action": "/wp-admin/admin-ajax.php?action=fetch_titan_settings&amp;url=https%3A%2F%2Fstaging.rapidload.io%2F&amp;strategy=desktop&amp;new=false&amp;is_dev=true&amp;_cache=rapidload-cache&amp;_action=clear&amp;_wpnonce=1ced9ac23b"
            }
        ]
    }
}


export const mockPageSpeed = {
	"success": true,
	"data": {
		"url": "https://staging.rapidload.io/",
		"success": true,
		"job_id": "33",
		"page_speed": {
			"strategy": "desktop",
			"performance": 98,
			"meta": {
				"controls": {
					"dropdown_options": [
						{
							"type": "css",
							"options": [
								"none",
								"remove"
							]
						},
						{
							"type": "font",
							"options": [
								"none",
								"preload"
							]
						},
						{
							"type": "image",
							"options": [
								"none",
								"preload"
							]
						},
						{
							"type": "js",
							"options": [
								"none",
								"exclude"
							]
						}
					]
				}
			},
			"metrics": [
				{
					"id": "first-contentful-paint",
					"title": "First Contentful Paint",
					"scoreDisplayMode": "numeric",
					"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
					"displayValue": "0.4 s",
					"icon": "pass",
					"score": 100,
					"refs": {
						"id": "first-contentful-paint",
						"weight": 10,
						"group": "metrics",
						"acronym": "FCP",
						"relevantAudits": [
							"server-response-time",
							"render-blocking-resources",
							"redirects",
							"critical-request-chains",
							"uses-text-compression",
							"uses-rel-preconnect",
							"uses-rel-preload",
							"font-display",
							"unminified-javascript",
							"unminified-css",
							"unused-css-rules"
						]
					}
				},
				{
					"id": "speed-index",
					"title": "Speed Index",
					"scoreDisplayMode": "numeric",
					"description": "Speed Index shows how quickly the contents of a page are visibly populated. [Learn more about the Speed Index metric](https://developer.chrome.com/docs/lighthouse/performance/speed-index/).",
					"displayValue": "1.3 s",
					"icon": "pass",
					"score": 90,
					"refs": {
						"id": "speed-index",
						"weight": 10,
						"group": "metrics",
						"acronym": "SI",
						"relevantAudits": []
					}
				},
				{
					"id": "total-blocking-time",
					"title": "Total Blocking Time",
					"scoreDisplayMode": "numeric",
					"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
					"displayValue": "80 ms",
					"icon": "pass",
					"score": 99,
					"refs": {
						"id": "total-blocking-time",
						"weight": 30,
						"group": "metrics",
						"acronym": "TBT",
						"relevantAudits": [
							"long-tasks",
							"third-party-summary",
							"third-party-facades",
							"bootup-time",
							"mainthread-work-breakdown",
							"dom-size",
							"duplicated-javascript",
							"legacy-javascript",
							"viewport"
						]
					}
				},
				{
					"id": "largest-contentful-paint",
					"title": "Largest Contentful Paint",
					"scoreDisplayMode": "numeric",
					"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
					"displayValue": "0.7 s",
					"icon": "pass",
					"score": 99,
					"refs": {
						"id": "largest-contentful-paint",
						"weight": 25,
						"group": "metrics",
						"acronym": "LCP",
						"relevantAudits": [
							"server-response-time",
							"render-blocking-resources",
							"redirects",
							"critical-request-chains",
							"uses-text-compression",
							"uses-rel-preconnect",
							"uses-rel-preload",
							"font-display",
							"unminified-javascript",
							"unminified-css",
							"unused-css-rules",
							"largest-contentful-paint-element",
							"prioritize-lcp-image",
							"unused-javascript",
							"efficient-animated-content",
							"total-byte-weight",
							"lcp-lazy-loaded"
						]
					}
				},
				{
					"id": "cumulative-layout-shift",
					"title": "Cumulative Layout Shift",
					"scoreDisplayMode": "numeric",
					"description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/articles/cls).",
					"displayValue": "0",
					"icon": "pass",
					"score": 100,
					"refs": {
						"id": "cumulative-layout-shift",
						"weight": 25,
						"group": "metrics",
						"acronym": "CLS",
						"relevantAudits": [
							"layout-shift-elements",
							"non-composited-animations",
							"unsized-images"
						]
					}
				}
			],
			"audits": [
				{
					"id": "render-blocking-resources",
					"name": "Eliminate render-blocking resources",
					"scoreDisplayMode": "metricSavings",
					"description": "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn how to eliminate render-blocking resources](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/).",
					"displayValue": "Potential savings of 180 ms",
					"icon": "fail",
					"files": {
						"type": "opportunity",
						"items": [
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"totalBytes": 22262,
								"wastedMs": 80,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"totalBytes": 8036,
								"wastedMs": 205,
								"url": {
									"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"headings": [
							{
								"label": "URL",
								"valueType": "url",
								"key": "url"
							},
							{
								"valueType": "bytes",
								"key": "totalBytes",
								"label": "Transfer Size"
							},
							{
								"label": "Potential Savings",
								"key": "wastedMs",
								"valueType": "timespanMs"
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"overallSavingsMs": 176,
						"grouped_items": [
							{
								"type": "css",
								"items": [
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"totalBytes": 22262,
										"wastedMs": 80,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"totalBytes": 8036,
										"wastedMs": 205,
										"url": {
											"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							}
						]
					},
					"type": "opportunity",
					"score": 0,
					"settings": [
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
									"value": null,
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
									"value": null,
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
									"action": "cpcss_purge_url",
									"key": "cpcss_purge_url",
									"description": ""
								},
								{
									"control_type": "checkbox",
									"control_label": "Remove Critical CSS on User Interaction",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "remove_cpcss_on_user_interaction"
								}
							]
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
									"value": null,
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
									"value": null,
									"key": "uucss_load_js_method"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Javascript from Deferring",
									"control_values": null,
									"value": "",
									"key": "uucss_excluded_js_files_from_defer"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "unused-javascript",
					"name": "Reduce unused JavaScript",
					"scoreDisplayMode": "metricSavings",
					"description": "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn how to reduce unused JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unused-javascript/).",
					"displayValue": "Potential savings of 81 KiB",
					"icon": "fail",
					"files": {
						"type": "opportunity",
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"FCP": 0,
								"LCP": 40
							}
						},
						"headings": [
							{
								"key": "url",
								"subItemsHeading": {
									"key": "source",
									"valueType": "code"
								},
								"valueType": "url",
								"label": "URL"
							},
							{
								"label": "Transfer Size",
								"key": "totalBytes",
								"valueType": "bytes",
								"subItemsHeading": {
									"key": "sourceBytes"
								}
							},
							{
								"label": "Potential Savings",
								"valueType": "bytes",
								"key": "wastedBytes",
								"subItemsHeading": {
									"key": "sourceWastedBytes"
								}
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"overallSavingsBytes": 83055,
						"items": [
							{
								"wastedPercent": 34.64784930109784,
								"url": {
									"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									},
									"tags": [
										"Google Tag Manager"
									]
								},
								"totalBytes": 110496,
								"wastedBytes": 38284,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"wastedPercent": 40.691491710755265,
								"wastedBytes": 22761,
								"totalBytes": 55936,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"wastedPercent": 31.694386291385594,
								"wastedBytes": 22010,
								"url": {
									"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"totalBytes": 69446,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"sortedBy": [
							"wastedBytes"
						],
						"overallSavingsMs": 40,
						"grouped_items": [
							{
								"type": "js",
								"items": [
									{
										"wastedPercent": 34.64784930109784,
										"url": {
											"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											},
											"tags": [
												"Google Tag Manager"
											]
										},
										"totalBytes": 110496,
										"wastedBytes": 38284,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"wastedPercent": 40.691491710755265,
										"wastedBytes": 22761,
										"totalBytes": 55936,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"wastedPercent": 31.694386291385594,
										"wastedBytes": 22010,
										"url": {
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"totalBytes": 69446,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							}
						]
					},
					"type": "opportunity",
					"score": 0,
					"settings": [
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
									"value": null,
									"key": "delay_javascript"
								},
								{
									"control_type": "button",
									"control_label": "Exclude Files",
									"value": null,
									"key": "uucss_exclude_files_from_delay_js",
									"description": ""
								},
								{
									"control_type": "textarea",
									"control_label": "Callback Script",
									"control_values": null,
									"value": "",
									"key": "delay_javascript_callback"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Javascript",
									"control_values": null,
									"value": "",
									"key": "uucss_excluded_js_files"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "user-timings",
					"name": "User Timing marks and measures",
					"scoreDisplayMode": "notApplicable",
					"description": "Consider instrumenting your app with the User Timing API to measure your app's real-world performance during key user experiences. [Learn more about User Timing marks](https://developer.chrome.com/docs/lighthouse/performance/user-timings/).",
					"icon": "fail",
					"files": {
						"headings": [],
						"items": [],
						"type": "table"
					},
					"type": "passed_audit",
					"score": 0,
					"settings": [],
					"metrics": []
				},
				{
					"id": "third-party-facades",
					"name": "Lazy load third-party resources with facades",
					"scoreDisplayMode": "notApplicable",
					"description": "Some third-party embeds can be lazy loaded. Consider replacing them with a facade until they are required. [Learn how to defer third-parties with a facade](https://developer.chrome.com/docs/lighthouse/performance/third-party-facades/).",
					"icon": "fail",
					"type": "passed_audit",
					"score": 0,
					"settings": [
						{
							"name": "Lazy Load Iframes",
							"description": "Delay loading of iframes until needed.",
							"category": "image",
							"inputs": [
								{
									"control_type": "checkbox",
									"control_label": "Lazy Load Iframes",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_lazy_load_iframes"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images/Iframes from Lazy Load",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_lazy_load"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "non-composited-animations",
					"name": "Avoid non-composited animations",
					"scoreDisplayMode": "notApplicable",
					"description": "Animations which are not composited can be janky and increase CLS. [Learn how to avoid non-composited animations](https://developer.chrome.com/docs/lighthouse/performance/non-composited-animations/)",
					"icon": "fail",
					"files": {
						"items": [],
						"headings": [],
						"type": "table"
					},
					"type": "passed_audit",
					"score": 0,
					"settings": [],
					"metrics": [
						{
							"id": "cumulative-layout-shift",
							"title": "Cumulative Layout Shift",
							"scoreDisplayMode": "numeric",
							"description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/articles/cls).",
							"displayValue": "0",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "cumulative-layout-shift",
								"weight": 25,
								"group": "metrics",
								"acronym": "CLS",
								"relevantAudits": [
									"layout-shift-elements",
									"non-composited-animations",
									"unsized-images"
								]
							},
							"potentialGain": 0
						}
					]
				},
				{
					"id": "unused-css-rules",
					"name": "Reduce unused CSS",
					"scoreDisplayMode": "metricSavings",
					"description": "Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content to decrease bytes consumed by network activity. [Learn how to reduce unused CSS](https://developer.chrome.com/docs/lighthouse/performance/unused-css-rules/).",
					"displayValue": "Potential savings of 34 KiB",
					"icon": "average",
					"files": {
						"sortedBy": [
							"wastedBytes"
						],
						"overallSavingsBytes": 34703,
						"items": [
							{
								"totalBytes": 21291,
								"wastedBytes": 21205,
								"url": {
									"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"wastedPercent": 99.59589028039876,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-includes/css/dist/block-library/style.min.css?ver=6.6.2",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"totalBytes": 13536,
								"wastedPercent": 99.71803173699566,
								"wastedBytes": 13498,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"overallSavingsMs": 20,
						"type": "opportunity",
						"headings": [
							{
								"label": "URL",
								"valueType": "url",
								"key": "url"
							},
							{
								"key": "totalBytes",
								"valueType": "bytes",
								"label": "Transfer Size"
							},
							{
								"key": "wastedBytes",
								"label": "Potential Savings",
								"valueType": "bytes"
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"LCP": 20,
								"FCP": 0
							}
						},
						"grouped_items": [
							{
								"type": "css",
								"items": [
									{
										"totalBytes": 21291,
										"wastedBytes": 21205,
										"url": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"wastedPercent": 99.59589028039876,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-includes/css/dist/block-library/style.min.css?ver=6.6.2",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"totalBytes": 13536,
										"wastedPercent": 99.71803173699566,
										"wastedBytes": 13498,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							}
						]
					},
					"type": "opportunity",
					"score": 50,
					"settings": [
						{
							"name": "Remove Unused CSS",
							"description": "Remove unused CSS for each page and reduce page size.",
							"category": "css",
							"inputs": [
								{
									"control_type": "checkbox",
									"control_label": "Remove Unused CSS",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_enable_uucss"
								},
								{
									"control_type": "button",
									"control_label": "Regenerate Unused CSS",
									"action": "rapidload_purge_all",
									"key": "rapidload_purge_all",
									"description": ""
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude CSS Files",
									"control_values": null,
									"value": "",
									"key": "uucss_excluded_files"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "legacy-javascript",
					"name": "Avoid serving legacy JavaScript to modern browsers",
					"scoreDisplayMode": "metricSavings",
					"description": "Polyfills and transforms enable legacy browsers to use new JavaScript features. However, many aren't necessary for modern browsers. For your bundled JavaScript, adopt a modern script deployment strategy using module/nomodule feature detection to reduce the amount of code shipped to modern browsers, while retaining support for legacy browsers. [Learn how to use modern JavaScript](https://web.dev/articles/publish-modern-javascript)",
					"displayValue": "Potential savings of 0 KiB",
					"icon": "average",
					"files": {
						"debugData": {
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							},
							"type": "debugdata"
						},
						"sortedBy": [
							"wastedBytes"
						],
						"overallSavingsMs": 0,
						"items": [
							{
								"totalBytes": 0,
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"signal": "@babel/plugin-transform-classes",
											"location": {
												"column": 921,
												"type": "source-location",
												"line": 2,
												"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
												"urlProvider": "network"
											}
										}
									]
								},
								"url": {
									"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"wastedBytes": 65,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"wastedBytes": 58,
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"location": {
												"type": "source-location",
												"column": 78941,
												"urlProvider": "network",
												"line": 1,
												"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js"
											},
											"signal": "@babel/plugin-transform-classes"
										}
									]
								},
								"totalBytes": 0,
								"url": {
									"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"signal": "@babel/plugin-transform-classes",
											"location": {
												"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
												"urlProvider": "network",
												"line": 1,
												"type": "source-location",
												"column": 277201
											}
										}
									]
								},
								"totalBytes": 0,
								"wastedBytes": 37,
								"url": {
									"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"headings": [
							{
								"key": "url",
								"label": "URL",
								"valueType": "url",
								"subItemsHeading": {
									"key": "location",
									"valueType": "source-location"
								}
							},
							{
								"subItemsHeading": {
									"key": "signal"
								},
								"key": null,
								"valueType": "code"
							},
							{
								"key": "wastedBytes",
								"valueType": "bytes",
								"label": "Potential Savings"
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"type": "opportunity",
						"overallSavingsBytes": 160,
						"grouped_items": [
							{
								"type": "js",
								"items": [
									{
										"totalBytes": 0,
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"signal": "@babel/plugin-transform-classes",
													"location": {
														"column": 921,
														"type": "source-location",
														"line": 2,
														"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
														"urlProvider": "network"
													}
												}
											]
										},
										"url": {
											"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"wastedBytes": 65,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"wastedBytes": 58,
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"location": {
														"type": "source-location",
														"column": 78941,
														"urlProvider": "network",
														"line": 1,
														"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js"
													},
													"signal": "@babel/plugin-transform-classes"
												}
											]
										},
										"totalBytes": 0,
										"url": {
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"signal": "@babel/plugin-transform-classes",
													"location": {
														"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
														"urlProvider": "network",
														"line": 1,
														"type": "source-location",
														"column": 277201
													}
												}
											]
										},
										"totalBytes": 0,
										"wastedBytes": 37,
										"url": {
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							}
						]
					},
					"type": "opportunity",
					"score": 50,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "uses-long-cache-ttl",
					"name": "Serve static assets with an efficient cache policy",
					"scoreDisplayMode": "metricSavings",
					"description": "A long cache lifetime can speed up repeat visits to your page. [Learn more about efficient cache policies](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/).",
					"displayValue": "1 resource found",
					"icon": "average",
					"files": {
						"sortedBy": [
							"totalBytes"
						],
						"type": "table",
						"items": [
							{
								"totalBytes": 6513,
								"url": {
									"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"cacheHitProbability": 0.008333333333333333,
								"wastedBytes": 6458.725,
								"debugData": {
									"max-age": 60,
									"type": "debugdata"
								},
								"cacheLifetimeMs": 60000
							}
						],
						"skipSumming": [
							"cacheLifetimeMs"
						],
						"headings": [
							{
								"label": "URL",
								"key": "url",
								"valueType": "url"
							},
							{
								"label": "Cache TTL",
								"valueType": "ms",
								"key": "cacheLifetimeMs",
								"displayUnit": "duration"
							},
							{
								"key": "totalBytes",
								"displayUnit": "kb",
								"label": "Transfer Size",
								"granularity": 1,
								"valueType": "bytes"
							}
						],
						"summary": {
							"wastedBytes": 6458.725
						},
						"grouped_items": [
							{
								"type": "js",
								"items": [
									{
										"totalBytes": 6513,
										"url": {
											"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"cacheHitProbability": 0.008333333333333333,
										"wastedBytes": 6458.725,
										"debugData": {
											"max-age": 60,
											"type": "debugdata"
										},
										"cacheLifetimeMs": 60000
									}
								]
							}
						]
					},
					"type": "diagnostics",
					"score": 50,
					"settings": [
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
									"value": null,
									"key": "uucss_enable_cdn"
								}
							]
						},
						{
							"name": "Cache Policy",
							"description": "Set up cache-control header to increase the browser cache expiration",
							"category": "cache",
							"inputs": [
								{
									"control_type": "button",
									"control_label": "Setup Policies",
									"value": "update_htaccess_file",
									"key": "update_htaccess_file",
									"description": ""
								}
							]
						}
					],
					"metrics": []
				},
				{
					"id": "uses-responsive-images",
					"name": "Properly size images",
					"scoreDisplayMode": "metricSavings",
					"description": "Serve images that are appropriately-sized to save cellular data and improve load time. [Learn how to size images](https://developer.chrome.com/docs/lighthouse/performance/uses-responsive-images/).",
					"icon": "pass",
					"files": {
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"FCP": 0,
								"LCP": 0
							}
						},
						"overallSavingsBytes": 0,
						"overallSavingsMs": 0,
						"type": "opportunity",
						"items": [],
						"sortedBy": [
							"wastedBytes"
						],
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
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
									"value": null,
									"key": "uucss_image_optimize_level"
								},
								{
									"control_type": "checkbox",
									"control_label": "Low Quality Image placeholders (LQIP)",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_generate_blurry_place_holder"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images from modern image urls",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_modern_images"
								}
							]
						}
					],
					"metrics": []
				},
				{
					"id": "offscreen-images",
					"name": "Defer offscreen images",
					"scoreDisplayMode": "metricSavings",
					"description": "Consider lazy-loading offscreen and hidden images after all critical resources have finished loading to lower time to interactive. [Learn how to defer offscreen images](https://developer.chrome.com/docs/lighthouse/performance/offscreen-images/).",
					"icon": "pass",
					"files": {
						"type": "opportunity",
						"sortedBy": [
							"wastedBytes"
						],
						"debugData": {
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							},
							"type": "debugdata"
						},
						"items": [],
						"overallSavingsMs": 0,
						"headings": [],
						"overallSavingsBytes": 0
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
						{
							"name": "Lazy Load Images",
							"description": "Delay loading of images until needed.",
							"category": "image",
							"inputs": [
								{
									"control_type": "checkbox",
									"control_label": "Lazy Load Images",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_lazy_load_images"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images/Iframes from Lazy Load",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_lazy_load"
								}
							]
						}
					],
					"metrics": []
				},
				{
					"id": "unminified-css",
					"name": "Minify CSS",
					"scoreDisplayMode": "metricSavings",
					"description": "Minifying CSS files can reduce network payload sizes. [Learn how to minify CSS](https://developer.chrome.com/docs/lighthouse/performance/unminified-css/).",
					"icon": "pass",
					"files": {
						"overallSavingsBytes": 0,
						"debugData": {
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							},
							"type": "debugdata"
						},
						"headings": [],
						"overallSavingsMs": 0,
						"items": [],
						"sortedBy": [
							"wastedBytes"
						],
						"type": "opportunity"
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
									"key": "uucss_minify"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images from being minify",
									"control_values": null,
									"value": "",
									"key": "uucss_minify_excluded_files"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "unminified-javascript",
					"name": "Minify JavaScript",
					"scoreDisplayMode": "metricSavings",
					"description": "Minifying JavaScript files can reduce payload sizes and script parse time. [Learn how to minify JavaScript](https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/).",
					"icon": "pass",
					"files": {
						"overallSavingsMs": 0,
						"overallSavingsBytes": 0,
						"type": "opportunity",
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"FCP": 0,
								"LCP": 0
							}
						},
						"headings": [],
						"sortedBy": [
							"wastedBytes"
						],
						"items": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
									"key": "minify_js"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude js files from being minify",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_files_from_minify_js"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "uses-optimized-images",
					"name": "Efficiently encode images",
					"scoreDisplayMode": "metricSavings",
					"description": "Optimized images load faster and consume less cellular data. [Learn how to efficiently encode images](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/).",
					"icon": "pass",
					"files": {
						"type": "opportunity",
						"sortedBy": [
							"wastedBytes"
						],
						"headings": [],
						"overallSavingsBytes": 0,
						"overallSavingsMs": 0,
						"debugData": {
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							},
							"type": "debugdata"
						},
						"items": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
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
									"value": null,
									"key": "uucss_image_optimize_level"
								},
								{
									"control_type": "checkbox",
									"control_label": "Low Quality Image placeholders (LQIP)",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_generate_blurry_place_holder"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images from modern image urls",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_modern_images"
								}
							]
						}
					],
					"metrics": []
				},
				{
					"id": "modern-image-formats",
					"name": "Serve images in next-gen formats",
					"scoreDisplayMode": "metricSavings",
					"description": "Image formats like WebP and AVIF often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. [Learn more about modern image formats](https://developer.chrome.com/docs/lighthouse/performance/uses-webp-images/).",
					"icon": "pass",
					"files": {
						"overallSavingsMs": 0,
						"headings": [],
						"type": "opportunity",
						"items": [],
						"overallSavingsBytes": 0,
						"debugData": {
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							},
							"type": "debugdata"
						},
						"sortedBy": [
							"wastedBytes"
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
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
									"value": null,
									"key": "uucss_image_optimize_level"
								},
								{
									"control_type": "checkbox",
									"control_label": "Low Quality Image placeholders (LQIP)",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_generate_blurry_place_holder"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images from modern image urls",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_modern_images"
								}
							]
						}
					],
					"metrics": []
				},
				{
					"id": "uses-text-compression",
					"name": "Enable text compression",
					"scoreDisplayMode": "metricSavings",
					"description": "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes. [Learn more about text compression](https://developer.chrome.com/docs/lighthouse/performance/uses-text-compression/).",
					"icon": "pass",
					"files": {
						"overallSavingsBytes": 0,
						"overallSavingsMs": 0,
						"type": "opportunity",
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"LCP": 0,
								"FCP": 0
							}
						},
						"items": [],
						"sortedBy": [
							"wastedBytes"
						],
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "uses-rel-preconnect",
					"name": "Preconnect to required origins",
					"scoreDisplayMode": "metricSavings",
					"description": "Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn how to preconnect to required origins](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/).",
					"icon": "pass",
					"files": {
						"sortedBy": [
							"wastedMs"
						],
						"items": [],
						"type": "opportunity",
						"headings": [],
						"overallSavingsMs": 0
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "server-response-time",
					"name": "Initial server response time was short",
					"scoreDisplayMode": "informative",
					"description": "Keep the server response time for the main document short because all other requests depend on it. [Learn more about the Time to First Byte metric](https://developer.chrome.com/docs/lighthouse/performance/time-to-first-byte/).",
					"displayValue": "Root document took 420 ms",
					"icon": "pass",
					"files": {
						"overallSavingsMs": 321,
						"headings": [
							{
								"label": "URL",
								"valueType": "url",
								"key": "url"
							},
							{
								"valueType": "timespanMs",
								"label": "Time Spent",
								"key": "responseTime"
							}
						],
						"items": [
							{
								"responseTime": 421,
								"url": {
									"url": "https://staging.rapidload.io/",
									"file_type": {
										"label": "Unknown",
										"value": "unknown"
									}
								}
							}
						],
						"type": "opportunity",
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"responseTime": 421,
										"url": {
											"url": "https://staging.rapidload.io/",
											"file_type": {
												"label": "Unknown",
												"value": "unknown"
											}
										}
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
						{
							"name": "Page Cache",
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
									"value": null,
									"key": "uucss_enable_cache"
								}
							]
						},
						{
							"name": "Preload Links",
							"description": "Preload Links",
							"category": "cache",
							"inputs": [
								{
									"control_type": "checkbox",
									"control_label": "Preload Links",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "preload_internal_links"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "redirects",
					"name": "Avoid multiple page redirects",
					"scoreDisplayMode": "metricSavings",
					"description": "Redirects introduce additional delays before the page can be loaded. [Learn how to avoid page redirects](https://developer.chrome.com/docs/lighthouse/performance/redirects/).",
					"icon": "pass",
					"files": {
						"items": [],
						"type": "opportunity",
						"overallSavingsMs": 0,
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "efficient-animated-content",
					"name": "Use video formats for animated content",
					"scoreDisplayMode": "metricSavings",
					"description": "Large GIFs are inefficient for delivering animated content. Consider using MPEG4/WebM videos for animations and PNG/WebP for static images instead of GIF to save network bytes. [Learn more about efficient video formats](https://developer.chrome.com/docs/lighthouse/performance/efficient-animated-content/)",
					"icon": "pass",
					"files": {
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"FCP": 0,
								"LCP": 0
							}
						},
						"type": "opportunity",
						"items": [],
						"overallSavingsMs": 0,
						"sortedBy": [
							"wastedBytes"
						],
						"headings": [],
						"overallSavingsBytes": 0
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "duplicated-javascript",
					"name": "Remove duplicate modules in JavaScript bundles",
					"scoreDisplayMode": "metricSavings",
					"description": "Remove large, duplicate JavaScript modules from bundles to reduce unnecessary bytes consumed by network activity. ",
					"icon": "pass",
					"files": {
						"overallSavingsBytes": 0,
						"headings": [],
						"type": "opportunity",
						"overallSavingsMs": 0,
						"items": [],
						"debugData": {
							"type": "debugdata",
							"metricSavings": {
								"FCP": 0,
								"LCP": 0
							}
						},
						"sortedBy": [
							"wastedBytes"
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "total-byte-weight",
					"name": "Avoids enormous network payloads",
					"scoreDisplayMode": "informative",
					"description": "Large network payloads cost users real money and are highly correlated with long load times. [Learn how to reduce payload sizes](https://developer.chrome.com/docs/lighthouse/performance/total-byte-weight/).",
					"displayValue": "Total size was 594 KiB",
					"icon": "pass",
					"files": {
						"type": "table",
						"items": [
							{
								"totalBytes": 167594,
								"url": {
									"url": "https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-website.svg",
									"file_type": {
										"label": "Image",
										"value": "image"
									}
								}
							},
							{
								"url": {
									"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									},
									"tags": [
										"Google Tag Manager"
									]
								},
								"totalBytes": 111570,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"totalBytes": 71318,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"totalBytes": 56773,
								"url": {
									"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.7.1",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"totalBytes": 30510,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"totalBytes": 22262,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"totalBytes": 19855,
								"url": {
									"url": "https://staging.rapidload.io/",
									"file_type": {
										"label": "Unknown",
										"value": "unknown"
									}
								}
							},
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-includes/css/dist/block-library/style.min.css?ver=6.6.2",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"totalBytes": 14500,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"totalBytes": 8036,
								"url": {
									"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
									"file_type": {
										"label": "CSS",
										"value": "css"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"url": {
									"url": "https://staging.rapidload.io/wp-content/cache/rapidload/js/home-new-a86ca5a59490.min.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"totalBytes": 6571,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"headings": [
							{
								"label": "URL",
								"valueType": "url",
								"key": "url"
							},
							{
								"key": "totalBytes",
								"valueType": "bytes",
								"label": "Transfer Size"
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"sortedBy": [
							"totalBytes"
						],
						"grouped_items": [
							{
								"type": "image",
								"items": [
									{
										"totalBytes": 167594,
										"url": {
											"url": "https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-website.svg",
											"file_type": {
												"label": "Image",
												"value": "image"
											}
										}
									}
								]
							},
							{
								"type": "js",
								"items": [
									{
										"url": {
											"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											},
											"tags": [
												"Google Tag Manager"
											]
										},
										"totalBytes": 111570,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"totalBytes": 71318,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"totalBytes": 56773,
										"url": {
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.7.1",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"totalBytes": 30510,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/js/home-new-a86ca5a59490.min.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"totalBytes": 6571,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							},
							{
								"type": "css",
								"items": [
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"totalBytes": 22262,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"url": {
											"url": "https://staging.rapidload.io/wp-includes/css/dist/block-library/style.min.css?ver=6.6.2",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"totalBytes": 14500,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"totalBytes": 8036,
										"url": {
											"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
											"file_type": {
												"label": "CSS",
												"value": "css"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							},
							{
								"type": "unknown",
								"items": [
									{
										"totalBytes": 19855,
										"url": {
											"url": "https://staging.rapidload.io/",
											"file_type": {
												"label": "Unknown",
												"value": "unknown"
											}
										}
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "dom-size",
					"name": "Avoids an excessive DOM size",
					"scoreDisplayMode": "informative",
					"description": "A large DOM will increase memory usage, cause longer [style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations), and produce costly [layout reflows](https://developers.google.com/speed/articles/reflow). [Learn how to avoid an excessive DOM size](https://developer.chrome.com/docs/lighthouse/performance/dom-size/).",
					"displayValue": "695 elements",
					"icon": "pass",
					"files": {
						"type": "table",
						"headings": [
							{
								"valueType": "text",
								"label": "Statistic",
								"key": "statistic"
							},
							{
								"label": "Element",
								"valueType": "node",
								"key": "node"
							},
							{
								"valueType": "numeric",
								"key": "value",
								"label": "Value"
							}
						],
						"items": [
							{
								"value": {
									"type": "numeric",
									"value": 695,
									"granularity": 1
								},
								"statistic": "Total DOM Elements"
							},
							{
								"value": {
									"value": 18,
									"granularity": 1,
									"type": "numeric"
								},
								"node": {
									"path": "1,HTML,1,BODY,16,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,FORM,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,LABEL,1,DIV,0,svg,2,defs,0,clipPath,0,path",
									"snippet": "<path fill=\"#fff\" d=\"M0 0h40v40H0z\">",
									"selector": "svg > defs > clippath#a > path",
									"boundingRect": {
										"right": 1396,
										"width": 40,
										"top": 425,
										"height": 40,
										"bottom": 465,
										"left": 1356
									},
									"nodeLabel": "svg > defs > clippath#a > path",
									"type": "node",
									"lhId": "1-0-path"
								},
								"statistic": "Maximum DOM Depth"
							},
							{
								"statistic": "Maximum Child Elements",
								"value": {
									"type": "numeric",
									"granularity": 1,
									"value": 248
								},
								"node": {
									"snippet": "<div class=\"page-content\">",
									"type": "node",
									"nodeLabel": "Reveal Your Website’s\nHidden Page Speed Issues\nDon’t let hidden issues slow dow…",
									"boundingRect": {
										"bottom": 29363,
										"right": 1148,
										"left": 188,
										"top": 72,
										"height": 29291,
										"width": 960
									},
									"selector": "body.home > main.site-main > div.page-content",
									"path": "1,HTML,1,BODY,1,MAIN,1,DIV",
									"lhId": "1-1-DIV"
								}
							}
						],
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"value": {
											"type": "numeric",
											"value": 695,
											"granularity": 1
										},
										"statistic": "Total DOM Elements"
									},
									{
										"value": {
											"value": 18,
											"granularity": 1,
											"type": "numeric"
										},
										"node": {
											"path": "1,HTML,1,BODY,16,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,FORM,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,LABEL,1,DIV,0,svg,2,defs,0,clipPath,0,path",
											"snippet": "<path fill=\"#fff\" d=\"M0 0h40v40H0z\">",
											"selector": "svg > defs > clippath#a > path",
											"boundingRect": {
												"right": 1396,
												"width": 40,
												"top": 425,
												"height": 40,
												"bottom": 465,
												"left": 1356
											},
											"nodeLabel": "svg > defs > clippath#a > path",
											"type": "node",
											"lhId": "1-0-path"
										},
										"statistic": "Maximum DOM Depth"
									},
									{
										"statistic": "Maximum Child Elements",
										"value": {
											"type": "numeric",
											"granularity": 1,
											"value": 248
										},
										"node": {
											"snippet": "<div class=\"page-content\">",
											"type": "node",
											"nodeLabel": "Reveal Your Website’s\nHidden Page Speed Issues\nDon’t let hidden issues slow dow…",
											"boundingRect": {
												"bottom": 29363,
												"right": 1148,
												"left": 188,
												"top": 72,
												"height": 29291,
												"width": 960
											},
											"selector": "body.home > main.site-main > div.page-content",
											"path": "1,HTML,1,BODY,1,MAIN,1,DIV",
											"lhId": "1-1-DIV"
										}
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "bootup-time",
					"name": "JavaScript execution time",
					"scoreDisplayMode": "informative",
					"description": "Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. [Learn how to reduce Javascript execution time](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/).",
					"displayValue": "0.5 s",
					"icon": "pass",
					"files": {
						"summary": {
							"wastedMs": 477.81299999999965
						},
						"type": "table",
						"items": [
							{
								"total": 283.98399999999947,
								"scripting": 225.54599999999948,
								"scriptParseCompile": 4.796,
								"url": {
									"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"scriptParseCompile": 1.74,
								"scripting": 54.537000000000006,
								"total": 143.04299999999998,
								"url": {
									"url": "https://staging.rapidload.io/",
									"file_type": {
										"label": "Unknown",
										"value": "unknown"
									}
								}
							},
							{
								"scriptParseCompile": 4.935,
								"scripting": 78.28100000000019,
								"url": {
									"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									},
									"tags": [
										"Google Tag Manager"
									]
								},
								"total": 98.3860000000002,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"total": 66.32799999999997,
								"url": {
									"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"scripting": 53.57599999999997,
								"scriptParseCompile": 8.607,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"scriptParseCompile": 0,
								"total": 64.95500000000015,
								"url": "Unattributable",
								"scripting": 1.437
							},
							{
								"scripting": 42.873,
								"scriptParseCompile": 1.485,
								"url": {
									"url": "https://staging.rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.7.1",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"total": 51.957,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"sortedBy": [
							"total"
						],
						"headings": [
							{
								"valueType": "url",
								"label": "URL",
								"key": "url"
							},
							{
								"key": "total",
								"label": "Total CPU Time",
								"valueType": "ms",
								"granularity": 1
							},
							{
								"granularity": 1,
								"key": "scripting",
								"valueType": "ms",
								"label": "Script Evaluation"
							},
							{
								"label": "Script Parse",
								"valueType": "ms",
								"key": "scriptParseCompile",
								"granularity": 1
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"grouped_items": [
							{
								"type": "js",
								"items": [
									{
										"total": 283.98399999999947,
										"scripting": 225.54599999999948,
										"scriptParseCompile": 4.796,
										"url": {
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"scriptParseCompile": 4.935,
										"scripting": 78.28100000000019,
										"url": {
											"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											},
											"tags": [
												"Google Tag Manager"
											]
										},
										"total": 98.3860000000002,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"total": 66.32799999999997,
										"url": {
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"scripting": 53.57599999999997,
										"scriptParseCompile": 8.607,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"scripting": 42.873,
										"scriptParseCompile": 1.485,
										"url": {
											"url": "https://staging.rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.7.1",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"total": 51.957,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							},
							{
								"type": "unknown",
								"items": [
									{
										"scriptParseCompile": 1.74,
										"scripting": 54.537000000000006,
										"total": 143.04299999999998,
										"url": {
											"url": "https://staging.rapidload.io/",
											"file_type": {
												"label": "Unknown",
												"value": "unknown"
											}
										}
									},
									{
										"scriptParseCompile": 0,
										"total": 64.95500000000015,
										"url": "Unattributable",
										"scripting": 1.437
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
									"key": "delay_javascript"
								},
								{
									"control_type": "button",
									"control_label": "Exclude Files",
									"value": null,
									"key": "uucss_exclude_files_from_delay_js",
									"description": ""
								},
								{
									"control_type": "textarea",
									"control_label": "Callback Script",
									"control_values": null,
									"value": "",
									"key": "delay_javascript_callback"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Javascript",
									"control_values": null,
									"value": "",
									"key": "uucss_excluded_js_files"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "mainthread-work-breakdown",
					"name": "Minimizes main-thread work",
					"scoreDisplayMode": "informative",
					"description": "Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. [Learn how to minimize main-thread work](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)",
					"displayValue": "0.8 s",
					"icon": "pass",
					"files": {
						"items": [
							{
								"groupLabel": "Script Evaluation",
								"group": "scriptEvaluation",
								"duration": 489.73899999999617
							},
							{
								"group": "other",
								"duration": 102.03800000000028,
								"groupLabel": "Other"
							},
							{
								"group": "styleLayout",
								"duration": 94.732,
								"groupLabel": "Style & Layout"
							},
							{
								"duration": 24.784,
								"groupLabel": "Script Parsing & Compilation",
								"group": "scriptParseCompile"
							},
							{
								"groupLabel": "Rendering",
								"duration": 22.802,
								"group": "paintCompositeRender"
							},
							{
								"duration": 17.26500000000001,
								"group": "parseHTML",
								"groupLabel": "Parse HTML & CSS"
							},
							{
								"duration": 8.978000000000003,
								"group": "garbageCollection",
								"groupLabel": "Garbage Collection"
							}
						],
						"headings": [
							{
								"valueType": "text",
								"label": "Category",
								"key": "groupLabel"
							},
							{
								"label": "Time Spent",
								"valueType": "ms",
								"key": "duration",
								"granularity": 1
							}
						],
						"type": "table",
						"sortedBy": [
							"duration"
						],
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"groupLabel": "Script Evaluation",
										"group": "scriptEvaluation",
										"duration": 489.73899999999617
									},
									{
										"group": "other",
										"duration": 102.03800000000028,
										"groupLabel": "Other"
									},
									{
										"group": "styleLayout",
										"duration": 94.732,
										"groupLabel": "Style & Layout"
									},
									{
										"duration": 24.784,
										"groupLabel": "Script Parsing & Compilation",
										"group": "scriptParseCompile"
									},
									{
										"groupLabel": "Rendering",
										"duration": 22.802,
										"group": "paintCompositeRender"
									},
									{
										"duration": 17.26500000000001,
										"group": "parseHTML",
										"groupLabel": "Parse HTML & CSS"
									},
									{
										"duration": 8.978000000000003,
										"group": "garbageCollection",
										"groupLabel": "Garbage Collection"
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "font-display",
					"name": "All text remains visible during webfont loads",
					"scoreDisplayMode": "metricSavings",
					"description": "Leverage the `font-display` CSS feature to ensure text is user-visible while webfonts are loading. [Learn more about `font-display`](https://developer.chrome.com/docs/lighthouse/performance/font-display/).",
					"icon": "pass",
					"files": {
						"headings": [],
						"items": [],
						"type": "table"
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
									"key": "uucss_self_host_google_fonts"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "third-party-summary",
					"name": "Minimize third-party usage",
					"scoreDisplayMode": "informative",
					"description": "Third-party code can significantly impact load performance. Limit the number of redundant third-party providers and try to load third-party code after your page has primarily finished loading. [Learn how to minimize third-party impact](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/).",
					"displayValue": "Third-party code blocked the main thread for 150 ms",
					"icon": "pass",
					"files": {
						"items": [
							{
								"tbtImpact": 151.99396087509783,
								"subItems": {
									"items": [
										{
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"tbtImpact": 144.77318053388726,
											"mainThreadTime": 283.98399999999793,
											"blockingTime": 144.77318053388726,
											"transferSize": 56773
										},
										{
											"mainThreadTime": 66.32800000000005,
											"blockingTime": 7.220780341210559,
											"tbtImpact": 7.220780341210559,
											"transferSize": 71318,
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js"
										},
										{
											"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
											"tbtImpact": 0,
											"transferSize": 6513,
											"blockingTime": 0,
											"mainThreadTime": 2.63
										},
										{
											"blockingTime": 0,
											"url": "https://surveystats.hotjar.io/hit?id=1423095&device=desktop",
											"mainThreadTime": 0,
											"transferSize": 674,
											"tbtImpact": 0
										},
										{
											"mainThreadTime": 0,
											"transferSize": 306,
											"tbtImpact": 0,
											"blockingTime": 0,
											"url": "https://vc.hotjar.io/sessions/3011767?s=0.25&r=0.16896068064164682"
										},
										{
											"blockingTime": 0,
											"tbtImpact": 0,
											"url": "https://content.hotjar.io/?site_id=3011767&gzip=1",
											"transferSize": 222,
											"mainThreadTime": 0
										}
									],
									"type": "subitems"
								},
								"entity": "Hotjar",
								"transferSize": 135806,
								"blockingTime": 151.99396087509783,
								"mainThreadTime": 352.94199999999796
							},
							{
								"mainThreadTime": 98.38600000000017,
								"entity": "Google Tag Manager",
								"subItems": {
									"items": [
										{
											"mainThreadTime": 98.38600000000017,
											"tbtImpact": 0,
											"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
											"blockingTime": 0,
											"transferSize": 111570
										}
									],
									"type": "subitems"
								},
								"transferSize": 111570,
								"blockingTime": 0,
								"tbtImpact": 0
							},
							{
								"entity": "rapidload-cdn.io",
								"tbtImpact": 0,
								"blockingTime": 0,
								"transferSize": 30017,
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"tbtImpact": 0,
											"blockingTime": 0,
											"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_200,h_200/http://staging.rapidload.io/wp-content/uploads/2024/08/Geoferry-Gussis.png",
											"transferSize": 5280,
											"mainThreadTime": 0
										},
										{
											"mainThreadTime": 0,
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_200/http://staging.rapidload.io/wp-content/uploads/2024/08/Geoferry-Gussis.png",
											"tbtImpact": 0,
											"blockingTime": 0,
											"transferSize": 5280
										},
										{
											"transferSize": 3534,
											"mainThreadTime": 0,
											"blockingTime": 0,
											"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_93,h_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-21.png",
											"tbtImpact": 0
										},
										{
											"tbtImpact": 0,
											"blockingTime": 0,
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-21.png",
											"transferSize": 3534,
											"mainThreadTime": 0
										},
										{
											"tbtImpact": 0,
											"transferSize": 2750,
											"mainThreadTime": 0,
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-19.png",
											"blockingTime": 0
										},
										{
											"transferSize": 2171,
											"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_48,h_19/http://staging.rapidload.io/wp-content/uploads/2024/08/Group-1448.png",
											"mainThreadTime": 0,
											"tbtImpact": 0,
											"blockingTime": 0
										},
										{
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_48/http://staging.rapidload.io/wp-content/uploads/2024/08/Group-1448.png",
											"tbtImpact": 0,
											"transferSize": 2171,
											"mainThreadTime": 0,
											"blockingTime": 0
										},
										{
											"tbtImpact": 0,
											"blockingTime": 0,
											"mainThreadTime": 0,
											"transferSize": 1328,
											"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_1140,h_928/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7054-qubw7xv1lzej1v9ogm37mqgljzcmninzq6c6to5s1s.png"
										},
										{
											"blockingTime": 0,
											"transferSize": 1328,
											"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_1140,h_928/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7055-qubw7vzd8bbyencerl9yhqxod7lw84gj1x17v48ke8.png",
											"mainThreadTime": 0,
											"tbtImpact": 0
										},
										{
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_960/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7054-qubw7xv1lzej1v9ogm37mqgljzcmninzq6c6to5s1s.png",
											"tbtImpact": 0,
											"blockingTime": 0,
											"mainThreadTime": 0,
											"transferSize": 1328
										},
										{
											"transferSize": 1313,
											"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_960/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7055-qubw7vzd8bbyencerl9yhqxod7lw84gj1x17v48ke8.png",
											"mainThreadTime": 0,
											"blockingTime": 0,
											"tbtImpact": 0
										}
									]
								},
								"mainThreadTime": 0
							},
							{
								"transferSize": 8036,
								"subItems": {
									"items": [
										{
											"tbtImpact": 0,
											"transferSize": 8036,
											"blockingTime": 0,
											"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
											"mainThreadTime": 1.471
										}
									],
									"type": "subitems"
								},
								"entity": "Bootstrap CDN",
								"blockingTime": 0,
								"tbtImpact": 0,
								"mainThreadTime": 1.471
							},
							{
								"entity": "Google Analytics",
								"transferSize": 800,
								"tbtImpact": 0,
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"mainThreadTime": 0,
											"tbtImpact": 0,
											"blockingTime": 0,
											"url": "https://analytics.google.com/g/collect?v=2&tid=G-4ZTDF2L9YB&gtm=45je4as0v877920433za200&_p=1730359143060&_gaz=1&gcd=13l3l3l3l1l1&npa=0&dma=0&tag_exp=101533421~101823848~101878899~101878944~101925629&cid=1161536373.1730359143&ul=en-us&sr=800x600&uaa=x86&uab=64&uafvl=Chromium%3B130.0.6723.58%7CHeadlessChrome%3B130.0.6723.58%7CNot%253FA_Brand%3B99.0.0.0&uamb=0&uam=&uap=macOS&uapv=10.15.7&uaw=0&are=1&pae=1&frm=0&pscdl=noapi&_s=1&sid=1730359143&sct=1&seg=0&dl=https%3A%2F%2Fstaging.rapidload.io%2F&dt=staging.rapidload.io%20%E2%80%93%20Automated%20WordPress%20Unused%20CSS%20Removal&en=page_view&_fv=1&_nsi=1&_ss=1&_ee=1&tfd=1456",
											"transferSize": 800
										}
									]
								},
								"mainThreadTime": 0,
								"blockingTime": 0
							},
							{
								"mainThreadTime": 3.381999999999999,
								"entity": "Google/Doubleclick Ads",
								"tbtImpact": 0,
								"transferSize": 747,
								"subItems": {
									"type": "subitems",
									"items": [
										{
											"transferSize": 747,
											"tbtImpact": 0,
											"mainThreadTime": 3.381999999999999,
											"blockingTime": 0,
											"url": "https://td.doubleclick.net/td/ga/rul?tid=G-4ZTDF2L9YB&gacid=1161536373.1730359143&gtm=45je4as0v877920433za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=101533421~101823848~101878899~101878944~101925629&z=6970500"
										},
										{
											"blockingTime": 0,
											"url": "https://stats.g.doubleclick.net/g/collect?v=2&tid=G-4ZTDF2L9YB&cid=1161536373.1730359143&gtm=45je4as0v877920433za200&aip=1&dma=0&gcd=13l3l3l3l1l1&npa=0&frm=0&tag_exp=101533421~101823848~101878899~101878944~101925629",
											"transferSize": 0,
											"mainThreadTime": 0,
											"tbtImpact": 0
										}
									]
								},
								"blockingTime": 0
							}
						],
						"isEntityGrouped": true,
						"headings": [
							{
								"label": "Third-Party",
								"subItemsHeading": {
									"key": "url",
									"valueType": "url"
								},
								"key": "entity",
								"valueType": "text"
							},
							{
								"key": "transferSize",
								"subItemsHeading": {
									"key": "transferSize"
								},
								"label": "Transfer Size",
								"valueType": "bytes",
								"granularity": 1
							},
							{
								"valueType": "ms",
								"granularity": 1,
								"label": "Main-Thread Blocking Time",
								"key": "blockingTime",
								"subItemsHeading": {
									"key": "blockingTime"
								}
							}
						],
						"summary": {
							"wastedBytes": 286976,
							"wastedMs": 151.99396087509783
						},
						"type": "table",
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"tbtImpact": 151.99396087509783,
										"subItems": {
											"items": [
												{
													"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
													"tbtImpact": 144.77318053388726,
													"mainThreadTime": 283.98399999999793,
													"blockingTime": 144.77318053388726,
													"transferSize": 56773
												},
												{
													"mainThreadTime": 66.32800000000005,
													"blockingTime": 7.220780341210559,
													"tbtImpact": 7.220780341210559,
													"transferSize": 71318,
													"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js"
												},
												{
													"url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
													"tbtImpact": 0,
													"transferSize": 6513,
													"blockingTime": 0,
													"mainThreadTime": 2.63
												},
												{
													"blockingTime": 0,
													"url": "https://surveystats.hotjar.io/hit?id=1423095&device=desktop",
													"mainThreadTime": 0,
													"transferSize": 674,
													"tbtImpact": 0
												},
												{
													"mainThreadTime": 0,
													"transferSize": 306,
													"tbtImpact": 0,
													"blockingTime": 0,
													"url": "https://vc.hotjar.io/sessions/3011767?s=0.25&r=0.16896068064164682"
												},
												{
													"blockingTime": 0,
													"tbtImpact": 0,
													"url": "https://content.hotjar.io/?site_id=3011767&gzip=1",
													"transferSize": 222,
													"mainThreadTime": 0
												}
											],
											"type": "subitems"
										},
										"entity": "Hotjar",
										"transferSize": 135806,
										"blockingTime": 151.99396087509783,
										"mainThreadTime": 352.94199999999796
									},
									{
										"mainThreadTime": 98.38600000000017,
										"entity": "Google Tag Manager",
										"subItems": {
											"items": [
												{
													"mainThreadTime": 98.38600000000017,
													"tbtImpact": 0,
													"url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
													"blockingTime": 0,
													"transferSize": 111570
												}
											],
											"type": "subitems"
										},
										"transferSize": 111570,
										"blockingTime": 0,
										"tbtImpact": 0
									},
									{
										"entity": "rapidload-cdn.io",
										"tbtImpact": 0,
										"blockingTime": 0,
										"transferSize": 30017,
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"tbtImpact": 0,
													"blockingTime": 0,
													"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_200,h_200/http://staging.rapidload.io/wp-content/uploads/2024/08/Geoferry-Gussis.png",
													"transferSize": 5280,
													"mainThreadTime": 0
												},
												{
													"mainThreadTime": 0,
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_200/http://staging.rapidload.io/wp-content/uploads/2024/08/Geoferry-Gussis.png",
													"tbtImpact": 0,
													"blockingTime": 0,
													"transferSize": 5280
												},
												{
													"transferSize": 3534,
													"mainThreadTime": 0,
													"blockingTime": 0,
													"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_93,h_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-21.png",
													"tbtImpact": 0
												},
												{
													"tbtImpact": 0,
													"blockingTime": 0,
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-21.png",
													"transferSize": 3534,
													"mainThreadTime": 0
												},
												{
													"tbtImpact": 0,
													"transferSize": 2750,
													"mainThreadTime": 0,
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_93/http://staging.rapidload.io/wp-content/uploads/2024/08/image-19.png",
													"blockingTime": 0
												},
												{
													"transferSize": 2171,
													"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_48,h_19/http://staging.rapidload.io/wp-content/uploads/2024/08/Group-1448.png",
													"mainThreadTime": 0,
													"tbtImpact": 0,
													"blockingTime": 0
												},
												{
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_48/http://staging.rapidload.io/wp-content/uploads/2024/08/Group-1448.png",
													"tbtImpact": 0,
													"transferSize": 2171,
													"mainThreadTime": 0,
													"blockingTime": 0
												},
												{
													"tbtImpact": 0,
													"blockingTime": 0,
													"mainThreadTime": 0,
													"transferSize": 1328,
													"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_1140,h_928/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7054-qubw7xv1lzej1v9ogm37mqgljzcmninzq6c6to5s1s.png"
												},
												{
													"blockingTime": 0,
													"transferSize": 1328,
													"url": "https://images.rapidload-cdn.io/spai/ret_blank,q_lossless,to_avif,w_1140,h_928/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7055-qubw7vzd8bbyencerl9yhqxod7lw84gj1x17v48ke8.png",
													"mainThreadTime": 0,
													"tbtImpact": 0
												},
												{
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_960/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7054-qubw7xv1lzej1v9ogm37mqgljzcmninzq6c6to5s1s.png",
													"tbtImpact": 0,
													"blockingTime": 0,
													"mainThreadTime": 0,
													"transferSize": 1328
												},
												{
													"transferSize": 1313,
													"url": "https://images.rapidload-cdn.io/spai/ret_img,q_lossless,to_avif,w_960/http://staging.rapidload.io/wp-content/uploads/elementor/thumbs/Group-7055-qubw7vzd8bbyencerl9yhqxod7lw84gj1x17v48ke8.png",
													"mainThreadTime": 0,
													"blockingTime": 0,
													"tbtImpact": 0
												}
											]
										},
										"mainThreadTime": 0
									},
									{
										"transferSize": 8036,
										"subItems": {
											"items": [
												{
													"tbtImpact": 0,
													"transferSize": 8036,
													"blockingTime": 0,
													"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
													"mainThreadTime": 1.471
												}
											],
											"type": "subitems"
										},
										"entity": "Bootstrap CDN",
										"blockingTime": 0,
										"tbtImpact": 0,
										"mainThreadTime": 1.471
									},
									{
										"entity": "Google Analytics",
										"transferSize": 800,
										"tbtImpact": 0,
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"mainThreadTime": 0,
													"tbtImpact": 0,
													"blockingTime": 0,
													"url": "https://analytics.google.com/g/collect?v=2&tid=G-4ZTDF2L9YB&gtm=45je4as0v877920433za200&_p=1730359143060&_gaz=1&gcd=13l3l3l3l1l1&npa=0&dma=0&tag_exp=101533421~101823848~101878899~101878944~101925629&cid=1161536373.1730359143&ul=en-us&sr=800x600&uaa=x86&uab=64&uafvl=Chromium%3B130.0.6723.58%7CHeadlessChrome%3B130.0.6723.58%7CNot%253FA_Brand%3B99.0.0.0&uamb=0&uam=&uap=macOS&uapv=10.15.7&uaw=0&are=1&pae=1&frm=0&pscdl=noapi&_s=1&sid=1730359143&sct=1&seg=0&dl=https%3A%2F%2Fstaging.rapidload.io%2F&dt=staging.rapidload.io%20%E2%80%93%20Automated%20WordPress%20Unused%20CSS%20Removal&en=page_view&_fv=1&_nsi=1&_ss=1&_ee=1&tfd=1456",
													"transferSize": 800
												}
											]
										},
										"mainThreadTime": 0,
										"blockingTime": 0
									},
									{
										"mainThreadTime": 3.381999999999999,
										"entity": "Google/Doubleclick Ads",
										"tbtImpact": 0,
										"transferSize": 747,
										"subItems": {
											"type": "subitems",
											"items": [
												{
													"transferSize": 747,
													"tbtImpact": 0,
													"mainThreadTime": 3.381999999999999,
													"blockingTime": 0,
													"url": "https://td.doubleclick.net/td/ga/rul?tid=G-4ZTDF2L9YB&gacid=1161536373.1730359143&gtm=45je4as0v877920433za200&dma=0&gcd=13l3l3l3l1l1&npa=0&pscdl=noapi&aip=1&fledge=1&frm=0&tag_exp=101533421~101823848~101878899~101878944~101925629&z=6970500"
												},
												{
													"blockingTime": 0,
													"url": "https://stats.g.doubleclick.net/g/collect?v=2&tid=G-4ZTDF2L9YB&cid=1161536373.1730359143&gtm=45je4as0v877920433za200&aip=1&dma=0&gcd=13l3l3l3l1l1&npa=0&frm=0&tag_exp=101533421~101823848~101878899~101878944~101925629",
													"transferSize": 0,
													"mainThreadTime": 0,
													"tbtImpact": 0
												}
											]
										},
										"blockingTime": 0
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "lcp-lazy-loaded",
					"name": "Largest Contentful Paint image was not lazily loaded",
					"scoreDisplayMode": "metricSavings",
					"description": "Above-the-fold images that are lazily loaded render later in the page lifecycle, which can delay the largest contentful paint. [Learn more about optimal lazy loading](https://web.dev/articles/lcp-lazy-loading).",
					"icon": "pass",
					"files": {
						"headings": [
							{
								"key": "node",
								"valueType": "node",
								"label": "Element"
							}
						],
						"type": "table",
						"items": [
							{
								"node": {
									"snippet": "<img decoding=\"sync\" width=\"800\" height=\"588\" src=\"https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-w…\" alt=\"\" loading=\"eager\" fetchpriority=\"high\">",
									"lhId": "1-3-IMG",
									"type": "node",
									"boundingRect": {
										"height": 588,
										"top": 315,
										"left": 188,
										"bottom": 903,
										"right": 988,
										"width": 800
									},
									"nodeLabel": "main.site-main > div.page-content > p > img",
									"path": "1,HTML,1,BODY,1,MAIN,1,DIV,2,P,0,IMG",
									"selector": "main.site-main > div.page-content > p > img"
								}
							}
						],
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"node": {
											"snippet": "<img decoding=\"sync\" width=\"800\" height=\"588\" src=\"https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-w…\" alt=\"\" loading=\"eager\" fetchpriority=\"high\">",
											"lhId": "1-3-IMG",
											"type": "node",
											"boundingRect": {
												"height": 588,
												"top": 315,
												"left": 188,
												"bottom": 903,
												"right": 988,
												"width": 800
											},
											"nodeLabel": "main.site-main > div.page-content > p > img",
											"path": "1,HTML,1,BODY,1,MAIN,1,DIV,2,P,0,IMG",
											"selector": "main.site-main > div.page-content > p > img"
										}
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
						{
							"name": "Exclude Above-the-fold Images from Lazy Load",
							"description": "Improve your LCP images.",
							"category": "image",
							"inputs": [
								{
									"control_type": "checkbox",
									"control_label": "Exclude LCP image from Lazy Load",
									"control_values": [
										"1",
										"0"
									],
									"value": null,
									"key": "uucss_exclude_above_the_fold_images"
								},
								{
									"control_type": "number",
									"control_label": "Exclude Above-the-fold Images from Lazy Load",
									"control_values": [
										"1",
										"2",
										"3",
										"4",
										"5"
									],
									"value": null,
									"key": "uucss_exclude_above_the_fold_image_count"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "uses-passive-event-listeners",
					"name": "Uses passive listeners to improve scrolling performance",
					"scoreDisplayMode": "metricSavings",
					"description": "Consider marking your touch and wheel event listeners as `passive` to improve your page's scroll performance. [Learn more about adopting passive event listeners](https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners/).",
					"icon": "pass",
					"files": {
						"items": [],
						"type": "table",
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": []
				},
				{
					"id": "no-document-write",
					"name": "Avoids `document.write()`",
					"scoreDisplayMode": "metricSavings",
					"description": "For users on slow connections, external scripts dynamically injected via `document.write()` can delay page load by tens of seconds. [Learn how to avoid document.write()](https://developer.chrome.com/docs/lighthouse/best-practices/no-document-write/).",
					"icon": "pass",
					"files": {
						"type": "table",
						"items": [],
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": []
				},
				{
					"id": "long-tasks",
					"name": "Avoid long main-thread tasks",
					"scoreDisplayMode": "informative",
					"description": "Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. [Learn how to avoid long main-thread tasks](https://web.dev/articles/optimize-long-tasks)",
					"displayValue": "2 long tasks found",
					"icon": "pass",
					"files": {
						"headings": [
							{
								"label": "URL",
								"valueType": "url",
								"key": "url"
							},
							{
								"granularity": 1,
								"key": "startTime",
								"valueType": "ms",
								"label": "Start Time"
							},
							{
								"label": "Duration",
								"key": "duration",
								"valueType": "ms",
								"granularity": 1
							},
							{
								"key": "file_type",
								"valueType": "string",
								"label": "Type",
								"subItemsHeading": {
									"key": "file_type"
								}
							}
						],
						"items": [
							{
								"duration": 182,
								"url": {
									"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"startTime": 1644.9897714654724,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							},
							{
								"startTime": 1946.9911202800743,
								"url": {
									"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
									"file_type": {
										"label": "Javascript",
										"value": "js"
									}
								},
								"duration": 70,
								"action": {
									"control_type": "dropdown",
									"value": "none"
								}
							}
						],
						"type": "table",
						"sortedBy": [
							"duration"
						],
						"debugData": {
							"tasks": [
								{
									"scriptEvaluation": 0,
									"urlIndex": 0,
									"startTime": 1645,
									"duration": 182,
									"other": 182
								},
								{
									"urlIndex": 1,
									"startTime": 1947,
									"duration": 70,
									"scriptEvaluation": 0,
									"other": 70
								}
							],
							"urls": [
								"https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
								"https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js"
							],
							"type": "debugdata"
						},
						"skipSumming": [
							"startTime"
						],
						"grouped_items": [
							{
								"type": "js",
								"items": [
									{
										"duration": 182,
										"url": {
											"url": "https://script.hotjar.com/modules.625495a901d247c3e8d4.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"startTime": 1644.9897714654724,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									},
									{
										"startTime": 1946.9911202800743,
										"url": {
											"url": "https://script.hotjar.com/survey-v2.551efcd95dba8006e4a8.js",
											"file_type": {
												"label": "Javascript",
												"value": "js"
											}
										},
										"duration": 70,
										"action": {
											"control_type": "dropdown",
											"value": "none"
										}
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "unsized-images",
					"name": "Image elements have explicit `width` and `height`",
					"scoreDisplayMode": "metricSavings",
					"description": "Set an explicit width and height on image elements to reduce layout shifts and improve CLS. [Learn how to set image dimensions](https://web.dev/articles/optimize-cls#images_without_dimensions)",
					"icon": "pass",
					"files": {
						"items": [],
						"type": "table",
						"headings": []
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [
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
									"value": null,
									"key": "uucss_set_width_and_height"
								},
								{
									"control_type": "textarea",
									"control_label": "Exclude Images from being set width and height",
									"control_values": null,
									"value": "",
									"key": "uucss_exclude_images_from_set_width_and_height"
								}
							]
						}
					],
					"metrics": [
						{
							"id": "cumulative-layout-shift",
							"title": "Cumulative Layout Shift",
							"scoreDisplayMode": "numeric",
							"description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/articles/cls).",
							"displayValue": "0",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "cumulative-layout-shift",
								"weight": 25,
								"group": "metrics",
								"acronym": "CLS",
								"relevantAudits": [
									"layout-shift-elements",
									"non-composited-animations",
									"unsized-images"
								]
							},
							"potentialGain": 0
						}
					]
				},
				{
					"id": "viewport",
					"name": "Has a `<meta name=\"viewport\">` tag with `width` or `initial-scale`",
					"scoreDisplayMode": "metricSavings",
					"description": "A `<meta name=\"viewport\">` not only optimizes your app for mobile screen sizes, but also prevents [a 300 millisecond delay to user input](https://developer.chrome.com/blog/300ms-tap-delay-gone-away/). [Learn more about using the viewport meta tag](https://developer.chrome.com/docs/lighthouse/pwa/viewport/).",
					"icon": "pass",
					"files": {
						"type": "debugdata",
						"viewportContent": "width=device-width, initial-scale=1"
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "total-blocking-time",
							"title": "Total Blocking Time",
							"scoreDisplayMode": "numeric",
							"description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
							"displayValue": "80 ms",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "total-blocking-time",
								"weight": 30,
								"group": "metrics",
								"acronym": "TBT",
								"relevantAudits": [
									"long-tasks",
									"third-party-summary",
									"third-party-facades",
									"bootup-time",
									"mainthread-work-breakdown",
									"dom-size",
									"duplicated-javascript",
									"legacy-javascript",
									"viewport"
								]
							},
							"potentialGain": 0.3000000000000007
						}
					]
				},
				{
					"id": "critical-request-chains",
					"name": "Avoid chaining critical requests",
					"scoreDisplayMode": "informative",
					"description": "The Critical Request Chains below show you what resources are loaded with a high priority. Consider reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load. [Learn how to avoid chaining critical requests](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/).",
					"displayValue": "9 chains found",
					"icon": "pass",
					"files": {
						"type": "criticalrequestchain",
						"chains": {
							"FB0893A947809265677791EBDE51D38E": {
								"request": {
									"transferSize": 19855,
									"endTime": 1672319.241625,
									"startTime": 1672318.622517,
									"responseReceivedTime": 1672319.241619,
									"url": "https://staging.rapidload.io/"
								},
								"children": {
									"53.20": {
										"request": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/wc-blocks-d7a8127861fe.min.css",
											"transferSize": 3227,
											"responseReceivedTime": 1672319.5238299998,
											"endTime": 1672319.523837,
											"startTime": 1672319.253166
										}
									},
									"53.9": {
										"request": {
											"startTime": 1672319.250523,
											"transferSize": 2207,
											"responseReceivedTime": 1672319.557671,
											"endTime": 1672319.55768,
											"url": "https://staging.rapidload.io/wp-content/themes/hello-elementor/theme.min.css?ver=2.3.1"
										}
									},
									"53.4": {
										"request": {
											"startTime": 1672319.249938,
											"transferSize": 22262,
											"responseReceivedTime": 1672319.665726,
											"endTime": 1672319.665732,
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-35d9c1d2f089.min.css"
										}
									},
									"53.5": {
										"request": {
											"responseReceivedTime": 1672319.5187980002,
											"startTime": 1672319.250064,
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/style-f0072e70b27a.min.css",
											"transferSize": 2996,
											"endTime": 1672319.518806
										}
									},
									"53.3": {
										"request": {
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/woocommerce-layout-279a41fe094a.min.css",
											"responseReceivedTime": 1672319.5115259998,
											"startTime": 1672319.249835,
											"transferSize": 3240,
											"endTime": 1672319.511534
										}
									},
									"53.8": {
										"request": {
											"transferSize": 8036,
											"url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=6.6.2",
											"endTime": 1672319.273959,
											"startTime": 1672319.250406,
											"responseReceivedTime": 1672319.273949
										}
									},
									"53.2": {
										"request": {
											"responseReceivedTime": 1672319.572693,
											"endTime": 1672319.572699,
											"startTime": 1672319.249735,
											"transferSize": 14500,
											"url": "https://staging.rapidload.io/wp-includes/css/dist/block-library/style.min.css?ver=6.6.2"
										}
									},
									"53.7": {
										"request": {
											"transferSize": 3946,
											"startTime": 1672319.2502449998,
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/style-91b5cbf22a1d.min.css",
											"responseReceivedTime": 1672319.361642,
											"endTime": 1672319.361648
										}
									},
									"53.6": {
										"request": {
											"transferSize": 2717,
											"responseReceivedTime": 1672319.5304359999,
											"startTime": 1672319.250143,
											"url": "https://staging.rapidload.io/wp-content/cache/rapidload/min-css/style-31915bc53958.min.css",
											"endTime": 1672319.530443
										}
									}
								}
							}
						},
						"longestChain": {
							"length": 2,
							"transferSize": 22262,
							"duration": 1043.215000152588
						}
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "first-contentful-paint",
							"title": "First Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
							"displayValue": "0.4 s",
							"icon": "pass",
							"score": 100,
							"refs": {
								"id": "first-contentful-paint",
								"weight": 10,
								"group": "metrics",
								"acronym": "FCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules"
								]
							},
							"potentialGain": 0
						},
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "resource-summary",
					"name": "Resources Summary",
					"scoreDisplayMode": "informative",
					"description": "Aggregates all network requests and groups them by type",
					"icon": "pass",
					"files": {
						"headings": [
							{
								"key": "label",
								"label": "Resource Type",
								"valueType": "text"
							},
							{
								"label": "Requests",
								"key": "requestCount",
								"valueType": "numeric"
							},
							{
								"valueType": "bytes",
								"key": "transferSize",
								"label": "Transfer Size"
							}
						],
						"items": [
							{
								"requestCount": 54,
								"label": "Total",
								"transferSize": 608382,
								"resourceType": "total"
							},
							{
								"label": "Script",
								"resourceType": "script",
								"requestCount": 15,
								"transferSize": 309680
							},
							{
								"label": "Image",
								"requestCount": 14,
								"transferSize": 202053,
								"resourceType": "image"
							},
							{
								"label": "Stylesheet",
								"transferSize": 65097,
								"resourceType": "stylesheet",
								"requestCount": 10
							},
							{
								"transferSize": 20602,
								"label": "Document",
								"resourceType": "document",
								"requestCount": 2
							},
							{
								"resourceType": "other",
								"transferSize": 10950,
								"label": "Other",
								"requestCount": 13
							},
							{
								"requestCount": 0,
								"resourceType": "media",
								"transferSize": 0,
								"label": "Media"
							},
							{
								"label": "Font",
								"transferSize": 0,
								"requestCount": 0,
								"resourceType": "font"
							},
							{
								"label": "Third-party",
								"transferSize": 286976,
								"resourceType": "third-party",
								"requestCount": 22
							}
						],
						"type": "table",
						"grouped_items": [
							{
								"type": "unknown",
								"items": [
									{
										"requestCount": 54,
										"label": "Total",
										"transferSize": 608382,
										"resourceType": "total"
									},
									{
										"label": "Script",
										"resourceType": "script",
										"requestCount": 15,
										"transferSize": 309680
									},
									{
										"label": "Image",
										"requestCount": 14,
										"transferSize": 202053,
										"resourceType": "image"
									},
									{
										"label": "Stylesheet",
										"transferSize": 65097,
										"resourceType": "stylesheet",
										"requestCount": 10
									},
									{
										"transferSize": 20602,
										"label": "Document",
										"resourceType": "document",
										"requestCount": 2
									},
									{
										"resourceType": "other",
										"transferSize": 10950,
										"label": "Other",
										"requestCount": 13
									},
									{
										"requestCount": 0,
										"resourceType": "media",
										"transferSize": 0,
										"label": "Media"
									},
									{
										"label": "Font",
										"transferSize": 0,
										"requestCount": 0,
										"resourceType": "font"
									},
									{
										"label": "Third-party",
										"transferSize": 286976,
										"resourceType": "third-party",
										"requestCount": 22
									}
								]
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": []
				},
				{
					"id": "largest-contentful-paint-element",
					"name": "Largest Contentful Paint element",
					"scoreDisplayMode": "informative",
					"description": "This is the largest contentful element painted within the viewport. [Learn more about the Largest Contentful Paint element](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
					"displayValue": "720 ms",
					"icon": "pass",
					"files": {
						"type": "list",
						"items": [
							{
								"type": "table",
								"items": [
									{
										"node": {
											"snippet": "<img decoding=\"sync\" width=\"800\" height=\"588\" src=\"https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-w…\" alt=\"\" loading=\"eager\" fetchpriority=\"high\">",
											"boundingRect": {
												"top": 315,
												"bottom": 903,
												"right": 988,
												"height": 588,
												"left": 188,
												"width": 800
											},
											"type": "node",
											"selector": "main.site-main > div.page-content > p > img",
											"nodeLabel": "main.site-main > div.page-content > p > img",
											"path": "1,HTML,1,BODY,1,MAIN,1,DIV,2,P,0,IMG",
											"lhId": "page-0-IMG"
										}
									}
								],
								"headings": [
									{
										"valueType": "node",
										"label": "Element",
										"key": "node"
									}
								]
							},
							{
								"headings": [
									{
										"label": "Phase",
										"key": "phase",
										"valueType": "text"
									},
									{
										"key": "percent",
										"label": "% of LCP",
										"valueType": "text"
									},
									{
										"valueType": "ms",
										"label": "Timing",
										"key": "timing"
									}
								],
								"items": [
									{
										"percent": "22%",
										"phase": "TTFB",
										"timing": 161
									},
									{
										"timing": 206.52639391126644,
										"phase": "Load Delay",
										"percent": "29%"
									},
									{
										"percent": "45%",
										"timing": 321.0642790364241,
										"phase": "Load Time"
									},
									{
										"percent": "5%",
										"phase": "Render Delay",
										"timing": 32.460893513673
									}
								],
								"type": "table"
							}
						]
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				},
				{
					"id": "prioritize-lcp-image",
					"name": "Preload Largest Contentful Paint image",
					"scoreDisplayMode": "metricSavings",
					"description": "If the LCP element is dynamically added to the page, you should preload the image in order to improve LCP. [Learn more about preloading LCP elements](https://web.dev/articles/optimize-lcp#optimize_when_the_resource_is_discovered).",
					"icon": "pass",
					"files": {
						"items": [],
						"overallSavingsMs": 0,
						"debugData": {
							"pathLength": 2,
							"initiatorPath": [
								{
									"url": "https://staging.rapidload.io/wp-content/uploads/2024/08/To-speed-up-your-website.svg",
									"initiatorType": "parser"
								},
								{
									"url": "https://staging.rapidload.io/",
									"initiatorType": "other"
								}
							],
							"type": "debugdata"
						},
						"sortedBy": [
							"wastedMs"
						],
						"headings": [],
						"type": "opportunity"
					},
					"type": "passed_audit",
					"score": 100,
					"settings": [],
					"metrics": [
						{
							"id": "largest-contentful-paint",
							"title": "Largest Contentful Paint",
							"scoreDisplayMode": "numeric",
							"description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
							"displayValue": "0.7 s",
							"icon": "pass",
							"score": 99,
							"refs": {
								"id": "largest-contentful-paint",
								"weight": 25,
								"group": "metrics",
								"acronym": "LCP",
								"relevantAudits": [
									"server-response-time",
									"render-blocking-resources",
									"redirects",
									"critical-request-chains",
									"uses-text-compression",
									"uses-rel-preconnect",
									"uses-rel-preload",
									"font-display",
									"unminified-javascript",
									"unminified-css",
									"unused-css-rules",
									"largest-contentful-paint-element",
									"prioritize-lcp-image",
									"unused-javascript",
									"efficient-animated-content",
									"total-byte-weight",
									"lcp-lazy-loaded"
								]
							},
							"potentialGain": 0.25
						}
					]
				}
			],
			"loadingExperience": {
				"initial_url": "https://staging.rapidload.io/",
				"timestamp": 1730359153496
			},
			"settings": [],
			"id": 138787672,
			"job_id": "33"
		},
		"revisions": [
			{
				"id": "722",
				"created_at": "2024-10-31 07:10:55",
				"data": {
					"performance": 99
				},
				"timestamp": 1730358655
			},
			{
				"id": "721",
				"created_at": "2024-10-31 07:10:17",
				"data": {
					"performance": 99
				},
				"timestamp": 1730358617
			}
		],
		"options": {
			"uucss_lazy_load_images": "",
			"uucss_exclude_images_from_lazy_load": "",
			"individual-file-actions-headings": {
				"offscreen-images": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Resource Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"label\":\"Potential Savings\",\"valueType\":\"bytes\",\"key\":\"wastedBytes\"}]",
				"unused-css-rules": "[{\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"unused-javascript": "[{\"subItemsHeading\":{\"key\":\"source\",\"valueType\":\"code\"},\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"subItemsHeading\":{\"key\":\"sourceBytes\"},\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"label\":\"Potential Savings\",\"key\":\"wastedBytes\",\"subItemsHeading\":{\"key\":\"sourceWastedBytes\"}},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"server-response-time": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"valueType\":\"timespanMs\",\"label\":\"Time Spent\",\"key\":\"responseTime\"}]",
				"bootup-time": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"granularity\":1,\"key\":\"total\",\"valueType\":\"ms\",\"label\":\"Total CPU Time\"},{\"label\":\"Script Evaluation\",\"key\":\"scripting\",\"valueType\":\"ms\",\"granularity\":1},{\"granularity\":1,\"valueType\":\"ms\",\"key\":\"scriptParseCompile\",\"label\":\"Script Parse\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"mainthread-work-breakdown": "[{\"key\":\"groupLabel\",\"label\":\"Category\",\"valueType\":\"text\"},{\"valueType\":\"ms\",\"label\":\"Time Spent\",\"granularity\":1,\"key\":\"duration\"}]",
				"third-party-summary": "[{\"subItemsHeading\":{\"key\":\"url\",\"valueType\":\"url\"},\"label\":\"Third-Party\",\"key\":\"entity\",\"valueType\":\"text\"},{\"valueType\":\"bytes\",\"subItemsHeading\":{\"key\":\"transferSize\"},\"label\":\"Transfer Size\",\"granularity\":1,\"key\":\"transferSize\"},{\"valueType\":\"ms\",\"subItemsHeading\":{\"key\":\"blockingTime\"},\"label\":\"Main-Thread Blocking Time\",\"granularity\":1,\"key\":\"blockingTime\"}]",
				"render-blocking-resources": "[{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"valueType\":\"bytes\",\"label\":\"Transfer Size\",\"key\":\"totalBytes\"},{\"key\":\"wastedMs\",\"label\":\"Potential Savings\",\"valueType\":\"timespanMs\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"unminified-javascript": "[{\"key\":\"url\",\"label\":\"URL\",\"valueType\":\"url\"},{\"valueType\":\"bytes\",\"label\":\"Transfer Size\",\"key\":\"totalBytes\"},{\"key\":\"wastedBytes\",\"label\":\"Potential Savings\",\"valueType\":\"bytes\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"modern-image-formats": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"label\":\"Resource Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"}]",
				"legacy-javascript": "[{\"subItemsHeading\":{\"valueType\":\"source-location\",\"key\":\"location\"},\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"key\":null,\"subItemsHeading\":{\"key\":\"signal\"},\"valueType\":\"code\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"uses-long-cache-ttl": "[{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"displayUnit\":\"duration\",\"label\":\"Cache TTL\",\"key\":\"cacheLifetimeMs\",\"valueType\":\"ms\"},{\"label\":\"Transfer Size\",\"granularity\":1,\"displayUnit\":\"kb\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"}]",
				"dom-size": "[{\"valueType\":\"text\",\"key\":\"statistic\",\"label\":\"Statistic\"},{\"label\":\"Element\",\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"value\",\"label\":\"Value\",\"valueType\":\"numeric\"}]",
				"unsized-images": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"prioritize-lcp-image": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"key\":\"wastedMs\",\"label\":\"Potential Savings\",\"valueType\":\"timespanMs\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"total-byte-weight": "[{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"key\":\"totalBytes\",\"valueType\":\"bytes\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"lcp-lazy-loaded": "[{\"label\":\"Element\",\"key\":\"node\",\"valueType\":\"node\"}]",
				"long-tasks": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"key\":\"startTime\",\"granularity\":1,\"valueType\":\"ms\",\"label\":\"Start Time\"},{\"granularity\":1,\"key\":\"duration\",\"valueType\":\"ms\",\"label\":\"Duration\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"non-composited-animations": "[{\"subItemsHeading\":{\"key\":\"failureReason\",\"valueType\":\"text\"},\"key\":\"node\",\"label\":\"Element\",\"valueType\":\"node\"},{\"key\":null,\"valueType\":\"text\",\"subItemsHeading\":{\"valueType\":\"text\",\"key\":\"animation\"},\"label\":\"Name\"}]",
				"resource-summary": "[{\"key\":\"label\",\"valueType\":\"text\",\"label\":\"Resource Type\"},{\"valueType\":\"numeric\",\"label\":\"Requests\",\"key\":\"requestCount\"},{\"valueType\":\"bytes\",\"key\":\"transferSize\",\"label\":\"Transfer Size\"}]",
				"font-display": "[{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Potential Savings\",\"key\":\"wastedMs\",\"valueType\":\"ms\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]"
			},
			"individual-file-actions": {
				"offscreen-images": [],
				"unused-css-rules": [],
				"unused-javascript": [],
				"server-response-time": [],
				"bootup-time": [],
				"render-blocking-resources": [],
				"unminified-javascript": [],
				"modern-image-formats": [],
				"legacy-javascript": [],
				"uses-long-cache-ttl": [],
				"unsized-images": [],
				"prioritize-lcp-image": [],
				"total-byte-weight": [],
				"long-tasks": [],
				"font-display": []
			},
			"uucss_enable_uucss": "",
			"uucss_excluded_files": "",
			"uucss_dynamic_js_exclusion_list": "",
			"delay_javascript_callback": "",
			"uucss_excluded_js_files": "",
			"uucss_lazy_load_iframes": "",
			"uucss_enable_cpcss": "",
			"uucss_enable_cpcss_mobile": "",
			"uucss_additional_css": "",
			"remove_cpcss_on_user_interaction": "",
			"minify_js": "",
			"uucss_exclude_files_from_minify_js": "",
			"uucss_generate_blurry_place_holder": "",
			"uucss_exclude_images_from_modern_images": "",
			"uucss_exclude_images_from_set_width_and_height": "",
			"uucss_minify_excluded_files": "",
			"uucss_exclude_above_the_fold_images": "",
			"uucss_exclude_above_the_fold_image_count": 3,
			"uucss_enable_image_delivery": "1",
			"uucss_enable_font_optimization": "1"
		},
		"merged_options": {
			"uucss_enable_css": "1",
			"uucss_enable_uucss": "",
			"uucss_minify": "1",
			"uucss_support_next_gen_formats": "1",
			"uucss_set_width_and_height": "1",
			"uucss_self_host_google_fonts": "1",
			"uucss_image_optimize_level": "lossless",
			"uucss_exclude_above_the_fold_image_count": 3,
			"uucss_enable_page_optimizer": "1",
			"uucss_enable_cache": "1",
			"uucss_enable_font_optimization": "1",
			"uucss_enable_javascript": "1",
			"uucss_enable_image_delivery": "1",
			"whitelist_packs": [],
			"uucss_load_js_method": "defer",
			"defer_inline_js": null,
			"minify_js": "",
			"preload_internal_links": null,
			"delay_javascript": "1",
			"uucss_excluded_js_files_from_defer": "",
			"rapidload_aggregate_css": null,
			"uucss_inline_css": null,
			"uucss_enable_cpcss": "",
			"uucss_enable_cpcss_mobile": "",
			"remove_cpcss_on_user_interaction": "",
			"uucss_enable_rules": null,
			"uucss_api_key_verified": 1,
			"uucss_api_key": "84e4ef7443dc4e35ad0a67f0b1da4e3e",
			"valid_domain": true,
			"rapidload_test_mode": "0",
			"uucss_enable_cdn": "",
			"uucss_cdn_zone_id": 1255100,
			"uucss_cdn_dns_id": "2ab6c37f65cbd05cd143fc27d03fead3",
			"uucss_cdn_url": "https://rapidload-local.rapidload-cdn.io/",
			"rapidload_enable_cpcss_file_chunk": "",
			"rapidload_cpcss_file_character_length": 0,
			"enable_uucss_on_cpcss": "",
			"uucss_lazy_load_images": "",
			"uucss_exclude_images_from_lazy_load": "",
			"individual-file-actions-headings": {
				"offscreen-images": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Resource Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"label\":\"Potential Savings\",\"valueType\":\"bytes\",\"key\":\"wastedBytes\"}]",
				"unused-css-rules": "[{\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"unused-javascript": "[{\"subItemsHeading\":{\"key\":\"source\",\"valueType\":\"code\"},\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"subItemsHeading\":{\"key\":\"sourceBytes\"},\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"label\":\"Potential Savings\",\"key\":\"wastedBytes\",\"subItemsHeading\":{\"key\":\"sourceWastedBytes\"}},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"server-response-time": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"valueType\":\"timespanMs\",\"label\":\"Time Spent\",\"key\":\"responseTime\"}]",
				"bootup-time": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"granularity\":1,\"key\":\"total\",\"valueType\":\"ms\",\"label\":\"Total CPU Time\"},{\"label\":\"Script Evaluation\",\"key\":\"scripting\",\"valueType\":\"ms\",\"granularity\":1},{\"granularity\":1,\"valueType\":\"ms\",\"key\":\"scriptParseCompile\",\"label\":\"Script Parse\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"mainthread-work-breakdown": "[{\"key\":\"groupLabel\",\"label\":\"Category\",\"valueType\":\"text\"},{\"valueType\":\"ms\",\"label\":\"Time Spent\",\"granularity\":1,\"key\":\"duration\"}]",
				"third-party-summary": "[{\"subItemsHeading\":{\"key\":\"url\",\"valueType\":\"url\"},\"label\":\"Third-Party\",\"key\":\"entity\",\"valueType\":\"text\"},{\"valueType\":\"bytes\",\"subItemsHeading\":{\"key\":\"transferSize\"},\"label\":\"Transfer Size\",\"granularity\":1,\"key\":\"transferSize\"},{\"valueType\":\"ms\",\"subItemsHeading\":{\"key\":\"blockingTime\"},\"label\":\"Main-Thread Blocking Time\",\"granularity\":1,\"key\":\"blockingTime\"}]",
				"render-blocking-resources": "[{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"valueType\":\"bytes\",\"label\":\"Transfer Size\",\"key\":\"totalBytes\"},{\"key\":\"wastedMs\",\"label\":\"Potential Savings\",\"valueType\":\"timespanMs\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"unminified-javascript": "[{\"key\":\"url\",\"label\":\"URL\",\"valueType\":\"url\"},{\"valueType\":\"bytes\",\"label\":\"Transfer Size\",\"key\":\"totalBytes\"},{\"key\":\"wastedBytes\",\"label\":\"Potential Savings\",\"valueType\":\"bytes\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"modern-image-formats": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"label\":\"Resource Size\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"}]",
				"legacy-javascript": "[{\"subItemsHeading\":{\"valueType\":\"source-location\",\"key\":\"location\"},\"valueType\":\"url\",\"key\":\"url\",\"label\":\"URL\"},{\"key\":null,\"subItemsHeading\":{\"key\":\"signal\"},\"valueType\":\"code\"},{\"valueType\":\"bytes\",\"key\":\"wastedBytes\",\"label\":\"Potential Savings\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"uses-long-cache-ttl": "[{\"label\":\"URL\",\"key\":\"url\",\"valueType\":\"url\"},{\"displayUnit\":\"duration\",\"label\":\"Cache TTL\",\"key\":\"cacheLifetimeMs\",\"valueType\":\"ms\"},{\"label\":\"Transfer Size\",\"granularity\":1,\"displayUnit\":\"kb\",\"valueType\":\"bytes\",\"key\":\"totalBytes\"}]",
				"dom-size": "[{\"valueType\":\"text\",\"key\":\"statistic\",\"label\":\"Statistic\"},{\"label\":\"Element\",\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"value\",\"label\":\"Value\",\"valueType\":\"numeric\"}]",
				"unsized-images": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"prioritize-lcp-image": "[{\"key\":\"node\",\"valueType\":\"node\"},{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"key\":\"wastedMs\",\"label\":\"Potential Savings\",\"valueType\":\"timespanMs\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"total-byte-weight": "[{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Transfer Size\",\"key\":\"totalBytes\",\"valueType\":\"bytes\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"lcp-lazy-loaded": "[{\"label\":\"Element\",\"key\":\"node\",\"valueType\":\"node\"}]",
				"long-tasks": "[{\"valueType\":\"url\",\"label\":\"URL\",\"key\":\"url\"},{\"key\":\"startTime\",\"granularity\":1,\"valueType\":\"ms\",\"label\":\"Start Time\"},{\"granularity\":1,\"key\":\"duration\",\"valueType\":\"ms\",\"label\":\"Duration\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]",
				"non-composited-animations": "[{\"subItemsHeading\":{\"key\":\"failureReason\",\"valueType\":\"text\"},\"key\":\"node\",\"label\":\"Element\",\"valueType\":\"node\"},{\"key\":null,\"valueType\":\"text\",\"subItemsHeading\":{\"valueType\":\"text\",\"key\":\"animation\"},\"label\":\"Name\"}]",
				"resource-summary": "[{\"key\":\"label\",\"valueType\":\"text\",\"label\":\"Resource Type\"},{\"valueType\":\"numeric\",\"label\":\"Requests\",\"key\":\"requestCount\"},{\"valueType\":\"bytes\",\"key\":\"transferSize\",\"label\":\"Transfer Size\"}]",
				"font-display": "[{\"key\":\"url\",\"valueType\":\"url\",\"label\":\"URL\"},{\"label\":\"Potential Savings\",\"key\":\"wastedMs\",\"valueType\":\"ms\"},{\"key\":\"action\",\"valueType\":\"controls\",\"label\":\"Action\",\"subItemsHeading\":{\"key\":\"action\"}},{\"key\":\"file_type\",\"valueType\":\"string\",\"label\":\"Type\",\"subItemsHeading\":{\"key\":\"file_type\"}}]"
			},
			"individual-file-actions": {
				"offscreen-images": [],
				"unused-css-rules": [],
				"unused-javascript": [],
				"server-response-time": [],
				"bootup-time": [],
				"render-blocking-resources": [],
				"unminified-javascript": [],
				"modern-image-formats": [],
				"legacy-javascript": [],
				"uses-long-cache-ttl": [],
				"unsized-images": [],
				"prioritize-lcp-image": [],
				"total-byte-weight": [],
				"long-tasks": [],
				"font-display": []
			},
			"uucss_excluded_files": "",
			"uucss_dynamic_js_exclusion_list": "",
			"delay_javascript_callback": "",
			"uucss_excluded_js_files": "",
			"uucss_lazy_load_iframes": "",
			"uucss_additional_css": "",
			"uucss_exclude_files_from_minify_js": "",
			"uucss_generate_blurry_place_holder": "",
			"uucss_exclude_images_from_modern_images": "",
			"uucss_exclude_images_from_set_width_and_height": "",
			"uucss_minify_excluded_files": "",
			"uucss_exclude_above_the_fold_images": ""
		},
		"global_options": {
			"uucss_enable_css": "1",
			"uucss_enable_uucss": null,
			"uucss_minify": "1",
			"uucss_support_next_gen_formats": "1",
			"uucss_set_width_and_height": "1",
			"uucss_self_host_google_fonts": "1",
			"uucss_image_optimize_level": "lossless",
			"uucss_exclude_above_the_fold_image_count": 3,
			"uucss_enable_page_optimizer": "1",
			"uucss_enable_cache": "1",
			"uucss_enable_font_optimization": "",
			"uucss_enable_javascript": "1",
			"uucss_enable_image_delivery": "",
			"whitelist_packs": [],
			"uucss_load_js_method": "defer",
			"defer_inline_js": null,
			"minify_js": null,
			"preload_internal_links": null,
			"delay_javascript": "1",
			"uucss_excluded_js_files_from_defer": "",
			"rapidload_aggregate_css": null,
			"uucss_inline_css": null,
			"uucss_enable_cpcss": null,
			"uucss_enable_cpcss_mobile": null,
			"remove_cpcss_on_user_interaction": null,
			"uucss_enable_rules": null,
			"uucss_api_key_verified": 1,
			"uucss_api_key": "84e4ef7443dc4e35ad0a67f0b1da4e3e",
			"valid_domain": true,
			"rapidload_test_mode": "0",
			"uucss_enable_cdn": "",
			"uucss_cdn_zone_id": 1255100,
			"uucss_cdn_dns_id": "2ab6c37f65cbd05cd143fc27d03fead3",
			"uucss_cdn_url": "https://rapidload-local.rapidload-cdn.io/",
			"rapidload_enable_cpcss_file_chunk": "",
			"rapidload_cpcss_file_character_length": 0,
			"enable_uucss_on_cpcss": ""
		}
	},
	"state": {
		"fresh": false
	}
}
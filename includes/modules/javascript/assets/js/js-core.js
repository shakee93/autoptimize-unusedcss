(function ($) {

    $(document).ready(function () {

        var rapidload_optimized_data = {
            js_files: []
        }

        function get_js_file_id(url) {
            var id = null;

            rapidload_optimized_data.js_files.map(function (js) {
                if (js.url === url) {
                    id = js.id
                }
            })

            return id;
        }

        function set_js_url_action(url, action) {
            rapidload_optimized_data.js_files = rapidload_optimized_data.js_files.map(function (js) {
                if (js.url === url) {
                    js.action = action
                }
                return js;
            })
        }

        function render_page(sampleData) {

            var opportunities = [];
            var js_related = {}

            Object.keys(sampleData.page_matrix.lighthouseResult.audits).map(function (key) {
                if (sampleData.page_matrix.lighthouseResult.audits[key].details && sampleData.page_matrix.lighthouseResult.audits[key].details.type === "opportunity") {
                    opportunities.push(sampleData.page_matrix.lighthouseResult.audits[key])
                }
            })

            opportunities.map(function (opp) {
                if (opp.details && opp.details.items.length) {
                    opp.details.items.map(function (item) {
                        if (item.url && item.url.includes('.js')) {
                            js_related[opp.id] = opp
                            console.log(item.url)
                            if (!rapidload_optimized_data.js_files.includes(item.url)) {
                                rapidload_optimized_data.js_files.push(item.url)
                            }

                        }
                    })
                }
            })

            rapidload_optimized_data.js_files = rapidload_optimized_data.js_files.map(function (file, index) {
                return {
                    id: index,
                    url: file,
                    action: null
                }
            })

            var $opportunity_html = $('<div class="opportunity-html"></div>')
            $opportunity_html.append('<ul></ul>')

            Object.keys(js_related).map(function (key) {

                $opportunity_html.find('ul').append('<li class="' + js_related[key].id + '">' + js_related[key].id + '<table class="' + js_related[key].id + ' wp-list-table widefat fixed striped table-view-list posts"><tr class="heading"></tr></table></li>')

                var columns = js_related[key].details.headings.map(function (heading) {
                    if (heading.label) {
                        $opportunity_html.find('table.' + js_related[key].id).find('tr.heading').append('<th>' + (heading.label ? heading.label : '') + '</th>')
                    }
                    return heading;
                })
                $opportunity_html.find('table.' + js_related[key].id).find('tr.heading').append('<th>Action</th>')

                var rows = js_related[key].details.items.map(function (item) {
                    return item;
                })

                rows.map(function (row, index) {
                    $opportunity_html.find('table.' + js_related[key].id).append('<tr class="' + js_related[key].id + '-' + index + '"></tr>')

                    columns.map(function (col) {

                        if (row[col.key]) {
                            $opportunity_html.find('tr.' + js_related[key].id + '-' + index).append('<td class="column-primary ' + col.key + ' " >' + row[col.key] + '</td>')
                        }

                    })

                    $opportunity_html.find('tr.' + js_related[key].id + '-' + index).append('<td class="column-primary"><select class="js-action" data-url="' + row.url + '"><option value="none">None</option><option value="defer">Defer</option><option value="async">Async</option><option value="on_user_interaction">On User Interaction</option></select></td>')

                })

            })

            console.log(rapidload_optimized_data.files)
            $('#rapidload-optimizer-dialog').append($opportunity_html)

            $('select.js-action').change(function () {

                var $this = $(this)

                var url = $this.data('url')

                set_js_url_action(url, $this.val())

                $('select[data-url="' + url + '"] option[value="' + $this.val() + '"]').attr('selected', 'selected')
            });

        }

        var sampleData = {
            "url": "https://rapidload.io",
            "totalCSS": 13,
            "injectedCSS": 0,
            "totalInlineCSS": 18,
            "injectedInlineCSS": 0,
            "totalInjectedCSS": 0,
            "totalJS": 34,
            "injected": false,
            "nonInjectedFiles": 0,
            "cachedFiles": {},
            "cssFilesInDom": [
                "https://fonts.googleapis.com/css?family=Nunito+Sans%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CNunito%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CLexend%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&display=swap",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_541e2ced151704f4ff1844c6de47ec02.css",
                "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=5.9.3",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_99982b3f40a1aefdb4305b95a2e9c4ae.css?ver=1667209724",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_4fca2c0532ae42ef172a4291beb5ad09.css?ver=1667209725",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_495ea6537bdc403c483dd2f0187127c5.css?ver=1667209725",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_e7615362d5cac2766a581d03b950ccab.css?ver=1667209726",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_27fb58316ef7f82601b4ff3a7f7409d9.css?ver=1667209726",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_ca69de2d85580f908a4b28c0597a9752.css?ver=1667209726",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_cbc7eeb1590a5f8fbc0187d22f93a5ae.css?ver=1667209726",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_a5bb7c09b78178004885de219f0ccb36.css?ver=1667209726",
                "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_659f358281c454e23b8550ee83fd6008.css?ver=1667209726"
            ],
            "success": false,
            "html_tag": {
                "lang": "en-US",
                "prefix": "og: https://ogp.me/ns#"
            },
            "body_tag": {
                "data-rsssl": "1",
                "class": "home page-template-default page page-id-10534 wp-custom-logo theme-hello-elementor woocommerce-no-js elementor-default elementor-kit-11 elementor-page elementor-page-10534"
            },
            "page_matrix": {
                "captchaResult": "CAPTCHA_NOT_NEEDED",
                "kind": "pagespeedonline#result",
                "id": "https://rapidload.io/",
                "loadingExperience": {
                    "id": "https://rapidload.io/",
                    "metrics": {
                        "CUMULATIVE_LAYOUT_SHIFT_SCORE": {
                            "percentile": 4,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 10,
                                    "proportion": 1
                                },
                                {
                                    "min": 10,
                                    "max": 25,
                                    "proportion": 0
                                },
                                {
                                    "min": 25,
                                    "proportion": 0
                                }
                            ],
                            "category": "FAST"
                        },
                        "EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT": {
                            "percentile": 135,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 200,
                                    "proportion": 0.9008099190080993
                                },
                                {
                                    "min": 200,
                                    "max": 500,
                                    "proportion": 0.0807919208079192
                                },
                                {
                                    "min": 500,
                                    "proportion": 0.0183981601839816
                                }
                            ],
                            "category": "FAST"
                        },
                        "EXPERIMENTAL_TIME_TO_FIRST_BYTE": {
                            "percentile": 1533,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 800,
                                    "proportion": 0.5792
                                },
                                {
                                    "min": 800,
                                    "max": 1800,
                                    "proportion": 0.21350000000000005
                                },
                                {
                                    "min": 1800,
                                    "proportion": 0.20729999999999996
                                }
                            ],
                            "category": "AVERAGE"
                        },
                        "FIRST_CONTENTFUL_PAINT_MS": {
                            "percentile": 2249,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 1800,
                                    "proportion": 0.6442644264426441
                                },
                                {
                                    "min": 1800,
                                    "max": 3000,
                                    "proportion": 0.20802080208020804
                                },
                                {
                                    "min": 3000,
                                    "proportion": 0.14771477147714784
                                }
                            ],
                            "category": "AVERAGE"
                        },
                        "FIRST_INPUT_DELAY_MS": {
                            "percentile": 13,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 100,
                                    "proportion": 0.9701000000000001
                                },
                                {
                                    "min": 100,
                                    "max": 300,
                                    "proportion": 0.02260000000000001
                                },
                                {
                                    "min": 300,
                                    "proportion": 0.007300000000000002
                                }
                            ],
                            "category": "FAST"
                        },
                        "LARGEST_CONTENTFUL_PAINT_MS": {
                            "percentile": 2849,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 2500,
                                    "proportion": 0.6998800119988002
                                },
                                {
                                    "min": 2500,
                                    "max": 4000,
                                    "proportion": 0.20352964703529636
                                },
                                {
                                    "min": 4000,
                                    "proportion": 0.09659034096590347
                                }
                            ],
                            "category": "AVERAGE"
                        }
                    },
                    "overall_category": "AVERAGE",
                    "initial_url": "https://rapidload.io/"
                },
                "originLoadingExperience": {
                    "id": "https://rapidload.io",
                    "metrics": {
                        "CUMULATIVE_LAYOUT_SHIFT_SCORE": {
                            "percentile": 3,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 10,
                                    "proportion": 0.9364063593640636
                                },
                                {
                                    "min": 10,
                                    "max": 25,
                                    "proportion": 0.030796920307969204
                                },
                                {
                                    "min": 25,
                                    "proportion": 0.03279672032796722
                                }
                            ],
                            "category": "FAST"
                        },
                        "EXPERIMENTAL_INTERACTION_TO_NEXT_PAINT": {
                            "percentile": 154,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 200,
                                    "proportion": 0.8175635127025406
                                },
                                {
                                    "min": 200,
                                    "max": 500,
                                    "proportion": 0.13522704540908184
                                },
                                {
                                    "min": 500,
                                    "proportion": 0.04720944188837764
                                }
                            ],
                            "category": "FAST"
                        },
                        "EXPERIMENTAL_TIME_TO_FIRST_BYTE": {
                            "percentile": 2185,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 800,
                                    "proportion": 0.46940611877624483
                                },
                                {
                                    "min": 800,
                                    "max": 1800,
                                    "proportion": 0.21615676864627079
                                },
                                {
                                    "min": 1800,
                                    "proportion": 0.3144371125774844
                                }
                            ],
                            "category": "SLOW"
                        },
                        "FIRST_CONTENTFUL_PAINT_MS": {
                            "percentile": 3149,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 1800,
                                    "proportion": 0.548880447820871
                                },
                                {
                                    "min": 1800,
                                    "max": 3000,
                                    "proportion": 0.20141943222710887
                                },
                                {
                                    "min": 3000,
                                    "proportion": 0.2497001199520202
                                }
                            ],
                            "category": "SLOW"
                        },
                        "FIRST_INPUT_DELAY_MS": {
                            "percentile": 4,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 100,
                                    "proportion": 0.9671967196719672
                                },
                                {
                                    "min": 100,
                                    "max": 300,
                                    "proportion": 0.0167016701670167
                                },
                                {
                                    "min": 300,
                                    "proportion": 0.01610161016101607
                                }
                            ],
                            "category": "FAST"
                        },
                        "LARGEST_CONTENTFUL_PAINT_MS": {
                            "percentile": 3625,
                            "distributions": [
                                {
                                    "min": 0,
                                    "max": 2500,
                                    "proportion": 0.60805
                                },
                                {
                                    "min": 2500,
                                    "max": 4000,
                                    "proportion": 0.2118499999999999
                                },
                                {
                                    "min": 4000,
                                    "proportion": 0.18010000000000015
                                }
                            ],
                            "category": "AVERAGE"
                        }
                    },
                    "overall_category": "SLOW",
                    "initial_url": "https://rapidload.io/"
                },
                "lighthouseResult": {
                    "requestedUrl": "https://rapidload.io/",
                    "finalUrl": "https://rapidload.io/",
                    "lighthouseVersion": "9.6.6",
                    "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/106.0.5249.103 Safari/537.36",
                    "fetchTime": "2022-11-08T06:32:50.217Z",
                    "environment": {
                        "networkUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse",
                        "hostUserAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/106.0.5249.103 Safari/537.36",
                        "benchmarkIndex": 1002
                    },
                    "runWarnings": [],
                    "configSettings": {
                        "emulatedFormFactor": "desktop",
                        "formFactor": "desktop",
                        "locale": "en-US",
                        "onlyCategories": [
                            "performance"
                        ],
                        "channel": "lr"
                    },
                    "audits": {
                        "legacy-javascript": {
                            "id": "legacy-javascript",
                            "title": "Avoid serving legacy JavaScript to modern browsers",
                            "description": "Polyfills and transforms enable legacy browsers to use new JavaScript features. However, many aren't necessary for modern browsers. For your bundled JavaScript, adopt a modern script deployment strategy using module/nomodule feature detection to reduce the amount of code shipped to modern browsers, while retaining support for legacy browsers. [Learn More](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 9 KiB",
                            "details": {
                                "overallSavingsMs": 0,
                                "headings": [
                                    {
                                        "subItemsHeading": {
                                            "key": "location",
                                            "valueType": "source-location"
                                        },
                                        "label": "URL",
                                        "valueType": "url",
                                        "key": "url"
                                    },
                                    {
                                        "subItemsHeading": {
                                            "key": "signal"
                                        },
                                        "key": null,
                                        "valueType": "code"
                                    },
                                    {
                                        "label": "Potential Savings",
                                        "valueType": "bytes",
                                        "key": "wastedBytes"
                                    }
                                ],
                                "overallSavingsBytes": 9694,
                                "items": [
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.8.0",
                                        "subItems": {
                                            "items": [
                                                {
                                                    "location": {
                                                        "column": 30969,
                                                        "type": "source-location",
                                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.8.0",
                                                        "urlProvider": "network",
                                                        "line": 1
                                                    },
                                                    "signal": "Array.prototype.includes"
                                                }
                                            ],
                                            "type": "subitems"
                                        },
                                        "totalBytes": 0,
                                        "wastedBytes": 9645
                                    },
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "location": {
                                                        "urlProvider": "network",
                                                        "column": 218355,
                                                        "type": "source-location",
                                                        "line": 1,
                                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js"
                                                    },
                                                    "signal": "@babel/plugin-transform-classes"
                                                }
                                            ]
                                        },
                                        "wastedBytes": 49,
                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                        "totalBytes": 0
                                    }
                                ],
                                "type": "opportunity"
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "first-contentful-paint": {
                            "id": "first-contentful-paint",
                            "title": "First Contentful Paint",
                            "description": "First Contentful Paint marks the time at which the first text or image is painted. [Learn more](https://web.dev/first-contentful-paint/).",
                            "score": 0.98,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "0.7 s",
                            "numericValue": 660,
                            "numericUnit": "millisecond"
                        },
                        "uses-text-compression": {
                            "id": "uses-text-compression",
                            "title": "Enable text compression",
                            "description": "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes. [Learn more](https://web.dev/uses-text-compression/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "type": "opportunity",
                                "headings": [],
                                "overallSavingsBytes": 0,
                                "items": [],
                                "overallSavingsMs": 0
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "uses-responsive-images": {
                            "id": "uses-responsive-images",
                            "title": "Properly size images",
                            "description": "Serve images that are appropriately-sized to save cellular data and improve load time. [Learn more](https://web.dev/uses-responsive-images/).",
                            "score": 0.97,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 41 KiB",
                            "details": {
                                "overallSavingsBytes": 41710,
                                "type": "opportunity",
                                "overallSavingsMs": 40,
                                "items": [
                                    {
                                        "wastedPercent": 53.18559556786704,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png",
                                        "wastedBytes": 14615,
                                        "totalBytes": 27480,
                                        "node": {
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "type": "node",
                                            "boundingRect": {
                                                "left": 405,
                                                "bottom": 1335,
                                                "right": 665,
                                                "width": 260,
                                                "top": 1205,
                                                "height": 130
                                            },
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "lhId": "page-5-IMG",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full"
                                        }
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png",
                                        "wastedPercent": 53.18559556786704,
                                        "totalBytes": 19752,
                                        "node": {
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "lhId": "page-7-IMG",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png 3…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "boundingRect": {
                                                "bottom": 1335,
                                                "left": 965,
                                                "width": 260,
                                                "top": 1205,
                                                "right": 1225,
                                                "height": 130
                                            }
                                        },
                                        "wastedBytes": 10505
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png",
                                        "node": {
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png 380w,…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "boundingRect": {
                                                "right": 385,
                                                "top": 1205,
                                                "bottom": 1335,
                                                "height": 130,
                                                "left": 125,
                                                "width": 260
                                            },
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "lhId": "page-4-IMG",
                                            "type": "node"
                                        },
                                        "totalBytes": 17306,
                                        "wastedBytes": 9204,
                                        "wastedPercent": 53.18559556786704
                                    },
                                    {
                                        "wastedPercent": 53.18559556786704,
                                        "node": {
                                            "boundingRect": {
                                                "height": 130,
                                                "width": 260,
                                                "top": 1205,
                                                "left": 685,
                                                "right": 945,
                                                "bottom": 1335
                                            },
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png 38…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-6-IMG",
                                            "type": "node",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full"
                                        },
                                        "totalBytes": 13887,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png",
                                        "wastedBytes": 7386
                                    }
                                ],
                                "headings": [
                                    {
                                        "valueType": "node",
                                        "key": "node"
                                    },
                                    {
                                        "key": "url",
                                        "valueType": "url",
                                        "label": "URL"
                                    },
                                    {
                                        "key": "totalBytes",
                                        "valueType": "bytes",
                                        "label": "Resource Size"
                                    },
                                    {
                                        "label": "Potential Savings",
                                        "valueType": "bytes",
                                        "key": "wastedBytes"
                                    }
                                ]
                            },
                            "numericValue": 40,
                            "numericUnit": "millisecond"
                        },
                        "metrics": {
                            "id": "metrics",
                            "title": "Metrics",
                            "description": "Collects all available metrics.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "items": [
                                    {
                                        "observedFirstVisualChange": 2360,
                                        "observedFirstVisualChangeTs": 390340651567,
                                        "observedLastVisualChange": 4377,
                                        "totalCumulativeLayoutShift": 0.02041724157619006,
                                        "maxPotentialFID": 288,
                                        "observedFirstMeaningfulPaintTs": 390340875160,
                                        "observedLargestContentfulPaintAllFrames": 4389,
                                        "observedFirstContentfulPaintAllFrames": 2328,
                                        "observedTimeOriginTs": 390338291567,
                                        "observedFirstPaintTs": 390340619239,
                                        "cumulativeLayoutShift": 0.02041724157619006,
                                        "observedLastVisualChangeTs": 390342668567,
                                        "observedTimeOrigin": 0,
                                        "observedFirstMeaningfulPaint": 2584,
                                        "observedCumulativeLayoutShiftMainFrame": 0.02041724157619006,
                                        "speedIndex": 2369,
                                        "observedNavigationStart": 0,
                                        "observedDomContentLoadedTs": 390341562347,
                                        "largestContentfulPaint": 2954,
                                        "observedLargestContentfulPaint": 4389,
                                        "cumulativeLayoutShiftMainFrame": 0.02041724157619006,
                                        "observedTraceEnd": 9243,
                                        "observedLargestContentfulPaintAllFramesTs": 390342680290,
                                        "observedFirstContentfulPaintAllFramesTs": 390340619239,
                                        "observedTraceEndTs": 390347534513,
                                        "observedLargestContentfulPaintTs": 390342680290,
                                        "firstContentfulPaint": 660,
                                        "observedFirstPaint": 2328,
                                        "observedSpeedIndex": 2859,
                                        "observedFirstContentfulPaintTs": 390340619239,
                                        "firstMeaningfulPaint": 700,
                                        "observedSpeedIndexTs": 390341150396,
                                        "observedNavigationStartTs": 390338291567,
                                        "interactive": 3004,
                                        "observedDomContentLoaded": 3271,
                                        "totalBlockingTime": 154,
                                        "observedTotalCumulativeLayoutShift": 0.02041724157619006,
                                        "observedLoadTs": 390343157971,
                                        "observedCumulativeLayoutShift": 0.02041724157619006,
                                        "observedFirstContentfulPaint": 2328,
                                        "observedLoad": 4866
                                    },
                                    {
                                        "lcpInvalidated": false
                                    }
                                ],
                                "type": "debugdata"
                            },
                            "numericValue": 3004,
                            "numericUnit": "millisecond"
                        },
                        "critical-request-chains": {
                            "id": "critical-request-chains",
                            "title": "Avoid chaining critical requests",
                            "description": "The Critical Request Chains below show you what resources are loaded with a high priority. Consider reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load. [Learn more](https://web.dev/critical-request-chains/).",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "40 chains found",
                            "details": {
                                "type": "criticalrequestchain",
                                "chains": {
                                    "F2BE91FB91788CDF2140DD8B7F20D108": {
                                        "request": {
                                            "url": "https://rapidload.io/",
                                            "endTime": 390339.598258,
                                            "transferSize": 47944,
                                            "responseReceivedTime": 390339.598252,
                                            "startTime": 390338.292762
                                        },
                                        "children": {
                                            "40.44": {
                                                "request": {
                                                    "startTime": 390340.557335,
                                                    "endTime": 390340.602447,
                                                    "responseReceivedTime": 390340.602442,
                                                    "url": "https://rapidload.io/wp-includes/js/dist/i18n.min.js?ver=30fcecb428a0e8383d3776bcdd3a7834",
                                                    "transferSize": 5079
                                                }
                                            },
                                            "40.7": {
                                                "request": {
                                                    "responseReceivedTime": 390339.645149,
                                                    "transferSize": 4782,
                                                    "url": "https://rapidload.io/wp-content/plugins/uucss-stripe-gateway/assets/js/script.js?v=1849731375&ver=5.9.3",
                                                    "endTime": 390339.64516,
                                                    "startTime": 390339.614335
                                                }
                                            },
                                            "40.35": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.0.1",
                                                    "endTime": 390340.596426,
                                                    "transferSize": 8586,
                                                    "responseReceivedTime": 390340.59641700005,
                                                    "startTime": 390340.552619
                                                }
                                            },
                                            "40.85": {
                                                "request": {
                                                    "startTime": 390340.797546,
                                                    "transferSize": 17376,
                                                    "endTime": 390340.804662,
                                                    "responseReceivedTime": 390340.804657,
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WC-URzLdnfw.ttf"
                                                }
                                            },
                                            "40.52": {
                                                "request": {
                                                    "endTime": 390340.622265,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js?ver=3.7.3",
                                                    "responseReceivedTime": 390340.62225599994,
                                                    "transferSize": 33380,
                                                    "startTime": 390340.559454
                                                }
                                            },
                                            "40.54": {
                                                "request": {
                                                    "endTime": 390340.604455,
                                                    "startTime": 390340.56006,
                                                    "responseReceivedTime": 390340.604451,
                                                    "transferSize": 2647,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js?ver=3.7.3"
                                                }
                                            },
                                            "40.29": {
                                                "request": {
                                                    "endTime": 390340.630296,
                                                    "transferSize": 2138,
                                                    "responseReceivedTime": 390340.63029199996,
                                                    "startTime": 390340.549785,
                                                    "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=7.0.0"
                                                }
                                            },
                                            "40.83": {
                                                "request": {
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLdnfw.ttf",
                                                    "endTime": 390340.582259,
                                                    "transferSize": 16964,
                                                    "responseReceivedTime": 390340.582255,
                                                    "startTime": 390340.57687
                                                }
                                            },
                                            "40.31": {
                                                "request": {
                                                    "startTime": 390340.550424,
                                                    "transferSize": 1815,
                                                    "endTime": 390340.588097,
                                                    "responseReceivedTime": 390340.588089,
                                                    "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=7.0.0"
                                                }
                                            },
                                            "40.40": {
                                                "request": {
                                                    "startTime": 390340.555987,
                                                    "endTime": 390340.640793,
                                                    "responseReceivedTime": 390340.64078,
                                                    "transferSize": 12173,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.8.0"
                                                }
                                            },
                                            "40.98": {
                                                "request": {
                                                    "startTime": 390340.586567,
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe0qMImSLYBIv1o4X1M8cce9I94.ttf",
                                                    "endTime": 390340.593075,
                                                    "transferSize": 22436,
                                                    "responseReceivedTime": 390340.59306700004
                                                }
                                            },
                                            "40.41": {
                                                "request": {
                                                    "startTime": 390340.556148,
                                                    "url": "https://rapidload.io/wp-includes/js/dist/vendor/regenerator-runtime.min.js?ver=0.13.9",
                                                    "transferSize": 3534,
                                                    "responseReceivedTime": 390340.600653,
                                                    "endTime": 390340.600659
                                                }
                                            },
                                            "40.46": {
                                                "request": {
                                                    "responseReceivedTime": 390340.59871500003,
                                                    "startTime": 390340.558047,
                                                    "transferSize": 4241,
                                                    "endTime": 390340.598719,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js?ver=4.0.2"
                                                }
                                            },
                                            "40.4": {
                                                "request": {
                                                    "endTime": 390339.676632,
                                                    "transferSize": 33032,
                                                    "url": "https://rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.6.0",
                                                    "responseReceivedTime": 390339.67662600003,
                                                    "startTime": 390339.613106
                                                }
                                            },
                                            "40.33": {
                                                "request": {
                                                    "transferSize": 9169,
                                                    "startTime": 390340.551099,
                                                    "responseReceivedTime": 390340.62577299995,
                                                    "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/new-landing.js?ver=260756428",
                                                    "endTime": 390340.625784
                                                }
                                            },
                                            "40.51": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.8.0",
                                                    "startTime": 390340.559149,
                                                    "transferSize": 13624,
                                                    "responseReceivedTime": 390340.62845699996,
                                                    "endTime": 390340.628461
                                                }
                                            },
                                            "40.39": {
                                                "request": {
                                                    "responseReceivedTime": 390340.626929,
                                                    "endTime": 390340.626935,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.8.0",
                                                    "transferSize": 3252,
                                                    "startTime": 390340.555087
                                                }
                                            },
                                            "40.47": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-includes/js/jquery/ui/core.min.js?ver=1.13.1",
                                                    "responseReceivedTime": 390340.601278,
                                                    "endTime": 390340.601283,
                                                    "transferSize": 8105,
                                                    "startTime": 390340.558198
                                                }
                                            },
                                            "40.50": {
                                                "request": {
                                                    "responseReceivedTime": 390340.59797999996,
                                                    "startTime": 390340.558751,
                                                    "endTime": 390340.597984,
                                                    "transferSize": 4590,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js?ver=4.9.0"
                                                }
                                            },
                                            "40.30": {
                                                "request": {
                                                    "responseReceivedTime": 390341.245214,
                                                    "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min.js?ver=2.1.4-wc.7.0.0",
                                                    "endTime": 390341.245232,
                                                    "startTime": 390340.550216,
                                                    "transferSize": 2030
                                                }
                                            },
                                            "40.38": {
                                                "request": {
                                                    "startTime": 390340.553574,
                                                    "endTime": 390340.629839,
                                                    "transferSize": 3403,
                                                    "responseReceivedTime": 390340.629834,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=3.7.3"
                                                }
                                            },
                                            "40.48": {
                                                "request": {
                                                    "endTime": 390340.613968,
                                                    "responseReceivedTime": 390340.613963,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js?ver=5.3.6",
                                                    "startTime": 390340.558382,
                                                    "transferSize": 37486
                                                }
                                            },
                                            "40.99": {
                                                "request": {
                                                    "transferSize": 22683,
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc9iB85tU1Q.ttf",
                                                    "startTime": 390340.795687,
                                                    "endTime": 390340.805157,
                                                    "responseReceivedTime": 390340.805154
                                                }
                                            },
                                            "40.5": {
                                                "request": {
                                                    "transferSize": 5357,
                                                    "endTime": 390339.649424,
                                                    "responseReceivedTime": 390339.649418,
                                                    "startTime": 390339.61349,
                                                    "url": "https://rapidload.io/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2"
                                                }
                                            },
                                            "40.43": {
                                                "request": {
                                                    "endTime": 390341.241509,
                                                    "responseReceivedTime": 390341.241498,
                                                    "url": "https://rapidload.io/wp-includes/js/dist/hooks.min.js?ver=1e58c8c5a32b2e97491080c5b10dc71c",
                                                    "transferSize": 2955,
                                                    "startTime": 390340.557162
                                                }
                                            },
                                            "40.42": {
                                                "request": {
                                                    "responseReceivedTime": 390341.480763,
                                                    "endTime": 390341.480769,
                                                    "transferSize": 8268,
                                                    "url": "https://rapidload.io/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0",
                                                    "startTime": 390340.556373
                                                }
                                            },
                                            "40.37": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-includes/js/imagesloaded.min.js?ver=4.1.4",
                                                    "endTime": 390341.464108,
                                                    "startTime": 390340.553357,
                                                    "transferSize": 2913,
                                                    "responseReceivedTime": 390341.464101
                                                }
                                            },
                                            "40.6": {
                                                "request": {
                                                    "transferSize": 1902,
                                                    "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/script.js?ver=1629785566",
                                                    "endTime": 390340.533816,
                                                    "responseReceivedTime": 390340.533799,
                                                    "startTime": 390339.613779
                                                }
                                            },
                                            "40.8": {
                                                "request": {
                                                    "transferSize": 1179,
                                                    "endTime": 390339.629737,
                                                    "startTime": 390339.614501,
                                                    "url": "https://www.google.com/recaptcha/api.js?render=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&ver=5.9.3",
                                                    "responseReceivedTime": 390339.62972799997
                                                }
                                            },
                                            "40.45": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=3.7.3",
                                                    "endTime": 390340.624057,
                                                    "startTime": 390340.557878,
                                                    "transferSize": 7011,
                                                    "responseReceivedTime": 390340.624052
                                                }
                                            },
                                            "40.86": {
                                                "request": {
                                                    "startTime": 390340.606318,
                                                    "transferSize": 17312,
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WC9wRzLdnfw.ttf",
                                                    "responseReceivedTime": 390340.614775,
                                                    "endTime": 390340.614779
                                                }
                                            },
                                            "40.27": {
                                                "request": {
                                                    "endTime": 390340.625237,
                                                    "transferSize": 1641,
                                                    "startTime": 390339.704292,
                                                    "responseReceivedTime": 390340.62523199996,
                                                    "url": "https://rapidload.io/wp-content/plugins/activecampaign-subscription-forms/site_tracking.js?ver=5.9.3"
                                                }
                                            },
                                            "40.49": {
                                                "request": {
                                                    "transferSize": 2208,
                                                    "responseReceivedTime": 390340.63135000004,
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js?ver=3.8.0",
                                                    "endTime": 390340.631355,
                                                    "startTime": 390340.558535
                                                }
                                            },
                                            "40.100": {
                                                "request": {
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8GBs5tU1Q.ttf",
                                                    "startTime": 390340.796109,
                                                    "endTime": 390340.803322,
                                                    "responseReceivedTime": 390340.80331,
                                                    "transferSize": 22677
                                                }
                                            },
                                            "40.84": {
                                                "request": {
                                                    "transferSize": 17318,
                                                    "responseReceivedTime": 390340.705544,
                                                    "endTime": 390340.705555,
                                                    "startTime": 390340.700174,
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WCwkWzLdnfw.ttf"
                                                }
                                            },
                                            "40.36": {
                                                "request": {
                                                    "responseReceivedTime": 390340.627413,
                                                    "endTime": 390340.627417,
                                                    "url": "https://rapidload.io/wp-includes/js/wp-embed.min.js?ver=5.9.3",
                                                    "transferSize": 1809,
                                                    "startTime": 390340.552814
                                                }
                                            },
                                            "40.34": {
                                                "request": {
                                                    "transferSize": 1702,
                                                    "endTime": 390340.597401,
                                                    "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/landing-hover-tab.js?ver=2103974324",
                                                    "responseReceivedTime": 390340.597396,
                                                    "startTime": 390340.551989
                                                }
                                            },
                                            "40.28": {
                                                "request": {
                                                    "startTime": 390340.539591,
                                                    "responseReceivedTime": 390340.574875,
                                                    "endTime": 390340.574885,
                                                    "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.min.js?ver=2.7.0-wc.7.0.0",
                                                    "transferSize": 4535
                                                }
                                            },
                                            "40.53": {
                                                "request": {
                                                    "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/preloaded-modules.min.js?ver=3.8.0",
                                                    "transferSize": 14350,
                                                    "responseReceivedTime": 390341.44144900003,
                                                    "startTime": 390340.55969,
                                                    "endTime": 390341.441456
                                                }
                                            },
                                            "40.32": {
                                                "request": {
                                                    "responseReceivedTime": 390340.642204,
                                                    "endTime": 390340.642209,
                                                    "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/cart-fragments.min.js?ver=7.0.0",
                                                    "startTime": 390340.550888,
                                                    "transferSize": 2094
                                                }
                                            }
                                        }
                                    }
                                },
                                "longestChain": {
                                    "length": 2,
                                    "duration": 3188.0070000188425,
                                    "transferSize": 8268
                                }
                            }
                        },
                        "preload-lcp-image": {
                            "id": "preload-lcp-image",
                            "title": "Preload Largest Contentful Paint image",
                            "description": "Preload the image used by the LCP element in order to improve your LCP time. [Learn more](https://web.dev/optimize-lcp/#preload-important-resources).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "headings": [
                                    {
                                        "key": "node",
                                        "valueType": "node"
                                    },
                                    {
                                        "key": "url",
                                        "label": "URL",
                                        "valueType": "url"
                                    },
                                    {
                                        "key": "wastedMs",
                                        "valueType": "timespanMs",
                                        "label": "Potential Savings"
                                    }
                                ],
                                "overallSavingsMs": 0,
                                "debugData": {
                                    "pathLength": 2,
                                    "initiatorPath": [
                                        {
                                            "initiatorType": "parser",
                                            "url": "https://rapidload.io/wp-content/uploads/2022/08/image-land.svg"
                                        },
                                        {
                                            "url": "https://rapidload.io/",
                                            "initiatorType": "other"
                                        }
                                    ],
                                    "type": "debugdata"
                                },
                                "type": "opportunity",
                                "items": [
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-land.svg",
                                        "wastedMs": 0,
                                        "node": {
                                            "lhId": "page-1-IMG",
                                            "boundingRect": {
                                                "bottom": 727,
                                                "left": 805,
                                                "right": 1235,
                                                "width": 430,
                                                "height": 616,
                                                "top": 111
                                            },
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "type": "node",
                                            "snippet": "<img width=\"504\" height=\"722\" src=\"https://rapidload.io/wp-content/uploads/2022/08/image-land.svg\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\">",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full"
                                        }
                                    }
                                ]
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "unminified-javascript": {
                            "id": "unminified-javascript",
                            "title": "Minify JavaScript",
                            "description": "Minifying JavaScript files can reduce payload sizes and script parse time. [Learn more](https://web.dev/unminified-javascript/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 5 KiB",
                            "details": {
                                "headings": [
                                    {
                                        "label": "URL",
                                        "valueType": "url",
                                        "key": "url"
                                    },
                                    {
                                        "valueType": "bytes",
                                        "label": "Transfer Size",
                                        "key": "totalBytes"
                                    },
                                    {
                                        "label": "Potential Savings",
                                        "valueType": "bytes",
                                        "key": "wastedBytes"
                                    }
                                ],
                                "overallSavingsMs": 0,
                                "type": "opportunity",
                                "overallSavingsBytes": 5108,
                                "items": [
                                    {
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/new-landing.js?ver=260756428",
                                        "totalBytes": 9169,
                                        "wastedPercent": 32.93277037999351,
                                        "wastedBytes": 3020
                                    },
                                    {
                                        "wastedPercent": 43.660412861807515,
                                        "totalBytes": 4782,
                                        "url": "https://rapidload.io/wp-content/plugins/uucss-stripe-gateway/assets/js/script.js?v=1849731375&ver=5.9.3",
                                        "wastedBytes": 2088
                                    }
                                ]
                            },
                            "warnings": [],
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "unsized-images": {
                            "id": "unsized-images",
                            "title": "Image elements do not have explicit `width` and `height`",
                            "description": "Set an explicit width and height on image elements to reduce layout shifts and improve CLS. [Learn more](https://web.dev/optimize-cls/#images-without-dimensions)",
                            "score": 0,
                            "scoreDisplayMode": "binary",
                            "details": {
                                "items": [
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/09/new-logo.svg",
                                        "node": {
                                            "nodeLabel": "new-logo",
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,10,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,A,0,IMG",
                                            "boundingRect": {
                                                "bottom": 1586,
                                                "top": 1528,
                                                "width": 226,
                                                "right": 341,
                                                "left": 115,
                                                "height": 58
                                            },
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/09/new-logo.svg\" alt=\"new-logo\">",
                                            "selector": "div.elementor-widget-container > div.elementor-image > a > img",
                                            "lhId": "page-72-IMG"
                                        }
                                    }
                                ],
                                "headings": [
                                    {
                                        "key": "node",
                                        "itemType": "node"
                                    },
                                    {
                                        "itemType": "url",
                                        "text": "URL",
                                        "key": "url"
                                    }
                                ],
                                "type": "table"
                            }
                        },
                        "speed-index": {
                            "id": "speed-index",
                            "title": "Speed Index",
                            "description": "Speed Index shows how quickly the contents of a page are visibly populated. [Learn more](https://web.dev/speed-index/).",
                            "score": 0.47,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "2.4 s",
                            "numericValue": 2369.1597497067214,
                            "numericUnit": "millisecond"
                        },
                        "network-rtt": {
                            "id": "network-rtt",
                            "title": "Network Round Trip Times",
                            "description": "Network round trip times (RTT) have a large impact on performance. If the RTT to an origin is high, it's an indication that servers closer to the user could improve performance. [Learn more](https://hpbn.co/primer-on-latency-and-bandwidth/).",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "0 ms",
                            "details": {
                                "type": "table",
                                "headings": [],
                                "items": []
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "script-treemap-data": {
                            "id": "script-treemap-data",
                            "title": "Script Treemap Data",
                            "description": "Used for treemap app",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "type": "treemap-data",
                                "nodes": [
                                    {
                                        "name": "https://rapidload.io/",
                                        "resourceBytes": 8427
                                    },
                                    {
                                        "resourceBytes": 813978,
                                        "unusedBytes": 435955,
                                        "name": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js"
                                    },
                                    {
                                        "resourceBytes": 89521,
                                        "unusedBytes": 34769,
                                        "name": "https://rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.6.0"
                                    },
                                    {
                                        "unusedBytes": 3823,
                                        "name": "https://rapidload.io/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2",
                                        "resourceBytes": 11224
                                    },
                                    {
                                        "resourceBytes": 2297,
                                        "unusedBytes": 252,
                                        "name": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/script.js?ver=1629785566"
                                    },
                                    {
                                        "unusedBytes": 17206,
                                        "resourceBytes": 18069,
                                        "name": "https://rapidload.io/wp-content/plugins/uucss-stripe-gateway/assets/js/script.js?v=1849731375&ver=5.9.3"
                                    },
                                    {
                                        "unusedBytes": 49,
                                        "resourceBytes": 884,
                                        "name": "https://www.google.com/recaptcha/api.js?render=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&ver=5.9.3"
                                    },
                                    {
                                        "unusedBytes": 701,
                                        "name": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
                                        "resourceBytes": 5708
                                    },
                                    {
                                        "name": "https://grow.clearbitjs.com/api/pixel.js?v=1667889173572",
                                        "unusedBytes": 0,
                                        "resourceBytes": 1595
                                    },
                                    {
                                        "unusedBytes": 86411,
                                        "name": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
                                        "resourceBytes": 226239
                                    },
                                    {
                                        "unusedBytes": 96870,
                                        "name": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                        "resourceBytes": 261952
                                    },
                                    {
                                        "resourceBytes": 169237,
                                        "name": "https://script.hotjar.com/preact-incoming-feedback.7662d6fc45aef63728ff.js",
                                        "unusedBytes": 54949
                                    },
                                    {
                                        "resourceBytes": 1403,
                                        "unusedBytes": 634,
                                        "name": "https://rapidload.io/wp-content/plugins/activecampaign-subscription-forms/site_tracking.js?ver=5.9.3"
                                    },
                                    {
                                        "resourceBytes": 9509,
                                        "unusedBytes": 7586,
                                        "name": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.min.js?ver=2.7.0-wc.7.0.0"
                                    },
                                    {
                                        "resourceBytes": 3037,
                                        "name": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=7.0.0",
                                        "unusedBytes": 2339
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min.js?ver=2.1.4-wc.7.0.0",
                                        "resourceBytes": 1834,
                                        "unusedBytes": 244
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=7.0.0",
                                        "resourceBytes": 2139,
                                        "unusedBytes": 1237
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/cart-fragments.min.js?ver=7.0.0",
                                        "resourceBytes": 2938,
                                        "unusedBytes": 554
                                    },
                                    {
                                        "unusedBytes": 41398,
                                        "resourceBytes": 43106,
                                        "name": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/new-landing.js?ver=260756428"
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/landing-hover-tab.js?ver=2103974324",
                                        "resourceBytes": 8077,
                                        "unusedBytes": 7456
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.0.1",
                                        "unusedBytes": 19285,
                                        "resourceBytes": 25202
                                    },
                                    {
                                        "unusedBytes": 0,
                                        "resourceBytes": 1492,
                                        "name": "https://rapidload.io/wp-includes/js/wp-embed.min.js?ver=5.9.3"
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-includes/js/imagesloaded.min.js?ver=4.1.4",
                                        "resourceBytes": 5629,
                                        "unusedBytes": 4167
                                    },
                                    {
                                        "unusedBytes": 3183,
                                        "resourceBytes": 5184,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=3.7.3"
                                    },
                                    {
                                        "resourceBytes": 4957,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.8.0",
                                        "unusedBytes": 2873
                                    },
                                    {
                                        "unusedBytes": 13221,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.8.0",
                                        "resourceBytes": 32946
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-includes/js/dist/vendor/regenerator-runtime.min.js?ver=0.13.9",
                                        "resourceBytes": 6494,
                                        "unusedBytes": 5122
                                    },
                                    {
                                        "resourceBytes": 19257,
                                        "unusedBytes": 6508,
                                        "name": "https://rapidload.io/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0"
                                    },
                                    {
                                        "resourceBytes": 5690,
                                        "name": "https://rapidload.io/wp-includes/js/dist/hooks.min.js?ver=1e58c8c5a32b2e97491080c5b10dc71c",
                                        "unusedBytes": 1620
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-includes/js/dist/i18n.min.js?ver=30fcecb428a0e8383d3776bcdd3a7834",
                                        "resourceBytes": 10407,
                                        "unusedBytes": 7144
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=3.7.3",
                                        "unusedBytes": 13033,
                                        "resourceBytes": 21417
                                    },
                                    {
                                        "resourceBytes": 12198,
                                        "unusedBytes": 9785,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js?ver=4.0.2"
                                    },
                                    {
                                        "unusedBytes": 15742,
                                        "name": "https://rapidload.io/wp-includes/js/jquery/ui/core.min.js?ver=1.13.1",
                                        "resourceBytes": 20712
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js?ver=5.3.6",
                                        "resourceBytes": 139153,
                                        "unusedBytes": 73719
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js?ver=3.8.0",
                                        "unusedBytes": 1294,
                                        "resourceBytes": 2620
                                    },
                                    {
                                        "resourceBytes": 10682,
                                        "unusedBytes": 8737,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js?ver=4.9.0"
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.8.0",
                                        "unusedBytes": 18008,
                                        "resourceBytes": 40513
                                    },
                                    {
                                        "resourceBytes": 134630,
                                        "unusedBytes": 103028,
                                        "name": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js?ver=3.7.3"
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor/assets/js/preloaded-modules.min.js?ver=3.8.0",
                                        "unusedBytes": 34557,
                                        "resourceBytes": 43140
                                    },
                                    {
                                        "name": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js?ver=3.7.3",
                                        "unusedBytes": 3646,
                                        "resourceBytes": 3704
                                    }
                                ]
                            }
                        },
                        "dom-size": {
                            "id": "dom-size",
                            "title": "Avoid an excessive DOM size",
                            "description": "A large DOM will increase memory usage, cause longer [style calculations](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations), and produce costly [layout reflows](https://developers.google.com/speed/articles/reflow). [Learn more](https://web.dev/dom-size/).",
                            "score": 0.25,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "1,846 elements",
                            "details": {
                                "headings": [
                                    {
                                        "itemType": "text",
                                        "key": "statistic",
                                        "text": "Statistic"
                                    },
                                    {
                                        "key": "node",
                                        "itemType": "node",
                                        "text": "Element"
                                    },
                                    {
                                        "itemType": "numeric",
                                        "key": "value",
                                        "text": "Value"
                                    }
                                ],
                                "items": [
                                    {
                                        "statistic": "Total DOM Elements",
                                        "value": 1846
                                    },
                                    {
                                        "statistic": "Maximum DOM Depth",
                                        "node": {
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,FORM,4,DIV,1,DIV,0,BUTTON,0,SPAN,0,SPAN,0,svg,3,g,0,g,0,path",
                                            "snippet": "<path d=\"M15.0355339,7.5 L12.232233,4.69669914 C11.2559223,3.72038841 11.2559223,2.…\" id=\"Combined-Shape\">",
                                            "nodeLabel": "svg > g#Referrals-landing-page-V2 > g#how-arrow > path#Combined-Shape",
                                            "lhId": "12-116-path",
                                            "type": "node",
                                            "selector": "svg > g#Referrals-landing-page-V2 > g#how-arrow > path#Combined-Shape",
                                            "boundingRect": {
                                                "bottom": 503,
                                                "right": 610,
                                                "top": 493,
                                                "height": 10,
                                                "left": 598,
                                                "width": 12
                                            }
                                        },
                                        "value": 30
                                    },
                                    {
                                        "value": 57,
                                        "statistic": "Maximum Child Elements",
                                        "node": {
                                            "type": "node",
                                            "nodeLabel": "body.home",
                                            "path": "1,HTML,1,BODY",
                                            "boundingRect": {
                                                "width": 1350,
                                                "left": 0,
                                                "height": 1939,
                                                "right": 1350,
                                                "top": 0,
                                                "bottom": 1939
                                            },
                                            "snippet": "<body data-rsssl=\"1\" class=\"home page-template-default page page-id-10534 wp-custom-logo theme-hello-e…\" data-elementor-device-mode=\"desktop\">",
                                            "lhId": "12-117-BODY",
                                            "selector": "body.home"
                                        }
                                    }
                                ],
                                "type": "table"
                            },
                            "numericValue": 1846,
                            "numericUnit": "element"
                        },
                        "unused-javascript": {
                            "id": "unused-javascript",
                            "title": "Reduce unused JavaScript",
                            "description": "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. [Learn more](https://web.dev/unused-javascript/).",
                            "score": 0.77,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 165 KiB",
                            "details": {
                                "overallSavingsMs": 280,
                                "overallSavingsBytes": 168493,
                                "headings": [
                                    {
                                        "subItemsHeading": {
                                            "valueType": "code",
                                            "key": "source"
                                        },
                                        "label": "URL",
                                        "key": "url",
                                        "valueType": "url"
                                    },
                                    {
                                        "label": "Transfer Size",
                                        "valueType": "bytes",
                                        "key": "totalBytes",
                                        "subItemsHeading": {
                                            "key": "sourceBytes"
                                        }
                                    },
                                    {
                                        "label": "Potential Savings",
                                        "subItemsHeading": {
                                            "key": "sourceWastedBytes"
                                        },
                                        "valueType": "bytes",
                                        "key": "wastedBytes"
                                    }
                                ],
                                "type": "opportunity",
                                "items": [
                                    {
                                        "wastedBytes": 87431,
                                        "wastedPercent": 53.558572836120874,
                                        "totalBytes": 163243,
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js"
                                    },
                                    {
                                        "wastedBytes": 29963,
                                        "wastedPercent": 38.194564155605356,
                                        "totalBytes": 78448,
                                        "url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB"
                                    },
                                    {
                                        "wastedBytes": 25554,
                                        "wastedPercent": 36.98005741509895,
                                        "totalBytes": 69103,
                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js"
                                    },
                                    {
                                        "totalBytes": 33380,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js?ver=3.7.3",
                                        "wastedBytes": 25545,
                                        "wastedPercent": 76.52677709277278
                                    }
                                ]
                            },
                            "numericValue": 280,
                            "numericUnit": "millisecond"
                        },
                        "user-timings": {
                            "id": "user-timings",
                            "title": "User Timing marks and measures",
                            "description": "Consider instrumenting your app with the User Timing API to measure your app's real-world performance during key user experiences. [Learn more](https://web.dev/user-timings/).",
                            "score": null,
                            "scoreDisplayMode": "notApplicable",
                            "details": {
                                "items": [],
                                "headings": [],
                                "type": "table"
                            }
                        },
                        "offscreen-images": {
                            "id": "offscreen-images",
                            "title": "Defer offscreen images",
                            "description": "Consider lazy-loading offscreen and hidden images after all critical resources have finished loading to lower time to interactive. [Learn more](https://web.dev/offscreen-images/).",
                            "score": 0.93,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 99 KiB",
                            "details": {
                                "type": "opportunity",
                                "items": [
                                    {
                                        "totalBytes": 57026,
                                        "node": {
                                            "nodeLabel": "Geoffrey Gussis",
                                            "type": "node",
                                            "boundingRect": {
                                                "top": 0,
                                                "height": 0,
                                                "width": 0,
                                                "right": 0,
                                                "bottom": 0,
                                                "left": 0
                                            },
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-16-IMG",
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/Geoferry-Gussis.png\" alt=\"Geoffrey Gussis\">"
                                        },
                                        "requestStartTime": 390340.563656,
                                        "wastedBytes": 57026,
                                        "wastedPercent": 100,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Geoferry-Gussis.png"
                                    },
                                    {
                                        "totalBytes": 19908,
                                        "requestStartTime": 390340.563435,
                                        "node": {
                                            "nodeLabel": "Tim Daniels",
                                            "boundingRect": {
                                                "left": 0,
                                                "top": 0,
                                                "width": 0,
                                                "height": 0,
                                                "bottom": 0,
                                                "right": 0
                                            },
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/image-21.png\" alt=\"Tim Daniels\">",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-14-IMG",
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "type": "node"
                                        },
                                        "wastedBytes": 19908,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-21.png",
                                        "wastedPercent": 100
                                    },
                                    {
                                        "requestStartTime": 390340.562258,
                                        "totalBytes": 9417,
                                        "node": {
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "nodeLabel": "Ross Dobson",
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/image-20.png\" alt=\"Ross Dobson\">",
                                            "boundingRect": {
                                                "left": 0,
                                                "width": 0,
                                                "bottom": 0,
                                                "right": 0,
                                                "height": 0,
                                                "top": 0
                                            },
                                            "lhId": "page-12-IMG"
                                        },
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-20.png",
                                        "wastedBytes": 9417,
                                        "wastedPercent": 100
                                    },
                                    {
                                        "wastedPercent": 100,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-19.png",
                                        "totalBytes": 8669,
                                        "requestStartTime": 390340.56047,
                                        "node": {
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/image-19.png\" alt=\"Dallas Riffle\">",
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "boundingRect": {
                                                "top": 0,
                                                "width": 0,
                                                "left": 0,
                                                "height": 0,
                                                "bottom": 0,
                                                "right": 0
                                            },
                                            "nodeLabel": "Dallas Riffle",
                                            "lhId": "page-10-IMG",
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG"
                                        },
                                        "wastedBytes": 8669
                                    },
                                    {
                                        "totalBytes": 3631,
                                        "wastedPercent": 100,
                                        "node": {
                                            "boundingRect": {
                                                "top": 0,
                                                "bottom": 0,
                                                "right": 0,
                                                "height": 0,
                                                "left": 0,
                                                "width": 0
                                            },
                                            "selector": "div.elementor-testimonial__content > div.elementor-testimonial__text > div.review-star > img.rating-star",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,4,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "nodeLabel": "div.elementor-testimonial__content > div.elementor-testimonial__text > div.review-star > img.rating-star",
                                            "type": "node",
                                            "snippet": "<img class=\"rating-star\" src=\"/wp-content/uploads/2022/07/Group-33.svg\" alt=\"\">",
                                            "lhId": "page-18-IMG"
                                        },
                                        "requestStartTime": 390340.5638,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/07/Group-33.svg",
                                        "wastedBytes": 3631
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/07/Group-25.svg",
                                        "wastedBytes": 3070,
                                        "requestStartTime": 390340.562056,
                                        "totalBytes": 3070,
                                        "wastedPercent": 100,
                                        "node": {
                                            "boundingRect": {
                                                "right": 0,
                                                "width": 0,
                                                "bottom": 0,
                                                "top": 0,
                                                "height": 0,
                                                "left": 0
                                            },
                                            "lhId": "page-11-IMG",
                                            "selector": "cite.elementor-testimonial__cite > span.elementor-testimonial__title > div.rev-head-star > img.rev-title-star",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,CITE,1,SPAN,5,DIV,0,IMG",
                                            "snippet": "<img class=\"rev-title-star\" src=\"/wp-content/uploads/2022/07/Group-25.svg\" alt=\"\">",
                                            "nodeLabel": "cite.elementor-testimonial__cite > span.elementor-testimonial__title > div.rev-head-star > img.rev-title-star",
                                            "type": "node"
                                        }
                                    }
                                ],
                                "headings": [
                                    {
                                        "valueType": "node",
                                        "key": "node"
                                    },
                                    {
                                        "label": "URL",
                                        "key": "url",
                                        "valueType": "url"
                                    },
                                    {
                                        "key": "totalBytes",
                                        "label": "Resource Size",
                                        "valueType": "bytes"
                                    },
                                    {
                                        "key": "wastedBytes",
                                        "label": "Potential Savings",
                                        "valueType": "bytes"
                                    }
                                ],
                                "overallSavingsMs": 80,
                                "overallSavingsBytes": 101721
                            },
                            "warnings": [],
                            "numericValue": 80,
                            "numericUnit": "millisecond"
                        },
                        "largest-contentful-paint": {
                            "id": "largest-contentful-paint",
                            "title": "Largest Contentful Paint",
                            "description": "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more](https://web.dev/lighthouse-largest-contentful-paint/)",
                            "score": 0.35,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "3.0 s",
                            "numericValue": 2953.5,
                            "numericUnit": "millisecond"
                        },
                        "layout-shift-elements": {
                            "id": "layout-shift-elements",
                            "title": "Avoid large layout shifts",
                            "description": "These DOM elements contribute most to the CLS of the page.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "5 elements found",
                            "details": {
                                "type": "table",
                                "items": [
                                    {
                                        "score": 0.01940942131440027,
                                        "node": {
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV",
                                            "snippet": "<div class=\"elementor-widget-wrap\">",
                                            "nodeLabel": "Boost your conversions with a lighter website.\nHow much CSS can we\nsave from yo…",
                                            "selector": "div.elementor-row > div.elementor-column > div.elementor-column-wrap > div.elementor-widget-wrap",
                                            "lhId": "page-74-DIV",
                                            "type": "node",
                                            "boundingRect": {
                                                "height": 324,
                                                "bottom": 553,
                                                "width": 550,
                                                "right": 665,
                                                "left": 115,
                                                "top": 230
                                            }
                                        }
                                    },
                                    {
                                        "score": 0.0005390374142253369,
                                        "node": {
                                            "snippet": "<div class=\"elementor-column elementor-col-100 elementor-inner-column elementor-elemen…\" data-id=\"f62d2db\" data-element_type=\"column\">",
                                            "nodeLabel": "1500+ websites reduced their CSS size up to 90% in the past 30 days.\n4+ Million…",
                                            "selector": "section.elementor-section > div.elementor-container > div.elementor-row > div.elementor-column",
                                            "boundingRect": {
                                                "height": 153,
                                                "left": 115,
                                                "right": 665,
                                                "width": 550,
                                                "top": 553,
                                                "bottom": 706
                                            },
                                            "lhId": "page-75-DIV",
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV"
                                        }
                                    },
                                    {
                                        "score": 0.0001784584833897904,
                                        "node": {
                                            "nodeLabel": "div.elementor-column > div.elementor-column-wrap > div.elementor-widget-wrap > div.elementor-element",
                                            "snippet": "<div class=\"elementor-element elementor-element-0ece5ec elementor-widget elementor-wid…\" data-id=\"0ece5ec\" data-element_type=\"widget\" data-widget_type=\"image.default\">",
                                            "lhId": "page-76-DIV",
                                            "type": "node",
                                            "selector": "div.elementor-column > div.elementor-column-wrap > div.elementor-widget-wrap > div.elementor-element",
                                            "path": "1,HTML,1,BODY,8,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV",
                                            "boundingRect": {
                                                "left": 115,
                                                "top": 37,
                                                "width": 265,
                                                "height": 46,
                                                "bottom": 84,
                                                "right": 380
                                            }
                                        }
                                    },
                                    {
                                        "node": {
                                            "snippet": "<h3>",
                                            "nodeLabel": "683KB saved",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,H3",
                                            "boundingRect": {
                                                "top": 692,
                                                "height": 43,
                                                "right": 1070,
                                                "width": 340,
                                                "left": 730,
                                                "bottom": 735
                                            },
                                            "lhId": "page-77-H3",
                                            "selector": "div#animate-bar-section > div.elementor-widget-container > div.animate-bar-wrap > h3",
                                            "type": "node"
                                        },
                                        "score": 0.00009812705633192971
                                    },
                                    {
                                        "score": 0.00008838211835390977,
                                        "node": {
                                            "boundingRect": {
                                                "bottom": 91,
                                                "left": 507,
                                                "right": 678,
                                                "top": 45,
                                                "height": 46,
                                                "width": 171
                                            },
                                            "path": "1,HTML,1,BODY,8,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,NAV,0,UL,1,LI",
                                            "lhId": "page-78-LI",
                                            "nodeLabel": "Documentation",
                                            "selector": "div.elementor-widget-container > nav.elementor-nav-menu--main > ul#menu-1-8333f81 > li.menu-item",
                                            "type": "node",
                                            "snippet": "<li class=\"menu-item menu-item-type-custom menu-item-object-custom menu-item-15292\">"
                                        }
                                    }
                                ],
                                "headings": [
                                    {
                                        "key": "node",
                                        "text": "Element",
                                        "itemType": "node"
                                    },
                                    {
                                        "itemType": "numeric",
                                        "text": "CLS Contribution",
                                        "key": "score",
                                        "granularity": 0.001
                                    }
                                ]
                            }
                        },
                        "uses-rel-preload": {
                            "id": "uses-rel-preload",
                            "title": "Preload key requests",
                            "description": "Consider using `<link rel=preload>` to prioritize fetching resources that are currently requested later in page load. [Learn more](https://web.dev/uses-rel-preload/).",
                            "score": null,
                            "scoreDisplayMode": "notApplicable",
                            "details": {
                                "headings": [],
                                "overallSavingsMs": 0,
                                "type": "opportunity",
                                "items": []
                            }
                        },
                        "unminified-css": {
                            "id": "unminified-css",
                            "title": "Minify CSS",
                            "description": "Minifying CSS files can reduce network payload sizes. [Learn more](https://web.dev/unminified-css/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "overallSavingsBytes": 0,
                                "headings": [],
                                "overallSavingsMs": 0,
                                "items": [],
                                "type": "opportunity"
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "mainthread-work-breakdown": {
                            "id": "mainthread-work-breakdown",
                            "title": "Minimize main-thread work",
                            "description": "Consider reducing the time spent parsing, compiling and executing JS. You may find delivering smaller JS payloads helps with this. [Learn more](https://web.dev/mainthread-work-breakdown/)",
                            "score": 0.84,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "2.3 s",
                            "details": {
                                "type": "table",
                                "items": [
                                    {
                                        "duration": 1253.9939999999935,
                                        "group": "scriptEvaluation",
                                        "groupLabel": "Script Evaluation"
                                    },
                                    {
                                        "groupLabel": "Other",
                                        "duration": 396.6719999999979,
                                        "group": "other"
                                    },
                                    {
                                        "duration": 324.7599999999998,
                                        "group": "styleLayout",
                                        "groupLabel": "Style & Layout"
                                    },
                                    {
                                        "duration": 121.45000000000002,
                                        "group": "parseHTML",
                                        "groupLabel": "Parse HTML & CSS"
                                    },
                                    {
                                        "group": "paintCompositeRender",
                                        "duration": 114.25299999999996,
                                        "groupLabel": "Rendering"
                                    },
                                    {
                                        "groupLabel": "Script Parsing & Compilation",
                                        "duration": 56.33799999999999,
                                        "group": "scriptParseCompile"
                                    },
                                    {
                                        "duration": 52.280000000000015,
                                        "group": "garbageCollection",
                                        "groupLabel": "Garbage Collection"
                                    }
                                ],
                                "headings": [
                                    {
                                        "itemType": "text",
                                        "key": "groupLabel",
                                        "text": "Category"
                                    },
                                    {
                                        "text": "Time Spent",
                                        "itemType": "ms",
                                        "granularity": 1,
                                        "key": "duration"
                                    }
                                ]
                            },
                            "numericValue": 2319.7469999999917,
                            "numericUnit": "millisecond"
                        },
                        "bootup-time": {
                            "id": "bootup-time",
                            "title": "JavaScript execution time",
                            "description": "Consider reducing the time spent parsing, compiling, and executing JS. You may find delivering smaller JS payloads helps with this. [Learn more](https://web.dev/bootup-time/).",
                            "score": 0.91,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "1.2 s",
                            "details": {
                                "summary": {
                                    "wastedMs": 1226.039999999997
                                },
                                "headings": [
                                    {
                                        "text": "URL",
                                        "key": "url",
                                        "itemType": "url"
                                    },
                                    {
                                        "granularity": 1,
                                        "key": "total",
                                        "text": "Total CPU Time",
                                        "itemType": "ms"
                                    },
                                    {
                                        "key": "scripting",
                                        "granularity": 1,
                                        "text": "Script Evaluation",
                                        "itemType": "ms"
                                    },
                                    {
                                        "key": "scriptParseCompile",
                                        "granularity": 1,
                                        "itemType": "ms",
                                        "text": "Script Parse"
                                    }
                                ],
                                "items": [
                                    {
                                        "scripting": 58.01799999999998,
                                        "scriptParseCompile": 4.033,
                                        "total": 660.6379999999997,
                                        "url": "https://rapidload.io/"
                                    },
                                    {
                                        "total": 419.10799999999955,
                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                        "scripting": 370.3509999999995,
                                        "scriptParseCompile": 4.987000000000001
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.6.0",
                                        "scriptParseCompile": 1.521,
                                        "scripting": 375.3069999999978,
                                        "total": 405.15199999999777
                                    },
                                    {
                                        "scripting": 18.277999999999995,
                                        "scriptParseCompile": 0,
                                        "total": 217.14500000000018,
                                        "url": "Unattributable"
                                    },
                                    {
                                        "total": 175.4959999999999,
                                        "scriptParseCompile": 17.244999999999997,
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                        "scripting": 154.06399999999988
                                    },
                                    {
                                        "scripting": 61.629000000000005,
                                        "total": 94.28,
                                        "url": "https://script.hotjar.com/preact-incoming-feedback.7662d6fc45aef63728ff.js",
                                        "scriptParseCompile": 6.297999999999999
                                    },
                                    {
                                        "total": 92.232,
                                        "url": "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&co=aHR0cHM6Ly9yYXBpZGxvYWQuaW86NDQz&hl=en&v=Ixi5IiChXmIG6rRkjUa1qXHT&size=invisible&cb=egm7atad82l8",
                                        "scriptParseCompile": 2.318,
                                        "scripting": 77.343
                                    },
                                    {
                                        "url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
                                        "scripting": 69.83799999999997,
                                        "total": 81.82799999999996,
                                        "scriptParseCompile": 4.81
                                    },
                                    {
                                        "scripting": 0,
                                        "scriptParseCompile": 0,
                                        "total": 56.234,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css"
                                    }
                                ],
                                "type": "table"
                            },
                            "numericValue": 1226.039999999997,
                            "numericUnit": "millisecond"
                        },
                        "third-party-summary": {
                            "id": "third-party-summary",
                            "title": "Minimize third-party usage",
                            "description": "Third-party code can significantly impact load performance. Limit the number of redundant third-party providers and try to load third-party code after your page has primarily finished loading. [Learn more](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/).",
                            "score": 1,
                            "scoreDisplayMode": "binary",
                            "displayValue": "Third-party code blocked the main thread for 220 ms",
                            "details": {
                                "type": "table",
                                "headings": [
                                    {
                                        "subItemsHeading": {
                                            "itemType": "url",
                                            "key": "url"
                                        },
                                        "key": "entity",
                                        "itemType": "link",
                                        "text": "Third-Party"
                                    },
                                    {
                                        "granularity": 1,
                                        "itemType": "bytes",
                                        "key": "transferSize",
                                        "subItemsHeading": {
                                            "key": "transferSize"
                                        },
                                        "text": "Transfer Size"
                                    },
                                    {
                                        "granularity": 1,
                                        "subItemsHeading": {
                                            "key": "blockingTime"
                                        },
                                        "itemType": "ms",
                                        "text": "Main-Thread Blocking Time",
                                        "key": "blockingTime"
                                    }
                                ],
                                "items": [
                                    {
                                        "mainThreadTime": 528.1359999999994,
                                        "subItems": {
                                            "items": [
                                                {
                                                    "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                                    "blockingTime": 220.23899999999998,
                                                    "transferSize": 69103,
                                                    "mainThreadTime": 419.10799999999944
                                                },
                                                {
                                                    "mainThreadTime": 94.28,
                                                    "url": "https://script.hotjar.com/preact-incoming-feedback.7662d6fc45aef63728ff.js",
                                                    "blockingTime": 0,
                                                    "transferSize": 34400
                                                },
                                                {
                                                    "url": "Other resources",
                                                    "transferSize": 5557,
                                                    "blockingTime": 0
                                                }
                                            ],
                                            "type": "subitems"
                                        },
                                        "blockingTime": 220.23899999999998,
                                        "transferSize": 109060,
                                        "entity": {
                                            "type": "link",
                                            "text": "Hotjar",
                                            "url": "https://www.hotjar.com/"
                                        }
                                    },
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "transferSize": 326486,
                                                    "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                                    "blockingTime": 0,
                                                    "mainThreadTime": 175.49599999999973
                                                },
                                                {
                                                    "blockingTime": 0,
                                                    "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/styles__ltr.css",
                                                    "transferSize": 25183,
                                                    "mainThreadTime": 1.4420000000000002
                                                }
                                            ]
                                        },
                                        "blockingTime": 0,
                                        "transferSize": 351669,
                                        "entity": {
                                            "type": "link",
                                            "text": "Google CDN",
                                            "url": "https://developers.google.com/speed/libraries/"
                                        },
                                        "mainThreadTime": 176.93799999999973
                                    },
                                    {
                                        "entity": {
                                            "text": "Google Fonts",
                                            "type": "link",
                                            "url": "https://fonts.google.com/"
                                        },
                                        "mainThreadTime": 3.3289999999999997,
                                        "transferSize": 139370,
                                        "blockingTime": 0,
                                        "subItems": {
                                            "items": [
                                                {
                                                    "mainThreadTime": 0,
                                                    "blockingTime": 0,
                                                    "transferSize": 22683,
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc9iB85tU1Q.ttf"
                                                },
                                                {
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8GBs5tU1Q.ttf",
                                                    "blockingTime": 0,
                                                    "mainThreadTime": 0,
                                                    "transferSize": 22677
                                                },
                                                {
                                                    "transferSize": 22436,
                                                    "blockingTime": 0,
                                                    "mainThreadTime": 0,
                                                    "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe0qMImSLYBIv1o4X1M8cce9I94.ttf"
                                                },
                                                {
                                                    "transferSize": 17376,
                                                    "mainThreadTime": 0,
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WC-URzLdnfw.ttf",
                                                    "blockingTime": 0
                                                },
                                                {
                                                    "transferSize": 17318,
                                                    "blockingTime": 0,
                                                    "mainThreadTime": 0,
                                                    "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WCwkWzLdnfw.ttf"
                                                },
                                                {
                                                    "blockingTime": 0,
                                                    "transferSize": 36880,
                                                    "url": "Other resources"
                                                }
                                            ],
                                            "type": "subitems"
                                        }
                                    },
                                    {
                                        "blockingTime": 0,
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "mainThreadTime": 81.82799999999999,
                                                    "transferSize": 78448,
                                                    "url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
                                                    "blockingTime": 0
                                                }
                                            ]
                                        },
                                        "entity": {
                                            "text": "Google Tag Manager",
                                            "url": "https://marketingplatform.google.com/about/tag-manager/",
                                            "type": "link"
                                        },
                                        "transferSize": 78448,
                                        "mainThreadTime": 81.82799999999999
                                    },
                                    {
                                        "entity": {
                                            "text": "Other Google APIs/SDKs",
                                            "url": "https://developers.google.com/apis-explorer/#p/",
                                            "type": "link"
                                        },
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "blockingTime": 0,
                                                    "mainThreadTime": 92.23200000000003,
                                                    "url": "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&co=aHR0cHM6Ly9yYXBpZGxvYWQuaW86NDQz&hl=en&v=Ixi5IiChXmIG6rRkjUa1qXHT&size=invisible&cb=egm7atad82l8",
                                                    "transferSize": 22848
                                                }
                                            ]
                                        },
                                        "mainThreadTime": 94.15900000000003,
                                        "blockingTime": 0,
                                        "transferSize": 24859
                                    },
                                    {
                                        "blockingTime": 0,
                                        "transferSize": 7903,
                                        "mainThreadTime": 4.015,
                                        "subItems": {
                                            "items": [
                                                {
                                                    "blockingTime": 0,
                                                    "transferSize": 7903,
                                                    "mainThreadTime": 4.015,
                                                    "url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=5.9.3"
                                                }
                                            ],
                                            "type": "subitems"
                                        },
                                        "entity": {
                                            "type": "link",
                                            "url": "https://www.bootstrapcdn.com/",
                                            "text": "Bootstrap CDN"
                                        }
                                    },
                                    {
                                        "transferSize": 0,
                                        "entity": {
                                            "type": "link",
                                            "text": "Google Analytics",
                                            "url": "https://marketingplatform.google.com/about/analytics/"
                                        },
                                        "blockingTime": 0,
                                        "mainThreadTime": 0,
                                        "subItems": {
                                            "items": [],
                                            "type": "subitems"
                                        }
                                    },
                                    {
                                        "transferSize": 0,
                                        "entity": {
                                            "text": "Google/Doubleclick Ads",
                                            "url": "https://marketingplatform.google.com/about/enterprise/",
                                            "type": "link"
                                        },
                                        "blockingTime": 0,
                                        "subItems": {
                                            "items": [],
                                            "type": "subitems"
                                        },
                                        "mainThreadTime": 0
                                    }
                                ],
                                "summary": {
                                    "wastedBytes": 711309,
                                    "wastedMs": 220.23899999999998
                                }
                            }
                        },
                        "interactive": {
                            "id": "interactive",
                            "title": "Time to Interactive",
                            "description": "Time to interactive is the amount of time it takes for the page to become fully interactive. [Learn more](https://web.dev/interactive/).",
                            "score": 0.8,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "3.0 s",
                            "numericValue": 3004,
                            "numericUnit": "millisecond"
                        },
                        "screenshot-thumbnails": {
                            "id": "screenshot-thumbnails",
                            "title": "Screenshot Thumbnails",
                            "description": "This is what the load of your site looked like.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "scale": 4377,
                                "items": [
                                    {
                                        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAFMAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z",
                                        "timing": 438,
                                        "timestamp": 390338729266.99994
                                    },
                                    {
                                        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAFMAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z",
                                        "timestamp": 390339166966.99994,
                                        "timing": 875
                                    },
                                    {
                                        "timestamp": 390339604667,
                                        "timing": 1313,
                                        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAFMAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z"
                                    },
                                    {
                                        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAFMAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z",
                                        "timestamp": 390340042367,
                                        "timing": 1751
                                    },
                                    {
                                        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRQBAwQEBQQFCQUFCRQNCw0UFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAFMAeAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP1ToAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD//Z",
                                        "timing": 2189,
                                        "timestamp": 390340480067
                                    },
                                    {
                                        "timestamp": 390340917766.99994,
                                        "data": "data:image/jpeg;base64,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",
                                        "timing": 2626
                                    },
                                    {
                                        "data": "data:image/jpeg;base64,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",
                                        "timing": 3064,
                                        "timestamp": 390341355466.99994
                                    },
                                    {
                                        "timing": 3502,
                                        "timestamp": 390341793167,
                                        "data": "data:image/jpeg;base64,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"
                                    },
                                    {
                                        "timing": 3939,
                                        "data": "data:image/jpeg;base64,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",
                                        "timestamp": 390342230867
                                    },
                                    {
                                        "data": "data:image/jpeg;base64,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",
                                        "timestamp": 390342668567,
                                        "timing": 4377
                                    }
                                ],
                                "type": "filmstrip"
                            }
                        },
                        "no-document-write": {
                            "id": "no-document-write",
                            "title": "Avoids `document.write()`",
                            "description": "For users on slow connections, external scripts dynamically injected via `document.write()` can delay page load by tens of seconds. [Learn more](https://web.dev/no-document-write/).",
                            "score": 1,
                            "scoreDisplayMode": "binary",
                            "details": {
                                "items": [],
                                "headings": [],
                                "type": "table"
                            }
                        },
                        "first-meaningful-paint": {
                            "id": "first-meaningful-paint",
                            "title": "First Meaningful Paint",
                            "description": "First Meaningful Paint measures when the primary content of a page is visible. [Learn more](https://web.dev/first-meaningful-paint/).",
                            "score": 0.97,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "0.7 s",
                            "numericValue": 700,
                            "numericUnit": "millisecond"
                        },
                        "network-server-latency": {
                            "id": "network-server-latency",
                            "title": "Server Backend Latencies",
                            "description": "Server latencies can impact web performance. If the server latency of an origin is high, it's an indication the server is overloaded or has poor backend performance. [Learn more](https://hpbn.co/primer-on-web-performance/#analyzing-the-resource-waterfall).",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "0 ms",
                            "details": {
                                "headings": [],
                                "type": "table",
                                "items": []
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "server-response-time": {
                            "id": "server-response-time",
                            "title": "Reduce initial server response time",
                            "description": "Keep the server response time for the main document short because all other requests depend on it. [Learn more](https://web.dev/time-to-first-byte/).",
                            "score": 0,
                            "scoreDisplayMode": "binary",
                            "displayValue": "Root document took 1,310 ms",
                            "details": {
                                "headings": [
                                    {
                                        "valueType": "url",
                                        "key": "url",
                                        "label": "URL"
                                    },
                                    {
                                        "key": "responseTime",
                                        "label": "Time Spent",
                                        "valueType": "timespanMs"
                                    }
                                ],
                                "overallSavingsMs": 1206.49,
                                "items": [
                                    {
                                        "responseTime": 1306.49,
                                        "url": "https://rapidload.io/"
                                    }
                                ],
                                "type": "opportunity"
                            },
                            "numericValue": 1306.49,
                            "numericUnit": "millisecond"
                        },
                        "largest-contentful-paint-element": {
                            "id": "largest-contentful-paint-element",
                            "title": "Largest Contentful Paint element",
                            "description": "This is the largest contentful element painted within the viewport. [Learn More](https://web.dev/lighthouse-largest-contentful-paint/)",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "1 element found",
                            "details": {
                                "type": "table",
                                "headings": [
                                    {
                                        "text": "Element",
                                        "itemType": "node",
                                        "key": "node"
                                    }
                                ],
                                "items": [
                                    {
                                        "node": {
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "snippet": "<img width=\"504\" height=\"722\" src=\"https://rapidload.io/wp-content/uploads/2022/08/image-land.svg\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\">",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "type": "node",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "boundingRect": {
                                                "right": 1235,
                                                "width": 430,
                                                "left": 805,
                                                "bottom": 727,
                                                "height": 616,
                                                "top": 111
                                            },
                                            "lhId": "page-1-IMG"
                                        }
                                    }
                                ]
                            }
                        },
                        "timing-budget": {
                            "id": "timing-budget",
                            "title": "Timing budget",
                            "description": "Set a timing budget to help you keep an eye on the performance of your site. Performant sites load fast and respond to user input events quickly. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/budgets).",
                            "score": null,
                            "scoreDisplayMode": "notApplicable"
                        },
                        "network-requests": {
                            "id": "network-requests",
                            "title": "Network Requests",
                            "description": "Lists the network requests that were made during page load.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "headings": [
                                    {
                                        "itemType": "url",
                                        "text": "URL",
                                        "key": "url"
                                    },
                                    {
                                        "text": "Protocol",
                                        "itemType": "text",
                                        "key": "protocol"
                                    },
                                    {
                                        "granularity": 1,
                                        "itemType": "ms",
                                        "key": "startTime",
                                        "text": "Start Time"
                                    },
                                    {
                                        "granularity": 1,
                                        "key": "endTime",
                                        "text": "End Time",
                                        "itemType": "ms"
                                    },
                                    {
                                        "itemType": "bytes",
                                        "displayUnit": "kb",
                                        "granularity": 1,
                                        "text": "Transfer Size",
                                        "key": "transferSize"
                                    },
                                    {
                                        "key": "resourceSize",
                                        "itemType": "bytes",
                                        "displayUnit": "kb",
                                        "text": "Resource Size",
                                        "granularity": 1
                                    },
                                    {
                                        "text": "Status Code",
                                        "key": "statusCode",
                                        "itemType": "text"
                                    },
                                    {
                                        "itemType": "text",
                                        "text": "MIME Type",
                                        "key": "mimeType"
                                    },
                                    {
                                        "text": "Resource Type",
                                        "key": "resourceType",
                                        "itemType": "text"
                                    }
                                ],
                                "type": "table",
                                "items": [
                                    {
                                        "url": "https://rapidload.io/",
                                        "startTime": 0,
                                        "resourceType": "Document",
                                        "protocol": "h2",
                                        "experimentalFromMainFrame": true,
                                        "endTime": 1305.4959999863058,
                                        "transferSize": 47944,
                                        "mimeType": "text/html",
                                        "resourceSize": 390268,
                                        "statusCode": 200,
                                        "finished": true
                                    },
                                    {
                                        "endTime": 1401.36999997776,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 1319.8190000257455,
                                        "resourceSize": 78196,
                                        "isLinkPreload": true,
                                        "mimeType": "application/font-woff2",
                                        "transferSize": 79277,
                                        "protocol": "h2",
                                        "finished": true,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2",
                                        "statusCode": 200,
                                        "resourceType": "Font"
                                    },
                                    {
                                        "resourceType": "Font",
                                        "mimeType": "application/font-woff2",
                                        "resourceSize": 76764,
                                        "endTime": 1409.611999988556,
                                        "transferSize": 77841,
                                        "isLinkPreload": true,
                                        "finished": true,
                                        "protocol": "h2",
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff2",
                                        "startTime": 1319.9889999814332,
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200
                                    },
                                    {
                                        "startTime": 1320.344000007026,
                                        "statusCode": 200,
                                        "resourceType": "Script",
                                        "transferSize": 33032,
                                        "endTime": 1383.8700000196695,
                                        "protocol": "h2",
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-includes/js/jquery/jquery.min.js?ver=3.6.0",
                                        "resourceSize": 89521
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "endTime": 1356.662000005599,
                                        "transferSize": 5357,
                                        "resourceSize": 11224,
                                        "url": "https://rapidload.io/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2",
                                        "finished": true,
                                        "resourceType": "Script",
                                        "statusCode": 200,
                                        "startTime": 1320.7280000206083,
                                        "protocol": "h2",
                                        "mimeType": "application/javascript"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/script.js?ver=1629785566",
                                        "mimeType": "application/javascript",
                                        "finished": true,
                                        "endTime": 2241.0539999837056,
                                        "resourceType": "Script",
                                        "startTime": 1321.0170000093058,
                                        "protocol": "h2",
                                        "transferSize": 1902,
                                        "resourceSize": 2297,
                                        "statusCode": 200,
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/uucss-stripe-gateway/assets/js/script.js?v=1849731375&ver=5.9.3",
                                        "startTime": 1321.5729999938048,
                                        "transferSize": 4782,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "statusCode": 200,
                                        "endTime": 1352.3980000172742,
                                        "resourceSize": 18069,
                                        "resourceType": "Script"
                                    },
                                    {
                                        "endTime": 1336.974999983795,
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "text/javascript",
                                        "resourceSize": 884,
                                        "transferSize": 1179,
                                        "protocol": "h2",
                                        "url": "https://www.google.com/recaptcha/api.js?render=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&ver=5.9.3",
                                        "startTime": 1321.7389999772422,
                                        "resourceType": "Script"
                                    },
                                    {
                                        "startTime": 2267.489999998361,
                                        "url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
                                        "statusCode": 200,
                                        "mimeType": "application/javascript",
                                        "transferSize": 78448,
                                        "protocol": "h2",
                                        "endTime": 2301.7409999738447,
                                        "resourceSize": 226239,
                                        "resourceType": "Script",
                                        "experimentalFromMainFrame": true,
                                        "finished": true
                                    },
                                    {
                                        "finished": true,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-19.png",
                                        "endTime": 3179.562999983318,
                                        "startTime": 2267.708000028506,
                                        "resourceType": "Image",
                                        "resourceSize": 8669,
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "image/png",
                                        "transferSize": 9723
                                    },
                                    {
                                        "resourceType": "Image",
                                        "finished": true,
                                        "startTime": 2269.293999997899,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/07/Group-25.svg",
                                        "mimeType": "image/svg+xml",
                                        "protocol": "h2",
                                        "transferSize": 3070,
                                        "resourceSize": 6291,
                                        "endTime": 2332.005999982357,
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200
                                    },
                                    {
                                        "resourceSize": 9417,
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "mimeType": "image/png",
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "resourceType": "Image",
                                        "endTime": 2335.2109999977984,
                                        "startTime": 2269.4960000226274,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-20.png",
                                        "transferSize": 10489
                                    },
                                    {
                                        "resourceSize": 19908,
                                        "protocol": "h2",
                                        "finished": true,
                                        "startTime": 2270.6730000209063,
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Image",
                                        "endTime": 2307.310000003781,
                                        "transferSize": 20975,
                                        "statusCode": 200,
                                        "mimeType": "image/png",
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-21.png"
                                    },
                                    {
                                        "statusCode": 200,
                                        "mimeType": "image/png",
                                        "endTime": 3372.4609999917448,
                                        "resourceType": "Image",
                                        "protocol": "h2",
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Geoferry-Gussis.png",
                                        "startTime": 2270.894000015687,
                                        "resourceSize": 57026,
                                        "experimentalFromMainFrame": true,
                                        "transferSize": 58083,
                                        "finished": true
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "resourceSize": 6256,
                                        "protocol": "h2",
                                        "finished": true,
                                        "statusCode": 200,
                                        "startTime": 2271.0380000062287,
                                        "resourceType": "Image",
                                        "mimeType": "image/svg+xml",
                                        "url": "https://rapidload.io/wp-content/uploads/2022/07/Group-33.svg",
                                        "transferSize": 3631,
                                        "endTime": 2974.7470000293106
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/09/new-logo.svg",
                                        "mimeType": "image/svg+xml",
                                        "statusCode": 200,
                                        "finished": true,
                                        "endTime": 2338.119000021834,
                                        "protocol": "h2",
                                        "transferSize": 6265,
                                        "resourceType": "Image",
                                        "resourceSize": 14211,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2271.2630000314675
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/activecampaign-subscription-forms/site_tracking.js?ver=5.9.3",
                                        "protocol": "h2",
                                        "transferSize": 1641,
                                        "finished": true,
                                        "resourceSize": 1403,
                                        "startTime": 1411.5299999830313,
                                        "resourceType": "Script",
                                        "statusCode": 200,
                                        "endTime": 2332.475000002887,
                                        "mimeType": "application/javascript",
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "startTime": 2246.829000010621,
                                        "transferSize": 4535,
                                        "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/jquery-blockui/jquery.blockUI.min.js?ver=2.7.0-wc.7.0.0",
                                        "mimeType": "application/javascript",
                                        "finished": true,
                                        "resourceType": "Script",
                                        "endTime": 2282.1230000117794,
                                        "resourceSize": 9509,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "statusCode": 200
                                    },
                                    {
                                        "finished": true,
                                        "transferSize": 2138,
                                        "resourceSize": 3037,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/add-to-cart.min.js?ver=7.0.0",
                                        "protocol": "h2",
                                        "resourceType": "Script",
                                        "startTime": 2257.0229999837466,
                                        "statusCode": 200,
                                        "endTime": 2337.5339999911375,
                                        "mimeType": "application/javascript"
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200,
                                        "startTime": 2257.454000005964,
                                        "resourceSize": 1834,
                                        "transferSize": 2030,
                                        "mimeType": "application/javascript",
                                        "resourceType": "Script",
                                        "finished": true,
                                        "endTime": 2952.4700000183657,
                                        "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/js-cookie/js.cookie.min.js?ver=2.1.4-wc.7.0.0",
                                        "protocol": "h2"
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/woocommerce.min.js?ver=7.0.0",
                                        "mimeType": "application/javascript",
                                        "resourceSize": 2139,
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "transferSize": 1815,
                                        "startTime": 2257.662000018172,
                                        "endTime": 2295.3350000316277,
                                        "finished": true,
                                        "resourceType": "Script"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/woocommerce/assets/js/frontend/cart-fragments.min.js?ver=7.0.0",
                                        "statusCode": 200,
                                        "finished": true,
                                        "resourceType": "Script",
                                        "protocol": "h2",
                                        "transferSize": 2094,
                                        "endTime": 2349.4470000150613,
                                        "startTime": 2258.1260000006296,
                                        "resourceSize": 2938,
                                        "mimeType": "application/javascript",
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "endTime": 2333.0219999770634,
                                        "protocol": "h2",
                                        "transferSize": 9169,
                                        "finished": true,
                                        "statusCode": 200,
                                        "resourceType": "Script",
                                        "resourceSize": 43112,
                                        "startTime": 2258.336999977473,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/new-landing.js?ver=260756428",
                                        "mimeType": "application/javascript"
                                    },
                                    {
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "resourceSize": 8077,
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/js/landing-hover-tab.js?ver=2103974324",
                                        "endTime": 2304.638999979943,
                                        "transferSize": 1702,
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "finished": true,
                                        "startTime": 2259.2270000022836
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "resourceType": "Script",
                                        "transferSize": 8586,
                                        "endTime": 2303.6640000063926,
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.0.1",
                                        "resourceSize": 25202,
                                        "startTime": 2259.8570000263862,
                                        "statusCode": 200
                                    },
                                    {
                                        "protocol": "h2",
                                        "resourceSize": 1492,
                                        "resourceType": "Script",
                                        "statusCode": 200,
                                        "transferSize": 1809,
                                        "mimeType": "application/javascript",
                                        "url": "https://rapidload.io/wp-includes/js/wp-embed.min.js?ver=5.9.3",
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2334.6550000132993,
                                        "startTime": 2260.0519999978133
                                    },
                                    {
                                        "endTime": 3171.3459999882616,
                                        "startTime": 2260.5949999997392,
                                        "url": "https://rapidload.io/wp-includes/js/imagesloaded.min.js?ver=4.1.4",
                                        "experimentalFromMainFrame": true,
                                        "transferSize": 2913,
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "resourceType": "Script",
                                        "resourceSize": 5629,
                                        "protocol": "h2"
                                    },
                                    {
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "transferSize": 3403,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2260.81200002227,
                                        "resourceSize": 5184,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=3.7.3",
                                        "endTime": 2337.0770000037737,
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "finished": true
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.8.0",
                                        "transferSize": 3252,
                                        "resourceType": "Script",
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "endTime": 2334.173000010196,
                                        "resourceSize": 4957,
                                        "startTime": 2262.3250000178814,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2"
                                    },
                                    {
                                        "protocol": "h2",
                                        "endTime": 2348.031000001356,
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200,
                                        "transferSize": 12173,
                                        "startTime": 2263.2250000024214,
                                        "resourceType": "Script",
                                        "finished": true,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.8.0",
                                        "mimeType": "application/javascript",
                                        "resourceSize": 32947
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-includes/js/dist/vendor/regenerator-runtime.min.js?ver=0.13.9",
                                        "finished": true,
                                        "endTime": 2307.896999991499,
                                        "resourceSize": 6494,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "resourceType": "Script",
                                        "transferSize": 3534,
                                        "statusCode": 200,
                                        "mimeType": "application/javascript",
                                        "startTime": 2263.386000005994
                                    },
                                    {
                                        "statusCode": 200,
                                        "transferSize": 8268,
                                        "resourceSize": 19261,
                                        "endTime": 3188.0070000188425,
                                        "resourceType": "Script",
                                        "protocol": "h2",
                                        "startTime": 2263.611000031233,
                                        "url": "https://rapidload.io/wp-includes/js/dist/vendor/wp-polyfill.min.js?ver=3.15.0",
                                        "mimeType": "application/javascript",
                                        "finished": true,
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "transferSize": 2955,
                                        "statusCode": 200,
                                        "startTime": 2264.3999999854714,
                                        "resourceType": "Script",
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-includes/js/dist/hooks.min.js?ver=1e58c8c5a32b2e97491080c5b10dc71c",
                                        "protocol": "h2",
                                        "endTime": 2948.7470000167377,
                                        "resourceSize": 5690
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "transferSize": 5079,
                                        "statusCode": 200,
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "url": "https://rapidload.io/wp-includes/js/dist/i18n.min.js?ver=30fcecb428a0e8383d3776bcdd3a7834",
                                        "endTime": 2309.6849999856204,
                                        "startTime": 2264.57300002221,
                                        "resourceSize": 10407,
                                        "protocol": "h2"
                                    },
                                    {
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "startTime": 2265.116000024136,
                                        "endTime": 2331.2949999817647,
                                        "finished": true,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=3.7.3",
                                        "resourceSize": 21417,
                                        "statusCode": 200,
                                        "transferSize": 7011,
                                        "protocol": "h2",
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js?ver=4.0.2",
                                        "transferSize": 4241,
                                        "mimeType": "application/javascript",
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "startTime": 2265.285000030417,
                                        "finished": true,
                                        "resourceSize": 12198,
                                        "resourceType": "Script",
                                        "endTime": 2305.9570000041276,
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "protocol": "h2",
                                        "finished": true,
                                        "endTime": 2308.521000028122,
                                        "url": "https://rapidload.io/wp-includes/js/jquery/ui/core.min.js?ver=1.13.1",
                                        "startTime": 2265.4360000160523,
                                        "resourceSize": 20714,
                                        "statusCode": 200,
                                        "transferSize": 8105,
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "resourceType": "Script",
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js?ver=5.3.6",
                                        "resourceSize": 139153,
                                        "transferSize": 37486,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "application/javascript",
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "endTime": 2321.2059999932535,
                                        "finished": true,
                                        "startTime": 2265.620000020135
                                    },
                                    {
                                        "finished": true,
                                        "protocol": "h2",
                                        "resourceSize": 2620,
                                        "statusCode": 200,
                                        "endTime": 2338.593000022229,
                                        "resourceType": "Script",
                                        "transferSize": 2208,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js?ver=3.8.0",
                                        "startTime": 2265.7730000209995,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "application/javascript"
                                    },
                                    {
                                        "resourceType": "Script",
                                        "finished": true,
                                        "startTime": 2265.988999977708,
                                        "statusCode": 200,
                                        "resourceSize": 10682,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2305.2219999954104,
                                        "transferSize": 4590,
                                        "mimeType": "application/javascript",
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js?ver=4.9.0",
                                        "protocol": "h2"
                                    },
                                    {
                                        "startTime": 2266.386999981478,
                                        "transferSize": 13624,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.8.0",
                                        "endTime": 2335.698999988381,
                                        "resourceSize": 40513,
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Script",
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "application/javascript",
                                        "protocol": "h2"
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "endTime": 2329.503000015393,
                                        "statusCode": 200,
                                        "resourceSize": 134630,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js?ver=3.7.3",
                                        "resourceType": "Script",
                                        "protocol": "h2",
                                        "startTime": 2266.691999975592,
                                        "transferSize": 33380,
                                        "mimeType": "application/javascript"
                                    },
                                    {
                                        "finished": true,
                                        "resourceSize": 43140,
                                        "endTime": 3148.693999974057,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/js/preloaded-modules.min.js?ver=3.8.0",
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "startTime": 2266.9280000263825,
                                        "transferSize": 14350,
                                        "mimeType": "application/javascript",
                                        "resourceType": "Script"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js?ver=3.7.3",
                                        "endTime": 2311.693000025116,
                                        "finished": true,
                                        "startTime": 2267.2979999915697,
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Script",
                                        "mimeType": "application/javascript",
                                        "resourceSize": 3704,
                                        "transferSize": 2647
                                    },
                                    {
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "text/css",
                                        "protocol": "h2",
                                        "resourceType": "Stylesheet",
                                        "transferSize": 2604,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2272.3600000026636,
                                        "url": "https://fonts.googleapis.com/css?family=Nunito+Sans%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CNunito%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CLexend%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&display=swap",
                                        "resourceSize": 61671,
                                        "endTime": 2292.817000008654
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css",
                                        "finished": true,
                                        "resourceSize": 1193938,
                                        "statusCode": 200,
                                        "resourceType": "Stylesheet",
                                        "protocol": "h2",
                                        "startTime": 2272.5220000138506,
                                        "endTime": 2395.524999999907,
                                        "transferSize": 139685,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "text/css"
                                    },
                                    {
                                        "mimeType": "text/css",
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Stylesheet",
                                        "protocol": "h2",
                                        "transferSize": 2202,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_541e2ced151704f4ff1844c6de47ec02.css",
                                        "statusCode": 200,
                                        "resourceSize": 7021,
                                        "endTime": 2311.0430000233464,
                                        "startTime": 2272.681000002194
                                    },
                                    {
                                        "statusCode": 200,
                                        "resourceSize": 31000,
                                        "startTime": 2272.8440000209957,
                                        "mimeType": "text/css",
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2297.885000007227,
                                        "transferSize": 7903,
                                        "resourceType": "Stylesheet",
                                        "protocol": "h2",
                                        "url": "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css?ver=5.9.3"
                                    },
                                    {
                                        "startTime": 2273.137999989558,
                                        "finished": true,
                                        "endTime": 2330.8470000047237,
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Stylesheet",
                                        "statusCode": 200,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_99982b3f40a1aefdb4305b95a2e9c4ae.css?ver=1667209724",
                                        "transferSize": 1549,
                                        "mimeType": "text/css",
                                        "resourceSize": 1542,
                                        "protocol": "h2"
                                    },
                                    {
                                        "finished": true,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_4fca2c0532ae42ef172a4291beb5ad09.css?ver=1667209725",
                                        "statusCode": 200,
                                        "resourceSize": 61203,
                                        "protocol": "h2",
                                        "mimeType": "text/css",
                                        "endTime": 2319.9640000239015,
                                        "transferSize": 5034,
                                        "startTime": 2273.3160000061616,
                                        "resourceType": "Stylesheet",
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2273.4369999961928,
                                        "mimeType": "text/css",
                                        "transferSize": 12183,
                                        "resourceType": "Stylesheet",
                                        "resourceSize": 130736,
                                        "endTime": 2312.6850000116974,
                                        "finished": true,
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_495ea6537bdc403c483dd2f0187127c5.css?ver=1667209725"
                                    },
                                    {
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "resourceSize": 7883,
                                        "finished": true,
                                        "resourceType": "Stylesheet",
                                        "mimeType": "text/css",
                                        "startTime": 2273.589999997057,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_e7615362d5cac2766a581d03b950ccab.css?ver=1667209726",
                                        "transferSize": 2107,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2310.246000008192
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "resourceSize": 14587,
                                        "finished": true,
                                        "startTime": 2273.754000023473,
                                        "protocol": "h2",
                                        "endTime": 2350.012000009883,
                                        "statusCode": 200,
                                        "transferSize": 2773,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_27fb58316ef7f82601b4ff3a7f7409d9.css?ver=1667209726",
                                        "mimeType": "text/css",
                                        "resourceType": "Stylesheet"
                                    },
                                    {
                                        "mimeType": "text/css",
                                        "endTime": 2961.57200000016,
                                        "resourceType": "Stylesheet",
                                        "statusCode": 200,
                                        "finished": true,
                                        "protocol": "h2",
                                        "startTime": 2273.9760000258684,
                                        "resourceSize": 6621,
                                        "transferSize": 2239,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_ca69de2d85580f908a4b28c0597a9752.css?ver=1667209726"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_cbc7eeb1590a5f8fbc0187d22f93a5ae.css?ver=1667209726",
                                        "transferSize": 2116,
                                        "resourceSize": 5816,
                                        "finished": true,
                                        "endTime": 2310.578999982681,
                                        "statusCode": 200,
                                        "resourceType": "Stylesheet",
                                        "mimeType": "text/css",
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "startTime": 2274.154999991879
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_a5bb7c09b78178004885de219f0ccb36.css?ver=1667209726",
                                        "transferSize": 1923,
                                        "statusCode": 200,
                                        "resourceSize": 3856,
                                        "mimeType": "text/css",
                                        "protocol": "h2",
                                        "endTime": 2309.076000005007,
                                        "resourceType": "Stylesheet",
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2274.6879999758676
                                    },
                                    {
                                        "finished": true,
                                        "resourceType": "Stylesheet",
                                        "resourceSize": 13239,
                                        "startTime": 2274.8460000148043,
                                        "mimeType": "text/css",
                                        "statusCode": 200,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_659f358281c454e23b8550ee83fd6008.css?ver=1667209726",
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2348.888000007719,
                                        "protocol": "h2",
                                        "transferSize": 3464
                                    },
                                    {
                                        "mimeType": "text/javascript",
                                        "transferSize": 163243,
                                        "endTime": 2286.813999991864,
                                        "resourceType": "Script",
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                        "statusCode": 200,
                                        "finished": true,
                                        "startTime": 2271.8410000088625,
                                        "resourceSize": 406989,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2"
                                    },
                                    {
                                        "resourceSize": 5708,
                                        "experimentalFromMainFrame": true,
                                        "transferSize": 3122,
                                        "mimeType": "application/javascript",
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "startTime": 2272.02999999281,
                                        "endTime": 2527.192000008654,
                                        "resourceType": "Script",
                                        "url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
                                        "finished": true
                                    },
                                    {
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "text/javascript",
                                        "url": "https://grow.clearbitjs.com/api/pixel.js?v=1667889173572",
                                        "endTime": 2517.409000021871,
                                        "resourceSize": 1595,
                                        "protocol": "h2",
                                        "resourceType": "Script",
                                        "startTime": 2272.1780000138097,
                                        "statusCode": 200,
                                        "transferSize": 1102
                                    },
                                    {
                                        "resourceSize": 26944,
                                        "transferSize": 16964,
                                        "startTime": 2284.107999992557,
                                        "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WCzsWzLdnfw.ttf",
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200,
                                        "finished": true,
                                        "mimeType": "font/ttf",
                                        "resourceType": "Font",
                                        "protocol": "h2",
                                        "endTime": 2289.4969999906607
                                    },
                                    {
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "startTime": 2293.805000022985,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe0qMImSLYBIv1o4X1M8cce9I94.ttf",
                                        "finished": true,
                                        "transferSize": 22436,
                                        "resourceSize": 39652,
                                        "endTime": 2300.312999985181,
                                        "resourceType": "Font",
                                        "mimeType": "font/ttf"
                                    },
                                    {
                                        "mimeType": "image/svg+xml",
                                        "resourceSize": 14245,
                                        "protocol": "h2",
                                        "resourceType": "Image",
                                        "endTime": 3163.0049999803305,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/07/Rapidload.svg",
                                        "finished": true,
                                        "startTime": 2297.668999992311,
                                        "transferSize": 6297,
                                        "statusCode": 200
                                    },
                                    {
                                        "resourceSize": 26940,
                                        "protocol": "h2",
                                        "experimentalFromMainFrame": true,
                                        "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WC9wRzLdnfw.ttf",
                                        "statusCode": 200,
                                        "mimeType": "font/ttf",
                                        "transferSize": 17312,
                                        "resourceType": "Font",
                                        "endTime": 2322.0169999985956,
                                        "finished": true,
                                        "startTime": 2313.556000008248
                                    },
                                    {
                                        "endTime": 2412.7929999958724,
                                        "finished": true,
                                        "transferSize": 17318,
                                        "protocol": "h2",
                                        "resourceType": "Font",
                                        "startTime": 2407.412000000477,
                                        "mimeType": "font/ttf",
                                        "resourceSize": 26992,
                                        "statusCode": 200,
                                        "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WCwkWzLdnfw.ttf",
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-land.svg",
                                        "resourceType": "Image",
                                        "endTime": 3921.1689999792725,
                                        "resourceSize": 481857,
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "finished": true,
                                        "transferSize": 343820,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2425.3349999780767,
                                        "mimeType": "image/svg+xml"
                                    },
                                    {
                                        "protocol": "h2",
                                        "resourceSize": 698,
                                        "transferSize": 1466,
                                        "mimeType": "image/svg+xml",
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/curve-arrow.svg",
                                        "finished": true,
                                        "startTime": 2426.0249999933876,
                                        "resourceType": "Image",
                                        "experimentalFromMainFrame": true,
                                        "statusCode": 200,
                                        "endTime": 2451.785999990534
                                    },
                                    {
                                        "startTime": 2502.924999978859,
                                        "resourceType": "Font",
                                        "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc9iB85tU1Q.ttf",
                                        "mimeType": "font/ttf",
                                        "protocol": "h2",
                                        "endTime": 2512.395000027027,
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "resourceSize": 40096,
                                        "transferSize": 22683,
                                        "statusCode": 200
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "url": "https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8GBs5tU1Q.ttf",
                                        "endTime": 2510.5600000242703,
                                        "statusCode": 200,
                                        "finished": true,
                                        "resourceType": "Font",
                                        "resourceSize": 40828,
                                        "transferSize": 22677,
                                        "mimeType": "font/ttf",
                                        "protocol": "h2",
                                        "startTime": 2503.346999990754
                                    },
                                    {
                                        "statusCode": 200,
                                        "url": "https://fonts.gstatic.com/s/lexend/v17/wlptgwvFAVdoq2_F94zlCfv0bz1WC-URzLdnfw.ttf",
                                        "protocol": "h2",
                                        "transferSize": 17376,
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 2511.899999983143,
                                        "resourceType": "Font",
                                        "resourceSize": 27016,
                                        "startTime": 2504.7839999897406,
                                        "mimeType": "font/ttf"
                                    },
                                    {
                                        "transferSize": 18377,
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "image/png",
                                        "startTime": 2555.454000015743,
                                        "resourceType": "Image",
                                        "resourceSize": 17306,
                                        "protocol": "h2",
                                        "endTime": 2586.8679999839514,
                                        "statusCode": 200,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png",
                                        "transferSize": 28535,
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "resourceSize": 27480,
                                        "experimentalFromMainFrame": true,
                                        "mimeType": "image/png",
                                        "resourceType": "Image",
                                        "startTime": 2555.6670000078157,
                                        "endTime": 3433.0360000021756,
                                        "finished": true
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png",
                                        "resourceType": "Image",
                                        "finished": true,
                                        "transferSize": 14960,
                                        "statusCode": 200,
                                        "mimeType": "image/png",
                                        "endTime": 2582.3640000307932,
                                        "protocol": "h2",
                                        "resourceSize": 13887,
                                        "experimentalFromMainFrame": true,
                                        "startTime": 2556.103000009898
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png",
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "endTime": 3422.786000010092,
                                        "resourceSize": 19752,
                                        "startTime": 2556.488000031095,
                                        "transferSize": 20805,
                                        "mimeType": "image/png",
                                        "finished": true,
                                        "resourceType": "Image",
                                        "statusCode": 200
                                    },
                                    {
                                        "resourceType": "Image",
                                        "startTime": 2556.7259999806993,
                                        "mimeType": "image/svg+xml",
                                        "statusCode": 200,
                                        "resourceSize": 273293,
                                        "transferSize": 202971,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/10/exit-intent.svg",
                                        "endTime": 2593.970999994781,
                                        "protocol": "h2",
                                        "finished": true,
                                        "experimentalFromMainFrame": true
                                    },
                                    {
                                        "mimeType": "image/png",
                                        "protocol": "h2",
                                        "startTime": 2557.068000023719,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/popup-image.png",
                                        "finished": true,
                                        "resourceType": "Image",
                                        "transferSize": 17829,
                                        "endTime": 2587.6249999855645,
                                        "statusCode": 200,
                                        "resourceSize": 16752
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/placeholder-image-300x203.jpeg",
                                        "statusCode": 200,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "transferSize": 15475,
                                        "resourceType": "Image",
                                        "endTime": 2588.105999981053,
                                        "finished": true,
                                        "resourceSize": 14410,
                                        "startTime": 2557.34499997925,
                                        "mimeType": "image/jpeg"
                                    },
                                    {
                                        "resourceType": "Ping",
                                        "statusCode": -1,
                                        "startTime": 2767.930999980308,
                                        "endTime": 2979.44299998926,
                                        "transferSize": 0,
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "url": "https://analytics.google.com/g/collect?v=2&tid=G-4ZTDF2L9YB&gtm=2oeb20&_p=578659300&_gaz=1&cid=1018805134.1667889174&ul=en-us&sr=800x600&uaa=x86&uab=&uafvl=&uamb=0&uam=&uap=macOS&uapv=10.15.7&uaw=0&_s=1&sid=1667889174&sct=1&seg=0&dl=https%3A%2F%2Frapidload.io%2F&dt=Automated%20Unused%20CSS%20Removal%20(Up%20to%2095%25)%20-%20RapidLoad&en=page_view&_fv=1&_nsi=1&_ss=1&_ee=1",
                                        "resourceSize": 0
                                    },
                                    {
                                        "url": "https://stats.g.doubleclick.net/g/collect?v=2&tid=G-4ZTDF2L9YB&cid=1018805134.1667889174&gtm=2oeb20&aip=1",
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "endTime": 2979.7530000214465,
                                        "startTime": 2768.8300000154413,
                                        "transferSize": 0,
                                        "resourceType": "Ping",
                                        "resourceSize": 0,
                                        "statusCode": -1
                                    },
                                    {
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "transferSize": 361,
                                        "resourceType": "Image",
                                        "protocol": "h2",
                                        "endTime": 3285.4759999900125,
                                        "startTime": 2988.8129999744706,
                                        "url": "https://grow.clearbitjs.com/api/c.gif?r=https%3A%2F%2Frapidload.io%2F&c=direct",
                                        "resourceSize": 35,
                                        "statusCode": 200,
                                        "mimeType": "image/gif"
                                    },
                                    {
                                        "startTime": 2993.2580000022426,
                                        "statusCode": 200,
                                        "endTime": 3005.2799999830313,
                                        "mimeType": "application/javascript",
                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                        "resourceType": "Script",
                                        "protocol": "h2",
                                        "transferSize": 69103,
                                        "experimentalFromMainFrame": true,
                                        "finished": true,
                                        "resourceSize": 268115
                                    },
                                    {
                                        "protocol": "h2",
                                        "resourceSize": 42644,
                                        "startTime": 3269.88400000846,
                                        "statusCode": 200,
                                        "url": "https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&co=aHR0cHM6Ly9yYXBpZGxvYWQuaW86NDQz&hl=en&v=Ixi5IiChXmIG6rRkjUa1qXHT&size=invisible&cb=egm7atad82l8",
                                        "resourceType": "Document",
                                        "endTime": 3292.8899999824353,
                                        "transferSize": 22848,
                                        "finished": true,
                                        "mimeType": "text/html"
                                    },
                                    {
                                        "protocol": "h2",
                                        "statusCode": 200,
                                        "url": "https://rapidload.io/?wc-ajax=get_refreshed_fragments&elementor_page_id=10534",
                                        "finished": true,
                                        "endTime": 4391.347000026144,
                                        "transferSize": 1141,
                                        "resourceSize": 428,
                                        "resourceType": "XHR",
                                        "experimentalFromMainFrame": true,
                                        "startTime": 3313.1300000241026,
                                        "mimeType": "application/json"
                                    },
                                    {
                                        "statusCode": 200,
                                        "startTime": 3374.22300002072,
                                        "resourceType": "Stylesheet",
                                        "mimeType": "text/css",
                                        "protocol": "h2",
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/styles__ltr.css",
                                        "finished": true,
                                        "endTime": 3383.412999974098,
                                        "transferSize": 25183,
                                        "resourceSize": 52913
                                    },
                                    {
                                        "mimeType": "text/javascript",
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "resourceType": "Script",
                                        "startTime": 3374.5249999919906,
                                        "transferSize": 163243,
                                        "finished": true,
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                        "endTime": 3386.837000027299,
                                        "resourceSize": 406989
                                    },
                                    {
                                        "resourceSize": 2368,
                                        "mimeType": "text/html",
                                        "endTime": 3384.1160000301898,
                                        "startTime": 3377.7370000025257,
                                        "protocol": "h2",
                                        "transferSize": 1701,
                                        "finished": true,
                                        "resourceType": "Document",
                                        "url": "https://vars.hotjar.com/box-c6ca1c87e308a39aabb76b56ba54398b.html",
                                        "statusCode": 200
                                    },
                                    {
                                        "transferSize": 226944,
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/audio/long-pop.wav",
                                        "experimentalFromMainFrame": true,
                                        "resourceType": "Media",
                                        "mimeType": "audio/x-wav",
                                        "protocol": "h2",
                                        "resourceSize": 226002,
                                        "finished": true,
                                        "statusCode": 206,
                                        "endTime": 4861.583999998402,
                                        "startTime": 3381.844000017736
                                    },
                                    {
                                        "statusCode": 200,
                                        "url": "https://www.google.com/recaptcha/api2/webworker.js?hl=en&v=Ixi5IiChXmIG6rRkjUa1qXHT",
                                        "resourceSize": 102,
                                        "startTime": 3782.412000000477,
                                        "mimeType": "text/javascript",
                                        "endTime": 3792.743999976665,
                                        "transferSize": 832,
                                        "finished": true,
                                        "protocol": "h2",
                                        "resourceType": "Other"
                                    },
                                    {
                                        "resourceType": "XHR",
                                        "url": "https://in.hotjar.com/api/v2/client/sites/3011767/visit-data?sv=6",
                                        "statusCode": 200,
                                        "protocol": "h2",
                                        "mimeType": "application/json",
                                        "transferSize": 407,
                                        "startTime": 3891.920000023674,
                                        "resourceSize": 169,
                                        "finished": true,
                                        "experimentalFromMainFrame": true,
                                        "endTime": 4157.446999975946
                                    },
                                    {
                                        "transferSize": 34400,
                                        "finished": true,
                                        "startTime": 4168.140000023413,
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "mimeType": "application/javascript",
                                        "url": "https://script.hotjar.com/preact-incoming-feedback.7662d6fc45aef63728ff.js",
                                        "resourceSize": 169239,
                                        "endTime": 4177.398000028916,
                                        "resourceType": "Script",
                                        "statusCode": 200
                                    },
                                    {
                                        "finished": true,
                                        "startTime": 4286.044000007678,
                                        "transferSize": 327,
                                        "resourceSize": 66,
                                        "statusCode": 200,
                                        "resourceType": "XHR",
                                        "mimeType": "application/json",
                                        "url": "https://ws33.hotjar.com/api/v2/sites/3011767/recordings/content",
                                        "experimentalFromMainFrame": true,
                                        "protocol": "h2",
                                        "endTime": 6869.4719999912195
                                    }
                                ],
                                "debugData": {
                                    "networkStartTimeTs": 390338292762,
                                    "type": "debugdata"
                                }
                            }
                        },
                        "unused-css-rules": {
                            "id": "unused-css-rules",
                            "title": "Reduce unused CSS",
                            "description": "Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content to decrease bytes consumed by network activity. [Learn more](https://web.dev/unused-css-rules/).",
                            "score": 0.9,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 182 KiB",
                            "details": {
                                "type": "opportunity",
                                "headings": [
                                    {
                                        "valueType": "url",
                                        "label": "URL",
                                        "key": "url"
                                    },
                                    {
                                        "valueType": "bytes",
                                        "label": "Transfer Size",
                                        "key": "totalBytes"
                                    },
                                    {
                                        "key": "wastedBytes",
                                        "label": "Potential Savings",
                                        "valueType": "bytes"
                                    }
                                ],
                                "items": [
                                    {
                                        "totalBytes": 139685,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css",
                                        "wastedPercent": 98.30631415397373,
                                        "wastedBytes": 137319
                                    },
                                    {
                                        "totalBytes": 25183,
                                        "wastedPercent": 100,
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/styles__ltr.css",
                                        "wastedBytes": 25183
                                    },
                                    {
                                        "url": "@charset \"UTF-8\";@font-face{font-family:'Lexend';font-style:normal;font-weight:100; ... } ...",
                                        "totalBytes": 18073,
                                        "wastedPercent": 74.48867923245808,
                                        "wastedBytes": 13462
                                    },
                                    {
                                        "wastedBytes": 10798,
                                        "totalBytes": 12183,
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_single_495ea6537bdc403c483dd2f0187127c5.css?ver=1667209725",
                                        "wastedPercent": 88.63511198139763
                                    }
                                ],
                                "overallSavingsMs": 120,
                                "overallSavingsBytes": 186762
                            },
                            "numericValue": 120,
                            "numericUnit": "millisecond"
                        },
                        "uses-optimized-images": {
                            "id": "uses-optimized-images",
                            "title": "Efficiently encode images",
                            "description": "Optimized images load faster and consume less cellular data. [Learn more](https://web.dev/uses-optimized-images/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 12 KiB",
                            "details": {
                                "items": [
                                    {
                                        "wastedBytes": 12260,
                                        "fromProtocol": true,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/placeholder-image-300x203.jpeg",
                                        "isCrossOrigin": false,
                                        "totalBytes": 14410
                                    }
                                ],
                                "headings": [
                                    {
                                        "valueType": "node",
                                        "key": "node"
                                    },
                                    {
                                        "key": "url",
                                        "label": "URL",
                                        "valueType": "url"
                                    },
                                    {
                                        "valueType": "bytes",
                                        "label": "Resource Size",
                                        "key": "totalBytes"
                                    },
                                    {
                                        "key": "wastedBytes",
                                        "label": "Potential Savings",
                                        "valueType": "bytes"
                                    }
                                ],
                                "overallSavingsMs": 0,
                                "overallSavingsBytes": 12260,
                                "type": "opportunity"
                            },
                            "warnings": [],
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "diagnostics": {
                            "id": "diagnostics",
                            "title": "Diagnostics",
                            "description": "Collection of useful page vitals.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "items": [
                                    {
                                        "numRequests": 91,
                                        "maxRtt": 0.0005129203753982774,
                                        "numTasks": 1819,
                                        "numTasksOver100ms": 2,
                                        "maxServerLatency": null,
                                        "numTasksOver10ms": 40,
                                        "numFonts": 9,
                                        "throughput": 30718143497.801617,
                                        "numScripts": 40,
                                        "numTasksOver50ms": 8,
                                        "rtt": 0.0005129203753982774,
                                        "numTasksOver500ms": 0,
                                        "numStylesheets": 14,
                                        "totalByteWeight": 2353776,
                                        "totalTaskTime": 2319.747000000001,
                                        "mainDocumentTransferSize": 47944,
                                        "numTasksOver25ms": 23
                                    }
                                ],
                                "type": "debugdata"
                            }
                        },
                        "full-page-screenshot": {
                            "id": "full-page-screenshot",
                            "title": "Full-page screenshot",
                            "description": "A full-height screenshot of the final rendered page",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "screenshot": {
                                    "height": 1939,
                                    "width": 1350,
                                    "data": "data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOBgkAI4GCQAjgYJACOASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+Y2+YGAZ2+YAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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"
                                },
                                "nodes": {
                                    "12-51-META": {
                                        "top": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "page-67-IMG": {
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-18-IMG": {
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "page-40-IMG": {
                                        "right": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "top": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-33-META": {
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "right": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "12-68-SCRIPT": {
                                        "top": 0,
                                        "width": 0,
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "height": 0
                                    },
                                    "page-31-IMG": {
                                        "right": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-66-SCRIPT": {
                                        "width": 0,
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0
                                    },
                                    "page-63-IMG": {
                                        "height": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "12-31-LINK": {
                                        "bottom": 0,
                                        "width": 0,
                                        "right": 0,
                                        "left": 0,
                                        "top": 0,
                                        "height": 0
                                    },
                                    "12-0-LINK": {
                                        "left": 0,
                                        "top": 0,
                                        "width": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "height": 0
                                    },
                                    "page-79-SECTION": {
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "12-60-META": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "12-71-SCRIPT": {
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "page-42-IMG": {
                                        "right": 0,
                                        "width": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "12-24-LINK": {
                                        "width": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "12-63-SCRIPT": {
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "12-106-SCRIPT": {
                                        "right": 0,
                                        "height": 0,
                                        "top": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "12-48-META": {
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "page-57-IMG": {
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-17-LINK": {
                                        "width": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "page-53-IMG": {
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "12-44-META": {
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-73-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "12-100-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0,
                                        "height": 0
                                    },
                                    "page-4-IMG": {
                                        "top": 1205,
                                        "left": 125,
                                        "width": 260,
                                        "right": 385,
                                        "bottom": 1335,
                                        "height": 130
                                    },
                                    "12-53-META": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "page-16-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "page-72-IMG": {
                                        "top": 1528,
                                        "width": 226,
                                        "left": 115,
                                        "right": 341,
                                        "bottom": 1586,
                                        "height": 58
                                    },
                                    "12-58-META": {
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "12-89-SCRIPT": {
                                        "right": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "12-47-META": {
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "page-70-IMG": {
                                        "right": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "page-55-IMG": {
                                        "height": 0,
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "page-22-IMG": {
                                        "width": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "12-22-LINK": {
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "12-13-LINK": {
                                        "height": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-72-SCRIPT": {
                                        "height": 0,
                                        "width": 0,
                                        "top": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "page-73-IMG": {
                                        "right": 0,
                                        "height": 1,
                                        "top": -1,
                                        "bottom": 0,
                                        "width": 1,
                                        "left": -1
                                    },
                                    "page-64-IMG": {
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "page-44-IMG": {
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0,
                                        "height": 0
                                    },
                                    "12-21-LINK": {
                                        "height": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "12-37-META": {
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "page-80-SECTION": {
                                        "width": 1350,
                                        "bottom": 1939,
                                        "right": 1350,
                                        "top": 1868,
                                        "left": 0,
                                        "height": 71
                                    },
                                    "12-109-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "page-82-INPUT": {
                                        "top": 1765,
                                        "right": 404,
                                        "left": 121,
                                        "bottom": 1812,
                                        "width": 283,
                                        "height": 47
                                    },
                                    "page-15-IMG": {
                                        "right": 0,
                                        "left": 0,
                                        "width": 0,
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0
                                    },
                                    "page-8-IMG": {
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "page-74-DIV": {
                                        "right": 665,
                                        "width": 550,
                                        "top": 230,
                                        "bottom": 553,
                                        "height": 324,
                                        "left": 115
                                    },
                                    "12-38-META": {
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-81-INPUT": {
                                        "width": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0
                                    },
                                    "12-35-META": {
                                        "top": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-113-SCRIPT": {
                                        "left": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "right": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "12-76-SCRIPT": {
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "12-116-path": {
                                        "top": 493,
                                        "bottom": 503,
                                        "left": 598,
                                        "right": 610,
                                        "width": 12,
                                        "height": 10
                                    },
                                    "page-43-IMG": {
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "12-110-SCRIPT": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "page-69-IMG": {
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "page-19-IMG": {
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "12-98-SCRIPT": {
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "12-3-LINK": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "12-11-LINK": {
                                        "top": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "right": 0
                                    },
                                    "page-83-INPUT": {
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "page-46-IMG": {
                                        "right": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "page-49-IMG": {
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "page-84-INPUT": {
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0,
                                        "bottom": 0
                                    },
                                    "page-60-IMG": {
                                        "left": 0,
                                        "top": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "page-6-IMG": {
                                        "top": 1205,
                                        "width": 260,
                                        "height": 130,
                                        "right": 945,
                                        "left": 685,
                                        "bottom": 1335
                                    },
                                    "12-69-SCRIPT": {
                                        "right": 0,
                                        "top": 0,
                                        "left": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "12-4-LINK": {
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "12-64-SCRIPT": {
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "12-91-SCRIPT": {
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-1-IMG": {
                                        "height": 616,
                                        "left": 805,
                                        "right": 1235,
                                        "width": 430,
                                        "top": 111,
                                        "bottom": 727
                                    },
                                    "12-42-META": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "12-108-SCRIPT": {
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "12-49-META": {
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "page-62-IMG": {
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "left": 0
                                    },
                                    "12-57-META": {
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "page-33-IMG": {
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "page-48-IMG": {
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "page-52-IMG": {
                                        "top": 0,
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "page-14-IMG": {
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "page-37-IMG": {
                                        "height": 0,
                                        "right": 0,
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "12-8-LINK": {
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-77-SCRIPT": {
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "top": 0,
                                        "height": 0
                                    },
                                    "12-85-SCRIPT": {
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "12-46-META": {
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-32-META": {
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-58-IMG": {
                                        "width": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0
                                    },
                                    "12-43-META": {
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "12-36-META": {
                                        "top": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "12-117-BODY": {
                                        "left": 0,
                                        "height": 1939,
                                        "right": 1350,
                                        "top": 0,
                                        "bottom": 1939,
                                        "width": 1350
                                    },
                                    "12-40-META": {
                                        "width": 0,
                                        "left": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "12-93-SCRIPT": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "12-2-LINK": {
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "12-83-SCRIPT": {
                                        "width": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "12-92-SCRIPT": {
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "page-2-IMG": {
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "page-47-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "12-84-SCRIPT": {
                                        "left": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "12-87-SCRIPT": {
                                        "right": 0,
                                        "width": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "12-14-LINK": {
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "12-5-LINK": {
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "top": 0,
                                        "left": 0
                                    },
                                    "12-80-SCRIPT": {
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "page-45-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "12-12-LINK": {
                                        "width": 0,
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "12-111-SCRIPT": {
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "page-3-IMG": {
                                        "left": 864,
                                        "right": 904,
                                        "width": 40,
                                        "top": 785,
                                        "height": 35,
                                        "bottom": 820
                                    },
                                    "page-38-IMG": {
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "page-65-IMG": {
                                        "top": 0,
                                        "height": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "12-19-LINK": {
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "page-9-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "page-25-IMG": {
                                        "width": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0,
                                        "left": 0
                                    },
                                    "page-30-IMG": {
                                        "right": 0,
                                        "top": 0,
                                        "width": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "12-101-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0
                                    },
                                    "page-76-DIV": {
                                        "top": 37,
                                        "bottom": 84,
                                        "left": 115,
                                        "width": 265,
                                        "height": 46,
                                        "right": 380
                                    },
                                    "page-27-IMG": {
                                        "right": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "12-61-META": {
                                        "width": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "page-0-IMG": {
                                        "top": 37,
                                        "width": 180,
                                        "bottom": 84,
                                        "height": 46,
                                        "left": 115,
                                        "right": 295
                                    },
                                    "page-75-DIV": {
                                        "height": 153,
                                        "left": 115,
                                        "width": 550,
                                        "top": 553,
                                        "right": 665,
                                        "bottom": 706
                                    },
                                    "12-115-SCRIPT": {
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "page-11-IMG": {
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "12-96-SCRIPT": {
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "12-114-SCRIPT": {
                                        "left": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "page-85-DIV": {
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "12-88-SCRIPT": {
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "12-20-LINK": {
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0,
                                        "height": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-59-IMG": {
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "page-21-IMG": {
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "right": 0
                                    },
                                    "12-9-LINK": {
                                        "top": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "12-86-SCRIPT": {
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "right": 0,
                                        "left": 0
                                    },
                                    "12-52-META": {
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "12-99-SCRIPT": {
                                        "height": 0,
                                        "right": 0,
                                        "left": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "12-103-SCRIPT": {
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "page-7-IMG": {
                                        "left": 965,
                                        "right": 1225,
                                        "bottom": 1335,
                                        "top": 1205,
                                        "width": 260,
                                        "height": 130
                                    },
                                    "page-51-IMG": {
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-102-SCRIPT": {
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "12-34-META": {
                                        "height": 0,
                                        "top": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "page-20-IMG": {
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-12-IMG": {
                                        "bottom": 0,
                                        "width": 0,
                                        "right": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "12-55-META": {
                                        "top": 0,
                                        "right": 0,
                                        "left": 0,
                                        "height": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "12-10-LINK": {
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-27-LINK": {
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "page-24-IMG": {
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "12-74-SCRIPT": {
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-86-INPUT": {
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "12-28-LINK": {
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-23-LINK": {
                                        "height": 0,
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "page-35-IMG": {
                                        "width": 0,
                                        "top": 0,
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "page-56-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "height": 0
                                    },
                                    "page-32-IMG": {
                                        "height": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-25-LINK": {
                                        "bottom": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "page-50-IMG": {
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "page-34-IMG": {
                                        "bottom": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "12-95-SCRIPT": {
                                        "top": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "width": 0
                                    },
                                    "page-61-IMG": {
                                        "left": 0,
                                        "width": 0,
                                        "right": 0,
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0
                                    },
                                    "12-45-META": {
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0
                                    },
                                    "12-18-LINK": {
                                        "top": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0
                                    },
                                    "12-54-META": {
                                        "width": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "height": 0
                                    },
                                    "page-13-IMG": {
                                        "top": 0,
                                        "right": 0,
                                        "width": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "height": 0
                                    },
                                    "page-23-IMG": {
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-5-IMG": {
                                        "bottom": 1335,
                                        "left": 405,
                                        "height": 130,
                                        "right": 665,
                                        "top": 1205,
                                        "width": 260
                                    },
                                    "12-67-SCRIPT": {
                                        "bottom": 0,
                                        "height": 0,
                                        "width": 0,
                                        "top": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "12-78-SCRIPT": {
                                        "right": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "page-77-H3": {
                                        "right": 1070,
                                        "bottom": 735,
                                        "top": 692,
                                        "left": 730,
                                        "height": 43,
                                        "width": 340
                                    },
                                    "12-50-META": {
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "right": 0
                                    },
                                    "12-26-LINK": {
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-1-LINK": {
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0
                                    },
                                    "page-26-IMG": {
                                        "width": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "12-90-SCRIPT": {
                                        "bottom": 0,
                                        "left": 0,
                                        "height": 0,
                                        "width": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "page-28-IMG": {
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "12-81-SCRIPT": {
                                        "left": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-59-META": {
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-54-IMG": {
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0
                                    },
                                    "page-66-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "12-56-META": {
                                        "right": 0,
                                        "left": 0,
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "page-36-IMG": {
                                        "right": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "12-79-SCRIPT": {
                                        "width": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "height": 0,
                                        "left": 0
                                    },
                                    "12-15-LINK": {
                                        "width": 0,
                                        "top": 0,
                                        "height": 0,
                                        "right": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "12-105-SCRIPT": {
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "left": 0,
                                        "width": 0
                                    },
                                    "12-112-SCRIPT": {
                                        "height": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "left": 0,
                                        "width": 0,
                                        "right": 0
                                    },
                                    "page-17-IMG": {
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0
                                    },
                                    "page-68-IMG": {
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0,
                                        "left": 0
                                    },
                                    "12-107-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0
                                    },
                                    "12-75-SCRIPT": {
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "12-62-SCRIPT": {
                                        "width": 0,
                                        "left": 0,
                                        "right": 0,
                                        "top": 0,
                                        "height": 0,
                                        "bottom": 0
                                    },
                                    "12-39-META": {
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-71-IMG": {
                                        "top": 0,
                                        "width": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0,
                                        "left": 0
                                    },
                                    "page-78-LI": {
                                        "bottom": 91,
                                        "left": 507,
                                        "right": 678,
                                        "top": 45,
                                        "width": 171,
                                        "height": 46
                                    },
                                    "12-65-SCRIPT": {
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "12-97-SCRIPT": {
                                        "top": 0,
                                        "width": 0,
                                        "right": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0
                                    },
                                    "12-82-SCRIPT": {
                                        "top": 0,
                                        "left": 0,
                                        "width": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0
                                    },
                                    "12-104-SCRIPT": {
                                        "top": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "width": 0,
                                        "height": 0
                                    },
                                    "12-6-LINK": {
                                        "width": 0,
                                        "height": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "12-70-SCRIPT": {
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "right": 0
                                    },
                                    "12-16-LINK": {
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "top": 0,
                                        "left": 0
                                    },
                                    "page-41-IMG": {
                                        "left": 0,
                                        "right": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "top": 0
                                    },
                                    "page-29-IMG": {
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0
                                    },
                                    "12-41-META": {
                                        "height": 0,
                                        "width": 0,
                                        "left": 0,
                                        "bottom": 0,
                                        "right": 0,
                                        "top": 0
                                    },
                                    "12-94-SCRIPT": {
                                        "left": 0,
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-29-LINK": {
                                        "top": 0,
                                        "height": 0,
                                        "left": 0,
                                        "width": 0,
                                        "bottom": 0,
                                        "right": 0
                                    },
                                    "page-10-IMG": {
                                        "right": 0,
                                        "top": 0,
                                        "bottom": 0,
                                        "width": 0,
                                        "height": 0,
                                        "left": 0
                                    },
                                    "page-39-IMG": {
                                        "right": 0,
                                        "height": 0,
                                        "bottom": 0,
                                        "top": 0,
                                        "width": 0,
                                        "left": 0
                                    },
                                    "12-7-LINK": {
                                        "right": 0,
                                        "bottom": 0,
                                        "height": 0,
                                        "left": 0,
                                        "top": 0,
                                        "width": 0
                                    },
                                    "12-30-LINK": {
                                        "top": 0,
                                        "width": 0,
                                        "left": 0,
                                        "height": 0,
                                        "right": 0,
                                        "bottom": 0
                                    }
                                },
                                "type": "full-page-screenshot"
                            }
                        },
                        "lcp-lazy-loaded": {
                            "id": "lcp-lazy-loaded",
                            "title": "Largest Contentful Paint image was lazily loaded",
                            "description": "Above-the-fold images that are lazily loaded render later in the page lifecycle, which can delay the largest contentful paint. [Learn more](https://web.dev/lcp-lazy-loading/).",
                            "score": 0,
                            "scoreDisplayMode": "binary",
                            "details": {
                                "items": [
                                    {
                                        "node": {
                                            "boundingRect": {
                                                "height": 616,
                                                "width": 430,
                                                "bottom": 727,
                                                "left": 805,
                                                "right": 1235,
                                                "top": 111
                                            },
                                            "snippet": "<img width=\"504\" height=\"722\" src=\"https://rapidload.io/wp-content/uploads/2022/08/image-land.svg\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\">",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "lhId": "page-1-IMG",
                                            "type": "node",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG"
                                        }
                                    }
                                ],
                                "headings": [
                                    {
                                        "key": "node",
                                        "itemType": "node",
                                        "text": "Element"
                                    }
                                ],
                                "type": "table"
                            }
                        },
                        "font-display": {
                            "id": "font-display",
                            "title": "All text remains visible during webfont loads",
                            "description": "Leverage the font-display CSS feature to ensure text is user-visible while webfonts are loading. [Learn more](https://web.dev/font-display/).",
                            "score": 1,
                            "scoreDisplayMode": "binary",
                            "details": {
                                "items": [],
                                "type": "table",
                                "headings": []
                            },
                            "warnings": [
                                "Lighthouse was unable to automatically check the `font-display` value for the origin https://rapidload.io."
                            ]
                        },
                        "third-party-facades": {
                            "id": "third-party-facades",
                            "title": "Lazy load third-party resources with facades",
                            "description": "Some third-party embeds can be lazy loaded. Consider replacing them with a facade until they are required. [Learn more](https://web.dev/third-party-facades/).",
                            "score": null,
                            "scoreDisplayMode": "notApplicable"
                        },
                        "max-potential-fid": {
                            "id": "max-potential-fid",
                            "title": "Max Potential First Input Delay",
                            "description": "The maximum potential First Input Delay that your users could experience is the duration of the longest task. [Learn more](https://web.dev/lighthouse-max-potential-fid/).",
                            "score": 0.39,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "290 ms",
                            "numericValue": 288,
                            "numericUnit": "millisecond"
                        },
                        "performance-budget": {
                            "id": "performance-budget",
                            "title": "Performance budget",
                            "description": "Keep the quantity and size of network requests under the targets set by the provided performance budget. [Learn more](https://developers.google.com/web/tools/lighthouse/audits/budgets).",
                            "score": null,
                            "scoreDisplayMode": "notApplicable"
                        },
                        "efficient-animated-content": {
                            "id": "efficient-animated-content",
                            "title": "Use video formats for animated content",
                            "description": "Large GIFs are inefficient for delivering animated content. Consider using MPEG4/WebM videos for animations and PNG/WebP for static images instead of GIF to save network bytes. [Learn more](https://web.dev/efficient-animated-content/)",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "overallSavingsBytes": 0,
                                "items": [],
                                "type": "opportunity",
                                "headings": [],
                                "overallSavingsMs": 0
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "redirects": {
                            "id": "redirects",
                            "title": "Avoid multiple page redirects",
                            "description": "Redirects introduce additional delays before the page can be loaded. [Learn more](https://web.dev/redirects/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "overallSavingsMs": 0,
                                "type": "opportunity",
                                "items": [],
                                "headings": []
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "modern-image-formats": {
                            "id": "modern-image-formats",
                            "title": "Serve images in next-gen formats",
                            "description": "Image formats like WebP and AVIF often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. [Learn more](https://web.dev/uses-webp-images/).",
                            "score": 0.87,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 137 KiB",
                            "details": {
                                "overallSavingsBytes": 140561.2,
                                "items": [
                                    {
                                        "node": {
                                            "type": "node",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "lhId": "page-16-IMG",
                                            "nodeLabel": "Geoffrey Gussis",
                                            "boundingRect": {
                                                "top": 0,
                                                "height": 0,
                                                "left": 0,
                                                "width": 0,
                                                "right": 0,
                                                "bottom": 0
                                            },
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/Geoferry-Gussis.png\" alt=\"Geoffrey Gussis\">"
                                        },
                                        "wastedWebpBytes": 50738,
                                        "totalBytes": 57026,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Geoferry-Gussis.png",
                                        "wastedBytes": 51653.55,
                                        "fromProtocol": true,
                                        "isCrossOrigin": false
                                    },
                                    {
                                        "isCrossOrigin": false,
                                        "wastedBytes": 17474.7,
                                        "fromProtocol": true,
                                        "wastedWebpBytes": 16796,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-21.png",
                                        "node": {
                                            "boundingRect": {
                                                "width": 0,
                                                "bottom": 0,
                                                "height": 0,
                                                "left": 0,
                                                "right": 0,
                                                "top": 0
                                            },
                                            "type": "node",
                                            "snippet": "<img src=\"https://rapidload.io/wp-content/uploads/2022/08/image-21.png\" alt=\"Tim Daniels\">",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,3,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-14-IMG",
                                            "selector": "div.elementor-testimonial > div.elementor-testimonial__header > div.elementor-testimonial__image > img",
                                            "nodeLabel": "Tim Daniels"
                                        },
                                        "totalBytes": 19908
                                    },
                                    {
                                        "fromProtocol": true,
                                        "totalBytes": 27480,
                                        "wastedWebpBytes": 14180,
                                        "isCrossOrigin": false,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png",
                                        "node": {
                                            "lhId": "page-5-IMG",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Customishop_raw_20-min.png…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "boundingRect": {
                                                "height": 130,
                                                "top": 1205,
                                                "width": 260,
                                                "bottom": 1335,
                                                "right": 665,
                                                "left": 405
                                            },
                                            "type": "node",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full"
                                        },
                                        "wastedBytes": 16240
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/placeholder-image-300x203.jpeg",
                                        "wastedWebpBytes": 13874,
                                        "fromProtocol": true,
                                        "wastedBytes": 13658.1,
                                        "isCrossOrigin": false,
                                        "totalBytes": 14410
                                    },
                                    {
                                        "wastedWebpBytes": 9632,
                                        "isCrossOrigin": false,
                                        "wastedBytes": 13037.5,
                                        "totalBytes": 16752,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/popup-image.png",
                                        "fromProtocol": true
                                    },
                                    {
                                        "isCrossOrigin": false,
                                        "fromProtocol": true,
                                        "totalBytes": 19752,
                                        "wastedBytes": 11368.05,
                                        "node": {
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "type": "node",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png 3…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,3,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-7-IMG",
                                            "boundingRect": {
                                                "width": 260,
                                                "left": 965,
                                                "bottom": 1335,
                                                "height": 130,
                                                "top": 1205,
                                                "right": 1225
                                            }
                                        },
                                        "wastedWebpBytes": 10054,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/sammobile_raw_20-min.png"
                                    },
                                    {
                                        "wastedWebpBytes": 7874,
                                        "wastedBytes": 8875.45,
                                        "node": {
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "lhId": "page-4-IMG",
                                            "type": "node",
                                            "boundingRect": {
                                                "bottom": 1335,
                                                "height": 130,
                                                "width": 260,
                                                "left": 125,
                                                "top": 1205,
                                                "right": 385
                                            },
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png 380w,…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full"
                                        },
                                        "isCrossOrigin": false,
                                        "fromProtocol": true,
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Byjus_raw_20-min.png",
                                        "totalBytes": 17306
                                    },
                                    {
                                        "node": {
                                            "selector": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "boundingRect": {
                                                "width": 260,
                                                "bottom": 1335,
                                                "left": 685,
                                                "right": 945,
                                                "height": 130,
                                                "top": 1205
                                            },
                                            "snippet": "<img width=\"380\" height=\"190\" src=\"https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png\" class=\"attachment-full size-full\" alt=\"\" loading=\"lazy\" srcset=\"https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png 38…\" sizes=\"(max-width: 380px) 100vw, 380px\">",
                                            "nodeLabel": "div.elementor-element > div.elementor-widget-container > div.elementor-image > img.attachment-full",
                                            "path": "1,HTML,1,BODY,9,MAIN,0,DIV,0,DIV,0,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,SECTION,0,DIV,0,DIV,2,DIV,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,IMG",
                                            "lhId": "page-6-IMG",
                                            "type": "node"
                                        },
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/Wizehire_raw_20-min.png",
                                        "totalBytes": 13887,
                                        "wastedWebpBytes": 7811,
                                        "fromProtocol": true,
                                        "isCrossOrigin": false,
                                        "wastedBytes": 8253.85
                                    }
                                ],
                                "headings": [
                                    {
                                        "valueType": "node",
                                        "key": "node"
                                    },
                                    {
                                        "label": "URL",
                                        "key": "url",
                                        "valueType": "url"
                                    },
                                    {
                                        "key": "totalBytes",
                                        "label": "Resource Size",
                                        "valueType": "bytes"
                                    },
                                    {
                                        "key": "wastedBytes",
                                        "valueType": "bytes",
                                        "label": "Potential Savings"
                                    }
                                ],
                                "type": "opportunity",
                                "overallSavingsMs": 160
                            },
                            "warnings": [],
                            "numericValue": 160,
                            "numericUnit": "millisecond"
                        },
                        "final-screenshot": {
                            "id": "final-screenshot",
                            "title": "Final Screenshot",
                            "description": "The last screenshot captured of the pageload.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "data": "data:image/jpeg;base64,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ua8EtcCASNj5jqqrHwWxkNeaoSyOeS7YnbBJOPlv+AWQQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBEVQMkBBRFKEbQOgVdDf0QgiIpehv6ITQ39EIIiKXob+iFQxtPkEEVFVwwSFRAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEXLvF/iu62StoqO1VHswfGZHva0Eu3wBuNui1P7e4v54iN/YHEuGcDA0t1OydG2AomXJz+L4sOWcXTMzHxr+rvqLk3hLxbeLtfam33Wq9qjEJka4taC0ggbEDcHK3ekv1XNfJaeS3vZRBjC2TfmDUXAOc3yBLfmNifPCJWMHiGLNSt43G516f0bEi4RxHxrxHNxXX0lDcPZYIZZGMa1gw1rM5J2JPTKx8vFfF0UM8rrw/TEGOI0tyQ8Agj3fUKOpSt45hrMxFZnX4e38X0Oi0rw+4lrbrwca6ujdVVkcphxG0AyHbHTYddz02yr03ElfHwpca6ekbDVwRPfG5p1Ruw4t69wRuCp2v152K1Yt37xv09m3ovnik4v4rrWOlF85Y1huHNaMk9gGqk/G/FVsrWCW7ictw4t0tc35HZR1Q53+PYddU1tr+H9X0QvTfiHzWvXu9VdLQ08lBRiaWURuc6QlsbA5zRjPmTnoPn88zbqg1UEcr4ZIXk4dG8btIOD8/mNisnXrnpa80j1hkkRc48SLtXV93peFbI8sqKkaqh4PwsxnGfLYEn0x3UTOmPL5NeNj65jc+kR8zPpDOXfj/h62SuhkrhLM3qyFpfj6gY/FLR4gcPXOZsMdaIZndGTNLc/UjH4r1w9wLZLNSsZ7JFU1H9aeZupzj6A7D6L1xBwRZLzSvjfRxQTf1ZoW6XNP06/Ip3U/wDuWuv6n/j3/wDfz/DTZxui5t4d3SutV9qeE71IZJIRqpZD5txnHrscjtuF0lIna5xOVXk4+uI1PpMfEx6wiyfGV5XqT4yvKlYEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERYe+3Y0OmKEAzOGcno0LKlZvOoYZMlcdeqzAeInAx4rmpa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X/EFeN5a5koipah0rGF4YQBqGrSN87ZOfuQZVFhKTiGGeSKN9PUMkkcG/DsMkgb7duyzaAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAqaRqLsDURgnzVUQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3snLb2QR0Ujlt7Jy29kEdFI5beyctvZBHRSOW3siD//Z",
                                "timestamp": 390342768998,
                                "timing": 4477,
                                "type": "screenshot"
                            }
                        },
                        "non-composited-animations": {
                            "id": "non-composited-animations",
                            "title": "Avoid non-composited animations",
                            "description": "Animations which are not composited can be janky and increase CLS. [Learn more](https://web.dev/non-composited-animations)",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "7 animated elements found",
                            "details": {
                                "type": "table",
                                "headings": [
                                    {
                                        "itemType": "node",
                                        "text": "Element",
                                        "subItemsHeading": {
                                            "itemType": "text",
                                            "key": "failureReason"
                                        },
                                        "key": "node"
                                    },
                                    {
                                        "key": null,
                                        "text": "Name",
                                        "itemType": "text",
                                        "subItemsHeading": {
                                            "key": "animation",
                                            "itemType": "text"
                                        }
                                    }
                                ],
                                "items": [
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "failureReason": "Unsupported CSS Property: background-color",
                                                    "animation": "background-color"
                                                }
                                            ]
                                        },
                                        "node": {
                                            "type": "node",
                                            "lhId": "page-80-SECTION",
                                            "nodeLabel": "© 2022 RapidLoad™ All Rights Reserved. Secured payments with Stripe.\nTerms & Co…",
                                            "boundingRect": {
                                                "height": 71,
                                                "width": 1350,
                                                "bottom": 1939,
                                                "top": 1868,
                                                "right": 1350,
                                                "left": 0
                                            },
                                            "selector": "body.home > div.elementor > div.elementor-section-wrap > section.elementor-section",
                                            "path": "1,HTML,1,BODY,10,DIV,0,DIV,2,SECTION",
                                            "snippet": "<section class=\"elementor-section elementor-top-section elementor-element elementor-elemen…\" data-id=\"716c6d8\" data-element_type=\"section\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">"
                                        }
                                    },
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "animation": "padding-bottom",
                                                    "failureReason": "Unsupported CSS Property: padding-bottom"
                                                },
                                                {
                                                    "animation": "padding-left",
                                                    "failureReason": "Unsupported CSS Property: padding-left"
                                                },
                                                {
                                                    "animation": "padding-right",
                                                    "failureReason": "Unsupported CSS Property: padding-right"
                                                },
                                                {
                                                    "animation": "padding-top",
                                                    "failureReason": "Unsupported CSS Property: padding-top"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: font-size",
                                                    "animation": "font-size"
                                                }
                                            ]
                                        },
                                        "node": {
                                            "path": "0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,FORM,4,DIV,0,DIV,1,INPUT",
                                            "nodeLabel": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-text > input#form-field-first_name",
                                            "selector": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-text > input#form-field-first_name",
                                            "type": "node",
                                            "lhId": "page-81-INPUT",
                                            "snippet": "<input size=\"1\" type=\"text\" name=\"form_fields[first_name]\" id=\"form-field-first_name\" class=\"elementor-field elementor-size-sm  elementor-field-textual\" placeholder=\"First Name\" required=\"required\" aria-required=\"true\">",
                                            "boundingRect": {
                                                "bottom": 0,
                                                "height": 0,
                                                "right": 0,
                                                "top": 0,
                                                "left": 0,
                                                "width": 0
                                            }
                                        }
                                    },
                                    {
                                        "node": {
                                            "boundingRect": {
                                                "right": 404,
                                                "width": 283,
                                                "top": 1765,
                                                "bottom": 1812,
                                                "left": 121,
                                                "height": 47
                                            },
                                            "path": "1,HTML,1,BODY,10,DIV,0,DIV,1,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,FORM,4,DIV,0,DIV,0,INPUT",
                                            "snippet": "<input size=\"1\" type=\"email\" name=\"form_fields[emailfooter]\" id=\"form-field-emailfooter\" class=\"elementor-field elementor-size-md  elementor-field-textual\" placeholder=\"Email...\" required=\"required\" aria-required=\"true\">",
                                            "type": "node",
                                            "selector": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-email > input#form-field-emailfooter",
                                            "lhId": "page-82-INPUT",
                                            "nodeLabel": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-email > input#form-field-emailfooter"
                                        },
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-bottom",
                                                    "animation": "padding-bottom"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-left",
                                                    "animation": "padding-left"
                                                },
                                                {
                                                    "animation": "padding-right",
                                                    "failureReason": "Unsupported CSS Property: padding-right"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-top",
                                                    "animation": "padding-top"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: font-size",
                                                    "animation": "font-size"
                                                },
                                                {
                                                    "animation": "min-height",
                                                    "failureReason": "Unsupported CSS Property: min-height"
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-bottom",
                                                    "animation": "padding-bottom"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-left",
                                                    "animation": "padding-left"
                                                },
                                                {
                                                    "animation": "padding-right",
                                                    "failureReason": "Unsupported CSS Property: padding-right"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-top",
                                                    "animation": "padding-top"
                                                },
                                                {
                                                    "animation": "font-size",
                                                    "failureReason": "Unsupported CSS Property: font-size"
                                                }
                                            ]
                                        },
                                        "node": {
                                            "nodeLabel": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-text > input#form-field-last_name",
                                            "snippet": "<input size=\"1\" type=\"text\" name=\"form_fields[last_name]\" id=\"form-field-last_name\" class=\"elementor-field elementor-size-sm  elementor-field-textual\" placeholder=\"Last Name\" required=\"required\" aria-required=\"true\">",
                                            "boundingRect": {
                                                "width": 0,
                                                "top": 0,
                                                "height": 0,
                                                "left": 0,
                                                "right": 0,
                                                "bottom": 0
                                            },
                                            "lhId": "page-83-INPUT",
                                            "selector": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-text > input#form-field-last_name",
                                            "path": "0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,FORM,4,DIV,1,DIV,1,INPUT",
                                            "type": "node"
                                        }
                                    },
                                    {
                                        "node": {
                                            "nodeLabel": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-email > input#form-field-download_email",
                                            "boundingRect": {
                                                "top": 0,
                                                "left": 0,
                                                "bottom": 0,
                                                "width": 0,
                                                "right": 0,
                                                "height": 0
                                            },
                                            "type": "node",
                                            "path": "0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,2,DIV,0,DIV,0,FORM,4,DIV,2,DIV,1,INPUT",
                                            "selector": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-email > input#form-field-download_email",
                                            "snippet": "<input size=\"1\" type=\"email\" name=\"form_fields[download_email]\" id=\"form-field-download_email\" class=\"elementor-field elementor-size-sm  elementor-field-textual\" placeholder=\"Your email\" required=\"required\" aria-required=\"true\">",
                                            "lhId": "page-84-INPUT"
                                        },
                                        "subItems": {
                                            "items": [
                                                {
                                                    "animation": "padding-bottom",
                                                    "failureReason": "Unsupported CSS Property: padding-bottom"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-left",
                                                    "animation": "padding-left"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-right",
                                                    "animation": "padding-right"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: padding-top",
                                                    "animation": "padding-top"
                                                },
                                                {
                                                    "animation": "font-size",
                                                    "failureReason": "Unsupported CSS Property: font-size"
                                                }
                                            ],
                                            "type": "subitems"
                                        }
                                    },
                                    {
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-left-width",
                                                    "animation": "border-left-width"
                                                },
                                                {
                                                    "animation": "border-right-color",
                                                    "failureReason": "Unsupported CSS Property: border-right-color"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-right-width",
                                                    "animation": "border-right-width"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-top-color",
                                                    "animation": "border-top-color"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-top-left-radius",
                                                    "animation": "border-top-left-radius"
                                                },
                                                {
                                                    "animation": "border-top-right-radius",
                                                    "failureReason": "Unsupported CSS Property: border-top-right-radius"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-top-width",
                                                    "animation": "border-top-width"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-bottom-color",
                                                    "animation": "border-bottom-color"
                                                },
                                                {
                                                    "animation": "border-bottom-left-radius",
                                                    "failureReason": "Unsupported CSS Property: border-bottom-left-radius"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-bottom-right-radius",
                                                    "animation": "border-bottom-right-radius"
                                                },
                                                {
                                                    "animation": "box-shadow",
                                                    "failureReason": "Unsupported CSS Property: box-shadow"
                                                },
                                                {
                                                    "animation": "border-left-color",
                                                    "failureReason": "Unsupported CSS Property: border-left-color"
                                                }
                                            ]
                                        },
                                        "node": {
                                            "lhId": "page-85-DIV",
                                            "snippet": "<div class=\"elementor-widget-container\">",
                                            "selector": "div.elementor-column-wrap > div.elementor-widget-wrap > div.elementor-element > div.elementor-widget-container",
                                            "boundingRect": {
                                                "right": 0,
                                                "left": 0,
                                                "bottom": 0,
                                                "top": 0,
                                                "height": 0,
                                                "width": 0
                                            },
                                            "nodeLabel": "\n\t\t\t\t\t\n\t\t\t\n\t\t\t\n\t\t\t\n\n\t\t\t\t\t\t\t\n\t\t\t\n\t\t\t\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t…",
                                            "type": "node",
                                            "path": "0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV"
                                        }
                                    },
                                    {
                                        "node": {
                                            "lhId": "page-86-INPUT",
                                            "snippet": "<input size=\"1\" type=\"url\" name=\"form_fields[field_website_url]\" id=\"form-field-field_website_url\" class=\"elementor-field elementor-size-sm  elementor-field-textual\" placeholder=\"Enter your website....\">",
                                            "boundingRect": {
                                                "top": 0,
                                                "width": 0,
                                                "bottom": 0,
                                                "height": 0,
                                                "right": 0,
                                                "left": 0
                                            },
                                            "path": "0,DIV,0,SECTION,0,DIV,0,DIV,1,DIV,0,DIV,0,DIV,0,SECTION,0,DIV,0,DIV,0,DIV,0,DIV,0,DIV,3,DIV,0,DIV,0,FORM,4,DIV,0,DIV,0,INPUT",
                                            "type": "node",
                                            "nodeLabel": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-url > input#form-field-field_website_url",
                                            "selector": "form.elementor-form > div.elementor-form-fields-wrapper > div.elementor-field-type-url > input#form-field-field_website_url"
                                        },
                                        "subItems": {
                                            "type": "subitems",
                                            "items": [
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-left-width",
                                                    "animation": "border-left-width"
                                                },
                                                {
                                                    "animation": "border-right-width",
                                                    "failureReason": "Unsupported CSS Property: border-right-width"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-top-left-radius",
                                                    "animation": "border-top-left-radius"
                                                },
                                                {
                                                    "animation": "border-top-right-radius",
                                                    "failureReason": "Unsupported CSS Property: border-top-right-radius"
                                                },
                                                {
                                                    "animation": "border-top-width",
                                                    "failureReason": "Unsupported CSS Property: border-top-width"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-bottom-left-radius",
                                                    "animation": "border-bottom-left-radius"
                                                },
                                                {
                                                    "failureReason": "Unsupported CSS Property: border-bottom-right-radius",
                                                    "animation": "border-bottom-right-radius"
                                                },
                                                {
                                                    "animation": "border-bottom-width",
                                                    "failureReason": "Unsupported CSS Property: border-bottom-width"
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        "render-blocking-resources": {
                            "id": "render-blocking-resources",
                            "title": "Eliminate render-blocking resources",
                            "description": "Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles. [Learn more](https://web.dev/render-blocking-resources/).",
                            "score": 0.97,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Potential savings of 40 ms",
                            "details": {
                                "type": "opportunity",
                                "items": [
                                    {
                                        "wastedMs": 230,
                                        "totalBytes": 1179,
                                        "url": "https://www.google.com/recaptcha/api.js?render=6LdIL5kgAAAAAByMmjOxtKZhdTgXa9C5J9eFInLx&ver=5.9.3"
                                    }
                                ],
                                "overallSavingsMs": 40,
                                "headings": [
                                    {
                                        "key": "url",
                                        "label": "URL",
                                        "valueType": "url"
                                    },
                                    {
                                        "key": "totalBytes",
                                        "valueType": "bytes",
                                        "label": "Transfer Size"
                                    },
                                    {
                                        "key": "wastedMs",
                                        "valueType": "timespanMs",
                                        "label": "Potential Savings"
                                    }
                                ]
                            },
                            "numericValue": 40,
                            "numericUnit": "millisecond"
                        },
                        "main-thread-tasks": {
                            "id": "main-thread-tasks",
                            "title": "Tasks",
                            "description": "Lists the toplevel main thread tasks that executed during page load.",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "details": {
                                "items": [
                                    {
                                        "duration": 23.647,
                                        "startTime": 1309.996
                                    },
                                    {
                                        "startTime": 1334.056,
                                        "duration": 13.7
                                    },
                                    {
                                        "duration": 15.208,
                                        "startTime": 1391.627
                                    },
                                    {
                                        "startTime": 2248.798,
                                        "duration": 18.676
                                    },
                                    {
                                        "startTime": 2267.489,
                                        "duration": 31.325
                                    },
                                    {
                                        "duration": 28.858,
                                        "startTime": 2307.181
                                    },
                                    {
                                        "startTime": 2374.485,
                                        "duration": 5.709
                                    },
                                    {
                                        "duration": 39.534,
                                        "startTime": 2386.93
                                    },
                                    {
                                        "duration": 21.162,
                                        "startTime": 2426.506
                                    },
                                    {
                                        "duration": 79.605,
                                        "startTime": 2478.998
                                    },
                                    {
                                        "duration": 20.772,
                                        "startTime": 2571.775
                                    },
                                    {
                                        "duration": 56.234,
                                        "startTime": 2592.819
                                    },
                                    {
                                        "duration": 28.04,
                                        "startTime": 2649.155
                                    },
                                    {
                                        "startTime": 2677.228,
                                        "duration": 31.481
                                    },
                                    {
                                        "startTime": 2721.818,
                                        "duration": 49.155
                                    },
                                    {
                                        "startTime": 2771.005,
                                        "duration": 18.075
                                    },
                                    {
                                        "startTime": 2789.1,
                                        "duration": 33.121
                                    },
                                    {
                                        "startTime": 2822.273,
                                        "duration": 148.995
                                    },
                                    {
                                        "startTime": 2974.231,
                                        "duration": 5.685
                                    },
                                    {
                                        "duration": 51.855,
                                        "startTime": 2997.606
                                    },
                                    {
                                        "duration": 8.345,
                                        "startTime": 3050.091
                                    },
                                    {
                                        "startTime": 3059.848,
                                        "duration": 6.06
                                    },
                                    {
                                        "duration": 46.405,
                                        "startTime": 3073.54
                                    },
                                    {
                                        "duration": 5.616,
                                        "startTime": 3124.487
                                    },
                                    {
                                        "duration": 11.792,
                                        "startTime": 3175.301
                                    },
                                    {
                                        "duration": 5.359,
                                        "startTime": 3192.926
                                    },
                                    {
                                        "duration": 45.267,
                                        "startTime": 3199.703
                                    },
                                    {
                                        "duration": 23.267,
                                        "startTime": 3247.757
                                    },
                                    {
                                        "startTime": 3274.663,
                                        "duration": 20.935
                                    },
                                    {
                                        "duration": 11.314,
                                        "startTime": 3297.507
                                    },
                                    {
                                        "duration": 6.442,
                                        "startTime": 3308.842
                                    },
                                    {
                                        "startTime": 3318.106,
                                        "duration": 46.388
                                    },
                                    {
                                        "startTime": 3367.829,
                                        "duration": 7.815
                                    },
                                    {
                                        "duration": 5.046,
                                        "startTime": 3383.229
                                    },
                                    {
                                        "startTime": 3390.157,
                                        "duration": 8.426
                                    },
                                    {
                                        "startTime": 3417.236,
                                        "duration": 5.944
                                    },
                                    {
                                        "startTime": 3456.97,
                                        "duration": 14.071
                                    },
                                    {
                                        "startTime": 3493.182,
                                        "duration": 18.214
                                    },
                                    {
                                        "startTime": 3605.547,
                                        "duration": 6.237
                                    },
                                    {
                                        "duration": 9.367,
                                        "startTime": 3618.426
                                    },
                                    {
                                        "duration": 10.213,
                                        "startTime": 3631.195
                                    },
                                    {
                                        "duration": 7.066,
                                        "startTime": 3655.147
                                    },
                                    {
                                        "startTime": 3664.979,
                                        "duration": 17.991
                                    },
                                    {
                                        "startTime": 3695.291,
                                        "duration": 81.507
                                    },
                                    {
                                        "duration": 25.063,
                                        "startTime": 3784.899
                                    },
                                    {
                                        "startTime": 3813.474,
                                        "duration": 66.89
                                    },
                                    {
                                        "duration": 288.487,
                                        "startTime": 3884.674
                                    },
                                    {
                                        "duration": 31.941,
                                        "startTime": 4175.549
                                    },
                                    {
                                        "duration": 9.846,
                                        "startTime": 4217.362
                                    },
                                    {
                                        "startTime": 4227.228,
                                        "duration": 27.751
                                    },
                                    {
                                        "startTime": 4255.185,
                                        "duration": 48.345
                                    },
                                    {
                                        "startTime": 4311.985,
                                        "duration": 49.86
                                    },
                                    {
                                        "duration": 88.815,
                                        "startTime": 4365.493
                                    },
                                    {
                                        "duration": 14.551,
                                        "startTime": 4454.463
                                    },
                                    {
                                        "duration": 6.575,
                                        "startTime": 6871.288
                                    },
                                    {
                                        "duration": 10.473,
                                        "startTime": 8510.916
                                    }
                                ],
                                "headings": [
                                    {
                                        "key": "startTime",
                                        "text": "Start Time",
                                        "itemType": "ms",
                                        "granularity": 1
                                    },
                                    {
                                        "key": "duration",
                                        "text": "End Time",
                                        "granularity": 1,
                                        "itemType": "ms"
                                    }
                                ],
                                "type": "table"
                            }
                        },
                        "uses-passive-event-listeners": {
                            "id": "uses-passive-event-listeners",
                            "title": "Uses passive listeners to improve scrolling performance",
                            "description": "Consider marking your touch and wheel event listeners as `passive` to improve your page's scroll performance. [Learn more](https://web.dev/uses-passive-event-listeners/).",
                            "score": 1,
                            "scoreDisplayMode": "binary",
                            "details": {
                                "type": "table",
                                "headings": [],
                                "items": []
                            }
                        },
                        "uses-rel-preconnect": {
                            "id": "uses-rel-preconnect",
                            "title": "Preconnect to required origins",
                            "description": "Consider adding `preconnect` or `dns-prefetch` resource hints to establish early connections to important third-party origins. [Learn more](https://web.dev/uses-rel-preconnect/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "headings": [],
                                "overallSavingsMs": 0,
                                "items": [],
                                "type": "opportunity"
                            },
                            "warnings": [],
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "total-blocking-time": {
                            "id": "total-blocking-time",
                            "title": "Total Blocking Time",
                            "description": "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more](https://web.dev/lighthouse-total-blocking-time/).",
                            "score": 0.89,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "150 ms",
                            "numericValue": 154,
                            "numericUnit": "millisecond"
                        },
                        "total-byte-weight": {
                            "id": "total-byte-weight",
                            "title": "Avoids enormous network payloads",
                            "description": "Large network payloads cost users real money and are highly correlated with long load times. [Learn more](https://web.dev/total-byte-weight/).",
                            "score": 0.96,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "Total size was 2,299 KiB",
                            "details": {
                                "items": [
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/08/image-land.svg",
                                        "totalBytes": 343820
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/themes/hello-elementor-child/assets/audio/long-pop.wav",
                                        "totalBytes": 226944
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/uploads/2022/10/exit-intent.svg",
                                        "totalBytes": 202971
                                    },
                                    {
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                        "totalBytes": 163243
                                    },
                                    {
                                        "totalBytes": 163243,
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css",
                                        "totalBytes": 139685
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-solid-900.woff2",
                                        "totalBytes": 79277
                                    },
                                    {
                                        "url": "https://www.googletagmanager.com/gtag/js?id=G-4ZTDF2L9YB",
                                        "totalBytes": 78448
                                    },
                                    {
                                        "totalBytes": 77841,
                                        "url": "https://rapidload.io/wp-content/plugins/elementor/assets/lib/font-awesome/webfonts/fa-brands-400.woff2"
                                    },
                                    {
                                        "url": "https://script.hotjar.com/modules.f1e65ef904544a33c6d0.js",
                                        "totalBytes": 69103
                                    }
                                ],
                                "type": "table",
                                "headings": [
                                    {
                                        "key": "url",
                                        "itemType": "url",
                                        "text": "URL"
                                    },
                                    {
                                        "itemType": "bytes",
                                        "text": "Transfer Size",
                                        "key": "totalBytes"
                                    }
                                ]
                            },
                            "numericValue": 2353776,
                            "numericUnit": "byte"
                        },
                        "no-unload-listeners": {
                            "id": "no-unload-listeners",
                            "title": "Avoids `unload` event listeners",
                            "description": "The `unload` event does not fire reliably and listening for it can prevent browser optimizations like the Back-Forward Cache. Use `pagehide` or `visibilitychange` events instead. [Learn more](https://web.dev/bfcache/#never-use-the-unload-event)",
                            "score": 1,
                            "scoreDisplayMode": "binary"
                        },
                        "uses-long-cache-ttl": {
                            "id": "uses-long-cache-ttl",
                            "title": "Uses efficient cache policy on static assets",
                            "description": "A long cache lifetime can speed up repeat visits to your page. [Learn more](https://web.dev/uses-long-cache-ttl/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "3 resources found",
                            "details": {
                                "headings": [
                                    {
                                        "text": "URL",
                                        "key": "url",
                                        "itemType": "url"
                                    },
                                    {
                                        "key": "cacheLifetimeMs",
                                        "displayUnit": "duration",
                                        "text": "Cache TTL",
                                        "itemType": "ms"
                                    },
                                    {
                                        "text": "Transfer Size",
                                        "displayUnit": "kb",
                                        "granularity": 1,
                                        "itemType": "bytes",
                                        "key": "totalBytes"
                                    }
                                ],
                                "summary": {
                                    "wastedBytes": 4558.983333333334
                                },
                                "items": [
                                    {
                                        "cacheLifetimeMs": 0,
                                        "wastedBytes": 1102,
                                        "cacheHitProbability": 0,
                                        "totalBytes": 1102,
                                        "url": "https://grow.clearbitjs.com/api/pixel.js?v=1667889173572"
                                    },
                                    {
                                        "totalBytes": 361,
                                        "cacheLifetimeMs": 0,
                                        "cacheHitProbability": 0,
                                        "url": "https://grow.clearbitjs.com/api/c.gif?r=https%3A%2F%2Frapidload.io%2F&c=direct",
                                        "wastedBytes": 361
                                    },
                                    {
                                        "totalBytes": 3122,
                                        "url": "https://static.hotjar.com/c/hotjar-3011767.js?sv=6",
                                        "wastedBytes": 3095.9833333333336,
                                        "cacheLifetimeMs": 60000,
                                        "cacheHitProbability": 0.008333333333333333,
                                        "debugData": {
                                            "max-age": 60,
                                            "type": "debugdata"
                                        }
                                    }
                                ],
                                "type": "table"
                            },
                            "numericValue": 4558.983333333334,
                            "numericUnit": "byte"
                        },
                        "duplicated-javascript": {
                            "id": "duplicated-javascript",
                            "title": "Remove duplicate modules in JavaScript bundles",
                            "description": "Remove large, duplicate JavaScript modules from bundles to reduce unnecessary bytes consumed by network activity. ",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "details": {
                                "type": "opportunity",
                                "overallSavingsBytes": 0,
                                "items": [],
                                "headings": [],
                                "overallSavingsMs": 0
                            },
                            "numericValue": 0,
                            "numericUnit": "millisecond"
                        },
                        "cumulative-layout-shift": {
                            "id": "cumulative-layout-shift",
                            "title": "Cumulative Layout Shift",
                            "description": "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more](https://web.dev/cls/).",
                            "score": 1,
                            "scoreDisplayMode": "numeric",
                            "displayValue": "0.02",
                            "details": {
                                "type": "debugdata",
                                "items": [
                                    {
                                        "totalCumulativeLayoutShift": 0.02041724157619006,
                                        "cumulativeLayoutShiftMainFrame": 0.02041724157619006
                                    }
                                ]
                            },
                            "numericValue": 0.02041724157619006,
                            "numericUnit": "unitless"
                        },
                        "viewport": {
                            "id": "viewport",
                            "title": "Has a `<meta name=\"viewport\">` tag with `width` or `initial-scale`",
                            "description": "A `<meta name=\"viewport\">` not only optimizes your app for mobile screen sizes, but also prevents [a 300 millisecond delay to user input](https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away). [Learn more](https://web.dev/viewport/).",
                            "score": 1,
                            "scoreDisplayMode": "binary",
                            "warnings": []
                        },
                        "long-tasks": {
                            "id": "long-tasks",
                            "title": "Avoid long main-thread tasks",
                            "description": "Lists the longest tasks on the main thread, useful for identifying worst contributors to input delay. [Learn more](https://web.dev/long-tasks-devtools/)",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "5 long tasks found",
                            "details": {
                                "type": "table",
                                "items": [
                                    {
                                        "duration": 288,
                                        "startTime": 2476,
                                        "url": "https://rapidload.io/wp-includes/js/wp-embed.min.js?ver=5.9.3"
                                    },
                                    {
                                        "url": "https://www.gstatic.com/recaptcha/releases/Ixi5IiChXmIG6rRkjUa1qXHT/recaptcha__en.js",
                                        "startTime": 2319,
                                        "duration": 82
                                    },
                                    {
                                        "duration": 74,
                                        "startTime": 554,
                                        "url": "https://rapidload.io/"
                                    },
                                    {
                                        "url": "https://rapidload.io/wp-content/cache/autoptimize/css/autoptimize_f8b0c637da8db000b75d84bab04fa2fb.css",
                                        "startTime": 3430,
                                        "duration": 56
                                    },
                                    {
                                        "duration": 50,
                                        "startTime": 700,
                                        "url": "https://rapidload.io/"
                                    }
                                ],
                                "headings": [
                                    {
                                        "itemType": "url",
                                        "key": "url",
                                        "text": "URL"
                                    },
                                    {
                                        "itemType": "ms",
                                        "granularity": 1,
                                        "key": "startTime",
                                        "text": "Start Time"
                                    },
                                    {
                                        "itemType": "ms",
                                        "granularity": 1,
                                        "key": "duration",
                                        "text": "Duration"
                                    }
                                ]
                            }
                        },
                        "resource-summary": {
                            "id": "resource-summary",
                            "title": "Keep request counts low and transfer sizes small",
                            "description": "To set budgets for the quantity and size of page resources, add a budget.json file. [Learn more](https://web.dev/use-lighthouse-for-performance-budgets/).",
                            "score": null,
                            "scoreDisplayMode": "informative",
                            "displayValue": "91 requests • 2,299 KiB",
                            "details": {
                                "items": [
                                    {
                                        "requestCount": 91,
                                        "label": "Total",
                                        "resourceType": "total",
                                        "transferSize": 2353776
                                    },
                                    {
                                        "label": "Image",
                                        "resourceType": "image",
                                        "transferSize": 783132,
                                        "requestCount": 18
                                    },
                                    {
                                        "requestCount": 40,
                                        "transferSize": 763651,
                                        "resourceType": "script",
                                        "label": "Script"
                                    },
                                    {
                                        "requestCount": 9,
                                        "label": "Font",
                                        "resourceType": "font",
                                        "transferSize": 293884
                                    },
                                    {
                                        "label": "Media",
                                        "transferSize": 226944,
                                        "requestCount": 1,
                                        "resourceType": "media"
                                    },
                                    {
                                        "transferSize": 210965,
                                        "requestCount": 14,
                                        "resourceType": "stylesheet",
                                        "label": "Stylesheet"
                                    },
                                    {
                                        "requestCount": 3,
                                        "label": "Document",
                                        "transferSize": 72493,
                                        "resourceType": "document"
                                    },
                                    {
                                        "requestCount": 6,
                                        "transferSize": 2707,
                                        "resourceType": "other",
                                        "label": "Other"
                                    },
                                    {
                                        "resourceType": "third-party",
                                        "transferSize": 712772,
                                        "label": "Third-party",
                                        "requestCount": 26
                                    }
                                ],
                                "headings": [
                                    {
                                        "text": "Resource Type",
                                        "itemType": "text",
                                        "key": "label"
                                    },
                                    {
                                        "text": "Requests",
                                        "itemType": "numeric",
                                        "key": "requestCount"
                                    },
                                    {
                                        "text": "Transfer Size",
                                        "itemType": "bytes",
                                        "key": "transferSize"
                                    }
                                ],
                                "type": "table"
                            }
                        }
                    },
                    "categories": {
                        "performance": {
                            "id": "performance",
                            "title": "Performance",
                            "score": 0.73,
                            "auditRefs": [
                                {
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
                                {
                                    "id": "interactive",
                                    "weight": 10,
                                    "group": "metrics",
                                    "acronym": "TTI"
                                },
                                {
                                    "id": "speed-index",
                                    "weight": 10,
                                    "group": "metrics",
                                    "acronym": "SI"
                                },
                                {
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
                                {
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
                                        "preload-lcp-image",
                                        "unused-javascript",
                                        "efficient-animated-content",
                                        "total-byte-weight"
                                    ]
                                },
                                {
                                    "id": "cumulative-layout-shift",
                                    "weight": 15,
                                    "group": "metrics",
                                    "acronym": "CLS",
                                    "relevantAudits": [
                                        "layout-shift-elements",
                                        "non-composited-animations",
                                        "unsized-images"
                                    ]
                                },
                                {
                                    "id": "max-potential-fid",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "first-meaningful-paint",
                                    "weight": 0,
                                    "group": "hidden",
                                    "acronym": "FMP"
                                },
                                {
                                    "id": "render-blocking-resources",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-responsive-images",
                                    "weight": 0
                                },
                                {
                                    "id": "offscreen-images",
                                    "weight": 0
                                },
                                {
                                    "id": "unminified-css",
                                    "weight": 0
                                },
                                {
                                    "id": "unminified-javascript",
                                    "weight": 0
                                },
                                {
                                    "id": "unused-css-rules",
                                    "weight": 0
                                },
                                {
                                    "id": "unused-javascript",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-optimized-images",
                                    "weight": 0
                                },
                                {
                                    "id": "modern-image-formats",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-text-compression",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-rel-preconnect",
                                    "weight": 0
                                },
                                {
                                    "id": "server-response-time",
                                    "weight": 0
                                },
                                {
                                    "id": "redirects",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-rel-preload",
                                    "weight": 0
                                },
                                {
                                    "id": "efficient-animated-content",
                                    "weight": 0
                                },
                                {
                                    "id": "duplicated-javascript",
                                    "weight": 0
                                },
                                {
                                    "id": "legacy-javascript",
                                    "weight": 0
                                },
                                {
                                    "id": "preload-lcp-image",
                                    "weight": 0
                                },
                                {
                                    "id": "total-byte-weight",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-long-cache-ttl",
                                    "weight": 0
                                },
                                {
                                    "id": "dom-size",
                                    "weight": 0
                                },
                                {
                                    "id": "critical-request-chains",
                                    "weight": 0
                                },
                                {
                                    "id": "user-timings",
                                    "weight": 0
                                },
                                {
                                    "id": "bootup-time",
                                    "weight": 0
                                },
                                {
                                    "id": "mainthread-work-breakdown",
                                    "weight": 0
                                },
                                {
                                    "id": "font-display",
                                    "weight": 0
                                },
                                {
                                    "id": "resource-summary",
                                    "weight": 0
                                },
                                {
                                    "id": "third-party-summary",
                                    "weight": 0
                                },
                                {
                                    "id": "third-party-facades",
                                    "weight": 0
                                },
                                {
                                    "id": "largest-contentful-paint-element",
                                    "weight": 0
                                },
                                {
                                    "id": "lcp-lazy-loaded",
                                    "weight": 0
                                },
                                {
                                    "id": "layout-shift-elements",
                                    "weight": 0
                                },
                                {
                                    "id": "uses-passive-event-listeners",
                                    "weight": 0
                                },
                                {
                                    "id": "no-document-write",
                                    "weight": 0
                                },
                                {
                                    "id": "long-tasks",
                                    "weight": 0
                                },
                                {
                                    "id": "non-composited-animations",
                                    "weight": 0
                                },
                                {
                                    "id": "unsized-images",
                                    "weight": 0
                                },
                                {
                                    "id": "viewport",
                                    "weight": 0
                                },
                                {
                                    "id": "no-unload-listeners",
                                    "weight": 0
                                },
                                {
                                    "id": "performance-budget",
                                    "weight": 0,
                                    "group": "budgets"
                                },
                                {
                                    "id": "timing-budget",
                                    "weight": 0,
                                    "group": "budgets"
                                },
                                {
                                    "id": "network-requests",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "network-rtt",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "network-server-latency",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "main-thread-tasks",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "diagnostics",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "metrics",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "screenshot-thumbnails",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "final-screenshot",
                                    "weight": 0,
                                    "group": "hidden"
                                },
                                {
                                    "id": "script-treemap-data",
                                    "weight": 0,
                                    "group": "hidden"
                                }
                            ]
                        }
                    },
                    "categoryGroups": {
                        "a11y-color-contrast": {
                            "title": "Contrast",
                            "description": "These are opportunities to improve the legibility of your content."
                        },
                        "budgets": {
                            "title": "Budgets",
                            "description": "Performance budgets set standards for the performance of your site."
                        },
                        "a11y-audio-video": {
                            "title": "Audio and video",
                            "description": "These are opportunities to provide alternative content for audio and video. This may improve the experience for users with hearing or vision impairments."
                        },
                        "metrics": {
                            "title": "Metrics"
                        },
                        "load-opportunities": {
                            "title": "Opportunities",
                            "description": "These suggestions can help your page load faster. They don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
                        },
                        "a11y-aria": {
                            "title": "ARIA",
                            "description": "These are opportunities to improve the usage of ARIA in your application which may enhance the experience for users of assistive technology, like a screen reader."
                        },
                        "a11y-names-labels": {
                            "title": "Names and labels",
                            "description": "These are opportunities to improve the semantics of the controls in your application. This may enhance the experience for users of assistive technology, like a screen reader."
                        },
                        "a11y-navigation": {
                            "title": "Navigation",
                            "description": "These are opportunities to improve keyboard navigation in your application."
                        },
                        "a11y-best-practices": {
                            "title": "Best practices",
                            "description": "These items highlight common accessibility best practices."
                        },
                        "best-practices-ux": {
                            "title": "User Experience"
                        },
                        "best-practices-browser-compat": {
                            "title": "Browser Compatibility"
                        },
                        "best-practices-general": {
                            "title": "General"
                        },
                        "best-practices-trust-safety": {
                            "title": "Trust and Safety"
                        },
                        "diagnostics": {
                            "title": "Diagnostics",
                            "description": "More information about the performance of your application. These numbers don't [directly affect](https://web.dev/performance-scoring/) the Performance score."
                        },
                        "a11y-tables-lists": {
                            "title": "Tables and lists",
                            "description": "These are opportunities to improve the experience of reading tabular or list data using assistive technology, like a screen reader."
                        },
                        "seo-mobile": {
                            "title": "Mobile Friendly",
                            "description": "Make sure your pages are mobile friendly so users don’t have to pinch or zoom in order to read the content pages. [Learn more](https://developers.google.com/search/mobile-sites/)."
                        },
                        "a11y-language": {
                            "title": "Internationalization and localization",
                            "description": "These are opportunities to improve the interpretation of your content by users in different locales."
                        },
                        "seo-content": {
                            "title": "Content Best Practices",
                            "description": "Format your HTML in a way that enables crawlers to better understand your app’s content."
                        },
                        "pwa-optimized": {
                            "title": "PWA Optimized"
                        },
                        "pwa-installable": {
                            "title": "Installable"
                        },
                        "seo-crawl": {
                            "title": "Crawling and Indexing",
                            "description": "To appear in search results, crawlers need access to your app."
                        }
                    },
                    "timing": {
                        "total": 28109
                    },
                    "i18n": {
                        "rendererFormattedStrings": {
                            "varianceDisclaimer": "Values are estimated and may vary. The [performance score is calculated](https://web.dev/performance-scoring/) directly from these metrics.",
                            "opportunityResourceColumnLabel": "Opportunity",
                            "opportunitySavingsColumnLabel": "Estimated Savings",
                            "errorMissingAuditInfo": "Report error: no audit information",
                            "errorLabel": "Error!",
                            "warningHeader": "Warnings: ",
                            "passedAuditsGroupTitle": "Passed audits",
                            "notApplicableAuditsGroupTitle": "Not applicable",
                            "manualAuditsGroupTitle": "Additional items to manually check",
                            "toplevelWarningsMessage": "There were issues affecting this run of Lighthouse:",
                            "crcLongestDurationLabel": "Maximum critical path latency:",
                            "crcInitialNavigation": "Initial Navigation",
                            "lsPerformanceCategoryDescription": "[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.",
                            "labDataTitle": "Lab Data",
                            "warningAuditsGroupTitle": "Passed audits but with warnings",
                            "snippetExpandButtonLabel": "Expand snippet",
                            "snippetCollapseButtonLabel": "Collapse snippet",
                            "thirdPartyResourcesLabel": "Show 3rd-party resources",
                            "runtimeDesktopEmulation": "Emulated Desktop",
                            "runtimeMobileEmulation": "Emulated Moto G4",
                            "runtimeNoEmulation": "No emulation",
                            "runtimeSettingsBenchmark": "CPU/Memory Power",
                            "runtimeSettingsCPUThrottling": "CPU throttling",
                            "runtimeSettingsDevice": "Device",
                            "runtimeSettingsNetworkThrottling": "Network throttling",
                            "runtimeSettingsUANetwork": "User agent (network)",
                            "runtimeUnknown": "Unknown",
                            "dropdownCopyJSON": "Copy JSON",
                            "dropdownDarkTheme": "Toggle Dark Theme",
                            "dropdownPrintExpanded": "Print Expanded",
                            "dropdownPrintSummary": "Print Summary",
                            "dropdownSaveGist": "Save as Gist",
                            "dropdownSaveHTML": "Save as HTML",
                            "dropdownSaveJSON": "Save as JSON",
                            "dropdownViewer": "Open in Viewer",
                            "footerIssue": "File an issue",
                            "throttlingProvided": "Provided by environment",
                            "calculatorLink": "See calculator.",
                            "runtimeSettingsAxeVersion": "Axe version",
                            "viewTreemapLabel": "View Treemap",
                            "showRelevantAudits": "Show audits relevant to:"
                        }
                    },
                    "stackPacks": [
                        {
                            "id": "wordpress",
                            "title": "WordPress",
                            "iconDataURL": "data:image/svg+xml,%3Csvg viewBox=\"0 0 122.5 122.5\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%232f3439\"%3E%3Cpath d=\"M8.7 61.3c0 20.8 12.1 38.7 29.6 47.3l-25-68.7c-3 6.5-4.6 13.7-4.6 21.4zM96.7 58.6c0-6.5-2.3-11-4.3-14.5-2.7-4.3-5.2-8-5.2-12.3 0-4.8 3.7-9.3 8.9-9.3h.7a52.4 52.4 0 0 0-79.4 9.9h3.3c5.5 0 14-.6 14-.6 2.9-.2 3.2 4 .4 4.3 0 0-2.9.4-6 .5l19.1 57L59.7 59l-8.2-22.5c-2.8-.1-5.5-.5-5.5-.5-2.8-.1-2.5-4.5.3-4.3 0 0 8.7.7 13.9.7 5.5 0 14-.7 14-.7 2.8-.2 3.2 4 .3 4.3 0 0-2.8.4-6 .5l19 56.5 5.2-17.5c2.3-7.3 4-12.5 4-17z\"/%3E%3Cpath d=\"M62.2 65.9l-15.8 45.8a52.6 52.6 0 0 0 32.3-.9l-.4-.7zM107.4 36a49.6 49.6 0 0 1-3.6 24.2l-16.1 46.5A52.5 52.5 0 0 0 107.4 36z\"/%3E%3Cpath d=\"M61.3 0a61.3 61.3 0 1 0 .1 122.7A61.3 61.3 0 0 0 61.3 0zm0 119.7a58.5 58.5 0 1 1 .1-117 58.5 58.5 0 0 1-.1 117z\"/%3E%3C/g%3E%3C/svg%3E",
                            "descriptions": {
                                "server-response-time": "Themes, plugins, and server specifications all contribute to server response time. Consider finding a more optimized theme, carefully selecting an optimization plugin, and/or upgrading your server.",
                                "unused-javascript": "Consider reducing, or switching, the number of [WordPress plugins](https://wordpress.org/plugins/) loading unused JavaScript in your page. To identify plugins that are adding extraneous JS, try running [code coverage](https://developer.chrome.com/docs/devtools/coverage/) in Chrome DevTools. You can identify the theme/plugin responsible from the URL of the script. Look out for plugins that have many scripts in the list which have a lot of red in code coverage. A plugin should only enqueue a script if it is actually used on the page.",
                                "render-blocking-resources": "There are a number of WordPress plugins that can help you [inline critical assets](https://wordpress.org/plugins/search/critical+css/) or [defer less important resources](https://wordpress.org/plugins/search/defer+css+javascript/). Beware that optimizations provided by these plugins may break features of your theme or plugins, so you will likely need to make code changes.",
                                "total-byte-weight": "Consider showing excerpts in your post lists (e.g. via the more tag), reducing the number of posts shown on a given page, breaking your long posts into multiple pages, or using a plugin to lazy-load comments.",
                                "uses-text-compression": "You can enable text compression in your web server configuration.",
                                "unminified-javascript": "A number of [WordPress plugins](https://wordpress.org/plugins/search/minify+javascript/) can speed up your site by concatenating, minifying, and compressing your scripts. You may also want to use a build process to do this minification up front if possible.",
                                "uses-long-cache-ttl": "Read about [Browser Caching in WordPress](https://wordpress.org/support/article/optimization/#browser-caching).",
                                "unused-css-rules": "Consider reducing, or switching, the number of [WordPress plugins](https://wordpress.org/plugins/) loading unused CSS in your page. To identify plugins that are adding extraneous CSS, try running [code coverage](https://developer.chrome.com/docs/devtools/coverage/) in Chrome DevTools. You can identify the theme/plugin responsible from the URL of the stylesheet. Look out for plugins that have many stylesheets in the list which have a lot of red in code coverage. A plugin should only enqueue a stylesheet if it is actually used on the page.",
                                "efficient-animated-content": "Consider uploading your GIF to a service which will make it available to embed as an HTML5 video.",
                                "unminified-css": "A number of [WordPress plugins](https://wordpress.org/plugins/search/minify+css/) can speed up your site by concatenating, minifying, and compressing your styles. You may also want to use a build process to do this minification up-front if possible.",
                                "modern-image-formats": "Consider using the [Performance Lab](https://wordpress.org/plugins/performance-lab/) plugin to automatically convert your uploaded JPEG images into WebP, wherever supported.",
                                "uses-optimized-images": "Consider using an [image optimization WordPress plugin](https://wordpress.org/plugins/search/optimize+images/) that compresses your images while retaining quality.",
                                "uses-responsive-images": "Upload images directly through the [media library](https://wordpress.org/support/article/media-library-screen/) to ensure that the required image sizes are available, and then insert them from the media library or use the image widget to ensure the optimal image sizes are used (including those for the responsive breakpoints). Avoid using `Full Size` images unless the dimensions are adequate for their usage. [Learn More](https://wordpress.org/support/article/inserting-images-into-posts-and-pages/).",
                                "offscreen-images": "Install a [lazy-load WordPress plugin](https://wordpress.org/plugins/search/lazy+load/) that provides the ability to defer any offscreen images, or switch to a theme that provides that functionality. Also consider using [the AMP plugin](https://wordpress.org/plugins/amp/)."
                            }
                        }
                    ]
                },
                "analysisUTCTimestamp": "2022-11-08T06:32:50.217Z"
            }
        }

        sampleData = false;

        $('#wp-admin-bar-rapidload_psa div').click(function () {

            $.featherlight('<div id="rapidload-optimizer-dialog"></div>', {
                variant: 'rapidload-optimizer-model',
                afterOpen: function () {

                    if (!sampleData) {
                        $.ajax({
                            url: 'http://localhost:3000/api/v1/gpsi',
                            method: 'POST',
                            data: {
                                url: "https://rapidload.io",
                                include_matrix: true
                            },
                            success: function (result) {
                                render_page(result);
                            }
                        })
                    } else {

                        render_page(sampleData)

                    }
                }
            })
        })

        $('#rapidload-optimizer-dialog').append('<div class="model-footer"><input id="btn-js-optimizer-settings" type="button" value="Save Changes"></div>')

        $('#btn-js-optimizer-settings').click(function () {

            $.ajax({
                url: rapidload_js_optimizer.ajax_url + '?action=update_js_settings',
                method: 'POST',
                data: {
                    post_id: rapidload_js_optimizer.post_id,
                    settings: rapidload_optimized_data
                },
                success: function (result) {

                }
            })

        })

    });

}(jQuery))
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

            var opportunities = sampleData.opportunity;
            var js_related = {}

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

                    $opportunity_html.find('tr.' + js_related[key].id + '-' + index).append('<td class="column-primary"><select class="js-action" data-url="' + row.url + '"><option value="none">None</option><option value="defer">Defer</option><option value="on_user_interaction">On User Interaction</option></select></td>')

                })

            })

            $('#rapidload-optimizer-dialog').append($opportunity_html)

            $('select.js-action').change(function () {

                var $this = $(this)

                var url = $this.data('url')

                set_js_url_action(url, $this.val())

                $('select[data-url="' + url + '"] option[value="' + $this.val() + '"]').attr('selected', 'selected')
            });

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

            window.js_related = js_related;
            window.a = rapidload_optimized_data.js_files
        }

        $('#wp-admin-bar-rapidload_psa div').click(function () {

            $.featherlight('<div id="rapidload-optimizer-dialog"></div>', {
                variant: 'rapidload-optimizer-model',
                afterOpen: function () {

                    $.ajax({
                        url: 'https://api.rapidload.io/api/v1/pagespeed/insights',
                        method: 'POST',
                        data: {
                            url: rapidload_js_optimizer.current_url,
                            include_matrix: true
                        },
                        success: function (result) {
                            render_page(result);
                        }
                    })

                }
            })
        })

    });

}(jQuery))
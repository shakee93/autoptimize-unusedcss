(function ($) {

    $(document).ready(function () {

        rapidload_js_optimizer.current_url = 'https://www.urbanearthstudios.com/';

        window.rapidload_optimized_data = {
            js_files: [],
            css_files: []
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
        
        function runPageSpeed(url){

            if(!url){
                url = $('#page-speed-url').val()
            }

            $.ajax({
                url: rapidload_js_optimizer.ajax_url + '?action=page_speed_insights',
                method: 'POST',
                data: {
                    url: url,
                    include_matrix: true
                },
                success: function (result) {
                    renderInsightResults(result.data.insights);
                }
            })
        }

        function renderInsightResults(sampleData){

            $('#rapidload-optimizer-dialog').find('.opportunity-html').remove()

            var opportunities = sampleData.opportunity;
            var js_related = {}
            var css_related = {}

            var $opportunity_html = $('<div class="opportunity-html"><div>Opportunity</div></div>')
            $opportunity_html.append('<ul class="opportunity"></ul>')

            opportunities.map((opp)=>{

                $opportunity_html.find('ul.opportunity').append('<li class="'+ opp.id +'"><div>' + opp.title + '</div></li>')

                if(opp.details && opp.details.items && opp.details.items.length){

                    var js_items = opp.details.items.filter((i)=>{
                        return i.url && i.url.includes('.js')
                    })

                    var css_items = opp.details.items.filter((i)=>{
                        return i.url && i.url.includes('.css')
                    })

                    var image_items = opp.details.items.filter((i)=>{
                        return i.url && (i.url.includes('.jpeg') || i.url.includes('.jpg'))
                    })

                    var other_items = opp.details.items.filter((i)=>{
                        return i.url && (!js_items.includes(i.url) && !css_items.includes(i.url) && !image_items.includes(i.url))
                    })

                    if(js_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>JS</div><table class="'+ opp.id +' js wp-list-table widefat fixed striped table-view-list posts"><thead><tr class="heading"></tr></thead></table>')
                    }

                    if(css_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>CSS</div><table class="'+ opp.id +' css wp-list-table widefat fixed striped table-view-list posts"><thead><tr class="heading"></tr></thead></table>')
                    }

                    if(image_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>Images</div><table class="'+ opp.id +' images wp-list-table widefat fixed striped table-view-list posts"><thead><tr class="heading"></tr></thead></table>')
                    }

                    if(other_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>Other</div><table class="'+ opp.id +' other wp-list-table widefat fixed striped table-view-list posts"><thead><tr class="heading"></tr></thead></table>')
                    }

                    opp.details.headings.map((h)=>{
                        if(h.label){
                            $opportunity_html.find('li.'+ opp.id +' table.js tr.heading').append('<td class="column-primary">' + h.label + '</td>')
                            $opportunity_html.find('li.'+ opp.id +' table.css tr.heading').append('<td class="column-primary">' + h.label + '</td>')
                            $opportunity_html.find('li.'+ opp.id +' table.images tr.heading').append('<td class="column-primary">' + h.label + '</td>')
                            $opportunity_html.find('li.'+ opp.id +' table.other tr.heading').append('<td class="column-primary">' + h.label + '</td>')
                        }

                    })

                    opp.details.items.map((item, index)=>{

                        var table_class = 'other';

                        if(item.url){
                            if(item.url.includes('.js')){
                                table_class = 'js';
                            }else if(item.url.includes('.css')){
                                table_class = 'css';
                            }else if(item.url.includes('.jpeg') || item.url.includes('.jpg')){
                                table_class = 'images';
                            }
                        }

                        $opportunity_html.find('li.'+ opp.id +' table.' + table_class).append('<tr class="'+ index +'"></tr>')

                        opp.details.headings.map((h)=>{
                            if(h.key === 'node'){
                                //$opportunity_html.find('li.'+ opp.id +' table.' + table_class + ' tr.' + index).append('<td>'+ item[h.key].snippet +'</td>')
                            }else{
                                $opportunity_html.find('li.'+ opp.id +' table.' + table_class + ' tr.' + index).append('<td class="column-primary">'+ (typeof item[h.key].type === 'object' ? JSON.stringify(item[h.key]) : item[h.key]) +'</td>')
                            }

                        })

                        /*if(item.url){

                            if(item.url.includes('.js')){




                                $opportunity_html.find('ul.js.' + opp.id).append('<li>' + item.url + '</li>')
                            }else if(item.url.includes('.css')){
                                $opportunity_html.find('ul.css.' + opp.id).append('<li>' + item.url + '</li>')
                            }else if(item.url.includes('.jpeg') || item.url.includes('.jpg')){
                                $opportunity_html.find('ul.images.' + opp.id).append('<li>' + item.url + '</li>')
                            }else{
                                $opportunity_html.find('ul.other.' + opp.id).append('<li>' + item.url + '</li>')
                            }

                        }*/

                    })

                }

            })

            /*window.rapidload_optimized_data.js_files.map(function (file) {

                $opportunity_html.find('ul').append('<li class="' + file.id + '">' + file.id + '<table class="' + file.id + ' wp-list-table widefat fixed striped table-view-list posts"><tr class="heading"></tr></table></li>')

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

            })*/

            $('#rapidload-optimizer-dialog').append($opportunity_html)

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

            /*$('select.js-action').change(function () {

                var $this = $(this)

                var url = $this.data('url')

                set_js_url_action(url, $this.val())

                $('select[data-url="' + url + '"] option[value="' + $this.val() + '"]').attr('selected', 'selected')
            });*/

            window.js_related = js_related;
            window.a = rapidload_optimized_data.js_files
        }

        function render_page() {

            var $model = $('#rapidload-optimizer-dialog')

            $model.append('<div class="model-optimizer-header"></div>')
            $model.append('<div class="model-optimizer-actions"></div>')

            $model.find('.model-optimizer-header').append('<div style="display: flex"><input style="margin-right: 10px" type="text" class="url" id="page-speed-url"><input id="refresh-page-speed" type="button" value="Refresh Insights"></div>')

            $('#refresh-page-speed').click(function (){
                runPageSpeed()
            })


        }

        $('#wp-admin-bar-rapidload_psa div').click(function () {

            $.featherlight('<div id="rapidload-optimizer-dialog"></div>', {
                variant: 'rapidload-optimizer-model',
                afterOpen: function () {
                    
                    render_page()

                    //runPageSpeed()

                }
            })
        })


    });

}(jQuery))
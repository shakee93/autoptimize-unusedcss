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
                    renderInsightResults(result.data);
                }
            })
        }

        function renderInsightResults(sampleData){

            $('#rapidload-optimizer-dialog').find('.opportunity-html').remove()

            var opportunities = sampleData.insights.opportunity;
            var js_related = {}
            var css_related = {}

            var scripts = sampleData.scripts;

            if(scripts.length){

                $('#rapidload-optimizer-dialog').append('<div class="js-scripts"><table><thead><th>URL</th><th>Action</th></thead><tbody></tbody></table></div>')

                scripts = scripts.filter(function(script){
                    return !script.startsWith('data:text/javascript');
                })

                scripts = scripts.map(function (script){

                    return{
                        action : null,
                        src : script,
                        acronym : []
                    }

                })

            }

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
                        $opportunity_html.find('li.' + opp.id).append('<div>JS</div><table class="'+ opp.id +' js wp-list-table widefat fixed striped table-view-list posts"><thead></thead><tbody></tbody></table>')
                    }

                    if(css_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>CSS</div><table class="'+ opp.id +' css wp-list-table widefat fixed striped table-view-list posts"><thead></thead><tbody></tbody></table>')
                    }

                    if(image_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>Images</div><table class="'+ opp.id +' images wp-list-table widefat fixed striped table-view-list posts"><thead></thead><tbody></tbody></table>')
                    }

                    if(other_items.length){
                        $opportunity_html.find('li.' + opp.id).append('<div>Other</div><table class="'+ opp.id +' other wp-list-table widefat fixed striped table-view-list posts"><thead></thead><tbody></tbody></table>')
                    }

                    opp.details.headings.map((h)=>{
                        if(h.label){
                            $opportunity_html.find('li.'+ opp.id +' table.js thead').append('<th class="column-primary">' + h.label + '</th>')
                            $opportunity_html.find('li.'+ opp.id +' table.css thead').append('<th class="column-primary">' + h.label + '</th>')
                            $opportunity_html.find('li.'+ opp.id +' table.images thead').append('<th class="column-primary">' + h.label + '</th>')
                            $opportunity_html.find('li.'+ opp.id +' table.other thead').append('<th class="column-primary">' + h.label + '</th>')
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

                            scripts = scripts.map(function (script){
                                if(script.src === item.url){
                                    script.acronym.push(opp.acronym.id)
                                }
                            })

                        }

                        $opportunity_html.find('li.'+ opp.id +' table.' + table_class + ' tbody').append('<tr class="'+ index +'"></tr>')

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

            if(scripts.length){
                scripts.map(function (script){
                    var _url = new URL(script.src)
                    _url = _url.origin + '[...]' + _url.href.toString().substr(_url.href.toString().lastIndexOf("/")+1)
                    $('#rapidload-optimizer-dialog .js-scripts table tbody').append('<tr><td>' + _url + '</td><td>Defer</td></tr>')
                })
            }

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
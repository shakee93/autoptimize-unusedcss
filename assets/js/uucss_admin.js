(function ($) {

    function showNotification(heading, message, type = 'info') {
        var container = $('#uucss-wrapper')
        var content = $($('.uucss-info-wrapper.safelist-settings')[0]).clone().css('max-width', '100%');

        if(!content.length){
            return;
        }

        content.find('h4').text(heading);
        content.find('p').remove();
        content.find('.info-details').append('<p class="divider"></p>').append('<p>' + message + '</p>');

        container.prepend('<li class="uucss-notification uucss-notification-'+ type +' uucss-info-wrapper"><div class="content">'+ content.html() +'</div></li>').parent().show()
    }

    function showFaqs() {

        if (window.uucss && window.uucss.faqs.length) {

            var container = $('#uucss-wrapper')
            var content = $($('.uucss-info-wrapper.safelist-settings')[0]).clone().css('max-width', '100%');

            if(!content.length){
                return;
            }

            content.prepend('<h3>Frequently Asked Questions<a id="uucss-faq-read" href="#">close</a></h3>');
            content.find('h4').text(window.uucss.faqs[0].title);
            content.find('h4').attr('data-index',0);
            content.find('.info-icon').remove();
            content.find('p').remove();
            content.find('.info-details').append('<p class="divider"></p>').append('<p class="answer">' + window.uucss.faqs[0].message + '</p>');

            container.prepend('<li class="uucss-notification uucss-notification-faq uucss-info-wrapper"><span class="dashicons dashicons-arrow-left-alt2 prev-faq nav-faq"></span><span class="dashicons dashicons-arrow-right-alt2 next-faq nav-faq"></span><div class="content">'+ content.html() +'</div></li>').parent().show()

            container.find('.uucss-notification-faq .dashicons.nav-faq').click(function () {
                var $this = $(this)
                var $heading = $this.parent().find('h4')
                var $answer = $this.parent().find('p.answer')
                var faq_index = $heading.data('index');
                if($this.hasClass('prev-faq')){
                    if(faq_index === 0){
                        faq_index = window.uucss.faqs.length;
                    }
                    $heading.text(window.uucss.faqs[faq_index-1].title);
                    $answer.html(window.uucss.faqs[faq_index-1].message);
                    $heading.data('index',faq_index-1);
                }else{
                    if(faq_index === window.uucss.faqs.length - 1){
                        faq_index = -1;
                    }
                    $heading.text(window.uucss.faqs[faq_index+1].title);
                    $answer.html(window.uucss.faqs[faq_index+1].message);
                    $heading.data('index',faq_index+1);
                }
            })

            container.find('#uucss-faq-read').click(function (e) {
                e.preventDefault();
                wp.ajax.post('mark_faqs_read',{}).then(function (i) {
                    container.find('.uucss-notification.uucss-notification-faq').remove();
                }).fail(function (i) {

                });
            })
        }

    }

    function showPublicNotices() {
        if (window.uucss && window.uucss.public_notices.length) {
            window.uucss.public_notices.forEach(function(value){
                showNotification(value.title, value.message, value.type);
            })
        }
    }

    function hideNotification() {
        var container = $('.uucss-notification');
        container.hide()
    }

    $(document).ready(function () {

        $.fn.dataTable.ext.errMode = 'none';

        if (window.uucss && window.uucss.notifications.length) {
            window.uucss.notifications.forEach(function (i) {

                showNotification(i.title, i.message, i.type);

            })
        }

        // options page
        window.tagBox.init();

        var $input = $('#uucss_api_key')
        var $uucss_spinner = $('.spinner-history')

        try {
            var _url = new URL(window.location.href);

            if (_url.search.includes('token')) {
                _url.searchParams.delete('token');
                _url.searchParams.delete('nonce');
                history.pushState('', document.title, _url);
            }

            if(_url.search.includes('deactivated')){
                _url.searchParams.delete('deactivated');
                history.pushState('', document.title, _url);
            }

        } catch (e) {

        }

        var whitelist_pack_el = $('#whitelist_packs');
        whitelist_pack_el.select2({
            ajax: {
                url: window.uucss.api + '/whitelist-packs',
                data: function (params) {
                    return {
                        s: params.term,
                        url: window.location.origin
                    };
                },
                headers: {
                    "Authorization": "Bearer " + $input.val(),
                    "Content-Type": "application/json",
                },
                delay: 150,
                cache: true,
                processResults: function (data) {

                    let d = data.data.map(function (item) {

                        return {
                            id: item.id + ":" + item.name,
                            text: item.name
                        }

                    })
                    return {
                        results: d,
                        pagination: {
                            more: false
                        }
                    };
                }
            },
            maximumSelectionLength: 5,
            width: '100%',
        })

        $('#uucss-pack-suggest').click(function () {

            var $button = $(this)
            var oldText = $button.val()

            $button.val('loading..')
            wp.ajax.post('suggest_whitelist_packs').done(function (data) {

                $button.val(oldText)

                if (!data) {
                    return;
                }

                data.forEach(function (item) {

                    if ($("li[title='" + item.name + "']").length === 0) {
                        var newOption = new Option(item.name, item.id + ':' + item.name, true, true);
                        whitelist_pack_el.append(newOption).trigger('change');
                    }

                });

            }).fail(function () {
                $button.val('Load Recommended Packs');
                $('#uucss-pack-suggest-error').text('error : something went wrong, please contact support')

            });

        });

        /*$.each($('span.dashicons.has-tooltip'),function(index, value){
            tippy($(value)[0], {
                content: $($(value)[0]).data('message'),
                allowHTML: true,
                placement: 'auto',
                animation: null,
                theme: 'light',
                interactive: true,
                delay: 0,
                arrow: false,
                offset: [0, 7]
            });
        });*/

        $('#uucss-wrapper li:not(:nth-child(2)) h2').click(function () {
            $(this).parent().find('.content').slideToggle('fast');
            $(this).find('.uucss-toggle-section').toggleClass('rotate')
        });

        var table = $('#uucss-history')

        table.on('init.dt', function () {
            setInterval(refreshTable, 1000 * 5)
        });

        var x = 0;

        table.on('error.dt', function(e, settings, techNote, message){
            $.uucss_log({
                log : message,
            })
        });

        table.on('draw.dt', function (x,y) {

            var element = '<div id="uucss-auto-refresh">' +
                '<input type="checkbox" id="uucss_auto_refresh_frontend" name="autoptimize_uucss_settings[uucss_auto_refresh_frontend]" value="1">' +
                '<label for="uucss_auto_refresh_frontend"> Auto Refresh</label><br>' +
                '<div>';

            $('#uucss-history_info').append(element);
            $('#uucss_auto_refresh_frontend').change(function () {
                $('#uucss_auto_refresh_frontend-hidden').val($(this).is(':checked') ? 1 : 0);
                auto_refresh = $(this).is(':checked');
            });
            $('#uucss_auto_refresh_frontend').prop('checked', auto_refresh);

            var select = $('<select class="status">' +
                    '<option value="" ' + (status_filter === ''? 'selected' : '') +'>All</option>' +
                    '<option value="success" ' + (status_filter === 'success'? 'selected' : '') +'>Success</option>' +
                    '<option value="warning" ' + (status_filter === 'warning'? 'selected' : '') +'>Warning</option>' +
                    '<option value="failed" ' + (status_filter === 'failed'? 'selected' : '') +'>Failed</option>' +
                    '<option value="queued" ' + (status_filter === 'queued'? 'selected' : '') +'>Queued</option>' +
                    '<option value="processing" ' + (status_filter === 'processing'? 'selected' : '') +'>Processing</option>' +
                '</select>');

            var input = '<div class="uucss-url-search-wrap"><input type="search" placeholder="Search" value="'+ url_filter +'"><input class="uucss_search_exact" type="checkbox" id="uucss_search_exact" value="1"></div>';
            $(input).prependTo($('#uucss-history_info'));

            $(select).prependTo($('#uucss-history_info'));

            $('#uucss-history_info select.status').on('change', function(){
                status_filter = $(this).val();
                table.column(4).search( status_filter ? '^'+ status_filter +'$' : '', true, false )
                    .draw();
            });

            tippy($('.uucss_search_exact')[0], {
                content: 'Exact Match',
                placement: 'top',
                appendTo: 'parent',
            });

            var $input = $('#uucss-history_info input[type="search"]')
            var $exact_search = $('#uucss-history_info input.uucss_search_exact')

            $input.on('input',function () {
                url_filter = $(this).val();

                var regex = url_filter;

                if(exact_search_val){
                    regex = '^' + url_filter + '$';
                }

                table.column(1).search( url_filter ? regex : '', true, false )
                    .draw();
            });

            $exact_search.on('change',function () {
                exact_search_val = $(this).prop('checked');
            });

            if(url_filter !== ''){
                $input.focus().val('').val(url_filter);
            }

            $exact_search.prop('checked', exact_search_val);

            $('#uucss-history tbody tr').off();
            $('#uucss-history tbody tr').click(function () {
                $(this).toggleClass('selected');
            });
        });

        var auto_refresh = $('#uucss_auto_refresh_frontend-hidden').val() == '1';
        var firstReload = true;

        var status_filter = '';
        var url_filter = '';
        var exact_search_val = false;

        $uucss_spinner.addClass('loading')
        table = table.DataTable({
            serverSide: true,
            processing: false,
            language: {
                processing: '<span class="spinner loading"></span>'
            },
            ajax: {
                beforeSend() {
                    !$uucss_spinner.hasClass('loading') && $uucss_spinner.addClass('loading');
                },
                url: wp.ajax.settings.url + '?action=uucss_data',
                data: function (d) {

                    if(status_filter !== "" && status_filter !== undefined){
                        if(d.columns[0] && d.columns[0].search){
                            d.columns[0].search.value = status_filter
                        }
                    }

                    if(url_filter !== "" && url_filter !== undefined){
                        if(d.columns[1] && d.columns[1].search){
                            d.columns[1].search.value = url_filter;
                            d.columns[1].search.regex = exact_search_val
                        }
                    }

                    d.nonce = uucss.nonce

                    return d;
                },
                dataSrc: function (d) {
                    $uucss_spinner.removeClass('loading')

                    if (!d.success) {
                        $.uucssAlert("failed to fetch data", 'error')
                        return [];
                    }

                    var results = d.data;

                    if (results.length < 3 && firstReload) {
                        showNotification(
                            'Tip : When will I see the results ?',
                            'The plugin will trigger the removal of unused css whenever a page is loaded for the first time. Completed jobs are listed below.'
                        );
                    }

                    var queued_jobs = results.filter(function (file) {
                        return file.status === 'queued';
                    });

                    var success_jobs = results.filter(function (file) {
                        return file.status === 'success';
                    });

                    if (queued_jobs.length > 3 && success_jobs.length === 0 && firstReload) {
                        showNotification(
                            'Caution : Please verify cron your job is working!',
                            'We have noticed some amount of jobs are still on processing and not completed. It maybe because your sites cron is not working properly.'
                        );
                    }
                    firstReload = false;
                    return results;
                }
            },
            searching: true,
            pagingType: "simple",
            bLengthChange: false,
            tfoot: false,
            //lengthChange : true,
            bSort: false,
            columns: [
                {
                    "data": "status",
                    title: "Status",
                    width: '40px',
                    className: 'dt-body-center dt-head-center',
                    render: function (data, type, row, meta) {
                        var classNames = 'status ';
                        if(data === 'queued' || data === 'processing'){
                            classNames += 'refresh ';
                        }
                        classNames += data + ' ';
                        return '<span class="' + classNames +'">'+ data +'</span>'
                    },
                },
                {
                    "data": "url",
                    title: "URL",
                    className: "url",
                    render(data) {

                        if (!data) {
                            return '';
                        }

                        return '<a href="'+ decodeURI(data) +'" target="_blank">'+ decodeURI(data) +'</a>';
                    }
                },
                {
                    data: "url",
                    className: 'dt-body-center dt-head-center stats th-reduction',
                    title: "File Size Reduction",
                    width: '145px',
                    render: function (data, type, row, meta) {
                        if (row.status === 'success') {
                            return row.meta.stats.reduction + '%'
                        }else if(row.status === 'queued' || row.status === 'processing'){
                            return '<span class="job-file-size">-</span>';
                        }

                        return '0 KB'
                    },
                    createdCell: function (td, cellData, rowData) {

                        var innerTippy
                        var innerTippy2

                        var stat = $(td).wrapInner($('<span></span>'));

                        var $warnings_html = $('<div class="uucss-warnings"></div>');

                        if(rowData.meta.warnings && rowData.meta.warnings.length){
                            var scrollable = rowData.meta.warnings.length > 2 ? 'scrollable' : '';
                            $warnings_html.append('<h5 class="warnings-title ">Warnings (' + rowData.meta.warnings.length  + ')</h5>');
                            $warnings_html.append('<ul class="warning-list ' + scrollable  + '"></ul>');
                            $.each(rowData.meta.warnings, function(index, value){
                                var $warning_html = $('<li class="warning"></li>')
                                $warning_html.append('<div class="warning-info"></div>');
                                $warning_html.find('.warning-info').append('<p class="warning-header">' +  value.message + '</p>');
                                if(value.file){
                                    $warning_html.find('.warning-info').append('<p class="warning-content"><a href="' + value.file +'" target="_blank">' +  value.file + '</a></p>');
                                }
                                $warnings_html.find('.warning-list').append($warning_html.wrap('<div></div>').parent().html())
                            })
                        }else{
                            $warnings_html.removeClass('uucss-warnings');
                        }

                        var attemptsString = '';

                        if(Number(rowData.attempts) !== 0){
                            attemptsString = 'Attempts : ' + rowData.attempts
                        }else if(Number(rowData.attempts) === 0 && rowData.meta && rowData.meta.stats && rowData.meta.stats.success_count){
                            attemptsString = 'Hits : ' + rowData.meta.stats.success_count
                        }

                        var tippyOptions = {
                            theme: 'light',
                            triggerTarget: stat.find('span')[0],
                            content: function () {
                                var c = $('<div class="stat-tooltip">' +
                                    '       <div class="progress-bar-wrapper">' +
                                    '           <div class="progress-bar w-100">' +
                                    '               <span style="width:' + (100 - rowData.meta.stats.reduction) + '%">' + (100 - rowData.meta.stats.reduction).toFixed() + '%' +
                                    '               </span>' +
                                    '           </div>' +
                                    '       </div>' +
                                    $warnings_html.wrap('<div></div>').parent().html() +
                                    '<div class="time">' +
                                    '   <p class="val uucss-show-job-details">Created at ' +
                                    new Date(rowData.time * 1000).toLocaleDateString() + ' ' + new Date(rowData.time * 1000).toLocaleTimeString() +
                                    '   </p>' +
                                    '   <p class="attempts">' +
                                    attemptsString +
                                    '   </p>' +
                                    '</div>' +
                                    '</div>');

                                innerTippy = tippy(c.find('.progress-bar-wrapper')[0], {
                                    content: 'Before RapidLoad <span class="perc">' + rowData.meta.stats.before + '</span>',
                                    allowHTML: true,
                                    placement: 'bottom-end',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'tomato',
                                    interactive: true,
                                    delay: 0,
                                    offset: [0, 7],
                                    inlinePositioning: true,
                                })

                                innerTippy2 = tippy(c.find('.progress-bar')[0], {
                                    content: 'After RapidLoad <span class="perc"> ' + rowData.meta.stats.after + '</span>',
                                    allowHTML: true,
                                    placement: 'top-start',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'ketchup',
                                    interactive: true,
                                    delay: 0,
                                    inlinePositioning: true,
                                })

                                return c[0]
                            },
                            placement: 'left',
                            //trigger: 'click',
                            interactive: true,
                            allowHTML: true,
                            animation: "shift-toward-extreme",
                            appendTo: "parent",
                            onShow: function () {
                                innerTippy.show()
                                innerTippy2.show()
                            },
                            onShown: function (instance) {
                                $(instance.popper).find('.progress-bar.w-100').removeClass('w-100')
                                $('.uucss-show-job-details')
                                    .featherlight('<div><div class="code"><pre><code>'+ JSON.stringify(rowData, undefined, 2) +'</code></pre></div></div>',{
                                        variant : 'uucss-job-details'
                                    })
                            },
                            onHide: function (instance) {
                                innerTippy.hide()
                                innerTippy2.hide()
                                $(instance.popper).find('.progress-bar').addClass('w-100')
                            }

                        }



                        if (rowData.status === 'failed') {
                            stat.find('span').append('<span class="dashicons dashicons-info error"></span>');

                            tippyOptions.onShow = function () {
                            }
                            tippyOptions.onHide = function () {
                            }

                            var code = (rowData.meta.error.code) ? rowData.meta.error.code : 500;
                            tippyOptions.content = '<div class="error-tooltip"><h5>Error</h5> <span><strong>CODE :</strong> ' + code + '</span> <br><span>' + rowData.meta.error.message + '</span></div>';

                            //tippyOptions.triggerTarget = $(td).closest('tr')[0]
                            tippy(stat.find('span')[0], tippyOptions);
                            return
                        }

                        if (rowData.status === 'success' && (!rowData.meta.warnings || !rowData.meta.warnings.length)) {
                            stat.find('span').append('<span class="dashicons dashicons-yes-alt"></span>');
                            tippy(stat.find('span')[0], tippyOptions);
                        } else if (rowData.status === 'success' && rowData.meta.warnings.length) {
                            stat.find('span').append('<span class="dashicons dashicons-warning"></span>');
                            tippy(stat.find('span')[0], tippyOptions);
                        }

                    }
                },
                {
                    "data": "url",
                    className: 'dt-body-right dt-head-right action th-actions',
                    "targets": 0,
                    title: "Actions",
                    width: '60px',
                    render: function (data, type, row, meta) {
                        var _render = '';

                        _render += '<button data-uucss-optimize data-url="' + data + '"><span class="dashicons dashicons-update"></span></button>'

                        _render += '<button data-uucss-options data-url="' + data + '"><span class="dashicons dashicons-ellipsis"></span></button>';

                        return _render;
                    },
                },
                {
                    "data": "meta",
                    visible : false,
                    render: function (data, type, row, meta) {
                        if (data.warnings && data.warnings.length > 0) return 'warning';
                        return data.status;
                    }
                }
            ],
            rowCallback: function (row, data, displayNum, displayIndex, dataIndex) {

                tippy($(row).find('button[data-uucss-options]')[0], {
                    allowHTML: true,
                    trigger: 'click',
                    arrow: true,
                    appendTo: $(row).find('button[data-uucss-options]')[0],
                    interactive: true,
                    animation: 'shift-toward',
                    hideOnClick: true,
                    theme: 'light',
                    content: ()=>{

                        var $content = $('<div class="uucss-option-list"><ul class="option-list"></ul></div>')

                        if(data.status === 'success'){
                            $content.find('ul').append('<li data-action_name="test"><a data-action_name="test" href="#">GPSI Status</a></li>')
                        }

                        if($('#thirtd_part_cache_plugins').val() === "1"){
                            $content.find('ul').append('<li data-action_name="purge-url"><a data-action_name="purge-url" href="#">Clear Page Cache</a></li>');
                        }

                        $content.find('ul').append('<li data-action_name="remove"><a data-action_name="remove" href="#">Remove</a></li>');

                        return $content.wrap('<div></div>').parent().html();
                    },
                    onClickOutside(instance, event) {
                        instance.hide()
                    },
                    onCreate(){

                        tippy($('.uucss-option-list ul.option-list li[data-action_name="remove"]')[0], {
                            content: 'Remove RapidLoad cache files',
                            allowHTML: true,
                            placement: 'left',
                            hideOnClick: false,
                            animation: null,
                            interactive: true,
                            delay: 0,
                            inlinePositioning: true,
                            maxWidth: 500,
                            appendTo: 'parent'
                        })

                        tippy($('.uucss-option-list ul.option-list li[data-action_name="test"]')[0], {
                            content: 'Test Url',
                            allowHTML: true,
                            placement: 'left',
                            hideOnClick: false,
                            animation: null,
                            interactive: true,
                            delay: 0,
                            inlinePositioning: true,
                            maxWidth: 500,
                            appendTo: 'parent'
                        });

                    },
                    onMount(instance) {

                        $('.uucss-option-list ul.option-list li a').off().click(function (e) {

                            var $this = $(this);

                            var action = $this.data('action_name');

                            switch (action) {
                                case 'remove':{
                                    uucss_purge_url(data.url, true, row, dataIndex, data)
                                    break;
                                }
                                case 'purge-url':{

                                    wp.ajax.post('clear_page_cache',{ url : data.url }).then(function (i) {

                                        $.uucssAlert(i, 'success')

                                    }).fail(function (i) {

                                        $.uucssAlert(i, 'error')
                                    });

                                    break;
                                }
                                case 'test':{

                                    if($this.data('fetching')){
                                        return;
                                    }

                                    $.ajax({
                                        method : 'POST',
                                        url: wp.ajax.settings.url + '?action=uucss_test_url',
                                        data : {
                                            url: data.url,
                                        },
                                        beforeSend(){
                                            $this.data('fetching', true);
                                        },
                                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                                            var $feather_content = $('.featherlight.uucss-gpsi-test .featherlight-content');
                                            var $content = $('<div class="content"></div>');
                                            $content.append('<span>Something went wrong</span>');
                                            $feather_content.find('.spinner').remove();
                                            $feather_content.append($content.wrap('<div></div>').parent().html());
                                        },
                                        success: function (response) {
                                            var $feather_content = $('.featherlight .featherlight-content');
                                            var $content = $('<div class="content"></div>');
                                            $content.append('<div class="header"></div>');
                                            $content.append('<div class="devider"></div>');
                                            $content.append('<div class="description"></div>');

                                            if(response.success && response.data && ( response.data.injected || response.data.success) && response.data.injectedCSS > 0){

                                                $content.find('.header').append('<h2><span class="js-gpsi-reult dashicons dashicons-yes-alt"></span>Success</h2>')
                                                $content.find('.description').append('<p>Optimization is now reflected in Google Page Speed Insight, GT Metrix and all other page speed testing tools.</p>')

                                            }else if(response.success && response.data && response.data.injected){

                                                $content.find('.header').append('<h2><span class="js-gpsi-reult dashicons dashicons-warning"></span>Pending</h2>')
                                                $content.find('.description').append('<p>Your optimization is yet to be reflected on Google Page Insight, GT Metrix and all other page speed testing tools.</p>')

                                            }else{

                                                $content.find('.header').append('<h2><span class="js-gpsi-reult dashicons dashicons-no"></span>Error</h2>');
                                                var error_message = typeof response.data === 'string' ? response.data : 'Something went wrong';
                                                $content.find('.description').append('<p>' + error_message + '</p>');
                                            }

                                            if(response.success && response.data && response.data.success){

                                                const with_uucss = new URL(response.data.url);
                                                const without_uucss = new URL(response.data.url);
                                                without_uucss.searchParams.append('no_uucss','');

                                                $content.find('.description').html('<p>' + $content.find('.description').text() + ' Compare your page speed scores:' + '</p>')
                                                $content.find('.description').append('<p class="test-site-links-heading without-rapidload"><strong>Without RapidLoad</strong></p>');
                                                $content.find('.description').append('<ul class="test-site-links test-site-links-without"></ul>');
                                                $content.find('.test-site-links-without').append('<li class="test-site-link"><a href="https://gtmetrix.com/?url='+ without_uucss.toString().replace('no_uucss=','no_uucss') +'" target="_blank">GT Metrix</a></li>')
                                                $content.find('.test-site-links-without').append('<li class="test-site-link"><a href="https://developers.google.com/speed/pagespeed/insights/?url='+ without_uucss.toString().replace('no_uucss=','no_uucss') +'" target="_blank">Google Insights</a></li>')


                                                $content.find('.description').append('<p class="test-site-links-heading with-rapidload"><strong>RapidLoad</strong></p>');
                                                $content.find('.description').append('<ul class="test-site-links test-site-links-with"></ul>');
                                                $content.find('.test-site-links-with').append('<li class="test-site-link"><a href="https://gtmetrix.com/?url='+ with_uucss.toString() +'" target="_blank">GT Metrix</a></li>')
                                                $content.find('.test-site-links-with').append('<li class="test-site-link"><a href="https://developers.google.com/speed/pagespeed/insights/?url='+ with_uucss.toString() +'" target="_blank">Google Insights</a></li>')
                                            }

                                            $feather_content.find('.spinner').remove();
                                            $feather_content.append($content.wrap('<div></div>').parent().html());

                                            if(response.success && response.data){
                                                $('.js-gpsi-reult')
                                                    .featherlight('<div><div class="code"><pre><code>'+ JSON.stringify(response.data, undefined, 2) +'</code></pre></div></div>',{
                                                        variant : 'uucss-gpsi-result-details'
                                                    })
                                            }
                                        },
                                        complete:function () {
                                            $this.data('fetching', false);
                                        }
                                    });

                                    break;
                                }
                                default:{
                                    break;
                                }
                            }
                        })

                        $('.uucss-option-list ul.option-list li a[data-action_name="test"]')
                            .featherlight('<div class="spinner loading"></div>',{
                                variant : 'uucss-gpsi-test'
                            })
                    },
                    placement: 'bottom-end',
                })

                tippy($(row).find('button[data-uucss-optimize]')[0], {
                    content: 'Refresh files Immediately',
                    placement: 'top',
                    appendTo: "parent"
                })

                $(row).find('button').data('index',dataIndex);

                $(row).find('button[data-uucss-options]').off('click').click(function (e) {
                    e.preventDefault();
                });

                $(row).find('button[data-uucss-optimize]').off('click').click(function (e) {
                    e.preventDefault()

                    var is_clear = (typeof $(this).data().uucssClear === 'string')

                    uucss_purge_url(data.url, is_clear, row, dataIndex, data)

                });

                $(row).find('button[data-uucss-optimize]').off('click').click(function (e) {
                    e.preventDefault()

                    var is_clear = (typeof $(this).data().uucssClear === 'string')

                    uucss_purge_url(data.url, is_clear, row, dataIndex, data)

                });
            }
        });

        $('button.uucss-add-site-urls-submenu').off('click').click(function (e) {
            e.preventDefault();
        });

        function requeue(post_type){
            wp.ajax.post('uucss_queue',{
                url : '',
                post_type : post_type,
            }).then(function (i) {
                if(table){
                    table.ajax.reload(null, false);
                }
            });
        }

        tippy($('button.uucss-add-site-urls-submenu')[0], {
            allowHTML: true,
            trigger: 'click',
            arrow: true,
            appendTo: $('button.uucss-add-site-urls-submenu')[0],
            interactive: true,
            animation: 'shift-toward',
            hideOnClick: true,
            theme: 'light',
            content: ()=>{

                var $content = $('<div class="uucss-submenu-option-list"><ul class="option-list"></ul></div>')

                $content.find('ul').append('<li data-action_name="requeue_all"><a data-action_name="requeue_all" href="#">Requeue All</a></li>');
                $content.find('ul').append('<li data-action_name="requeue_warnings"><a data-action_name="requeue_warnings" href="#">Requeue Warnings</a></li>');
                $content.find('ul').append('<li data-action_name="requeue_failed"><a data-action_name="requeue_failed" href="#">Requeue Failed</a></li>');
                $content.find('ul').append('<li data-action_name="remove_all"><a data-action_name="remove_all" href="#">Remove All</a></li>');

                if($('#thirtd_part_cache_plugins').val() === "1"){
                    $content.find('ul').append('<li data-action_name="clear_warnings_cache"><a data-action_name="clear_warnings_cache" href="#">Clear Cache</a></li>');
                }


                return $content.wrap('<div></div>').parent().html();
            },
            onClickOutside(instance, event) {
                instance.hide()
            },
            onCreate(){

            },
            onMount(instance) {

                $('.uucss-submenu-option-list ul.option-list li a').off().click(function (e) {

                    var $this = $(this);

                    var action = $this.data('action_name');

                    switch (action) {
                        case 'requeue_all':{
                            requeue('current');
                            $.uucssAlert('links added to queue');
                            break;
                        }case 'requeue_warnings':{
                            requeue('warnings');
                            $.uucssAlert('links added to queue');
                            break;
                        }case 'requeue_failed':{
                            requeue('failed');
                            $.uucssAlert('links added to queue');
                            break;
                        }case 'remove_all':{
                            var url_list = [];
                            if(table.rows('.selected').data().length){
                                $.each(table.rows('.selected').data(), function(table_row_index, table_row_value){
                                    url_list.push(table_row_value.url)
                                });
                            }
                            wp.ajax.post('uucss_purge_url',{
                                url : '',
                                url_list : url_list,
                                clear : true,
                                nonce: uucss.nonce
                            }).then(function (i) {
                                if(table){
                                    table.ajax.reload(null, false);
                                    $.uucssAlert('links removed from list', 'info');
                                }
                            });
                            break;
                        }
                        case 'clear_warnings_cache':{
                            wp.ajax.post('clear_page_cache',{ status : 'warnings' }).then(function (i) {

                                $.uucssAlert(i, 'success')

                            }).fail(function (i) {

                                $.uucssAlert(i, 'error')
                            });
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                })
            },
            placement: 'bottom-end',
        })

        function uucss_purge_url(url , isClear, row, index, data) {

            var _row = table.row(index);

            var $row  = $(row);

            $row.addClass('loading');

            $uucss_spinner.addClass('loading');

            if (!isClear) {
                $(this).hide();
            }

            $.ajax({
                method : 'POST',
                url: wp.ajax.settings.url + '?action=uucss_purge_url',
                data : {
                    url: data.url,
                    clear: isClear,
                    nonce: uucss.nonce
                },
                success : function(response){

                    $uucss_spinner.removeClass('loading')

                    if(response.success){

                        if (isClear) {
                            (_row.length>0) && _row.remove().draw();
                        }else{
                            data.status = 'queued';
                            _row.data(data).draw(false);
                        }
                    }

                },
                complete:function () {
                    $row.removeClass('loading')
                }
            });
        }

        function refreshTable(){
            var $queuedJobs = $('#uucss-history tr td span.status.refresh');

            if(!auto_refresh || $('.tippy-content').length || $('html.with-featherlight').length){
                return;
            }

            $uucss_spinner.addClass('loading')
            table.ajax.reload(null, false);
        }

        function validateJobPerQue(value, reset) {

            var max = $('#uucss_queue_interval option[value="'+ value +'"]').data('max');

            var options = $('#uucss_jobs_per_queue option');

            $.each(options, function (element) {
                $(options[element]).attr('disabled', $(options[element]).val() > max)
            });
           if(reset){
               $('#uucss_jobs_per_queue').val($(options[0]).val());
           }
        }

        $('#uucss_queue_interval').change(function () {
             validateJobPerQue($(this).val(), true)
        });

        validateJobPerQue($('#uucss_queue_interval').val(), false);

        updateLicense();

        $('#uucss-deactivate').click(function (e) {
            e.preventDefault()
            let $this = $(this)
            $this.text('deactivating...');

            wp.ajax.post('uucss_deactivate').done(function (r) {
                $this.text('deactivated');
                window.location.reload()
            })
        });

        $('a.connect-with-license').click(function (e) {
            e.preventDefault();
        });

        tippy('a.connect-with-license', {
            allowHTML: true,
            arrow: false,
            appendTo: $('a.connect-with-license')[0],
            interactive: true,
            animation: 'shift-toward',
            placement: 'top-start',
            trigger: 'click',
            hideOnClick: false,
            theme: 'light',
            maxWidth: 500,
            onClickOutside(instance, event) {
                instance.hide()
            },
            content: function () {
                var content;
                content = '<div class="tippy-connect-with-license">' +
                    '               <div class="tippy-connect-with-license-content">' +
                    '                   <div class="header-text">' +
                    '                       <p>Enter your License Key below</p>' +
                    '                   </div>' +
                    '                   <div class="input-wrap">' +
                    '                       <input type="text"  placeholder="License Key" class="uucss-key">' +
                    '                       <a href="#" class="connect">Connect</a>' +
                    '                   </div>' +
                    '                   <div><p class="uucss-key-error"></p></div>' +
                    '               </div>' +
                    '          </div>';
                return content;
            },
            onMount(instance){
                $('a.connect-with-license .tippy-connect-with-license-content input.uucss-key').focus();
                $('a.connect-with-license .tippy-connect-with-license-content .input-wrap .connect').click(function (e) {
                    e.preventDefault();

                    var license_key = $('a.connect-with-license .tippy-connect-with-license-content .input-wrap input').val();

                    if(license_key === ''){
                        $.uucssAlert('Please enter license key', 'error');
                        return;
                    }

                    var $target = $(this);

                    $target.text('Connecting...');
                    $target.removeAttr('href');

                    wp.ajax.post('uucss_connect',{ license_key : license_key }).then(function (i) {

                        if(i.success){
                            window.location.href = window.location.href + '&token=' + license_key + '&nonce=' + i.activation_nonce
                        }

                    }).fail(function (i) {

                        $target.text('Connect');
                        $target.attr('href','#');
                        $('a.connect-with-license p.uucss-key-error').text(i);

                    })

                })
            }
        });

        function isUrl(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        $('#model-requeue-post-type').change(function () {
            $model_content = $('.featherlight.add-site-url-model');

            if($(this).val() === 'site_map' || $(this).val() === 'url'){
                $(this).val() === 'site_map' && $model_content.find('input.site-map-url').attr('placeholder', 'https://example.com/sitemap_index.xml');
                $(this).val() === 'url' && $model_content.find('input.site-map-url').attr('placeholder', 'https://example.com/');
                !$model_content.find('input.site-map-url').hasClass('show') && $model_content.find('input.site-map-url').addClass('show')
                !$model_content.hasClass('show-url') && $model_content.addClass('show-url')
            }else{
                $model_content.find('input.site-map-url').hasClass('show') && $model_content.find('input.site-map-url').removeClass('show')
                $model_content.hasClass('show-url') && $model_content.removeClass('show-url')
            }
        });

        $('#model-queue-posts-type').click(function () {
            $model_content = $('.featherlight #add_url_featherlight_content');

            if(($model_content.find('#model-requeue-post-type').val() === 'site_map' || $model_content.find('#model-requeue-post-type').val() === 'url')
                && ($model_content.find('input.site-map-url').val() === "" || $model_content.find('input.site-map-url').val() === undefined)){
                $.uucssAlert('Please enter url', 'error');
                return;
            }

            if(($model_content.find('#model-requeue-post-type').val() === 'site_map' || $model_content.find('#model-requeue-post-type').val() === 'url')
                && !isUrl($model_content.find('input.site-map-url').val())){
                $.uucssAlert('Please enter valid url', 'error');
                return;
            }

            var $target = $(this);

            $target.attr('disabled', true);
            $target.val('Please wait....');

            wp.ajax.post('uucss_queue',{
                post_type : $model_content.find('#model-requeue-post-type').val(),
                url : $model_content.find('input.site-map-url').val()
            }).then(function (i) {
                $.uucssAlert(i);
                var currentFeather = $.featherlight.current();
                if(currentFeather) currentFeather.close();
                $target.attr('disabled', false);
                $target.val('Add');
            }).fail(function (i) {
                $.uucssAlert(i, 'error');
                $target.attr('disabled', false);
                $target.val('Add');
            })
        });

        $('p.more-info-uucss-status').click(function (e) {
            e.preventDefault();
            var $info = $('.rapidload-status .uucss-status-more-info');
            if($info.css('display') === "block"){
                $info.slideUp();
            }else{
                $info.slideDown();
            }

        })

        showPublicNotices();
        showFaqs();
    });


    function updateLicense() {

        if(uucss.api_key_verified === ""){
            return;
        }

        var container = $('.license-info')

        container.addClass('loading');

        wp.ajax.post('uucss_license').then(function (i) {
            $('.license-info ul').show();

            $('#license-name').text(i.name)
            $('#license-email').text(i.email)
            $('#license-next_billing').text(new Date(i.next_billing * 1000).toLocaleDateString())
            $('#license-plan').text(i.plan)
            $('#license-domain').text(i.siteUrl)

            container.removeClass('loading');
        }).fail(function (i) {
            $('.license-info ul').hide()
            $('.license-info #license-message').show().html('Sorry, we couldn\'t collect license information of yours.')
            container.removeClass('loading');
        })

        tippy('.uucss-support a', {
            allowHTML: true,
            arrow: false,
            appendTo: 'parent',
            animation: 'shift-toward',
            placement: 'top-end',
            content: function () {
                var el = document.getElementById('uucss-support-tooltip');
                el.style.display = 'inline-block';
                return el
            }
        });

    }

}(jQuery))
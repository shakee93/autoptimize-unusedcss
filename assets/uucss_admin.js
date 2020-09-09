(function ($) {

    $(document).ready(function () {

        // options page
        window.tagBox.init();

        var $status = $('#verification_status')
        var $input = $('#uucss_api_key')
        var $verified = $('input[name="autoptimize_uucss_settings[uucss_api_key_verified]"]')
        var $packs = $('input[name="autoptimize_uucss_settings[uucss_whitelist_packs]"]')

        function verifyApiKey() {

            $verified.val(undefined)
            if ($input.val().length === 0) {
                $status.removeClass().text('please fill your api key here !');
                return;
            }

            $status.text('loading...')

            wp.ajax.post('verify_api_key', {api_key: $input.val()}).done(function () {

                $verified.val('1')
                $status.text('verified !').removeClass().addClass('success')

                // autoload whitelist packs
                if ($('[name="autoptimize_uucss_settings[uucss_api_key_verified]"]').val() === '1' && $('#whitelist_packs').select2('data').length === 0) {
                    console.log('inside');
                    $('#uucss-pack-suggest').trigger('click')
                }

            }).fail(function () {

                $verified.val(undefined)
                $status.text('failed !').removeClass().addClass('failed')

            });

        }

        // verifyApiKey()
        // $input.on('input', verifyApiKey)

        var whitelist_pack_el = $('#whitelist_packs');
        whitelist_pack_el.select2({
            ajax: {
                url: window.uucss.api + '/whitelist-packs',
                data: function (params) {
                    return {
                        s: params.term,
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
            wp.ajax.post('suggest_whitelist_packs', {}).done(function (data) {

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

                $('#uucss-pack-suggest-error').text('error : something went wrong, please contact support')

            });

        });


        $('#uucss-wrapper li h2').click(function () {
            $(this).parent().find('.content').slideToggle('fast');
            $(this).find('.uucss-toggle-section').toggleClass('rotate')
        });

        var table = $('#uucss-history')

        table = table.DataTable({
            ajax: {
                url: wp.ajax.settings.url + '?action=uucss_data',
                data: function (d) {
                    d.nonce = uucss.nonce

                    return d;
                },
                dataSrc: function (d) {

                    if (!d.success) {
                        alert(d.data)
                        return [];
                    }

                    return Object.values(d.data).sort(function (a, b) {
                        return b.time = a.time
                    });
                }
            },
            searching: false,
            pagingType: "simple",
            bLengthChange: false,
            tfoot: false,
            bSort: false,
            columns: [
                {
                    "data": "status",
                    title: "Status",
                    width: '40px',
                    className: 'dt-body-center dt-head-center',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).wrapInner($('<span></span>').addClass(cellData))
                    }
                },
                {
                    "data": "url",
                    title: "Link",
                    className: "url",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).wrapInner($('<a></a>').attr('href', cellData).attr('target', '_blank'))
                    },
                    render(data) {
                        return decodeURI(data)
                    }
                },
                {
                    data: "url",
                    className: 'dt-body-center dt-head-center stats',
                    title: "Removed unused CSS 🔥",
                    width: '145px',
                    render: function (data, type, row, meta) {
                        if (row.status === 'success') {
                            return row.meta.stats.reduction + '%'
                        }

                        return '0 KB'
                    },
                    createdCell: function (td, cellData, rowData) {

                        var innerTippy
                        var innerTippy2

                        var stat = $(td).wrapInner($('<span></span>'))

                        var tippyOptions = {
                            theme: 'light',
                            triggerTarget: td,
                            content: function () {
                                var c = $('<div class="stat-tooltip">' +
                                    '<div class="progress-bar-wrapper">' +
                                    '    <div class="progress-bar w-100">' +
                                    '      <span style="width:' + (100 - rowData.meta.stats.reduction) + '%">' + (100 - rowData.meta.stats.reduction).toFixed() + '%' +
                                    '      </span>' +
                                    '    </div>' +
                                    '  </div>' +
                                    '</div>')

                                innerTippy = tippy(c.find('.progress-bar-wrapper')[0], {
                                    content: 'Total CSS Earlier <span class="perc">' + rowData.meta.stats.before + '</span>',
                                    allowHTML: true,
                                    placement: 'bottom-end',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'tomato',
                                    interactive: true,
                                    delay: 0,
                                    arrow: false,
                                    offset: [0, 7]
                                })

                                innerTippy2 = tippy(c.find('.progress-bar')[0], {
                                    content: 'After UnusedCSS <span class="perc"> ' + rowData.meta.stats.after + '</span>',
                                    allowHTML: true,
                                    placement: 'top-start',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'ketchup',
                                    interactive: true,
                                    delay: 0,
                                })

                                return c[0]
                            },
                            placement: 'left',
                            // trigger: 'click',
                            allowHTML: true,
                            animation: "shift-toward-extreme",
                            appendTo: "parent",
                            onShow: function () {
                                innerTippy.show()
                                innerTippy2.show()
                            },
                            onShown: function (instance) {
                                $(instance.popper).find('.progress-bar.w-100').removeClass('w-100')
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

                            tippyOptions.triggerTarget = $(td).closest('tr')[0]
                            tippy(stat.find('span')[0], tippyOptions);
                            return
                        }

                        if (rowData.status === 'success') {
                            stat.find('span').append('<span class="dashicons dashicons-yes-alt"></span>');
                            // tippyOptions.triggerTarget = $(td).closest('tr')[0]
                            tippy(stat.find('span')[0], tippyOptions);
                        }

                    }
                },

                {
                    "data": "url",
                    className: 'dt-body-center dt-head-center action',
                    "targets": 0,
                    title: "Actions",
                    width: '60px',
                    render: function (data, type, row, meta) {
                        return '<button data-url="' + data + '"><span class="dashicons dashicons-no-alt"></span>Clear</button>';
                    },
                    createdCell: function (td, cellData, rowData, row, col) {

                        tippy($(td).find('button')[0], {
                            content: 'Clear UnusedCSS files',
                            placement: 'top',
                            appendTo: "parent"
                        })
                        $(td).find('button').click(function (e) {
                            e.preventDefault()
                            var _row = table.row(':eq(' + row + ')');

                            var data = {
                                url: cellData,
                                clear: true
                            }

                            $(td).parent().addClass('loading')

                            wp.ajax.post('uucss_purge_url', data).done(function (d) {
                                _row.remove().draw()
                            })

                        });
                    }
                },
            ]
        });


        console.log('loaded');

    });

}(jQuery))
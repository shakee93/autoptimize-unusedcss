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

            }).fail(function () {

                $verified.val(undefined)
                $status.text('failed !').removeClass().addClass('failed')

            });

        }

        verifyApiKey()
        $input.on('input', verifyApiKey)

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

            var $content = $(this).parent().find('.content').slideToggle('fast');
            $(this).find('.uucss-toggle-section').toggleClass('rotate')
        });

        var table = $('#uucss-history')

        table = table.DataTable({
            data: Object.values(uucss.data),
            searching: false,
            pageLength: 25,
            pagingType: "simple",
            bLengthChange: false,
            tfoot: false,
            bSort: false,
            columns: [
                {
                    "data": "status",
                    title: "Status",
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
                    }
                },
                {
                    data: "meta.stats.reductionSize",
                    className: 'dt-body-center dt-head-center stats',
                    title: "Removed unused CSS Size 🔥",
                    width: '145px',
                    createdCell: function (td, cellData, rowData) {

                        var innerTippy
                        var innerTippy2

                        var stat = $(td).wrapInner($('<span></span>'))

                        stat.find('span').append('<span class="dashicons dashicons-yes-alt"></span>')
                        tippy(stat.find('span')[0], {
                            theme: 'light',
                            triggerTarget: td,
                            content: function () {
                                var c = $('<div class="stat-tooltip">' +
                                    '<div class="progress-bar-wrapper">' +
                                    '    <div class="progress-bar">' +
                                    '      <span style="width:' + (100 - rowData.meta.stats.reduction) + '%">' +
                                    '      </span>' +
                                    '    </div>' +
                                    '  </div>' +
                                    '</div>')

                                innerTippy = tippy(c.find('.progress-bar-wrapper')[0], {
                                    content: '<span class="perc">100%</span>Before Unused CSS : <strong>' + rowData.meta.stats.before + '</strong>',
                                    allowHTML: true,
                                    placement: 'top-end',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'tomato',
                                    interactive: true,
                                    delay: 0
                                })

                                innerTippy2 = tippy(c.find('.progress-bar')[0], {
                                    content: '<span class="perc">' + (100 - rowData.meta.stats.reduction).toFixed() + '%</span> After Unused CSS : <strong>' + rowData.meta.stats.after + '</strong>',
                                    allowHTML: true,
                                    placement: 'bottom-start',
                                    trigger: 'manual',
                                    hideOnClick: false,
                                    animation: null,
                                    theme: 'ketchup',
                                    interactive: true,
                                    delay: 0,
                                    popperOptions: {
                                        strategy: 'absolute',
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                options: {
                                                    fallbackPlacements: ['bottom', 'right'],
                                                },
                                            },
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    altAxis: true,
                                                    mainAxis: false,
                                                    tether: false,
                                                    padding: 4,
                                                    boundary: stat.find('.tippy-content')
                                                },
                                            },
                                        ],
                                    },
                                })

                                return c[0]
                            }(),
                            placement: 'right',
                            // trigger: 'click',
                            allowHTML: true,
                            animation: "shift-toward-extreme",
                            interactive: true,
                            onShow: function () {
                                innerTippy.show()
                                innerTippy2.show()
                            },
                            onHide: function () {
                                innerTippy.hide()
                                innerTippy2.hide()
                            }

                        });

                    }
                },
                {
                    "data": "url",
                    className: 'dt-body-center dt-head-center action',
                    "targets": 0,
                    title: "Actions",
                    render: function (data, type, row, meta) {
                        return '<button data-url="' + data + '"><span class="dashicons dashicons-no-alt"></span>Clear</button>';
                    },
                    createdCell: function (td, cellData, rowData, row, col) {
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
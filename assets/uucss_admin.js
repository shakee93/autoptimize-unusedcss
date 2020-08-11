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

        });

        console.log('loaded');

    });

}(jQuery))
(function ($) {

    $(document).ready(function () {

        // options page
        window.tagBox.init();

        var $status = $('#verification_status')
        var $input = $('#uucss_api_key')
        var $verified = $('input[name="autoptimize_uucss_settings[uucss_api_key_verified]"]')

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

        $('#whitelist_packs').select2({
            maximumSelectionLength: 5,
            width: '80%',
        })

        console.log('loaded');

    });

}(jQuery))
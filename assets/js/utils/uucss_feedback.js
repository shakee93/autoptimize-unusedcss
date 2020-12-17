(function ($) {
    $(document).ready(function () {
        var targetElement = 'tr[data-slug="unusedcss"] span.deactivate a';
        var redirectUrl = $(targetElement).attr('href');
        if ($('.uucss-feedback-overlay').length === 0) {
            $('body').prepend('<div class="uucss-feedback-overlay"></div>');
        }
        $('#uucss_uninstall_feedback_popup').appendTo($(targetElement).parent());

        $(targetElement).on('click', function (e) {
            e.preventDefault();
            $('#uucss_uninstall_feedback_popup ').addClass('active');
            $('body').addClass('uucss-feedback-open');
            $('.uucss-feedback-overlay').on('click', function () {
                $('#uucss_uninstall_feedback_popup ').removeClass('active');
                $('body').removeClass('uucss-feedback-open');
            });
        });

        $('#uucss_uninstall_feedback_popup .info-disclosure-link').on('click', function (e) {
            e.preventDefault();
            $(this).parent().find('.info-disclosure-content').toggleClass('active');
        });

        $('#uucss_uninstall_feedback_popup input[type="radio"]').on('change', function () {
            var radio = $(this);
            if (radio.parent().find('textarea').length > 0 &&
                radio.parent().find('textarea').val().length === 0) {
                $('#uucss_uninstall_feedback_popup #uucss-deactivate-yes').attr('disabled', 'disabled');
                radio.parent().find('textarea').on('keyup', function (e) {
                    if ($(this).val().length === 0) {
                        $('#uucss_uninstall_feedback_popup #uucss-deactivate-yes').attr('disabled', 'disabled');
                    } else {
                        $('#uucss_uninstall_feedback_popup #uucss-deactivate-yes').removeAttr('disabled');
                    }
                });
            } else {
                $('#uucss_uninstall_feedback_popup #uucss-deactivate-yes').removeAttr('disabled');
            }
        });

        $('#uucss_uninstall_feedback_popup #uucss-deactivate-no').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(targetElement).unbind('click');
            $('body').removeClass('uucss-feedback-open');
            $('#uucss_uninstall_feedback_popup').remove();
            if (redirectUrl !== '') {
                location.href = redirectUrl;
            }
        });

        $('#uucss_uninstall_feedback_popup #uucss-deactivate-yes').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(targetElement).unbind('click');
            var selectedOption = $(
                '#uucss_uninstall_feedback_popup input[name="uucss-deactivate-option"]:checked');

            var reason;

            if(selectedOption.attr("id") === "uucss_feedback999"){
                reason = selectedOption.parent().find('textarea').val().trim()
            }else{
                reason = selectedOption.parent().find('label').text().trim()
            }

            var data = {
                'url': uucss.home_url,
                'reason': reason,
                'type': 'wordpress',
                'version' : $('#uucss_plugin_version').text().trim(),
            };
            $.ajax({
                type: 'POST',
                url: uucss.api_url + '/feedback',
                data: data,
                complete() {
                    $('body').removeClass('uucss-feedback-open');
                    $('#uucss_uninstall_feedback_popup').remove();
                    if (redirectUrl !== '') {
                        location.href = redirectUrl;
                    }
                },
                beforeSend() {
                    $('#uucss_uninstall_feedback_popup').addClass('sending-feedback');
                    $('#uucss_uninstall_feedback_popup .popup--footer').remove();
                    $('#uucss_uninstall_feedback_popup .popup--body').html('<i class="dashicons dashicons-update-alt"></i>');
                }
            });
        });
    });
})(jQuery);
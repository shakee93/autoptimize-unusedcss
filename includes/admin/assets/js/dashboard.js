(function ($) {

    $(document).ready(function(){

        $('#rapidload-dashboard input.rapidload-modules').change(function(){

            var $target = $(this);
            $target.parents('div.rapidload-box').addClass('saving')
            wp.ajax.post('rapidload_module_activation', {
                module : $target.val(),
                activate : this.checked ? 'on' : 'off'
            }).then(function (i){
               window.location.reload();
            }).done(function (){
                $target.parents('div.rapidload-box').removeClass('saving')
            });

        });

        $('.rapidload-menu-item').click(function(){

            $('.rapidload-menu-item').removeClass('isActive');
            $(this).addClass('isActive');
            $('.rapidload-page').css('display','none');
            $('.rapidload-page-' + $(this).data('page')).css('display','block');
        })

        $('p.more-info-uucss-status').click(function (e) {
            e.preventDefault();
            var $info = $('.rapidload-status .uucss-status-more-info');
            if($info.css('display') === "block"){
                $info.slideUp();
            }else{
                $info.slideDown();
            }

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
                $('.license-info #license-message').css('display','block').html('Sorry, we couldn\'t collect license information of yours.')
                container.removeClass('loading');
            })

        }

        var $input = $('#uucss_api_key')

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
                        $.uucssAlert('Please enter a license key', 'error');
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

        updateLicense();
    })

}(jQuery))
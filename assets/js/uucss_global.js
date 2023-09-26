(function ($) {

    $.uucssAlert = function(message, type = 'success', duration = 3000) {
        new Noty({
            text: message,
            layout: 'bottomCenter',
            timeout: duration,
            type : type,
            animation: {
                open: 'animated bounceInUp',
                close: 'animated bounceOutDown'
            }
        }).show();
        //alert(message);
    }

    $.uucss_log = function (log) {

        if(!log){
            return;
        }

        $.ajax({
            url : uucss_global.ajax_url,
            method : 'POST',
            data : {
                action : 'frontend_logs',
                type : log.type,
                url : log.url,
                log : log.log,
                nonce : window.uucss_global.nonce
            },
            success : function(response){

            }
        })
    };

    $(document).ready(function () {

        if (window.location.href.includes('#configure_autoptimize_css')) {
            $(document).ready(function () {
                $(window).scrollTop($('#autoptimize_css').position().top - 50)
            })

        }

        /**
         * Safelist input in options
         *
         * @type {any}
         */

        window.safelist = JSON.parse($('#uucss_safelist').val() || '[]');
        window.blocklist = JSON.parse($('#uucss_blocklist').val() || '[]');
        drawSafeList();
        drawBlockList();

        $('#uucss-options .safelist-add button, #uucss-wrapper .safelist-add button').on('click', function (e) {
            e.preventDefault();
            addRule();
        });

        $('#uucss-options .safelist-add #safelist-add, #uucss-wrapper .safelist-add button').on('keydown', function (e) {
            if (e.key && e.key === 'Enter') {
                e.preventDefault();
                addRule();
            }
        });

        $('#uucss-options .blocklist-add button, #uucss-wrapper .blocklist-add button').on('click', function (e) {
            e.preventDefault();
            addBlockList();
        });

        $('#uucss-options .blocklist-add #blocklist-add, #uucss-wrapper .blocklist-add button').on('keydown', function (e) {
            if (e.key && e.key === 'Enter') {
                e.preventDefault();
                addBlockList();
            }
        });

        function addBlockList() {
            var item = $('#blocklist-add');

            var value = item.val().trim();

            if(value === ''){
                return;
            }

            var exists = window.blocklist.findIndex(function (p) {
                return p === value
            });

            if (exists >= 0) {
                return;
            }

            blocklist.push(value);

            item.val('')

            drawBlockList();
        }

        function addRule() {

            var type = $('#safelist-type');
            var item = $('#safelist-add');

            var pattern = {
                type: type.val(),
                rule: item.val().trim()
            }

            if (!pattern.rule) {
                return;
            }

            var exists = window.safelist.findIndex(function (p) {
                return p.rule === pattern.rule && p.type === pattern.type
            });

            if (exists >= 0) {
                return;
            }

            safelist.push(pattern);

            item.val('')
            type.val('greedy')

            drawSafeList();

        }

        function updateInput() {
            $('#uucss_safelist').val(JSON.stringify(window.safelist))
        }

        function updateBlockListInput() {
            $('#uucss_blocklist').val(JSON.stringify(window.blocklist))
        }

        function drawBlockList() {

            $('.blocklist-list ul').empty();

            window.blocklist.forEach(function (item) {

                var li = $(`<li><span data-rule="` + item + `" title="remove rule" class="dashicons dashicons-remove dashicons-no-alt"></span> <span class="blocklist-list-value"> ` + item + `</span></li>`)

                li.find('.dashicons-remove').click(function () {
                    var _item = $(this).data('rule')

                    window.blocklist = window.blocklist.filter(function (i) {
                        return !(i === _item)
                    });

                    drawBlockList();
                });

                $('.blocklist-list ul').append(li)

            });

            updateBlockListInput();
        }

        function drawSafeList() {

            $('.safelist-list ul').empty();

            window.safelist.forEach(function (item) {

                var li = $(`<li><span data-rule="` + item.rule + `" data-type="` + item.type + `" title="remove rule" class="dashicons dashicons-remove dashicons-no-alt"></span> <span class="safelist-list-type"> ` + item.type + `</span> <span>` + item.rule + `</span></li>`)

                li.find('.dashicons-remove').click(function () {
                    var _item = $(this).data()

                    window.safelist = window.safelist.filter(function (i) {
                        return !(i.rule === _item.rule && i.type === _item.type)
                    });

                    drawSafeList();
                });

                $('.safelist-list ul').append(li)

            });

            updateInput();
        }

        function updateLicenseInfo() {

            if(window.uucss && uucss.api_key_verified === ""){
                return;
            }

            var container = $('.license-info')

            if(container.length){
                container.addClass('loading');
            }

            // TODO fix this
            wp.ajax?.post('uucss_license', { nonce : window.uucss_global.nonce }).then(function (i) {
                if(container.length){
                    $('.license-info ul').show();

                    $('#license-name').text(i.name)
                    $('#license-email').text(i.email)
                    $('#license-next_billing').text(new Date(i.next_billing * 1000).toLocaleDateString())
                    $('#license-plan').text(i.plan)
                    $('#license-domain').text(i.siteUrl)

                    container.removeClass('loading');
                }

                var seconds = Math.floor((new Date(i.next_billing * 1000) - new Date() ) / 1000);
                var interval = seconds / 86400;
                if(interval < 0){
                    var content = `<div class="uucss-notice-action notice notice-action notice-action-on-board notice-info">
                                  <div class="notice-action-inner">
                                    <div class="notice-icon">
                                        <div class="logo-wrapper">
                                            <img src="http://dev.rapidload.local/wp-content/plugins/autoptimize-unusedcss/assets/images/logo-icon.svg" width="40" alt="RapidLoad logo">
                                        </div>
                                    </div>
                                    <div class="notice-icon-content">
                                       <h2 class="uucss-notice-title">You are missing out RapidLoad benefits</h2>
                                        <p>RapidLoad is not working on your site anymore, which means you will have larger CSS files, overall a larger page size and lower page-speed scores. </p>
                                    </div>
                                        <div class="notice-main-action">
                                        <p>
                                            <a target="_blank" class="button button-primary" href="https://app.rapidload.io/auth/sign-in/?goto=https://app.rapidload.io/subscription">Activate</a>
                                        </p>
                                    </div>
                                </div>
                            </div>`

                    var $wrap = $('#wpbody-content .wrap');

                    if($wrap.length){
                        $wrap.prepend(content)
                    }
                }
            }).fail(function (i) {
                if(container.length){
                    $('.license-info ul').hide()
                    $('.license-info #license-message').show().html('Sorry, we couldn\'t collect license information of yours.')
                    container.removeClass('loading');
                }
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

        $('.notice-action-rapidload-db-update .notice-main-action a.button').click(function (e) {
            var $target = $(this);

            if($target.text() === 'Contact Support'){
                return;
            }
            e.preventDefault();

            $target.text('Updating...');
            $target.removeAttr('href');
            $.ajax({
                url : uucss_global.ajax_url,
                method : 'POST',
                data : {
                    action : 'rapidload_db_update',
                    nonce : window.uucss_global.nonce
                },
                success : function(response){
                    if(response.success){
                        window.location.reload();
                    }else{
                        var $error = $('.notice-action-rapidload-db-update .notice-icon-content');
                        $error.find('h2').text('RapidLoad - Data update failed !');
                        $error.find('p').text('Database update failed');
                        $('.notice-action-rapidload-db-update').css('border-left-color','#dc3232');
                        $target.text('Failed : Contact Support');
                        $target.attr('href', 'https://rapidload.zendesk.com/hc/en-us/requests/new');
                        $target.attr('target', '_blank');
                    }
                }
            })
        })

        $('.rapidload-clear-all').click(function (e) {
            e.preventDefault();

            wp.ajax.post('rapidload_purge_all', {
                clear: true,
                nonce: uucss_global.nonce,
                url: null,
                job_type : 'url'
            }).done(function (d) {
                window.location.reload();
            })

        });

        updateLicenseInfo();
    });

}(jQuery))
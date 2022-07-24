(function ($) {

    $(document).ready(function () {

        var progress_check = null;
        var ajax_pending = false;
        var popupWindow = null;
        var origin = null;
        var $contentWrap = $('.slide-contents-wrap .slide-contents');
        var content = '.slide-content';
        var $progressBar = $('.rapidload-on-board #progress-bar');
        var $stepWrapper = $('.rapidload-on-board .plugin-steps .steps-wrap');
        var totalSteps = $('.rapidload-on-board .plugin-steps').data('total_steps');

        function moveSlide(left) {
            $contentWrap.css('transform', 'translate3d(' + left + 'px,0px,0px)');
            $contentWrap.css('transition-duration', '0.5s');
        }

        function closePopWindow() {
            if (popupWindow) {
                popupWindow.close();
                popupWindow = null;
            }
            clearInterval(progress_check);
        }

        function child_open(url, width = 770, height = 590) {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.focus();
            } else {
                var left = ($(window).width() / 2) - (width / 2);
                var top = ($(window).height() / 2) - (height / 2);
                popupWindow = window.open(url, "_blank", "directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, width=" + width + ", height=" + height + ",  top=" + top + ", left=" + left);

                $(window).bind("beforeunload", function () {
                    popupWindow = null;
                });
                popupWindow.focus();
            }

        }

        function showAnalyze(value, error = false) {
            var $analyze = $('.rapidload-on-board .card.analyze');
            if(!error){
                if (value) {
                    $analyze.addClass('show')
                } else {
                    $analyze.css('transition-duration', '0.5s');
                    $analyze.removeClass('show');
                }
            }else{
                if (value) {
                    $analyze.addClass('show')
                } else {
                    $('.rapidload-on-board .analyze-result').addClass('uucss-error');
                    $analyze.css('transition-duration', '0.5s');
                    $analyze.removeClass('show');
                }
            }

        }

        function markCompletion() {
            if ($('.rapidload-on-board .card .actions.done').length === totalSteps) {
                moveSlide(-1 * 223 * totalSteps);
                if (!$('.rapidload-on-board').hasClass('complete')) {
                    $('.rapidload-on-board').addClass('complete')
                }
            }
        }

        function markActionDone($element) {
            if (!$element.parent().parent().hasClass('done')) {
                $element.parent().parent().addClass('done')
            }
            markCompletion();
        }

        function markCompleteActions(response) {
            if (response.data.rapidload_connected) {
                $('.skip-analyze.js-uucss-connect').hide();
                markActionDone($('.connect.actions .action-wrap a'));
            }
            if (response.data.uucss_first_job_done) {
                markActionDone($('.js-uucss-first-job'));
            }
            if ($('.rapidload-on-board .card .actions.done').length == totalSteps) {
                if (response.data.uucss_first_job.meta && response.data.uucss_first_job.meta.error) {
                    $('.rapidload-on-board.complete .card-complete .error-result p span.code').text(response.data.uucss_first_job.meta.error.code);
                    $('.rapidload-on-board.complete .card-complete .error-result p span.description').text(response.data.uucss_first_job.meta.error.message);
                    $('.rapidload-on-board.complete .card-complete a.js-goto-settings').text('Settings');
                    $('.rapidload-on-board .card-complete').addClass('has-error');
                } else if (response.data.uucss_first_job) {
                    var innerTippy = tippy($('.rapidload-on-board.complete .card-complete .stat-tooltip .progress-bar-wrapper')[0], {
                        content: 'Without RapidLoad <span class="perc">' + response.data.uucss_first_job.meta.stats.before + '</span>',
                        allowHTML: true,
                        placement: 'bottom-end',
                        trigger: 'manual',
                        hideOnClick: false,
                        animation: null,
                        theme: 'tomato',
                        interactive: true,
                        delay: 0,
                        offset: [0, 14]
                    })
                    innerTippy.show();
                    var innerTippy2 = tippy($('.rapidload-on-board.complete .card-complete .stat-tooltip .progress-bar-wrapper')[0], {
                        content: 'RapidLoad <span class="perc"> ' + response.data.uucss_first_job.meta.stats.after + '</span>',
                        allowHTML: true,
                        placement: 'top-start',
                        trigger: 'manual',
                        hideOnClick: false,
                        animation: null,
                        theme: 'ketchup',
                        interactive: true,
                        delay: 0,
                    })
                    innerTippy2.show();
                    $('.rapidload-on-board .card-complete .content .first-result .result-stat .progress-bar span').text((100 - Number(response.data.uucss_first_job.meta.stats.reduction)).toFixed(0) + '%');
                    $('.rapidload-on-board .card-complete .content .first-result .result-stat .progress-bar span').css('width', (100 - Number(response.data.uucss_first_job.meta.stats.reduction)).toFixed(0) + '%');
                }
                $('.rapidload-on-board').addClass('complete')
            }
        }

        function gotoRunFirstJob() {
            $progressBar.css('width', '100%');
            $stepWrapper.css('opacity', 0);
            $stepWrapper.find('.current').text(2);
            moveSlide(-223);
        }

        function gotoConnect() {
            $progressBar.css('width', '50%');
            $stepWrapper.css('opacity', 1);
            $stepWrapper.find('.current').text(1);
            moveSlide(0);
        }

        function gotoPendingStep(response) {
            if (response.data.rapidload_connected &&
                response.data.uucss_first_job_done
            ) {
                markCompletion();
            } else if (response.data.rapidload_connected) {
                gotoRunFirstJob();
            } else {
                gotoConnect();
            }
        }

        function moveAction() {
            origin = $contentWrap.position().left;
            var width = $contentWrap.find(content).outerWidth();
            var left = origin - width;

            moveSlide(left);
        }

        function checkRapidLoadConfigured() {
            if (popupWindow.closed) {
                clearInterval(progress_check);
                return;
            }
            if (ajax_pending) {
                return;
            }
            $.ajax({
                url: uucss_global.ajax_url,
                type: 'GET',
                data: {
                    action: 'rapidload_configured',
                },
                beforeSend: function () {
                    ajax_pending = true;
                },
                complete: function () {
                    ajax_pending = false;
                },
                success: function (response) {
                    if (response.data) {
                        markCompleteActions(response);
                        gotoPendingStep(response);
                        if (response.data.rapidload_connected) {
                            closePopWindow();
                            $('.js-uucss-analyze-site').html('Connect <span class="dashicons dashicons-yes-alt"></span>');
                        }
                    }
                }
            })
        }

        function runFirstJob() {
            if (ajax_pending) {
                return;
            }
            $.ajax({
                url: uucss_global.ajax_url,
                type: 'GET',
                data: {
                    action: 'run_first_job',
                },
                beforeSend: function () {
                    ajax_pending = true;
                    $('.js-uucss-first-job').html('Loading... <span class="dashicons dashicons-yes-alt"></span>')
                },
                complete: function () {
                    ajax_pending = false;
                    $('.js-uucss-first-job').html('Run First Job <span class="dashicons dashicons-yes-alt"></span>')
                },
                success: function (response) {
                    if (response.data) {
                        markCompleteActions(response);
                        if (response.data.uucss_first_job_done) {
                            $('.rapidload-on-board .plugin-steps .steps-wrap .current').text('');
                            $('.rapidload-on-board .plugin-steps .steps-wrap .current-text').text('');
                            moveAction();
                        }
                    }
                }
            })
        }

        $('.rapidload-on-board .actions .nav').click(function () {
            var plus = false;
            if ($(this).hasClass('next')) {
                plus = true;
            }
            switch ($('.rapidload-on-board .steps-wrap .step-text .current').text()) {
                case '1': {
                    if (plus) {
                        gotoRunFirstJob();
                    }
                    break;
                }
                case '2': {
                    gotoConnect();
                    break;
                }
            }
        })

        $('.js-uucss-analyze-site').click(function (e) {
            e.preventDefault();

            var $target = $(this);
            $target.text('Analyzing...');
            $target.removeAttr('href');

            var $parent = $('.rapidload-on-board .card .connect.actions');
            $.ajax({
                url: uucss_global.api_url + '/preview',
                method: 'POST',
                data: {
                    url: uucss_global.home_url
                },
                error(response){

                    var $errorContent = $('.rapidload-on-board .analyze-result');

                    if(response.status === 403){
                        $errorContent.find('.step-1-hd').text('We are Being Blocked!');

                        $target.off();
                        $target.addClass('js-uucss-connect');
                        $('.js-uucss-connect').click(function (e) {
                            e.preventDefault();
                            child_open($(this).data('activation_url'));
                            clearInterval(progress_check);
                            progress_check = setInterval(checkRapidLoadConfigured, 1000);
                        });
                        $target.html('Connect <span class="dashicons dashicons-yes-alt"></span>');
                        $target.attr('href','#');

                    }else{


                        $errorContent.find('.step-1-hd').text('Something Went Wrong!');
                        var $button = $errorContent.parent().find('.action-wrap a.act-button');
                        $button.attr('href','https://rapidload.zendesk.com/hc/en-us/requests/new');
                        $button.unbind('click');
                        $button.text('Contact Support')

                    }
                    $('.skip-analyze.js-uucss-connect').text('Connect');
                    $('.skip-analyze.js-uucss-connect').css('left','calc(50% - 24px)');
                    $target.removeClass('js-uucss-analyze-site');

                    showAnalyze(false, true);
                },
                success(response) {

                    if(response.data){

                        $parent.find('.analyze-result').find('.reduction').text(response.data.stats.reduction + '%');

                        var $sizeContent = $parent.find('.stats-figures .content');

                        var beforeSize = response.data.stats.before.split(' ');
                        if(beforeSize.length === 2){
                            $sizeContent.find('.before span.value').html(beforeSize[0] + " " + '<span>' + beforeSize[1] + '</span>');
                        }
                        var afterSize = response.data.stats.after.split(' ');
                        if(afterSize.length === 2){
                            $sizeContent.find('.after span.value').html(afterSize[0] + " " + '<span>' + afterSize[1] + '</span>');
                        }

                        if(response.data.stats.afterFileCount === 0){
                            $parent.find('.stats-files').hide();
                        }else{
                            var $fileCountContent = $parent.find('.stats-files .content');
                            $fileCountContent.find('.before span.value').text(response.data.stats.beforeFileCount);
                            $fileCountContent.find('.after span.value').text(response.data.stats.afterFileCount);
                        }
                        $target.removeClass('js-uucss-analyze-site');
                        $target.addClass('js-uucss-connect');
                        $target.off();
                        $('.js-uucss-connect').click(function (e) {
                            e.preventDefault();

                            child_open($(this).data('activation_url'));
                            clearInterval(progress_check);
                            progress_check = setInterval(checkRapidLoadConfigured, 1000);
                        });
                        $target.html('Connect <span class="dashicons dashicons-yes-alt"></span>');
                    }
                    $('.skip-analyze.js-uucss-connect').hide();
                    $target.attr('href','#');
                    showAnalyze(false);
                }
            });

        });

        $('.js-uucss-connect').click(function (e) {
            e.preventDefault();

            child_open($(this).attr('href'));
            clearInterval(progress_check);
            progress_check = setInterval(checkRapidLoadConfigured, 1000);
        });

        $('.js-uucss-first-job').click(function (e) {
            e.preventDefault();
            if (!$('.rapidload-on-board .connect.actions').hasClass('done')) {
                $.uucssAlert('Connect RapidLoad before run first job', 'info');
                gotoConnect();
                return;
            }
            clearInterval(progress_check);
            runFirstJob();
        });
    });

}(jQuery))
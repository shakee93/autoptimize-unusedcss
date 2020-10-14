
(function ($) {

    $(document).ready(function(){

        var popupWindow = null;
        var origin = null;
        var $flexViewPort = $('.slide-contents-wrap');
        var $contentWrap = $('.slide-contents-wrap .slide-contents');
        var content = '.slide-content';

        $(window).resize(function () {
            $contentWrap.find(content).css('max-width',$('.slide-contents-wrap').width());
        });

        function moveAction(){
            origin = $contentWrap.position().left;
            var width = $contentWrap.find(content).outerWidth();
            var left = origin - width;

            $contentWrap.css('transform','translate3d('+ left +'px,0px,0px)');
            $contentWrap.css('transition-duration','0.5s');
        }

        function child_open(url, width = 600, height = 400){
            if(popupWindow && !popupWindow.closed){
                popupWindow.focus();
            }
            else{
                var left  = ($(window).width()/2)-(width/2);
                var top   = ($(window).height()/2)-(height/2);
                console.log(left);
                console.log(top);
                popupWindow = window.open(url,"_blank","directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, width=" + width + ", height=" + height + ",  top=" + top + ", left=" + left);

                $(window).bind("beforeunload", function() {
                    popupWindow = null;
                });
                popupWindow.focus();
            }

        }

        function parent_disable() {
            if(popupWindow && !popupWindow.closed)
                popupWindow.focus();
        }

        var progress_check = null;
        var ajax_pending = false;

        function markCompletion(){
            if($('.uucss-on-board .card .actions.done').length == 4){
                $contentWrap.css('transform','translate3d(-892px,0px,0px)');
                $contentWrap.css('transition-duration','0.5s');
            }
        }

        function markActionDone($element) {
            if(!$element.parent().hasClass('done')){
                $element.parent().addClass('done')
            }
            markCompletion();
        }

        function gotoConnect() {
            $('.uucss-on-board #progress-bar').css('width','75%');
            $('.uucss-on-board .plugin-steps .steps-wrap .current').text(3);
            $('.uucss-on-board .plugin-steps .steps-wrap .current-text').text('Connect');
            $contentWrap.css('transform','translate3d(-446px,0px,0px)');
            $contentWrap.css('transition-duration','0.5s');
        }

        function gotoRunFirstJob() {
            $('.uucss-on-board #progress-bar').css('width','100%');
            $('.uucss-on-board .plugin-steps .steps-wrap .current').text(4);
            $('.uucss-on-board .plugin-steps .steps-wrap .current-text').text('Run First Job');
            $contentWrap.css('transform','translate3d(-669px,0px,0px)');
            $contentWrap.css('transition-duration','0.5s');
        }

        function gotoConfigure() {
            $('.uucss-on-board #progress-bar').css('width','50%');
            $('.uucss-on-board .plugin-steps .steps-wrap .current').text(2);
            $('.uucss-on-board .plugin-steps .steps-wrap .current-text').text('Configure');
            $contentWrap.css('transform','translate3d(-223px,0px,0px)');
            $contentWrap.css('transition-duration','0.5s');
        }

        function markCompleteActions(response){
            if(response.data.installed &&
                response.data.active){
                markActionDone($('.js-activate-ao'));
            }
            if(response.data.css_enabled){
                markActionDone($('.js-enable-css-ao '));
            }
            if(response.data.uucss_connected){
                markActionDone($('.js-uucss-connect'));
            }
            if(response.data.uucss_first_job_done){
                markActionDone($('.js-uucss-first-job'));
            }
            if($('.uucss-on-board .card .actions.done').length == 4){
                $('.uucss-on-board').addClass('complete')
            }
        }

        function closePopWindow() {
            popupWindow.close();
            popupWindow = null;
            clearInterval(progress_check);
        }

        function checkAutoptimizeInstalled(){
            if(ajax_pending){
                return;
            }
            $.ajax({
                url : uucss.ajax_url,
                type : 'GET',
                data : {
                    action : 'ao_installed',
                },
                beforeSend : function(){
                    ajax_pending = true;
                },
                complete : function(){
                    ajax_pending = false;
                },
                success : function (response) {
                    if(response.data){
                        markCompleteActions(response);
                        if(response.data.installed &&
                            response.data.active &&
                            response.data.css_enabled &&
                            response.data.uucss_connected &&
                            response.data.uucss_first_job_done
                        ){
                            closePopWindow();
                            markCompletion();
                        }
                        else if(response.data.installed &&
                            response.data.active &&
                            response.data.css_enabled &&
                            response.data.uucss_connected
                        ){
                            closePopWindow();
                            gotoRunFirstJob();
                        }
                        else if(response.data.installed &&
                            response.data.active &&
                            response.data.css_enabled
                        ){
                            closePopWindow();
                            gotoConnect();
                        }
                        else if(response.data.installed && response.data.active){
                            closePopWindow();
                            gotoConfigure();
                        }else if(response.data.installed){
                            $('.js-activate-ao ').data('installed', true);
                            $('.js-activate-ao ').html('Activate <span class="dashicons dashicons-yes-alt"></span>');
                            if(popupWindow.closed){
                                clearInterval(progress_check);
                            }
                        }
                    }
                }
            })
        }

        function checkAutoptimizeCssEnabled(){
            if(popupWindow.closed){
                clearInterval(progress_check);
                return;
            }
            if(ajax_pending){
                return;
            }
            $.ajax({
                url : uucss.ajax_url,
                type : 'GET',
                data : {
                    action : 'ao_installed',
                },
                beforeSend : function(){
                    ajax_pending = true;
                },
                complete : function(){
                    ajax_pending = false;
                },
                success : function (response) {
                    if(response.data){
                        markCompleteActions(response);
                        if(response.data.installed &&
                            response.data.active &&
                            response.data.css_enabled &&
                            response.data.uucss_connected
                        ){
                            closePopWindow();
                            gotoRunFirstJob();
                        }
                        else if(response.data.css_enabled){
                            closePopWindow();
                            gotoConnect();
                        }
                    }

                }
            })
        }

        function checkUnusedCssConnected(){
            if(popupWindow.closed){
                clearInterval(progress_check);
                return;
            }
            if(ajax_pending){
                return;
            }
            $.ajax({
                url : uucss.ajax_url,
                type : 'GET',
                data : {
                    action : 'ao_installed',
                },
                beforeSend : function(){
                    ajax_pending = true;
                },
                complete : function(){
                    ajax_pending = false;
                },
                success : function (response) {
                    if(response.data){
                        markCompleteActions(response);
                        if(response.data.uucss_connected && response.data.uucss_first_job_done){
                            closePopWindow();
                            markCompletion();
                        }
                        if(response.data.uucss_connected ){
                            closePopWindow();
                            gotoRunFirstJob();
                        }
                    }
                }
            })
        }

        function runFirstJob(){
            if(ajax_pending){
                return;
            }
            $.ajax({
                url : uucss.ajax_url,
                type : 'GET',
                data : {
                    action : 'run_first_job',
                },
                beforeSend : function(){
                    ajax_pending = true;
                    $('.js-uucss-first-job').html('Loading... <span class="dashicons dashicons-yes-alt"></span>')
                },
                complete : function(){
                    ajax_pending = false;
                    $('.js-uucss-first-job').html('Run First Job <span class="dashicons dashicons-yes-alt"></span>')
                },
                success : function (response) {
                    if(response.data){
                        markCompleteActions(response);
                        if(response.data.uucss_first_job_done){
                            $('.uucss-on-board .plugin-steps .steps-wrap .current').text('');
                            $('.uucss-on-board .plugin-steps .steps-wrap .current-text').text('');
                            moveAction();
                        }
                    }
                }
            })
        }

        $('.js-activate-ao').click(function(e){
            e.preventDefault();
            if($(this).data('installed')){
                child_open($(this).data('activation_url'));
            }else{
                child_open($(this).attr('href'));
            }
            clearInterval(progress_check);
            progress_check = setInterval(checkAutoptimizeInstalled,1000);
        });

        $('.js-enable-css-ao').click(function(e){
            e.preventDefault();
            if(!$('.uucss-on-board .install.actions').hasClass('done')){
                alert('Install and Activate Autoptimize before configure');
                return;
            }
            child_open($(this).attr('href'));
            clearInterval(progress_check);
            progress_check = setInterval(checkAutoptimizeCssEnabled,1000);
        });

        $('.js-uucss-connect').click(function(e){
            e.preventDefault();
            if(!$('.uucss-on-board .install.actions').hasClass('done')){
                alert('Install and Activate Autoptimize before configure');
                return;
            }
            if(!$('.uucss-on-board .enable.actions').hasClass('done')){
                alert('Configure Autoptimize before connect');
                return;
            }
            child_open($(this).attr('href'));
            clearInterval(progress_check);
            progress_check = setInterval(checkUnusedCssConnected,1000);
        });

        $('.js-uucss-first-job').click(function(e){
            e.preventDefault();
            if(!$('.uucss-on-board .connect.actions').hasClass('done')){
                alert('Connect UnusedCSS before run first job');
                return;
            }
            clearInterval(progress_check);
            runFirstJob();
        });

        $('body').focus(function () {
            parent_disable();
        });

        $('body').click(function () {
            parent_disable();
        });

        markCompletion();

        $('.uucss-on-board .actions .nav').click(function(){
            var left = 0;
            var plus = false;
            if($(this).hasClass('next')){
                plus = true;
                origin = $contentWrap.position().left;
                left = origin - $contentWrap.find(content).outerWidth();
            }else{
                origin = $contentWrap.position().left;
                left = origin + $contentWrap.find(content).outerWidth();
            }

            switch ($('.uucss-on-board .steps-wrap .step-text .current').text()) {
                case '1':{
                    if(plus){
                        $('.uucss-on-board .steps-wrap .step-text .current').text('2');
                        $('.uucss-on-board #progress-bar').css('width','50%');
                    }
                    break;
                }
                case '2':{
                    if(plus){
                        $('.uucss-on-board .steps-wrap .step-text .current').text('3');
                        $('.uucss-on-board #progress-bar').css('width','75%');
                    }else{
                        $('.uucss-on-board .steps-wrap .step-text .current').text('1');
                        $('.uucss-on-board #progress-bar').css('width','25%');
                    }
                    break;
                }
                case '3':{
                    if(plus){
                        $('.uucss-on-board .steps-wrap .step-text .current').text('4');
                        $('.uucss-on-board #progress-bar').css('width','100%');
                    }else{
                        $('.uucss-on-board .steps-wrap .step-text .current').text('2');
                        $('.uucss-on-board #progress-bar').css('width','50%');
                    }
                    break;
                }
                case '4':{
                    $('.uucss-on-board .steps-wrap .step-text .current').text('3');
                    $('.uucss-on-board #progress-bar').css('width','75%');
                    break;
                }
            }


            $contentWrap.css('transform','translate3d('+ left + 'px,0px,0px)');
            $contentWrap.css('transition-duration','0.5s');
        })

        if(window.location.href.includes('#configure_autoptimize_css')){
            $(document).ready(function(){
                $(window).scrollTop($('#autoptimize_css').position().top-50)
            })

        }
    });

}(jQuery))
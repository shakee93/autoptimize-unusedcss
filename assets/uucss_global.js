
(function ($) {

    $(document).ready(function(){

        var popupWindow=null;

        function child_open(url)
        {
            if(popupWindow && !popupWindow.closed){

                popupWindow.focus();
            }
            else{

                popupWindow = window.open(url,"_blank","directories=no, status=no, menubar=no, scrollbars=yes, resizable=no,width=600, height=280,top=200,left=200");
                popupWindow.focus();
            }

        }

        function parent_disable() {
            if(popupWindow && !popupWindow.closed)
                popupWindow.focus();
        }

        $('.js-install-ao').click(function(e){
            e.preventDefault();
            //$('.uucss-on-board-popup').toggleClass('show');
            child_open($(this).attr('href'));
        });

        $('.uucss-on-board-popup').click(function(){
            $('.uucss-on-board-popup').toggleClass('show');
        });

        $('body').focus(function () {
            parent_disable();
        })

        $('body').click(function () {
            parent_disable();
        })
    });

}(jQuery))
(function ($) {

    $(document).ready(function (){

        $('img').each(function (index, value){

            var url = $(value).data('original-src')

            if(url){
                var options = 'q_lossy,to_auto,ret_wait'

                options += ',w_' + $(value).width()

                $(value).attr('src', 'https://cdn.shortpixel.ai/spai/' + options + '/' + url);
            }

        })

    })

}(jQuery))
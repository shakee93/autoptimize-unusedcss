(function ($) {

    $(document).ready(function (){

        window.rapidload_replace_image_src = function(){

            $('img').each(function (index, value){

                var url = $(value).data('original-src')

                if(window.rapidload_io_data && url){

                    var options = 'ret_img'

                    if(window.rapidload_io_data.optimize_level){
                        options += ",q_" + window.rapidload_io_data.optimize_level
                    }

                    if(window.rapidload_io_data.support_next_gen_format){
                        options += ",to_auto"
                    }

                    options += ',w_' + $(value).width()

                    if(!$(value).attr('src').toString().includes(',w_' + $(value).width())){
                        $(value).attr('src', window.rapidload_io_data.image_endpoint + options + '/' + url);
                    }

                }

            })

        }

        const targetNode = document.getElementsByTagName('body')[0];

        const config = { attributes: true, childList: true, subtree: true };

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                for (const node of mutation.addedNodes){
                    for (const img of node.getElementsByTagName('img')){
                        var url = img.getAttribute('data-original-src')

                        if(window.rapidload_io_data && url){

                            var options = 'ret_img'

                            if(window.rapidload_io_data.optimize_level){
                                options += ",q_" + window.rapidload_io_data.optimize_level
                            }

                            if(window.rapidload_io_data.support_next_gen_format){
                                options += ",to_auto"
                            }

                            options += ',w_' + img.getBoundingClientRect().width

                            if(!img.getAttribute('src').toString().includes(',w_' + img.getBoundingClientRect().width)){
                                img.setAttribute('src', window.rapidload_io_data.image_endpoint + options + '/' + url);
                            }

                        }
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(targetNode, config);

        window.onresize = function(event) {
            window.rapidload_replace_image_src();
        };

        window.rapidload_replace_image_src();

    })

}(jQuery))
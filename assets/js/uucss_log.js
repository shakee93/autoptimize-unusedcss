(function ($) {

    $(document).ready(function () {

        $('#view-uucss-log').click(function () {
            $.featherlight('<div class="spinner loading"></div>', {
                variant : 'uucss-log'
            });
            wp.ajax.post('uucss_logs',{  }).then(function (i) {

                var data = i.sort((a,b) => (a.time > b.time) ? -1 : 1);
                console.log(data)

            })
        });

    })


}(jQuery))
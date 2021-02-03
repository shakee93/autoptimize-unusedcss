(function ($) {

    $(document).ready(function () {

        var $table = null;

        $('#view-uucss-log').click(function () {
            $.featherlight('<div class="spinner loading"></div><table id="uucss-logs-table" width="100%" class="hover"></table>', {
                variant : 'uucss-log'
            });
            wp.ajax.post('uucss_logs',{  }).then(function (i) {

                $table = $('#uucss-logs-table')

                $table.on('draw.dt', function (x,y) {
                    $('.featherlight.uucss-log .spinner.loading').remove();
                });

                var data = i.sort((a,b) => (a.time > b.time) ? -1 : 1);
                data = data.map(function (value) {
                    return{
                        log : value.log ? value.log :'empty',
                        time : value.time,
                        type : value.type
                    }
                });
                $table = $table.DataTable({
                    data : data,
                    searching: true,
                    pagingType: "simple",
                    bLengthChange: false,
                    tfoot: false,
                    bSort: false,
                    columns: [
                        {
                            data: 'time',
                            title: "Time",
                            render: function (data, type, row, meta) {
                                return new Date(data * 1000).toLocaleDateString() + ' ' + new Date(data * 1000).toLocaleTimeString()
                            }
                        },
                        {
                            data: 'log',
                            title: "Log",
                        },
                        {
                            data: 'type',
                            title: "Type",
                        },
                    ],
                })
            })
        });

    })


}(jQuery))
(function ($) {

    $(document).ready(function () {

        var $table = null;
        var status_filter = '';
        var log_interval = null;

        $('#view-uucss-log').click(function () {
            $.featherlight('<div class="spinner loading"></div><div class="uucss-logs-content"><table id="uucss-logs-table" width="100%" class="hover"></table>' +
                '<input type="button" class="button button-primary clear-uucss-log" id="clear-uucss-log" value="Clear Logs"></div>', {
                variant : 'uucss-log',
                afterClose: function(_super, event) {
                    if(log_interval){
                        clearInterval(log_interval);
                    }
                }
            });
            $('#clear-uucss-log').click(function () {
                wp.ajax.post('clear_uucss_logs',{  }).then(function (i) {
                    if(i){
                        alert('uucss log cleared');
                        $table.ajax.reload(null, false);
                    }
                });
            });

            updateUucssLogs();
        });

        function updateUucssLogs(){

            $table = $('#uucss-logs-table');

            $table.on('init.dt', function () {
                log_interval = setInterval(function () {
                    $table.ajax.reload(null, false);
                }, 1000 * 5)
            });

            $table.on('draw.dt', function (x,y) {

                $('.featherlight.uucss-log .spinner.loading').remove();

                var select = $('<select class="uucss-log-type">' +
                    '<option value="" ' + (status_filter === ''? 'selected' : '') +'>All</option>' +
                    '<option value="general" ' + (status_filter === 'general'? 'selected' : '') + '>General</option>' +
                    '<option value="uucss-cron" ' + (status_filter === 'uucss-cron'? 'selected' : '') + '>Cron</option>' +
                    '<option value="injection" ' + (status_filter === 'injection'? 'selected' : '') + '>Injection</option>' +
                    '<option value="purging" ' + (status_filter === 'purging'? 'selected' : '') + '>Purge</option>' +
                    '<option value="queued" ' + (status_filter === 'queued'? 'selected' : '') + '>Queue</option>' +
                    '<option value="store" ' + (status_filter === 'store'? 'selected' : '') + '>Store</option>' +
                    '</select>');

                $(select).prependTo($('#uucss-logs-table_info'));

                $('#uucss-logs-table_info select.uucss-log-type').on('change', function(){
                    status_filter = $(this).val();
                    console.log(status_filter)
                    $table.column(1).search( status_filter ? '^'+ status_filter +'$' : '', true, false )
                        .draw();
                });

            });

            $table = $table.DataTable({
                ajax : {
                    url: wp.ajax.settings.url + '?action=uucss_logs',
                    data: function (d) {

                        return d;
                    },
                    dataSrc: function (i) {
                        var data = i.data.reverse();
                        data = data.map(function (value) {
                            return{
                                url : value.url ? value.url : '',
                                log : value.log ? value.log : '',
                                time : value.time,
                                type : value.type
                            }
                        });
                        return data;
                    }
                },
                scrollY: '340px',
                searching: true,
                pagingType: "simple",
                bLengthChange: false,
                tfoot: false,
                bSort: false,
                columns: [
                    {
                        data: 'time',
                        title: "Time",
                        width: '120px',
                        render: function (data, type, row, meta) {
                            return new Date(data * 1000).toLocaleDateString() + ' ' + new Date(data * 1000).toLocaleTimeString()
                        }
                    },
                    {
                        data: 'type',
                        title: "Type",
                        width: '50px',
                    },
                    {
                        data: 'url',
                        title: "URL",
                    },
                    {
                        data: 'log',
                        title: "Log",
                    },

                ],
            })
        }

    })


}(jQuery))
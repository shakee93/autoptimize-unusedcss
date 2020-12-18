(function ($) {

    $(document).ready(function () {
        $('#button-uucss-clear-all').click(function (e) {
            e.preventDefault();

            var $this = $(this);

            $this.text('loading...');
            wp.ajax.post('uucss_purge_url', {
                clear: true,
                nonce: window.uucss.nonce,
                url: null,
            }).done(function (d) {
                $this.text('cleared all')
                $('#button-uucss-purge').css('display', 'inline-block')
                $('#button-uucss-clear').hide()
                $('.uucss-stats__size').text('Total Size : 0.00KB')

            })

        });

        $('#button-uucss-clear').click(function (e) {
            e.preventDefault();

            var $this = $(this);

            $this.text('loading...');
            wp.ajax.post('uucss_purge_url', {
                clear: true,
                url: uucss_admin_bar.post_link,
                nonce: window.uucss.nonce,
                args: {
                    post_id: uucss_admin_bar.uucss_post_id
                }
            }).done(function (d) {
                $this.text('clear')
                $this.hide();
                $('#button-uucss-purge').css('display', 'inline-block')
            })

        });

        $('#button-uucss-purge').click(function (e) {
            e.preventDefault();
            var $this = $(this);

            $this.text('loading...');

            var data = {
                url: uucss_admin_bar.post_link,
                nonce: window.uucss.nonce,
                args: {
                    post_id: uucss_admin_bar.post_id
                }
            }

            wp.ajax.post('uucss_purge_url', data).done(function (d) {
                $this.text('generate')
                $this.hide();
                $('#button-uucss-clear').css('display', 'inline-block')
            }).fail(function () {
                $this.text('failed!')
            });
        });
    })

})(jQuery)
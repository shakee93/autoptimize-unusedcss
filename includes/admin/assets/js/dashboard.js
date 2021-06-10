(function ($) {

    $(document).ready(function(){

        $('#rapidload-dashboard input.rapidload-modules').change(function(){

            var $target = $(this);
            $target.parents('div.rapidload-box').addClass('saving')
            wp.ajax.post('rapidload_module_activation', {
                module : $target.val(),
                activate : this.checked ? 'on' : 'off'
            }).then(function (i){
               window.location.reload();
            }).done(function (){
                $target.parents('div.rapidload-box').removeClass('saving')
            });

        });

        $('.rapidload-menu-item').click(function(){

            $('.rapidload-menu-item').removeClass('isActive');
            $(this).addClass('isActive');
            $('.rapidload-page').css('display','none');
            $('.rapidload-page-' + $(this).data('page')).css('display','block');
        })

        function updateLicense() {

            /*if(uucss.api_key_verified === ""){
                return;
            }*/

            var container = $('.license-info')

            container.addClass('loading');

            wp.ajax.post('uucss_license').then(function (i) {
                $('.license-info ul').show();

                $('#license-name').text(i.name)
                $('#license-email').text(i.email)
                $('#license-next_billing').text(new Date(i.next_billing * 1000).toLocaleDateString())
                $('#license-plan').text(i.plan)
                $('#license-domain').text(i.siteUrl)

                container.removeClass('loading');
            }).fail(function (i) {
                $('.license-info ul').hide()
                $('.license-info #license-message').css('display','block').html('Sorry, we couldn\'t collect license information of yours.')
                container.removeClass('loading');
            })

        }

        updateLicense();
    })

}(jQuery))
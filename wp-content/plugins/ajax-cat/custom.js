jQuery(document).ready(function ($) {

    // Контейнер с контентом
    var $mainBox = $('.content');

    // Отправка ajax запроса при клике по ссылке на рубрику в виджете "Рубрики"
    $(".ajax-active").click(function (e) {
        e.preventDefault();

        var linkCat = $(this).attr('href'); //ссылка на страницу, которую надо добавить в историю браузера
        // var titleCat = $(this).text();

        // document.title = document.title+"-hohoho-"+titleCat;
        //добавить виртуальную страницу в историю браузера
        // history.pushState({page_title: titleCat}, "описание страницы", linkCat);

        ajaxCat(linkCat);
    });

    // Отслеживание события нажатия кнопок браузера "Вперед/Назад"
    // window.addEventListener("popstate", function (event) {
    //     document.title = event.state.page_title;
    //     ajaxCat(location.href);
    // }, false);

    /**
     * Ajax запрос постов из рубрики по переданной ссылке на неё
     *
     * @param linkCat ссылка на рубрику
     */
    function ajaxCat(linkCat) {
        $mainBox.animate({opacity: 0.5}, 300);

        jQuery.post(
            myPlugin.ajaxurl,
            {
                action: 'btn_magic',
                link: linkCat
            },
            function (response) {
                $mainBox
                    .html(response)
                    .animate({opacity: 1}, 300);
            });
    }

});
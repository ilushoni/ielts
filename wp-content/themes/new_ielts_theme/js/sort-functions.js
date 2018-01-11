$(document).ready(function(){

    function sortItemSize() {
        $(".word-drop").removeClass('make-ul-smaller make-out-of-ul');
        $(".word-drop.has-li").each(function(){
            var $el = $(this).find("li.old");
            if( $el.length ) {
                var w_parent = Math.round( $(this).outerWidth() );
                var w_el =  Math.round( $el.outerWidth() );
                var sum = w_parent - w_el;
                switch(true){
                    case(sum > 5):
                        $(this).addClass('make-ul-smaller');
                        break;
                    case(( sum + 3 ) < 0):
                        //parent ul wrapper with smaller than element width
                        $(this).addClass('make-out-of-ul');
                        break;
                }
            }
        });
    }

    function openLi(){
        $(".task-drop-words > li").removeClass("open");
        $(".word-drop.has-li").closest("li").addClass("open");
    }

    function returnLi(el){
        el.appendTo(".sort.drop-list").show('slow');
        el.removeAttr("style");
        $(".sort.drop-list li.old").removeClass("old");
    }

    function closeEmptyLi(){
        $(".word-drop").removeClass("show-place focus-wrapper");
        $(".task-drop-words .sort:empty").parents(".word-drop.has-li").removeClass("has-li wrong");
        $(".sort li.focus").removeClass("focus");
    }

    function checkWrong(li){
       if(li.closest(".sort").attr("correct_answer") !== li.attr("id")){
            li.closest(".word-drop").addClass("wrong");
       }else{
           li.closest(".word-drop").removeClass("wrong");
       }
    }

    $(document).on('click', ".sort:not(.drop-list) li", function(e){
        returnLi($(this));
        closeEmptyLi();
        openLi();
        sortItemSize();
    });

    $('.sort').sortable({
        placeholder: 'placeholder',
        connectWith: '.sort',
        items: "li:not(.in-use)",
        start: function(event, ui) {
            $(ui.item["0"]).addClass("focus");
            $(ui.item["0"]).closest(".word-drop").addClass("focus-wrapper show-place");
            $(".word-drop:not(.has-li)").addClass("show-place");
            $(".task-drop-words > li").addClass("open");
        },
        stop: function(event, ui) {
            //$(this) where element from
            var $parentUl = $(ui.item["0"].offsetParent); //$parentUl where element stopped (it's new area)
            var $droppedEl = $(ui.item["0"]);  //$droppedEl element moved
            $parentUl.parents(".word-drop").addClass("has-li");
            if( $parentUl.hasClass("drop-list") ) {
                returnLi($(this));
            } else {
                $droppedEl.addClass("old");
                if( $parentUl.parents(".check-answers-now").length ){
                    checkWrong($droppedEl);
                }
            }
            closeEmptyLi();
            openLi();
            sortItemSize();
        },
        receive: function(event, ui) {
            //if target list not empty, change old element to new and return old element to main list
            //$(this) where element stopped (it's new area)
            $(ui.item["0"]).removeClass("old");
            if( ( $(this).find("li.old").length ) && ( !( $(this).hasClass(".drop-list") ) ) ) {
                var $elem = $(this).find("li.old");
                returnLi($elem);
                sortItemSize();
            }
        }
    });
});
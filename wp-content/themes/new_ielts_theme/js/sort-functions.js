$(document).ready(function(){

    /*all sort settings*/
    function disableSortInit(){
        $(".disabled .sort, .disabled.sort, .disabled .sort-phrase, .disabled.sort-phrase").sortable({
            disabled: true
        });
    }
    disableSortInit();
    /*end all sort settings*/

    /*sort words*/
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

    $(document).on('click', ".sort:not(.drop-list):not(.disabled) li", function(e){
        if($(this).parents(".disabled").length==0){
            returnLi($(this));
            closeEmptyLi();
            openLi();
            sortItemSize();
        }
    });

    initSort();
    function initSort(){
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
                if(!$parentUl.hasClass("drop-list")) {
                    $droppedEl.addClass("old");
                    if( $parentUl.parents(".check-now").length ){
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
                if( ( $(this).find("li.old").length ) && ( !( $(this).hasClass("drop-list") ) ) ) {
                    var $elem = $(this).find("li.old");
                    returnLi($elem);
                    sortItemSize();
                }
            }
        });
    }
    /*end sort words*/

    /*sort phrases*/
    initSortPhrases();
    function initSortPhrases(){
        $('.sort-phrase').sortable({
            placeholder: 'placeholder',
            connectWith: '.sort-phrase',
            items: "li:not(.in-use)",
            start: function(event, ui) {
                var $task = returnTask($(this));
                $task.attr("current-sort", "true");
                $(".sort-phrase-wrap:not(.disabled)").not($task).each(function(){
                    if($(this).find(".disabled").length == 0){
                        $(this).find(".sort-phrase").attr("disable-while-sort","disabled");
                    }
                });
                if($(this).is(".drop-list")){
                    var itemClass = ($(this).is(".show-used-el")) ? "in-use" : "place-placeholder";
                    leaveCloneItem(ui.item, itemClass);
                    $task.find(".sort-phrase:not(.drop-list)").addClass("for-placeholders");
                }else{  //ul-parent list
                    $('#'+ui.item[0]["id"]).removeClass("wrong"); //get moved element id
                }
            },
            stop: function(event, ui) {
                //$parentUl where element stopped (it's new area)
                //$droppedEl element moved
                //$(this) where element from
                var $parentUl = ui.item.parent();
                var $droppedEl = $(ui.item["0"]);
                if($parentUl.is("[disable-while-sort]")){
                    $(this).sortable("cancel");
                    $parentUl = $(this);
                }
                if($parentUl.hasClass("drop-list")) {
                    $droppedEl.removeClass("wrong");
                    if( $(".only-one-paste").length ){
                        $droppedEl.removeClass("old");
                    }
                    $("#"+ ui.item[0]["id"]+"-clone").after(ui.item);
                    $("#"+ ui.item[0]["id"]+"-clone").remove();
                    $("#"+ ui.item[0]["id"]).removeAttr("style");
                }else{
                    if($parentUl.parents(".only-one-paste").length){
                        $droppedEl.addClass("old");
                    }
                    var correctAns = $parentUl.attr("answers_correct").split(",");
                    if(($(this).parents(".check-now").length)&&($.inArray( $droppedEl.attr("id"), correctAns ) == -1)){
                        $droppedEl.addClass("wrong");
                    } else {
                        $droppedEl.removeClass("wrong");
                    }
                    if($(".check-btn.disabled").length){
                        var $checkBtn = findCheckBtn($(this).parents(".sort-phrase-wrap"), "check-btn");
                        if(typeof $checkBtn !== "undefined"){
                            activateCheckBtn($checkBtn);
                        }
                    }
                }
                $("li.focus").removeClass("focus");
                $(".has-placeholder").removeClass("has-placeholder");
                $(".for-placeholders").removeClass("for-placeholders");
                $(".place-placeholder").remove();
                $("*[current-sort]").removeAttr("current-sort");
                $("*[disable-while-sort]").removeAttr("disable-while-sort");
            },
            receive: function(event, ui) {
                if($(this).parents(".only-one-paste").length){
                    $(ui.item["0"]).removeClass("old");
                    if( $(this).find("li.old").length && (!$(this).hasClass("drop-list")) ) {
                        var $elem = $(this).find("li.old");
                        var $dropList = findDropList($(this));
                        if($dropList.length==0){
                            $dropList = $(ui.sender["0"]);
                        }
                        if($dropList.hasClass("show-used-el")){
                            $("#"+ $elem.attr('id')+"-clone").after($elem);
                            $("#"+ $elem.attr('id')+"-clone").remove();
                        }else{
                            $($elem).appendTo($dropList).show('slow');
                        }
                        $elem.removeAttr("style");
                        $(".sort-phrase.drop-list li").removeClass("old wrong");
                    }
                }
            },
            change: function(event, ui){
                var newUl = $(ui.placeholder).parent();
                var $task = $(".sort-phrase-wrap[current-sort]");
                $(".has-placeholder").removeClass("has-placeholder");
                $task.find(".sort-phrase:not(.drop-list)").addClass("for-placeholders");
                if((newUl.is(":not(.drop-list)"))&&(newUl.parents(".sort-phrase-wrap[current-sort]").length)){
                    newUl.addClass("has-placeholder");
                    $(".for-placeholders").removeClass("for-placeholders");
                }
            }
        });
    }
    $(document).on('mousedown', ".sort-phrase:not(.disabled) li", function(){
        if($(this).parents(".disabled").length==0){
            $(this).addClass("focus");
            if($(this).parents(".check-now").length == 0){
                var $task = $(this).closest(".sort-phrase-wrap");
                $task = ($task.length) ? $task : $(this).closest(".sort-phrase").next(".sort-phrase-wrap");
                var $checkBtn = findCheckBtn($task, "check-btn");
                if(($checkBtn.hasClass("disabled"))&&(!$(this).closest(".sort").hasClass("disabled"))){
                    activateCheckBtn($checkBtn);
                }
            }
        }
    });
    $(document).on('click', ".sort-phrase:not(.disabled) li", function(){
        if($(this).parents(".disabled").length==0){
            if(!( $(this).parents(".sort-phrase").hasClass('drop-list') )) {
                if($(this).parents(".sort-phrase-wrap").prev().hasClass("show-used-el")){
                    $("#"+ $(this).attr('id')+"-clone").after($(this));
                    $("#"+ $(this).attr('id')+"-clone").remove();
                }else{
                    $(this).appendTo(findDropList($(this).closest(".sort-phrase"))).show('slow');
                }
                $(this).removeAttr("style");
                $(this).removeClass("wrong");
            }
        }
    });
    $(document).on('mouseup', ".sort-phrase:not(.disabled) li", function(){
        if($(this).parents(".disabled").length==0){
            $(this).removeClass("focus");
        }
    });
    function findDropList(sort){
        var $dropList = $('.sort-phrase.drop-list');
        if(sort.parents(".sort-phrase-wrap").prev().hasClass("drop-list")){
            $dropList = sort.parents(".sort-phrase-wrap").prev();
        }else{
            if(sort.parents(".sort-phrase-wrap").find(".drop-list").length){
                $dropList = sort.parents(".sort-phrase-wrap").find(".drop-list");
            }
        }
        return $dropList;
    }
    $(".has-popup-hints .sort-phrase li").mousemove(function(e){
        var id = $(this).attr("id");
        if($(".hover-popup li[for='"+id+"']").is(":not(:visible)")){
            var x = $(this).offset().left - $("body > article.container").offset().left;
            var y = $(this).offset().top - $("body > article.container").offset().top + $(this).outerHeight() + 10;
            $(".hover-popup").css({top: y+"px",left: x+"px"});
            $(".hover-popup, .hover-popup li[for='"+id+"']").removeClass("hide");
        }
    });
    $(".has-popup-hints .sort-phrase li").mouseout(function(){
        $(".hover-popup, .hover-popup li").addClass("hide");
    });
    function leaveCloneItem(item, itemClass){
        var id = item[0]["id"]; //get moved element id
        var $elem = item.clone();
        $elem.removeAttr("style");
        $elem[0]["id"] = id + "-clone";
        $elem.addClass(itemClass);
        $("#"+id).after( $elem );
    }
    function returnTask(el){
        var ul = (el.is("li")) ? el.closest(".sort-phrase") : el;
        var $task = (ul.closest(".sort-phrase-wrap").length) ? ul.closest(".sort-phrase-wrap") : ul.next(".sort-phrase-wrap");
        return $task;
    }
    /*end sort phrases*/
});
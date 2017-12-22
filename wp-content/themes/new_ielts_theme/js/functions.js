/**
 * Created by User on 09.08.2017.
 */
$(document).ready(function() {
    function footerFix() {
        var h = 0;
        $("body").children().each(function(){
            h += $(this).height();
        });
        ( h < $(window).height() ) ? ($(".footer-wrapper").addClass("fixed-bottom")) : ($(".fixed-bottom").removeClass("fixed-bottom"));
    }
    footerFix();

    $("#menu-primary .success-line").each( function(){
        var w = $(this).attr("user_success");
        $(this).width( w+'%' );
    });

    $(".question .show-answer").click(function(){
        $(this).hide();
        $(this).parents(".question").find(".answer").addClass("open");
        $(this).parents(".question").find(".answer-text").addClass("open");
        return false;
    });

    $(".question .hide-answer").click(function(){
        $(this).parents(".question").find(".show-answer").show();
        $(this).parents(".answer").removeClass("open");
        $(this).parents(".answer-text").removeClass("open");
        return false;
    });

    $( ".accordion" ).accordion();

    $( ".accordion" ).on( "accordionbeforeactivate", function( event, ui ) {
        if($.trim($(ui.newPanel).html()).length == 0)
            event.preventDefault();
    });

    if( $(".nav-exercise").length ) {
        $(".page-nav-wrapper .page-next").addClass("disabled");
    }

    $(".task-text-insert li").not(".example").find(".btn-info").click(function() {
        var $el = ( $(this).hasClass("btn-hint") ) ?  $(this).parents("li").find(".hint") : $(this).parents("li").find(".explain");
        var el_post_left = $(this).parent(".text-field-group").position().left;
        $(this).toggleClass("open");
        $el.toggleClass("open").css("padding-left", el_post_left );
    });

    $(".task-text-insert li").not(".example").find(".text-field").on('focus',function(){
        if( (!($(".nav-exercise").hasClass("disabled"))) && ($(this).parents(".text-field-group").find(".btn-explain").is(":visible")) ) {
            var $field = $(this);
            $field.data('oldVal', $field.val());
            $field.bind("propertychange change click keyup input paste", function(){
                if ($field.data('oldVal') != $field.val()) {      // If value has changed...
                    $field.data('oldVal', $field.val());          // Updated stored value
                    $(".check-btn.disabled").removeClass("disabled");      // Do action
                    $(this).parents("li").find(".text-field-group" ).attr( "class", "text-field-group" );
                    $(this).parents("li").find(".btn-explain" ).hide();
                    $(this).parents("li").find(".open" ).removeClass("open");
                    $(this).parents("li").find(".btn-hint" ).show();
                }
            });
        } else {
            return false;
        }
    });

    $(".task-select-words li").not(".example").find(".word-select").click(function(){
        if( !( $(".nav-exercise").hasClass("disabled" )) ) {
            $(".check-btn").removeClass("disabled");
            $(this).toggleClass("selected").removeClass("wrong").removeClass("empty")
        }
        return false;
    });

    $(".task-select-words li.example a").click(function(){return false;});

    $(document).on("click", ".show-popup-btn", function(){
        $(".popup-text").addClass("open");
        $("body").addClass("no-scroll");
        return false;
    });

    $(document).on("click", ".popup-text .icon-close", function(){
        $(".popup-text").removeClass("open");
        $("body").removeClass("no-scroll");
    });

    $(".popup-text").mouseup(function(e) { //TODO:think about it
        // if the target of the click isn't the container not a child of the container
        var container = $(".popup-text > div");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".popup-text").removeClass("open");
            $("body").removeClass("no-scroll");
        }
    });

    function sortItemSize() {
        $(".word-drop").removeClass('make-ul-smaller');
        $(".word-drop").removeClass('make-out-of-ul');
        $(".word-drop.has-li").each(function(){
            var $el = $(this).find("li.ui-sortable-handle.old");
            if( $el.length ) {
                $el.addClass('no-width');
                var w_parent = Math.round( $(this).outerWidth() );
                var w_el =  Math.round( $el.outerWidth() );
                var sum = w_parent - w_el;
                if( sum > 5 ) {
                    $(this).addClass('make-ul-smaller');
                } else {
                    if( ( sum + 3 ) < 0 ) {
                        //parent ul wrapper with smaller than element width
                        $(this).addClass('make-out-of-ul');
                    }
                }
                $el.removeClass('no-width');
            }
        });
    }

    // $(document).on('mousedown', ".sort li", function(){
    $(".sort li").mousedown(function(){
        if( $(".nav-exercise").hasClass("disabled") )  {
            $('.sort').sortable('disable');
            return false;
        } else {
            $(".check-btn.disabled").removeClass("disabled");
            $(this).parents('.word-drop').addClass('focus-wrapper');
            $(this).addClass("focus");
            $(".word-drop").not(".has-li").addClass("show-place");
            $(".task-drop-words > li").addClass("open");
        }
    });

    function openLi(){
        $(".task-drop-words > li").removeClass("open");
        $(".word-drop.has-li").parents("li").addClass("open");
    }

    // $(document).on('click', ".sort li", function(){
    $(".sort li") .click(function(){
        if( $(".nav-exercise").hasClass("disabled") )  {
            return false;
        } else {
            if(!( $(this).parents(".sort").hasClass('drop-list') )) {

                $(this).parents(".word-drop.has-li").removeClass("has-li");
                $(this).parents(".word-drop.wrong").removeClass("wrong");
                $(this).removeClass("old");
                $( "#"+ $(this).attr('id')+"-clone").after($(this));
                $( "#"+ $(this).attr('id')+"-clone").remove();
                $( "#"+ $(this).attr('id')).attr("style","");

            }
            sortItemSize();
            openLi();
        }

    });

    // $(document).on('mouseup', ".sort li", function(){
    $(".sort li").mouseup(function(){
        $(this).parents('.word-drop').removeClass("focus-wrapper");
        $(this).removeClass("focus");
        $(".word-drop.show-place").removeClass("show-place");
        openLi();
        sortItemSize();
    });

    $('.sort').sortable({
        placeholder: 'placeholder',
        connectWith: '.sort',
        items: "li:not(.in-use)",
        start: function(event, ui) {
            if( $(this).hasClass("drop-list") ) {  //ul-parent list
                var id = ui.item[0]["id"]; //get moved element id
                var $elem = ui.item.clone();
                $elem.attr("style","");
                $elem[0]["id"] = id + "-clone";
                $elem.addClass("in-use");
                $(this).find(".focus").after( $elem );
            }
        },
        stop: function(event, ui) {
            //$parentUl where element stopped (it's new area)
            //$droppedEl element moved
            //$(this) where element from
            var $parentUl = $(ui.item["0"].offsetParent);
            var $droppedEl = $(ui.item["0"]);
            $(this).parents(".word-drop.wrong").removeClass("wrong");
            $parentUl.parents(".word-drop.wrong").removeClass("wrong");
            if( !( $(this).parents(".word-drop li").length ) ) {
                $(this).parents(".word-drop").removeClass("has-li");
            }
            $parentUl.parents(".word-drop").addClass("has-li");
            if( $parentUl.hasClass("drop-list") ) {
                $droppedEl.removeClass("old");
                $( "#"+ ui.item[0]["id"]+"-clone").after(ui.item);
                $( "#"+ ui.item[0]["id"]+"-clone").remove();
                $( "#"+ ui.item[0]["id"]).attr("style","");
            } else {
                $droppedEl.addClass("old");
            }
            openLi();
            $(".word-drop.focus-wrapper").removeClass(".focus-wrapper");
            $("li.focus").removeClass("focus");
            sortItemSize();
        },

        receive: function(event, ui) {
            //if target list not empty, change old element to new and return old element to main list
            //$(this) where element stopped (it's new area)
            $(ui.item["0"]).removeClass("old");
            if( ( $(this).find("li.old").length ) && ( !( $(this).hasClass(".drop-list") ) ) ) {
                var $elem = $(this).find("li.old");
                $( "#"+ $elem.attr('id')+"-clone").after($elem);
                $( "#"+ $elem.attr('id')+"-clone").remove();
                $( "#"+ $elem.attr('id')).attr("style","");
                $(".sort.drop-list li.old").removeClass("old");
                sortItemSize();
            }
        }
    });

    function showHintForExample($checkTask){
        var id = ( $checkTask == undefined ) ? $(".list-questions-ol").attr("id") : $checkTask;
        var $listTask = $("#"+id);
        var el_pos_left = $listTask.find("li.example").find(".text-field-group").position().left;
        var $el_btn = $listTask.find("li.example").find(".btn-hint");
        var $el_hint = $listTask.find("li.example").find(".hint");
        var $btn = ( $(".nav-exercise[for='"+id+"']").length ) ? $(".nav-exercise[for='"+id+"']").find(".check-btn") : $(".check-btn");
        if( $btn.hasClass("disabled") ) {
            $el_btn = $listTask.find("li.example").find(".btn-explain");
            $el_hint = $listTask.find("li.example").find(".explain");
        }
        $el_btn.addClass("open");
        $el_hint.addClass("open").css("padding-left", el_pos_left );
    }

    function findHint(input){
        var el = $('#'+input.attr("name")+'-hint');
        if( el.length == 0 ){
            var str = input.attr("name").split("-part")[0];
            el = $('#'+str+'-hint');
        }
        return el;
    }

    function showHint($checkBtn, sumWrongAnswers){
        if( ($(".hints-if-mistake").length) && sumWrongAnswers ){
            var $parentList = ( $checkBtn.parents(".nav-exercise").is('[for]') ) ? $('#'+$checkBtn.parents(".nav-exercise").attr("for")) : $(".list-questions-ol");
            var $hintsList = ( $checkBtn.parents(".nav-exercise").is('[for]') ) ? $('.hints-if-mistake[for='+$checkBtn.parents(".nav-exercise").attr("for")+']') : $(".hints-if-mistake");
            $parentList.find(".empty").addClass("help-cl");
            $parentList.find(".wrong").addClass("help-cl");
            $parentList.find(".help-cl").each( function(){
                var el = findHint($(this).find("input"));
                el.addClass("open");
            });
            $parentList.find(".help-cl").removeClass("help-cl");
            $hintsList.addClass("open");
        }
    }

    function showMessage($checkBtn, sumWrongAnswers){
        if ( sumWrongAnswers ) {
            $checkBtn.parents(".nav-exercise").addClass("has-wrong");
            $checkBtn.parents(".nav-exercise").find(".wrong-text").text('You’ve got '+ sumWrongAnswers +' mistakes. Correct them before continuing.');
            $checkBtn.addClass("disabled");
        } else {
            $checkBtn.parents(".nav-exercise").removeClass("has-wrong").addClass("disabled");
            $checkBtn.addClass("disabled");
            $(".page-nav-wrapper .page-next").removeClass("disabled");
            if( $(".show-if-check-success").length ){
                var elIfCheckSucces = ( $checkBtn.parents(".nav-exercise").is('[for]') ) ? $('.show-if-check-success[for='+$checkBtn.parents(".nav-exercise").attr("for")+']') : $(".show-if-check-success");
                elIfCheckSucces.removeClass("hide");
            }
        }
    }

    function changeElementType($el, newType) {
        var attrs = {};
        $.each($el[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });
        $el.replaceWith(function () {
            return $(newType, attrs).append($(this).contents());
        });
    }

    function selectCustomStyle( $el, tag, $parent, remove ) {
        if( remove ) {
            changeElementType( $el, tag );
        } else {
            var $el_old = $el.clone();
            var el_class = $el_old.attr('class')+'-old';
            var el_id = $el_old.attr('id')+'-old';
            changeElementType( $el, tag );
            $el_old.hide().attr('class', el_class ).attr('id', el_id ).appendTo( $parent );
        }
    }

    function selectModification(){
        var $select_wrap = $(".select-field-group");
        if( $select_wrap.length ) {
            $select_wrap.find("br").remove();
            $select_wrap.each(function(){
                var i=1;
                $(this).find("select option").each(function(){
                    $(this).attr('var', i++ );
                });
                selectCustomStyle( $(this).find("label"), "<div />", $(this) );
                selectCustomStyle( $(this).find("select"), "<ul />", $(this) );
                $(this).find("ul.select-menu option").each(function(){
                    selectCustomStyle( $(this), "<li />", $(this).parents(".select-menu"), 1 );
                });
            });
            $(document).on("click", ".select-field-group .choose-result", function(){
                if( $(".nav-exercise").hasClass("disabled") )  {
                    return false;
                } else {
                    if( $(this).parents(".select-field-group").hasClass('open') ) {
                        $(".select-field-group.open").removeClass('open');
                    } else {
                        $(".select-field-group.open").removeClass('open');
                        $(this).parents(".select-field-group").addClass('open');
                    }
                }
            });
            $(document).on("click", ".select-menu", function(){
                if( $(".nav-exercise").hasClass("disabled") )  {
                    return false;
                } else {
                    $(this).parents(".select-field-group").removeClass("open");
                }
            });
            $(document).on("click", ".select-menu .item", function(){
                if( $(".nav-exercise").hasClass("disabled") )  {
                    return false;
                } else {
                    var var_numb = $(this).attr('var');
                    if( $(".check-btn").length ){
                        $(".check-btn.disabled").removeClass("disabled");
                        $(this).parents(".select-field-group").removeClass('wrong');
                    }else{
                        if( $(this).parents(".check-answers-now").length ){
                            if( $(this).attr("correct_answer") == "1" ) {
                                $(this).parents(".select-field-group").removeClass("wrong");
                            } else {
                                $(this).parents(".select-field-group").addClass("wrong");
                            }
                        }
                    }
                    $(this).parents(".select-field-group").find(".selected").removeClass("selected");
                    $(this).addClass('selected');
                    $(this).parents(".select-field-group").find('*[selected="selected"]').removeAttr("selected");
                    $(this).parents(".select-field-group").find('[var="'+var_numb+'"]').attr('selected','selected');
                    $(this).parents(".select-field-group").find(".choose-result").text( $(this).text() );
                }
            });
        }
        closeIfClickOutside($(".select-menu"));
    }

    function closeIfClickOutside($box){
        var $win = $(window); // or $box parent container
        $win.on("click.Bst", function(event){
            //checks if descendants of $box was clicked  and checks if the $box itself was clicked
            if ( $box.parents(".select-field-group").has(event.target).length == 0 && !$box.parents(".select-field-group").is(event.target) ){
                $(".select-field-group.open").removeClass("open");
            }
        });
        $(".select-field-group").click(function(e){
            if( $(e.target).closest('.choose-result').length == 0 ) {
                $(".select-field-group.open").removeClass("open");
            }
        });
    }

    function selectModificationPosition(){
        if( $(".select-field-group").parents("#task6-choose-select").length ){
            $(".select-field-group").each(function(){
                var el_pos_left = $(this).parents("li").find("strong").position().left;
                var col_width = $(this).parents(".entry-content").width();
                if( ( col_width - el_pos_left ) < 301 ) {
                    el_pos_left = col_width - 300;
                    $(this).css("margin-left", el_pos_left );

                } else {
                    $(this).css("margin-left", el_pos_left );
                }
            });
        }
    }

    // $(document).on('click', ".list-questions-ul li", function(){
    $(".list-questions-ul li").click(function(){
        if( $(".nav-exercise").hasClass("disabled") )  {
            $('.sort').sortable('disable');
            return false;
        } else {
            $(".check-btn.disabled").removeClass("disabled");
            if( $(this).hasClass("wrong") ) {
                $(this).removeClass("wrong");
            }
        }
    });

    function checkButtonClick($checkBtn){
        if( $checkBtn.hasClass("disabled") ) {
            return false;
        } else{
            var $parentList = ( $checkBtn.parents(".nav-exercise").is('[for]') ) ? $('#'+$checkBtn.parents(".nav-exercise").attr("for")) : $(".list-questions-ol");
            $checkBtn.addClass("disabled");
            $parentList.each(function(){
                switch(true){
                    case($(this).hasClass("task-text-insert")):    //task with text-insert fields and hints
                        $(this).find(".text-field-group").attr("class", "text-field-group"); //remove all classes
                        if( $(this).find(".hint").length ){ //if task has hints and explain fields for user
                            $(this).find(".open").removeClass("open");
                            $(this).find(".btn-info").hide();
                            $(this).find(".btn-explain").show();
                            showHintForExample($(this).attr("id"));
                        }
                        $(this).find( ".text-field-group").each(function(){
                            switch ( $(this).find(".text-field").val().toLowerCase() ) {
                                case $(this).find(".text-field").attr("correct_answer").toLowerCase():
                                    $(this).addClass("correct-answer");
                                    break;
                                case '':
                                    $(this).addClass("empty");
                                    break;
                                default:
                                    $(this).addClass("wrong");
                            }
                        });
                        break;
                    case($(this).hasClass("list-text-fields")):    //task with text-insert fields
                        $(this).find(".text-field-group").attr("class", "text-field-group"); //remove all classes
                        $(this).find(".text-field-group").each(function(){
                            switch ( $(this).find(".text-field").val().toLowerCase() ) {
                                case $(this).find(".text-field").attr("correct_answer").toLowerCase():
                                    $(this).addClass("correct-answer");
                                    break;
                                case '':
                                    $(this).addClass("empty");
                                    break;
                                default:
                                    $(this).addClass("wrong");
                            }
                        });
                        break;
                    case($(this).hasClass("task-select-words")):
                        $(this).find("li.example").find(".word-select.key-word").addClass("selected");
                        $(this).find(".word-select.selected").not(".key-word").addClass("wrong");
                        $(this).find(".word-select.key-word").not(".selected").addClass("empty");
                        break;
                    case($(this).hasClass("task-drop-words")):
                        $(this).find(".word-drop").addClass("wrong");
                        $(this).find(".word-drop.focus-wrapper").removeClass("focus-wrapper");
                        $(this).find("li.focus").removeClass("focus");
                        $(this).find(".wrong").each(function() {
                            if( $(this).find(".sort").attr("correct_answer") === $(this).find("li").attr("id") ) {
                                $(this).removeClass("wrong");
                            }
                        });
                        break;
                    case($(this).hasClass("task-choose-select")):
                        $(this).find(".select-field-group").removeClass("open").addClass("wrong");
                        $(this).find(".select-field-group").each(function(){
                            if( $(this).find('.select-menu .item[correct_answer="1"]').hasClass('selected') ) {
                                $(this).removeClass('wrong');
                            }
                        });
                        break;
                    default:
                }
                showMessage( $checkBtn, ( $(this).find(".wrong").length + $(this).find(".empty").length ) );
                showHint( $checkBtn, ( $(this).find(".wrong").length + $(this).find(".empty").length ) );
            });
            $(".show-after-check").removeClass("hide");
        }
    }

    $(window).on('load', function(){
        if( $(".hint").length ){
            showHintForExample();
        }
        if(( $(".select-field-group").parents("#task6-choose-select").length) || ( $(".select-field-group").parents("#task3-text-insert").length) ){
            selectModificationPosition();
        }
        selectModification();
    });

    $(document).on("click", ".check-btn", function(){
        checkButtonClick( $(this) );
    });

    $(document).on("change keyup", "textarea.textarea-middle", function(){
        $(".check-btn").removeClass("disabled");
    });

    if( $("textarea").length ){
        var textarea = document.querySelector('textarea');
        textarea.addEventListener('keydown', autosize);
        function autosize(){
            var el = this;
            setTimeout(function(){
                el.style.cssText = 'height:auto;';
                el.style.cssText = 'height:' + el.scrollHeight + 'px';
            },0);
        }
    }

    //get url parameter
    // var getUrlParameter = function getUrlParameter(sParam) {
    //     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    //         sURLVariables = sPageURL.split('&'),
    //         sParameterName,
    //         i;
    //
    //     for (i = 0; i < sURLVariables.length; i++) {
    //         sParameterName = sURLVariables[i].split('=');
    //
    //         if (sParameterName[0] === sParam) {
    //             return sParameterName[1] === undefined ? true : sParameterName[1];
    //         }
    //     }
    // };

    $(document).on('click', ".check-answers-now input", function(){
        var $parent_el = $(this).parents(".list-questions-ul");
        switch( true ) {
            case ( $parent_el.hasClass("list-checkbox") ):
                $parent_el.find("li").addClass("wrong");
                $parent_el.find("input").each(function(){
                    if( ( $(this).prop('checked') ) && ( $(this).attr("correct_answer") == "1" ) ) {
                        $(this).parents("li").removeClass("wrong");
                    }
                    if( ( $(this).prop('checked') == false ) && ( $(this).parents("li").hasClass("wrong") ) ) {
                        $(this).parents("li").removeClass("wrong");
                    }
                });
                break;
            case ( $parent_el.hasClass("list-radiobutton") ):
                $parent_el.find("li").addClass("wrong");
                $parent_el.find("li").each(function(){
                    if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                        $(this).removeClass('wrong');
                    }
                });
                break;
            case ( $parent_el.hasClass("list-radio") ):
                $parent_el.find("li.wrong").removeClass("wrong");
                if(!( ( $(this).prop('checked') == true ) && ( $(this).is("[correct_answer]") ) && ( $(this).attr("correct_answer") == '1' ) )){
                    $(this).parents("li").addClass("wrong");
                }
                break;
        }
        $('*[class=""]').removeAttr('class');
    });

    $(document).on( "change paste keyup", ".check-answers-now input.one-character", function(){
        if( ( ! ($(this).val())) || ( $(this).val().toLowerCase() == $(this).attr("correct_answer").toLowerCase() ) ){
            $(this).parents("li").removeClass("wrong");
        }else {
            $(this).parents("li").addClass("wrong");
        }
    });

    $(document).on( "change paste keyup", ".check-answers-now input.text-field", function(){
        if( (!($(this).val())) || ( $(this).val().toLowerCase() == $(this).attr("correct_answer").toLowerCase() ) ){
            $(this).parents(".text-field-group").removeClass("wrong");
        }else {
            $(this).parents(".text-field-group").addClass("wrong");
        }
    });

    function moveMenuCarousel(next){
        var x = 0;
        if(next){
            x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").width()+8;
            x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(3)").width()+8;
            x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(4)").width()+8;
            x += 5;//TODO why 5px? because inline-block?
        }
        $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").css("margin-left", x );
    }

    if( $(".section-menu.top-line.column-8.active-6, .section-menu.top-line.column-8.active-7,.section-menu.top-line.column-8.active-8").length){
        $(".section-menu.top-line.column-8").addClass("visible_6-8");
        moveMenuCarousel('next');
    }

    $(".section-menu.top-line.column-8 .show-more").click(function(){
        var $elParent = $(this).parents(".section-menu");
        ( $(this).hasClass("next")) ? $elParent.addClass("visible_6-8") : $elParent.removeClass("visible_6-8");
        moveMenuCarousel($(this).hasClass("next"));
        return false;
    });

    //sort phrases to two columns
    $(document).on('mousedown', ".sort-phrase li", function(){
    // $(".sort-phrase li").mousedown(function(){
        $(this).addClass("focus");
    });

    $(document).on('click', ".sort-phrase li", function(){
    // $(".sort-phrase li") .click(function(){
        if(!( $(this).parents(".sort-phrase").hasClass('drop-list') )) {
            $( "#"+ $(this).attr('id')+"-clone").after($(this));
            $( "#"+ $(this).attr('id')+"-clone").remove();
            $( "#"+ $(this).attr('id')).removeAttr("style");
            $( "#"+ $(this).attr('id')).removeClass("wrong");
        }
    });

    $(document).on('mouseup', ".sort-phrase li", function(){
    // $(".sort-phrase li").mouseup(function(){
        $(this).removeClass("focus");
    });

    startSortOfPhrases();

    function startSortOfPhrases(){
        $('.sort-phrase').sortable({
            placeholder: 'placeholder',
            connectWith: '.sort-phrase',
            items: "li:not(.in-use)",
            start: function(event, ui) {
                if( $(this).hasClass("drop-list") ) {  //ul-parent list
                    var id = ui.item[0]["id"]; //get moved element id
                    var $elem = ui.item.clone();
                    $elem.attr("style","");
                    $elem[0]["id"] = id + "-clone";
                    $elem.addClass("in-use");
                    $(this).find(".focus").after( $elem );
                } else {
                    $('#'+ui.item[0]["id"]).removeClass("wrong");
                }
            },
            stop: function(event, ui) {
                //$parentUl where element stopped (it's new area)
                //$droppedEl element moved
                //$(this) where element from
                var $parentUl = $(ui.item["0"].offsetParent);
                var $droppedEl = $(ui.item["0"]);
                if( $parentUl.hasClass("drop-list") ) {
                    $droppedEl.removeClass("wrong");
                    $( "#"+ ui.item[0]["id"]+"-clone").after(ui.item);
                    $( "#"+ ui.item[0]["id"]+"-clone").remove();
                    $( "#"+ ui.item[0]["id"]).attr("style","");
                } else {
                    var correctAns = $parentUl.attr("answers_correct").split(",");
                    // console.log( $.inArray( $droppedEl.attr("id"), correctAns ));
                    if( $.inArray( $droppedEl.attr("id"), correctAns ) == -1 ){
                        $droppedEl.addClass("wrong");
                    } else {
                        $droppedEl.removeClass("wrong");
                    }
                }
                $("li.focus").removeClass("focus");
            },
            receive: function(event, ui) {
            }
        });
    }

    function closePopup(){
        $(".popup-window").removeClass("open");
        $("body").removeClass("no-scroll");
    }

    $(document).on("click", ".popup-window .icon-close", function(){
        closePopup();
    });

    $(document).on("click", ".popup-window", function(e){
        if( $(e.target).closest('.popup-body').length == 0 ) {
            closePopup();
        }
    });

    $(document).on("click", ".video-checkbox", function(){
    // $(".video-checkbox").click(function(){
        $(this).parents(".list-video-checkbox").find(".video-checkbox").each(function(){
            $(this).removeClass("wrong");
        });
        if( $(this).attr("correct_answer") !== "1" ) {
            $(this).addClass("wrong");
        }
    });

    $(document).on("click", ".choose-one-checkbox input[type='checkbox']", function(){
    // $(".choose-one-checkbox input[type='checkbox']").click(function(){
        var $this = $(this);
        if( $this.is(":checked") ) {
            $(this).parents(".choose-one-checkbox").find("input[type='checkbox']").each(function(){
                if(!( $(this).is($this) ) ){
                    $(this).prop( "checked", false );
                }
            });
        }
    });

    $(document).on("click", ".el-play", function(){
        $(this).toggleClass("el-pause");
    });

    $.ajaxSetup({cache:false});
    //section SPEAK - load task by task on page

    function taskSwitch(){
        if( $(".item-is-last").length ){
            $(".page-next").text("Next");
        } else {
            var text = $(".task-name").text().replace(/(\d+)+/g, function(match, number) {
                return parseInt(number)+1;
            });
            $(".page-next").text(text);
        }
    }

    if( $(".task-name.task-speaking").length ){
        taskSwitch();
    }

    function sendUserData(page_id){
        $.ajax({
            url: myVars.ajaxUrl, // Notice the AJAX URL here!
            type: 'post',
            data: {
                action: 'my_action',
                page_id: $("body").attr("class").split(' ')[0].replace('page-', ''), //current page ID = it visible in URL
                current_task: page_id //current page ID, it visible in <article>
            }, // Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
            cache: false,
            success: function ( response ) {
                // Parse ajax response here
                // Do something with the response
                console.log("success");
                console.dir( response );
            },
            error: function ( response ) {
                // Handle error response here
                console.log("error");
                console.dir( response );
            }
        });
    }

    $(document).on("click", ".page-nav-wrapper.load .page-prev", function(){
        if(!( $(this).parents(".page-nav-wrapper").hasClass("item-is-first") ) ) {
            $('.btn-stop:visible').click();
            var post_link = $(this).attr("href");
            $.get(post_link, function(data){ // Loads content into the 'data' variable.
                var html = $.parseHTML( data );
                $("article").replaceWith( $($(html)).filter("article") );
                taskSwitch();
                if( $(".sort-phrase").length ){
                    startSortOfPhrases();
                }
                if( $(".video-iframe-wrapper").length ){
                    $(".video-iframe-wrapper iframe").each(function(){
                        var frameId = this.id;
                        if( frameId ){
                            player = new YT.Player( frameId, {
                                events: {
                                    // call this function when player is ready to use
                                    'onReady': onPlayerReady,
                                    'onStateChange': onPlayerStateChange
                                }
                            });
                        }
                    });
                }
                if( $("audio").length || $(".recorder").length ){
                    init();
                    audioHandler();
                }
                if( $(".game-wrapper").length ){
                    time_original = $(".timer .time-left").attr("duration");
                    time_parts = time_original.split(":");
                    time = parseInt(time_parts[0]*60) + parseInt(time_parts[1]);
                    startGameSettings();
                }
                footerFix();
                if( $(".select-field-group").length ){
                    selectModification();
                }
                sendUserData( $("article.container").attr('id').replace('post-', ''));
            });
            // footerFix();
            return false;
        }
    });

    $(document).on("click", ".page-nav-wrapper.load .page-next", function(){
        if(!( $(this).parents(".page-nav-wrapper").hasClass("item-is-last") ) ) {
            $('.btn-stop:visible').click();
            var post_link = $(this).attr("href");
            $.get(post_link, function(data){ // Loads content into the 'data' variable.
                var html = $.parseHTML( data );
                $("article").replaceWith( $($(html)).filter("article") );
                taskSwitch();
                if( $(".sort-phrase").length ){
                    startSortOfPhrases();
                }
                if( $(".video-iframe-wrapper").length ){
                    $(".video-iframe-wrapper iframe").each(function(){
                        var frameId = this.id;
                        if( frameId ){
                            player = new YT.Player( frameId, {
                                events: {
                                    // call this function when player is ready to use
                                    'onReady': onPlayerReady,
                                    'onStateChange': onPlayerStateChange
                                }
                            });
                        }
                    });
                }
                if( $("audio").length || $(".recorder").length ){
                    init();
                    audioHandler();
                }
                if( $(".game-wrapper").length ){
                    time_original = $(".timer .time-left").attr("duration");
                    time_parts = time_original.split(":");
                    time = parseInt(time_parts[0]*60) + parseInt(time_parts[1]);
                    startGameSettings();
                }
                footerFix();
                if( $(".select-field-group").length ){
                    selectModification();
                }
                sendUserData( $("article.container").attr('id').replace('post-', ''));
            });
            // footerFix();
            saveUserAnswers();
            return false;
        }
    });

    //create timer
    var timerId = null;
    var time_original;
    var time_parts;
    var time;

    function stopTimer(stop){
        $(".btn-start-time.btn-stop-time").removeClass("btn-stop-time");
        $(".btn-start-time").text("START");
        if (timerId) {
            clearTimeout(timerId); //cancel the previous timer.
            timerId = null;
        }
        if( (time == 0)||(stop) ){
            //it is the end of time
            checkGameQuestions();
        }
        time_parts = time_original.split(":");
        time = parseInt(time_parts[0]*60) + parseInt(time_parts[1]);
        setTimeout( function(){
            $(".timer .time-left").text( time_original );
        }, 1000);
    }

    function makeTimer(){
        $(".btn-start-time").addClass("btn-stop-time");
        $(".btn-start-time").text("STOP");
        $(".timer .time-left").text(formatDuration(time));
        timerId = null;
        timerId = setTimeout(function tick() {
            time--;
            if( time == 0 ){
                $(".timer .time-left").text(formatDuration(time));
                stopTimer();
            }else {
                $(".timer .time-left").text(formatDuration(time));
                timerId = setTimeout(tick, 1000);
            }
        }, 1000);
    }

    $(document).on("click", ".btn-start-time", function(){
        if( $(this).hasClass("btn-stop-time") ){
            if( $(".game-question input:checked").length == 0 ){
                //user can stop time if not started to answer
                stopTimer();
            }
        } else {
            makeTimer();
        }
    });

    function startGameSettings(){
        if( $(".timer .time-left").length ){
            time_original = $(".timer .time-left").attr("duration");
            time_parts = time_original.split(":");
            time = parseInt(time_parts[0]*60) + parseInt(time_parts[1]);
        }

        $(".game-question input").prop('checked', false);
        $(".load-one-by-one .game-question:first-child").addClass("visible");
        $(".game-results").hide();
        $(".game-results").attr("class", "game-results");
        if( $(".load-one-by-one .game-question").length > 0 ) {
            $(".page-next").addClass("disabled");
            // $(".page-next").hide();
        }
        $(".game-rules").show();
        $(".timer-wrapper").show();
    }

    startGameSettings();

    function chooseShowHints(){
        var c;
        $(".game-question input[correct_answer]").not(":checked").each(function(){
            c = $(this).parents("li").attr("class");
            $(".hints li." + c).addClass("visible");
        });
        $(".hint-item").each(function(){
            if( $(this).find("li.visible").length > 0 ){
                $(this).show();
                if( $(this).find("li.visible").length == 1 ){
                    $(this).find("ul").addClass("single-li");
                }
            }
        });
    }

    function checkGameQuestions(){
        $(".game-question.visible").removeClass("visible");
        $(".game-results").show();
        $(".game-rules").hide();
        $(".timer-wrapper").hide();
        //count correct answers
        if( $(".game-question li").length == $(".game-question input:checked").length ){
            //user click all answers
            var count = $(".game-question li").length;
            var el_correct = 0;
            $(".game-question input:checked").each(function(){
                if( $(this).attr("correct_answer") == 1 ){
                    el_correct++;
                }
            });
            if( count == el_correct ){
                $(".show-count-answers").text(el_correct+"/"+count);
                $(".game-results").addClass("done");
                $(".page-next").removeClass("disabled");
                // $(".page-next").removeAttr("style");
            } else {
                //not all answers is correct
                $(".show-count-answers").text(el_correct+"/"+count);
                $(".game-results").addClass("done-wrong");
                if( $(".last-try").length ){
                    $(".game-question").addClass("visible");
                    $(".game-question input").prop( "disabled", true );
                    $(".page-next").removeClass("disabled");
                    // $(".page-next").removeAttr("style");
                    $(".game-question input:checked").each(function(){
                        if( $(this).attr("correct_answer") != 1 ){
                            $(this).parents(".label").addClass("wrong");
                        }
                    });
                }else {
                    chooseShowHints();
                }
            }

        } else {
            //time is over, but user give not all answers
            $(".game-results").addClass("late");
        }
    }

    $(document).on("click", ".btn-show-hints", function(){
        //show hints
        $(this).hide();
        $(".hints").show();
        $(".game-content").addClass("last-try");
    });

    $(document).on("click", ".btn-try-again", function(){
        //clear all
        startGameSettings();
        makeTimer();
        if( $(".last-try").length ){
            $(".hints").hide();
            $(".exercise-nav").hide();
        }
    });

    $(document).on("click", ".load-one-by-one .game-question input", function(){
        if( !( $(".btn-start-time").hasClass("btn-stop-time") ) ){
            //if user forgot to click button start timer
            makeTimer();
        }
        if( $(".game-question.visible li").length == $(".game-question.visible input:checked").length ){
            //user click on all answers in this question
            if( $(".game-question.visible").is(":last-child") ){
                //it was last question in game
                setTimeout(function(){
                    stopTimer(1);
                }, 1000);
            } else {
                var $el = $(".game-question.visible");
                setTimeout(function(){
                    $el.removeClass("visible");
                    $el.next(".game-question").addClass("visible");
                }, 1000);
            }
        }
    });

    $(document).on("click", ".save-field", function(){
        var saveBtn = $(this);
        var page_id = $("article.container").attr('id').replace('post-', '');
        var $field = {};
        var $name = $(this).attr("for");
        for( var i = 1; $("*[name="+$(this).attr('for')+i+"]").length > 0; i++ ){ //if there is some text fields on page for saving
            $field[$(this).attr('for')+i] = $("*[name="+$(this).attr('for')+i+"]").val();
        }
        if( $("*[name='"+$name+"']").length ){ //if btn for textarea
            $field[$name] = $("*[name='"+$name+"']").val();
        }
        $.ajax({
            url: myVars.ajaxUrl, // Notice the AJAX URL here!
            type: 'post',
            data: {
                action: 'my_action_save_field',// Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
                page_id: page_id, //current page ID = it visible in URL
                field: $field //current page ID, it visible in <article>
            }, // Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
            cache: false,
            success: function ( response ) {
                console.log("success");
                console.dir( response );
                $(".hide").removeClass("hide");
                saveBtn.attr("disabled", "disabled");
                $(".page-next.disabled").removeClass("disabled");
            },
            error: function ( response ) {
                console.log("error");
                console.dir( response );
            }
        });
    });

    $(document).on( "change paste keyup", "input[type=text], textarea", function(){
        var $name = ($(this).attr("name")) ? $(this).attr("name") : $(this).parents(".list-questions-ol").attr("id");
        if( $(".save-field").is(":disabled") && ($name.indexOf( $(".save-field").attr("for") >= 0) )){
            $(".save-field").removeAttr("disabled");
        }
        if( $(".check-btn.disabled").length && ($name.indexOf( $(".check-btn").parents(".nav-exercise").attr("for") >= 0) )){
            $(".check-btn.disabled").removeClass("disabled");
        }
        if( $(this).parents(".wrong").length ){
            $(this).parents(".wrong").removeClass("wrong");
        }
        if( $(".hints-if-mistake").length ){
            var el = findHint($(this));
            el.parents(".hints-if-mistake").removeClass("open");
            el.parents(".hints-if-mistake").find(".open").removeClass("open");
        }
    });

    //sort words from text
    $(document).on('mousedown', ".sort-words li", function(){
        $(this).addClass("focus");
    });

    $(document).on('click', ".sort-words li", function(){
        if(!( $(this).parents(".sort-words").hasClass('drop-list') )) {
            $( "#"+ $(this).attr('id')+"-clone").after($(this));
            $( "#"+ $(this).attr('id')+"-clone").remove();
            $( "#"+ $(this).attr('id')).removeAttr("style");
            $( "#"+ $(this).attr('id')).removeClass("wrong");
        }
    });

    $(document).on('mouseup', ".sort-words li", function(){
        $(this).removeClass("focus");
    });

    startSortOfWordsFromText();

    function startSortOfWordsFromText(){
        $('.sort-words').sortable({
            placeholder: 'placeholder',
            connectWith: '.sort-words',
            items: "li:not(.in-use)",
            start: function(event, ui) {
                if( $(this).hasClass("drop-list") ) {  //ul-parent list
                    var id = ui.item[0]["id"]; //get moved element id
                    var $elem = ui.item.clone();
                    $elem.attr("style","");
                    $elem[0]["id"] = id + "-clone";
                    $elem.addClass("in-use");
                    $(this).find(".focus").after( $elem );
                } else {
                    $('#'+ui.item[0]["id"]).removeClass("wrong");
                }
            },
            stop: function(event, ui) {
                //$parentUl where element stopped (it's new area)
                //$droppedEl element moved
                //$(this) where element from
                var $parentUl = $(ui.item["0"].offsetParent);
                var $droppedEl = $(ui.item["0"]);
                if( $parentUl.hasClass("drop-list") ) {
                    $droppedEl.removeClass("wrong");
                    if( $(".only-one-paste").length ){
                        $droppedEl.removeClass("old");
                    }
                    $( "#"+ ui.item[0]["id"]+"-clone").after(ui.item);
                    $( "#"+ ui.item[0]["id"]+"-clone").remove();
                    $( "#"+ ui.item[0]["id"]).attr("style","");
                } else {
                    if( $parentUl.parents(".only-one-paste").length ){
                        $droppedEl.addClass("old");
                    }
                    var correctAns = $parentUl.attr("answers_correct").split(",");
                    if( $.inArray( $droppedEl.attr("id"), correctAns ) == -1 ){
                        $droppedEl.addClass("wrong");
                    } else {
                        $droppedEl.removeClass("wrong");
                    }
                }
                $("li.focus").removeClass("focus");
            },
            receive: function(event, ui) {
                //if target list not empty, change old element to new and return old element to main list
                //$(this) where element stopped (it's new area)
                if( $(this).parents(".only-one-paste").length ){
                    $(ui.item["0"]).removeClass("old");
                    if( ( $(this).find("li.old").length ) && ( !( $(this).hasClass(".drop-list") ) ) ) {
                        var $elem = $(this).find("li.old");
                        $( "#"+ $elem.attr('id')+"-clone").after($elem);
                        $( "#"+ $elem.attr('id')+"-clone").remove();
                        $( "#"+ $elem.attr('id')).removeAttr("style");
                        $( "#"+ $elem.attr('id')).removeClass("wrong");
                        $(".sort-words.drop-list li.old").removeClass("old");
                        sortItemSize();
                    }
                }
            }
        });
    }

});

//---work with iframe video---
//make css for YouTube video iframe
// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

// this function gets called when API is ready to use
// function onYouTubePlayerAPIReady() {
function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    $(".video-iframe-wrapper iframe").each(function(){
        var frameId = this.id;
        // console.log(this.id);
        if( frameId ){
            player = new YT.Player( frameId, {
                events: {
                    // call this function when player is ready to use
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    });
}

function onPlayerReady(event) {
    // bind events
    $(event.target.a).parents(".video-iframe-wrapper").find(".btn-video").click(function(){
        $(this).parents(".video-iframe-wrapper").toggleClass("is-playing");
        if( $(this).parents(".video-iframe-wrapper").hasClass("is-playing") ){
            event.target.playVideo();
        } else{
            event.target.pauseVideo();
        }
    });
}

// when video ends
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING){
        $(event.target.a).parents(".video-iframe-wrapper").addClass("is-playing");
    } else{
        if (event.data == YT.PlayerState.PAUSED){
            $(event.target.a).parents(".video-iframe-wrapper").removeClass("is-playing");
        } else
        //Buffering/Video Ended
            $(event.target.a).parents(".video-iframe-wrapper").removeClass("is-playing");
    }
}
//---end work with iframe video---

function showChecklistLink(){
    if($(".show-checklist-other").length){
        $(".show-checklist-other").toggleClass("hide");
    }
    if( $(".show-checklist").length ){
        $(".show-checklist").toggleClass("open");
    } else {
        if( $(".popup-window").length ){
            $(".popup-window").addClass("open");
            $("body").addClass("no-scroll");
        } else {
            if( $("div.textarea-middle").length ){
                $("div.textarea-middle").toggleClass("open");
            }
        }
    }
}

$(document).on("click", ".show-checklist-link", function(){
    if( $(this).hasClass("show-table-link") ){
        $(this).toggleClass("red");
        $(".show-table").toggleClass("hide");
    }
    if( $(this).hasClass("show-more-link") ){
        $(this).toggleClass("red");
        $(this).parents("li").find(".show-more").toggleClass("hide");
    }else{
        showChecklistLink();
    }
    return false;
});

//save all user answers in database for show user progress in main page
function saveUserAnswers(){
    $.ajax({
        url: myVars.ajaxUrl, // Notice the AJAX URL here!
        type: 'post',
        data: {
            action: 'my_action_section_progress',
            page_id: $("article.container").attr("id").replace("post-", "") //current page ID = it visible in URL
        }, // Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
        cache: false,
        success: function ( response ) {
            console.log("success saveUserAnswers");
            console.dir( response );
        },
        error: function ( response ) {
            console.log("error");
            console.dir( response );
        }
    });
}
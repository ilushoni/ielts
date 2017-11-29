/**
 * Created by User on 09.08.2017.
 */
$( document ).ready(function() {

    footerFix();
    $(window).resize(function(){
        footerFix();
    });
    function footerFix() {
        var h = 0;
        $("body").children().each(function(){
            h += $(this).height();
        });
        ( h < $(window).height() ) ? ($(".footer-wrapper").addClass("fixed-bottom")) : ($(".fixed-bottom").removeClass("fixed-bottom"));
    }

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

    $(".show-popup-btn").click(function(){
        $(".popup-text").addClass("open");
        $("body").addClass("no-scroll");
        return false;
    });

    $(".popup-text .icon-close").click(function(){
        $(".popup-text").removeClass("open");
        $("body").removeClass("no-scroll");
    });

    $(".popup-text").mouseup(function(e) { //TODO:think about it
        // if the target of the click isn't the container not a child of the container
        var container = $(".popup-text .book-page");
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

    function showHintForExample(){
        if( $("#task3-text-insert").length ) {
            var el_pos_left = $("li.example .text-field-group").position().left;
            var $el_btn = $( "li.example .btn-hint");
            var $el_hint = $( "li.example .hint");

            if( $(".check-btn").hasClass("disabled") ) {
                $el_btn = $( "li.example .btn-explain");
                $el_hint = $( "li.example .explain");
            }
            $el_btn.addClass("open");
            $el_hint.addClass("open").css("padding-left", el_pos_left );
        }
    }

    function showMessage(sumWrongAnswers){

        if ( sumWrongAnswers ) {
            $(".nav-exercise").addClass("has-wrong");
            $(".wrong-text").text('You’ve got '+ sumWrongAnswers +' mistakes. Correct them before continuing.');
            $(".check-btn").addClass("disabled");
        } else {
            $(".nav-exercise").removeClass("has-wrong").addClass("disabled");
            $(".check-btn").addClass("disabled");
            $(".page-nav-wrapper .page-next").removeClass("disabled");
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

            $(".select-field-group .choose-result").click(function(){

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

            $(".select-menu").click(function(){

                if( $(".nav-exercise").hasClass("disabled") )  {
                    return false;
                } else {
                    $(this).parents(".select-field-group").removeClass("open");
                }

            });

            $(".select-menu .item").click(function(){

                if( $(".nav-exercise").hasClass("disabled") )  {
                    return false;
                } else {

                    $(".check-btn.disabled").removeClass("disabled");

                    var var_numb = $(this).attr('var');
                    var $parent = $(this).parents(".select-field-group");

                    $parent.removeClass('wrong');

                    $parent.find(".selected").removeClass("selected");
                    $(this).addClass('selected');
                    $parent.find('*[selected="selected"]').removeAttr("selected");
                    $parent.find('[var="'+var_numb+'"]').attr('selected','selected');
                    $parent.find(".choose-result").text( $(this).text() );
                }

            });
        }

    }

    function selectModificationPosition(){
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

    $(window).resize(function(){
        showHintForExample();
        selectModificationPosition();
    });

    $(window).on('load', function(){
        showHintForExample();
        selectModificationPosition();
        selectModification();

        $(".check-btn").click(function(){

            if( $(this).hasClass("disabled") ) {
                return false;
            } else {

                $(this).addClass("disabled");
                switch( $(".list-questions-ol").attr("id") ){

                    case 'task3-text-insert':

                        $( ".text-field-group" ).attr( "class", "text-field-group" ); //remove all classes
                        $( ".open" ).removeClass("open");
                        $( ".btn-info" ).hide();
                        $( ".btn-explain" ).show();
                        showHintForExample();

                        $( ".text-field-group").each(function(){
                            switch ( $(this).find(".text-field").val() ) {
                                case $(this).find(".text-field").attr("correct_answer"):
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

                    case 'task4-select-words':

                        $( "li.example .word-select.key-word").addClass("selected");
                        $( ".word-select.selected").not(".key-word").addClass("wrong");
                        $( ".word-select.key-word").not(".selected").addClass("empty");
                        break;

                    case 'task5-drop-words':

                        $(".word-drop").addClass("wrong");
                        $(".word-drop.focus-wrapper").removeClass("focus-wrapper");
                        $("li.focus").removeClass("focus");

                        $(".wrong").each(function() {
                            if( $(this).find(".sort").attr("correct_answer") === $(this).find("li").attr("id") ) {
                                $(this).removeClass("wrong");
                            }
                        });
                        break;

                    case 'task6-choose-select':

                        $(".select-field-group").removeClass("open").addClass("wrong");

                        $(".select-field-group").each(function(){
                            if( $(this).find('.select-menu .item[correct_answer="1"]').hasClass('selected') ) {
                                $(this).removeClass('wrong');
                            }
                        });
                        break;

                    default:
                        //other tasks
                        console.log('other tasks');

                        var check_btn_for_tasks = $(this).parents(".nav-exercise").attr("for");

                        if( check_btn_for_tasks ) {

                            $('.'+check_btn_for_tasks).each(function(){

                                $(this).find("li").addClass("wrong");

                                switch( true ) {

                                    case ( $(this).hasClass("list-checkbox") ):
                                        $(this).find("input").each(function(){
                                            if( ( $(this).prop('checked') ) && ( $(this).attr("correct_answer") == "1" ) ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                            if( ( !($(this).prop('checked') )  ) && ( !( $(this).attr("correct_answer") == "1" ) ) ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                        });
                                        break;

                                    case ( $(this).hasClass("list-one-character") ):
                                        $(this).find("input").each(function(){
                                            if( $(this).val() == $(this).attr("correct_answer") ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                        });
                                        break;

                                    case ( $(this).hasClass("list-radiobutton") ):
                                        $(this).find("li").each(function(){
                                            if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                                                $(this).removeClass('wrong');
                                            }
                                        });
                                        break;

                                }

                            });

                        } else {

                            $(".list-questions-ul").each(function(){

                                $(this).find("li").addClass("wrong");

                                switch( true ) {

                                    case ( $(this).hasClass("list-checkbox") ):
                                        $(this).find("input").each(function(){
                                            if( ( $(this).prop('checked') ) && ( $(this).attr("correct_answer") == "1" ) ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                            if( ( !($(this).prop('checked') )  ) && ( !( $(this).attr("correct_answer") == "1" ) ) ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                        });
                                        break;

                                    case ( $(this).hasClass("list-one-character") ):
                                        $(this).find("input").each(function(){
                                            if( $(this).val() == $(this).attr("correct_answer") ) {
                                                $(this).parents("li").removeClass("wrong");
                                            }
                                        });
                                        break;

                                    case ( $(this).hasClass("list-radiobutton") ):
                                        $(this).find("li").each(function(){
                                            if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                                                $(this).removeClass('wrong');
                                            }
                                        });
                                        break;

                                    case ( $(this).hasClass("list-radio") ):
                                        $(this).find("li").each(function(){
                                            if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                                                $(this).removeClass('wrong');
                                            }
                                        });
                                        break;
                                }
                            });
                        }
                }
                showMessage( ( $(".wrong").length + $(".empty").length ) );
            }
        });
    });


    $(".check-btn").click(function(){

        if( $(this).hasClass("disabled") ) {
            return false;
        } else {

            $(this).addClass("disabled");
            switch( $(".list-questions-ol").attr("id") ){

                case 'task3-text-insert':

                    $( ".text-field-group" ).attr( "class", "text-field-group" ); //remove all classes
                    $( ".open" ).removeClass("open");
                    $( ".btn-info" ).hide();
                    $( ".btn-explain" ).show();
                    showHintForExample();

                    $( ".text-field-group").each(function(){
                        switch ( $(this).find(".text-field").val() ) {
                            case $(this).find(".text-field").attr("correct_answer"):
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

                case 'task4-select-words':

                    $( "li.example .word-select.key-word").addClass("selected");
                    $( ".word-select.selected").not(".key-word").addClass("wrong");
                    $( ".word-select.key-word").not(".selected").addClass("empty");
                    break;

                case 'task5-drop-words':

                    $(".word-drop").addClass("wrong");
                    $(".word-drop.focus-wrapper").removeClass("focus-wrapper");
                    $("li.focus").removeClass("focus");

                    $(".wrong").each(function() {
                        if( $(this).find(".sort").attr("correct_answer") === $(this).find("li").attr("id") ) {
                            $(this).removeClass("wrong");
                        }
                    });
                    break;

                case 'task6-choose-select':

                    $(".select-field-group").removeClass("open").addClass("wrong");

                    $(".select-field-group").each(function(){
                        if( $(this).find('.select-menu .item[correct_answer="1"]').hasClass('selected') ) {
                            $(this).removeClass('wrong');
                        }
                    });
                    break;

                default:
                    //other tasks
                    $(".list-questions-ul").each(function(){

                        $(this).find("li").addClass("wrong");

                        switch( true ) {

                            case ( $(this).hasClass("list-checkbox") ):
                                $(this).find("input").each(function(){
                                    if( ( $(this).prop('checked') ) && ( $(this).attr("correct_answer") == "1" ) ) {
                                        $(this).parents("li").removeClass("wrong");
                                    }
                                    if( ( !($(this).prop('checked') )  ) && ( !( $(this).attr("correct_answer") == "1" ) ) ) {
                                        $(this).parents("li").removeClass("wrong");
                                    }
                                });
                                break;

                            case ( $(this).hasClass("list-one-character") ):
                                $(this).find("input").each(function(){
                                    if( $(this).val() == $(this).attr("correct_answer") ) {
                                        $(this).parents("li").removeClass("wrong");
                                    }
                                });
                                break;

                            case ( $(this).hasClass("list-radiobutton") ):
                                $(this).find("li").each(function(){
                                    if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                                        $(this).removeClass('wrong');
                                    }
                                });
                                break;
                        }
                    });
            }
            showMessage( ( $(".wrong").length + $(".empty").length ) );
        }
    });

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
        var $el = $(this);
        $parent_el.find("li").addClass("wrong");
        switch( true ) {
            case ( $parent_el.hasClass("list-checkbox") ):
                $parent_el.find("input").each(function(){
                    if( ( $(this).prop('checked') ) && ( $(this).attr("correct_answer") == "1" ) ) {
                        $(this).parents("li").removeClass("wrong");
                    }
                    if( ( $(this).prop('checked') == false ) && ( $(this).parents("li").hasClass("wrong") ) ) {
                        $(this).parents("li").removeClass("wrong");
                    }
                });
                break;
            case ( $parent_el.hasClass("list-one-character") ):
                $parent_el.find("input").each(function(){
                    if( $(this).val() == $(this).attr("correct_answer") ) {
                        $(this).parents("li").removeClass("wrong");
                    }
                });
                break;
            case ( $parent_el.hasClass("list-radiobutton") ):
                $parent_el.find("li").each(function(){
                    if( $(this).find('input:checked').attr('correct_answer') == "1" ) {
                        $(this).removeClass('wrong');
                    }
                });
                break;
            case ( $parent_el.hasClass("list-radio") ):
                $parent_el.find("li").removeClass("wrong");
                if( ( $(this).prop('checked') == true ) && ( $(this).attr('correct_answer') !== "1" ) ) {
                    $(this).parents("li").addClass('wrong');
                }
                break;
        }
        $('*[class=""]').removeAttr('class');
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

    if( $(".section-menu.top-line.column-8.active-6").length || $(".section-menu.top-line.column-8.active-7").length || $(".section-menu.top-line.column-8.active-8").length ){
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

    $(document).on("click", ".show-checklist-link", function(){
    // $(".show-checklist-link").click(function(){
        $(".show-checklist").toggleClass("open");
        return false;
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
                sendUserData( $("article.container").attr('id').replace('post-', ''));
            });
            footerFix();
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
                sendUserData( $("article.container").attr('id').replace('post-', ''));
            });
            footerFix();
            return false;
        }
    });

    var timerId = null;

    //create timer

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
        // time_original = $(".timer .time-left").attr("duration");
        // time_parts = time_original.split(":");
        // time = parseInt(time_parts[0]*60) + parseInt(time_parts[1]);

        $(".game-question input").prop('checked', false);
        $(".load-one-by-one .game-question:first-child").addClass("visible");
        $(".game-results").hide();
        $(".game-results").attr("class", "game-results");
        if( $(".load-one-by-one .game-question").length > 0 ) {
            $(".page-next").hide();
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
                $(".page-next").removeAttr("style");
            } else {
                //not all answers is correct
                $(".show-count-answers").text(el_correct+"/"+count);
                $(".game-results").addClass("done-wrong");
                if( $(".last-try").length ){
                    $(".game-question").addClass("visible");
                    // $(".game-question input").addClass("disabled");
                    $(".game-question input").prop( "disabled", true );
                    $(".page-next").removeAttr("style");
                }else {
                    chooseShowHints();
                }
            }

        } else {
            //time is over, but user give not all answers
            $(".game-results").addClass("late");
        }
    }

    $(document).on( "click", ".btn-show-hints", function(){
        //show hints
        $(this).hide();
        $(".hints").show();
        $(".game-content").addClass("last-try");
    });

    $(document).on( "click", ".btn-try-again", function(){
        //clear all
        startGameSettings();
        makeTimer();
        if( $(".last-try").length ){
            $(".hints").hide();
            $(".exercise-nav").hide();
        }
    });

    $(document).on( "click", ".load-one-by-one .game-question input", function(){
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
});

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
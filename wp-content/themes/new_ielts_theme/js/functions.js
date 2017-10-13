/**
 * Created by User on 09.08.2017.
 */
$( document ).ready(function() {

    footerFix();
    $(window).resize(function(){
        footerFix();
    });
    function footerFix() {
        var h = $(".header-navigation-container").height() + $(".container.page").height() + $(".footer-wrapper").height();
        if( $("#wpadminbar").length ) {
            h += $("#wpadminbar").height();
        }
        if( $(".front-page-recent-posts").length ) {
            h += $(".front-page-recent-posts").height();
        }
        ( h < $(window).height() )?($(".footer-wrapper").addClass("fixed-bottom")):($(".fixed-bottom").removeClass("fixed-bottom"));
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

    // if( ( $(".task-name").text() == "Task 3" ) ||  ( $(".task-name").text() == "Task 4" ) || ( $(".task-name").text() == "Task 5" ) || ( $(".task-name").text() == "Task 6" ) ||  ( $(".task-name").text() == "1. Choose" ) ) {
    //     $(".page-nav-wrapper .page-next").addClass("disabled");
    // }

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
                    console.log('1111other tasks');

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

    //work with audio records
    $('.btn-record').click(function(){
        startRecording(this);
    });

    $('.btn-stop').click(function(){
        stopRecording(this);
    });

    function __log(e, data) {
        log.innerHTML += "\n" + e + " " + (data || '');
    }

    var audio_context;
    var recorder;

    function startUserMedia(stream) {
        var input = audio_context.createMediaStreamSource(stream);
        __log('Media stream created.');

        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');

        recorder = new Recorder(input);
        __log('Recorder initialised.');
    }

    function startRecording(button) {
        recorder && recorder.record();
        button.disabled = true;
        // button.nextElementSibling.disabled = false;
        $('.btn-stop').removeAttr('disabled');
        __log('Recording...');
    }

    function stopRecording(button) {
        recorder && recorder.stop();
        button.disabled = true;
        // button.previousElementSibling.disabled = false;
        $('.btn-record').removeAttr('disabled');
        __log('Stopped recording.');

        // create WAV download link using audio data blob
        createDownloadLink();

        recorder.clear();
    }

    function createDownloadLink() {
        recorder && recorder.exportWAV(function(blob) {
            console.log('create Download Link');
            // console.dir(blob);
            var url = URL.createObjectURL(blob);
            var li = document.createElement('li');
            var au = document.createElement('audio');
            var hf = document.createElement('a');

            au.controls = true;
            au.src = url;
            hf.href = url;
            var date = new Date();
            hf.download = 'audio-' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '-' + date.getDate() +'-'+ date.getMonth() + '-' + date.getFullYear() + '.wav';
            // hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = hf.download;
            li.appendChild(au);
            li.appendChild(hf);
            recordingslist.appendChild(li);
        });
    }

    window.onload = function init() {
        try {
            console.log('window.onload');
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            audio_context = new AudioContext;
            __log('Audio context set up.');
            __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
            __log('No live audio input: ' + e);
        });
    };
});
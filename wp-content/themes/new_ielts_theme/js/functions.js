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

    //work with audio records
    if( $(".log").length ) { //TODO change logo id

        var $log_el;
        var timerId = null;

        function formatDuration(seconds) {

            var sec = Math.floor( seconds );
            var min = Math.floor( sec / 60 );
            min = min >= 10 ? min : '0' + min;
            sec = Math.floor( sec % 60 );
            sec = sec >= 10 ? sec : '0' + sec;
            return min + ':' + sec;

        }

        $(document).on('click', '.btn-record', function(){
        // $('.btn-record').click(function(){

            if( $('.btn-stop:visible').length ){
                $('.btn-stop:visible').click();
            }

            $log_el = $(this).parents(".recorder").find(".log");

            startRecording($(this));
            var i=0;
            var $el = $(this).parents(".recorder").find(".record-duration");

            $el.text(formatDuration(i));
            timerId = null;
            timerId = setTimeout(function tick() {
                i++;
                $el.text(formatDuration(i));
                timerId = setTimeout(tick, 1000);
            }, 1000);

        });

        $(document).on("click", ".btn-stop", function(){
        // $('.btn-stop').click(function(){

            stopRecording($(this));
            var $el = $(this).parents(".recorder").find(".btn-record");
            if( $el.text() == "Record Myself" ) {
                $el.text("Re-record");
            }
            if (timerId) {
                clearTimeout(timerId); //cancel the previous timer.
                timerId = null;
            }

        });

        function __log(e, data) {
            var oldHtml = $log_el.html();
            $log_el.html(oldHtml + "\n" + e + " " + (data || ''));
        }

        var audio_context;
        var recorder;
        var record_i = 0; //recorder counter
        var durations = [];

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
            button.attr("disabled","disabled");

            var $el = button.parents(".recorder").find(".btn-stop");

            $el.removeAttr('disabled');
            __log('Recording...');
        }

        function stopRecording(button) {
            recorder && recorder.stop();

            // button.disabled = true;
            button.attr("disabled","disabled");

            var $el = button.parents(".recorder").find(".btn-record");

            $el.removeAttr('disabled');
            __log('Stopped recording.');
            // create WAV download link using audio data blob

            if( $(".load-task-by-task").length ) {
                var el_text = button.parents("li").find(".short").parent("span").clone();
                el_text.find(".short").text( "..." );
                var index = button.parents("li").index();
                var text = el_text.text();
                if( index === -1 ) index = 1;
                if( text === '' ) text = 'Your Recording';
                createDownloadLink( $(".insert-record-questions-list"), text, index );
            } else {
                createDownloadLink( button.parents(".recorder") );
            }

            recorder.clear();
        }

        function returnMusic(el){
            var $this = el.parents("li");
            var music_id = $this.find("audio").attr("id");
            var music = document.getElementById(music_id);

            return music;
        }

        function createDownloadLink(parent_el, text, index) {
            recorder && recorder.exportWAV(function(blob) {
                var url = URL.createObjectURL(blob);
                record_i++;

                if( parent_el.hasClass(".recorder") ) {
                    parent_el.find('.record-list').attr("id","record-list-"+record_i);

                    $('#record-list-'+record_i).append(
                        '<li>'+
                            '<audio id="music'+record_i+'" class="audio-el" src="'+url+'"></audio>' +
                            '<div id="audioplayer'+record_i+'" class="audioplayer">' +
                                '<button id="pButton'+record_i+'" class="btn-play play"></button>' +
                                '<p class="audio-text">'+
                                    '<span class="audio-name">Your answer to the question '+record_i+'</span>' +
                                    '<span class="duration"></span>' +
                                '</p>'+
                                '<div id="timeline'+record_i+'" class="timeline">' +
                                    '<div id="playhead'+record_i+'" class="playhead"></div>' +
                                '</div>' +
                            '</div>'+
                        '</li>'
                    );
                } else {
                    if( $('#record-play-item-'+index).length ) {

                        $('#record-play-item-'+index).html('');
                        $('#record-play-item-'+index).append(
                            '<audio id="music'+record_i+'" class="audio-el" src="'+url+'"></audio>' +
                            '<div id="audioplayer'+record_i+'" class="audioplayer">' +
                                '<button id="pButton'+record_i+'" class="btn-play play"></button>' +
                                '<p class="audio-text">'+
                                    '<span class="audio-name">'+text+'</span>' +
                                    '<span class="duration"></span>' +
                                '</p>'+
                                '<div id="timeline'+record_i+'" class="timeline">' +
                                    '<div id="playhead'+record_i+'" class="playhead"></div>' +
                                '</div>' +
                            '</div>'
                        );

                    } else {
                        parent_el.append(
                            '<li id="record-play-item-'+index+'">'+
                                '<audio id="music'+record_i+'" class="audio-el" src="'+url+'"></audio>' +
                                '<div id="audioplayer'+record_i+'" class="audioplayer">' +
                                    '<button id="pButton'+record_i+'" class="btn-play play"></button>' +
                                    '<p class="audio-text">'+
                                        '<span class="audio-name">'+text+'</span>' +
                                        '<span class="duration"></span>' +
                                    '</p>'+
                                    '<div id="timeline'+record_i+'" class="timeline">' +
                                        '<div id="playhead'+record_i+'" class="playhead"></div>' +
                                    '</div>' +
                                '</div>'+
                            '</li>'
                        );
                    }

                }

                $('audio[src="'+url+'"]').on("canplay", function () {
                    var d = formatDuration(this.duration);
                    $(this).parents("li").find(".duration").text( d );
                    durations.push(d);
                });

                $("audio").on('timeupdate', function(){
                    $(this).parents("li").find('.duration').text( formatDuration( Math.floor(this.currentTime) ) );
                });

                $('audio').on('ended', function() {
                    var music = returnMusic( $(this) );
                    $(this).parents("li").find('.btn-play').removeClass("pause").addClass("play");
                    $(this).parents("li").find('.duration').text( formatDuration( Math.floor(music.duration) ) );
                });

                $('<a href="' + url + '" class="btn btn-save-audio">save</button>')
                    .appendTo( $('#record-list-'+record_i+' li:last-child') )
                    // .appendTo( $('.record-list li:last-child') )
                    .click(function(){

                        var data = new FormData();
                        data.append('file', blob);
                        // data.append('file', blob, 'filename.wav');

                        $.ajax({
                            url :  wnm_custom.template_url+"/upload-audio.php",
                            type: 'POST',
                            data: data,
                            contentType: false,
                            processData: false,
                            success: function(data) {
                                console.log("boa! I can save file!");
                            },
                            error: function() {
                                console.log("not so boa!");
                            }
                        });

                        return false;
                    });
            });
        }

        $(document).on('click', '.btn-play', function(){

            var music = returnMusic( $(this) );
            var duration = music.duration;
            var timeline_id = $(this).parents("li").find(".timeline").attr("id");
            var timeline = document.getElementById(timeline_id);

            if( music.paused ) {
                music.play();
                switch( $(this).parents("li").find(".playhead").width() ){
                    case $(this).parents("li").find(".timeline").width() :
                        $(this).parents("li").find(".playhead").width(3);
                        break;
                    default:
                        var w = $(this).parents("li").find(".playhead").width() / $(this).parents("li").find(".timeline").width();
                        duration -= w;
                }
                $(this).parents("li").find(".playhead").animate({ width: timeline.offsetWidth + "px" }, ( duration * 1000), 'linear' );
                $(this).removeClass("play").addClass("pause");
            }else {
                music.pause();
                $(this).parents("li").find(".playhead").stop();
                $(this).removeClass("pause").addClass("play");
            }

            // $(this).toggleClass("play").toggleClass("pause");

        });

        window.onload = function init() {
            var i = 0;

            $(".log").each(function(){
                i++;
                $(this).attr("id","log-"+i);
            });

            $log_el = $(".log");

            try {
                // webkit shim
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                window.URL = window.URL || window.webkitURL;

                audio_context = new AudioContext;
                __log('Audio context set up.');
                __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            } catch (e) {
                console.log('No web audio support in this browser!');
            }

            navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
                __log('No live audio input: ' + e);
            });

        };
    }


    //get url parameter
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    $(document).on('click', ".check-answers-now input", function(){
    // $(".check-answers-now input").click(function(){
        console.log($(this).prop('checked'));

        var $parent_el = $(this).parents(".list-questions-ul");
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
                    // if( ( !($(this).prop('checked') )  ) && ( !( $(this).attr("correct_answer") == "1" ) ) ) {
                    //     $(this).parents("li").removeClass("wrong");
                    // }
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

    if( $(".section-menu.top-line.column-8.active-6").length || $(".section-menu.top-line.column-8.active-7").length || $(".section-menu.top-line.column-8.active-8").length ){
        $(".section-menu.top-line.column-8").addClass("visible_6-8");
        moveMenuCarousel('next');
    }

    // $(window).resize(function(){ //TODO resize problem
    //     if( $(window).width()>860 ) {
    //         $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").removeAttr("style");
    //     }else{
    //         if( $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").attr("style")!='' ){
    //             var x = 0;
    //             x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").width()+8;
    //             x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(3)").width()+8;
    //             x -= $(".section-menu.top-line.column-8 .menu-item:nth-child(4)").width()+8;
    //             x += 5;
    //             $(".section-menu.top-line.column-8 .menu-item:nth-child(2)").css("margin-left", x );
    //         }
    //     }
    // });

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
    // $(".el-play").click(function(){
        $(this).toggleClass("el-pause");
    });


    $.ajaxSetup({cache:false});
    //section SPEAK - load task by task on page
    function switchVisibleTask(next){
        var $el_task_wrap = $(".visible-task");
        $el_task_wrap.removeClass("visible-task").addClass("hide-task");
        $el_task_wrap = (next) ? $el_task_wrap.next() : $el_task_wrap.prev();
        $el_task_wrap.addClass("visible-task").removeClass("hide-task");
    }

    function taskSwitch(){
        var nextBtnText = ( $(".task-content:last-child").hasClass("visible-task") ) ? "Next" : $(".visible-task").next(".task-content").find(".task-name").text();
        $(".page-next").text(nextBtnText);
    }

    if( ( $(".load-task-by-task").length ) ) {
        $(".task-content:not(:first-child)").addClass("hide-task");
        $(".task-content:first-child").addClass("visible-task");
        taskSwitch();
    }

    $(document).on("click", ".page-nav-wrapper.load .page-prev", function(){
        if( $(".task-content:first-child").hasClass("hide-task") ) {
            switchVisibleTask();
            taskSwitch();
            return false;
        } else {
            if(!( $(this).parents(".page-nav-wrapper").hasClass("item-is-first") ) ) {
                var post_link = $(this).attr("href");
                $.get(post_link, function(data){ // Loads content into the 'data' variable.
                    var html = $.parseHTML( data );
                    $("article").replaceWith( $($(html)).filter("article") );
                    $(".task-content:not(:last-child)").addClass("hide-task");
                    $(".task-content:last-child").addClass("visible-task");
                    taskSwitch();
                    if( $(".sort-phrase").length ){
                        startSortOfPhrases();
                    }
                });
                return false;
            }
        }
    });

    $(document).on("click", ".page-nav-wrapper.load .page-next", function(){
        if($(".task-content:last-child").hasClass("hide-task") ) {
            switchVisibleTask('next');
            taskSwitch();
            return false;
        } else {
            if(!( $(this).parents(".page-nav-wrapper").hasClass("item-is-last") ) ) {
                var post_link = $(this).attr("href");
                $.get(post_link, function(data){ // Loads content into the 'data' variable.
                    var html = $.parseHTML( data );
                    $("article").replaceWith( $($(html)).filter("article") );
                    $(".task-content:not(:first-child)").addClass("hide-task");
                    $(".task-content:first-child").addClass("visible-task");
                    taskSwitch();
                    if( $(".sort-phrase").length ){
                        startSortOfPhrases();
                    }
                });
                return false;
            }
        }
    });

});
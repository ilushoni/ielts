/**
 * Created by User on 09.08.2017.
 */

/*helper functions*/
function footerFix() {
    var h = 0;
    $("body > *").each(function(){
        h += $(this).height();
    });
    (h < $(window).height()) ? ($(".footer-wrapper").addClass("fixed-bottom")) : ($(".fixed-bottom").removeClass("fixed-bottom"));
}
/*end helper functions*/

$(document).ready(function() {
    $.ajaxSetup({cache:false});

    /*fixed footer to the bottom if content is short*/
    footerFix();
    $(window).resize(function(){
        footerFix();
    });
    onElementHeightChange(document.body, function(){
        footerFix();
    });
    function onElementHeightChange(elm, callback){
        var lastHeight = elm.clientHeight, newHeight;
        (function run(){
            newHeight = elm.clientHeight;
            if( lastHeight != newHeight )
                callback();
            lastHeight = newHeight;
            if( elm.onElementHeightChangeTimer )
                clearTimeout(elm.onElementHeightChangeTimer);
            elm.onElementHeightChangeTimer = setTimeout(run, 200);
        })();
    }
    /*end fixed footer to the bottom if content is short*/

    /*frontpage only*/
    $(".all-sections-menu .success-line").each( function(){
        var w = $(this).attr("user_success");
        $(this).width( w+'%' );
    });
    /*end frontpage only*/

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

    /*accordion*/
    $( ".accordion" ).accordion();
    $( ".accordion" ).on( "accordionbeforeactivate", function( event, ui ) {
        if($.trim($(ui.newPanel).html()).length == 0)
            event.preventDefault();
    });
    /*end accordion*/
});

    /*popup*/
    $(document).on("click", ".open-popup", function(){
        var id = $(this).attr("href");
        $(id).addClass("open");
        $("body").addClass("no-scroll");
        return false;
    });
    $(document).on("click", ".close-popup", function(){
        $(this).closest(".popup-text").removeClass("open");
        $("body").removeClass("no-scroll");
    });
    $(".popup-text").mouseup(function(e) {// if the target of the click isn't the container not a child of the container
        var container = $(".popup-text > div");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $(".popup-text").removeClass("open");
            $("body").removeClass("no-scroll");
        }
    });
    /*end popup*/

    /*open blocks by click links*/
    $(document).on("click", ".open-block", function(){
        closeAllOpenBlock($(this));
        var id = $(this).attr("href");
        $(id).removeClass("hide");
        $(id).addClass("open");
        scrollToBlock($(id));
        if($(this).is("a")){
            return false;
        }
    });
    function scrollToBlock(el){
        $('html, body').animate({
            scrollTop: (parseInt(el.offset().top)-60)
        }, 1000);
    }
    function closeAllOpenBlock(el){
        if((el.is("label"))&&(el.closest(".single-choice").length)){
            el.closest(".single-choice").find("label.open-block").each(function(){
                $($(this).attr("href")).removeClass("open").addClass("hide");
            });
        }
    }
    /*end open blocks by click links*/

    /*dropdown*/
    makeDropdown(); //main function. call it only to make Dropdown functionality
    function makeDropdown(){
        if($(".move-dropdown").length){
            dropdownChangePosition();
        }
        var $select_wrap = $(".select-field-group");
        var i;
        $select_wrap.find("br").remove();
        $select_wrap.each(function(){
            i=1;
            $(this).find("select option").each(function(){
                $(this).attr('var', i++ );
            });
            dropdownCustom( $(this).find("label"), "<div />", $(this) );
            dropdownCustom( $(this).find("select"), "<ul />", $(this) );
            $(this).find("ul.select-menu option").each(function(){
                dropdownCustom( $(this), "<li />", $(this).parents(".select-menu"), 1 );
            });
        });
        dropdownHandler();
    }

    function dropdownChangePosition(){
        $(".select-field-group").each(function(){
            var el_pos_left = $(this).parents("li").find("strong").position().left;
            var col_width = $(this).parents(".entry-content").width();
            if( ( col_width - el_pos_left ) < 301 ) {
                el_pos_left = col_width - 300;
            }
            $(this).css("margin-left", el_pos_left );
        });
    }
    function dropdownCustom( $el, tag, $parent, remove ) {
        if( remove ) {
            changeDropdownType( $el, tag );
        } else {
            var $el_old = $el.clone();
            var el_class = $el_old.attr('class')+'-old';
            var el_id = $el_old.attr('id')+'-old';
            changeDropdownType( $el, tag );
            $el_old.hide().attr('class', el_class ).attr('id', el_id ).appendTo( $parent );
        }
    }
    function changeDropdownType($el, newType) {
        var attrs = {};
        $.each($el[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });
        $el.replaceWith(function () {
            return $(newType, attrs).append($(this).contents());
        });
    }
    function dropdownHandler(){
        $(document).on("click", ".choose-result", function(){
            var $parent = $(this).closest(".select-field-group");
            if($parent.hasClass("disabled"))  {
                return false;
            } else {
                if($parent.hasClass('open')) {
                    $(".select-field-group.open").removeClass('open');
                }else{
                    $(".select-field-group.open").removeClass('open');
                    $parent.addClass('open');
                }
            }
        });
        $(document).on("click", ".select-menu", function(){
            $(this).closest(".select-field-group").removeClass("open");
        });
        $(document).on("click", ".item", function(){
            var $parent = $(this).closest(".select-field-group");
            $parent.removeClass('wrong correct-answer');
            if($(this).parents(".check-now").length){
                if( $(this).attr("correct_answer") == "1" ) {
                    $parent.removeClass("wrong").addClass("correct-answer");
                } else {
                    $parent.removeClass("correct-answer").addClass("wrong");
                }
            }
            var var_numb = $(this).attr('var');
            $parent.find(".selected").removeClass("selected");
            $(this).addClass('selected');
            $parent.find('*[selected="selected"]').removeAttr("selected");
            $parent.find('[var="'+var_numb+'"]').attr('selected','selected');
            $parent.find(".choose-result").text($(this).text());
        });
        closeDropdownIfClickOutside($(".select-menu"))
    }
    function closeDropdownIfClickOutside($box){
        var $win = $(window); // or $box parent container
        $win.on("click.Bst", function(event){
            //checks if descendants of $box was clicked  and checks if the $box itself was clicked
            if ( $box.parents(".select-field-group").has(event.target).length == 0 && !$box.parents(".select-field-group").is(event.target) ){
                $(".select-field-group.open").removeClass("open");
            }
        });
        $(".select-field-group").click(function(e){
            if($(e.target).closest('.choose-result').length==0) {
                $(".select-field-group.open").removeClass("open");
            }
        });
    }
    function checkDropdowns($task){
        $task.find(".select-field-group.open").removeClass("open wrong");
        $task.find(".select-field-group").each(function(){
            if($(this).find('.select-menu .item[correct_answer="1"]').hasClass('selected')) {
                $(this).addClass('correct-answer');
            }
        });
        $task.find(".select-field-group:not(.correct-answer)").addClass("wrong");
    }
    $(document).on("click", ".select-field-group .item", function(){
        var $checkBtn = findCheckBtn($(this).closest(".task-choose-dropdown"), "check-btn");
        if(($checkBtn.hasClass("disabled"))&&($(this).closest(".task-choose-dropdown").find(".wrong").length)){
            activateCheckBtn($checkBtn);
        }
        $(this).closest(".select-field-group").removeClass("wrong empty");
    });
    /*end dropdown*/

    /*text fields handler*/
    $(document).on( "change paste keyup", "input[type=text], textarea", function(){
        var $parent = ($(this).hasClass("one-symbol")) ? $(this).closest("li") : $(this).closest(".text-field-group");
        if($(this).parents(".check-now").length){
            checkTextField($(this), $parent);
        }else{
            $parent.removeClass("wrong empty");
            var $saveBtn = findCheckBtn($(this), "save-btn");
            if(typeof $saveBtn === "undefined"){
                $saveBtn = findCheckBtn($(this).closest(".list-text-fields"), "check-btn");
            }
            if((typeof $saveBtn !== "undefined")&&($saveBtn.hasClass("disabled"))){
                activateCheckBtn($saveBtn);
            }
        }
    });
    function checkTextField(field, $parent){
        $parent.removeClass("wrong empty");
        if(field.closest(".one-symbol").length){
            field.val(field.val().replace(/\s+/g,'')); //remove spaces from text field
        }
        switch(field.val().toLowerCase()){
            case(field.attr("correct_answer").toLowerCase()):
                $parent.addClass("correct");
                field.attr("readonly", "readonly");
                break;
            case(''):
                if($parent.parents(".check-now").length==0){
                    $parent.addClass("empty");
                }
                break;
            default:
                $parent.addClass("wrong");
        }
    }
    function checkTextFieldArray($task){
        $task.find("input[type=text], textarea").removeClass("empty wrong");
        $task.find("input[type=text], textarea").each(function(){
            var $parent = ($(this).hasClass("one-symbol")) ? $(this).closest("li") : $(this).closest(".text-field-group");
            checkTextField($(this), $parent);
        });
        if($task.is("[hints]")){
            var $hints = $("#"+$task.attr('hints'));
            if($task.find(".empty,.wrong").length){
                $hints.find("li").addClass("hide");
                $task.find(".empty,.wrong").each(function(){
                    $hints.find("li:nth-child("+($(this).closest("li").index()+1)+")").removeClass("hide");
                });
                $hints.removeClass("hide");
                scrollToBlock($hints);
            }else{
                $hints.addClass("hide");
            }
        }
    }
    /*end text fields handler*/

    /*hints*/
$(document).ready(function() {
    if($(".hint").length){
        hintForExample($(".hint").closest(".hint-wrapper"));
    }
});
    function hintForExample($task){
        var $li = $task.find("li.example");
        var $checkBtn = findCheckBtn($task, "check-btn");
        if($checkBtn.hasClass("disabled")){
            openHint($li.find(".explain"));
        }else{
            $li.find(".btn-hint").addClass("open");
            openHint($li.find(".hint"));
        }
    }

    $(document).on("click", ".hint-wrapper li:not(.example) .btn-info", function(){
        var $parent = $(this).closest("li");
        var $el =( $(this).hasClass("btn-hint") ) ?  $parent.find(".hint") : $parent.find(".explain");
        openHint($el);
    });
    function openHint(el){
        var el_post_left = el.closest("li").find(".text-field-group").position().left;
        el.css("margin-left", el_post_left);
        el.toggleClass("open");
    }
    function checkHints($task, btn){ //if task has hints and explain fields for user
        $task.removeClass("class","text-field-group");
        $task.find(".open").removeClass("open");
        $task.find(".btn-explain").addClass("open");
        hintForExample($task);
        $task.find( ".text-field-group").each(function(){
            checkTextField($(this).find(".text-field"), $(this));
        });
    }
    $(document).on("focus", ".hint-wrapper li:not(.example) .text-field-group:not(.correct) .text-field", function(){
        var $checkBtn = findCheckBtn($(this).closest(".hint-wrapper"), "check-btn");
        var $parent = $(this).closest("li");
        if($parent.find(".btn-explain").is(":visible")){
            var $field = $(this);
            $field.data('oldVal', $field.val());
            $(document).on("change paste keyup", this, function(){
                if($field.data('oldVal') !== $field.val()) {  // If value has changed...
                    $parent.find(".text-field-group").attr("class","text-field-group");
                    $field.data('oldVal', $field.val()); // Updated stored value
                    $parent.find(".open").removeClass("open");
                    $parent.find(".btn-hint").addClass("open");
                    activateCheckBtn($checkBtn);
                }
            });
        }
    });
    /*and hints*/

    /*check answers when all done*/
    $(document).on("click", ".check-btn, .save-btn", function(){
        if($(this).hasClass("disabled")){
            return false;
        }else{
            disableCheckBtn($(this));
            var id = $(this).closest(".nav-exercise").attr("for").split(",");
            if($(this).hasClass("check-btn")){
                checkAnswers(id, $(this));
            }
            if($(this).hasClass("save-btn")){
                saveAnswers(id, $(this));
            }
        }
    });
    function checkAnswers($taskArray, btn){
        $.each($taskArray, function(index, value){
            var $task = $("#"+$.trim(value));
            switch(true){
                case($task.hasClass("hint-wrapper")):
                    checkHints($task, btn);
                    break;
                case($task.hasClass("multiple-choice")):
                    checkMultipleChoice($task);
                    break;
                case($task.hasClass("task-drop-words")):
                    checkSortWords($task);
                    break;
                case($task.hasClass("task-select-words")):
                    checkSelectWords($task);
                    break;
                case($task.hasClass("task-choose-dropdown")):
                    checkDropdowns($task);
                    break;
                case($task.hasClass("list-text-fields")):
                    checkTextFieldArray($task);
                    break;
                case($task.hasClass("sort-phrase-wrap")):
                    checkSortPhrases($task);
                    break;
            }
            var sum = ($task.find(".wrong").length + $task.find(".empty").length);
            sum += (($task.hasClass("sort-phrase-wrap"))&&($task.find(findDropList($task)).length == 0)) ? (findDropList($task).find(".empty").length) : 0;
            showMessage(btn, sum);
        });
    }

    function disableCheckBtn(btn){
        btn.addClass("disabled");
    }
    function activateCheckBtn(btn){
        btn.removeClass("disabled");
    }
    function findCheckBtn($task, btnClass){
        var $checkBtn;
        $(".nav-exercise[for]").each(function(){
            if($(this).attr("for").indexOf($task.attr("id")) != -1){
                $checkBtn = $(this).find("."+btnClass);
            }
        });
        return $checkBtn;
    }
    function showMessage($checkBtn, sumWrongAnswers){
        var $class = ($checkBtn.closest(".nav-exercise").hasClass("align-left")) ? "nav-exercise align-left ": "nav-exercise ";
        if(sumWrongAnswers) {
            var text = 'You’ve got '+ sumWrongAnswers +' mistakes. Correct them before continuing.';
            $checkBtn.closest(".nav-exercise").find(".wrong-text").text(text);
            $checkBtn.closest(".nav-exercise").attr("class", $class+"has-wrong");
        }else{
            $checkBtn.closest(".nav-exercise").attr("class", $class+"has-success");
            openBlockIfSuccess($checkBtn);
            $(".page-next.disabled").removeClass("disabled");
        }
    }
    function openBlockIfSuccess($checkBtn){
        if($checkBtn.closest(".nav-exercise[success]").length){
            var arrayBlock = $checkBtn.closest(".nav-exercise").attr("success").split(",");
            $.each(arrayBlock, function(index, value){
                var $block = $("#"+$.trim(value));
                $block.removeClass("hide");
                $block.addClass("open");
            });
        }
    }
    /*end check answers when all done*/

    /*multiple choice*/
    $(document).on("click", ".multiple-choice input", function(){
        var $checkBtn = findCheckBtn($(this).closest(".multiple-choice"), "check-btn");
        if($checkBtn.closest(".nav-exercise").hasClass("has-success")){
            return false;
        }else{
            $(this).closest("li").removeClass("wrong empty");
            activateCheckBtn($checkBtn);
        }
    });
    function checkMultipleChoice($task){
        $task.find(".wrong, .empty").removeClass("wrong empty correct");
        $task.find("input").each(function(){
            var $parent = $(this).closest("li");
            var id = $(this).attr("id");
            if($(this).is(":checked")){
                if($(this).is("[correct_answer]")){
                    $parent.addClass("correct");
                }else{
                    $parent.addClass("wrong");
                }
            }else{
                if($(this).is("[correct_answer]")){
                    $parent.addClass("empty");
                }
            }
        });
    }
    /*end multiple choice*/

    /*sort words check*/
    function checkSortWords($task){
        $task.find(".word-drop.focus-wrapper").removeClass("focus-wrapper");
        $task.find("li.focus").removeClass("focus");
        $task.find(".word-drop").removeClass("empty wrong");
        $task.find(".word-drop").each(function(){
            if(!$(this).find(".sort").has("li").length){
                $(this).addClass("empty");
            }else{
                if($(this).find(".sort").attr("correct_answer") === $(this).find("li").attr("id")) {
                    $(this).find(".sort").addClass("disabled");
                    $(this).find(".sort").sortable('disable');
                }else{
                    $(this).addClass("wrong");
                }
            }
        });
    }
    $(document).on("mousedown", ".sort li", function(){
        if($(this).parents(".check-now").length == 0){
            var $task = $(this).closest(".task-drop-words");
            if($(this).closest(".sort").hasClass("drop-list")){
                $task = $(this).closest(".sort").siblings(".task-drop-words");
            }
            var $checkBtn = findCheckBtn($task, "check-btn");
            if(($checkBtn.hasClass("disabled"))&&(!$(this).closest(".sort").hasClass("disabled"))){
                activateCheckBtn($checkBtn);
            }
        }
    });
    /*end sort words check*/

    /*task select words*/
    $(".task-select-words .word-select").click(function(){
        if(!$(this).closest("li").hasClass("example")){
            var $checkBtn = findCheckBtn($(this).closest(".task-select-words"), "check-btn");
            if(($checkBtn.hasClass("disabled"))&&($(this).closest(".task-select-words").find(".wrong, .empty").length)){
                activateCheckBtn($checkBtn);
            }
            $(this).toggleClass("selected").removeClass("wrong empty");
        }
        return false;
    });
    function checkSelectWords($task){
        $task.find("li.example").find(".word-select.key-word").addClass("selected");
        $task.find(".word-select.selected").not(".key-word").addClass("wrong");
        $task.find(".word-select.key-word").not(".selected").addClass("empty");
    }
    /*end task select words*/

    /*save button functionality*/
    function saveAnswers($fieldsArray, btn){
        var flag=1;
        $.each($fieldsArray, function(index, value){
            var $field = $("#"+$.trim(value));
            $field.parent().removeClass("empty");
            if($.trim($field.val())==''){
                $field.parent().addClass("empty");
                flag=0;
            }
        });
        if(flag){
            var page_id = getPageId();
            var $field = {};
            $.each($fieldsArray, function(index, value){
                $field[$.trim(value)] = $("#"+$.trim(value)).val();
            });
            $.ajax({
                url: myVars.ajaxUrl, // Notice the AJAX URL here!
                type: 'post',
                data: {
                    action: 'my_action_save_field',// Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
                    page_id: page_id, //current page ID = it visible in URL
                    field: $field //current page ID, it visible in <article>
                },
                cache: false,
                success: function(response) {
                    // activateCheckBtn(btn);
                    openBlockIfSuccess(btn);
                },
                error: function(response) {
                    console.log("ERROR "+response);
                }
            });
        }
    }
    function getPageId(){
        return $("article.container").attr('id').replace('post-', '');
    }
    /*end save button functionality*/

    /*game with timer*/
$(document).ready(function() {
    if($(".game-wrapper").length){
        startGameSettings();
    }
});
    function startGameSettings(){
        $(".game-hint-list ul, .game-hint-list ul li").addClass("hide");
        $(".questions-wrapper input[type='radio']").prop('checked', false);
        var time_parts = $(".timer .time-left").attr("duration").split(":");
        if(time_parts.length > 1){
            $(".timer .time-left").attr("duration", (parseInt(time_parts[0]*60)+parseInt(time_parts[1])));
        }
        showNextGameQuestion(-1);
    }
    $(document).on("click", ".start-timer-btn", function(){
        startUntiTimer($(this));
        $(this).parents(".game-wrapper").find(".questions-wrapper").removeClass("hide");
    });
    function startUntiTimer(btn){
        btn.attr("disabled", "disabled");
        btn.text("The game started");
        untiTimer($(".timer .time-left").attr("duration"), $(".timer .time-left"));
    }
    var untiTimerId;
    function untiTimer(seconds, el){
        el.text(formatDuration(seconds, true));
        el.attr("current_time", seconds);
        seconds--;
        untiTimerId = setInterval(function() {
            if(seconds){
                el.text(formatDuration(seconds, true));
                el.attr("current_time", seconds);
                seconds--;
            }else{
                clearInterval(untiTimerId);
                if(el.parents(".game-wrapper").length){
                    gameOver(el, true);
                }
            }
        }, 1000);
    }
    $(document).on("click", ".questions-wrapper input[type='radio']", function(){
        if(!$(".start-timer-btn").is("[disabled]")){
            startUntiTimer($(".start-timer-btn"));
        }
        var $parentUl = $(this).closest(".single-choice");
        if($parentUl.find("input[type='radio']:checked").length == $parentUl.find("li").length){
            showNextGameQuestion($parentUl);
        }
    });
    function showNextGameQuestion(ul){
        $(".questions-wrapper > *").addClass("hide");
        if(ul == -1){
            $(".questions-wrapper > *:first-of-type").removeClass("hide");
        }else{
            if(ul.is(":last-child")){
                gameOver(ul, false);
                return false;
            }else{
                $("#"+ul.attr('id') + "+h5").removeClass("hide");
                $("#"+ul.attr('id') + "+h5+ul").removeClass("hide");
            }
        }
    }
    function gameOver(el, timeover){
        var $wrapTask = el.parents(".game-wrapper");

        if(timeover){
            $wrapTask.find(".giant-letters").text("00:00");
            $wrapTask.addClass("not-enough-time");
        }else{
            var $task = $wrapTask.find(".questions-wrapper");
            checkSingleChoice($task);

            var sum = $task.find("li").length;
            var count = sum - $task.find(".wrong").length;
            $wrapTask.find(".giant-letters").text(count+"/"+sum);
            if(count == sum){
                $wrapTask.addClass("success");
            }
        }

        if($wrapTask.hasClass("last-try")){
            $wrapTask.addClass("show-wrong-answers");
            $wrapTask.find(".questions-wrapper").find(".hide").removeClass("hide");
            if(timeover){
                $wrapTask.find(".game-hint-list").find(".hide").removeClass("hide");
            } else{
                showGameHints($wrapTask);
            }
            scrollToBlock($(".task-name"));
        }

        $wrapTask.addClass("game-over");
    }
    function checkSingleChoice($task){
        $task.find(".wrong").removeClass("wrong");
        $task.find("input:checked").each(function(){
            if(!$(this).is("[correct_answer]")){
                $(this).closest("li").addClass("wrong");
            }
        });
    }
    $(document).on("click", ".show-hints-btn", function(){
        var $wrapTask = $(this).parents(".game-wrapper");
        showGameHints($wrapTask);
        $wrapTask.addClass("show-hint-list");
    });
    function showGameHints($wrapTask){
        $wrapTask.find(".game-hint-list *:not(.h5-large)").addClass("hide");
        $wrapTask.find(".game-hint-list *[single]").removeAttr("single");
        $wrapTask.find(".questions-wrapper ul").each(function(){
            var elWong = $(this).find("li.wrong");
            switch(true){
                case(elWong.length == 1):
                    $.each(elWong.attr("class").split(' '), function(index, value){
                        $wrapTask.find(".game-hint-list *."+value).removeClass("hide");
                        $wrapTask.find(".game-hint-list *."+value).attr("single", "");
                    });
                    break;
                case(elWong.length > 1):
                    elWong.each(function(){
                        $.each($(this).attr("class").split(' '), function(index, value){
                            $wrapTask.find(".game-hint-list *."+value).removeClass("hide");
                        });
                    });
                    break;
            }
        });
        $wrapTask.find(".game-hint-list ul:has(li:not(.hide))").removeClass("hide");
        $wrapTask.find(".game-hint-list ul:not(.hide)").prev("[for]").removeClass("hide");
    }
    $(document).on("click", ".try-again-btn", function(){
        var $wrapTask = $(this).parents(".game-wrapper");
        if($wrapTask.hasClass("show-hint-list")){
            $wrapTask.addClass("last-try");
        }
        $wrapTask.removeClass("game-over not-enough-time show-hint-list");
        startGameSettings();
        clearInterval(untiTimerId);
        untiTimer($(".timer .time-left").attr("duration"), $(".timer .time-left"));
    });
    /*end game with timer*/

    /*sort phrases check*/
    function checkSortPhrases($task){
        var dropList = findDropList($task);
        dropList.find(".empty").removeClass("empty");
        $task.find(".wrong, .empty").removeClass("wrong empty");
        $task.find(".sort-phrase:not(.drop-list)").each(function(){
            var correctAns = $(this).attr("answers_correct").split(",");
            $(this).find("li").each(function(){
                if($.inArray( $(this).attr("id"), correctAns ) == -1){
                    $(this).addClass("wrong");
                }
            });
        });
        if(dropList.find("li:not(.in-use)").length){
            dropList.find("li:not(.in-use)").addClass("empty");
        }
    }
    function findDropList($task){
        var dropList = ($task.find(".drop-list").length) ? $task.find(".drop-list") : $task.prev(".drop-list");
        return dropList;
    }
    /*end sort phrases check*/


/*data to time format*/
function formatDuration(seconds, addNull) {
    var sec = Math.ceil( seconds );
    var min = Math.floor( sec / 60 );
    sec = Math.ceil( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;
    min = (addNull && (min >= 10)) ? min : '0' + min;
    return min + ':' + sec;
}
/*end data to time format*/

/*work with iframe video*/
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
    $(".video-iframe-wrapper iframe").each(function(){ // create the global player from the specific iframe (#video)
        var frameId = this.id;
        if( frameId ){
            player = new YT.Player( frameId, {
                autoplay: 0,
                showinfo: 0,
                controls: 0,
                autohide: 1,
                events: {
                    'onReady': onPlayerReady, // call this function when player is ready to use
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    });
}
function onPlayerReady(event) {
    $(event.target.a).closest(".video-iframe-wrapper").find(".btn-video").click(function(){ // bind events
        var $wrapper = $(this).closest(".video-iframe-wrapper");
        if(!$wrapper.parents(".disabled").length){
            if($wrapper.hasClass("is-playing")){
                event.target.pauseVideo();
            } else{
                event.target.playVideo();
            }
        }
    });
}
// when video ends
function onPlayerStateChange(event) {
    if(event.data == YT.PlayerState.PLAYING){
        $(event.target.a).closest(".video-iframe-wrapper").addClass("is-playing");
    } else{
        if(event.data == YT.PlayerState.PAUSED){
            $(event.target.a).closest(".video-iframe-wrapper").removeClass("is-playing");
        } else{
            $(event.target.a).closest(".video-iframe-wrapper").removeClass("is-playing");//Buffering/Video Ended
        }
    }
}
/*end work with iframe video*/
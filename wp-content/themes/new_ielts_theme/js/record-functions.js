$.ajaxSetup({cache:false});
//section SPEAK - load task by task on page

var durations = [];
var timerId = null;
var audio_context;
var recorder;
var record_i = 0;

function __log(e, data) {
    console.log(e + " " + (data || ''));
}

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.');
    recorder = new Recorder(input);
    __log('Recorder initialised.');
}

function init() {
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        __log('Audio context set up.');
        __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        __log('No web audio support in this browser!');
    }
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        __log('No live audio input: ' + e);
    });
}

$(document).ready(init());
// $(window).on("load", init());


function startRecording(button) {
    recorder && recorder.record();
    button.attr("disabled","disabled");
    var $el = button.parents(".recorder").find(".btn-stop");
    $el.removeAttr('disabled');
    __log('Recording...');
}

function formatDuration(seconds) {
    var sec = Math.floor( seconds );
    var min = Math.floor( sec / 60 );
    min = min >= 10 ? min : '0' + min;
    sec = Math.floor( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}

$(document).on('click', '.btn-record', function(){
    $('.btn-stop:visible').click();
    startRecording($(this)); //TODO: problem
    var $el = $(this).parents(".recorder").find(".record-duration");
    var i=0;
    $el.text(formatDuration(i));
    timerId = null;
    timerId = setTimeout(function tick() {
        i++;
        $el.text(formatDuration(i));
        timerId = setTimeout(tick, 1000);
    }, 1000);
});

$(document).on("click", ".btn-stop", function(){
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

function stopRecording(button) {
    recorder && recorder.stop();
    button.attr("disabled","disabled");
    button.parents(".recorder").find(".btn-record").removeAttr('disabled');
    __log('Stopped recording.');
    if( $(".task-name.task-speaking").length ) {
        var $el = button.parents("li").find(".short").parent("span").clone();
        var el_text = "Your Recording";
        var el_text_short = "Your Recording";
        if( $el.length ) {
            el_text = $el.text();
            if( $el.find(".short").length ){
                $el.find(".short").text("...");
            }
            el_text_short = $el.text();
        }
        if( button.parents(".one-line-recorder").length ){
            createDownloadLink( button.parents(".recorder") );
        }
        // else {
            SaveAudioFile( button.parents("li").index(), el_text , el_text_short);
        // }
    }else {
        createDownloadLink( button.parents(".recorder") );
    }
    recorder.clear();
}

function SaveAudioFile(page_question_number, question_text, question_text_short){
    recorder && recorder.exportWAV(function(blob) {
        var page_id = $("article.container").attr('id').replace('post-', '');
        var formData = new FormData();
        formData.append('action', 'my_save_audio_file');
        formData.append('page_id', page_id);
        formData.append('page_question_number', page_question_number);
        formData.append('question_text', question_text);
        formData.append('question_text_short', question_text_short);
        formData.append('file', blob);
        $.ajax({
            url: myVars.ajaxUrl, // Notice the AJAX URL here!
            type: 'post',
            data: formData, // Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
            cache: false,
            processData: false,
            contentType: false,
            success: function ( response ) {
                console.log( "success" );
                console.dir( response );
            },
            error: function ( response ) {
                console.log( "ERROR" );
                console.dir( response );
            }
        });
    });
}

function createDownloadLink(parent_el, text, index) {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        record_i++;

        if( parent_el.hasClass("recorder") ) {
            if( parent_el.parents(".one-line-recorder").length ){
                parent_el.parents(".one-line-recorder").find('.record-list').attr("id","record-list-"+record_i);
            } else {
                parent_el.find('.record-list').attr("id","record-list-"+record_i);
            }

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
        audioHandler();
    });
}

//audio handler
function returnMusic(el){
    var $this = el.parents("li");
    var music_id = $this.find("audio").attr("id");
    var music = document.getElementById(music_id);
    return music;
}

function audioHandler(){
    $('audio').on("canplay", function () {
        var d = formatDuration(this.duration);
        $(this).parents("li").find(".duration").text(d);
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
}

audioHandler();

function pauseAudio(music, $this){
    music.pause();
    $this.parents("li").find(".playhead").stop();
    $this.removeClass("pause").addClass("play");
}

$(document).on('click', '.btn-play', function(){
    var music = returnMusic( $(this) );
    var duration = music.duration;
    var timeline_id = $(this).parents("li").find(".timeline").attr("id");
    var timeline = document.getElementById(timeline_id);

    if( ( $(".recorder").length ) && ( $(".record-duration").text() !== "" ) ){
        $(".record-duration").empty();
    }

    if( music.paused ) {
        if( $(".btn-play.pause").length ){
            var $el = $(".btn-play.pause:not(.this)");
            var $el_music = returnMusic( $el );
            pauseAudio( $el_music , $el );
        }
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
        pauseAudio(music, $(this));
    }
});
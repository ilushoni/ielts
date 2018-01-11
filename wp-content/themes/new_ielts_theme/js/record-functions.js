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

    // var constraints = { audio: true, video: false };
    //     navigator.mediaDevices.getUserMedia(constraints)
    //     .then(function(mediaStream) {
    //         var video = document.querySelector('video');
    //         video.srcObject = mediaStream;
    //         video.onloadedmetadata = function(e) {
    //             video.play();
    //         };
    //     })
    //     .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.
}

$(document).ready(init());

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
        $el.addClass("btn-re-record");
    }
    if (timerId) {
        clearTimeout(timerId); //cancel the previous timer.
        timerId = null;
    }

    if( $(".show-after-record.hide").length ){
        $(".show-after-record.hide").removeClass("hide");
    }
});

function stopRecording(button) {
    recorder && recorder.stop();
    button.attr("disabled","disabled");
    button.parents(".recorder").find(".btn-record").removeAttr('disabled');
    __log('Stopped recording.');
    if( $(".task-name.task-speaking").length ) {
        if( button.closest("li").find(".caption").length ){
            var el_text, el_text_short;
            button.closest("li").find(".caption").each(function(){
                switch(true) {
                    case ($(this).attr('class').indexOf("full") >= 0):
                        el_text = $(this).text();
                        break;
                    case ($(this).attr('class').indexOf("short") >= 0):
                        el_text_short = $(this).text();
                        break;
                    default:
                        el_text = $(this).text();
                        el_text_short = $(this).text();
                }
            });
        }else{
            el_text = "Your Recording";
            el_text_short = "Your Recording";
        }
        if( button.parents(".one-line-recorder").length ){
            createDownloadLink( button.parents(".recorder") );
        }
        if( button.parents(".show-record-audio").length ){
            createDownloadLink( button.parents(".recorder") );
        }
        SaveAudioFile( button.parents("li").index(), el_text , el_text_short);
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
                if(parent_el.parents(".show-record-audio").length){
                    parent_el.parents(".show-record-audio").find('.record-list').attr("id","record-list-"+record_i);
                }else{
                    parent_el.find('.record-list').attr("id","record-list-"+record_i);
                }
            }
            $('#record-list-'+record_i).append(
                '<li id="record-play-item-'+record_i+'">'+
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
function audioHandler(){
    $('audio').on("canplay", function () {
        var d = formatDuration(this.duration);
        $(this).closest("li").find(".duration").text(d);
        durations.push(d);
    });

    $("audio").on('timeupdate', function(){
        $(this).closest("li").find('.duration').text( formatDuration( Math.floor(this.currentTime) ) );
    });

    $('audio').on('ended', function() {
        var music = returnMusic( $(this) );
        $(this).closest("li").find('.btn-play').removeClass("pause").addClass("play");
        $(this).closest("li").find('.duration').text( formatDuration( Math.floor(music.duration) ) );
    });
}

audioHandler();

function pauseAudio(music, $this){
    music.pause();
    $this.parents("li").find(".playhead").stop();
    $this.removeClass("pause").addClass("play");
}

function returnMusic(el){
    var $this = el.closest("li");
    var music_id = $this.find("audio").attr("id");
    var music = document.getElementById(music_id);
    return music;
}

$(document).on('click', '.btn-play', function(){
    if( $(this).parents(".disabled").length == 0 ){
        var music = returnMusic( $(this) );
        var duration = music.duration;
        var timeline_id = $(this).closest("li").find(".timeline").attr("id");
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
            switch( $(this).closest("li").find(".playhead").width() ){
                case $(this).closest("li").find(".timeline").width() :
                    $(this).closest("li").find(".playhead").width(3);
                    break;
                default:
                    var w = $(this).closest("li").find(".playhead").width() / $(this).parents("li").find(".timeline").width();
                    duration -= w;
            }
            $(this).closest("li").find(".playhead").animate({ width: timeline.offsetWidth + "px" }, ( duration * 1000), 'linear' );
            $(this).removeClass("play").addClass("pause");
        }else {
            pauseAudio(music, $(this));
        }
    }
});
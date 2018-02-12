$.ajaxSetup({cache:false});
//script for settings RECORD

var mediaRecorder;

var timerId;
function timer(seconds, el){
    if(seconds == -1){
        clearInterval(timerId);
    }else{
        el.text(formatDuration(seconds, false));
        seconds++;
        timerId = setInterval(function() {
            el.text(formatDuration(seconds, false));
            seconds++;
        }, 1000);
    }
}

function toggleBTtn(btn, show){
    (show) ? btn.removeAttr("disabled") : btn.attr("disabled", "true");
}

function startRecord(wrapEl){
    mediaRecorder.start();
    stopAllAudio();
    toggleBTtn(wrapEl.find(".btn-stop"), 1);
    toggleBTtn(wrapEl.find(".btn-record"), 0);
    timer(0, wrapEl.find(".record-duration"));
}

function stopRecord(wrapEl){
    mediaRecorder.stop();
    toggleBTtn(wrapEl.find(".btn-stop"), 0);
    toggleBTtn(wrapEl.find(".btn-record"), 1);
    timer(-1, wrapEl.find(".record-duration"));
}

function sendData(formData, parentLi){
    $.ajax({
        url: myVars.ajaxUrl, // Notice the AJAX URL here!
        type: 'post',
        data: formData, // Notice the action name here! This is the basis on which WP calls your process_my_ajax_call() function.
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {
            // console.log("success "+response);
            if(response){
                showRecordAudio(response, parentLi);
            }
        },
        error: function (response) {
            console.log("ERROR");
            console.dir(response);
        }
    });
}

function createData(blob, page_question_number, question_text, question_text_short, showAudio, parentLi){
    var page_id = $("article.container").attr('id').replace('post-', '');
    var formData = new FormData();
    formData.append('action', 'my_save_audio_file');
    formData.append('page_id', page_id);
    formData.append('page_question_number', page_question_number);
    formData.append('question_text', question_text);
    formData.append('question_text_short', question_text_short);
    formData.append('showAudio', showAudio);
    formData.append('file', blob);
    sendData(formData, parentLi);
}

function saveAudio(parentLi, blob){
    var el_text = "Your Recording";
    var el_text_short = "Your Recording";
    parentLi.find(".caption").each(function(){
        el_text = $(this).text();
        el_text_short = $(this).text();
        if($(this).hasClass("full"))
            el_text = $(this).text();
        if($(this).hasClass("short"))
            el_text_short = $(this).text();
    });
    var showAudio = ((parentLi.hasClass("one-line-recorder"))||(parentLi.hasClass("show-record-audio"))) ? 1 : 0;
    createData(blob, parentLi.index(), el_text , el_text_short, showAudio, parentLi);
}

function showRecordAudio(audioUrl, parentLi) {
    var list = parentLi.find(".record-list");
    var record_i = ($(".audioplayer").length) ? ($(".audioplayer").length + 1) : 1;
    // var record_i = (list.find("li").length) ? (parseInt(list.find("li").attr("id").match(/\d+/)) + 1) : 1;
    if(parentLi.hasClass("one-line-recorder")){
        list.empty();
    }
    loadMusic(audioUrl, record_i, list);
}

function loadMusic(url, id, list) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onload = function() {
        ctx.decodeAudioData(req.response, function(buffer) {
            // console.log(buffer);
            // console.log(buffer.duration);
            list.append(
                '<li id="record-play-item-'+id+'">'+
                '<audio id="music'+id+'" class="audio-el" src="'+url+'"></audio>' +
                '<div id="audioplayer'+id+'" class="audioplayer">' +
                '<button id="pButton'+id+'" class="btn-play play"></button>' +
                '<p class="audio-text">'+
                '<span class="audio-name">Your answer to the question '+id+'</span>' +
                '<span class="duration" duration="'+buffer.duration+'">'+formatDuration(buffer.duration, false)+'</span>' +
                '</p>'+
                '<div id="timeline'+id+'" class="timeline">' +
                '<div id="playhead'+id+'" class="playhead"></div>' +
                '</div>' +
                '</div>'+
                '</li>'
            );
        })
    };
    req.send();
}

var parentLi;

function stopAllRecord(){
    $(".recorder.supported .btn-stop:visible").each(function(){
        stopRecord($(this).closest(".recorder"));
        setRecordParentWrap($(this));
    });
}

function setRecordParentWrap(btn){
    var rec = btn.closest(".recorder");
    parentLi = (btn.parents(".record-questions-list").length) ? rec.closest("li") : rec.parent();
}

function stopAllAudio(){
    $(".btn-play.pause").each(function(){
        var wrapEl = $(this).closest(".audioplayer").parent();
        pauseAudio(wrapEl);
    });
}

function init(){
    // disable stop button while not recording
    $(".recorder .btn-stop").disabled = true;

    //main block for doing the audio recording
    //метод запрашивает у пользователя разрешение на использование мультимедийного ввода,
    //который создает MediaStream с дорожками, содержащими запрошенные типы носителей
    if (navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

        var constraints = { audio: true }; //ограничения
        var chunks = [];

        var onSuccess = function(stream) {
            //получил разрешение и доступ к потоку
            mediaRecorder = new MediaRecorder(stream);

            $(".recorder").addClass("supported");

            $(document).on("click", ".recorder.supported .btn-record", function(){
                stopAllRecord();
                startRecord($(this).closest(".recorder"));
            });
            $(document).on("click", ".recorder.supported .btn-stop", function(){
                stopRecord($(this).closest(".recorder"));
                setRecordParentWrap($(this));
            });

            mediaRecorder.onstop = function(e) {
                var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                chunks = [];
                saveAudio(parentLi, blob);
            };

            mediaRecorder.ondataavailable = function(e){
                chunks.push(e.data);
            };
            mediaRecorder.onerror = function(err){
                console.log("ERROR: something goes wrong during recording. "+err);
            };
        };

        var onError = function(err){
            console.log('ERROR: The following error occured: ' + err);
        };

        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
        console.log('ERROR: getUserMedia not supported on your browser!');
        $(".recorder").addClass("not-supported");
        $(".recorder.not-supported .btn-record, .recorder.not-supported .insert-record-questions-list").addClass("disabled");
    }
}

init();

// var ctx = new AudioContext();

var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

if (AudioContext) {
    // Do whatever you want using the Web Audio API
    var ctx = new AudioContext;
} else {
    // Web Audio API is not supported
    // Alert the user
    console.log("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
}

function showDuration(){
    $("audio").each(function(){
        var url = $(this).attr("src");
        var li = $(this).closest("li");
        var durationEl = $(this).closest("li").find(".duration");
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        req.onload = function() {
            ctx.decodeAudioData(req.response, function(buffer) {
                durationEl.attr("duration", buffer.duration);
                durationEl.text(formatDuration(buffer.duration, false));
                li.removeAttr("disabled");
            })
        };
        req.send();
    });
}

showDuration();

function pauseAudio(wrapEl){
    wrapEl.find("audio").get(0).pause();
    wrapEl.find(".playhead").stop();
    wrapEl.find(".btn-play").attr("class", "btn-play play");
    timer(-1, wrapEl.find(".duration"));
}

$(document).on('click', '.btn-play', function(){
    if(($(this).parents(".disabled").length==0)&&($(this).parents("[disabled]").length==0)){
        stopAllRecord();
        var wrapEl = $(this).closest(".audioplayer").parent();
        var music = wrapEl.find("audio").get(0);
        var duration = parseFloat(wrapEl.find(".duration").attr("duration"));
        var timeline = wrapEl.find(".timeline").get(0);
        var playhead = wrapEl.find(".playhead").get(0);

        if(music.paused) {
            stopAllAudio();
            music.play();
            if(wrapEl.hasClass("ended")){
                wrapEl.removeClass("ended");
                wrapEl.find(".playhead").width(3);
            }
            timer(Math.ceil(music.currentTime), wrapEl.find(".duration"));
            music.addEventListener("timeupdate", function() {
                var currentTime = music.currentTime;
                wrapEl.find(".playhead").stop(true,true).animate({'width':(currentTime +.25)/duration*100+'%'},250,'linear');
            });
            music.addEventListener("ended", function(){
                wrapEl.addClass("ended");
                pauseAudio(wrapEl);
            });
            $(this).attr("class", "btn-play pause");
        }else {
            pauseAudio(wrapEl);
        }
    }
});
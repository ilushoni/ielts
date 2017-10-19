<?php
if(isset($_FILES['file']) and !$_FILES['file']['error']){

//    $fname = $_FILES['file']['tmp_name']."-audio.wav";
//    $fname = $_FILES['file']['tmp_name'];
//    var_dump( $_FILES )
    $fname = "User-username-task-audio.wav";

    if (strpos($_SERVER['DOCUMENT_ROOT'], 'localhost') !== false) {
        move_uploaded_file($_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT']."/wordpress/wp-content/uploads/audio/" . $fname);
    } else {
        move_uploaded_file($_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT']."/wp-content/uploads/audio/" . $fname);
    }

}

//if( isset($_FILES['file']) and !$_FILES['file']['error'] ){
//    $fname = "audio" . ".wav";
//    move_uploaded_file( $_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . "/uploads/"  . $fname );
//} else {
//    echo 'error/n';
//    echo $_FILES['file']['error'];
//}
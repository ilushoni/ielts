<?php
if(isset($_FILES['file']) and !$_FILES['file']['error']){
    $fname = "User-".get_current_user() . "-audio.wav";
    move_uploaded_file($_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT']."/wordpress/wp-content/uploads/audio/" . $fname);
}
//if( isset($_FILES['file']) and !$_FILES['file']['error'] ){
//    $fname = "audio" . ".wav";
//    move_uploaded_file( $_FILES['file']['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . "/uploads/"  . $fname );
//} else {
//    echo 'error/n';
//    echo $_FILES['file']['error'];
//}
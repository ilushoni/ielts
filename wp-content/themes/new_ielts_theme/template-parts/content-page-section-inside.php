<?php
/**
 * The template used for displaying page content for sections
 */

global $post;
$page_slug = $post->post_name;
$ancestors = get_post_ancestors($post->ID);
$root = count($ancestors)-1;
$parent_id = $ancestors[$root];
$parents = get_post_ancestors( $post->ID );
$speaking_part1_rule = 0;
if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
    $speaking_part1_rule = 1;
}

global $task_text;
$args = array(
    'posts_per_page'   => 1,
    'offset'           => 0,
    'category'         => '',
    'category_name'    => $page_slug.'-text',
    'orderby'          => 'date',
    'order'            => 'DESC',
    'include'          => '',
    'exclude'          => '',
    'meta_key'         => '',
    'meta_value'       => '',
    'post_type'        => 'post',
    'post_mime_type'   => '',
    'post_parent'      => '',
    'author'	   => '',
    'author_name'	   => '',
    'post_status'      => 'publish',
    'suppress_filters' => true
);
$task_text_array = get_posts($args);

if( $task_text_array ) {   //if there is text for task
    echo '<div class="popup-text" id="popup1">';
        foreach ($task_text_array as $task_text) : setup_postdata($task_text);
            echo '<div class="paper column-2">';
                echo '<input type="button" class="close-popup"/>';
                echo '<h3>'.get_the_title($task_text->ID).'</h3>';
                the_content();
            echo '</div>';
            $task_text_thumbnail = get_the_post_thumbnail_url($task_text->ID);
        endforeach;
    echo '</div>';
    wp_reset_postdata();

    echo '<div class="task-wrapper column-2">';
        echo '<div class="entry-content">';
            if(get_the_title()) {
                the_title( '<h3 class="task-name">', '</h3>' );
            }
            the_content();
        echo '</div>';
        echo '<div class="task-text">';
            echo '<a href="#popup1" class="text-thumbnail-btn open-popup"><img src="'.$task_text_thumbnail.'" alt="'.get_the_title().'" /></a>';
        echo '</div>';
    echo '</div>';

} else {    //there is no text for task
    $class = ($speaking_part1_rule) ? 'task-speaking' : '';
    if( get_the_title() ) {
        if( strpos( $page_slug, 'task-' ) !== false ){
            the_title( '<h3 class="task-name '.$class.'">', '</h3>' );
        } else {
            the_title( '<header class="entry-header"><h1 class="entry-title">', '</h1></header>' );
        }
    }

    preg_match("/(\btask\b-[45])|(\btask-voice-record\b)|(\btypes-of-questions-for-ielts-online\b)/", $page_slug, $result);
    switch(true){
        case(!empty($result)):
            $class = " task-column-not-full";
            break;
        case($speaking_part1_rule):
            $class = " task-content";
            break;
        default:
            $class = "";
    }

    echo '<div class="entry-content'.$class.'" id="post-content-'. get_the_ID() .'">';
        echo my_the_content( get_the_content() );
    echo '</div>';
}
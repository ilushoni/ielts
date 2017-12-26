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
    echo '<div class="popup-text">';
        foreach ($task_text_array as $task_text) : setup_postdata($task_text);
            echo '<div class="sheet-of-paper column-2">';
                echo '<input type="button" name="close-button" class="icon-close" value="" />';
                echo '<h3>'.get_the_title($task_text->ID).'</h3>';
                the_content();
            echo '</div>';
            $task_text_thumbnail = get_the_post_thumbnail_url($task_text->ID);
        endforeach;
    echo '</div>';
    wp_reset_postdata();

    echo '<div class="task-wrapper column-two">';
        echo '<div class="entry-content">';
            if(get_the_title()) {
                the_title( '<h3 class="task-name">', '</h3>' );
            }
            the_content();
        echo '</div>';
        echo '<div class="task-text">';
            echo '<a href="#" class="show-popup-btn text-thumbnail-btn"><img src="'.$task_text_thumbnail.'" alt="'.get_the_title().'" /></a>';
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

    switch(true){
        case(($page_slug=='task-4')or($page_slug=='task-5')or($page_slug=='task-voice-record')or($page_slug=='types-of-questions-for-ielts-online')):
            $class = " task-column-not-full";
            break;
        case($speaking_part1_rule):
            $class = " task-content";
            break;
        default:
            $class = "";
    }

    echo '<div class="entry-content'.$class.'" id="post-content-'. get_the_ID() .'">';
        $text = get_the_content();
        preg_match_all("/(task-select-words)/", $text, $contains_select_words);
        switch(true){
            case(!empty($contains_select_words[0])):
                echo(content_to_select_words($text));
                break;
            case($page_slug == "task-5"):
                echo(content_to_drop_words($text));
                break;
            default:
                the_content();
        }
    echo '</div>';
}
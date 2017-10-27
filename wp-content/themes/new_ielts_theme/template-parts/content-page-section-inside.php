<?php
/**
 * The template used for displaying page content for sections
 */

global $post;
$page_slug = $post->post_name;

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

if( $task_text_array ) {
    //if there is text for task

    echo '<div class="popup-text">';
        foreach ($task_text_array as $task_text) : setup_postdata($task_text);
            echo '<div class="book-page book-column-two">';
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

} else {
    //there is no text for task

    if(get_the_title()) {
        if( strpos( $page_slug, 'task-' ) !== false ) {
            //task pages
            the_title( '<h3 class="task-name">', '</h3>' );
        } else {
            echo '<header class="entry-header">';
                the_title( '<h1 class="entry-title">', '</h1>' );
            echo '</header>';
        }
    }

    $class = ( ($page_slug == 'task-4') or ($page_slug == 'task-5') or ($page_slug == 'task-voice-record') or ($page_slug == 'types-of-questions-for-ielts-online') ) ? $class = "task-column-not-full" : $class ='';

    echo '<div class="entry-content '.$class.'">';

        switch( $page_slug ):

            case 'task-4':

                $text = get_the_content();
                echo(content_to_select_words( $text ));
                break;

            case 'task-5':

                $text = get_the_content();
                echo(content_to_drop_words( $text ));
                break;

            default:

                the_content();

        endswitch;

    echo '</div>';

}
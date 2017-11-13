<?php
/*
Template Name: Triqui Ajax Post
*/

while ( have_posts() ) : the_post();

global $post;
$direct_parent = $post->post_parent;
$page_slug = $post->post_name;

//get prev and next post url
$postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
$key = array_search ($post->ID, $postlist);

if( $postlist[ $key-1 ] ){
    $prev = get_permalink( $postlist[ $key-1 ] );
}

if( $postlist[ $key+1 ] ){
    $next = get_permalink( $postlist[ $key+1 ] );
}

//echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
get_template_part( 'template-parts/content', 'page-sentence-completion-inner' );

echo '<nav class="page-nav-wrapper" id="page-nav-' . get_the_ID() . '">';
if( $prev )
    echo '<a href="'.$prev.'" class="page-prev">'._("Back").'</a>';
if( $next )
    echo '<a href="'.$next.'" class="page-next">'._("Next").'</a>';
echo '</nav>';
//echo '</article>';


endwhile;?>
<?php
/**
 * The template for displaying all single posts and attachments
 */

get_header();

echo '<article class="container page single-post" id="post-' . get_the_ID() . '">';
    while ( have_posts() ) : the_post();
        if(get_the_title()) {
            echo '<header class="entry-header">';
                the_title( '<h2 class="entry-title">', '</h2>' );
            echo '</header>';
        }
        echo '<div class="entry-content">';
            the_content();
        echo '</div>';
//        $prev = get_permalink(get_adjacent_post(false,'',false));
//        $next = get_permalink(get_adjacent_post(false,'',true));
        $prev = get_home_url();
        $next = 0;
        $nav = '<nav class="page-nav-wrapper">';
        if( $prev ) $nav .= '<a href="'.$prev.'" class="page-prev" rel="'.$prev_rel.'">'._("Back").'</a>';
        if( $next ) $nav .= '<a href="'.$next.'" class="page-next" rel="'.$next_rel.'">'._("Next").'</a>';
        $nav .= '</nav>';
        echo $nav;
    endwhile;
echo '</article>';

get_footer(); ?>

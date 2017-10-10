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

    endwhile;

echo '</article>';

get_footer(); ?>

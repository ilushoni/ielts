<?php
/**
 * The template for displaying page with slug "under-construction"
 */

get_header();

while ( have_posts() ) : the_post();
    echo '<main class="container page page-under-construction" id="page-' . get_the_ID() . '">';
        the_content();
        echo '<nav class="page-nav-wrapper">';
        echo '<a href="'.get_home_url().'" class="page-prev">'._("Back").'</a>';
        echo '</nav>';
    echo '</main>';
endwhile;

get_footer(); ?>
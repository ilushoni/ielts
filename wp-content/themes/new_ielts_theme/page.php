<?php
/**
 * The template for displaying all pages by default
 */

get_header();

while ( have_posts() ) : the_post();
    get_template_part( 'template-parts/content', 'page' );
endwhile;

get_footer(); ?>
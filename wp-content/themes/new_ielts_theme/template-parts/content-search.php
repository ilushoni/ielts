<?php
/**
 * The template part for displaying results in search pages
 */

echo '<section class="column" id="post-' . get_the_ID() . '">';

    the_title( sprintf( '<h3 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
    echo '<p>'. get_the_excerpt() .'</p>';

echo '</section>';?>
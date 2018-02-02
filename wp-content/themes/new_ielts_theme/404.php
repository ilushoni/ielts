<?php
/**
 * The template for displaying 404 pages (not found)
 */

get_header();

echo '<main class="container page page-error-404" id="page-' . get_the_ID() . '" role="main">';

    echo '<header class="entry-header">';
        echo '<h1 class="entry-title">'._("The page is under construction").'</h1>';
    echo '</header>';
    echo '<div class="entry-content">';
        echo '<p>'._( 'It looks like nothing was found at this location. Maybe try a search?' ).'</p>';
        echo '<div class="search-form-wrapper">';
            get_search_form();
        echo '</div>';
    echo '</div>';
echo '</main>';

get_footer(); ?>

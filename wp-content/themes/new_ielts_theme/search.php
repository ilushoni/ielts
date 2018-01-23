<?php
/**
 * The template for displaying search results pages
 */

get_header();

    if ( have_posts() ) {

        echo '<main class="container page search-results" id="page-' . get_the_ID() . '" role="search">';

            echo '<header class="entry-header">';
                echo '<h1 class="entry-title">';
                    printf(__('Search Results for: %s', 'ielts'), '<span>' . esc_html(get_search_query()) . '</span>');
                echo '</h1>';
            echo '</header>';

            echo '<div class="entry-content column-3 search-results-list">';
                while (have_posts()) : the_post();
                    get_template_part('template-parts/content', 'search');
                endwhile;
            echo '</div>';

            if ((get_previous_posts_link()) or (get_next_posts_link())) {
                echo '<div class="page-nav-wrapper">';
                    previous_posts_link('Back');
                    next_posts_link('Next');
                echo '</div>';
            }

        echo '</main>';

    } else {
        echo '<main class="container page page-error-404" id="page-' . get_the_ID() . '" role="search">';
            get_template_part( 'template-parts/content', 'none' );
        echo '</main>';
    }

get_footer(); ?>
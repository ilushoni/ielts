<?php
/**
 * The template part for displaying a message that posts cannot be found
 */

echo '<header class="entry-header">';
    echo '<h1 class="entry-title">'._("Nothing found").'</h1>';
echo '</header>';

echo '<div class="entry-content">';
    if ( is_home() && current_user_can( 'publish_posts' ) ) :

        echo '<p>';
            printf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'ielts' ), esc_url( admin_url( 'post-new.php' ) ) );
        echo '</p>';

    elseif ( is_search() ) :

        echo '<p>'. _("Sorry, but nothing matched your search terms. Please try again with some different keywords.") .'</p>';
        echo '<div class="search-form-wrapper">';
            get_search_form();
        echo '</div>';
    else :

        echo '<p>'. _("It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.") .'</p>';
        echo '<div class="search-form-wrapper">';
            get_search_form();
        echo '</div>';

    endif;
echo '</div>';
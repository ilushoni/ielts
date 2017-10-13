<?php
/**
 * The template used for displaying page content for READING QUESTION TYPES
 */

echo '<main id="post-' . get_the_ID() . '" class="container page page-section-inner">';

    $user_data = array(
        "Sentence Completion" => "available",
        "Second question type" => 0,
        "Third question type" => 0,
        "Another question type" => 0
    );

    if(get_the_title()) {
        echo '<header class="entry-header">';
            the_title( '<h1 class="entry-title">', '</h1>' );
        echo '</header>';
    }

    echo '<div class="accordion reading-types">';
        global $post;
        $args = array(
            'posts_per_page' => 12,
            'offset' => 0,
            'category' => '',
            'category_name' => 'reading-question-types', //here can be category named "ielts-test-sections"
            'orderby' => 'date',
            'order' => 'ASC',
            'include' => '',
            'exclude' => '',
            'meta_key' => '',
            'meta_value' => '',
            'post_type' => 'post',
            'post_mime_type' => '',
            'post_parent' => '',
            'author' => '',
            'author_name' => '',
            'post_status' => 'publish',
            'suppress_filters' => true
        );
        $posts_array = get_posts($args);

        foreach ($posts_array as $post) : setup_postdata($post);

            echo '<header class="entry-header" available="'.$user_data[ get_the_title() ].'">';
                the_title('<h3 class="entry-title">','</h3>');
            echo '</header>';
            echo '<div class="entry-content" available="'.$user_data[ get_the_title() ].'">';
             the_content();
            echo '</div>';

        endforeach;

        wp_reset_postdata();
    echo '</div>';

echo '</main>';
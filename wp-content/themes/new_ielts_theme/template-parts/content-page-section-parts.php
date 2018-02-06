<?php
/**
 * The template used for displaying accordion of Parts in Section.
 * This page contain describe all parts of current section.
 * This describes are all in posts with category name like Current Section Name
*/

//id posts, which describe parts, connected with parts pages(links)
$page_connected=array(
    51 => get_page_by_path( "reading-question-types/sentence-completion/" )->ID,
    164 => get_page_by_path( "speaking/speaking-part1/" )->ID,
    166 => get_page_by_path( "speaking/speaking-part2/" )->ID
);

//choose available for learning parts
switch($post->post_name){
    case("reading-question-types"):
        $user_data = array(
            "Sentence Completion" => "available",
            "Second question type" => 0,
            "Third question type" => 0,
            "Another question type" => 0
        );
        $category_name = 'reading-question-types';
        break;
    case("speaking"):
        $user_data = array(
            "Part 1" => "available",
            "Part 2" => 0,
            "Part 3" => 0,
            "Part 4" => 0
        );
        $category_name = 'speaking-parts';
        break;
}

echo '<div class="accordion accordion-section-parts">';
    global $post;
    $args = array(
        'posts_per_page' => 12,
        'offset' => 0,
        'category' => '',
        'category_name' => $category_name, //here can be category named "ielts-test-sections"
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
        the_title('<header class="entry-header" available="'.$user_data[ get_the_title() ].'"><h3 class="entry-title">','</h3></header>');
        echo '<div class="entry-content" available="'.$user_data[ get_the_title() ].'">';
            the_content();
            if($user_data[get_the_title()]){ //part is available
                if(isset($page_connected[get_the_ID()])){
                    echo show_next_only_btn(get_permalink($page_connected[get_the_ID()]));
                }
            }
        echo '</div>';
    endforeach;

    wp_reset_postdata();
echo '</div>';
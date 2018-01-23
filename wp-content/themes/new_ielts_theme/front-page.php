<?php
/**
 * The template for Front Page for Unregistered Users and Registered Users
 */
get_header(); ?>

<?php
global $current_user;
wp_get_current_user();

if(is_user_logged_in()) {

    //registered user
    while ( have_posts() ) :
        the_post();
        echo '<main class="container page"  id="post-'.get_the_ID().'" role="main">';

            if(get_the_title()) {
                echo '<header class="entry-header">';
                    the_title( '<h1 class="entry-title">', '</h1>' );
                echo '</header>';
            }

            $table_name = 'section_progress';
            $user_id = get_current_user_id();

            $page = get_page_by_path("speaking");
            $section_id = $page->ID;

            global $wpdb;
            $query = "SELECT current_task_id FROM ".$table_name." WHERE user_id = ".$user_id." AND section_id = ".$section_id;
            $datum = $wpdb->get_results( $query );
            $current_task_id = $datum[0]->{"current_task_id"};

            $postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
            $children_tasks = array();
            if( count($children_tasks) > 0 ){
                unset( $children_tasks );
            }
            $children = get_pages('child_of='.$section_id);

            if( count($children) > 0 ) {
                $i=0;
                foreach ( $children as $child ) {
                    $parents = get_post_ancestors( $child->ID );
                    if( count($parents) == 3 ){
                        $child_key = array_search ( $child->ID, $postlist  );
                        $children_tasks[$i] = $child_key;
                        $i++;
                        if( $child->ID == $current_task_id ){
                            $n = $i;
                        }
                    }
                }
            }
            $i = $n / count($children_tasks) * 100;

            //user success information
            $user_success = array(
                'Reading' => 23,
                'Listening' => 0,
                'Speaking' => $i,
                'Writing' => 0
            );
            $menu_name = 'primary';
            $locations = get_nav_menu_locations();
            if( $locations && isset($locations[ $menu_name ]) ){
                $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
                $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
                $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-4">';
                foreach ( $menu_items as $key => $menu_item ){
                    $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item">' . $menu_item->title;
                        if($user_success[ $menu_item->title ]) {
                            $menu_list .= '<span class="success-text">'._("You have accomplished").' '.round($user_success[ $menu_item->title ],2).'%</span>';
                            $menu_list .= '<span class="success-line" user_success="'. $user_success[ $menu_item->title ] .'"></span>';
                        }
                    $menu_list .= '</a>';
                }
                $menu_list .= '</nav>';
                echo $menu_list;
            }

        echo '</main>';

        echo '<div class="front-page-recent-posts">';
            echo '<div class="container">';

                if(get_the_title()) {
                    echo '<header class="entry-header">';
                        echo '<h2 class="entry-title">'._("Recent blog items").'</h2>';
                    echo '</header>';
                }

                echo '<div class="column-4">';
                    global $post;
                    $args = array(
                        'posts_per_page' => 12,
                        'offset' => 0,
                        'category' => '',
                        'category_name' => 'ielts-test-sections', //here can be category named "ielts-test-sections"
//                        'category_name' => '', //here can be category named "ielts-test-sections"
                        'orderby' => 'date',
                        'order' => 'DESC',
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
                        echo '<a href="'.get_permalink().'" class="column">';
                            the_title("<h3 class='entry-title'>","</h3>");
                            the_content();
                        echo '</a>';
                    endforeach;
                    wp_reset_postdata();
                echo '</div>';

            echo '</div>';
        echo '</div>';
    endwhile;

} else {

    //unregistered user
    global $post;
    $args = array(
        'posts_per_page' => 1,
        'offset' => 0,
        'category' => '',
        'category_name' => 'banner',
        'orderby' => 'date',
        'order' => 'DESC',
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
        echo '<div class="top-header-offer" style="background-image: url(' . get_the_post_thumbnail_url() . ');">';
            echo '<div class="center-horiz-vert">';
                the_content();
                echo '<a href="' . get_permalink( get_page_by_path('under-construction')->ID ) . '">' . _("Sign up for 50$/mo") . '</a>';
            echo '</div>';
        echo '</div>';
    endforeach;
    wp_reset_postdata();

    echo '<main class="front-page-text">';
        while (have_posts()) : the_post();
            the_content();
        endwhile;
    echo '</main>';

    echo '<div class="front-page-reasons">';
        echo '<div class="container">';
        echo '<h2 class="entry-title">' . _("Why us") . '</h2>';
        $args = array(
            'posts_per_page' => 3,
            'offset' => 0,
            'category' => '',
            'category_name' => 'reasons',
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
            echo '<div class="column-3">';
                foreach ($posts_array as $post) : setup_postdata($post);
                    echo '<div class="column" id="' . $post->post_name . '" style="background-image: url(' . get_the_post_thumbnail_url() . ')">';
                        the_title('<h3 class="entry-title">', '</h3>');
                        the_content();
                    echo '</div>';
                endforeach;
                wp_reset_postdata();
            echo '</div>';
        echo '</div>';
    echo '</div>';

    echo '<div class="front-page-video">';
        echo '<div class="player">';
            echo '<p class="video-name">' . _("Explore what you’ll get with Grade IELTS On-line Preparation Course") . '</p>';
            echo '<p class="video-content">' . _('Tasks, tests and checkpoint reviews') . '</p>';
            echo '<div class="el-play"></div>';
        echo '</div>';
    echo '</div>';

    echo '<div class="container front-page-reviews">';
        echo '<h2 class="entry-title">' . _('IELTS On-line Preparation Course is made for people just like you') . '</h2>';
        $args = array(
            'posts_per_page' => 3,
            'offset' => 0,
            'category' => '',
            'category_name' => 'review',
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
        echo '<div class="column-3">';
        foreach ($posts_array as $post) : setup_postdata($post);
            echo '<div class="column">';
                the_content();
            echo '</div>';
        endforeach;
        wp_reset_postdata();
        echo '</div>';
    echo '</div>';

    echo '<div class="front-page-offer-bottom">';
        global $post;
        $args = array(
            'posts_per_page' => 1,
            'offset' => 0,
            'category' => '',
            'category_name' => 'offer',
            'orderby' => 'date',
            'order' => 'DESC',
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
            echo '<div class="container offer-text">';
                the_content();
            echo '</div>';
        endforeach;
        wp_reset_postdata();
    echo '</div>';
}

get_footer(); ?>
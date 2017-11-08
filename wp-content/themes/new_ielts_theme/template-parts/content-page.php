<?php
/**
 * The template used for displaying page content
 */

global $post;
$direct_parent = $post->post_parent;
$page_slug = $post->post_name;
//
//$prev = get_permalink(get_adjacent_post(false,'',true));
//$next = get_permalink(get_adjacent_post(false,'',false)->ID);

//get prev and next post url
$postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
$key = array_search ($post->ID, $postlist);

if( $postlist[ $key-1 ] ){
    $prev = get_permalink( $postlist[ $key-1 ] );
}

if( $postlist[ $key+1 ] ){
    $next = get_permalink( $postlist[ $key+1 ] );
}

switch ( $page_slug ):
    case "reading-question-types":

        get_template_part( 'template-parts/content', 'page-reading-question-types' );
        break;

    case "speaking":

        get_template_part( 'template-parts/content', 'page-speaking' );
        break;

    case "sentence-completion":

        echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
            get_template_part( 'template-parts/content', 'page-sentence-completion' );

            echo '<nav class="page-nav-wrapper">';
                echo '<a href="'.get_home_url().'" class="page-prev">'._("Back").'</a>';
                if( $next )
                    echo '<a href="'.$next.'" class="page-next">'._("Next").'</a>';
            echo '</nav>';
        echo '</article>';
        break;

    case "action-points":

        echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
            if(get_the_title()) {
                echo '<header class="entry-header">';
                    the_title( '<h1 class="entry-title">', '</h1>' );
                echo '</header>';
            }

            echo '<div class="entry-content">';
                the_content();

                $menu_name = 'action_points';
                $locations = get_nav_menu_locations();

                if( $locations && isset($locations[ $menu_name ]) ){
                    $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
                    $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню

                    $menu_list = '<ul id="menu-' . $menu_name . '">';
                    foreach ( $menu_items as $key => $menu_item ){
                        $menu_list .= '<li><a href="' . $menu_item->url . '">' . $menu_item->title . '</a></li>';
                    }
                    $menu_list .= '</ul>';

                    echo $menu_list;
                }
            echo '</div>';

            echo '<nav class="page-nav-wrapper">';
                if( $prev )
                    echo '<a href="'.$prev.'" class="page-prev">'._("Back").'</a>';
                if(( $page_slug !== "action-points" ) && ( $next ) ) {
                    echo '<a href="'.$next.'" class="page-next">'._("Next").'</a>';
                }
            echo '</nav>';

        echo '</main>';
        break;

    default:

        $post_parent = get_post($direct_parent);
        $parent_page_slug = $post_parent->post_name;

        if( $parent_page_slug == "speaking" ) {

            echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                get_template_part('template-parts/content', 'page-speaking-part1');

                echo '<nav class="page-nav-wrapper">';
                    echo '<a href="' . get_home_url() . '" class="page-prev">' . _("Back") . '</a>';
                    if ($next)
                        echo '<a href="' . $next . '" class="page-next">' . _("Next") . '</a>';
                echo '</nav>';
            echo '</article>';

        } else {

//            if( (!($direct_parent)) or ( $parent_page_slug == "sentence-completion" ) or ( $parent_page_slug == "speaking-part1" ) ) {
            if( (!($direct_parent)) or ( $parent_page_slug == "sentence-completion" ) ) {

                echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                    get_template_part('template-parts/content', 'page-section-inside');

                    echo '<nav class="page-nav-wrapper">';
                        if ($prev)
                            echo '<a href="' . $prev . '" class="page-prev">' . _("Back") . '</a>';
                        if (($page_slug !== "action-points") && ($next)) {
                            echo '<a href="' . $next . '" class="page-next">' . _("Next") . '</a>';
                        }
                    echo '</nav>';
                echo '</main>';

            } else {

                if( $parent_page_slug == "speaking-part1" ){

                    echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                        get_template_part('template-parts/content', 'page-sentence-completion-inner');

                        echo '<nav class="page-nav-wrapper">';
                            if ($prev)
                                echo '<a href="' . $prev . '" class="page-prev">' . _("Back") . '</a>';
                            if (($page_slug !== "action-points") && ($next)) {
                                echo '<a href="' . $next . '" class="page-next">' . _("Next") . '</a>';
                            }
                        echo '</nav>';
                    echo '</main>';

                }else {

                    //this page has parent page and it is NOT SENTENCE  COMPLETION. It may be task pages, because has section navigation MENU

                    echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                        get_template_part( 'template-parts/content', 'page-sentence-completion-inner' );

                        if( ( ($page_slug == 'task-3') or ($page_slug == 'task-4') or ($page_slug == 'task-5') or ($page_slug == 'task-6') or ($page_slug == 'types-of-questions-for-ielts-online') ) ) {
                            echo '<div class="nav-exercise">';
                                echo '<div class="wrong-text"></div>';
                                echo '<div class="success-text">'._("All correct, well done!").'</div>';
                                echo '<input type="button" class="check-btn" value="'._("Check answers").'" />';
                            echo '</div>';
                        }

                        echo '<nav class="page-nav-wrapper">';
                            if( $prev )
                                echo '<a href="'.$prev.'" class="page-prev">'._("Back").'</a>';
                            if( $next )
                                echo '<a href="'.$next.'" class="page-next">'._("Next").'</a>';
                        echo '</nav>';
                    echo '</article>';

                }



            }

        }

endswitch;
?>
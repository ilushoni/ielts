<?php
/**
 * The template used for displaying page content
 */

global $post;
$direct_parent = $post->post_parent;
$page_slug = $post->post_name;

//get prev and next post url
$postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
$key = array_search ($post->ID, $postlist);

if( $postlist[ $key-1 ] ){
    $prev_rel = $postlist[ $key-1 ];
    $prev = get_permalink( $postlist[ $key-1 ] );
}

if( $postlist[ $key+1 ] ){
    $next_rel = $postlist[ $key+1 ];
    $next = get_permalink( $postlist[ $key+1 ] );
}

$ancestors = get_post_ancestors($post->ID);
$root = count($ancestors)-1;
$parent_id = $ancestors[$root];
$parents = get_post_ancestors( $post->ID );

$page_nav_class = '';
if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
    //page tasks only for Focuses on Part on SPEAKING
    $children_order = array();
    if( count($children_order) > 0 ){
        unset( $children_order );
    }

    $children = get_pages('child_of='.wp_get_post_parent_id( $post->ID ));
    if( count($children) > 0 ) {
        $i=0;
        foreach ( $children as $child ) {
            $child_key = array_search ( $child->ID, $postlist  );
            $children_order[$i] = $child_key;
            $i++;
            if( $child->ID == $post->ID )
                break;
        }
    }

    switch( count($children_order) ):
        case(1):
            $page_nav_class = 'load item-is-first';
            break;
        case(count($children)):
            $page_nav_class = 'load item-is-last';
            break;
        default:
            $page_nav_class = 'load';
    endswitch;
}

switch ( $page_slug ):
    case "ui-kit":
        echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
            get_template_part( 'template-parts/content', 'page-section-inside' );

            echo '<nav class="page-nav-wrapper">';
                echo '<a href="'.get_home_url().'" class="page-prev">'._("Back").'</a>';
            echo '</nav>';
        echo '</article>';
        break;

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
                    echo '<a href="'.$next.'" class="page-next" rel="'.$next_rel.'">'._("Next").'</a>';
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
                    echo '<a href="'.$prev.'" class="page-prev" rel="'.$prev_rel.'">'._("Back").'</a>';
                if(( $page_slug !== "action-points" ) && ( $next ) ) {
                    echo '<a href="'.$next.'" class="page-next" rel="'.$next_rel.'">'._("Next").'</a>';
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
                        echo '<a href="' . $next . '" class="page-next" rel="'.$next_rel.'">' . _("Next") . '</a>';
                echo '</nav>';
            echo '</article>';

        } else {

//            if( (!($direct_parent)) or ( $parent_page_slug == "sentence-completion" ) or ( $parent_page_slug == "speaking-part1" ) ) {
            if( (!($direct_parent)) or ( $parent_page_slug == "sentence-completion" ) ) {

                echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                    get_template_part('template-parts/content', 'page-section-inside');

                    echo '<nav class="page-nav-wrapper">';
                        if ($prev)
                            echo '<a href="' . $prev . '" class="page-prev" rel="'.$prev_rel.'">' . _("Back") . '</a>';
                        if (($page_slug !== "action-points") && ($next)) {
                            echo '<a href="' . $next . '" class="page-next" rel="'.$next_rel.'">' . _("Next") . '</a>';
                        }
                    echo '</nav>';
                echo '</main>';

            } else {

                if( $parent_page_slug == "speaking-part1" ){

                    echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                        get_template_part('template-parts/content', 'page-sentence-completion-inner');

                        echo '<nav class="page-nav-wrapper">';
                            if ($prev)
                                echo '<a href="' . $prev . '" class="page-prev" rel="'.$prev_rel.'">' . _("Back") . '</a>';
                            if (($page_slug !== "action-points") && ($next)) {
                                echo '<a href="' . $next . '" class="page-next" rel="'.$next_rel.'">' . _("Next") . '</a>';
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

                        echo '<nav class="page-nav-wrapper '.$page_nav_class.'">';
                            if( $prev )
                                echo '<a href="'.$prev.'" class="page-prev" rel="'.$prev_rel.'">'._("Back").'</a>';
                            if( $next )
                                echo '<a href="'.$next.'" class="page-next" rel="'.$next_rel.'">'._("Next").'</a>';
                        echo '</nav>';
                    echo '</article>';

                }
            }
        }
endswitch;
?>
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
    $prev_rel = ($postlist[ $key-1 ]) ? $postlist[ $key-1 ] : false;
    $prev = get_permalink( $postlist[ $key-1 ] ); //Возвращает Строку/false. URL или false, если не удалось получить URL.
}

if( $postlist[ $key+1 ] ){
    $next_rel = ($postlist[ $key+1 ]) ? $postlist[ $key+1 ] : false;
    $next = get_permalink( $postlist[ $key+1 ] ); //Возвращает Строку/false. URL или false, если не удалось получить URL.
}

if(!(isset($prev))) $prev = false;
if(!(isset($prev_rel))) $prev_rel = false;
if(!(isset($next))) $next = false;
if(!(isset($next_rel))) $next_rel = false;

$ancestors = get_post_ancestors($post->ID);
$root = count($ancestors)-1;
$parent_id = $ancestors[$root];
$parents = get_post_ancestors( $post->ID );

$page_nav_class = '';
if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
    //page tasks only for Focuses on Part on SPEAKING
    unset($children_order);
    $children_order = array();
    $arg = array(
        'child_of' => wp_get_post_parent_id( $post->ID ),
        'sort_order'   => 'ASC',
        'sort_column'  => 'menu_order'
    );
    $children = get_pages($arg);
    if( count($children) > 0 ) {
        foreach ( $children as $child ) {
            array_push($children_order, array_search ( $child->ID, $postlist  ));
            if( $child->ID == $post->ID )
                break;
        }
    }

    switch( count($children_order) ):
        case(1):
            if( count($children) == 1 ){
                $page_nav_class = 'load item-is-last';
            }else{
                $page_nav_class = 'load item-is-first';
            }
            break;
        case(count($children)):
            $page_nav_class = 'load item-is-last';
            break;
        default:
            $page_nav_class = 'load';
    endswitch;
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
            echo page_nav( get_home_url(), get_option( "page_on_front" ), $next, $next_rel, false);
        echo '</article>';
        break;

    case "ui-kit":
        echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
            get_template_part( 'template-parts/content', 'page-section-inside' );
            echo page_nav( get_home_url(), get_option( "page_on_front" ), false, false, false);
        echo '</article>';
        break;

    case "action-points":
        echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
            if(get_the_title()) {
                the_title( '<header class="entry-header"><h1 class="entry-title">', '</h1></header>' );
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
            if( $page_slug == "action-points" ) $next = false;
            echo page_nav($prev, $prev_rel, $next, $next_rel, false);
        echo '</main>';
        break;

    default:

        $post_parent = get_post($direct_parent);
        $parent_page_slug = $post_parent->post_name;

        switch(true):

            case($parent_page_slug == "speaking"):
                echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                    get_template_part('template-parts/content', 'page-speaking-part1');
                    echo page_nav(get_home_url(), $next, $class);
                echo '</article>';
                break;

            case(($parent_page_slug == "sentence-completion") or ($parent_page_slug == "speaking-part1") or (!($direct_parent))):
                echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                    if($parent_page_slug == "speaking-part1"){
                        get_template_part('template-parts/content', 'page-menu');
                        get_template_part('template-parts/content', 'page-section-inside');
                    }else{
                        get_template_part('template-parts/content', 'page-section-inside');
                    }
                    if($page_slug == "action-points") $next = false;
                    echo page_nav($prev, $prev_rel, $next, $next_rel, false);
                echo '</main>';
                break;

            default:
                //this page has parent page and it is NOT SENTENCE  COMPLETION. It may be task pages, because has section navigation MENU
                echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                    get_template_part('template-parts/content', 'page-menu');
                    get_template_part('template-parts/content', 'page-section-inside');
                    if( ( ($page_slug == 'task-3') or ($page_slug == 'task-4') or ($page_slug == 'task-5') or ($page_slug == 'task-6') or ($page_slug == 'types-of-questions-for-ielts-online') ) ) {
                        echo '<div class="nav-exercise">';
                        echo '<div class="wrong-text"></div>';
                        echo '<div class="success-text">'._("All correct, well done!").'</div>';
                        echo '<input type="button" class="check-btn" value="'._("Check answers").'" />';
                        echo '</div>';
                    }
                    echo page_nav($prev, $prev_rel, $next, $next_rel, $page_nav_class);
                echo '</article>';

        endswitch;
endswitch;
?>
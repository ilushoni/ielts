<?php
/**
 * The template used for displaying page content
 */

$link = make_page_nav_links();

switch ( $post->post_name ):
    case "reading-question-types":
        get_template_part( 'template-parts/content', 'page-reading-question-types' );
        break;
    case "speaking":
        get_template_part( 'template-parts/content', 'page-speaking' );
        break;
    case "sentence-completion":
        echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
            get_template_part( 'template-parts/content', 'page-sentence-completion' );
            echo page_nav( get_home_url(), get_option( "page_on_front" ), $link['next'], $link['next_rel'], false);
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
                echo show_menu_by_location('action_points');
            echo '</div>';
            if( $post->post_name == "action-points" ) $link['next'] = false;
            echo page_nav($link['prev'], $link['prev_rel'], $link['next'], $link['next_rel'], false);
        echo '</main>';
        break;
    default:
        $post_parent = get_post($link['direct_parent']);
        $parent_page_slug = $post_parent->post_name;
        switch(true):
            case($parent_page_slug == "speaking"):
                echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                    get_template_part('template-parts/content', 'page-speaking-partpage');
                    echo page_nav(get_home_url(), get_option( "page_on_front" ), $link['next'], $link['next_rel'], false);
                echo '</article>';
                break;
            case(($parent_page_slug == "sentence-completion") or ($parent_page_slug == "speaking-part1") or ($parent_page_slug == "speaking-part2") or (!($link['direct_parent']))):
                echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                    if($parent_page_slug == "speaking-part1"){
                        get_template_part('template-parts/content', 'page-menu');
                        get_template_part('template-parts/content', 'page-section-inside');
                    }else{
                        get_template_part('template-parts/content', 'page-section-inside');
                    }
                    if($post->post_name == "action-points") $link['next'] = false;
                    echo page_nav($link['prev'], $link['prev_rel'], $link['next'], $link['next_rel'], false);
                echo '</main>';
                break;
            default:
                //this page has parent page and it is NOT SENTENCE  COMPLETION. It may be task pages, because has section navigation MENU
                echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                    get_template_part('template-parts/content', 'page-menu');
                    get_template_part('template-parts/content', 'page-section-inside');
                    preg_match("/(\btask\b-[3456])|(\btypes-of-questions-for-ielts-online\b)/", $post->post_name, $result);
                    if(!empty($result)){
                        echo '<div class="nav-exercise">';
                        echo '<div class="wrong-text"></div>';
                        echo '<div class="success-text">'._("All correct, well done!").'</div>';
                        echo '<input type="button" class="check-btn" value="'._("Check answers").'" />';
                        echo '</div>';
                    }
                    echo page_nav($link['prev'], $link['prev_rel'], $link['next'], $link['next_rel'], $link['page_nav_class']);
                echo '</article>';
        endswitch;
endswitch;
?>
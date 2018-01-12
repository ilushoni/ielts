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
        $ancestors = array_reverse(get_post_ancestors($post->ID));
        $count = count($ancestors);
        $post_parent = get_post($ancestors[0])->post_name;
        switch(true):
            case(($count==1)&&($post_parent == "speaking")):
                echo '<article id="post-' . get_the_ID() . '" class="container page page-task">';
                    get_template_part('template-parts/content', 'page-speaking-partpage');
                    echo page_nav(get_home_url(), get_option( "page_on_front" ), $link['next'], $link['next_rel'], false);
                echo '</article>';
                break;
            case((!$count)||(($count==2)&&(preg_match("/^reading-question-types|speaking$/", $post_parent, $matches)))):
                echo '<main class="container page section-front-page" id="page-' . get_the_ID() . '" role="main">';
                    get_template_part('template-parts/content', 'page-menu');
                    get_template_part('template-parts/content', 'page-section-inside');
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
                    if((!empty($result))&&(get_post($ancestors[0])->post_name=="reading-question-types")){
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
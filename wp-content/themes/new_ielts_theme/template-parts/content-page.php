<?php
/**
 * The template used for displaying page content
 */

$ancestors = array_reverse(get_post_ancestors($post->ID));
$count = count($ancestors);
$post_parent = get_post($ancestors[0])->post_name;

//prev next pages links
$link = make_page_nav_links();
$next_class = false;

//section page with all parts describe
$all_parts_page = array("reading-question-types", "speaking");

switch(true):
    case(in_array($post->post_name, $all_parts_page)): //section page with all parts describe
            echo '<main id="post-' . get_the_ID() . '" class="container">';
                if(get_the_title()) {
                    the_title( '<header class="entry-header middle-gap"><h1 class="entry-title">', '</h1></header>' );
                }
                get_template_part( 'template-parts/content', 'page-section-parts' );
            echo '</main>';
        break;

    case(($count==1)or($post->post_name=="ui-kit")): //single part page
            echo '<article id="post-' . get_the_ID() . '" class="container page-task">';
                get_template_part('template-parts/content', 'page-section-inside');
                if($post->post_name == "ui-kit"){
                    echo page_nav(get_home_url(), get_option("page_on_front"), false, false, false, $next_class);
                }else{
                    echo page_nav(get_home_url(), get_option("page_on_front"), $link['next'], $link['next_rel'], false, $next_class);
                }
            echo '</article>';
        break;

    case($count==2): //focus preview page
            echo '<main class="container focus-preview" id="page-' . get_the_ID() . '" role="main">';
                if($post->post_name != "action-points"){
                    get_template_part('template-parts/content', 'page-menu');
                }
                get_template_part('template-parts/content', 'page-section-inside');
                if($post->post_name == "action-points") $link['next'] = false;
                echo page_nav($link['prev'], $link['prev_rel'], $link['next'], $link['next_rel'], false, $next_class);
            echo '</main>';
        break;

    default: //all task pages
        echo '<article id="post-' . get_the_ID() . '" class="container page-task">';
            get_template_part('template-parts/content', 'page-menu');
            get_template_part('template-parts/content', 'page-section-inside');
            preg_match("/(\btask\b-[3456])|(\btypes-of-questions-for-ielts-online\b)/", $post->post_name, $result);
            if((!empty($result))&&(get_post($ancestors[0])->post_name=="reading-question-types")){
                echo '<div class="nav-exercise" for="'.$result[0].'">';
                    echo '<div class="wrong-text"></div>';
                    echo '<div class="success-text">'._("All correct, well done!").'</div>';
                    echo '<input type="button" class="check-btn" value="'._("Check answers").'" />';
                echo '</div>';
                $next_class = 'disabled';
            }
            echo page_nav($link['prev'], $link['prev_rel'], $link['next'], $link['next_rel'], $link['page_nav_class'], $next_class);
        echo '</article>';

endswitch;
?>
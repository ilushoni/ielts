<?php
/**
 * The template used for displaying content child pages of SENTENCE  COMPLETION
 */

//get section name
$ancestors = get_post_ancestors($post->ID);
$root = count($ancestors)-1;
$parent_id = $ancestors[$root];
$section_parent = get_post($parent_id);
$parent_section_slug = $section_parent->post_name;

$page_nav = false;

if( $parent_section_slug == "reading-question-types") {

    //task pages menu for READING section ONLY
    $page_nav = true;

    $parent_page = get_page_by_path('/reading-question-types/sentence-completion/');
    echo '<a href="'.get_permalink($parent_page).'" class="section-completion-parent-page">'.get_the_title($parent_page).'</a>';

    $menu_name = 'reading_section_completion';

} else if ( $parent_section_slug == "speaking") {

    //task pages menu for SPEAKING section ONLY
    $page_nav = true;

    $parent_page = get_page_by_path('/speaking/speaking-part1/');
    echo '<a href="'.get_permalink($parent_page).'" class="section-completion-parent-page speaking-part">'.get_the_title($parent_page).'</a>';

    $menu_name = 'speaking_part1';

    $postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
    $children_order = array();

}

if($page_nav) {

    global $post;
    $direct_parent = $post->post_parent;

    $locations = get_nav_menu_locations();

    if( $locations && isset($locations[ $menu_name ]) ){
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню

        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню

        $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line">';
//        $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-four collapse section-completion-menu top-line">';
        foreach ( $menu_items as $key => $menu_item ){

            $class = ( $menu_item->object_id == $direct_parent ) ? 'active' : '';

            if( ( $menu_name == 'speaking_part1' ) && ( $class ) ) {

                $i=0;
                if( count($children_order) > 0 ){
                    unset( $children_order );
                }

                $children = get_pages('child_of='.$menu_item->object_id);

                if( count($children) > 0 ) {

                    foreach ( $children as $child ) {
                        $child_key = array_search ( $child->ID, $postlist  );
                        $children_order[$i] = $child_key;
                        $i++;
                        if( $child->ID == $post->ID )
                            break;
                    }

                    $class .= " fill-part";
                    $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">' . $menu_item->title;
                    $menu_list .= "<div style='width:".(count($children_order) / count($children) * 100)."%;'></div>";

                }

            } else {

                $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">' . $menu_item->title;

            }

            $menu_list .= '</a>';
        }
        $menu_list .= '</nav>';

        echo $menu_list;
    }

}

get_template_part( 'template-parts/content', 'page-section-inside' );
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

if( $parent_section_slug == "reading-question-types") {
    //task pages menu for READING section ONLY

    $parent_page = get_page_by_path('/reading-question-types/sentence-completion/');
    echo '<a href="'.get_permalink($parent_page).'" class="section-completion-parent-page">'.get_the_title($parent_page).'</a>';

    global $post;
    $direct_parent = $post->post_parent;

    $menu_name = 'reading_section_completion';
    $locations = get_nav_menu_locations();

    if( $locations && isset($locations[ $menu_name ]) ){
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню

        $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-four collapse section-completion-menu top-line">';
        foreach ( $menu_items as $key => $menu_item ){
            $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.( ($menu_item->object_id == $direct_parent) ? 'active' : '' ).'">' . $menu_item->title;
            $menu_list .= '</a>';
        }
        $menu_list .= '</nav>';

        echo $menu_list;
    }

}

get_template_part( 'template-parts/content', 'page-section-inside' );
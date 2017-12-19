<?php
/**
 * The template used for displaying the content for PART 1 page (child page of SPEAKING)
 */

get_template_part( 'template-parts/content', 'page-section-inside' );

//user success information
$user_success = " active";
$post_slug = $post->post_name;
$menu_name = $post_slug;
$locations = get_nav_menu_locations();

if( $locations && isset($locations[ $menu_name ]) ){
    $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
    $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
    $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu speaking-part1-menu">';
    foreach ( $menu_items as $key => $menu_item ){
        $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item'.$user_success.'">' . $menu_item->title;
        $menu_list .= '</a>';
        $user_success = "";
    }
    $menu_list .= '</nav>';
    echo $menu_list;
}

echo '<div class="section-completion-plan">'. _("Starting with the next page this Table is in the left upper corner of each page (like a plan)") .'</div>';
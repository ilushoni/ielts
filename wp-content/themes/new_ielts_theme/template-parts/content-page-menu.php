<?php
/**
 * The template used for displaying the menu for Sections
 */

//get section name
$ancestors = array_reverse(get_post_ancestors($post->ID));

if(preg_match("/^reading-question-types|speaking$/", get_post($ancestors[0])->post_name, $matches)){

    $parent_page = get_post($ancestors[1]);
    $part_link = '<a href="'.get_permalink($parent_page).'" class="part-name">'.get_the_title($parent_page).'</a>';

    switch($matches[0]){
        case("reading-question-types"):    //task pages menu for READING section ONLY
            $menu_name = "reading_section_completion";
            break;
        case("speaking"):    //task pages menu for SPEAKING section ONLY
            $menu_name = get_post($ancestors[1])->post_name; //get page by Part Page ID in section
            break;
    }

    $post_parent = (count($ancestors)==3) ? $ancestors[2] : $ancestors[1];
    $locations = get_nav_menu_locations();

    if( $locations && isset($locations[ $menu_name ]) ){

        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
        $menu_list = '';

        foreach ( $menu_items as $key => $menu_item ){
            $class = (preg_match("/^".$post_parent."|".$post->ID."$/", $menu_item->object_id, $matches)) ? 'active' : '';

            if(get_post($ancestors[0])->post_name == "speaking") {
                $gp_args = array(
                    'post_type' => 'page',
                    'post_parent' => $menu_item->object_id,
                    'order' => 'ASC',
                    'orderby' => 'menu_order',
                    'posts_per_page' => -1
                );
                $children = get_posts($gp_args);
                $current_sum = 1;
                if($menu_item->object_id == $post_parent){
                    foreach($children as $child) {
                        if( $child->ID == $post->ID )
                            break;
                        $current_sum++;
                    }
                }
                $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">';
                $menu_list .= $menu_item->title;
                if($class == "active"){
                    $fill = ($current_sum / count($children));
                    $menu_list .= '<div class="fill-part" style="width:'.($fill * 100).'%;"></div>';
                }
            }else{
                //menu_name is "reading_section_completion"
                $menu_list .= '<a href="'.$menu_item->url.'" class="menu-item '.$class.'">'.$menu_item->title;
            }
            $menu_list .= '</a>';
        }

        if($menu_list!==''){
            $menu_list = '<nav id="menu-'.$menu_name.'" class="section-menu column-'.$menu->count.'" role="menu">'.$menu_list;
            $menu_list .= '</nav>';
            $menu_list = $part_link.$menu_list;
            $menu_list = '<div class="menu-wrapper" id="wrap-'.$menu_name.'">'.$menu_list.'</div>';
            echo $menu_list;
        }
    }
}
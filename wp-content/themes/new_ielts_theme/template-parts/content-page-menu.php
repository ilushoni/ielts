<?php
/**
 * The template used for displaying the menu for Sections
 */

//get section name
$ancestors = array_reverse(get_post_ancestors($post->ID));

if(preg_match("/^reading-question-types|speaking$/", get_post($ancestors[0])->post_name, $matches)){
    $class = "section-completion-parent-page";
    $parent_page = get_post($ancestors[1]);
    switch($matches[0]){
        case("reading-question-types"):    //task pages menu for READING section ONLY
            $menu_name = "reading_section_completion";
            break;
        case("speaking"):    //task pages menu for SPEAKING section ONLY
            $menu_name = get_post($ancestors[1])->post_name; //get page by Part Page ID in section
            $class .= " speaking-part";
            $postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
            $children_order = array();
            break;
    }
    echo '<a href="'.get_permalink($parent_page).'" class="'.$class.'">'.get_the_title($parent_page).'</a>';

    $post_parent = (count($ancestors)==3) ? $ancestors[2] : $ancestors[1];
    $locations = get_nav_menu_locations();

    if( $locations && isset($locations[ $menu_name ]) ){

        $active_index = 1;
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
        $menu_list = '';
        $show_color = true;

        foreach ( $menu_items as $key => $menu_item ){
            $class = (preg_match("/^".$post_parent."|".$post->ID."$/", $menu_item->object_id, $matches)) ? 'active' : '';

            if(get_post($ancestors[0])->post_name == "speaking") {

                if( $class ){
                    $class_menu = $class.'-'.$active_index;
                    $show_color = false;
                }

                if( $menu_item->object_id == $post_parent ){
                    unset( $children_order );

                    $children = get_pages('child_of='.$menu_item->object_id);
                    if( count($children) > 0 ) {
                        $i=0;
                        foreach ( $children as $child ) {
                            $child_key = array_search ( $child->ID, $postlist  );
                            $children_order[$i] = $child_key;
                            $i++;
                            if( $child->ID == $post->ID )
                                break;
                        }
                        $class .= " fill-part";
                    }

                }
                $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">';
                if (strpos( $menu_item->title, 'Focus' ) !== false) {
                    $menu_list .= '<span>' . $menu_item->title . '</span><span class="short">'.$active_index.'</span>';
                } else {
                    $menu_list .= $menu_item->title;
                }
                if( $menu_item->object_id == $post_parent ){
                    $menu_list .= '<div class="';
                    if( count($children_order) / count($children) == 1 ){
                        $menu_list .= 'fill-part-red ';
                    }
                    if( count($children_order) == 1 ) {
                        $menu_list .= 'fill-part-first ';
                    }
                    $menu_list .= '" style="width:'.(count($children_order) / count($children) * 100).'%;"></div>';
                }
                else{
                    if( $show_color ){
                        $menu_list .= '<div class="red-line"></div>';
                    }
                }
            }else{ //menu_name is "reading_section_completion"
                $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">' . $menu_item->title;
            }
            $menu_list .= '</a>';
            $active_index++;
        }
//        if(get_post($ancestors[0])->post_name == "speaking"){
//            $menu_list = '<a href="#" class="show-more prev"></a>'.$menu_list.'<a href="#" class="show-more next"></a></nav>';
//        }else {
            $menu_list .= '</nav>';
//        }
        echo '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line '.$class_menu.'">'.$menu_list;
    }
}
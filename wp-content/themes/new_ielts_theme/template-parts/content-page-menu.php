<?php
/**
 * The template used for displaying the menu for PART 1 pages
 */

//get section name
$ancestors = get_post_ancestors($post->ID);
$root = count($ancestors)-1;
$parent_id = $ancestors[$root];
$section_parent = get_post($parent_id);
$parent_section_slug = $section_parent->post_name;
$page_nav = false;

if( ( $parent_section_slug == "reading-question-types") || ( $parent_section_slug == "speaking") ){
    $page_nav = true;
    $class = "section-completion-parent-page";
    switch($parent_section_slug){
        case("reading-question-types"):    //task pages menu for READING section ONLY
            $parent_page = get_page_by_path("/reading-question-types/sentence-completion/");
            $menu_name = "reading_section_completion";
            break;
        case("speaking"):    //task pages menu for SPEAKING section ONLY
            $parent_page = get_page_by_path("/speaking/speaking-part1/");
            $menu_name = "speaking_part1";
            $class .= " speaking-part";
            $postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
            $children_order = array();
            break;
    }
    echo '<a href="'.get_permalink($parent_page).'" class="'.$class.'">'.get_the_title($parent_page).'</a>';
}

if($page_nav) {
    global $post;
    $direct_parent = $post->post_parent;
    $locations = get_nav_menu_locations();

    if( $locations && isset($locations[ $menu_name ]) ){

        $active_index = 1;
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
        $menu_list = '';
        $show_color = true;

        foreach ( $menu_items as $key => $menu_item ){

            $class = ( ( $menu_item->object_id == $direct_parent ) or ( $menu_item->object_id == $post->ID ) ) ? 'active' : '';

            if( $menu_name == 'speaking_part1' ) {

                if( $class ){
                    $class_menu = $class.'-'.$active_index;
                    $show_color = false;
                }

                if( $menu_item->object_id == $direct_parent ){

                    if( count($children_order) > 0 ){
                        unset( $children_order );
                    }

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
                if( $menu_item->object_id == $direct_parent ){
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
        if( $menu_name == 'speaking_part1' ){
            $menu_list = '<a href="#" class="show-more prev"></a>'.$menu_list.'<a href="#" class="show-more next"></a></nav>';
        }else {
            $menu_list .= '</nav>';
        }
        echo '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line '.$class_menu.'">'.$menu_list;
    }
}
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

        $active_index = 1;
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню

        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню

        $menu_list = '';

        foreach ( $menu_items as $key => $menu_item ){

            $class = ( ( $menu_item->object_id == $direct_parent ) or ( $menu_item->object_id == $post->ID ) ) ? 'active' : '';

            if( $menu_name == 'speaking_part1' ) {

                if( $class )
                    $class_menu = $class.'-'.$active_index;

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

                if (strpos( $menu_item->title, 'Focus' ) !== false) {
                    $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'"><span>' . $menu_item->title . '</span><span class="short">'.$active_index.'</span>';
                } else {
//                    $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.' large">' . $menu_item->title;
                    $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">' . $menu_item->title;
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

            }else{
                $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$class.'">' . $menu_item->title;
            }

            $menu_list .= '</a>';
            $active_index++;
        }

        if( $menu_name == 'speaking_part1' ){
//            $menu_list .= '</div><a href="#" class="show-more next"></a></nav>';
//            $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line '.$class_menu.'"><a href="#" class="show-more prev"></a><div class="section-carousel">'.$menu_list;
//
            $menu_list .= '<a href="#" class="show-more next"></a></nav>';
            $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line '.$class_menu.'"><a href="#" class="show-more prev"></a>'.$menu_list;
        }else {
            $menu_list .= '</nav>';
            $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-'.$menu->count.' collapse section-completion-menu top-line '.$class_menu.'">'.$menu_list;
        }


        echo $menu_list;
    }

}

get_template_part( 'template-parts/content', 'page-section-inside' );
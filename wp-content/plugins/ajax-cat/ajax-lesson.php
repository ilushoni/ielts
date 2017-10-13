<?php
/**
 * Plugin Name: Ajax Cat
 * Description: Ajax подгрузка постов из рубрик. Плагин создан в рамках изучения Ajax в Wordpress. Полный цикл уроков
 * смотрите на канале <a href="http://www.youtube.com/c/wpplus">wp-plus</a>.
 * Author: Campusboy
 * Author URI: https://wp-plus.ru/
 * Plugin URI: https://github.com/campusboy87/lessons-ajax-wordpress
 */
add_action( 'wp_ajax_btn_magic', 'ajax_custom_function' ); //авторизованные пользователи
add_action( 'wp_ajax_nopriv_btn_magic', 'ajax_custom_function' ); //неавторизованные пользователи

function ajax_custom_function() {

    $link = ! empty( $_POST['link'] ) ? esc_attr( $_POST['link'] ) : false;

    query_posts( array(
        'post_type' => 'page',
        'posts_per_page' => 5
    ) );

    require plugin_dir_path( __FILE__ ) . 'tpl-cat.php';

    wp_die();
}

add_action( 'wp_enqueue_scripts', 'my_assets' );
function my_assets() {
    wp_enqueue_script( 'custom', plugins_url( 'custom.js', __FILE__ ), array( 'jquery' ) );

    wp_localize_script( 'custom', 'myPlugin', array(
        'ajaxurl' => admin_url( 'admin-ajax.php' )
    ) );
}
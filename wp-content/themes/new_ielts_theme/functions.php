<?php
/**
 * IELTS functions and definitions
 */

/**
 * IELTS only works in WordPress 4.4 or later.
 */
if ( version_compare( $GLOBALS['wp_version'], '4.4-alpha', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
}

if ( ! function_exists( 'ielts_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 */
function ielts_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed at WordPress.org. See: https://translate.wordpress.org/projects/wp-themes/ielts
	 * If you're building a theme based on IELTS, use a find and replace
	 * to change 'ielts' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'ielts' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for custom logo.
	 *
	 *  @since IELTS 1.2
	 */
	add_theme_support( 'custom-logo', array(
		'height'      => 240,
		'width'       => 240,
		'flex-height' => true,
	) );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 1200, 9999 );

	// This theme uses wp_nav_menu() in two locations.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'ielts' ),
		'reading_section_completion' => __( 'Reading: Sentence  Completion Menu', 'ielts' ),
		'action_points' => __( 'Action Points Menu', 'ielts' ),
        'speaking-part1' => __( 'Speaking: Part 1 Menu', 'ielts' ),
        'speaking-part2' => __( 'Speaking: Part 2 Menu', 'ielts' ),
		'social'  => __( 'Social Links Menu', 'ielts' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 *
	 * See: https://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
		'gallery',
		'status',
		'audio',
		'chat',
	) );

	/*
	 * This theme styles the visual editor to resemble the theme style,
	 * specifically font, colors, icons, and column width.
	 */
//	add_editor_style( array( 'css/editor-style.css', ielts_fonts_url() ) );

	// Indicate widget sidebars can use selective refresh in the Customizer.
	add_theme_support( 'customize-selective-refresh-widgets' );
}
endif; // ielts_setup
add_action( 'after_setup_theme', 'ielts_setup' );

/**
 * Sets the content width in pixels, based on the theme's design and stylesheet.
 * Priority 0 to make it available to lower priority callbacks.
 */
function ielts_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'ielts_content_width', 1200 );
}
add_action( 'after_setup_theme', 'ielts_content_width', 0 );

/**
 * Registers a widget area.
 */
function ielts_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'ielts' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your sidebar.', 'ielts' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 1', 'ielts' ),
		'id'            => 'sidebar-2',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'ielts' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 2', 'ielts' ),
		'id'            => 'sidebar-3',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'ielts' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'ielts_widgets_init' );

if ( ! function_exists( 'ielts_fonts_url' ) ) :
/**
 * Register Google fonts for IELTS.
 *
 * Create your own ielts_fonts_url() function to override in a child theme.
 *
 * @return string Google fonts URL for the theme.
 */
function ielts_fonts_url() {
	$fonts_url = '';
	$fonts     = array();
	$subsets   = 'latin,latin-ext';

	/* translators: If there are characters in your language that are not supported by Merriweather, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Merriweather font: on or off', 'ielts' ) ) {
		$fonts[] = 'Merriweather:400,700,900,400italic,700italic,900italic';
	}

	/* translators: If there are characters in your language that are not supported by Montserrat, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Montserrat font: on or off', 'ielts' ) ) {
		$fonts[] = 'Montserrat:400,700';
	}

	/* translators: If there are characters in your language that are not supported by Inconsolata, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Inconsolata font: on or off', 'ielts' ) ) {
		$fonts[] = 'Inconsolata:400';
	}

	if ( $fonts ) {
		$fonts_url = add_query_arg( array(
			'family' => urlencode( implode( '|', $fonts ) ),
			'subset' => urlencode( $subsets ),
		), 'https://fonts.googleapis.com/css' );
	}

	return $fonts_url;
}
endif;

/**
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since IELTS 1.0
 */
function ielts_javascript_detection() {
	echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action( 'wp_head', 'ielts_javascript_detection', 0 );

/**
 * Enqueues scripts and styles.
 *
 * @since IELTS 1.0
 */
function ielts_scripts() {
	// Add custom fonts, used in the main stylesheet.
	wp_enqueue_style( 'ielts-fonts', ielts_fonts_url(), array(), null );

	// Theme stylesheet.
    wp_enqueue_style( 'ielts-normalize', get_template_directory_uri() . '/css/normalize.css', array(), '7.0.0' );
	wp_enqueue_style( 'ielts-style', get_stylesheet_uri());
	wp_enqueue_script( 'ielts-jquery', get_template_directory_uri() . '/js/jquery-3.2.1.js', array('jquery'), '3.2.1');
	wp_enqueue_script( 'ielts-jqueryui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js', array('jquery'), '1.12.1');
	wp_enqueue_script( 'ielts-jqueryuitouch', get_template_directory_uri() . '/js/jquery.ui.touch-punch.min.js', array('jquery'));
	wp_enqueue_script( 'ielts-jquerysticky', get_template_directory_uri() . '/js/jquery.sticky-kit.js', array('jquery'));

    global $post;
    $ancestors = get_post_ancestors($post->ID);
    $root = count($ancestors)-1;
    $parent_id = $ancestors[$root];
    $parents = get_post_ancestors( $post->ID );
    if(((count($parents)==3) && (in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking")) ) || ($post->post_name == "ui-kit") ){
        wp_enqueue_script( 'ielts-jqueryfunctions', get_template_directory_uri() . '/js/functions.js', array('jquery'), '1.0', 'in_footer');
        $localizations = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ));
        wp_localize_script( 'ielts-jqueryfunctions', 'myVars', $localizations );

        wp_enqueue_script( 'ielts-jqueryrecorderjs', get_template_directory_uri() . '/js/recorder.js', array('jquery'), '1.0', 'in_footer');
        $wnm_custom = array( 'template_url' => get_bloginfo('template_url') );
        wp_localize_script( 'ielts-jqueryrecorderjs', 'wnm_custom', $wnm_custom );

        wp_enqueue_script( 'ielts-jqueryrecordfunctions', get_template_directory_uri() . '/js/record-functions.js', 'ielts-jqueryrecorderjs', '1.0', 'in_footer');
        $localizations = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ));
        wp_localize_script( 'ielts-jqueryrecordfunctions', 'myVars', $localizations );
    } else {
        wp_enqueue_script( 'ielts-jqueryfunctions', get_template_directory_uri() . '/js/functions.js', array('jquery'), '1.0', 'in_footer');
        $localizations = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ));
        wp_localize_script( 'ielts-jqueryfunctions', 'myVars', $localizations );
    }
    wp_enqueue_script( 'ielts-jquerysort', get_template_directory_uri() . '/js/sort-functions.js', array('jquery'), '1.0', 'in_footer');
	wp_localize_script( 'ielts-script', 'screenReaderText', array(
		'expand'   => __( 'expand child menu', 'ielts' ),
		'collapse' => __( 'collapse child menu', 'ielts' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'ielts_scripts' );

function show_audio_li($id, $link, $text, $suggested_answers, $text_ans){
    $li = '<li id="record-play-item-'.$id.'" disabled="disabled">';
    $li .= '<audio id="music'.$id.'" class="audio-el" src="'.$link.'"></audio>';
    $li .= '<div id="audioplayer'.$id.'" class="audioplayer">';
    $li .= '<button id="pButton'.$id.'" class="btn-play play"></button>';
    $li .= '<p class="audio-text">';
    $li .= '<span class="audio-name">'.$text.'</span>';
    $li .= '<span class="duration"></span>';
    $li .= '</p>';
    $li .= '<div id="timeline'.$id.'" class="timeline"><div id="playhead'.$id.'" class="playhead"></div></div>';
    $li .= '</div>';
    if($suggested_answers){
        $li .= '<p class="text-small margin-top-25 width-480"><em>'.$text_ans.'</em></p>';
    }
    $li .= '</li>';
    return $li;
}

function show_my_recorder_func($atts) {
    $add = "";
    $field = '';
    extract(shortcode_atts(array(
        'add' => 'no-default',
        'field' => 'no-default',
    ), $atts));
    $recorder = '<div class="recorder">';
        $recorder .= '<button class="btn btn-record">Record Myself</button>';
        $recorder .= '<button class="btn btn-stop" disabled>Stop</button>';
        $recorder .= '<div class="record-duration"></div>';
        $recorder .= '<pre class="log"></pre>';
        $recorder .= '</div>';
        if( $add == "add-after" ){
            global $post;
            $table_name = 'user_audio';
            $user_id = get_current_user_id();
            $page_id = $post->ID;
            global $wpdb;
            $query = "SELECT * FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$page_id;
            if( $field ){
                $field -=1;
                $query .= " AND page_question_number = ".$field;
            }
            $datum = $wpdb->get_results($query);
            $id = (count($datum)>0) ? $datum->{"page_question_number"} : '';
            $recorder .= '<ul class="record-list'.$id.'">';
            if(count($datum)>0){
                foreach( $datum as $data ){
                    $recorder .= show_audio_li($data->page_question_number, wp_upload_dir()["baseurl"].$data->audio_link, $data->question_text_short, false, false);
                }
            }
            $recorder .= '</ul>';
        }
    return $recorder;
}
add_shortcode('my_recorder', 'show_my_recorder_func');

function show_my_audio_func( $atts) {
    $get_audio_from_page_id = '';
    $suggested_answers = '';
    extract(shortcode_atts(array(
        'get_audio_from_page_id' => 'no-default',
        'suggested_answers' => 'no-default',
    ), $atts));

    if($suggested_answers == 'no-default'){
        $suggested_answers = false;
    }else{
        global $post;
        $content_post = get_post($post->ID);
        $content = $content_post->post_content;
        preg_match('\'<ul class=\"(?:.*?)has-suggested_answers(?:.*?)\"(?:.*?)for=\"'.$get_audio_from_page_id.'\">(.*?)</ul>\'si', $content, $ul_list);
        preg_match_all('\'<li(?:.*?)>(.*?)</li>\'si', $ul_list[1], $li);
    }

    $table_name = 'user_audio';
    $user_id = get_current_user_id();
    $page_id = $get_audio_from_page_id;

    global $wpdb;
    $datum = $wpdb->get_results("SELECT * FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$page_id);

    if(count($datum)>0){
        $audio = '<ul class="insert-record-questions-list">';
        foreach( $datum as $data ){
            $audio .= show_audio_li($data->page_question_number, wp_upload_dir()["baseurl"].$data->audio_link, $data->question_text_short, $suggested_answers, $li[1][$data->page_question_number]);
        }
        $audio .= '</ul>';
    }else {
        preg_match('/Task ([0-9]+)/', get_the_title($page_id), $match);
        $audio = '<div class="no-records paper-bg">Please record your answer in <a href="'.get_permalink($page_id).'">'.$match[0].'</a></div>';
    }
    return $audio;
}
add_shortcode('my_audio', 'show_my_audio_func');

function show_audio_func( $atts) {
    $mp3 = '';
    $name = '';
    $disabled = '';
    extract(shortcode_atts(array(
        'mp3' => 'no-default',
        'name' => 'no-default',
        'disabled' => 'no-default'
    ), $atts));
    global $wpdb;
    $query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$mp3'";
    $id = $wpdb->get_var($query);
    if( !($id) ) $disabled = "disabled";
    $audio = '<ul class="insert-record-questions-list '.$disabled.'">';
    $audio .= show_audio_li($id, $mp3, $name,false, false);
    $audio .= '</ul>';
    return $audio;
}
add_shortcode('audio', 'show_audio_func');

function show_check_btn_func($atts) {
    $class = '';
    extract(shortcode_atts(array(
        'class' => 'no-default',
    ), $atts));
    $check_btn = '<div class="nav-exercise" for="'.$class.'">';
    $check_btn .= '<div class="wrong-text"></div>';
    $check_btn .= '<div class="success-text">'._("All correct, well done!").'</div>';
    $check_btn .= '<input type="button" class="check-btn" value="'._("Check answers").'" />';
    $check_btn .= '</div>';
    return $check_btn;
}
add_shortcode('check-btn', 'show_check_btn_func');

//function find_field_in_db($table_name, $user_id, $show_field){
//    global $wpdb;
//    $query = "SELECT field_name, field_text FROM ".$table_name." WHERE user_id=".$user_id." AND field_name LIKE '%".$show_field."%'";
//    return $wpdb->get_results( $query );
//}
//
//function show_field_func($atts) {
//    $show_field = '';
//    $wrap_tag = '';
//    $field = '';
//    extract(shortcode_atts(array(
//        'show_field' => 'no-default',
//        'wrap_tag' => 'no-default',
//    ), $atts));
//    $datum = find_field_in_db('user_task_fields', get_current_user_id(), $show_field);
//    foreach($datum as $data){
//        $field_name = $data->{"field_name"};
//        $field_text = $data->{"field_text"};
//        $field .= '<'.$wrap_tag.'><fieldset class="text-field-group width-full">';
//            $field .= '<input type="text" class="text-field width-full" id="'.$field_name.'" name="'.$field_name.'" value="'.$field_text.'" readonly/>';
//        $field .= '</fieldset></'.$wrap_tag.'>';
//    }
//    return $field;
//}
//add_shortcode('field', 'show_field_func');

function find_field_in_db($table_name, $user_id, $page_id, $id){
    $select = "WHERE user_id=".$user_id." AND page_id=".$page_id;
    if($id){
        $select .= " AND field_name=".$id;
    }
    global $wpdb;
    $query = "SELECT field_name, field_text FROM ".$table_name." ".$select;
    return $wpdb->get_results( $query );
}

function show_field_func($atts) {
    $page_id = '';
    $id = '';
    $field = '';
    $wrap_before = '';
    $wrap_after = '';
    extract(shortcode_atts(array(
        'page_id' => 'no-default',
        'id' => 'no-default',
        'wrap_before' => 'no-default',
        'wrap_after' => 'no-default',
    ), $atts));
    if($id=='no-default')
        $id = false;
    $datum = find_field_in_db('user_task_fields', get_current_user_id(), $page_id, $id);
    foreach($datum as $data){
        $key = $data->{"field_name"};
        $value = $data->{"field_text"};
//        $field[$key] = $value;
        $field .= $wrap_before.$value.$wrap_after;
    }
    return $field;
}
add_shortcode('field', 'show_field_func');

function show_my_video_func( $atts) {
    if( $atts ) {
        $iframe = '';
        extract(shortcode_atts(array(
            'iframe' => 'no-default',
        ), $atts));
        $video = '<div class="video-iframe-wrapper">';
            $video .= $iframe;
            $video .= '<div id="play-button" class="btn-video play"></div>';
            $video .= '<div id="pause-button" class="btn-video pause"></div>';
        $video .= '</div>';
    }else {
        $video = '<div class="page-video">';
            $video .= '<div class="player">';
    //    $video .= '<p class="video-name">' . _("Explore what you’ll get with Grade IELTS On-line Preparation Course") . '</p>';
    //    $video .= '<p class="video-content">' . _('Tasks, tests and checkpoint reviews') . '</p>';
                $video .= '<div class="el-play"></div>';
            $video .= '</div>';
        $video .= '</div>';
    }
    return $video;

}
add_shortcode('my_video', 'show_my_video_func');

function show_timer( $atts ) {
    $duration = '';
    extract(shortcode_atts(array(
        'duration' => 'no-default'
    ), $atts));
    $timer = '<p duration="'.$duration.'" class="time-left">'.$duration.'</p>';
    $timer .= '<p class="timer-string">'._("Minutes left").'</p>';
    return $timer;
}
add_shortcode('timer', 'show_timer');

/**
 * Adds custom classes to the array of body classes.
 *
 * @since IELTS 1.0
 *
 * @param array $classes Classes for the body element.
 * @return array (Maybe) filtered body classes.
 */
function ielts_body_classes( $classes ) {
	// Adds a class of custom-background-image to sites with a custom background image.
	if ( get_background_image() ) {
		$classes[] = 'custom-background-image';
	}

	// Adds a class of group-blog to sites with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds a class of no-sidebar to sites without active sidebar.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'ielts_body_classes' );

/**
 * Converts a HEX value to RGB.
 * @param string $color The original color, in 3- or 6-digit hexadecimal form.
 * @return array Array containing RGB (red, green, and blue) values for the given
 *               HEX code, empty array otherwise.
 */
function ielts_hex2rgb( $color ) {
	$color = trim( $color, '#' );
	if ( strlen( $color ) === 3 ) {
		$r = hexdec( substr( $color, 0, 1 ).substr( $color, 0, 1 ) );
		$g = hexdec( substr( $color, 1, 1 ).substr( $color, 1, 1 ) );
		$b = hexdec( substr( $color, 2, 1 ).substr( $color, 2, 1 ) );
	} else if ( strlen( $color ) === 6 ) {
		$r = hexdec( substr( $color, 0, 2 ) );
		$g = hexdec( substr( $color, 2, 2 ) );
		$b = hexdec( substr( $color, 4, 2 ) );
	} else {
		return array();
	}
	return array( 'red' => $r, 'green' => $g, 'blue' => $b );
}

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for content images
 * @param string $sizes A source size value for use in a 'sizes' attribute.
 * @param array  $size  Image size. Accepts an array of width and height
 *                      values in pixels (in that order).
 * @return string A source size value for use in a content image 'sizes' attribute.
 */
function ielts_content_image_sizes_attr( $sizes, $size ) {
	$width = $size[0];

	840 <= $width && $sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 62vw, 840px';

	if ( 'page' === get_post_type() ) {
		840 > $width && $sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
	} else {
		840 > $width && 600 <= $width && $sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 61vw, (max-width: 1362px) 45vw, 600px';
		600 > $width && $sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
	}

	return $sizes;
}
add_filter( 'wp_calculate_image_sizes', 'ielts_content_image_sizes_attr', 10 , 2 );

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for post thumbnails
 * @param array $attr Attributes for the image markup.
 * @param int   $attachment Image attachment ID.
 * @param array $size Registered image size or flat array of height and width dimensions.
 * @return string A source size value for use in a post thumbnail 'sizes' attribute.
 */
function ielts_post_thumbnail_sizes_attr( $attr, $attachment, $size ) {
	if ( 'post-thumbnail' === $size ) {
		is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
		! is_active_sidebar( 'sidebar-1' ) && $attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
	}
	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'ielts_post_thumbnail_sizes_attr', 10 , 3 );

/**
 * Modifies tag cloud widget arguments to have all tags in the widget same font size.
 * @param array $args Arguments for tag cloud widget.
 * @return array A new modified arguments.
 */
function ielts_widget_tag_cloud_args( $args ) {
	$args['largest'] = 1;
	$args['smallest'] = 1;
	$args['unit'] = 'em';
	return $args;
}
add_filter( 'widget_tag_cloud_args', 'ielts_widget_tag_cloud_args' );

/*---added by ira.che---*/
function cc_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

function custom_admin_head() {
    $css = '';
    $css = 'td.media-icon img[src$=".svg"] { width: 100% !important; height: auto !important; }';
    echo '<style type="text/css">'.$css.'</style>';
}
add_action('admin_head', 'custom_admin_head');


//different pages for registered and unregistered users
/*When a user is logged in, tell WordPress to use 'page' on front page of the site
 * @param string $value
 * @return string
 */
function dev_set_page_as_front_for_loggedin_user( $value ) {
    if ( is_user_logged_in() ) {
        $value = 'page';//page is set as front page
    }
    return $value;
}
add_filter( 'pre_option_show_on_front', 'dev_set_page_as_front_for_loggedin_user' );

/*For logged in users, set our static page (width slug "ielts-test-sections"(id=634)) to act as home page
 * @param $value
 * @return int
 */
function dev_set_context_based_page_on_front( $value ) {
    if( ! is_user_logged_in() ) {
        return $value;
    }
    return 69;//change with your own page id.
//    return 634;//change with your own page id.
}
add_filter( 'pre_option_page_on_front', 'dev_set_context_based_page_on_front' );
//end different pages for registered and unregistered users

// Changing excerpt more
function new_excerpt_more($more) {
    global $post;
    return '...<br/><a class="excerpt-link" href="'. get_permalink($post->ID) . '">' . 'Read More &raquo;' . '</a>';
}
add_filter('excerpt_more', 'new_excerpt_more');

//custom post navigation links
function next_posts_link_css ( $content ) {
    return 'class="page-next"';
}
add_filter( 'next_posts_link_attributes', 'next_posts_link_css' );

function previous_posts_link_css ( $content ) {
    return 'class="page-prev"';
}
add_filter( 'previous_posts_link_attributes', 'previous_posts_link_css' );

//Changing The Number Of Search Results Per Page
function myprefix_search_posts_per_page($query) {
    if ( $query->is_search ) {
        $query->set( 'posts_per_page', '3' );
    }
    return $query;
}
add_filter( 'pre_get_posts','myprefix_search_posts_per_page' );

//exclude categories from search results
function wcs_exclude_category_search( $query ) {
    if ( $query->is_search ) {
        $query->set( 'cat', '-5, -10, -8, -1' );
    }
}
add_action( 'pre_get_posts', 'wcs_exclude_category_search', 1 );

//exclude pages from post search results
function exclude_pages_from_search($query) {
    if ( $query->is_main_query() && is_search() ) {
        $exclude_ids = array( 69, 98, 66, 64 ); // Array of the ID's to exclude (IELTS test sections, Reading. Question types, Home page, page Under Construction)
        $query->set( 'post__not_in', $exclude_ids );
    }
    return $query;
}
add_filter( 'pre_get_posts','exclude_pages_from_search' );

//redirect to home when user not login
function is_login_page() {
    return in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php'));
}

function redirect_to_home() {
    //redirect from all pages excerpt page Under Construction, login page and front pages
    if( (!is_user_logged_in()) && (!is_front_page()) && (!is_home()) && (!is_404()) && (!is_login_page()) && ( get_queried_object_id() !== 64 ) ) {
        wp_redirect(home_url());
        exit();
    } else {
        //redirect if refresh on tasks pages in SPEAKING
        global $post;
        $ancestors = get_post_ancestors($post->ID);
        $root = count($ancestors)-1;
        $parent_id = $ancestors[$root];
        $parents = get_post_ancestors( $post->ID );
        if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
            $table_name = "user_progress";
            $user_id = get_current_user_id();
            global $wpdb;
            $query = "SELECT current_index FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$post->post_parent;
            $datum = $wpdb->get_results( $query );
            if( $datum[0]->{"current_index"} != $post->ID ){
//                wp_redirect( get_the_permalink( $datum[0]->{'current_index'}), 301 );
//                exit();
            }
        }
    }
}
add_action('template_redirect', 'redirect_to_home');

//check if page is parent of current page
function is_tree($pid) {
    global $post;
    $ancestors = get_post_ancestors($post->$pid);
    $root = count($ancestors) - 1;
    $parent = $ancestors[$root];

    if(is_page() && (is_page($pid) || $post->post_parent == $pid || in_array($pid, $ancestors))) {
        return true;
    } else {
        return false;
    }
};

//get page id by slug
function get_id_by_slug($page_slug) {
    $page = get_page_by_path($page_slug);
    if ($page) {
        return $page->ID;
    } else {
        return null;
    }
}
/**
 * Remove empty paragraphs created by wpautop()
 * @author Ryan Hamilton
 * @link https://gist.github.com/Fantikerz/5557617
 */
function remove_empty_p( $content ) {
    $content = force_balance_tags( $content );
    $content = preg_replace( '#<p>\s*+(<br\s*/*>)?\s*</p>#i', '', $content );
    $content = preg_replace( '~\s?<p>(\s|&nbsp;)+</p>\s?~', '', $content );
    return $content;
}
add_filter('the_content', 'remove_empty_p', 20, 1);

//task with select key words in text
function select_words_wrap($sentence){
    $result="";
    $words = explode(' ', $sentence); //determinate sentence to words
    foreach ($words as $word ) {
        if( trim($word) ) { //Удаляет пробелы (или другие символы) из начала и конца строки //TODO: must work $word=trim($word).What going on here?
            $class = '';
            preg_match('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', $word, $word_in);
            if($word_in) {
                $class = 'key-word';
                $word = '<a href="#" class="word-select '.$class.'" >'.$word_in[1].'</a> ';
            } else {
                $word = '<a href="#" class="word-select" >'.$word.'</a> ';
            }
            $result .= $word;
        }
    }
    return $result;
}

//task with select key words in text
function drop_words_wrap($sentence){
    $result = "";
    $text = trim($sentence); //clear all extra spaces and symbols
    preg_match_all('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', $sentence, $key_words);
    foreach( $key_words[0] as $key_el ) {
        $text_part = explode( $key_el, $text ); //get text before key word
        preg_match_all('/(correct_answer)=("[^"]*")/i',$key_el, $key_attr ); //get attribute correct_answer="" from tag <span> in $key_attr[0]
        preg_match('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', $key_el, $key_word); //get just word here on $key_word[1]
        $word = "<div class='word-drop'><span>".$key_word[1]."</span><ul class='sort' ".$key_attr[0][0]."></ul></div>";
        if($text_part[0]) {
            $text_part[0] = "<span>".$text_part[0]."</span>";
        }
        $result .= $text_part[0].$word; //put content part processed to result
        $text = $text_part[1]; //put rest of text in $text. This part exclude $key_el el and content before it
    }
    return $result;
}

function content_handler($content, $tag, $class){
    $text = $content;
    $result = '';
    $child_tag = ($tag == "div") ? "p" : "li";
    $pattern = "/<".$tag."\sclass=\"(?:[^<]*?".$class.".*?)\"[^>]*>[^~]*?<\/".$tag.">/s";
    preg_match_all($pattern, $text, $element);
    if(!empty($element[0][0])){
        $text_path = preg_split($pattern, $text);
        $result .= $text_path[0]; //content before Element
        preg_match_all('#<\s*?'.$tag.'\b[^>]*>(.*?)</'.$tag.'\b[^>]*>#s', $element[0][0], $child_elements); //separate tag with attributes from element
        $tag_wrapper = explode($child_elements[1][0], $child_elements[0][0]);
        $result .= $tag_wrapper[0];//open tag with attributes
        preg_match_all('#<\s*?'.$child_tag.'\b[^>]*>(.*?)</'.$child_tag.'\b[^>]*>#s', $child_elements[1][0], $child_all); //find all child elements
        foreach( $child_all[0] as $child ) {
            $pattern = '#<\s*?'.$child_tag.'\b[^>]*>(.*?)</'.$child_tag.'\b[^>]*>#s';
            preg_match($pattern, $child, $child_el); //for separate child tags, $child_el[0] has tag <tag>, $child_el[1] has no tag <tag>
            $pattern = "(<".$child_tag."[^>]*>)";
            preg_match($pattern, $child, $child_wrap);
            $result .= $child_wrap[0];
            preg_match('#<\s*?fieldset\b[^>]*>(.*?)</fieldset\b[^>]*>#s', $child_el[1], $text_field); //put text field in $text_field
            switch($class){
                case('task-drop-words'):
                    if((empty($text_field[0]))or($text_field[0]===NULL)){
                        $child_text_path[0] = $child_el[1]; //get part of li content before and after $text_field
                    }else{
                        $child_text_path = explode($text_field[0], $child_el[1]); //get part of li content before and after $text_field
                    }
                    //all right if there is only ONE text field in <li>
                    $result .= drop_words_wrap($child_text_path[0]);//text before text_field
                    $result .= (drop_words_wrap($child_text_path[0])) ? " " : "";
                    if(drop_words_wrap($child_text_path[0])) {
                        $result .= " ";
                    }
                    $result .= $text_field[0];
                    if((!empty($text_field[0]))or($text_field[0]!==NULL)) {
                        $result .= " " . drop_words_wrap($child_text_path[1]);//text after text_field
                    }
                    break;
                case('task-select-words'):
                    if((empty($text_field[0]))or($text_field[0] === NULL)){
                        $result .= select_words_wrap($child_el[1]);
                    } else{
                        $child_text_path = explode($text_field[0], $child_el[1]); //get part of li content before and after $text_field
                        //all right if there is only ONE text field in <li>
                        $result .= select_words_wrap($child_text_path[0]);//text before text_field
                        $result .= $text_field[0];
                        $result .= " ".select_words_wrap($child_text_path[1]);//text after text_field
                    }
                    break;
            }
            $result .= "</".$child_tag.">";
        }

        $result .= $tag_wrapper[1];//close tag with attributes
        $result .= $text_path[1]; //content after Element
    }
    return $result;
}

//content modification
add_filter('the_content', 'my_the_content');
function my_the_content($content) {
    if(!empty($content)){
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $internalErrors = libxml_use_internal_errors(true);
        $dom->loadHTML($content);
        libxml_use_internal_errors($internalErrors);
        $xpath = new DOMXPath($dom);
        $classes = array('task-drop-words', 'task-select-words');
        foreach($classes as $classname){
            $nodes = $xpath->query("//*[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]");
            if($nodes->length){
                $tag = $nodes->item(0)->nodeName;
                $content = content_handler($content, $tag, $classname);
            }
        }
        $content = do_shortcode($content);
    }
    return $content;
}

//task with select modification

//disable admin bar for all users except admins
add_action('after_setup_theme', 'remove_admin_bar');

function remove_admin_bar() {
    if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
    }
}

//redirect on custom page all users except admins
/**
 * Redirect user after successful login.
 *
 * @param string $redirect_to URL to redirect to.
 * @param string $request URL the user is coming from.
 * @param object $user Logged user's data.
 * @return string
 */

function my_login_redirect( $redirect_to, $request, $user ) {
    //is there a user to check?
    if ( isset( $user->roles ) && is_array( $user->roles ) ) {
        //check for admins
        if ( in_array( 'administrator', $user->roles ) ) {
            // redirect them to the default place
            return $redirect_to;
        } else {
            return home_url();
        }
    } else {
        return $redirect_to;
    }
}

add_filter( 'login_redirect', 'my_login_redirect', 10, 3 );

//add new navigation
function mytheme_list_pages($param) {
    $pages = get_pages($param);
    $li = array();
    $i=0;
    foreach ( $pages as $page ) {
        $li[ $i ] = $page->ID;
        $i++;
    }
    return $li;
}

//mark task id on page width come tasks for current user SPEAKING->PART1->FOCUS1
add_action('wp_ajax_my_action', 'my_action_callback');
add_action('wp_ajax_nopriv_my_action', 'my_action_callback');
function my_action_callback() {
    // Do your processing here (save to database etc.)
    // All WP API functions are available for you here
    $table_name = 'user_progress';
    $user_id = get_current_user_id();
    $post_id = intval( $_POST['page_id'] );
    $post = get_post( $post_id );
    $page_id = $post->post_parent;
    $current_task = intval( $_POST['current_task'] );
    global $wpdb;
    $query = "SELECT current_index FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$page_id;
    $datum = $wpdb->get_results( $query );
    if( count($datum) ){
        $wpdb->update(
            $table_name,
            array(
                'current_index' => $current_task
            ),
            array(
                'user_id' => $user_id,
                'page_id' => $page_id
            ));
    }else {
        $wpdb->insert(
            $table_name,
            array(
                'user_id' => $user_id,
                'page_id' => $page_id,
                'current_index' => $current_task
            )
        );
    }
    // выход нужен для того, чтобы в ответе не было ничего лишнего, только то что возвращает функция
    wp_die();
}

//save user audio file
add_action('wp_ajax_my_save_audio_file', 'my_save_audio_file_callback');
add_action('wp_ajax_nopriv_my_save_audio_file', 'my_save_audio_file_callback');
function my_save_audio_file_callback() {
    // Do your processing here (save to database etc.)
    // All WP API functions are available for you here
    $table_name = 'user_audio';
    $user_id = get_current_user_id();
    $page_id = intval( $_POST['page_id'] );
    $page_question_number = intval( $_POST['page_question_number'] );
    $question_text = $_POST['question_text'];
    $question_text_short = $_POST['question_text_short'];
    $date = "-time-".date("G-i-s");
    $file = $_FILES['file']['tmp_name'];
    $fname_old = $user_id . "-" . $page_id . "-" . $page_question_number . "-audio";
    $fname = $fname_old.$date.".wav";
    $audio_link = "/audio/" . $fname;
    $mask = wp_upload_dir()['basedir'] . "/audio/" .$user_id . "-" . $page_id . "-" . $page_question_number . "-audio*.wav";
    array_map('unlink', glob($mask));
    move_uploaded_file($file, wp_upload_dir()["basedir"] . $audio_link);
    global $wpdb;
    $query = "SELECT audio_id FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$page_id." AND page_question_number = ".$page_question_number;
    $datum = $wpdb->get_results( $query );
    if(count($datum)>0){
        $wpdb->update(
            $table_name,
            array(
                'audio_link' => $audio_link,
                'question_text' => $question_text,
                'question_text_short' => $question_text_short
            ),
            array(
                'audio_id' => $datum[0]->{"audio_id"}
            ));
    }else {
        $query =  array(
            'user_id' => $user_id,
            'page_id' => $page_id,
            'page_question_number' => $page_question_number ,
            'question_text' => $question_text,
            'question_text_short' => $question_text_short,
            'audio_link' => $audio_link
        );
        $wpdb -> insert( $table_name, $query );
    }
    if(intval($_POST['showAudio'])){
        echo wp_upload_dir()["baseurl"].$audio_link;
    }
    // выход нужен для того, чтобы в ответе не было ничего лишнего, только то что возвращает функция
    wp_die();
}

//save user text in tasks like focus 4 task 1
add_action('wp_ajax_my_action_save_field', 'my_action_save_field_callback');
add_action('wp_ajax_nopriv_my_action_save_field', 'my_action_save_field_callback');

function save_field_in_db($table_name, $user_id, $page_id, $field_name, $field_text){
    global $wpdb;
    $query = "SELECT field_id FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$page_id." AND field_name = '".$field_name."'";
    $datum = $wpdb->get_results( $query );
    if(count($datum)>0){
        $wpdb->update(
            $table_name,
            array( 'field_text' => $field_text ),
            array( 'field_id' => $datum[0]->{"field_id"} ));
    }else {
        $query =  array(
            'user_id' => $user_id,
            'page_id' => $page_id,
            'field_name' => $field_name ,
            'field_text' => $field_text
        );
        $wpdb -> insert( $table_name, $query );
    }
}

function my_action_save_field_callback() {
    // Do your processing here (save to database etc.)
    // All WP API functions are available for you here
    $table_name = 'user_task_fields';
    $user_id = get_current_user_id();
    $page_id = intval( $_POST['page_id'] );
    $fields = $_POST['field'];
    foreach($fields as $field_name => $field_text){
        save_field_in_db($table_name, $user_id, $page_id, $field_name, $field_text);
    }
    // выход нужен для того, чтобы в ответе не было ничего лишнего, только то что возвращает функция
    wp_die();
}

//save section progress for user
add_action('wp_ajax_my_action_section_progress', 'my_action_section_progress_callback');
add_action('wp_ajax_nopriv_my_action_section_progress', 'my_action_section_progress_callback');
function my_action_section_progress_callback() {
    // Do your processing here (save to database etc.)
    // All WP API functions are available for you here
    $table_name = 'section_progress';
    $user_id = get_current_user_id();
    $current_task_id = intval( $_POST['page_id'] );
    $ancestors = get_post_ancestors( $current_task_id );
    $root = count($ancestors)-1;
    $section_id = $ancestors[$root];
    global $wpdb;
    $query = "SELECT id FROM ".$table_name." WHERE user_id = ".$user_id." AND section_id = ".$section_id;
    $datum = $wpdb->get_results( $query );
    if(count($datum)>0){
        $wpdb->update(
            $table_name,
            array( 'current_task_id' => $current_task_id ),
            array( 'id' => $datum[0]->{"id"} ));
    }else {
        $query =  array(
            'user_id' => $user_id,
            'section_id' => $section_id,
            'current_task_id' => $current_task_id
        );
        $wpdb -> insert( $table_name, $query );
    }
    // выход нужен для того, чтобы в ответе не было ничего лишнего, только то что возвращает функция
    wp_die();
}

//redirect on page with correct url on pages with ajax load
//function redirect_correct_url() {
//    global $post;
//    $ancestors = get_post_ancestors($post->ID);
//    $root = count($ancestors)-1;
//    $parent_id = $ancestors[$root];
//    $parents = get_post_ancestors( $post->ID );
//    if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
//        $table_name = "user_progress";
//        $user_id = get_current_user_id();
//        global $wpdb;
//        $query = "SELECT current_index FROM ".$table_name." WHERE user_id = ".$user_id." AND page_id = ".$post->post_parent;
//        $datum = $wpdb->get_results( $query );
//        if( $datum[0]->{"current_index"} != $post->ID ){
//            wp_redirect( get_the_permalink( $datum[0]->{'current_index'}, 301 ));
//            exit();
//        }
//    }
//}
//add_action('template_redirect', 'redirect_correct_url');

////add scripts for audio and record
//add_action('wp_ajax_my_add_scripts', 'my_add_scripts_callback');
//add_action('wp_ajax_nopriv_my_add_scripts', 'my_add_scripts_callback');
//function my_add_scripts_callback() {
//    // Do your processing here (save to database etc.)
//    // All WP API functions are available for you here
//    $add = $_POST['add'];
//    echo "add ".$add;
//    if( $add ){
//        echo "here";
//        wp_enqueue_script( 'ielts-jqueryrecordfunctions', get_template_directory_uri() . '/js/record-functions.js', array('jquery'));
//        $localizations = array( 'ajaxUrl' => admin_url( 'admin-ajax.php' ));
//        wp_localize_script( 'ielts-jqueryrecordfunctions', 'myVars', $localizations );
//    }
//    // выход нужен для того, чтобы в ответе не было ничего лишнего, только то что возвращает функция
//    wp_die();
//}

function make_page_nav_links(){
    global $post;
    $direct_parent = $post->post_parent;
    //get prev and next post url
    $postlist = mytheme_list_pages('title_li=&sort_column=menu_order');
    $key = array_search ($post->ID, $postlist);
    if( $postlist[ $key-1 ] ){
        $prev_rel = ($postlist[ $key-1 ]) ? $postlist[ $key-1 ] : false;
        $prev = get_permalink( $postlist[ $key-1 ] ); //Возвращает Строку/false. URL или false, если не удалось получить URL.
    }
    if( $postlist[ $key+1 ] ){
        $next_rel = ($postlist[ $key+1 ]) ? $postlist[ $key+1 ] : false;
        $next = get_permalink( $postlist[ $key+1 ] ); //Возвращает Строку/false. URL или false, если не удалось получить URL.
    }
    if(!(isset($prev))) $prev = false;
    if(!(isset($prev_rel))) $prev_rel = false;
    if(!(isset($next))) $next = false;
    if(!(isset($next_rel))) $next_rel = false;

    $ancestors = get_post_ancestors($post->ID);
    $root = count($ancestors)-1;
    $parent_id = $ancestors[$root];
    $parents = get_post_ancestors( $post->ID );

    $page_nav_class = '';
    if( ( count($parents) == 3 ) && ( in_array($parent_id,$parents) && ( get_post($parent_id)->post_name == "speaking") ) ){
        //page tasks only for Focuses on Part on SPEAKING
        unset($children_order);
        $children_order = array();
        $arg = array(
            'child_of' => wp_get_post_parent_id( $post->ID ),
            'sort_order'   => 'ASC',
            'sort_column'  => 'menu_order'
        );
        $children = get_pages($arg);
        if( count($children) > 0 ) {
            foreach ( $children as $child ) {
                array_push($children_order, array_search ( $child->ID, $postlist  ));
                if( $child->ID == $post->ID )
                    break;
            }
        }
        switch( count($children_order) ):
            case(1):
                if( count($children) == 1 ){
                    $page_nav_class = 'load item-is-last';
                }else{
                    $page_nav_class = 'load item-is-first';
                }
                break;
            case(count($children)):
                $page_nav_class = 'load item-is-last';
                break;
            default:
                $page_nav_class = 'load';
        endswitch;
    }
    $links = array(
        "prev" => $prev,
        "prev_rel" => $prev_rel,
        "next" => $next,
        "next_rel" => $next_rel,
        "page_nav_class" => $page_nav_class,
        "direct_parent" => $direct_parent
    );
    return $links;
}

function show_menu_by_location($menu_name){
    $locations = get_nav_menu_locations();
    if( $locations && isset($locations[ $menu_name ]) ){
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
        $menu_list = '<ul id="menu-' . $menu_name . '">';
        foreach ( $menu_items as $key => $menu_item ){
            $menu_list .= '<li><a href="' . $menu_item->url . '">' . $menu_item->title . '</a></li>';
        }
        $menu_list .= '</ul>';
        return $menu_list;
    }else{
        return false;
    }
}

function page_nav($prev, $prev_rel, $next, $next_rel, $class, $next_class){
    $next_class = ($next_class) ? " ".$next_class : "";
    $class = (isset($class)) ? "page-nav-wrapper ".$class : "page-nav-wrapper";
    $nav = '<nav class="'.$class.'">';
    if( $prev ) $nav .= '<a href="'.$prev.'" class="page-prev" rel="'.$prev_rel.'">'._("Back").'</a>';
    if( $next ) $nav .= '<a href="'.$next.'" class="page-next'.$next_class.'" rel="'.$next_rel.'">'._("Next").'</a>';
    $nav .= '</nav>';
    return $nav;
}

function show_next_only_btn($link){
    $show = '<nav class="page-nav-wrapper"><a class="page-next" href="'.$link.'">'._("Next").'</a></nav>';
    return $show;
}

function show_section_navigation_menu($menu_name, $user_success){
    $locations = get_nav_menu_locations();
    if( $locations && isset($locations[ $menu_name ]) ){
        $menu = wp_get_nav_menu_object( $locations[ $menu_name ] ); // получаем объект меню
        $menu_items = wp_get_nav_menu_items( $menu ); // получаем элементы меню
        $menu_list = '<nav id="menu-' . $menu_name . '" class="section-menu column-4 collapse section-completion-menu">';
        foreach ( $menu_items as $key => $menu_item ){
            $menu_list .= '<a href="' . $menu_item->url . '" class="menu-item '.$user_success[ $menu_item->title ].'">' . $menu_item->title;
            $menu_list .= '</a>';
        }
        $menu_list .= '</nav>';
        return $menu_list;
    }else{
        return false;
    }
}
/*---end added by ira.che---*/
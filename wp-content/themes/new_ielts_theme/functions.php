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
        'speaking_part1' => __( 'Speaking: Part 1 Menu', 'ielts' ),
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

	wp_enqueue_script( 'ielts-jqueryfunctions', get_template_directory_uri() . '/js/functions.js', array('jquery'));

    if ( is_page( 'Task voice record' ) ) {
        wp_enqueue_script( 'ielts-jqueryrecorderjs', get_template_directory_uri() . '/js/recorder.js', array('jquery'));
        $wnm_custom = array( 'template_url' => get_bloginfo('template_url') );
        wp_localize_script( 'ielts-jqueryrecorderjs', 'wnm_custom', $wnm_custom );
    }

	wp_localize_script( 'ielts-script', 'screenReaderText', array(
		'expand'   => __( 'expand child menu', 'ielts' ),
		'collapse' => __( 'collapse child menu', 'ielts' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'ielts_scripts' );

function show_my_recorder_func() {

    wp_enqueue_script( 'ielts-jqueryrecorderjs', get_template_directory_uri() . '/js/recorder.js', array('jquery'));
    $wnm_custom = array( 'template_url' => get_bloginfo('template_url') );
    wp_localize_script( 'ielts-jqueryrecorderjs', 'wnm_custom', $wnm_custom );

    $recorder = '<button class="btn btn-record">Record Myself</button>';
    $recorder .= '<button class="btn btn-stop" disabled>Stop</button>';
    $recorder .= '<div class="record-duration"></div>';
    $recorder .= '<ul id="recordingslist" class="record-list"></ul>';
    $recorder .= '<pre id="log"></pre>';

    return $recorder;

}
add_shortcode('my_recorder', 'show_my_recorder_func');

function show_my_video_func() {

    $video = '<div class="page-video">';
    $video .= '<div class="player">';
//    $video .= '<p class="video-name">' . _("Explore what you’ll get with Grade IELTS On-line Preparation Course") . '</p>';
//    $video .= '<p class="video-content">' . _('Tasks, tests and checkpoint reviews') . '</p>';
    $video .= '<div class="el-play"></div>';
    $video .= '</div>';
    $video .= '</div>';

    return $video;

}
add_shortcode('my_video', 'show_my_video_func');

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
    global $current_user;
    wp_get_current_user();

    //redirect from all pages excerpt page Under Construction, login page and front pages
    if( (!is_user_logged_in()) && (!is_front_page()) && (!is_home()) && (!is_404()) && (!is_login_page()) && ( get_queried_object_id() !== 64 ) ) {
        wp_redirect(home_url());
        exit();
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

function content_to_select_words ( $content ) {
    $text = $content;
    $result = '';

    preg_match('#<\s*?ol\b[^>]*>(.*?)</ol\b[^>]*>#s', $text, $ol_list);

    $text_path = explode($ol_list[0], $text);
    $result .= $text_path[0]; //content before <ol>

    //мастерим со списком
    preg_match_all('#<\s*?ol\b[^>]*>(.*?)</ol\b[^>]*>#s', $ol_list[0], $li_elements); //for separate ol tags, $li_elements[0] with tags ol, $li_elements[1] without ol
    $ol_tag = explode( $li_elements[1][0], $li_elements[0][0] );

    $result .= $ol_tag[0]; //tag <ol>

    preg_match_all('#<\s*?li\b[^>]*>(.*?)</li\b[^>]*>#s', $li_elements[1][0], $li_all); //find all li

    foreach( $li_all[0] as $li ) {

        preg_match('#<\s*?li\b[^>]*>(.*?)</li\b[^>]*>#s', $li, $li_el); //for separate li tags, $li_el[0] has tag <li>, $li_el[1] has no tag <li>
        $li_tag = explode($li_el[1], $li_el[0]);
        $result .= $li_tag[0]; //open tag <li>

        preg_match('#<\s*?fieldset\b[^>]*>(.*?)</fieldset\b[^>]*>#s', $li_el[1], $text_field); //put text field in $text_field
        $li_text_path = explode($text_field[0], $li_el[1]); //get part of li content before and after $text_field

        //all right if there is only ONE text field in <li>
        $result .= select_words_wrap($li_text_path[0]);//text before text_field
        $result .= $text_field[0];
        $result .= " ".select_words_wrap($li_text_path[1]);//text after text_field

        $result .= $li_tag[1];  //close tag </li>
    }

    $result .= $ol_tag[1]; //close tag </ol>
    $result .= $text_path[1]; //content after <ol>

    return $result;
}

//task with select key words in text
function drop_words_wrap($sentence){
    $result="";

    $text = trim($sentence); //clear all extra spaces and symbols

    preg_match_all('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', $sentence, $key_words);

    foreach( $key_words[0] as $key_el ) {

        $text_part = explode( $key_el, $text ); //get text before key word

        preg_match_all('/(correct_answer)=("[^"]*")/i',$key_el, $key_attr ); //get attribute correct_answer="" from tag <span> in $key_attr[0]
        preg_match('#<\s*?span\b[^>]*>(.*?)</span\b[^>]*>#s', $key_el, $key_word); //get just word here on $key_word[1]
//        var_dump($key_attr[0][0]);
        $word = "<div class='word-drop'><span>".$key_word[1]."</span><ul class='sort' ".$key_attr[0][0]."></ul></div>";
        if($text_part[0]) {
            $text_part[0] = "<span>".$text_part[0]."</span>";
        }
        $result .= $text_part[0].$word; //put content part processed to result

        $text = $text_part[1]; //put rest of text in $text. This part exclude $key_el el and content before it
    }

    return $result;
}

function content_to_drop_words ( $content ) {
    $text = $content;
    $result = '';

    preg_match('#<\s*?ol\b[^>]*>(.*?)</ol\b[^>]*>#s', $text, $ol_list);

    $text_path = explode($ol_list[0], $text);
    $result .= $text_path[0]; //content before <ol>

    //мастерим со списком
    preg_match_all('#<\s*?ol\b[^>]*>(.*?)</ol\b[^>]*>#s', $ol_list[0], $li_elements); //for separate ol tags, $li_elements[0] with tags ol, $li_elements[1] without ol
    $ol_tag = explode( $li_elements[1][0], $li_elements[0][0] );

    $result .= $ol_tag[0]; //tag <ol>

    preg_match_all('#<\s*?li\b[^>]*>(.*?)</li\b[^>]*>#s', $li_elements[1][0], $li_all); //find all li

    foreach( $li_all[0] as $li ) {

        preg_match('#<\s*?li\b[^>]*>(.*?)</li\b[^>]*>#s', $li, $li_el); //for separate li tags, $li_el[0] has tag <li>, $li_el[1] has no tag <li>
        $li_tag = explode($li_el[1], $li_el[0]);
        $result .= $li_tag[0]; //open tag <li>

        preg_match('#<\s*?fieldset\b[^>]*>(.*?)</fieldset\b[^>]*>#s', $li_el[1], $text_field); //put text field in $text_field
        $li_text_path = explode($text_field[0], $li_el[1]); //get part of li content before and after $text_field

        //all right if there is only ONE text field in <li>
        $result .= drop_words_wrap($li_text_path[0]);//text before text_field

        if(drop_words_wrap($li_text_path[0])) {
            $result .= " ";
        }

        $result .= $text_field[0];
        $result .= " ".drop_words_wrap($li_text_path[1]);//text after text_field

        $result .= $li_tag[1];  //close tag </li>
    }

    $result .= $ol_tag[1]; //close tag </ol>
    $result .= $text_path[1]; //content after <ol>

    return $result;
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

/*---end added by ira.che---*/
<?php
/**
 * The template for displaying the header
 * Displays all of the head element and everything up until the "site-content" div.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>

	<meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php bloginfo('name'); ?> <?php wp_title(); ?></title>
    <link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i" rel="stylesheet">
	<?php wp_head(); ?>

</head>

<body>

    <?php

    global $current_user;
    wp_get_current_user();

    if(is_user_logged_in()) {

        global $post;
        $ancestors = get_post_ancestors($post->ID);
        $root = count($ancestors)-1;
        $parent_id = $ancestors[$root];

        //registered user
        echo '<nav class="header-navigation-container" role="navigation">';

            if($parent_id) {
                echo '<div class="container header-top-nav registered-user section-parent">';
            } else {
                echo '<div class="container header-top-nav registered-user">';
            }

            echo '<a href="'.home_url("/ielts-test-sections/").'" class="logo">'._("GRADE").'</a>';

            if( ($parent_id) && (!(is_search())) ) {
                echo '<a href="'. get_permalink( $parent_id ) .'" class="header-section-parent">';
                    if( get_the_title( $parent_id ) == "Reading. Question types" ) {
                        echo "Reading";
                    } else {
                        echo get_the_title( $parent_id );
                    }
                echo '</a>';
            }

            echo '<a href="'.home_url("/under-construction/").'" class="user-person">';
                echo '<span class="username">'.$current_user->user_firstname.' '.$current_user->user_lastname.'</span>';
                echo '<span class="user-default-avatar">';

                if( get_avatar_url( $current_user->user_email, 30 ) ) {
                    echo '<img src="'.get_avatar_url( $current_user->user_email, 30 ).'" class="user-avatar" alt="'. $current_user->user_login .'" />';
                }

                echo '</span>';
            echo '</a>';

            echo '</div>';
        echo '</nav>';


    } else {

        //unregistered user
        echo '<nav class="header-navigation-container" role="navigation">';
            echo '<div class="container header-top-nav">';

                echo '<a href="#" class="header-nav-icon"></a>';

                echo '<a href="'.get_home_url().'" class="logo">'._("GRADE").'</a>';

                echo '<nav class="header-nav">';
                    echo '<a href="'.home_url("/under-construction/").'" class="header-nav-item">'._("Blog").'</a>';
                    echo '<a href="'.home_url("/under-construction/").'" class="header-nav-item">'._("About").'</a>';
                    echo '<a href="'.home_url("/under-construction/").'" class="header-nav-item">'._("Team Plans").'</a>';
                    echo '<a href="'.home_url("/under-construction/").'" class="header-nav-item">'._("Support").'</a>';
                echo '</nav>';

                echo '<a href="'.wp_login_url().'" class="btn-sign-in">'._("Sign in").'</a>';

            echo '</div>';
        echo '</nav>';

    }

    ?>
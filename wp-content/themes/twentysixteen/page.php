<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */

get_header(); ?>

<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">
		<?php

		// Start the loop.
		if( is_front_page()) {

		    if(!(is_user_logged_in())){

                if (isset($_GET['registration'])){

                    echo do_shortcode('[ielts_registration_form]');

                } else {

                    if ((isset($_GET['reason']))&&(isset($_GET['login']))){
                        echo '<p style="color:red;">We have a message: Your login is '.$_GET["login"].' because it is '.$_GET["reason"].'</p>';
                        //print error message or do something else
                    }
                    if (isset($_GET['logout'])){
                        echo '<p style="color:blue;">You just log out. Come in, be with us</p>';
                        //print error message or do something else
                    }

                    $args = array(
                        'echo'           => true,
                        'remember'       => true,
                        //'redirect'       => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],
                        'redirect'       => 'http://grade.fireflydevelop.com/',
                        'form_id'        => 'loginform',
                        'id_username'    => 'user_login',
                        'id_password'    => 'user_pass',
                        'id_remember'    => 'rememberme',
                        'id_submit'      => 'wp-submit',
                        'label_username' => __( 'Email' ),
                        'label_password' => __( 'Password' ),
                        'label_remember' => __( 'Remember Me' ),
                        'label_log_in'   => __( 'Log In' ),
                        'value_username' => '',
                        'value_remember' => false
                    );
                    echo '<div class="form registration-form">';
                    echo '<h3 class="from-name entry-title">';
                    _e('Log in');
                    echo '</h3>';
                    wp_login_form($args);
                    echo "<a href='".home_url()."?registration=1' class='login-registration'>";
                    _e('Registration');
                    echo "</a>";
                    echo '</div>';
                    }

		    } else {
		        echo "<p>You are in</p>";
		        while ( have_posts() ) : the_post();
                    // Include the page content template.
                    get_template_part( 'template-parts/content', 'page' );

                    // If comments are open or we have at least one comment, load up the comment template.
                    if ( comments_open() || get_comments_number() ) {
                        comments_template();
                    }

                    // End of the loop.
                endwhile;
		    }

		} else {
            while ( have_posts() ) : the_post();

                // Include the page content template.
                get_template_part( 'template-parts/content', 'page' );

                // If comments are open or we have at least one comment, load up the comment template.
                if ( comments_open() || get_comments_number() ) {
                    comments_template();
                }

                // End of the loop.
            endwhile;
		}
		?>

	</main><!-- .site-main -->

	<?php get_sidebar( 'content-bottom' ); ?>

</div><!-- .content-area -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>

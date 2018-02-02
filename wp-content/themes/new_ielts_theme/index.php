<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage IELTS
 * @since IELTS 1.0
 */

get_header(); ?>
<main id="index" class="container page" role="main">
    <?php if ( have_posts() ) : ?>
        <?php if ( is_home() && ! is_front_page() ) : ?>
            <header class="entry-header">
                <h1 class="entry-title"><?php single_post_title(); ?></h1>
            </header>
        <?php endif; ?>
        <?php
        // Start the loop.
        while ( have_posts() ) : the_post();
            /*
             * Include the Post-Format-specific template for the content.
             * If you want to override this in a child theme, then include a file
             * called content-___.php (where ___ is the Post Format name) and that will be used instead.
             */
            get_template_part( 'template-parts/content', get_post_format() );
        // End the loop.
        endwhile;
        // Previous/next page navigation.
        $prev = get_permalink(get_adjacent_post(false,'',false));
        $next = get_permalink(get_adjacent_post(false,'',true));
        $nav = '<nav class="page-nav-wrapper">';
            if( $prev ) $nav .= '<a href="'.$prev.'" class="page-prev" rel="'.$prev_rel.'">'._("Back").'</a>';
            if( $next ) $nav .= '<a href="'.$next.'" class="page-next" rel="'.$next_rel.'">'._("Next").'</a>';
        $nav .= '</nav>';
        echo $nav;
    // If no content, include the "No posts found" template.
    else :
        get_template_part( 'template-parts/content', 'none' );
    endif;
    ?>
</main><!-- .site-main -->
<?php get_footer(); ?>

<?php
/**
 * Шаблон вывода названия рубрики и постов из неё темы Twenty Sixteen
 */
if ( have_posts() ) : ?>

    <header class="page-header">

        <?php the_archive_title( '<h1 class="entry-title">', '</h1>' ); ?>

    </header>


    <?php
    while ( have_posts() ) : the_post();

        get_template_part( 'template-parts/content', get_post_format() );

    endwhile;


//    echo str_replace( admin_url( 'admin-ajax.php/' ), get_category_link( $cat->term_id ), $pagination );
else :
    get_template_part( 'template-parts/content', 'none' );
endif;
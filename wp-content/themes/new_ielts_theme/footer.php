<?php
/**
 * The template for displaying the footer
 */

global $current_user;
wp_get_current_user();

?>

<footer class="container footer-wrapper<? if(is_front_page()) { echo " front-end"; } ?>">

<?php
if(is_user_logged_in()) {

    //registered user
    echo '<div class="footer-top registered-user">';
        echo '<nav class="footer-nav-menu" role="navigation">';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Blog").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("About").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Community").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Teamplans").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Refer a friend").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Partnership").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Privacy").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Terms and Conditions").'</a>';
        echo '</nav>';

} else {

    //unregistered user
    echo '<div class="footer-top">';
        echo '<nav class="footer-nav-menu" role="navigation">';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Community").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Partnership").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Terms and Conditions").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Refer a friend").'</a>';
            echo '<a href="'. home_url("/under-construction/") .'" class="item">'._("Privacy").'</a>';
        echo '</nav>';

}
?>

        <nav class="soc-icons-menu">
            <a href="https://www.facebook.com/vspink/about/?ref=page_internal&sw_fnr_id=250588020&fnr_t=0" target="_blank" class="item fc"></a>
            <a href="" target="_blank" class="item insta"></a>
            <a href="" target="_blank" class="item gplus"></a>
            <a href="" target="_blank" class="item twit"></a>
        </nav>
    </div>
    <div class="footer-bottom">
        <p><?php _e('2017, IOP by Grade Education Center'); ?></p>
        <p><?php _e('Design by <strong>Doors</strong>'); ?></p>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>

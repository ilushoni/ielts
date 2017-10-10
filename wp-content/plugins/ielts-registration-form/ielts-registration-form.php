<?php
/*
  Plugin Name: IELTS Registration Form
  Description: Simple WordPress registration form plugin that just work
  Version: 1.0
  Author: ira.che
 */

class ielts_registration_form {

    // form properties
    private $username;
    private $email;
    private $password;


    function __construct(){
        add_shortcode('ielts_registration_form', array($this, 'shortcode'));
    }


    public function registration_form() {

        ?>
        <form method="post" action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>">
            <div class="form registration-form">
                <h3 class="from-name entry-title"><?php _e('Registration'); ?></h3>
                <div class="form-group">
                    <input name="reg_email" type="email" class="form-field"
                           value="<?php echo(isset($_POST['reg_email']) ? $_POST['reg_email'] : null); ?>"
                           placeholder="Email" id="reg-email" required/>
                    <label class="field-icon field-mail" for="reg-email"></label>
                </div>

                <div class="form-group">
                    <input name="reg_password" type="password" class="form-field"
                           value="<?php echo(isset($_POST['reg_password']) ? $_POST['reg_password'] : null); ?>"
                           placeholder="Password" id="reg-pass" required/>
                    <label class="field-icon field-lock" for="reg-pass"></label>
                </div>

                <div class="form-group">
                    <a href="<?php echo home_url(); ?>" class="left">← <?php _e('Back to login'); ?></a>
                    <input class="btn btn-primary btn-lg btn-block right" type="submit" name="reg_submit" value="Register"/>
                </div>
            </div>
        </form>
        <?php

    }


    function validation()   {

        if (empty($this->password) || empty($this->email)) {
            return new WP_Error('field', 'Hm, some field is missing');
        }

        $this->username = $this->email;

        if (strlen($this->password) < 5) {
            return new WP_Error('password', 'Oh, no! Password length must be greater than 5');
        }

        if (!is_email($this->email)) {
            return new WP_Error('email_invalid', 'Hm, Email is not valid');
        }

        if (email_exists($this->email)) {
            return new WP_Error('email', 'Sorry, Email already in use. Ask Admin your password or write other Email');
        }
    }


    function registration() {

        $userdata = array(
            'user_login' => esc_attr($this->email),
            'user_email' => esc_attr($this->email),
            'user_pass' => esc_attr($this->password),
        );

        if (is_wp_error($this->validation())) {

            echo '<div class="form-message error-message">' . $this->validation()->get_error_message() . '</div>';

        } else {

            $register_user = wp_insert_user($userdata);

            if (!is_wp_error($register_user)) {

                echo '<div class="form-message success-message">';
                _e('It is success! Registration complete');
                echo '</div>';
                $_POST['registration_success'] = 1;
                $_POST["user_id"] = $register_user;

                echo "<a href='".home_url()."' class='left'>";
                _e('And now Log In please');
                echo "</a>";


            } else {

                echo '<div class="form-message error-message">' . $register_user->get_error_message() . '</div>';

            }
        }

    }


    function shortcode() {

        ob_start();

        if ($_POST['reg_submit']) {
            $this->username = $_POST['reg_email'];
            $this->email = $_POST['reg_email'];
            $this->password = $_POST['reg_password'];

            $this->validation();
            $this->registration();
        }

        if(!($_POST['registration_success'])){
            $this->registration_form();
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
        return ob_get_clean();

    }

}


new ielts_registration_form;
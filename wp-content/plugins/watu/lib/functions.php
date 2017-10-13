<?php
// a bunch of helper functions
function watu_define_newline() {
	// credit to http://yoast.com/wordpress/users-to-csv/
	$unewline = "\r\n";
	if (strstr(strtolower($_SERVER["HTTP_USER_AGENT"]), 'win')) {
	   $unewline = "\r\n";
	} else if (strstr(strtolower($_SERVER["HTTP_USER_AGENT"]), 'mac')) {
	   $unewline = "\r";
	} else {
	   $unewline = "\n";
	}
	return $unewline;
}

function watu_get_mime_type()  {
	// credit to http://yoast.com/wordpress/users-to-csv/
	$USER_BROWSER_AGENT="";

			if (preg_match('/OPERA(\/| )([0-9].[0-9]{1,2})/', strtoupper($_SERVER["HTTP_USER_AGENT"]), $log_version)) {
				$USER_BROWSER_AGENT='OPERA';
			} else if (preg_match('/MSIE ([0-9].[0-9]{1,2})/',strtoupper($_SERVER["HTTP_USER_AGENT"]), $log_version)) {
				$USER_BROWSER_AGENT='IE';
			} else if (preg_match('/OMNIWEB\/([0-9].[0-9]{1,2})/', strtoupper($_SERVER["HTTP_USER_AGENT"]), $log_version)) {
				$USER_BROWSER_AGENT='OMNIWEB';
			} else if (preg_match('/MOZILLA\/([0-9].[0-9]{1,2})/', strtoupper($_SERVER["HTTP_USER_AGENT"]), $log_version)) {
				$USER_BROWSER_AGENT='MOZILLA';
			} else if (preg_match('/KONQUEROR\/([0-9].[0-9]{1,2})/', strtoupper($_SERVER["HTTP_USER_AGENT"]), $log_version)) {
		    	$USER_BROWSER_AGENT='KONQUEROR';
			} else {
		    	$USER_BROWSER_AGENT='OTHER';
			}

	$mime_type = ($USER_BROWSER_AGENT == 'IE' || $USER_BROWSER_AGENT == 'OPERA')
				? 'application/octetstream'
				: 'application/octet-stream';
	return $mime_type;
}

function watu_redirect($url) {
	echo "<meta http-equiv='refresh' content='0;url=$url' />"; 
	exit;
}

// escapes user input to be usable in preg_replace & other preg functions
function watu_preg_escape($input) {
	return str_replace(array('^', '.', '|', '(', ')', '[', ']', '*', '+', '?', '{', '}', '$', '/'), 
		array('\^', '\.', '\|', '\(', '\)', '\[', '\]', '\*', '\+', '\?', '\{', '\}', '\$', '\/' ), $input);
}

// notify admin / user about taken quiz
function watu_notify($exam, $uid, $output, $who = 'admin') {
	global $user_email;
	
	$admin_email = watu_admin_email();
	if(strstr($admin_email, '<')) {
		$parts = explode('<', $admin_email);
		$admin_email = trim(str_replace('>', '', $parts[1]));
	}
	$admin_emails = array();
	
	if(!empty($exam->notify_email)) {
		$emails = explode(',', $exam->notify_email);
		foreach($emails as $email) $admin_emails[] = trim($email);
	}
	else $admin_emails[] = $admin_email;
	
	// different output for user / admin?
	if(strstr($output, '{{{split}}}')) {
		$parts = explode('{{{split}}}', $output);
		if($who == 'admin') $output = $parts[1];
		else $output = $parts[0];
	} 
	
	// replace styles in the snapshot with the images
	$correct_style=' style="padding-right:20px;background:url('.WATU_URL.'correct.png) no-repeat right top;" ';
	$wrong_style=' style="padding-right:20px;background:url('.WATU_URL.'wrong.png) no-repeat right top;" ';
	$user_answer_style = ' style="font-weight:bold;" ';	
	
	
	$output=str_replace('><!--WATUEMAILanswerWATUEMAIL--','',$output);
	$output=str_replace('><!--WATUEMAILanswer correct-answer user-answerWATUEMAIL--', $correct_style, $output);
	$output=str_replace('><!--WATUEMAILanswer correct-answeruser-answerWATUEMAIL--', $correct_style, $output);
	$output=str_replace('><!--WATUEMAILanswer correct-answerWATUEMAIL--',$correct_style,$output);
	$output=str_replace('><!--WATUEMAILanswer user-answerWATUEMAIL--', $wrong_style,$output);
	
	$output = str_replace("<li class='answer user-answer'>", "<li ".$user_answer_style.">", $output);
	$output = str_replace("<li class='answer user-answer correct-answer'>", "<li ".$user_answer_style.">", $output);	
	$output = str_replace("<li class='answer correct-answer user-answer'>", "<li ".$user_answer_style.">", $output);
	
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From: '. watu_admin_email() . "\r\n";
			
	if($who == 'admin') {
		$subject = sprintf(__('User results on "%s"', 'watu'), stripslashes($exam->name));	
		$user_data = empty($uid) ? __('Guest', 'watupro') : $user_email;	
		$message = "Details of $user_data:<br><br>".$output;	
		
		foreach($admin_emails as $admin_email) {			
			wp_mail($admin_email, $subject, $message, $headers);
		}
	}  
	else {
		// email user
		if(empty($uid)) {			
			$user_email = $_POST['watu_taker_email'];
		}	
		
		if(empty($user_email)) return true;
		
		$subject = sprintf(__('Your results on "%s"', 'watu'), stripslashes($exam->name));	
		$message = $output;	
		
		wp_mail($user_email, $subject, $message, $headers);
	}
   // echo $message;   
} // end watu_notify

// replace user email in the quiz output / email output
function watu_replace_email($email, $output) {
	if(strstr($output, '%%EMAIL%%')) {
		if(empty($email) and is_user_logged_in()) {
			$current_user = wp_get_current_user();
			$email = $current_user->user_email;
		}		
		
		$output = str_replace('%%EMAIL%%', $email, $output); 
	}
	
	return $output;
}

// get admin email. This overwrites the global setting with the Watu setting.
function watu_admin_email() {
	$admin_email = get_option('watu_admin_email');
	if(empty($admin_email)) $admin_email = get_option('admin_email');
	
	return $admin_email;
}

// strip tags when user is not allowed to use unfiltered HTML
// keep some safe tags on
function watu_strip_tags($content) {
   if(!current_user_can('unfiltered_html')) {
		$content = strip_tags($content, '<b><i><em><u><a><p><br><div><span><hr><font><img>');
	}
	
	return $content;
}

// makes sure all values in array are ints. Typically used to sanitize POST data from multiple checkboxes
function watu_int_array($value) {
   if(empty($value) or !is_array($value)) return array();
   $value = array_filter($value, 'intval');
   return $value;
}

// returns clickable URL of a published quiz if found
function watu_exam_url($exam_id, $target="_blank") {
	global $wpdb;
	
	$exam = $wpdb->get_row($wpdb->prepare("SELECT name, ID FROM ".WATU_EXAMS." WHERE ID=%d", $exam_id));
	
	$post_id = $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_status='publish'
		AND post_content LIKE '%[watu ".$exam->ID."]%' ORDER BY ID DESC LIMIT 1");
		
	if(empty($post_id)) return stripslashes($exam->name);
	else return '<a href="'.get_permalink($post_id).'" target="'.$target.'">'.stripslashes($exam->name).'</a>';	 
}

// returns non-clickable URL of a published quiz if found
function watu_exam_url_raw($exam_id) {
	global $wpdb;
	
	$exam = $wpdb->get_row($wpdb->prepare("SELECT name, ID FROM ".WATU_EXAMS." WHERE ID=%d", $exam_id));
	
	$post_id = $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_status='publish'
		AND post_content LIKE '%[watu ".$exam->ID."]%' ORDER BY ID DESC LIMIT 1");
		
	if(empty($post_id)) return '';
	else return get_permalink($post_id);	 
}
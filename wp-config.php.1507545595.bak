<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define('DB_NAME', 'kaizengr_grade');

/** Имя пользователя MySQL */
define('DB_USER', 'kaizengr_grade');

/** Пароль к базе данных MySQL */
define('DB_PASSWORD', 'g49c45sl');

/** Имя сервера MySQL */
define('DB_HOST', 'kaizengr.mysql.ukraine.com.ua');

/** Кодировка базы данных для создания таблиц. */
define('DB_CHARSET', 'utf8mb4');

/** Схема сопоставления. Не меняйте, если не уверены. */
define('DB_COLLATE', '');

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'HJwnM/:3`ut3^(bDy<[}%CoT#h#k4:]zLT}tAY;ZDT052c?k?[p;fZ>ozOAKqo=W');
define('SECURE_AUTH_KEY',  'aX]v&~<{t*vu8ZqOXf<@{Wr>*&$=e.u!airEfzS9Oec/P?Kp,,g`jHf|<Jj`Jxk@');
define('LOGGED_IN_KEY',    '}ki_L/sYYN 1=QA!LRBE+-UzI[$xksuCgm)?y]>.aRzSNx%]N{`$]3r|Dr[R#T.6');
define('NONCE_KEY',        'POK:[A7T?&X=JCG(ZttaQpA~Zr>?C %^Jv[JdF&vxl^TerGlzf(rM4KWNeLfr1(M');
define('AUTH_SALT',        'cG`q,paTXGg.+%lBNJ!EVlnc;|)s5`#]Eck*R/D`@PEAr/p{>*>)YX?kE}->gz|a');
define('SECURE_AUTH_SALT', 'kP X_*d>pU7O0)]XO?)>VwAK~k,{k!S2Q44Jo;|Il*x2vgd&LMW$37,=~#}!VUY0');
define('LOGGED_IN_SALT',   't&SN)U`CGuUP(d!S3B&VA$5Q!Y=Ev4rqtu(#0tNdpM:.Xj32#(WL2MY4KQz.6XLv');
define('NONCE_SALT',       '6)PC1i^c4%}LD1^OR>y^3u.)l`BH@#NmMlp^8lqhm;bUSN0S~v[//e(D4z)cWX?p');

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix  = 'wp_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 * 
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Инициализирует переменные WordPress и подключает файлы. */
require_once(ABSPATH . 'wp-settings.php');

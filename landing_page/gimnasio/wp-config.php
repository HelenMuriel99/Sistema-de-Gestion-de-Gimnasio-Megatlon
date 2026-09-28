<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bd_gimnasio' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'BD,!ycD=;QY]ijAf+e1;W,n[sU9To4lRAvaOxeXlXe ]>vFLa{!f[)%F]l6jI~<e' );
define( 'SECURE_AUTH_KEY',  'J@{GBt;c6jOpgFPQjQ`Xmuh=t`Js+ob9bn_(St3L5z%t?]T)YEb01^(sjn> LiCO' );
define( 'LOGGED_IN_KEY',    'qVL:-q_1rY46+>?,N1gw~Nu>i%Q=jcrk06Xk8f+ 2mpEAiR3BL^te)4wBLD$ecln' );
define( 'NONCE_KEY',        'Ql=3.9eUb-8cn_-Qmbj03(yp<@M.1LZ<o>uV^97SF^Pm(ua-ZBPO.l6]W0~-`FE2' );
define( 'AUTH_SALT',        'LTIv%b9M8Ei_.zMc%n/qz ,ayFgn*J|cYS=AsM}4f`z;8.):_uYS`upm@{$*7C9-' );
define( 'SECURE_AUTH_SALT', 'HF*Ha3U-[<<V$=!Xn~Zr<+>2E7rmC5:*R#te>)Z7:Z/?O/ 1?/;hWKRm2v~,c+xz' );
define( 'LOGGED_IN_SALT',   'R*4Wo d^N,)<_VG eY%a |q_|NP k/HUAJUmo+~/&m71A8g+4}RK~G&/W,msX@30' );
define( 'NONCE_SALT',       'P8y8b&?,P%lsj_0c1zuhdo1hS;;|O2$g/<MiMp $.iZGPSs ,{KAZC~S*H%4gGPc' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

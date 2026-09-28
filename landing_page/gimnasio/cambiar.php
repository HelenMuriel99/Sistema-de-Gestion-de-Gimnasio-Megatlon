<?php
require_once('wp-load.php');

// Cambia 'admin' por el usuario de la base de datos si te lo sabes, si no, déjalo así
$user_id = 1; 
$password = '12345';

wp_set_password($password, $user_id);
echo "¡Contraseña cambiada con éxito! El usuario ID 1 ahora tiene la clave: 12345. Borra este archivo inmediatamente por seguridad.";
?>

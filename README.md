# Sistema-de-Gestion-de-Gimnasio-Megatlon

MEGATLON - Frontend (React)

Este es el módulo de interfaz de usuario para el sistema de gestión del gimnasio Megatlon.
Está construido con React (Vite) y Tailwind CSS.

Cómo levantar el proyecto en tu computadora

Sigue estos pasos para correr el frontend en tu máquina local:

Abre tu terminal y navega hasta la carpeta del frontend:

cd frontend

Instala las dependencias (Solo necesitas hacer esto la primera vez):

npm install

Inicia el servidor de desarrollo:

npm run dev

Abre tu navegador y ve a la dirección que te indique la terminal (por lo general es http://localhost:5173/).

🔗 Conexión con el Backend
El proyecto está configurado para conectarse automáticamente al backend local de Spring Boot.
Asegúrate de que el Backend esté corriendo en http://localhost:8080.

Credenciales de prueba (Propietario):

CI: 1234567

Password: admin123



🏋️ Landing Page - Megatlon (WordPress)



Esta carpeta contiene la página web pública del gimnasio desarrollada en WordPress.



🛠️ Cómo levantar este proyecto en tu computadora local



Como este proyecto usa PHP y MySQL, necesitas usar Laragon (o XAMPP) para correrlo. Sigue estos pasos:



1\. Copiar los archivos



Copia toda esta carpeta (donde está este README) y pégala dentro de la ruta de Laragon de tu computadora: C:\\laragon\\www\\gimnasio



2\. Importar la Base de Datos



Abre Laragon y asegúrate de iniciar los servicios de Apache y MySQL.



Haz clic en Base de datos para abrir HeidiSQL.



Crea una nueva base de datos llamada gimnasio (o el nombre que esté configurado en el archivo wp-config.php en la línea DB\_NAME).



Selecciona esa base de datos, ve a Archivo > Cargar archivo SQL y selecciona el archivo base\_de\_datos\_gimnasio.sql que viene en esta carpeta.



Presiona F9 (o el botón de Ejecutar) para importar todas las tablas.



3\. Configurar conexión (Si es necesario)



Abre el archivo wp-config.php y verifica que las credenciales de tu base de datos local coincidan (por defecto en Laragon es usuario root y contraseña en blanco "").



4\. Listo



Abre tu navegador y entra a http://gimnasio.test (si usas Laragon) o http://localhost/gimnasio para ver la web funcionando.



admin

12345


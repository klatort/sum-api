# Bienvenido al API SUM
Este proyecto ha sido creado para manejar el SUM de manera programática, permitiendo una integración más sencilla con los servicios del SUM y fortaleciendo la seguridad de las interacciones. Actualmente, solo se están documentando y desarrollando los endpoints utilizados por la aplicación del portal UNMSM, añadiendo una capa adicional de seguridad a los servicios existentes.

## Descripción General
El API SUM es un esfuerzo colaborativo para centralizar y estandarizar el manejo de datos entre aplicaciones dentro del ecosistema universitario de la UNMSM. Este sistema está diseñado con fines académicos y busca mejorar la infraestructura tecnológica interna de la universidad, facilitando la integración de servicios y el desarrollo de nuevas herramientas.

## Propósito del Proyecto
### ¿Por qué este proyecto?
La comunidad sanmarquina necesita software propio que permita centralizar los datos que se manejan entre aplicaciones. Este proyecto nació de la necesidad de facilitar la realización de proyectos académicos que requieren acceso a información gestionada por el SUM. Al consolidar estas herramientas en un solo punto de encuentro, se fomenta la creación de sistemas más eficientes y accesibles para los alumnos.

### ¿Cómo se documentan los servicios?
Utilizando técnicas como webcrawling y man-in-the-middle (mitm), hemos identificado y documentado los endpoints disponibles. Esto permite una integración más eficiente y asegura que toda vulnerabilidad encontrada es inherente al sistema base del SUM. Este proyecto busca mitigar riesgos documentando y extendiendo las capacidades de los servicios existentes.

### Requisitos
- Node.js: v14 o superior.
- MongoDB: Base de datos para gestionar usuarios y servicios.
- NPM: Administrador de dependencias.

### Configuración e Instalación
1. Clonar el repositorio:
git clone "URL_DEL_REPOSITORIO"
cd sum-api-main
2. Instalar dependencias:
npm install
3. Configurar las variables de entorno: Copiar el archivo .env.example como .env y editar los valores necesarios:
PORT=3000
, MONGO_URI = URI_DE_MONGODB
, SECRET = CLAVE_SECRETA
4. Iniciar el servidor:
npm start

### Uso del Proyecto
#### Rutas principales:

- Autenticación:
POST /user/login: Iniciar sesión.
POST /user/register: Registro de usuarios.
- Operaciones de Cursos:
GET /user/cursos: Listar cursos.
- Administración:
POST /admin/register_policy: Registro de políticas administrativas.

- Pruebas: Ejecutar pruebas automatizadas: npm test

- Claves API: Generar claves únicas para autenticación con generate_api_key.js.
  
Probablemente si estás por aquí necesitas crear un proyecto. No te preocupes estás cubierto con ello!

[Todo lo que necesitas está aquí](https://github.com/klatort/sum-api/wiki)

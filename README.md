# Proyecto E-commerce

Este proyecto de E-commerce es una aplicación web que permite a los usuarios explorar y comprar productos. La aplicación incluye funcionalidades como registro de usuarios, inicio de sesión, gestión de productos, carrito de compras y administración de usuarios.

## Requisitos previos

Antes de ejecutar la aplicación, asegúrate de tener instalados los siguientes componentes:

- Node.js
- MongoDB (o acceso a una instancia de MongoDB en la nube)
- npm (administrador de paquetes de Node.js)

## Configuración

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/darwinmou/PF.git
```

2. Navega a la carpeta del proyecto:

```bash
cd PF
```

3. Instala las dependencias:

```bash
npm install
```

4. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto. Ejemplo:

```env
DB_PASSWORD=tu_contraseña_secreta
JWT_SECRET="tu_clave_secreta_para_JWT"
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_contraseña_correo
OAUTH_CLIENTID=tu_client_id
OAUTH_CLIENT_SECRET=tu_client_secret
OAUTH_REFRESH_TOKEN=tu_refresh_token
ACCESS_TOKEN=tu_access_token
```

5. Ejecuta la aplicación:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:8080`.

## Endpoints

La aplicación cuenta con los siguientes endpoints:

**Rutas Disponibles**

- **Productos:**
  - Listar todos los productos: `GET /api/products`
  - Obtener un producto por ID: `GET /api/products/:pid`
  - Agregar un nuevo producto: `POST /api/products`
  - Actualizar un producto por ID: `PUT /api/products/:pid`
  - Eliminar un producto por ID: `DELETE /api/products/:pid`

- **Carritos de Compras:**
  - Crear un carrito vacío: `POST /api/carts`
  - Obtener un carrito por ID: `GET /api/carts/:cid`
  - Agregar un producto al carrito: `POST /api/carts/:cid/product/:pid`
  - Eliminar un producto del carrito: `DELETE /api/carts/:cid/product/:pid`
  - Actualizar un carrito por ID: `PUT /api/carts/:cid`
  - Actualizar la cantidad de un producto en el carrito: `PUT /api/carts/:cid/products/:pid`
  - Eliminar todos los productos del carrito: `DELETE /api/carts/:cid`
  - Comprar productos en el carrito: `POST /api/carts/:cid/purchase`

- **Usuarios:**
  - Listar todos los usuarios: `GET /api/users`
  - Obtener un usuario por ID: `GET /api/users/:id`
  - Eliminar usuarios inactivos: `DELETE /api/users/inactive`

- **Administrador:**
  - Confirmar actualización de un producto: `POST /admin/:id/edit`
  - Confirmar eliminación de un producto: `DELETE /admin/:id/delete`

- **Vistas:**
  - Página de inicio de sesión: `GET /login`
  - Iniciar sesión: `POST /login`
  - Cerrar sesión: `GET /logout`
  - Página de registro: `GET /register`
  - Registrar usuario: `POST /register`
  - Listar todos los productos: `GET /products`
  - Página de administrador: `GET /admin/dashboard`
  - Editar usuario (página de administrador): `GET /admin/users/:id/edit`
  - Confirmar eliminación de usuario (página de administrador): `GET /admin/users/:id/delete`

**Oportunidades de Mejora (TODO List):**

- **Estilos y Estética:**
  - Mejorar el diseño y la presentación visual de la aplicación.

- **Catalogo de productos:**
  - Implementar un sistema de administración de productos disponibles en el catalogo.

- **Sistema de Tickets:**
  - Implementar un sistema de tickets para realizar seguimiento de compras.

- **Persistencia del Carrito de Compras:**
  - Agregar persistencia al carrito de compras para mantener los productos incluso después de cerrar sesión o recargar la página.

- **Otros:**
  - Mejorar la usabilidad y la experiencia del usuario.
  - Implementar manejo de errores más robusto.
  - Refactorizar y organizar el código para una mejor mantenibilidad.
  - Agregar validaciones de seguridad, como correos válidos
  - Recuperación de contraseña

**Enlace a la Aplicación Desplegada:**
[PF en Railway](https://pf-production-darwinmou.up.railway.app/)

## Pruebas

Se incluye una carpeta de `screenshots` donde se pueden encontrar capturas de pantalla que evidencian pruebas de los distintos endpoints. Puedes explorar estas imágenes para verificar el funcionamiento de la aplicación.

¡Disfruta explorando y desarrollando tu proyecto de E-commerce!
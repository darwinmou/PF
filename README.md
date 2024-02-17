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

### Productos

- `GET /api/products`: Obtener la lista de productos.
- `POST /api/products`: Crear un nuevo producto.
- `GET /api/products/:productId`: Obtener detalles de un producto específico.
- `PUT /api/products/:productId`: Actualizar un producto.
- `DELETE /api/products/:productId`: Eliminar un producto.

### Usuarios

- `GET /api/users`: Obtener la lista de todos los usuarios.
- `GET /api/users/:userId`: Obtener detalles de un usuario específico.
- `DELETE /api/users/inactive`: Eliminar usuarios inactivos.

- `POST /api/register`: Registrar un nuevo usuario.
- `POST /api/login`: Iniciar sesión.
- `GET /api/logout`: Cerrar sesión.

### Carritos de Compra

- `POST /api/carts`: Crear un carrito vacío.
- `GET /api/carts/:cartId`: Obtener detalles de un carrito específico.
- `POST /api/carts/:cartId/product/:productId`: Agregar un producto al carrito.
- `DELETE /api/carts/:cartId/product/:productId`: Eliminar un producto del carrito.
- `PUT /api/carts/:cartId`: Actualizar el carrito.
- `PUT /api/carts/:cartId/products/:productId`: Actualizar la cantidad de un producto en el carrito.
- `DELETE /api/carts/:cartId`: Eliminar todos los productos del carrito.
- `POST /api/carts/:cartId/purchase`: Realizar la compra del carrito.

## Pruebas

Se incluye una carpeta de `screenshots` donde se pueden encontrar capturas de pantalla que evidencian pruebas de los distintos endpoints. Puedes explorar estas imágenes para verificar el funcionamiento de la aplicación.

¡Disfruta explorando y desarrollando tu proyecto de E-commerce!
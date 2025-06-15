# Documentación Completa: Catalog

## 1. Introducción

**Catalog** es una aplicación web full-stack diseñada para gestionar un catálogo de productos. Consiste en un backend robusto construido con NestJS que expone una API REST, un frontend interactivo desarrollado con Vue.js, y una base de datos MongoDB.

La aplicación está completamente dockerizada para garantizar un entorno de desarrollo y despliegue consistente y sencillo. Incluye un sistema de autenticación y autorización basado en roles utilizando Auth0.

---

## 2. Arquitectura de la Aplicación

La aplicación sigue una arquitectura de microservicios desacoplados, orquestados por Docker Compose:

```text
+--------------------------+      +--------------------------+      +--------------------------+
|                          |      |                          |      |                          |
|  Frontend (Vue.js)       |----->|    Backend (NestJS API)  |----->|   Database (MongoDB)     |
|  Servido por Nginx       |      |                          |      |                          |
|                          |      |                          |      |                          |
+--------------------------+      +--------------------------+      +--------------------------+
```

* **Frontend**: Es la cara visible para el usuario. Se encarga de la interfaz y la interacción. Realiza peticiones HTTP a la API del backend.
* **Backend**: Es el cerebro de la aplicación. Maneja la lógica de negocio, procesa los datos, se conecta a la base de datos y asegura los endpoints.
* **Database**: Persiste toda la información de la aplicación.

---

## 3. Backend

El backend es una API RESTful construida sobre el framework **NestJS**, que proporciona una arquitectura modular y escalable.

### 3.1. Tecnologías Utilizadas

* **Node.js (v22)**: Entorno de ejecución de JavaScript.
* **NestJS**: Framework progresivo de Node.js para construir aplicaciones eficientes y escalables.
* **TypeScript**: Superset de JavaScript que añade tipado estático.
* **MongoDB**: Base de datos NoSQL orientada a documentos.
* **Mongoose**: ODM (Object Data Modeling) para modelar los datos de la aplicación para MongoDB.
* **Auth0**: Para la gestión de autenticación (JWT) y autorización basada en roles.

### 3.2. Endpoints de la API

Todos los endpoints están prefijados con `/api`. La autorización se gestiona mediante tokens JWT proporcionados por Auth0.

#### Módulo `catalogs`

Ruta base: `/api/catalogs`

---

**1. Obtener todos los productos del catálogo**

* **Método**: `GET`
* **Ruta**: `/api/catalogs`
* **Descripción**: Devuelve un array con todos los productos existentes en la base de datos.
* **Protección**: Requiere un token de autenticación válido.
* **Ejemplo de Petición (cURL)**:
    ```bash
    curl -X GET http://localhost:3000/api/catalogs \
      -H "Authorization: Bearer <TU_TOKEN_JWT>"
    ```
* **Ejemplo de Respuesta (200 OK)**:
    ```json
    [
      {
        "_id": "60d0fe4f5b3f8b8d5c9e4a3b",
        "name": "Camiseta de Lino Blanca",
        "description": "Una camiseta fresca y elegante para el verano, 100% lino.",
        "price": 29.99,
        "isActive": true,
        "createdAt": "2025-06-15T22:00:00.000Z",
        "updatedAt": "2025-06-15T22:00:00.000Z"
      }
    ]
    ```

---

**2. Obtener un producto por su ID**

* **Método**: `GET`
* **Ruta**: `/api/catalogs/:id`
* **Descripción**: Devuelve un único producto que coincida con el ID proporcionado.
* **Protección**: Requiere un token de autenticación válido.
* **Ejemplo de Petición (cURL)**:
    ```bash
    curl -X GET http://localhost:3000/api/catalogs/60d0fe4f5b3f8b8d5c9e4a3b \
      -H "Authorization: Bearer <TU_TOKEN_JWT>"
    ```

---

**3. Crear un nuevo producto**

* **Método**: `POST`
* **Ruta**: `/api/catalogs`
* **Descripción**: Crea un nuevo producto en la base de datos.
* **Protección**: Requiere token de autenticación y el rol `admin`.
* **Ejemplo de Petición (cURL)**:
    ```bash
    curl -X POST http://localhost:3000/api/catalogs \
      -H "Authorization: Bearer <TU_TOKEN_JWT_ADMIN>" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Nuevo Producto de Prueba",
        "description": "Descripción del producto.",
        "price": 99.99,
        "isActive": true
      }'
    ```

---

**4. Actualizar un producto existente**

* **Método**: `PATCH`
* **Ruta**: `/api/catalogs/:id`
* **Descripción**: Actualiza parcialmente un producto existente.
* **Protección**: Requiere token de autenticación y el rol `admin`.
* **Ejemplo de Petición (cURL)**:
    ```bash
    curl -X PATCH http://localhost:3000/api/catalogs/60d0ff1f5b3f8b8d5c9e4a3c \
      -H "Authorization: Bearer <TU_TOKEN_JWT_ADMIN>" \
      -H "Content-Type: application/json" \
      -d '{
        "price": 89.99
      }'
    ```

---

**5. Eliminar un producto**

* **Método**: `DELETE`
* **Ruta**: `/api/catalogs/:id`
* **Descripción**: Elimina un producto de la base de datos.
* **Protección**: Requiere token de autenticación y el rol `admin`.
* **Ejemplo de Petición (cURL)**:
    ```bash
    curl -X DELETE http://localhost:3000/api/catalogs/60d0ff1f5b3f8b8d5c9e4a3c \
      -H "Authorization: Bearer <TU_TOKEN_JWT_ADMIN>"
    ```

---

## 4. Frontend

El frontend es una Single Page Application (SPA) construida con **Vue.js**, diseñada para ser reactiva, intuitiva y eficiente.

### 4.1. Tecnologías Utilizadas

* **Vue.js (v3)**: Framework progresivo de JavaScript para construir interfaces de usuario.
* **Vue Router**: Para la gestión de rutas del lado del cliente.
* **Pinia**: Para la gestión de estado global de la aplicación.
* **Vuetify**: Framework de componentes UI basado en Material Design.
* **Axios**: Cliente HTTP para realizar peticiones a la API del backend.
* **Auth0 Vue SDK**: Para integrar la autenticación y gestión de tokens.
* **Nginx**: Servidor web ligero utilizado para servir los archivos estáticos de producción y como proxy inverso para la API.

### 4.2. Estructura de Vistas y Componentes

La estructura principal del código se encuentra en `frontend/src`:

* **`main.js`**: Punto de entrada de la aplicación. Aquí se inicializan Vue, Vuetify, Pinia, el Router y Auth0.
* **`views/`**: Contienen las "páginas" principales de la aplicación.
* **`components/`**: Contienen componentes reutilizables que forman las vistas.
* **`stores/`**: Gestión de estado con Pinia, principalmente `catalogStore.js`.
* **`router/`**: Define las rutas y sus guardias de navegación (`authGuard.js`).
* **`plugins/`**: Configuración de plugins como Axios (`api.js`) y Auth0.

---

## 5. Guía de Instalación y Despliegue Local

### 5.1. Requisitos Previos

* **Docker**: [Instalar Docker](https://docs.docker.com/get-docker/)
* **Docker Compose**: Generalmente viene incluido con Docker Desktop.

### 5.2. Pasos para Levantar el Entorno

1.  **Clonar el Repositorio**.
2.  **Crear el archivo de configuración `.env`** en la raíz del proyecto.
3.  **Construir las imágenes de Docker**:
    ```bash
    docker-compose build
    ```
4.  **Levantar los servicios**:
    ```bash
    docker-compose up -d
    ```

### 5.3. Entorno con Datos de Muestra

Gracias al script `mongo-init/seed.js`, la aplicación se iniciará con **15 productos de ejemplo**. Para reiniciar los datos, ejecuta `docker-compose down -v` antes de levantar los servicios de nuevo.

### 5.5. Puntos de Acceso

* **Aplicación Frontend**: `http://localhost:8080`
* **API Backend**: `http://localhost:3000`

---

## 6. Archivos de Configuración

#### `docker-compose.yml`

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VUE_APP_AUTH0_DOMAIN=${VUE_APP_AUTH0_DOMAIN}
        - VUE_APP_AUTH0_CLIENT_ID=${VUE_APP_AUTH0_CLIENT_ID}
        - VUE_APP_AUTH0_AUDIENCE=${VUE_APP_AUTH0_AUDIENCE}
    container_name: nexus-frontend
    ports:
      - "8080:80"
    networks:
      - nexus-network
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nexus-backend
    ports:
      - "3000:3000"
    networks:
      - nexus-network
    env_file:
      - ./.env
    depends_on:
      - database
    restart: unless-stopped

  database:
    image: mongo:latest
    container_name: nexus-database
    ports:
      - "27017:27017"
    networks:
      - nexus-network
    env_file:
      - ./.env
    volumes:
      - mongo-data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    restart: unless-stopped

networks:
  nexus-network:
    driver: bridge

volumes:
  mongo-data:
    driver: local
```

#### `.env` (Ejemplo)

```env
# Variables para la Base de Datos
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=rootpass
MONGO_INITDB_DATABASE=catalog-manager

# Variables para el Backend
MONGO_URI=mongodb://root:rootpass@database:27017/catalog-manager?authSource=admin
AUTH0_ISSUER_URL=https://YOUR_AUTH0_DOMAIN/
AUTH0_AUDIENCE=https://YOUR_AUTH0_AUDIENCE

# Variables para el Frontend (pasadas en tiempo de build)
VUE_APP_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VUE_APP_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VUE_APP_AUTH0_AUDIENCE=https://YOUR_AUTH0_AUDIENCE
```

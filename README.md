# Proyecto de Gestión de Catálogos - Backend (GraphQL)

Este directorio contiene el código fuente para la API de backend, construida con NestJS y GraphQL.

### Diferencias Clave con la Versión REST
- Se reemplazaron los Controladores por Resolvers.
- Hay un único endpoint `/graphql` para todas las peticiones.
- Las DTOs se han reemplazado por Tipos de Input de GraphQL para validación.

### Requisitos Previos
- Node.js (v18 o superior)
- Docker y Docker Compose
- Una cuenta de Auth0 para la autenticación
- Una instancia de MongoDB (puede ser local o en la nube)

### Configuración de Roles en Auth0
El procedimiento es el mismo que para la API REST. Asegúrate de tener una Action que añada los roles a tu Access Token.

### Cómo Interactuar con la API GraphQL

Una vez que la aplicación esté corriendo, puedes usar el **GraphQL Playground**, una herramienta interactiva que se habilita automáticamente en modo de desarrollo.

1.  Navega a `http://localhost:3000/graphql`.
2.  Para peticiones protegidas, necesitas pasar tu token de Auth0. En el Playground, ve a la sección "HTTP HEADERS" abajo a la izquierda y añade:
    ```json
    {
      "Authorization": "Bearer TU_ACCESS_TOKEN_DE_AUTH0"
    }
    ```
3.  Ahora puedes ejecutar Queries y Mutations.

#### Ejemplo de Query (para obtener todos los catálogos)
```graphql
query {
  catalogs {
    _id
    name
    price
    isActive
  }
}
```

#### Ejemplo de Mutation (para crear un catálogo - requiere rol de admin)
```graphql
mutation {
  createCatalog(createCatalogInput: {
    name: "Nuevo Producto desde GraphQL",
    price: 99.99,
    description: "Una descripción"
  }) {
    _id
    name
    description
    price
  }
}
```
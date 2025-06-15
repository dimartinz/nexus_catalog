// mongo-init/seed.js

console.log("Iniciando el script de seeding (15 productos)...");

// El entrypoint de Docker nos conecta a la base de datos especificada
// en la variable de entorno MONGO_INITDB_DATABASE.

db.createCollection('catalogs', {});

db.catalogs.insertMany([
  {
    "name": "Camiseta de Lino Blanca",
    "description": "Una camiseta fresca y elegante para el verano, 100% lino.",
    "price": 29.99,
    "isActive": true
  },
  {
    "name": "Abrigo de Lana Negro",
    "description": "Abrigo de alta calidad para mantener el calor en invierno.",
    "price": 199.99,
    "isActive": true
  },
  {
    "name": "Auriculares Inalámbricos Pro",
    "description": "Sonido de alta fidelidad sin cables, con cancelación de ruido.",
    "price": 149.90,
    "isActive": true
  },
  {
    "name": "Sandalias de Cuero Marrón",
    "description": "Sandalias hechas a mano, de cuero genuino.",
    "price": 79.90,
    "isActive": false
  },
  {
    "name": "Jeans Clásicos Azules",
    "description": "Pantalones de mezclilla de corte recto, duraderos y cómodos.",
    "price": 59.95,
    "isActive": true
  },
  {
    "name": "Reloj Inteligente V2",
    "description": "Monitoriza tu actividad física, notificaciones y más.",
    "price": 250.00,
    "isActive": true
  },
  {
    "name": "Mochila para Laptop",
    "description": "Resistente al agua, con compartimento acolchado para portátiles de 15\".",
    "price": 45.00,
    "isActive": true
  },
  {
    "name": "Zapatillas Urbanas Negras",
    "description": "Zapatillas cómodas y con estilo para el día a día.",
    "price": 85.50,
    "isActive": true
  },
  {
    "name": "Lámpara de Escritorio LED",
    "description": "Luz ajustable con brazo flexible, ideal para leer o trabajar.",
    "price": 35.20,
    "isActive": true
  },
  {
    "name": "Botella de Agua Térmica",
    "description": "Mantiene tus bebidas frías por 24 horas o calientes por 12 horas.",
    "price": 24.99,
    "isActive": true
  },
  {
    "name": "Sudadera con Capucha Gris",
    "description": "Sudadera de algodón suave, perfecta para un look casual.",
    "price": 49.99,
    "isActive": true
  },
  {
    "name": "Teclado Mecánico RGB",
    "description": "Teclado para gaming con switches mecánicos y retroiluminación RGB.",
    "price": 120.00,
    "isActive": true
  },
  {
    "name": "Gafas de Sol Aviador",
    "description": "Protección UV400 con un diseño clásico y atemporal.",
    "price": 65.00,
    "isActive": false
  },
  {
    "name": "Cinturón de Cuero Reversible",
    "description": "Un cinturón, dos colores. Hecho de cuero genuino.",
    "price": 39.95,
    "isActive": true
  },
  {
    "name": "Taza de Café de Cerámica",
    "description": "Taza de 350ml con diseño minimalista.",
    "price": 15.00,
    "isActive": true
  }
]);

console.log("¡15 productos de muestra insertados correctamente!");
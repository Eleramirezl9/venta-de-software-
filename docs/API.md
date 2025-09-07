# Documentación de la API - Sistema de Venta de Software

## Tabla de Contenidos

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Endpoints de Autenticación](#endpoints-de-autenticación)
4. [Endpoints de Productos](#endpoints-de-productos)
5. [Endpoints de Carrito](#endpoints-de-carrito)
6. [Códigos de Estado](#códigos-de-estado)
7. [Ejemplos de Uso](#ejemplos-de-uso)
8. [Colección Postman](#colección-postman)

## Información General

### URL Base
```
http://localhost:3000/api
```

### Formato de Respuesta
Todas las respuestas siguen el siguiente formato estándar:

```json
{
  "success": true,
  "data": {
    // Datos específicos del endpoint
  },
  "message": "Mensaje descriptivo",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Formato de Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": {}
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Headers Requeridos
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (para endpoints protegidos)
```

## Autenticación

### Sistema JWT
La API utiliza JSON Web Tokens (JWT) para autenticación. Los tokens deben incluirse en el header `Authorization` con el prefijo `Bearer`.

### Flujo de Autenticación
1. Registrar usuario o iniciar sesión
2. Recibir token JWT en la respuesta
3. Incluir token en requests subsecuentes
4. El token expira según configuración (por defecto 7 días)

### Ejemplo de Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints de Autenticación

### POST /auth/register
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

**Validaciones:**
- `name`: Requerido, mínimo 2 caracteres
- `email`: Requerido, formato válido, único
- `password`: Requerido, mínimo 6 caracteres

**Errores Posibles:**
- `400`: Datos de entrada inválidos
- `409`: Email ya registrado

---

### POST /auth/login
Autentica un usuario existente.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "createdAt": "2024-01-01T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Inicio de sesión exitoso"
}
```

**Errores Posibles:**
- `400`: Datos de entrada inválidos
- `401`: Credenciales incorrectas
- `404`: Usuario no encontrado

---

### POST /auth/recover-password
Inicia el proceso de recuperación de contraseña.

**Request Body:**
```json
{
  "email": "juan@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {},
  "message": "Si el email existe, recibirás instrucciones de recuperación"
}
```

**Nota:** Por seguridad, siempre retorna éxito independientemente de si el email existe.

## Endpoints de Productos

### GET /products
Obtiene la lista de productos con paginación y filtros opcionales.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 50)
- `category` (opcional): Filtrar por categoría
- `isFree` (opcional): Filtrar productos gratuitos (true/false)
- `search` (opcional): Búsqueda por nombre o descripción
- `minPrice` (opcional): Precio mínimo
- `maxPrice` (opcional): Precio máximo

**Ejemplo Request:**
```
GET /api/products?page=1&limit=10&category=Productividad&search=office
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Microsoft Office 365",
        "description": "Suite completa de productividad con Word, Excel, PowerPoint y más",
        "price": 99.99,
        "category": "Productividad",
        "version": "2024",
        "compatibility": "Windows, macOS",
        "isFree": false,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "category": "Productividad",
      "search": "office"
    }
  },
  "message": "Productos obtenidos exitosamente"
}
```

---

### GET /products/:id
Obtiene los detalles de un producto específico.

**Path Parameters:**
- `id`: ID del producto

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Microsoft Office 365",
      "description": "Suite completa de productividad con Word, Excel, PowerPoint y más. Incluye Word, Excel, PowerPoint, Outlook, OneNote, Access y Publisher. Perfecto para profesionales y empresas que necesitan herramientas de productividad confiables y actualizadas.",
      "price": 99.99,
      "category": "Productividad",
      "version": "2024",
      "compatibility": "Windows, macOS",
      "isFree": false,
      "features": [
        "Word - Procesador de textos avanzado",
        "Excel - Hojas de cálculo con análisis de datos",
        "PowerPoint - Presentaciones profesionales",
        "Outlook - Cliente de correo electrónico",
        "OneDrive - 1TB de almacenamiento en la nube"
      ],
      "systemRequirements": {
        "os": "Windows 10 o macOS 10.14",
        "ram": "4GB",
        "storage": "4GB disponible"
      },
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Producto obtenido exitosamente"
}
```

**Errores Posibles:**
- `404`: Producto no encontrado

---

### GET /products/categories
Obtiene la lista de categorías disponibles.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Productividad",
        "count": 15,
        "description": "Software para mejorar la productividad personal y empresarial"
      },
      {
        "name": "Diseño",
        "count": 8,
        "description": "Herramientas de diseño gráfico y multimedia"
      },
      {
        "name": "Desarrollo",
        "count": 12,
        "description": "IDEs, editores y herramientas de desarrollo"
      }
    ]
  },
  "message": "Categorías obtenidas exitosamente"
}
```

## Endpoints de Carrito

### GET /cart
Obtiene el carrito del usuario autenticado.

**Headers Requeridos:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": 1,
      "userId": 1,
      "items": [
        {
          "id": 1,
          "productId": 1,
          "quantity": 1,
          "subtotal": 99.99,
          "product": {
            "id": 1,
            "name": "Microsoft Office 365",
            "price": 99.99,
            "category": "Productividad",
            "isFree": false
          }
        }
      ],
      "totalItems": 1,
      "total": 99.99,
      "isEmpty": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  },
  "message": "Carrito obtenido exitosamente"
}
```

**Errores Posibles:**
- `401`: Token no válido o expirado

---

### POST /cart/items
Agrega un producto al carrito.

**Headers Requeridos:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": 2,
      "productId": 1,
      "quantity": 2,
      "subtotal": 199.98,
      "product": {
        "id": 1,
        "name": "Microsoft Office 365",
        "price": 99.99
      }
    },
    "cart": {
      "totalItems": 3,
      "total": 299.97
    }
  },
  "message": "Producto agregado al carrito"
}
```

**Validaciones:**
- `productId`: Requerido, debe existir
- `quantity`: Requerido, mínimo 1, máximo 99

**Errores Posibles:**
- `400`: Datos inválidos
- `401`: No autenticado
- `404`: Producto no encontrado

---

### PUT /cart/items/:id
Actualiza la cantidad de un item en el carrito.

**Headers Requeridos:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id`: ID del item en el carrito

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "item": {
      "id": 2,
      "productId": 1,
      "quantity": 3,
      "subtotal": 299.97
    },
    "cart": {
      "totalItems": 4,
      "total": 399.96
    }
  },
  "message": "Cantidad actualizada"
}
```

**Errores Posibles:**
- `400`: Cantidad inválida
- `401`: No autenticado
- `403`: Item no pertenece al usuario
- `404`: Item no encontrado

---

### DELETE /cart/items/:id
Elimina un item del carrito.

**Headers Requeridos:**
```
Authorization: Bearer <jwt_token>
```

**Path Parameters:**
- `id`: ID del item en el carrito

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "totalItems": 1,
      "total": 99.99
    }
  },
  "message": "Producto eliminado del carrito"
}
```

**Errores Posibles:**
- `401`: No autenticado
- `403`: Item no pertenece al usuario
- `404`: Item no encontrado

---

### DELETE /cart
Vacía completamente el carrito del usuario.

**Headers Requeridos:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "cart": {
      "totalItems": 0,
      "total": 0,
      "isEmpty": true
    }
  },
  "message": "Carrito vaciado exitosamente"
}
```

## Códigos de Estado

### Códigos de Éxito
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Operación exitosa sin contenido de respuesta

### Códigos de Error del Cliente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Autenticación requerida o token inválido
- `403 Forbidden`: Acceso denegado
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto con el estado actual (ej: email duplicado)
- `422 Unprocessable Entity`: Datos válidos pero lógicamente incorrectos

### Códigos de Error del Servidor
- `500 Internal Server Error`: Error interno del servidor
- `503 Service Unavailable`: Servicio temporalmente no disponible

## Ejemplos de Uso

### Flujo Completo de Compra

#### 1. Registro de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "123456"
  }'
```

#### 2. Obtener Productos
```bash
curl -X GET "http://localhost:3000/api/products?category=Productividad&limit=5" \
  -H "Content-Type: application/json"
```

#### 3. Agregar al Carrito
```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 1
  }'
```

#### 4. Ver Carrito
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Búsqueda Avanzada de Productos
```bash
curl -X GET "http://localhost:3000/api/products?search=office&minPrice=50&maxPrice=200&category=Productividad" \
  -H "Content-Type: application/json"
```

### Manejo de Errores
```javascript
// Ejemplo en JavaScript
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error.message);
    }
    
    // Guardar token
    localStorage.setItem('token', data.data.token);
    return data.data.user;
    
  } catch (error) {
    console.error('Error en login:', error.message);
    throw error;
  }
}
```

## Colección Postman

### Configuración de Entorno
Crea un entorno en Postman con las siguientes variables:

```json
{
  "baseUrl": "http://localhost:3000/api",
  "token": "{{jwt_token}}"
}
```

### Colección de Requests

#### Auth Collection
1. **Register User**
   - Method: POST
   - URL: `{{baseUrl}}/auth/register`
   - Body: JSON con name, email, password

2. **Login User**
   - Method: POST
   - URL: `{{baseUrl}}/auth/login`
   - Body: JSON con email, password
   - Tests: Guardar token en variable de entorno

#### Products Collection
1. **Get All Products**
   - Method: GET
   - URL: `{{baseUrl}}/products`

2. **Get Product by ID**
   - Method: GET
   - URL: `{{baseUrl}}/products/1`

3. **Search Products**
   - Method: GET
   - URL: `{{baseUrl}}/products?search=office&category=Productividad`

#### Cart Collection
1. **Get Cart**
   - Method: GET
   - URL: `{{baseUrl}}/cart`
   - Headers: Authorization: Bearer {{token}}

2. **Add to Cart**
   - Method: POST
   - URL: `{{baseUrl}}/cart/items`
   - Headers: Authorization: Bearer {{token}}
   - Body: JSON con productId, quantity

3. **Update Cart Item**
   - Method: PUT
   - URL: `{{baseUrl}}/cart/items/1`
   - Headers: Authorization: Bearer {{token}}
   - Body: JSON con quantity

4. **Remove from Cart**
   - Method: DELETE
   - URL: `{{baseUrl}}/cart/items/1`
   - Headers: Authorization: Bearer {{token}}

### Scripts de Postman

#### Pre-request Script para Autenticación
```javascript
// Agregar token automáticamente si existe
const token = pm.environment.get("token");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + token
    });
}
```

#### Test Script para Login
```javascript
// Guardar token después del login exitoso
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    if (responseJson.success && responseJson.data.token) {
        pm.environment.set("token", responseJson.data.token);
        console.log("Token guardado:", responseJson.data.token);
    }
}

// Verificar estructura de respuesta
pm.test("Response has correct structure", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property("success");
    pm.expect(responseJson).to.have.property("data");
    pm.expect(responseJson).to.have.property("message");
});
```

## Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **Límite General**: 100 requests por 15 minutos por IP
- **Límite de Login**: 5 intentos por 15 minutos por IP
- **Límite de Registro**: 3 registros por hora por IP

### Headers de Rate Limit
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Versionado de API

La API sigue versionado semántico:
- **Versión Actual**: v1.0.0
- **URL con Versión**: `/api/v1/` (opcional)
- **Header de Versión**: `API-Version: 1.0`

## Documentación Interactiva

### Swagger UI
Accede a la documentación interactiva en:
```
http://localhost:3000/api-docs
```

### OpenAPI Specification
El archivo OpenAPI está disponible en:
```
http://localhost:3000/api-docs.json
```

---

Esta documentación proporciona toda la información necesaria para integrar y utilizar la API del Sistema de Venta de Software. Para más detalles sobre implementación específica, consulta el código fuente en la carpeta `backend/src/`.


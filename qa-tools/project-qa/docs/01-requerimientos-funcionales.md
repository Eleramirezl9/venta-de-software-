# Requerimientos Funcionales del Sistema
## CISNET - Sistema de Venta de Software

**Fecha**: 06 de Septiembre de 2025  
**Analista QA**: Eddy Alexander Ramirez Lorenzana  
**Versión**: 1.0

---

## 1. Requerimientos de Autenticación

### RF-001: Registro de Usuario
**Descripción**: El sistema debe permitir el registro de nuevos usuarios con información básica.
**Criterios de Aceptación**:
- El usuario debe proporcionar: email, contraseña, confirmación de contraseña y nombre
- El email debe ser único en el sistema
- La contraseña debe tener mínimo 6 caracteres
- Se debe validar que las contraseñas coincidan
- El sistema debe mostrar mensaje de éxito al completar el registro

### RF-002: Inicio de Sesión (Login)
**Descripción**: El sistema debe permitir a usuarios registrados iniciar sesión.
**Criterios de Aceptación**:
- El usuario debe ingresar email y contraseña válidos
- El sistema debe validar credenciales contra la base de datos
- Se debe generar un token JWT válido
- Redirección automática al dashboard después del login exitoso
- Manejo de errores para credenciales incorrectas

### RF-003: Cierre de Sesión (Logout)
**Descripción**: El sistema debe permitir a usuarios autenticados cerrar sesión.
**Criterios de Aceptación**:
- El token de sesión debe ser invalidado
- Redirección automática a la página de login
- Limpiar datos de sesión del navegador

### RF-004: Recuperación de Contraseña
**Descripción**: El sistema debe permitir la recuperación de contraseñas olvidadas.
**Criterios de Aceptación**:
- Usuario ingresa email registrado
- Sistema valida que el email existe
- Se debe mostrar confirmación de solicitud enviada
- Funcionalidad básica de reset implementada

## 2. Requerimientos de Gestión de Productos

### RF-005: Visualización de Catálogo de Productos
**Descripción**: El sistema debe mostrar los productos disponibles para la venta.
**Criterios de Aceptación**:
- Mostrar mínimo 6 productos en la página principal
- Cada producto debe mostrar: nombre, precio, imagen, categoría
- Los productos deben cargarse desde la base de datos
- Implementar paginación si hay más de 12 productos

### RF-006: Búsqueda de Productos
**Descripción**: El sistema debe permitir buscar productos por diferentes criterios.
**Criterios de Aceptación**:
- Búsqueda por nombre de producto
- Filtros por categoría disponibles
- Filtros por rango de precios
- Resultados deben mostrarse en tiempo real
- Manejo de casos sin resultados

### RF-007: Detalle de Producto
**Descripción**: El sistema debe mostrar información detallada de cada producto.
**Criterios de Aceptación**:
- Vista detallada accesible desde el catálogo
- Mostrar toda la información del producto
- Opción para agregar al carrito desde la vista de detalle
- Navegación de regreso al catálogo

## 3. Requerimientos de Carrito de Compras

### RF-008: Agregar Productos al Carrito
**Descripción**: Los usuarios autenticados deben poder agregar productos a su carrito.
**Criterios de Aceptación**:
- Solo usuarios autenticados pueden agregar al carrito
- Validar disponibilidad del producto
- Actualizar contador de items en el header
- Confirmación visual de producto agregado

### RF-009: Gestionar Carrito de Compras
**Descripción**: El sistema debe permitir ver y modificar el contenido del carrito.
**Criterios de Aceptación**:
- Visualizar todos los productos agregados
- Modificar cantidades de productos
- Eliminar productos individuales del carrito
- Calcular total automáticamente
- Opción para vaciar carrito completo

### RF-010: Persistencia del Carrito
**Descripción**: El carrito debe mantenerse entre sesiones del usuario.
**Criterios de Aceptación**:
- Carrito se guarda al agregar productos
- Carrito se restaura al iniciar sesión
- Sincronización entre diferentes dispositivos del mismo usuario

## 4. Requerimientos de Navegación y UI

### RF-011: Navegación Principal
**Descripción**: El sistema debe proporcionar navegación intuitiva entre secciones.
**Criterios de Aceptación**:
- Header con logo, menú principal y opciones de usuario
- Enlaces a: Inicio, Productos, Carrito (si está autenticado)
- Menú responsive para dispositivos móviles
- Indicadores visuales de sección activa

### RF-012: Gestión de Perfil de Usuario
**Descripción**: Los usuarios autenticados deben poder ver su información de perfil.
**Criterios de Aceptación**:
- Acceso a perfil desde menú de usuario
- Mostrar información básica del usuario
- Opción para ver historial de pedidos (Mis Pedidos)
- Opciones de configuración de cuenta

## 5. Requerimientos del Sistema

### RF-013: Health Check del Sistema
**Descripción**: El sistema debe proporcionar endpoints para verificar estado de salud.
**Criterios de Aceptación**:
- Endpoint `/health` disponible
- Respuesta con estado del sistema y timestamp
- Información de tiempo de ejecución (uptime)
- Estado de conexión a base de datos

### RF-014: Documentación de API
**Descripción**: El sistema debe proporcionar documentación interactiva de la API.
**Criterios de Aceptación**:
- Documentación Swagger disponible en `/api-docs`
- Descripción de todos los endpoints disponibles
- Ejemplos de request/response
- Información de autenticación requerida

### RF-015: Manejo de Errores
**Descripción**: El sistema debe manejar errores de manera consistente y amigable.
**Criterios de Aceptación**:
- Mensajes de error claros y específicos
- Códigos de estado HTTP apropiados
- Validación de datos de entrada
- Logging de errores para debugging

---

## Resumen
- **Total de Requerimientos Funcionales**: 15
- **Módulos Cubiertos**: Autenticación, Productos, Carrito, UI/Navegación, Sistema
- **Prioridad Alta**: RF-001, RF-002, RF-005, RF-008, RF-009
- **Prioridad Media**: RF-003, RF-006, RF-007, RF-010, RF-011, RF-012
- **Prioridad Baja**: RF-004, RF-013, RF-014, RF-015

Este documento servirá como base para el diseño de casos de prueba y la planificación de las actividades de QA.
# Casos de Prueba - Sistema CISNET
## Sistema de Venta de Software

**Fecha**: 06 de Septiembre de 2025  
**Tester**: Eddy Alexander Ramirez Lorenzana  
**Versión**: 1.0

---

## TC-001: Registro de Usuario Exitoso

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-001 |
| **Requerimiento Asociado** | RF-001 |
| **Módulo** | Autenticación |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Navegar a la página de registro (`/register`)
2. Ingresar email válido: `test@example.com`
3. Ingresar nombre: `Usuario Test`
4. Ingresar contraseña: `123456`
5. Confirmar contraseña: `123456`
6. Hacer clic en "Registrarse"

### Datos de Entrada:
- **Email**: test@example.com
- **Nombre**: Usuario Test
- **Contraseña**: 123456
- **Confirmar Contraseña**: 123456

### Resultado Esperado:
- Usuario se registra exitosamente
- Mensaje de confirmación aparece
- Usuario es redirigido a la página de login
- Datos se guardan en la base de datos

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-002: Login de Usuario Válido

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-002 |
| **Requerimiento Asociado** | RF-002 |
| **Módulo** | Autenticación |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Navegar a la página de login (`/login`)
2. Ingresar email: `demo@example.com`
3. Ingresar contraseña: `123456`
4. Hacer clic en "Iniciar Sesión"

### Datos de Entrada:
- **Email**: demo@example.com
- **Contraseña**: 123456

### Resultado Esperado:
- Login exitoso
- Token JWT generado
- Redirección a página principal (`/`)
- Header muestra opciones de usuario autenticado
- Menú de usuario disponible

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-003: Login con Credenciales Inválidas

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-003 |
| **Requerimiento Asociado** | RF-002 |
| **Módulo** | Autenticación |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Negativa |

### Pasos a Seguir:
1. Navegar a la página de login (`/login`)
2. Ingresar email: `usuario@inexistente.com`
3. Ingresar contraseña: `wrongpassword`
4. Hacer clic en "Iniciar Sesión"

### Datos de Entrada:
- **Email**: usuario@inexistente.com
- **Contraseña**: wrongpassword

### Resultado Esperado:
- Login falla
- Mensaje de error: "Credenciales inválidas"
- Usuario permanece en página de login
- No se genera token
- No hay redirección

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-004: Visualización del Catálogo de Productos

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-004 |
| **Requerimiento Asociado** | RF-005 |
| **Módulo** | Productos |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Navegar a la página principal (`/`)
2. Verificar que se muestren productos
3. Contar cantidad de productos mostrados
4. Verificar información de cada producto

### Datos de Entrada:
- **URL**: http://localhost:5176/

### Resultado Esperado:
- Se muestran mínimo 6 productos
- Cada producto muestra: nombre, precio, imagen
- Productos se cargan correctamente desde la API
- No hay errores de carga

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-005: Búsqueda de Productos

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-005 |
| **Requerimiento Asociado** | RF-006 |
| **Módulo** | Productos |
| **Prioridad** | Media |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Navegar a la página de productos (`/products`)
2. Ingresar término de búsqueda en el campo de búsqueda: `Microsoft`
3. Presionar Enter o hacer clic en buscar
4. Verificar resultados

### Datos de Entrada:
- **Término de búsqueda**: Microsoft

### Resultado Esperado:
- Resultados filtrados mostrados
- Solo productos relacionados con "Microsoft" aparecen
- Resultados se actualizan dinámicamente
- No hay errores en la búsqueda

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-006: Agregar Producto al Carrito (Usuario Autenticado)

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-006 |
| **Requerimiento Asociado** | RF-008 |
| **Módulo** | Carrito |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Positiva |

### Precondición:
- Usuario debe estar autenticado (usar credenciales de TC-002)

### Pasos a Seguir:
1. Navegar a la página principal después del login
2. Seleccionar un producto
3. Hacer clic en "Agregar al Carrito"
4. Verificar contador en el header
5. Navegar al carrito (`/cart`)

### Datos de Entrada:
- **Producto**: Cualquier producto disponible
- **Usuario**: demo@example.com (autenticado)

### Resultado Esperado:
- Producto se agrega al carrito
- Contador de carrito se actualiza (+1)
- Mensaje de confirmación aparece
- Producto visible en página de carrito

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-007: Agregar Producto al Carrito (Usuario No Autenticado)

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-007 |
| **Requerimiento Asociado** | RF-008 |
| **Módulo** | Carrito |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Negativa |

### Precondición:
- Usuario NO debe estar autenticado (logout si es necesario)

### Pasos a Seguir:
1. Navegar a la página principal sin autenticarse
2. Seleccionar un producto
3. Intentar hacer clic en "Agregar al Carrito"

### Datos de Entrada:
- **Usuario**: No autenticado

### Resultado Esperado:
- Acción no permitida
- Redirección a página de login
- O mensaje indicando necesidad de autenticarse
- Producto NO se agrega al carrito

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-008: Gestión de Cantidades en el Carrito

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-008 |
| **Requerimiento Asociado** | RF-009 |
| **Módulo** | Carrito |
| **Prioridad** | Alta |
| **Tipo** | Funcional - Positiva |

### Precondición:
- Usuario autenticado con productos en el carrito

### Pasos a Seguir:
1. Navegar al carrito (`/cart`)
2. Localizar un producto en el carrito
3. Incrementar cantidad usando el botón "+"
4. Verificar actualización del total
5. Decrementar cantidad usando el botón "-"
6. Verificar actualización del total

### Datos de Entrada:
- **Acción**: Modificar cantidades (+1, -1)

### Resultado Esperado:
- Cantidades se actualizan correctamente
- Total se recalcula automáticamente
- Cambios se reflejan inmediatamente
- No hay errores de cálculo

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-009: Eliminar Producto del Carrito

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-009 |
| **Requerimiento Asociado** | RF-009 |
| **Módulo** | Carrito |
| **Prioridad** | Media |
| **Tipo** | Funcional - Positiva |

### Precondición:
- Usuario autenticado con múltiples productos en el carrito

### Pasos a Seguir:
1. Navegar al carrito (`/cart`)
2. Localizar un producto específico
3. Hacer clic en el botón "Eliminar" o icono de basura
4. Confirmar eliminación si hay prompt
5. Verificar que el producto desaparezca
6. Verificar actualización del total

### Datos de Entrada:
- **Acción**: Eliminar producto específico

### Resultado Esperado:
- Producto se elimina del carrito
- Total se actualiza correctamente
- Contador de carrito se reduce
- Lista se actualiza sin el producto eliminado

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-010: Navegación del Menú Principal

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-010 |
| **Requerimiento Asociado** | RF-011 |
| **Módulo** | Navegación |
| **Prioridad** | Media |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Cargar la página principal
2. Verificar presencia del header
3. Hacer clic en "Inicio" - verificar redirección a `/`
4. Hacer clic en "Productos" - verificar redirección a `/products`
5. Si está autenticado, verificar menú de usuario
6. Verificar responsividad en móvil (F12 > responsive mode)

### Datos de Entrada:
- **Navegación**: Todos los enlaces principales

### Resultado Esperado:
- Todos los enlaces funcionan correctamente
- Redirecciones a páginas correctas
- Menú responsive funciona en móvil
- Indicadores visuales de sección activa
- No hay enlaces rotos

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-011: Health Check del Sistema

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-011 |
| **Requerimiento Asociado** | RF-013 |
| **Módulo** | Sistema |
| **Prioridad** | Baja |
| **Tipo** | Funcional - Positiva |

### Pasos a Seguir:
1. Abrir navegador
2. Navegar a `http://localhost:3000/health`
3. Verificar respuesta JSON
4. Verificar estructura de la respuesta
5. Verificar códigos de estado HTTP

### Datos de Entrada:
- **URL**: http://localhost:3000/health

### Resultado Esperado:
- Código de estado HTTP: 200
- Respuesta JSON con:
  - status: "OK"
  - timestamp: fecha/hora actual
  - uptime: tiempo de ejecución
  - environment: "development"

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## TC-012: Logout de Usuario

| Campo | Valor |
|-------|--------|
| **ID del Caso** | TC-012 |
| **Requerimiento Asociado** | RF-003 |
| **Módulo** | Autenticación |
| **Prioridad** | Media |
| **Tipo** | Funcional - Positiva |

### Precondición:
- Usuario debe estar autenticado

### Pasos a Seguir:
1. Con usuario autenticado, localizar el menú de usuario
2. Hacer clic en el avatar/menú de usuario
3. Seleccionar "Cerrar Sesión" del dropdown
4. Verificar redirección
5. Intentar acceder a página protegida

### Datos de Entrada:
- **Usuario**: Previamente autenticado

### Resultado Esperado:
- Usuario se desautentica correctamente
- Redirección a página de login
- Token se invalida
- Menú de usuario desaparece
- No puede acceder a páginas protegidas

### Resultado Obtenido:
*[A llenar durante ejecución]*

### Estado:
*[A llenar durante ejecución: Aprobado/Rechazado]*

---

## Resumen de Casos de Prueba

| Módulo | Casos Diseñados | Prioridad Alta | Prioridad Media | Prioridad Baja |
|--------|------------------|----------------|-----------------|----------------|
| Autenticación | 4 | 3 | 1 | 0 |
| Productos | 2 | 1 | 1 | 0 |
| Carrito | 3 | 2 | 1 | 0 |
| Navegación | 1 | 0 | 1 | 0 |
| Sistema | 1 | 0 | 0 | 1 |
| **TOTAL** | **12** | **6** | **4** | **1** |

### Cobertura de Requerimientos:
- **RF-001**: TC-001 ✅
- **RF-002**: TC-002, TC-003 ✅
- **RF-003**: TC-012 ✅
- **RF-005**: TC-004 ✅
- **RF-006**: TC-005 ✅
- **RF-008**: TC-006, TC-007 ✅
- **RF-009**: TC-008, TC-009 ✅
- **RF-011**: TC-010 ✅
- **RF-013**: TC-011 ✅

**Cobertura Total**: 9/15 requerimientos (60% - casos críticos cubiertos)

---

*Los casos de prueba serán ejecutados según el cronograma establecido en el Plan de QA. Los resultados se documentarán en la plantilla de ejecución.*
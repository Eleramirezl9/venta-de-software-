# Manual de Instalación Detallado - Sistema de Venta de Software

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Preparación del Entorno](#preparación-del-entorno)
3. [Instalación Paso a Paso](#instalación-paso-a-paso)
4. [Configuración Inicial](#configuración-inicial)
5. [Verificación de la Instalación](#verificación-de-la-instalación)
6. [Solución de Problemas](#solución-de-problemas)
7. [Configuración Avanzada](#configuración-avanzada)

## Requisitos del Sistema

### Requisitos de Hardware

**Mínimos:**
- Procesador: Intel Core i3 o AMD equivalente
- RAM: 4GB
- Espacio en disco: 2GB libres
- Conexión a internet para descarga de dependencias

**Recomendados:**
- Procesador: Intel Core i5 o AMD equivalente
- RAM: 8GB o más
- Espacio en disco: 5GB libres
- SSD para mejor rendimiento

### Requisitos de Software

**Sistemas Operativos Soportados:**
- Windows 10 (versión 1903 o superior)
- Windows 11
- macOS 10.15 Catalina o superior
- Ubuntu 20.04 LTS o superior
- Debian 10 o superior
- CentOS 8 o superior

**Software Requerido:**
- Node.js v18.0.0 o superior
- npm v8.0.0 o superior (incluido con Node.js)
- Git (opcional, para desarrollo)

## Preparación del Entorno

### Instalación de Node.js

#### Windows
1. Visita https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu computadora
5. Verifica la instalación:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
**Opción 1: Instalador oficial**
1. Visita https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el instalador .pkg

**Opción 2: Homebrew**
```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
# Actualizar repositorios
sudo apt update

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### Linux (CentOS/RHEL)
```bash
# Instalar Node.js y npm
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar instalación
node --version
npm --version
```

### Instalación de pnpm (Opcional pero Recomendado)

pnpm es un gestor de paquetes más rápido y eficiente que npm:

```bash
npm install -g pnpm
```

## Instalación Paso a Paso

### Paso 1: Descomprimir el Proyecto

**Windows:**
1. Haz clic derecho en `software-sales-system.zip`
2. Selecciona "Extraer todo..."
3. Elige la ubicación de destino
4. Haz clic en "Extraer"

**macOS/Linux:**
```bash
unzip software-sales-system.zip
cd software-sales-system
```

### Paso 2: Verificar la Estructura del Proyecto

Después de descomprimir, deberías ver esta estructura:
```
software-sales-system/
├── backend/
├── frontend/
├── docs/
├── scripts/
└── README.md
```

### Paso 3: Instalación del Backend

```bash
# Navegar a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Si prefieres pnpm:
# pnpm install
```

**Dependencias que se instalarán:**
- express: Framework web
- cors: Manejo de CORS
- helmet: Seguridad HTTP
- morgan: Logger de requests
- bcryptjs: Encriptación de contraseñas
- jsonwebtoken: Autenticación JWT
- sqlite3: Base de datos SQLite
- dotenv: Variables de entorno

### Paso 4: Instalación del Frontend

```bash
# Navegar a la carpeta del frontend (desde la raíz del proyecto)
cd frontend

# Instalar dependencias
npm install

# Si prefieres pnpm:
# pnpm install
```

**Dependencias que se instalarán:**
- react: Biblioteca de UI
- react-dom: Renderizado de React
- react-router-dom: Enrutamiento
- axios: Cliente HTTP
- tailwindcss: Framework CSS
- shadcn/ui: Componentes de UI
- lucide-react: Iconos

### Paso 5: Configuración de la Base de Datos

```bash
# Desde la carpeta backend
cd backend

# Ejecutar migraciones (crear tablas)
npm run migrate

# Poblar con datos de prueba
npm run seed
```

Este proceso creará:
- Archivo de base de datos SQLite en `backend/database/software_sales.db`
- Tablas: users, products, cart_items
- Datos de prueba: usuarios y productos de ejemplo

## Configuración Inicial

### Configuración del Backend

1. **Crear archivo de configuración:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Editar variables de entorno:**
   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=tu_jwt_secret_muy_seguro_cambialo_en_produccion
   JWT_EXPIRES_IN=7d
   DB_PATH=./database/software_sales.db
   CORS_ORIGIN=http://localhost:5173
   ```

### Configuración del Frontend

El frontend no requiere configuración adicional para desarrollo local, pero puedes personalizar:

1. **Configuración de Vite (opcional):**
   ```javascript
   // frontend/vite.config.js
   export default defineConfig({
     server: {
       port: 5173,
       host: true // Para acceso desde red local
     }
   })
   ```

## Verificación de la Instalación

### Paso 1: Iniciar el Backend

```bash
cd backend
npm start
```

**Salida esperada:**
```
[dotenv] injecting env (6) from .env
Conectado a la base de datos SQLite
✅ Base de datos conectada
🚀 Servidor ejecutándose en http://localhost:3000
📚 Documentación API disponible en http://localhost:3000/api-docs
🏥 Health check disponible en http://localhost:3000/health
🌍 Entorno: development
```

### Paso 2: Verificar el Backend

Abre una nueva terminal y ejecuta:
```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 1.234,
  "environment": "development"
}
```

### Paso 3: Iniciar el Frontend

En una nueva terminal:
```bash
cd frontend
npm run dev
```

**Salida esperada:**
```
VITE v6.3.5  ready in 654 ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
➜  press h + enter to show help
```

### Paso 4: Verificar el Frontend

1. Abre tu navegador web
2. Navega a http://localhost:5173
3. Deberías ver la página de inicio del sistema
4. Verifica que se muestren los productos

### Paso 5: Prueba de Funcionalidad Completa

1. **Registro de usuario:**
   - Haz clic en "Registrarse"
   - Completa el formulario
   - Verifica que puedas crear una cuenta

2. **Inicio de sesión:**
   - Usa las credenciales: demo@example.com / 123456
   - Verifica que puedas iniciar sesión

3. **Navegación:**
   - Explora la página de productos
   - Verifica que los filtros funcionen
   - Prueba la búsqueda

4. **Carrito de compras:**
   - Agrega productos al carrito
   - Verifica que se actualice el contador
   - Revisa la página del carrito

## Solución de Problemas

### Error: "Puerto 3000 ya está en uso"

**Síntoma:** El backend no puede iniciar porque el puerto está ocupado.

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9

# O cambiar el puerto en .env
PORT=3001
```

### Error: "Cannot find module"

**Síntoma:** Errores de módulos no encontrados al iniciar.

**Solución:**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install

# O con pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Database not found"

**Síntoma:** Error de base de datos al iniciar el backend.

**Solución:**
```bash
cd backend
npm run migrate
npm run seed
```

### Error: CORS

**Síntoma:** Errores de CORS en el navegador.

**Solución:**
1. Verifica que `CORS_ORIGIN` en `.env` sea correcto
2. Asegúrate de que el frontend esté en el puerto correcto
3. Reinicia ambos servidores

### Error: "Permission denied"

**Síntoma:** Errores de permisos en Linux/macOS.

**Solución:**
```bash
# Cambiar permisos de la carpeta del proyecto
chmod -R 755 software-sales-system/

# O usar sudo para npm install (no recomendado)
sudo npm install
```

### Problemas de Rendimiento

**Síntoma:** La aplicación es lenta o consume mucha memoria.

**Solución:**
1. Verifica que tengas suficiente RAM disponible
2. Cierra otras aplicaciones pesadas
3. Usa pnpm en lugar de npm para mejor rendimiento
4. Considera usar Node.js v18+ para mejor optimización

## Configuración Avanzada

### Configuración de Base de Datos Alternativa

#### PostgreSQL
1. Instala PostgreSQL
2. Crea una base de datos
3. Instala el driver:
   ```bash
   npm install pg
   ```
4. Modifica `src/shared/infrastructure/database/Database.js`

#### MySQL
1. Instala MySQL
2. Crea una base de datos
3. Instala el driver:
   ```bash
   npm install mysql2
   ```
4. Modifica la configuración de conexión

### Configuración de Proxy Reverso

Para usar con Nginx o Apache:

**Nginx:**
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Configuración de SSL/HTTPS

Para habilitar HTTPS en desarrollo:

1. Genera certificados auto-firmados:
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

2. Configura Vite para HTTPS:
   ```javascript
   // vite.config.js
   import fs from 'fs'
   
   export default defineConfig({
     server: {
       https: {
         key: fs.readFileSync('key.pem'),
         cert: fs.readFileSync('cert.pem'),
       }
     }
   })
   ```

### Configuración de Variables de Entorno Avanzadas

```env
# Backend (.env)
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d
DB_PATH=./database/software_sales.db
CORS_ORIGIN=http://localhost:5173

# Configuración de email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password

# Configuración de logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Configuración de rate limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## Siguiente Paso

Una vez completada la instalación, consulta:
- [Guía de Desarrollo](DEVELOPMENT.md) para personalizar el sistema
- [Documentación de la API](API.md) para integrar con otros sistemas
- [Guía de Despliegue](DEPLOYMENT.md) para poner en producción

---

**¿Problemas con la instalación?** Revisa la sección de solución de problemas o consulta los logs del sistema para más información específica sobre errores.


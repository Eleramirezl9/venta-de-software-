# Sistema de Venta de Software - SoftwareSales

Un sistema completo de comercio electrónico especializado en la venta de software, desarrollado con arquitectura moderna y tecnologías de vanguardia.

## 🚀 Características Principales

- **Arquitectura Hexagonal**: Backend desarrollado con Node.js/Express siguiendo principios de Clean Architecture
- **Frontend Moderno**: Interfaz de usuario desarrollada con React 18 y Tailwind CSS
- **Base de Datos**: SQLite para desarrollo local con migración fácil a PostgreSQL/MySQL
- **Autenticación Segura**: Sistema completo de registro, login y gestión de sesiones con JWT
- **Carrito de Compras**: Funcionalidad completa de carrito con persistencia
- **Diseño Responsivo**: Interfaz adaptable a dispositivos móviles y desktop
- **API RESTful**: Documentación completa con Swagger/OpenAPI

## 📋 Requisitos del Sistema

### Requisitos Mínimos
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior (o pnpm v8.0.0+)
- **Sistema Operativo**: Windows 10+, macOS 10.15+, o Linux Ubuntu 20.04+
- **RAM**: 4GB mínimo, 8GB recomendado
- **Espacio en Disco**: 2GB libres

### Puertos Utilizados
- **Backend**: Puerto 3000
- **Frontend**: Puerto 5173/5174 (desarrollo)
- **Base de Datos**: SQLite (archivo local)

## 🛠️ Instalación Rápida

### 1. Descomprimir el Proyecto
```bash
unzip software-sales-system.zip
cd software-sales-system
```

### 2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend
```bash
cd ../frontend
npm install
# o si prefieres pnpm:
# pnpm install
```

### 4. Configurar Base de Datos
```bash
cd ../backend
npm run migrate
npm run seed
```

### 5. Iniciar el Sistema
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (nueva terminal)
cd frontend
npm run dev
```

### 6. Acceder a la Aplicación
- **Frontend**: http://localhost:5173
- **API Backend**: http://localhost:3000
- **Documentación API**: http://localhost:3000/api-docs

## 👤 Usuarios de Prueba

El sistema incluye usuarios de prueba pre-configurados:

| Email | Contraseña | Rol |
|-------|------------|-----|
| demo@example.com | 123456 | Usuario |
| admin@example.com | admin123 | Administrador |

## 📁 Estructura del Proyecto

```
software-sales-system/
├── backend/                 # API Backend (Node.js/Express)
│   ├── src/
│   │   ├── auth/           # Módulo de autenticación
│   │   ├── products/       # Módulo de productos
│   │   ├── cart/           # Módulo de carrito
│   │   └── shared/         # Componentes compartidos
│   ├── database/           # Migraciones y seeds
│   ├── .env               # Variables de entorno
│   └── server.js          # Punto de entrada
├── frontend/               # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── contexts/      # Contextos de React
│   │   └── lib/           # Utilidades y configuración
│   └── public/            # Archivos estáticos
├── docs/                  # Documentación completa
├── scripts/               # Scripts de utilidad
└── README.md             # Este archivo
```

## 🔧 Configuración Avanzada

### Variables de Entorno (Backend)
Crea un archivo `.env` en la carpeta `backend/` con:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=7d
DB_PATH=./database/software_sales.db
CORS_ORIGIN=http://localhost:5173
```

### Configuración de Base de Datos
El sistema utiliza SQLite por defecto. Para cambiar a PostgreSQL o MySQL:

1. Instala el driver correspondiente
2. Modifica `src/shared/infrastructure/database/Database.js`
3. Actualiza las variables de entorno

## 🚀 Despliegue en Producción

### Preparar Frontend para Producción
```bash
cd frontend
npm run build
```

### Configurar Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_jwt_secret_super_seguro_para_produccion
DB_PATH=./database/production.db
CORS_ORIGIN=https://tu-dominio.com
```

### Iniciar en Modo Producción
```bash
cd backend
npm run start:prod
```

## 📚 Documentación Adicional

- [Manual de Instalación Detallado](docs/INSTALLATION.md)
- [Guía de Desarrollo](docs/DEVELOPMENT.md)
- [Documentación de la API](docs/API.md)
- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Guía de Despliegue](docs/DEPLOYMENT.md)

## 🐛 Solución de Problemas

### Problemas Comunes

**Error: Puerto 3000 en uso**
```bash
# Encontrar y terminar el proceso
lsof -ti:3000 | xargs kill -9
```

**Error: CORS**
- Verifica que `CORS_ORIGIN` en `.env` coincida con la URL del frontend

**Error: Base de datos no encontrada**
```bash
cd backend
npm run migrate
npm run seed
```

**Error: Dependencias**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribución

Este proyecto fue desarrollado como parte de un sistema de venta de software profesional. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Eddy Alexander Ramirez Lorenzana**
- Proyecto de QA - Sistema de Venta de Software


## 🙏 Agradecimientos

- React Team por el excelente framework
- Express.js por el framework backend
- Tailwind CSS por el sistema de diseño
- shadcn/ui por los componentes de UI
- SQLite por la base de datos embebida

---

**¿Necesitas ayuda?** Consulta la documentación completa en la carpeta `docs/` o revisa los logs del sistema para más información sobre errores específicos.


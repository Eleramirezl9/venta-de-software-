# 🚀 Guía de Inicio Rápido - Sistema de Venta de Software

## ⚡ Instalación en 3 Pasos

### 1️⃣ Descomprimir el Proyecto
```bash
unzip software-sales-system.zip
cd software-sales-system
```

### 2️⃣ Ejecutar Instalación Automática
```bash
./scripts/install.sh
```

### 3️⃣ Iniciar el Sistema
```bash
./scripts/start.sh
```

## 🌐 Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Documentación**: http://localhost:3000/api-docs

## 👤 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| demo@example.com | 123456 | Usuario |
| admin@example.com | admin123 | Admin |

## 🛑 Detener el Sistema

```bash
./scripts/stop.sh
```

## 📋 Requisitos Mínimos

- **Node.js**: v18.0.0+
- **RAM**: 4GB
- **Espacio**: 2GB

## 🆘 Solución Rápida de Problemas

### Puerto ocupado
```bash
# Detener procesos en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### Reinstalar dependencias
```bash
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### Recrear base de datos
```bash
cd backend
rm database/software_sales.db
npm run migrate
npm run seed
```

## 📚 Documentación Completa

- [README.md](README.md) - Información general
- [docs/INSTALLATION.md](docs/INSTALLATION.md) - Manual detallado
- [docs/API.md](docs/API.md) - Documentación de la API
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Guía de despliegue

---

**¿Problemas?** Revisa la documentación completa o los logs en la carpeta `logs/`


# Guía de Despliegue - Sistema de Venta de Software

## Tabla de Contenidos

1. [Preparación para Producción](#preparación-para-producción)
2. [Despliegue Local](#despliegue-local)
3. [Despliegue en VPS/Servidor](#despliegue-en-vpsservidor)
4. [Despliegue con Docker](#despliegue-con-docker)
5. [Despliegue en la Nube](#despliegue-en-la-nube)
6. [Configuración de Base de Datos](#configuración-de-base-de-datos)
7. [SSL y Seguridad](#ssl-y-seguridad)
8. [Monitoreo y Logs](#monitoreo-y-logs)
9. [Backup y Recuperación](#backup-y-recuperación)

## Preparación para Producción

### 1. Configuración de Variables de Entorno

#### Backend (.env)
```env
# Entorno
NODE_ENV=production

# Servidor
PORT=3000
HOST=0.0.0.0

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_para_produccion_min_32_caracteres
JWT_EXPIRES_IN=7d

# Base de Datos
DB_PATH=./database/production.db
# O para PostgreSQL:
# DATABASE_URL=postgresql://usuario:password@localhost:5432/software_sales

# CORS
CORS_ORIGIN=https://tu-dominio.com

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://api.tu-dominio.com
VITE_APP_NAME=SoftwareSales
VITE_APP_VERSION=1.0.0
```

### 2. Build de Producción

#### Frontend
```bash
cd frontend
npm run build
# Esto genera la carpeta 'dist' con archivos optimizados
```

#### Backend
```bash
cd backend
# Instalar solo dependencias de producción
npm ci --only=production

# O limpiar devDependencies
npm prune --production
```

### 3. Optimizaciones de Seguridad

#### Actualizar package.json del Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "start:prod": "NODE_ENV=production node server.js"
  }
}
```

#### Configuración adicional de seguridad
```javascript
// server.js - Configuración de producción
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
}
```

## Despliegue Local

### Opción 1: Servidor Estático + API

#### 1. Servir Frontend con Nginx
```nginx
# /etc/nginx/sites-available/software-sales
server {
    listen 80;
    server_name localhost;
    root /path/to/software-sales-system/frontend/dist;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 2. Iniciar Backend como Servicio
```bash
# Crear servicio systemd
sudo nano /etc/systemd/system/software-sales-api.service
```

```ini
[Unit]
Description=Software Sales API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/software-sales-system/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicio
sudo systemctl enable software-sales-api
sudo systemctl start software-sales-api
sudo systemctl status software-sales-api
```

### Opción 2: PM2 (Recomendado)

#### 1. Instalar PM2
```bash
npm install -g pm2
```

#### 2. Configurar PM2
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'software-sales-api',
    script: './server.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
```

#### 3. Desplegar con PM2
```bash
# Iniciar aplicación
pm2 start ecosystem.config.js --env production

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

## Despliegue en VPS/Servidor

### 1. Preparación del Servidor

#### Ubuntu/Debian
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias
sudo apt install -y curl wget git nginx

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Crear usuario para la aplicación
sudo adduser --system --group --home /opt/software-sales software-sales
```

### 2. Configuración del Proyecto

```bash
# Clonar o subir proyecto
sudo -u software-sales git clone <repo-url> /opt/software-sales/app
cd /opt/software-sales/app

# Configurar backend
cd backend
sudo -u software-sales npm ci --only=production
sudo -u software-sales cp .env.example .env
# Editar .env con configuración de producción

# Configurar base de datos
sudo -u software-sales npm run migrate
sudo -u software-sales npm run seed

# Build frontend
cd ../frontend
sudo -u software-sales npm ci
sudo -u software-sales npm run build
```

### 3. Configuración de Nginx

```nginx
# /etc/nginx/sites-available/software-sales
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Logs
    access_log /var/log/nginx/software-sales.access.log;
    error_log /var/log/nginx/software-sales.error.log;

    # Frontend
    root /opt/software-sales/app/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/software-sales /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Iniciar Aplicación

```bash
# Cambiar al usuario de la aplicación
sudo -u software-sales -i

# Navegar al directorio
cd /opt/software-sales/app

# Iniciar con PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Volver al usuario root y ejecutar comando de startup
exit
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u software-sales --hp /opt/software-sales
```

## Despliegue con Docker

### 1. Dockerfile para Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Crear directorio para base de datos
RUN mkdir -p database logs

# Exponer puerto
EXPOSE 3000

# Usuario no root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Comando de inicio
CMD ["node", "server.js"]
```

### 2. Dockerfile para Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: software-sales-api
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - DB_PATH=/app/database/production.db
    volumes:
      - ./backend/database:/app/database
      - ./backend/logs:/app/logs
    ports:
      - "3000:3000"
    networks:
      - software-sales-network

  frontend:
    build: ./frontend
    container_name: software-sales-web
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - software-sales-network

  nginx:
    image: nginx:alpine
    container_name: software-sales-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - software-sales-network

networks:
  software-sales-network:
    driver: bridge

volumes:
  database_data:
  logs_data:
```

### 4. Comandos Docker

```bash
# Build y ejecutar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down

# Actualizar servicios
docker-compose pull
docker-compose up -d --build
```

## Despliegue en la Nube

### 1. Heroku

#### Preparación
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear aplicación
heroku create software-sales-app
```

#### Configuración
```bash
# Variables de entorno
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=tu_jwt_secret_seguro
heroku config:set NPM_CONFIG_PRODUCTION=false

# Buildpacks
heroku buildpacks:add heroku/nodejs
```

#### Procfile
```
web: node backend/server.js
```

#### Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. DigitalOcean App Platform

#### app.yaml
```yaml
name: software-sales
services:
- name: api
  source_dir: /backend
  github:
    repo: tu-usuario/software-sales-system
    branch: main
  run_command: node server.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: ${JWT_SECRET}
    type: SECRET

- name: web
  source_dir: /frontend
  github:
    repo: tu-usuario/software-sales-system
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

### 3. AWS (EC2 + RDS)

#### EC2 Setup
```bash
# Conectar a instancia
ssh -i key.pem ubuntu@ec2-instance-ip

# Instalar dependencias
sudo apt update
sudo apt install -y nodejs npm nginx

# Configurar aplicación (similar a VPS)
```

#### RDS Configuration
```env
# .env para AWS RDS
DATABASE_URL=postgresql://username:password@rds-endpoint:5432/software_sales
```

## Configuración de Base de Datos

### 1. PostgreSQL en Producción

#### Instalación
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb software_sales
sudo -u postgres createuser --interactive software_sales_user
```

#### Configuración
```sql
-- Conectar como postgres
sudo -u postgres psql

-- Crear usuario y base de datos
CREATE USER software_sales_user WITH PASSWORD 'password_seguro';
CREATE DATABASE software_sales OWNER software_sales_user;
GRANT ALL PRIVILEGES ON DATABASE software_sales TO software_sales_user;
```

#### Migración desde SQLite
```bash
# Instalar herramienta de migración
npm install -g sqlite-to-postgres

# Migrar datos
sqlite-to-postgres --source ./database/software_sales.db --target postgresql://user:pass@localhost/software_sales
```

### 2. MySQL en Producción

#### Instalación
```bash
sudo apt install mysql-server

# Configuración segura
sudo mysql_secure_installation
```

#### Configuración
```sql
CREATE DATABASE software_sales;
CREATE USER 'software_sales_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON software_sales.* TO 'software_sales_user'@'localhost';
FLUSH PRIVILEGES;
```

## SSL y Seguridad

### 1. Let's Encrypt con Certbot

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Configuración SSL en Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3000  # Solo si es necesario acceso directo

# iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP
```

## Monitoreo y Logs

### 1. Configuración de Logs

#### Winston Logger (Backend)
```javascript
// backend/src/shared/infrastructure/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'software-sales-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 2. Monitoreo con PM2

```bash
# Monitoreo en tiempo real
pm2 monit

# Logs
pm2 logs

# Métricas
pm2 show software-sales-api
```

### 3. Health Checks

```javascript
// Endpoint de health check avanzado
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    checks: {
      database: 'OK',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };

  try {
    // Verificar conexión a base de datos
    await Database.get('SELECT 1');
  } catch (error) {
    health.status = 'ERROR';
    health.checks.database = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### 4. Alertas y Notificaciones

```bash
# Script de monitoreo
#!/bin/bash
# monitor.sh

URL="https://tu-dominio.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Sitio web caído! Código de respuesta: $RESPONSE"
    # Enviar notificación (email, Slack, etc.)
fi
```

```bash
# Cron job para monitoreo
# crontab -e
*/5 * * * * /path/to/monitor.sh
```

## Backup y Recuperación

### 1. Backup de Base de Datos

#### SQLite
```bash
#!/bin/bash
# backup-sqlite.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/software-sales"
DB_PATH="/opt/software-sales/app/backend/database/production.db"

mkdir -p $BACKUP_DIR
cp $DB_PATH "$BACKUP_DIR/backup_$DATE.db"

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.db" -mtime +7 -delete
```

#### PostgreSQL
```bash
#!/bin/bash
# backup-postgres.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/software-sales"
DB_NAME="software_sales"

mkdir -p $BACKUP_DIR
pg_dump $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"
gzip "$BACKUP_DIR/backup_$DATE.sql"

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### 2. Backup de Archivos

```bash
#!/bin/bash
# backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/software-sales"
APP_DIR="/opt/software-sales/app"

mkdir -p $BACKUP_DIR

# Backup de configuración y logs
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
    $APP_DIR/backend/.env \
    $APP_DIR/backend/logs/ \
    $APP_DIR/ecosystem.config.js

# Backup completo (opcional)
tar --exclude='node_modules' --exclude='.git' \
    -czf "$BACKUP_DIR/full_$DATE.tar.gz" $APP_DIR
```

### 3. Automatización de Backups

```bash
# Cron jobs para backups automáticos
# crontab -e

# Backup diario de BD a las 2 AM
0 2 * * * /opt/scripts/backup-sqlite.sh

# Backup semanal completo los domingos a las 3 AM
0 3 * * 0 /opt/scripts/backup-files.sh
```

### 4. Restauración

#### Desde Backup SQLite
```bash
# Parar aplicación
pm2 stop software-sales-api

# Restaurar base de datos
cp /opt/backups/software-sales/backup_20240101_020000.db \
   /opt/software-sales/app/backend/database/production.db

# Reiniciar aplicación
pm2 start software-sales-api
```

#### Desde Backup PostgreSQL
```bash
# Restaurar base de datos
gunzip -c /opt/backups/software-sales/backup_20240101_020000.sql.gz | \
psql software_sales
```

## Checklist de Despliegue

### Pre-Despliegue
- [ ] Variables de entorno configuradas
- [ ] Secrets seguros generados
- [ ] Build de producción creado
- [ ] Tests pasando
- [ ] Base de datos migrada
- [ ] SSL configurado
- [ ] Firewall configurado

### Post-Despliegue
- [ ] Health checks funcionando
- [ ] Logs configurados
- [ ] Monitoreo activo
- [ ] Backups programados
- [ ] Performance testing
- [ ] Security scanning
- [ ] Documentación actualizada

### Mantenimiento
- [ ] Updates de seguridad regulares
- [ ] Monitoreo de performance
- [ ] Revisión de logs
- [ ] Verificación de backups
- [ ] Renovación de certificados SSL

---

Esta guía proporciona múltiples opciones de despliegue desde desarrollo local hasta producción en la nube, asegurando que el Sistema de Venta de Software pueda ser desplegado de manera segura y eficiente en cualquier entorno.


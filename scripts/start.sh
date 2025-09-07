#!/bin/bash

# Script de Inicio - Sistema de Venta de Software
# Autor: Eddy Alexander Ramirez Lorenzana
# Versión: 1.0.0

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar si el comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar que el puerto esté libre
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Puerto ocupado
    else
        return 0  # Puerto libre
    fi
}

# Verificar dependencias
check_dependencies() {
    print_header "VERIFICANDO DEPENDENCIAS"
    
    # Verificar Node.js
    if ! command_exists node; then
        print_error "Node.js no está instalado. Ejecuta el script de instalación primero."
        exit 1
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        print_error "npm no está instalado. Ejecuta el script de instalación primero."
        exit 1
    fi
    
    # Verificar estructura del proyecto
    if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Estructura del proyecto incorrecta. Asegúrate de estar en el directorio raíz."
        exit 1
    fi
    
    # Verificar node_modules
    if [ ! -d "backend/node_modules" ]; then
        print_error "Dependencias del backend no instaladas. Ejecuta: cd backend && npm install"
        exit 1
    fi
    
    if [ ! -d "frontend/node_modules" ]; then
        print_error "Dependencias del frontend no instaladas. Ejecuta: cd frontend && npm install"
        exit 1
    fi
    
    # Verificar base de datos
    if [ ! -f "backend/database/software_sales.db" ]; then
        print_warning "Base de datos no encontrada. Creando..."
        cd backend
        npm run migrate
        npm run seed
        cd ..
    fi
    
    print_message "Todas las dependencias están correctas ✓"
}

# Verificar puertos
check_ports() {
    print_header "VERIFICANDO PUERTOS"
    
    # Verificar puerto 3000 (backend)
    if ! check_port 3000; then
        print_error "El puerto 3000 está ocupado. Detén el proceso que lo está usando:"
        print_error "lsof -ti:3000 | xargs kill -9"
        exit 1
    fi
    
    # Verificar puerto 5173 (frontend)
    if ! check_port 5173; then
        print_warning "El puerto 5173 está ocupado. Vite usará otro puerto automáticamente."
    fi
    
    print_message "Puertos verificados ✓"
}

# Iniciar backend
start_backend() {
    print_header "INICIANDO BACKEND"
    
    cd backend
    
    print_message "Iniciando servidor API en puerto 3000..."
    
    # Verificar archivo .env
    if [ ! -f ".env" ]; then
        print_warning "Archivo .env no encontrado. Creando configuración por defecto..."
        cat > .env << EOF
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_cambialo_en_produccion_$(date +%s)
JWT_EXPIRES_IN=7d
DB_PATH=./database/software_sales.db
CORS_ORIGIN=http://localhost:5173
EOF
    fi
    
    # Iniciar en segundo plano
    nohup npm start > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Esperar a que el servidor inicie
    print_message "Esperando a que el backend inicie..."
    sleep 5
    
    # Verificar que el servidor esté ejecutándose
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        print_message "Backend iniciado exitosamente ✓"
        print_message "PID del backend: $BACKEND_PID"
        echo $BACKEND_PID > ../logs/backend.pid
    else
        print_error "Error al iniciar el backend. Revisa los logs en logs/backend.log"
        exit 1
    fi
    
    cd ..
}

# Iniciar frontend
start_frontend() {
    print_header "INICIANDO FRONTEND"
    
    cd frontend
    
    print_message "Iniciando servidor de desarrollo React..."
    
    # Iniciar en segundo plano
    nohup npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Esperar a que el servidor inicie
    print_message "Esperando a que el frontend inicie..."
    sleep 10
    
    # Verificar que el servidor esté ejecutándose
    if curl -s http://localhost:5173 > /dev/null 2>&1 || curl -s http://localhost:5174 > /dev/null 2>&1; then
        print_message "Frontend iniciado exitosamente ✓"
        print_message "PID del frontend: $FRONTEND_PID"
        echo $FRONTEND_PID > ../logs/frontend.pid
    else
        print_error "Error al iniciar el frontend. Revisa los logs en logs/frontend.log"
        exit 1
    fi
    
    cd ..
}

# Mostrar información del sistema
show_system_info() {
    print_header "SISTEMA INICIADO EXITOSAMENTE"
    
    # Detectar puerto del frontend
    FRONTEND_PORT=5173
    if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
        if curl -s http://localhost:5174 > /dev/null 2>&1; then
            FRONTEND_PORT=5174
        fi
    fi
    
    echo -e "${GREEN}¡El Sistema de Venta de Software está ejecutándose!${NC}"
    echo ""
    echo -e "${BLUE}URLs de Acceso:${NC}"
    echo -e "  🌐 Frontend: ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "  🔧 API Backend: ${YELLOW}http://localhost:3000${NC}"
    echo -e "  📚 Documentación API: ${YELLOW}http://localhost:3000/api-docs${NC}"
    echo -e "  ❤️  Health Check: ${YELLOW}http://localhost:3000/health${NC}"
    echo ""
    echo -e "${BLUE}Usuarios de Prueba:${NC}"
    echo -e "  📧 Email: ${YELLOW}demo@example.com${NC}"
    echo -e "  🔑 Contraseña: ${YELLOW}123456${NC}"
    echo ""
    echo -e "  📧 Email Admin: ${YELLOW}admin@example.com${NC}"
    echo -e "  🔑 Contraseña: ${YELLOW}admin123${NC}"
    echo ""
    echo -e "${BLUE}Archivos de Log:${NC}"
    echo -e "  📄 Backend: ${YELLOW}logs/backend.log${NC}"
    echo -e "  📄 Frontend: ${YELLOW}logs/frontend.log${NC}"
    echo ""
    echo -e "${BLUE}Para detener el sistema:${NC}"
    echo -e "  🛑 Ejecuta: ${YELLOW}./scripts/stop.sh${NC}"
    echo ""
    echo -e "${GREEN}¡Disfruta usando el sistema!${NC}"
}

# Crear directorio de logs
create_logs_directory() {
    if [ ! -d "logs" ]; then
        mkdir -p logs
        print_message "Directorio de logs creado"
    fi
}

# Función principal
main() {
    print_header "INICIADOR DEL SISTEMA DE VENTA DE SOFTWARE"
    echo -e "${BLUE}Autor: Eddy Alexander Ramirez Lorenzana${NC}"
    echo -e "${BLUE}Versión: 1.0.0${NC}"
    echo ""
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        print_error "Asegúrate de estar en la carpeta 'software-sales-system'"
        exit 1
    fi
    
    # Crear directorio de logs
    create_logs_directory
    
    # Ejecutar verificaciones e inicio
    check_dependencies
    check_ports
    start_backend
    start_frontend
    show_system_info
}

# Manejar interrupciones
cleanup() {
    print_error "Inicio interrumpido por el usuario"
    
    # Detener procesos si existen
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm logs/backend.pid
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm logs/frontend.pid
    fi
    
    exit 1
}

trap cleanup INT

# Ejecutar función principal
main "$@"


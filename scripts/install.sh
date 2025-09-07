#!/bin/bash

# Script de Instalación Automática - Sistema de Venta de Software
# Autor: Eddy Alexander Ramirez Lorenzana
# Versión: 1.0.0

set -e  # Salir si hay errores

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

# Verificar Node.js
check_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_VERSION="18.0.0"
        
        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_message "Node.js $NODE_VERSION encontrado ✓"
            return 0
        else
            print_error "Node.js $NODE_VERSION es muy antiguo. Se requiere v18.0.0 o superior"
            return 1
        fi
    else
        print_error "Node.js no está instalado"
        return 1
    fi
}

# Verificar npm
check_npm() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_message "npm $NPM_VERSION encontrado ✓"
        return 0
    else
        print_error "npm no está instalado"
        return 1
    fi
}

# Instalar Node.js en diferentes sistemas
install_nodejs() {
    print_header "INSTALANDO NODE.JS"
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command_exists apt-get; then
            # Ubuntu/Debian
            print_message "Instalando Node.js en Ubuntu/Debian..."
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command_exists yum; then
            # CentOS/RHEL
            print_message "Instalando Node.js en CentOS/RHEL..."
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
        else
            print_error "Distribución de Linux no soportada. Instala Node.js manualmente desde https://nodejs.org/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            print_message "Instalando Node.js con Homebrew..."
            brew install node
        else
            print_error "Homebrew no encontrado. Instala Node.js manualmente desde https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Sistema operativo no soportado. Instala Node.js manualmente desde https://nodejs.org/"
        exit 1
    fi
}

# Verificar dependencias del sistema
check_system_dependencies() {
    print_header "VERIFICANDO DEPENDENCIAS DEL SISTEMA"
    
    # Verificar Node.js
    if ! check_nodejs; then
        read -p "¿Deseas instalar Node.js automáticamente? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_nodejs
            if ! check_nodejs; then
                print_error "Falló la instalación de Node.js"
                exit 1
            fi
        else
            print_error "Node.js es requerido. Instálalo desde https://nodejs.org/"
            exit 1
        fi
    fi
    
    # Verificar npm
    if ! check_npm; then
        print_error "npm es requerido y debería venir con Node.js"
        exit 1
    fi
    
    print_message "Todas las dependencias del sistema están instaladas ✓"
}

# Instalar dependencias del backend
install_backend_dependencies() {
    print_header "INSTALANDO DEPENDENCIAS DEL BACKEND"
    
    cd backend
    
    print_message "Instalando dependencias de Node.js..."
    npm install
    
    print_message "Dependencias del backend instaladas ✓"
    cd ..
}

# Instalar dependencias del frontend
install_frontend_dependencies() {
    print_header "INSTALANDO DEPENDENCIAS DEL FRONTEND"
    
    cd frontend
    
    print_message "Instalando dependencias de React..."
    npm install
    
    print_message "Dependencias del frontend instaladas ✓"
    cd ..
}

# Configurar base de datos
setup_database() {
    print_header "CONFIGURANDO BASE DE DATOS"
    
    cd backend
    
    print_message "Ejecutando migraciones de base de datos..."
    npm run migrate
    
    print_message "Poblando base de datos con datos de prueba..."
    npm run seed
    
    print_message "Base de datos configurada ✓"
    cd ..
}

# Configurar variables de entorno
setup_environment() {
    print_header "CONFIGURANDO VARIABLES DE ENTORNO"
    
    # Backend
    if [ ! -f "backend/.env" ]; then
        print_message "Creando archivo .env para el backend..."
        cat > backend/.env << EOF
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_jwt_secret_muy_seguro_cambialo_en_produccion_$(date +%s)
JWT_EXPIRES_IN=7d
DB_PATH=./database/software_sales.db
CORS_ORIGIN=http://localhost:5173
EOF
        print_message "Archivo .env creado ✓"
    else
        print_warning "El archivo .env ya existe, no se sobrescribirá"
    fi
}

# Verificar instalación
verify_installation() {
    print_header "VERIFICANDO INSTALACIÓN"
    
    # Verificar estructura de archivos
    if [ -d "backend" ] && [ -d "frontend" ] && [ -d "docs" ]; then
        print_message "Estructura de directorios correcta ✓"
    else
        print_error "Estructura de directorios incorrecta"
        return 1
    fi
    
    # Verificar base de datos
    if [ -f "backend/database/software_sales.db" ]; then
        print_message "Base de datos creada ✓"
    else
        print_error "Base de datos no encontrada"
        return 1
    fi
    
    # Verificar node_modules
    if [ -d "backend/node_modules" ] && [ -d "frontend/node_modules" ]; then
        print_message "Dependencias instaladas ✓"
    else
        print_error "Dependencias no instaladas correctamente"
        return 1
    fi
    
    print_message "Instalación verificada exitosamente ✓"
}

# Mostrar instrucciones de uso
show_usage_instructions() {
    print_header "INSTALACIÓN COMPLETADA"
    
    echo -e "${GREEN}¡El Sistema de Venta de Software ha sido instalado exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}Para iniciar el sistema:${NC}"
    echo ""
    echo -e "${YELLOW}1. Iniciar el Backend:${NC}"
    echo "   cd backend"
    echo "   npm start"
    echo ""
    echo -e "${YELLOW}2. Iniciar el Frontend (en otra terminal):${NC}"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo -e "${YELLOW}3. Acceder a la aplicación:${NC}"
    echo "   Frontend: http://localhost:5173"
    echo "   API: http://localhost:3000"
    echo "   Documentación API: http://localhost:3000/api-docs"
    echo ""
    echo -e "${BLUE}Usuarios de prueba:${NC}"
    echo "   Email: demo@example.com"
    echo "   Contraseña: 123456"
    echo ""
    echo -e "${BLUE}Para más información:${NC}"
    echo "   - README.md: Información general"
    echo "   - docs/INSTALLATION.md: Manual detallado"
    echo "   - docs/API.md: Documentación de la API"
    echo ""
    echo -e "${GREEN}¡Disfruta usando el sistema!${NC}"
}

# Función principal
main() {
    print_header "INSTALADOR DEL SISTEMA DE VENTA DE SOFTWARE"
    echo -e "${BLUE}Autor: Eddy Alexander Ramirez Lorenzana${NC}"
    echo -e "${BLUE}Versión: 1.0.0${NC}"
    echo ""
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        print_error "Asegúrate de estar en la carpeta 'software-sales-system'"
        exit 1
    fi
    
    print_message "Iniciando instalación automática..."
    echo ""
    
    # Ejecutar pasos de instalación
    check_system_dependencies
    setup_environment
    install_backend_dependencies
    install_frontend_dependencies
    setup_database
    verify_installation
    show_usage_instructions
}

# Manejar interrupciones
trap 'print_error "Instalación interrumpida por el usuario"; exit 1' INT

# Ejecutar función principal
main "$@"


#!/bin/bash

# Script para Detener el Sistema - Sistema de Venta de Software
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

# Detener proceso por PID
stop_process() {
    local pid_file=$1
    local process_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_message "Deteniendo $process_name (PID: $pid)..."
            kill "$pid"
            
            # Esperar a que el proceso termine
            local count=0
            while kill -0 "$pid" 2>/dev/null && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done
            
            # Si aún está ejecutándose, forzar terminación
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Forzando terminación de $process_name..."
                kill -9 "$pid" 2>/dev/null || true
            fi
            
            print_message "$process_name detenido ✓"
        else
            print_warning "$process_name no estaba ejecutándose"
        fi
        
        rm "$pid_file"
    else
        print_warning "Archivo PID de $process_name no encontrado"
    fi
}

# Detener procesos por puerto
stop_process_by_port() {
    local port=$1
    local process_name=$2
    
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        print_message "Deteniendo procesos en puerto $port ($process_name)..."
        echo "$pids" | xargs kill 2>/dev/null || true
        
        # Esperar un momento
        sleep 2
        
        # Verificar si aún hay procesos
        local remaining_pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            print_warning "Forzando terminación de procesos en puerto $port..."
            echo "$remaining_pids" | xargs kill -9 2>/dev/null || true
        fi
        
        print_message "Procesos en puerto $port detenidos ✓"
    else
        print_message "No hay procesos ejecutándose en puerto $port"
    fi
}

# Detener backend
stop_backend() {
    print_header "DETENIENDO BACKEND"
    
    # Intentar detener por archivo PID primero
    stop_process "logs/backend.pid" "Backend"
    
    # Verificar puerto 3000 por si acaso
    stop_process_by_port 3000 "Backend"
}

# Detener frontend
stop_frontend() {
    print_header "DETENIENDO FRONTEND"
    
    # Intentar detener por archivo PID primero
    stop_process "logs/frontend.pid" "Frontend"
    
    # Verificar puertos comunes del frontend
    stop_process_by_port 5173 "Frontend"
    stop_process_by_port 5174 "Frontend"
}

# Limpiar archivos temporales
cleanup_temp_files() {
    print_header "LIMPIANDO ARCHIVOS TEMPORALES"
    
    # Limpiar archivos PID restantes
    if [ -f "logs/backend.pid" ]; then
        rm logs/backend.pid
        print_message "Archivo PID del backend eliminado"
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        rm logs/frontend.pid
        print_message "Archivo PID del frontend eliminado"
    fi
    
    # Limpiar archivos nohup.out si existen
    if [ -f "nohup.out" ]; then
        rm nohup.out
        print_message "Archivo nohup.out eliminado"
    fi
    
    if [ -f "backend/nohup.out" ]; then
        rm backend/nohup.out
        print_message "Archivo nohup.out del backend eliminado"
    fi
    
    if [ -f "frontend/nohup.out" ]; then
        rm frontend/nohup.out
        print_message "Archivo nohup.out del frontend eliminado"
    fi
    
    print_message "Limpieza completada ✓"
}

# Verificar que todo esté detenido
verify_shutdown() {
    print_header "VERIFICANDO CIERRE"
    
    local backend_running=false
    local frontend_running=false
    
    # Verificar puerto 3000 (backend)
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        backend_running=true
        print_warning "Aún hay procesos ejecutándose en puerto 3000"
    fi
    
    # Verificar puertos del frontend
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 || lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
        frontend_running=true
        print_warning "Aún hay procesos ejecutándose en puertos del frontend"
    fi
    
    if [ "$backend_running" = false ] && [ "$frontend_running" = false ]; then
        print_message "Todos los procesos han sido detenidos correctamente ✓"
        return 0
    else
        print_error "Algunos procesos aún están ejecutándose"
        return 1
    fi
}

# Mostrar estado final
show_final_status() {
    print_header "SISTEMA DETENIDO"
    
    echo -e "${GREEN}El Sistema de Venta de Software ha sido detenido exitosamente${NC}"
    echo ""
    echo -e "${BLUE}Para reiniciar el sistema:${NC}"
    echo -e "  🚀 Ejecuta: ${YELLOW}./scripts/start.sh${NC}"
    echo ""
    echo -e "${BLUE}Para ver los logs:${NC}"
    echo -e "  📄 Backend: ${YELLOW}tail -f logs/backend.log${NC}"
    echo -e "  📄 Frontend: ${YELLOW}tail -f logs/frontend.log${NC}"
    echo ""
    echo -e "${BLUE}Para reinstalar:${NC}"
    echo -e "  🔧 Ejecuta: ${YELLOW}./scripts/install.sh${NC}"
    echo ""
}

# Función principal
main() {
    print_header "DETENIENDO SISTEMA DE VENTA DE SOFTWARE"
    echo -e "${BLUE}Autor: Eddy Alexander Ramirez Lorenzana${NC}"
    echo -e "${BLUE}Versión: 1.0.0${NC}"
    echo ""
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
        print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        print_error "Asegúrate de estar en la carpeta 'software-sales-system'"
        exit 1
    fi
    
    # Crear directorio de logs si no existe
    if [ ! -d "logs" ]; then
        mkdir -p logs
    fi
    
    print_message "Iniciando proceso de cierre del sistema..."
    echo ""
    
    # Ejecutar pasos de cierre
    stop_backend
    stop_frontend
    cleanup_temp_files
    
    if verify_shutdown; then
        show_final_status
    else
        print_error "El cierre no fue completamente exitoso. Algunos procesos pueden seguir ejecutándose."
        echo ""
        echo -e "${YELLOW}Para forzar la terminación de todos los procesos relacionados:${NC}"
        echo -e "  pkill -f 'node.*server.js'"
        echo -e "  pkill -f 'vite'"
        exit 1
    fi
}

# Función para mostrar ayuda
show_help() {
    echo "Script para detener el Sistema de Venta de Software"
    echo ""
    echo "Uso: $0 [opciones]"
    echo ""
    echo "Opciones:"
    echo "  -h, --help     Mostrar esta ayuda"
    echo "  -f, --force    Forzar terminación de todos los procesos"
    echo ""
    echo "Ejemplos:"
    echo "  $0              Detener el sistema normalmente"
    echo "  $0 --force      Forzar terminación de todos los procesos"
}

# Función para forzar terminación
force_stop() {
    print_header "FORZANDO TERMINACIÓN DE PROCESOS"
    
    print_message "Terminando todos los procesos de Node.js relacionados..."
    pkill -f 'node.*server.js' 2>/dev/null || true
    pkill -f 'vite' 2>/dev/null || true
    pkill -f 'npm.*start' 2>/dev/null || true
    pkill -f 'npm.*dev' 2>/dev/null || true
    
    # Terminar procesos en puertos específicos
    stop_process_by_port 3000 "Backend"
    stop_process_by_port 5173 "Frontend"
    stop_process_by_port 5174 "Frontend"
    
    cleanup_temp_files
    
    print_message "Terminación forzada completada ✓"
}

# Procesar argumentos de línea de comandos
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -f|--force)
        force_stop
        exit 0
        ;;
    "")
        main "$@"
        ;;
    *)
        print_error "Opción desconocida: $1"
        show_help
        exit 1
        ;;
esac


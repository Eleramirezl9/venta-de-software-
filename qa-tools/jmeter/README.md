# JMeter Performance Tests - Sistema de Venta de Software

## 📁 Estructura de Carpetas
```
qa-tools/jmeter/
├── test-plans/           # Planes de prueba .jmx
├── test-data/           # Datos de prueba .csv
├── results/             # Resultados de ejecución
├── reports/             # Reportes HTML generados
├── scripts/             # Scripts de automatización
└── configs/             # Configuraciones adicionales
```

## 🚀 Instalación y Setup

### Requisitos:
1. **JMeter 5.6+** instalado
2. **Java 8+** configurado
3. **Backend corriendo** en puerto 3000

### Variables de entorno necesarias:
- `JMETER_HOME`: Ruta de instalación de JMeter
- `JAVA_HOME`: Ruta de instalación de Java

## 📊 Planes de Prueba Disponibles

### 1. **basic-performance-test.jmx**
- **Objetivo**: Prueba básica de rendimiento
- **Usuarios**: 10-50 concurrentes
- **Duración**: 5 minutos
- **Escenarios**: Login, productos, carrito básico

### 2. **stress-test.jmx**
- **Objetivo**: Prueba de estrés del sistema
- **Usuarios**: 100-200 concurrentes  
- **Duración**: 10 minutos
- **Escenarios**: Carga pesada en todos los endpoints

### 3. **spike-test.jmx**
- **Objetivo**: Prueba de picos de carga
- **Usuarios**: 500+ concurrentes
- **Duración**: 2 minutos
- **Escenarios**: Carga extrema repentina

## 🎯 Cómo Ejecutar

### Modo GUI (Desarrollo):
```bash
cd qa-tools/jmeter
jmeter -t test-plans/basic-performance-test.jmx
```

### Modo CLI (Producción):
```bash
# Ejecutar prueba básica
jmeter -n -t test-plans/basic-performance-test.jmx -l results/basic-test-results.jtl -e -o reports/basic-report

# Ejecutar prueba de estrés
jmeter -n -t test-plans/stress-test.jmx -l results/stress-test-results.jtl -e -o reports/stress-report
```

### Scripts automatizados:
```bash
# Windows
scripts/run-basic-test.bat
scripts/run-stress-test.bat

# Linux/Mac
scripts/run-basic-test.sh
scripts/run-stress-test.sh
```

## 📈 Interpretación de Resultados

### Métricas Clave:
- **Response Time**: < 200ms excelente, < 500ms aceptable
- **Throughput**: requests/segundo
- **Error Rate**: < 1% aceptable
- **90th Percentile**: Tiempo de respuesta del 90% de requests

### Archivos Generados:
- `results/*.jtl`: Datos raw de la ejecución
- `reports/*`: Reportes HTML interactivos
- `jmeter.log`: Log detallado de JMeter

## 🔧 Configuración del Sistema

### Backend Configuration:
- **URL Base**: http://localhost:3000
- **Puerto**: 3000
- **Base de Datos**: SQLite (./database/software_sales.db)
- **JWT**: Tokens válidos por 7 días

### Test Data:
- **Usuarios**: 100 usuarios de prueba
- **Productos**: Datos reales de la BD
- **Credenciales**: demo@example.com / 123456

## 📊 Monitoreo Durante Pruebas

### Métricas del Sistema:
```bash
# CPU y Memoria
top -p $(pgrep -f "node.*server.js")

# Conexiones de red
netstat -an | grep :3000

# Base de datos
sqlite3 database/software_sales.db ".schema"
```

### Logs a Revisar:
- `logs/backend.log`: Errores del backend
- `jmeter.log`: Errores de JMeter
- Sistema: CPU, memoria, disco

## 🚨 Troubleshooting

### Errores Comunes:
1. **Connection Refused**: Backend no corriendo
2. **401 Unauthorized**: Token JWT inválido
3. **500 Internal Server**: Error en la aplicación
4. **OutOfMemory**: Aumentar heap de JMeter: `JVM_ARGS="-Xms1g -Xmx4g"`

### Soluciones:
```bash
# Verificar backend
curl http://localhost:3000/health

# Verificar JMeter
jmeter --version

# Limpiar resultados
rm -rf results/* reports/*
```

## 📋 Checklist Pre-Ejecución

- [ ] Backend corriendo en puerto 3000
- [ ] Base de datos inicializada con seed data
- [ ] JMeter instalado y configurado
- [ ] Usuarios de prueba creados
- [ ] Puertos disponibles (3000, 5173)
- [ ] Espacio en disco para resultados

---

**Autor**: Eddy Alexander Ramirez Lorenzana  
**Fecha**: 06/09/2025  
**Versión**: 1.0.0
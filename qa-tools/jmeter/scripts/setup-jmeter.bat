@echo off
REM ==============================================
REM Script de Configuración Inicial - JMeter
REM Autor: Eddy Alexander Ramirez Lorenzana
REM Sistema: CISNET - Venta de Software
REM ==============================================

title JMeter - Configuracion Inicial

echo.
echo ================================================
echo   CISNET - CONFIGURACIÓN INICIAL DE JMETER
echo   Sistema de Venta de Software
echo ================================================
echo.

echo [INFO] Este script te ayudará a configurar JMeter para las pruebas
echo [INFO] del sistema CISNET de venta de software
echo.

REM Variables
set SCRIPT_DIR=%~dp0
set JMETER_DIR=%SCRIPT_DIR%..

echo [STEP 1/6] Verificando estructura de carpetas...

REM Crear estructura de carpetas necesarias
if not exist "%JMETER_DIR%\test-plans" mkdir "%JMETER_DIR%\test-plans"
if not exist "%JMETER_DIR%\test-data" mkdir "%JMETER_DIR%\test-data"
if not exist "%JMETER_DIR%\results" mkdir "%JMETER_DIR%\results"
if not exist "%JMETER_DIR%\reports" mkdir "%JMETER_DIR%\reports"
if not exist "%JMETER_DIR%\logs" mkdir "%JMETER_DIR%\logs"
if not exist "%JMETER_DIR%\configs" mkdir "%JMETER_DIR%\configs"

echo [OK] Estructura de carpetas creada
echo   ✅ test-plans/    - Planes de prueba .jmx
echo   ✅ test-data/     - Datos de prueba .csv
echo   ✅ results/       - Resultados de ejecución .jtl
echo   ✅ reports/       - Reportes HTML generados
echo   ✅ logs/          - Logs detallados
echo   ✅ configs/       - Configuraciones adicionales

echo.
echo [STEP 2/6] Verificando instalación de JMeter...

REM Verificar JMeter
jmeter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] ❌ JMeter no está instalado o no está en el PATH
    echo.
    echo [INSTALL] Para instalar JMeter:
    echo   1. Ve a: https://jmeter.apache.org/download_jmeter.cgi
    echo   2. Descarga "Apache JMeter 5.6" (archivo .zip)
    echo   3. Extrae a: C:\apache-jmeter-5.6\
    echo   4. Agrega al PATH: C:\apache-jmeter-5.6\bin\
    echo   5. Reinicia la terminal y ejecuta este script nuevamente
    echo.
    echo [INFO] Variables de entorno necesarias:
    echo   JAVA_HOME = ruta de Java (ej: C:\Program Files\Java\jdk-17)
    echo   JMETER_HOME = ruta de JMeter (ej: C:\apache-jmeter-5.6)
    echo   PATH = debe incluir %%JMETER_HOME%%\bin
    echo.
    pause
    exit /b 1
)

REM Mostrar versión de JMeter
for /f "tokens=*" %%i in ('jmeter --version 2^>^&1') do (
    echo [OK] ✅ %%i
    goto :jmeter_found
)
:jmeter_found

echo.
echo [STEP 3/6] Verificando instalación de Java...

REM Verificar Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] ❌ Java no está instalado
    echo [INSTALL] Para instalar Java:
    echo   1. Ve a: https://adoptium.net/temurin/releases/
    echo   2. Descarga Java 17 LTS para Windows
    echo   3. Instala y configura JAVA_HOME
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr "version"') do (
    echo [OK] ✅ %%i
    goto :java_found
)
:java_found

echo.
echo [STEP 4/6] Verificando backend de CISNET...

echo [INFO] Verificando conexión al backend...
curl -s -f http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARN] ⚠️  Backend no está corriendo en puerto 3000
    echo [INFO] Para iniciar el backend:
    echo   1. Abre una nueva terminal
    echo   2. Ve a: %JMETER_DIR%\..\backend\
    echo   3. Ejecuta: npm install (solo la primera vez)
    echo   4. Ejecuta: npm start
    echo   5. Verifica en: http://localhost:3000/health
    echo.
    set /p startBackend="¿El backend está corriendo en otra terminal? (s/n): "
    if /i not "%startBackend%"=="s" (
        echo [INFO] Inicia el backend primero y ejecuta este script nuevamente
        pause
        exit /b 1
    )
) else (
    echo [OK] ✅ Backend respondiendo en http://localhost:3000
)

echo.
echo [STEP 5/6] Verificando archivos de configuración...

REM Verificar archivos de datos
if exist "%JMETER_DIR%\test-data\users.csv" (
    echo [OK] ✅ Archivo de usuarios encontrado
) else (
    echo [WARN] ❌ Archivo de usuarios no encontrado: test-data\users.csv
    echo [INFO] Creando archivo de usuarios por defecto...
    echo email,password,firstName,lastName > "%JMETER_DIR%\test-data\users.csv"
    echo demo@example.com,123456,Demo,User >> "%JMETER_DIR%\test-data\users.csv"
    echo test1@example.com,password123,Test,User1 >> "%JMETER_DIR%\test-data\users.csv"
    echo [OK] ✅ Archivo de usuarios creado
)

if exist "%JMETER_DIR%\test-data\products.csv" (
    echo [OK] ✅ Archivo de productos encontrado
) else (
    echo [WARN] ❌ Archivo de productos no encontrado: test-data\products.csv
    echo [INFO] Creando archivo de productos por defecto...
    echo productId,productName,searchTerm,category,quantity > "%JMETER_DIR%\test-data\products.csv"
    echo 1,Windows 11 Pro,windows,Sistema Operativo,1 >> "%JMETER_DIR%\test-data\products.csv"
    echo 2,Office 365,office,Productividad,2 >> "%JMETER_DIR%\test-data\products.csv"
    echo [OK] ✅ Archivo de productos creado
)

if exist "%JMETER_DIR%\configs\jmeter-config.properties" (
    echo [OK] ✅ Archivo de configuración encontrado
) else (
    echo [WARN] ❌ Archivo de configuración no encontrado
    echo [INFO] Usa el archivo: configs\jmeter-config.properties
)

echo.
echo [STEP 6/6] Verificando scripts de ejecución...

if exist "%SCRIPT_DIR%\run-basic-test.bat" (
    echo [OK] ✅ Script de prueba básica encontrado
) else (
    echo [WARN] ❌ Script de prueba básica no encontrado
)

if exist "%SCRIPT_DIR%\run-stress-test.bat" (
    echo [OK] ✅ Script de prueba de estrés encontrado
) else (
    echo [WARN] ❌ Script de prueba de estrés no encontrado
)

echo.
echo ================================================
echo   CONFIGURACIÓN COMPLETADA
echo ================================================
echo.

echo [INFO] ✅ JMeter configurado correctamente para CISNET
echo.
echo [INFO] 📁 Estructura creada:
echo   %JMETER_DIR%\
echo   ├── test-plans\       (planes .jmx)
echo   ├── test-data\        (datos .csv)  
echo   ├── results\          (resultados .jtl)
echo   ├── reports\          (reportes HTML)
echo   ├── logs\             (logs detallados)
echo   ├── configs\          (configuraciones)
echo   └── scripts\          (automatización)

echo.
echo [INFO] 🎯 Próximos pasos:
echo   1. Asegúrate de que el backend esté corriendo
echo   2. Ejecuta prueba básica: scripts\run-basic-test.bat
echo   3. Para alta carga: scripts\run-stress-test.bat
echo   4. Revisa resultados en: reports\
echo.

echo [INFO] 📚 Documentación disponible:
echo   - README.md: Guía completa
echo   - scripts\jwt-setup-guide.md: Configuración JWT
echo   - configs\jmeter-config.properties: Variables del sistema
echo.

echo [INFO] 🔧 Comandos útiles:
echo   - Backend health: curl http://localhost:3000/health
echo   - JMeter GUI: jmeter (para crear/editar planes)
echo   - Ver logs: type logs\basic-test-YYYYMMDD_HHMMSS.log
echo.

set /p testNow="¿Ejecutar una prueba básica ahora? (s/n): "
if /i "%testNow%"=="s" (
    echo [INFO] Iniciando prueba básica...
    call "%SCRIPT_DIR%\run-basic-test.bat"
) else (
    echo [INFO] Configuración lista. Ejecuta las pruebas cuando necesites.
)

echo.
echo [INFO] ✅ Setup completado. ¡JMeter listo para pruebas de CISNET!
pause
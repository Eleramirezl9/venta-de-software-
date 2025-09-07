@echo off
REM ==============================================
REM Script de Ejecución de Prueba de Estrés - JMeter
REM Autor: Eddy Alexander Ramirez Lorenzana
REM Sistema: CISNET - Venta de Software
REM ==============================================

title JMeter - Prueba de Estres

echo.
echo ================================================
echo   CISNET - PRUEBA DE ESTRES DEL SISTEMA
echo   Sistema de Venta de Software
echo   ⚠️  PRUEBA DE ALTA CARGA ⚠️
echo ================================================
echo.

REM Configuración de variables
set SCRIPT_DIR=%~dp0
set JMETER_DIR=%SCRIPT_DIR%..
set TEST_PLAN=%JMETER_DIR%\test-plans\stress-test.jmx
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set RESULTS_FILE=%JMETER_DIR%\results\stress-test-%TIMESTAMP%.jtl
set REPORT_DIR=%JMETER_DIR%\reports\stress-report-%TIMESTAMP%
set LOG_FILE=%JMETER_DIR%\logs\stress-test-%TIMESTAMP%.log

REM Crear directorios si no existen
if not exist "%JMETER_DIR%\results" mkdir "%JMETER_DIR%\results"
if not exist "%JMETER_DIR%\reports" mkdir "%JMETER_DIR%\reports"
if not exist "%JMETER_DIR%\logs" mkdir "%JMETER_DIR%\logs"

echo [WARNING] ⚠️  ADVERTENCIA DE PRUEBA DE ESTRÉS ⚠️
echo.
echo Esta prueba generará ALTA CARGA en tu sistema:
echo   - 100+ usuarios concurrentes
echo   - 10 minutos de duración continua
echo   - Miles de requests HTTP
echo   - Alto uso de CPU, memoria y red
echo.
echo Asegúrate de que:
echo   ✅ El sistema está en un entorno de PRUEBAS
echo   ✅ No hay usuarios reales usando la aplicación
echo   ✅ Tienes recursos suficientes (CPU, RAM)
echo   ✅ Puedes monitorear el sistema durante la prueba
echo.

set /p confirm1="¿Entiendes que es una prueba de ALTA CARGA? (s/n): "
if /i not "%confirm1%"=="s" (
    echo [INFO] Prueba cancelada por seguridad
    echo [INFO] Para pruebas más ligeras, usa: run-basic-test.bat
    pause
    exit /b 0
)

echo [INFO] Verificando prerrequisitos...

REM Verificar que JMeter esté instalado
jmeter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] JMeter no está instalado o no está en el PATH
    echo [INFO] Instala JMeter y agregalo al PATH del sistema
    pause
    exit /b 1
)

REM Verificar configuración de JVM para JMeter
echo [INFO] Verificando configuración de JVM para alta carga...
echo [WARN] Para pruebas de estrés se recomienda:
echo   - JVM_ARGS="-Xms1g -Xmx4g -XX:NewRatio=3"
echo   - Cerrar aplicaciones innecesarias
echo   - Monitorear recursos del sistema
echo.

REM Verificar que el backend esté corriendo
echo [INFO] Verificando backend en http://localhost:3000...
curl -s -f http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Backend no está corriendo en puerto 3000
    echo [INFO] Inicia el backend con: npm start (desde la carpeta backend)
    pause
    exit /b 1
)

echo [OK] Backend respondiendo correctamente

REM Verificar respuesta rápida del backend
echo [INFO] Verificando tiempo de respuesta inicial...
for /f %%i in ('curl -w "%%{time_total}" -s -o nul http://localhost:3000/health') do set RESPONSE_TIME=%%i
echo [INFO] Tiempo de respuesta base: %RESPONSE_TIME% segundos

REM Verificar que existe el plan de pruebas
if not exist "%TEST_PLAN%" (
    echo [ERROR] No se encuentra el plan de pruebas: %TEST_PLAN%
    echo [INFO] Asegurate de que existe el archivo stress-test.jmx
    pause
    exit /b 1
)

echo.
echo [INFO] Configuración de la prueba de ESTRÉS:
echo   - Plan de prueba: stress-test.jmx
echo   - Usuarios concurrentes: 100-200
echo   - Duración: 10 minutos (600 segundos)
echo   - Ramp-up: 2 minutos (120 segundos)
echo   - Backend: http://localhost:3000
echo   - Escenarios: Login, productos, carrito, logout
echo.

echo [INFO] Archivos que se generarán:
echo   - Resultados: %RESULTS_FILE%
echo   - Reporte HTML: %REPORT_DIR%
echo   - Log detallado: %LOG_FILE%
echo.

echo [WARNING] Durante la prueba:
echo   ✅ Monitorea el uso de CPU y memoria
echo   ✅ Observa los logs del backend (logs/backend.log)
echo   ✅ Verifica que el sistema no se sobrecargue
echo   ⚠️  Si el sistema se vuelve inestable, presiona Ctrl+C
echo.

set /p confirm2="¿Continuar con la prueba de ESTRÉS? (s/n): "
if /i not "%confirm2%"=="s" (
    echo [INFO] Prueba cancelada
    pause
    exit /b 0
)

echo.
echo ================================================
echo   INICIANDO PRUEBA DE ESTRÉS
echo   ⏱️  Duración estimada: 12 minutos
echo ================================================
echo.

echo [INFO] Timestamp: %TIMESTAMP%
echo [INFO] Monitorea tu sistema durante la ejecución...
echo.

REM Mostrar configuración recomendada de monitoreo
echo [TIP] Para monitorear el sistema en paralelo:
echo   1. Abre Task Manager (Ctrl+Shift+Esc)
echo   2. Ve a la pestaña Performance
echo   3. Observa CPU, Memory y Network
echo   4. En otra terminal: tail -f logs/backend.log (si existe)
echo.

echo [EXEC] Iniciando prueba de estrés en 5 segundos...
timeout /t 5 >nul

echo [EXEC] Ejecutando JMeter con alta carga...
echo [INFO] Esto puede tomar varios minutos...

REM Ejecutar JMeter en modo no-GUI con configuración de alta carga
jmeter -n -t "%TEST_PLAN%" -l "%RESULTS_FILE%" -e -o "%REPORT_DIR%" -j "%LOG_FILE%" ^
       -Jjmeter.reportgenerator.overall_granularity=60000 ^
       -JVM_ARGS="-Xms1g -Xmx2g -XX:+UseG1GC"

REM Verificar si la ejecución fue exitosa
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] La prueba de estrés falló. Revisa el log: %LOG_FILE%
    echo [ERROR] Posibles causas:
    echo   - Sistema sobrecargado
    echo   - Backend caído por alta carga
    echo   - Memoria insuficiente
    echo   - Timeout de conexiones
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   PRUEBA DE ESTRÉS COMPLETADA
echo ================================================
echo.

echo [INFO] Archivos generados:
if exist "%RESULTS_FILE%" (
    echo   ✅ Resultados: %RESULTS_FILE%
    for %%I in ("%RESULTS_FILE%") do echo      Tamaño: %%~zI bytes
) else (
    echo   ❌ Archivo de resultados no encontrado
)

if exist "%REPORT_DIR%\index.html" (
    echo   ✅ Reporte HTML: %REPORT_DIR%\index.html
) else (
    echo   ❌ Reporte HTML no generado
)

echo.
echo [INFO] Análisis rápido de resultados:
if exist "%RESULTS_FILE%" (
    REM Contar líneas para estimar requests
    for /f %%C in ('find /c /v "" ^< "%RESULTS_FILE%"') do set REQUEST_COUNT=%%C
    set /a APPROX_RPS=%REQUEST_COUNT%/600
    echo   - Total requests ejecutados: %REQUEST_COUNT%
    echo   - Duración de la prueba: ~10 minutos
    echo   - Promedio aprox. requests/segundo: %APPROX_RPS%
)

echo.
echo [INFO] MÉTRICAS CRÍTICAS A REVISAR:
echo   📊 Response Time:
echo      - ^< 200ms: Excelente bajo estrés
echo      - ^< 500ms: Aceptable bajo estrés  
echo      - ^> 1000ms: Sistema bajo presión
echo.
echo   🔥 Error Rate:
echo      - 0-1%%: Sistema estable
echo      - 1-5%%: Estrés moderado
echo      - ^>5%%: Sistema sobrecargado
echo.
echo   ⚡ Throughput:
echo      - Requests/segundo sostenidos
echo      - Degradación durante la prueba
echo.

echo [INFO] Para ver el reporte detallado:
if exist "%REPORT_DIR%\index.html" (
    echo   🌐 Abre: %REPORT_DIR%\index.html
    echo   📈 Revisa especialmente:
    echo      - Response Times Over Time
    echo      - Active Threads Over Time  
    echo      - Hits per Second
    echo      - Response Times Percentiles
)

echo.
set /p openReport="¿Abrir reporte de estrés ahora? (s/n): "
if /i "%openReport%"=="s" (
    if exist "%REPORT_DIR%\index.html" (
        echo [INFO] Abriendo reporte de estrés...
        start "" "%REPORT_DIR%\index.html"
    ) else (
        echo [WARN] Reporte HTML no disponible
    )
)

echo.
echo [INFO] ✅ Prueba de estrés completada
echo [INFO] 📊 Revisa los resultados para identificar:
echo   - Límites de carga del sistema
echo   - Puntos de falla bajo estrés
echo   - Degradación de performance
echo   - Necesidades de optimización
echo.

echo [INFO] Para pruebas más extremas, considera crear un spike-test
echo.
pause
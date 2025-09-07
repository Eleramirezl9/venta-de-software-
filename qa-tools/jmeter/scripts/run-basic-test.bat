@echo off
REM ==============================================
REM Script de Ejecución de Prueba Básica - JMeter
REM Autor: Eddy Alexander Ramirez Lorenzana
REM Sistema: CISNET - Venta de Software
REM ==============================================

title JMeter - Prueba Basica de Performance

echo.
echo ================================================
echo   CISNET - PRUEBA BASICA DE PERFORMANCE
echo   Sistema de Venta de Software
echo ================================================
echo.

REM Configuración de variables
set SCRIPT_DIR=%~dp0
set JMETER_DIR=%SCRIPT_DIR%..
set TEST_PLAN=%JMETER_DIR%\test-plans\basic-performance-test.jmx
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set RESULTS_FILE=%JMETER_DIR%\results\basic-test-%TIMESTAMP%.jtl
set REPORT_DIR=%JMETER_DIR%\reports\basic-report-%TIMESTAMP%
set LOG_FILE=%JMETER_DIR%\logs\basic-test-%TIMESTAMP%.log

REM Crear directorios si no existen
if not exist "%JMETER_DIR%\results" mkdir "%JMETER_DIR%\results"
if not exist "%JMETER_DIR%\reports" mkdir "%JMETER_DIR%\reports"
if not exist "%JMETER_DIR%\logs" mkdir "%JMETER_DIR%\logs"

echo [INFO] Verificando prerrequisitos...

REM Verificar que JMeter esté instalado
jmeter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] JMeter no está instalado o no está en el PATH
    echo [INFO] Instala JMeter y agregalo al PATH del sistema
    echo [INFO] Descarga: https://jmeter.apache.org/download_jmeter.cgi
    pause
    exit /b 1
)

REM Verificar que el backend esté corriendo
echo [INFO] Verificando backend en http://localhost:3000...
curl -s -f http://localhost:3000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Backend no está corriendo en puerto 3000
    echo [INFO] Inicia el backend con: npm start (desde la carpeta backend)
    echo [INFO] Verifica que esté corriendo en: http://localhost:3000/health
    pause
    exit /b 1
)

echo [OK] Backend respondiendo correctamente
echo.

REM Verificar que existe el plan de pruebas
if not exist "%TEST_PLAN%" (
    echo [ERROR] No se encuentra el plan de pruebas: %TEST_PLAN%
    echo [INFO] Asegurate de que exists el archivo basic-performance-test.jmx
    pause
    exit /b 1
)

echo [INFO] Configuración de la prueba:
echo   - Plan de prueba: basic-performance-test.jmx
echo   - Usuarios concurrentes: 10
echo   - Duración: 5 minutos
echo   - Ramp-up: 30 segundos
echo   - Backend: http://localhost:3000
echo.

echo [INFO] Archivos que se generarán:
echo   - Resultados: %RESULTS_FILE%
echo   - Reporte HTML: %REPORT_DIR%
echo   - Log detallado: %LOG_FILE%
echo.

set /p confirm="¿Continuar con la prueba? (s/n): "
if /i not "%confirm%"=="s" (
    echo [INFO] Prueba cancelada
    pause
    exit /b 0
)

echo.
echo [INFO] Iniciando prueba básica de performance...
echo [INFO] Timestamp: %TIMESTAMP%
echo.

REM Ejecutar JMeter en modo no-GUI
echo [EXEC] Ejecutando JMeter...
jmeter -n -t "%TEST_PLAN%" -l "%RESULTS_FILE%" -e -o "%REPORT_DIR%" -j "%LOG_FILE%" -Jjmeter.reportgenerator.overall_granularity=60000

REM Verificar si la ejecución fue exitosa
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] La prueba falló. Revisa el log: %LOG_FILE%
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   PRUEBA COMPLETADA EXITOSAMENTE
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
    echo      Carpeta: %REPORT_DIR%
) else (
    echo   ❌ Reporte HTML no generado
)

if exist "%LOG_FILE%" (
    echo   ✅ Log detallado: %LOG_FILE%
    for %%I in ("%LOG_FILE%") do echo      Tamaño: %%~zI bytes
) else (
    echo   ❌ Archivo de log no encontrado
)

echo.
echo [INFO] Resumen rápido de resultados:
if exist "%RESULTS_FILE%" (
    echo [INFO] Analizando resultados...
    REM Contar líneas del archivo de resultados (aprox. número de requests)
    for /f %%C in ('find /c /v "" ^< "%RESULTS_FILE%"') do set REQUEST_COUNT=%%C
    echo   - Total requests ejecutados: %REQUEST_COUNT%
    echo   - Duración de la prueba: ~5 minutos
    echo   - Promedio requests/segundo: Aprox. %REQUEST_COUNT%/300 = calculalo manualmente
)

echo.
echo [INFO] Para ver el reporte detallado:
if exist "%REPORT_DIR%\index.html" (
    echo   1. Abre: %REPORT_DIR%\index.html
    echo   2. O ejecuta: start "" "%REPORT_DIR%\index.html"
)

echo.
echo [INFO] Métricas importantes a revisar:
echo   - Response Time (Tiempo de respuesta): ^< 500ms aceptable
echo   - Throughput (Rendimiento): requests/segundo
echo   - Error Rate (Tasa de errores): ^< 1%% ideal
echo   - 90th Percentile: Tiempo del 90%% de requests

echo.
set /p openReport="¿Abrir reporte HTML ahora? (s/n): "
if /i "%openReport%"=="s" (
    if exist "%REPORT_DIR%\index.html" (
        echo [INFO] Abriendo reporte...
        start "" "%REPORT_DIR%\index.html"
    ) else (
        echo [WARN] Reporte HTML no disponible
    )
)

echo.
echo [INFO] Prueba básica completada. Revisa los resultados!
echo [INFO] Para pruebas más intensivas, ejecuta: run-stress-test.bat
echo.
pause
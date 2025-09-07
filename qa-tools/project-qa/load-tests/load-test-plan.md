# Plan de Pruebas de Carga y Estrés - JMeter
## Sistema CISNET

**Fecha**: 06 de Septiembre de 2025  
**Analista QA**: Eddy Alexander Ramirez Lorenzana  
**Herramienta**: Apache JMeter  

---

## Configuración del Entorno

### URLs de Prueba
- **Base URL**: http://localhost:3000
- **Frontend URL**: http://localhost:5176

### Endpoints a Probar
1. **GET /** - Ruta raíz (funcionando ✅)
2. **GET /health** - Health check (funcionando ✅)
3. **GET /api/products** - Lista de productos (con errores 500 ⚠️)

---

## Escenarios de Prueba

### Escenario 1: Prueba de Carga Normal
- **Objetivo**: Verificar rendimiento bajo carga normal
- **Usuarios Concurrentes**: 20
- **Duración**: 5 minutos (300 segundos)
- **Ramp-up Period**: 60 segundos
- **Endpoints**: 
  - 40% GET /
  - 30% GET /health
  - 30% GET /api/products

### Escenario 2: Prueba de Estrés
- **Objetivo**: Encontrar punto de saturación del sistema
- **Usuarios Concurrentes**: Incremento gradual 20-200
- **Duración**: 10 minutos
- **Ramp-up Period**: 300 segundos (5 minutos)
- **Endpoints**: Misma distribución que carga normal

---

## Métricas a Recopilar

### Métricas de Rendimiento
1. **Tiempo de Respuesta**:
   - Promedio
   - Mediana (percentil 50)
   - Percentil 90
   - Percentil 95
   - Percentil 99
   - Máximo

2. **Throughput**:
   - Transacciones por segundo (TPS)
   - Hits por segundo

3. **Tasa de Error**:
   - Porcentaje de errores
   - Tipos de errores HTTP

4. **Recursos del Sistema**:
   - CPU del servidor
   - Memoria RAM
   - Conexiones de red

---

## Criterios de Aceptación

### Prueba de Carga (20 usuarios)
- ✅ Tiempo de respuesta promedio < 2 segundos
- ✅ Percentil 95 < 5 segundos
- ✅ Tasa de error < 1%
- ✅ Throughput > 10 TPS

### Prueba de Estrés
- 🎯 Identificar punto de saturación
- 📊 Documentar degradación de rendimiento
- 📈 Medir capacidad máxima sostenible

---

## Limitaciones Identificadas

### Problemas del Sistema Bajo Prueba
- **Endpoints de Autenticación**: Devuelven Error 500
- **Endpoints de Productos**: Devuelven Error 500
- **Endpoints Funcionales**: Solo / y /health funcionan correctamente

### Impacto en Pruebas de Carga
- Las pruebas se limitarán a endpoints funcionales
- Se documentará el impacto de los errores 500 en el rendimiento
- Se simulará carga realista con endpoints disponibles

---

## Scripts JMeter Generados

### 1. Basic Load Test (load-test-basic.jmx)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <TestPlan>
      <elementProp name="arguments" elementType="Arguments" guiclass="ArgumentsPanel">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">20</stringProp>
        <stringProp name="ThreadGroup.ramp_time">60</stringProp>
        <stringProp name="ThreadGroup.duration">300</stringProp>
        <boolProp name="ThreadGroup.scheduler">true</boolProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <HTTPSamplerProxy>
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
            <collectionProp name="Arguments.arguments"/>
          </elementProp>
          <stringProp name="HTTPSampler.domain">localhost</stringProp>
          <stringProp name="HTTPSampler.port">3000</stringProp>
          <stringProp name="HTTPSampler.protocol">http</stringProp>
          <stringProp name="HTTPSampler.path">/</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
        </HTTPSamplerProxy>
        <ResponseAssertion>
          <collectionProp name="Assertion.test_strings">
            <stringProp>200</stringProp>
          </collectionProp>
          <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
        </ResponseAssertion>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

---

## Resultados Esperados

### Baseline del Sistema (Estado Actual)
Basándome en las pruebas unitarias y de integración:

1. **Endpoints Funcionales** (/ y /health):
   - Responden en 4-5ms en pruebas unitarias
   - Deberían manejar carga ligera sin problemas

2. **Endpoints con Errores** (autenticación, productos):
   - Devuelven Error 500 inmediatamente
   - No consumen recursos significativos
   - Tasa de error: 100%

### Predicciones
- **Prueba de Carga**: Los endpoints funcionales deberían pasar
- **Prueba de Estrés**: Limitado por endpoints con errores
- **Capacidad Real**: Difícil de medir con errores del sistema

---

## Instrucciones de Ejecución

### Prerequisitos
1. Sistema CISNET ejecutándose (backend puerto 3000)
2. Apache JMeter instalado
3. Endpoints de prueba verificados

### Pasos
1. Abrir JMeter GUI
2. Cargar plan de prueba correspondiente
3. Configurar parámetros según escenario
4. Ejecutar prueba
5. Generar reportes

### Comandos CLI (Alternativo)
```bash
# Prueba de carga básica
jmeter -n -t load-test-basic.jmx -l results-load.jtl -e -o reports/load-test

# Prueba de estrés
jmeter -n -t stress-test.jmx -l results-stress.jtl -e -o reports/stress-test
```

---

## Notas Importantes

⚠️ **Limitación**: Debido a errores 500 en endpoints principales, las pruebas de carga se realizarán principalmente en endpoints básicos (/ y /health).

📊 **Valor**: Aun con limitaciones, las pruebas proporcionarán métricas valiosas sobre la infraestructura base del sistema.

🔧 **Recomendación**: Corregir errores de aplicación antes de pruebas de carga completas para obtener métricas reales de rendimiento.

---

*Plan preparado como parte del proyecto integral de QA - Software Sales System*
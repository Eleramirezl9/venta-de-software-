# Plan de Aseguramiento de la Calidad (QA)
## CISNET - Sistema de Venta de Software

**Fecha**: 06 de Septiembre de 2025  
**Analista QA**: Eddy Alexander Ramirez Lorenzana  
**Versión**: 1.0  
**Proyecto**: Sistema de Venta de Software con Arquitectura Hexagonal

---

## 1. Introducción y Objetivos

### 1.1 Propósito
Este plan define la estrategia, alcance y actividades de aseguramiento de la calidad para el sistema CISNET, con el objetivo de garantizar que cumpla con los requerimientos funcionales y no funcionales establecidos.

### 1.2 Objetivos Específicos
- Validar el 100% de los requerimientos funcionales documentados
- Asegurar la estabilidad del sistema bajo cargas normales y de estrés
- Verificar la integración correcta entre frontend y backend
- Implementar pruebas automatizadas para regresión
- Documentar métricas de calidad y rendimiento

### 1.3 Alcance del Proyecto
**Sistema bajo prueba**: CISNET - Sistema de Venta de Software v1.0
**Tecnologías**: React.js (Frontend), Node.js/Express (Backend), SQLite (Base de datos)
**Arquitectura**: Hexagonal/Clean Architecture

---

## 2. Alcance de las Pruebas

### 2.1 Módulos a Probar

#### 2.1.1 Módulos Incluidos
- ✅ **Autenticación**: Registro, Login, Logout, Recuperación de contraseña
- ✅ **Gestión de Productos**: Catálogo, Búsqueda, Filtros, Detalles
- ✅ **Carrito de Compras**: Agregar productos, Modificar cantidades, Eliminar items
- ✅ **Navegación y UI**: Header, Menús, Responsive design
- ✅ **APIs REST**: Endpoints de backend, Validaciones, Manejo de errores
- ✅ **Base de Datos**: Integridad de datos, Transacciones

#### 2.1.2 Módulos Excluidos
- ❌ **Pagos**: No implementado en la versión actual
- ❌ **Reportes**: No implementado en la versión actual
- ❌ **Administración**: No implementado en la versión actual

### 2.2 Funcionalidades Críticas
1. **Login/Logout de usuarios** (Prioridad: ALTA)
2. **Visualización de productos** (Prioridad: ALTA)
3. **Gestión de carrito** (Prioridad: ALTA)
4. **Búsqueda y filtros** (Prioridad: MEDIA)
5. **Persistencia de datos** (Prioridad: ALTA)

---

## 3. Tipos de Pruebas a Ejecutar

### 3.1 Pruebas Funcionales

#### 3.1.1 Pruebas Unitarias
- **Framework**: Jest (JavaScript)
- **Alcance**: Funciones utilitarias, Validaciones, Lógica de negocio
- **Cobertura objetivo**: 80%
- **Responsable**: QA Engineer

#### 3.1.2 Pruebas de Integración
- **Framework**: Supertest + Jest
- **Alcance**: APIs REST, Comunicación Frontend-Backend
- **Casos**: Flujos completos usuario-sistema
- **Responsable**: QA Engineer

### 3.2 Pruebas No Funcionales

#### 3.2.1 Pruebas de Carga
- **Herramienta**: Apache JMeter
- **Usuarios concurrentes**: 20 usuarios simultáneos
- **Duración**: 5 minutos
- **Métricas**: Tiempo de respuesta, Throughput, Tasa de error

#### 3.2.2 Pruebas de Estrés
- **Herramienta**: Apache JMeter
- **Usuarios concurrentes**: Incremento gradual 20-200 usuarios
- **Objetivo**: Encontrar punto de saturación
- **Métricas**: Capacidad máxima, Punto de falla, Recuperación

### 3.3 Pruebas Automatizadas

#### 3.3.1 Selenium WebDriver
- **Navegador**: Chrome (versión portable disponible)
- **Framework**: Selenium WebDriver con Python
- **Casos**: Login, Navegación, Formularios
- **Ejecución**: Manual y programada

---

## 4. Estrategia de Pruebas

### 4.1 Enfoque Manual vs Automatizada

| Tipo de Prueba | Manual | Automatizada | Justificación |
|----------------|---------|--------------|---------------|
| Unitarias | - | ✅ | Ejecución repetitiva, integración CI/CD |
| Integración | 30% | 70% | Flujos críticos automatizados |
| Funcionales UI | 70% | 30% | Exploración manual + scripts críticos |
| Carga/Estrés | - | ✅ | Imposible manual, datos precisos |
| Regresión | 20% | 80% | Automatización para eficiencia |

### 4.2 Herramientas de Testing

#### 4.2.1 Herramientas Principales
- **Jest**: Pruebas unitarias y de integración JavaScript
- **Selenium WebDriver**: Automatización de UI
- **Apache JMeter**: Pruebas de rendimiento
- **Supertest**: Testing de APIs REST
- **Chrome DevTools**: Debugging y análisis

#### 4.2.2 Herramientas de Apoyo
- **Git**: Control de versiones de tests
- **VSCode**: IDE para desarrollo de tests
- **Chrome Portable**: Navegador para Selenium
- **Excel/Sheets**: Documentación de casos y métricas

---

## 5. Cronograma de Ejecución

### 5.1 Fases del Proyecto (5 días)

#### Día 1: Preparación y Setup
- ✅ Documentación de requerimientos
- ✅ Plan de QA
- 🔄 Configuración de herramientas
- 🔄 Setup del entorno de pruebas

#### Día 2: Diseño y Casos de Prueba
- 📋 Diseño de casos de prueba
- 📋 Preparación de datos de prueba
- 📋 Configuración de Selenium

#### Día 3: Implementación de Pruebas
- 🧪 Desarrollo de pruebas unitarias
- 🧪 Desarrollo de pruebas de integración
- 🧪 Scripts de Selenium

#### Día 4: Pruebas de Rendimiento
- ⚡ Configuración de JMeter
- ⚡ Ejecución de pruebas de carga
- ⚡ Ejecución de pruebas de estrés

#### Día 5: Análisis y Documentación
- 📊 Análisis de resultados
- 📊 Generación de métricas
- 📊 Informe final

### 5.2 Criterios de Entrada y Salida

#### Criterios de Entrada
- ✅ Sistema desplegado y funcional
- ✅ Documentación de requerimientos completa
- ✅ Entorno de pruebas configurado
- ✅ Herramientas instaladas y verificadas

#### Criterios de Salida
- 📈 95% de casos de prueba ejecutados
- 📈 80% de casos de prueba aprobados
- 📈 Bugs críticos: 0
- 📈 Bugs altos: máximo 2
- 📈 Documentación completa entregada

---

## 6. Roles y Responsabilidades

### 6.1 Equipo de QA (1 persona)

#### QA Engineer - Eddy Alexander Ramirez Lorenzana
**Responsabilidades**:
- Diseño y ejecución de casos de prueba
- Desarrollo de scripts de automatización
- Configuración y ejecución de pruebas de rendimiento
- Análisis de resultados y métricas
- Documentación y reportes
- Comunicación de defectos y mejoras

### 6.2 Stakeholders

#### Developer/Product Owner
**Responsabilidades**:
- Resolución de defectos encontrados
- Clarificación de requerimientos
- Validación de criterios de aceptación

---

## 7. Gestión de Defectos

### 7.1 Clasificación de Severidad

| Severidad | Descripción | Ejemplo | Tiempo de Resolución |
|-----------|-------------|---------|---------------------|
| **CRÍTICA** | Sistema inoperable | Servidor no inicia | 24 horas |
| **ALTA** | Funcionalidad principal falla | Login no funciona | 48 horas |
| **MEDIA** | Funcionalidad secundaria falla | Filtro no aplica | 72 horas |
| **BAJA** | Problema cosmético/menor | Color de botón | 1 semana |

### 7.2 Estados de Defectos
1. **NUEVO**: Defecto reportado
2. **ASIGNADO**: En proceso de corrección
3. **RESUELTO**: Corrección implementada
4. **VERIFICADO**: Corrección validada
5. **CERRADO**: Defecto completamente resuelto

---

## 8. Métricas de Calidad

### 8.1 Métricas de Pruebas
- **Cobertura de Requerimientos**: (Requerimientos probados / Total requerimientos) × 100
- **Tasa de Éxito**: (Casos aprobados / Total casos ejecutados) × 100
- **Densidad de Defectos**: (Defectos encontrados / Casos ejecutados) × 100
- **Eficiencia de Detección**: (Defectos encontrados en pruebas / Total defectos) × 100

### 8.2 Métricas de Rendimiento
- **Tiempo de Respuesta**: Promedio y percentiles (90%, 95%, 99%)
- **Throughput**: Transacciones por segundo
- **Capacidad Máxima**: Usuarios concurrentes máximos
- **Tasa de Error**: (Errores / Total requests) × 100

---

## 9. Riesgos y Mitigación

### 9.1 Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Incompatibilidad de herramientas | Media | Alto | Verificación previa, alternativas preparadas |
| Datos de prueba insuficientes | Baja | Medio | Generación automática, scripts de población |
| Entorno inestable | Media | Alto | Monitoreo continuo, backup de configuraciones |

### 9.2 Riesgos de Cronograma

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Retrasos en corrección de bugs | Alta | Medio | Priorización clara, comunicación temprana |
| Complejidad subestimada | Media | Alto | Buffer de tiempo, escalación temprana |

---

## 10. Entregables

### 10.1 Documentación
1. ✅ **Requerimientos Funcionales** (15 requerimientos)
2. ✅ **Plan de QA** (este documento)
3. 📋 **Casos de Prueba** (mínimo 10 casos detallados)
4. 📊 **Reporte de Ejecución** (resultados y métricas)
5. 📈 **Informe Final** (conclusiones y recomendaciones)

### 10.2 Artefactos Técnicos
1. 🧪 **Suite de Pruebas Unitarias** (Jest)
2. 🔄 **Scripts de Integración** (Supertest)
3. 🤖 **Scripts de Selenium** (Python/WebDriver)
4. ⚡ **Planes de JMeter** (carga y estrés)
5. 📊 **Dashboard de Métricas** (Excel/Sheets)

---

## Aprobaciones

**QA Lead**: Eddy Alexander Ramirez Lorenzana - 06/09/2025

*Este plan será revisado y actualizado según sea necesario durante la ejecución del proyecto.*
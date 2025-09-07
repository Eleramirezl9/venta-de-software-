# 🚀 QUICK START - JMeter para CISNET

## ⚡ Configuración Ultra-Rápida

### 1️⃣ **Instalar JMeter** (Si no lo tienes)
```bash
# Descargar de: https://jmeter.apache.org/download_jmeter.cgi
# Extraer a: C:\apache-jmeter-5.6\
# Agregar al PATH: C:\apache-jmeter-5.6\bin\
```

### 2️⃣ **Configurar tu Sistema**
```bash
cd qa-tools/jmeter/scripts
setup-jmeter.bat
```

### 3️⃣ **Iniciar Backend** (En otra terminal)
```bash
cd backend
npm start
# Debe responder en: http://localhost:3000/health
```

### 4️⃣ **Ejecutar Pruebas**
```bash
# Prueba básica (10 usuarios, 5 min)
scripts\run-basic-test.bat

# Prueba de estrés (100+ usuarios, 10 min)  
scripts\run-stress-test.bat
```

---

## 🎯 **Cómo Funciona el JWT_SECRET**

Tu `JWT_SECRET=tu_jwt_secret_muy_seguro_cambialo_en_produccion_1757184406` se usa **automáticamente**:

1. **JMeter hace login** → Backend genera token con tu secret
2. **JMeter extrae token** → Lo guarda en variable `${JWT_TOKEN}`
3. **JMeter usa token** → En header `Authorization: Bearer ${JWT_TOKEN}`
4. **Backend valida** → Usando el mismo secret automáticamente

### No necesitas configurar el secret en JMeter, ¡funciona automáticamente!

---

## 📊 **Resultados Instantáneos**

Después de ejecutar las pruebas:

### 📁 **Archivos Generados:**
```
results/
├── basic-test-20250906_164530.jtl      # Datos raw
└── stress-test-20250906_170145.jtl     # Datos raw

reports/
├── basic-report-20250906_164530/        # Reporte HTML
│   └── index.html                       # ← ABRE ESTE
└── stress-report-20250906_170145/       # Reporte HTML
    └── index.html                       # ← ABRE ESTE
```

### 🔍 **Métricas Clave:**
- **Response Time**: < 500ms = ✅ Bueno
- **Error Rate**: < 1% = ✅ Excelente  
- **Throughput**: requests/segundo
- **90th Percentile**: Tiempo del 90% de requests

---

## 🛠️ **Endpoints Testeados**

### 🔐 **Autenticación:**
- `POST /api/auth/login` → Obtiene JWT
- `GET /api/auth/profile` → Valida JWT
- `POST /api/auth/logout` → Cierra sesión

### 🛍️ **Productos:**
- `GET /api/products` → Lista productos
- `GET /api/products/search?q=office` → Busca productos  
- `GET /api/products/1` → Producto específico

### 🛒 **Carrito:**
- `GET /api/cart` → Ver carrito
- `POST /api/cart/items` → Agregar producto
- `PUT /api/cart/items/1` → Actualizar cantidad

---

## 🚨 **Troubleshooting Rápido**

### ❌ **Backend no responde**
```bash
# Verificar que está corriendo
curl http://localhost:3000/health

# Si no responde
cd backend
npm start
```

### ❌ **JMeter no instalado**
```bash
# Verificar instalación
jmeter --version

# Si falla, descargar de:
# https://jmeter.apache.org/download_jmeter.cgi
```

### ❌ **401 Unauthorized**
```
✅ El JWT se maneja automáticamente
✅ Tu backend usa el secret correcto
✅ Solo asegúrate de que el login sea exitoso
```

---

## 📈 **Escalamiento de Pruebas**

### 🟢 **Básica**: 10 usuarios, 5 min
```bash
scripts\run-basic-test.bat
```

### 🟡 **Estrés**: 100 usuarios, 10 min  
```bash
scripts\run-stress-test.bat
```

### 🔴 **Personalizada**: Edita los .jmx
```bash
jmeter -t test-plans/basic-performance-test.jmx
```

---

## 💡 **Tips Importantes**

1. **JWT_SECRET** → Se usa automáticamente, no lo configures manualmente
2. **Backend primero** → Siempre inicia el backend antes de las pruebas
3. **Monitor recursos** → Usa Task Manager durante pruebas de estrés
4. **Reportes HTML** → Son interactivos y muy detallados
5. **Logs detallados** → En `logs/` si algo falla

---

## 🎯 **¡Ya está todo listo!**

1. ✅ **Ejecuta**: `scripts\setup-jmeter.bat`
2. ✅ **Inicia backend**: `cd backend && npm start`  
3. ✅ **Prueba básica**: `scripts\run-basic-test.bat`
4. ✅ **Ve resultados**: Abre `reports/*/index.html`

**¡Tu sistema CISNET está listo para pruebas de performance con JMeter!** 🚀
# 🔐 Guía Completa: Cómo Usar JWT en JMeter

## ❓ **¿Cómo Funciona el JWT_SECRET en tu Sistema?**

Tu backend usa el JWT_SECRET de dos formas:
1. **Generar tokens** cuando el usuario hace login
2. **Validar tokens** en endpoints protegidos

```javascript 
// En tu backend (automático):
// 1. Usuario hace login → Backend genera JWT con tu secret
// 2. Cliente recibe token → Lo guarda
// 3. Cliente hace request → Envía token en header Authorization
// 4. Backend valida → Usando el mismo JWT_SECRET
```

---

## 🎯 **Configuración Paso a Paso en JMeter**

### **PASO 1: Variables Globales**
```
// En JMeter User Defined Variables:
BASE_URL = http://localhost:3000
JWT_TOKEN = (vacío al inicio, se llena automáticamente)
USER_EMAIL = demo@example.com  
USER_PASSWORD = 123456
```

### **PASO 2: Flujo de Login (Obtener Token)**
```
HTTP Request: POST /api/auth/login
Body (JSON):
{
  "email": "${USER_EMAIL}",
  "password": "${USER_PASSWORD}"
}

Response (lo que devuelve tu backend):
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {...}
  }
}
```

### **PASO 3: Extraer Token (Post Processor)**
```javascript
// JSON Extractor en JMeter:
JSON Path: $.data.token
Variable Name: JWT_TOKEN
Match No: 1

// O usando BeanShell/JSR223:
import org.json.JSONObject;
String responseBody = prev.getResponseDataAsString();
JSONObject json = new JSONObject(responseBody);
String token = json.getJSONObject("data").getString("token");
vars.put("JWT_TOKEN", token);
log.info("JWT Token extraído: " + token.substring(0, 20) + "...");
```

### **PASO 4: Usar Token en Requests Protegidos**
```
HTTP Header Manager:
Authorization: Bearer ${JWT_TOKEN}

Ejemplo de request autenticado:
GET /api/cart
Headers:
  Authorization: Bearer ${JWT_TOKEN}
  Content-Type: application/json
```

---

## 🔧 **Configuración Completa en JMeter**

### **1. Test Plan Structure:**
```
📁 Test Plan
├── 🔧 User Defined Variables
├── 📊 Thread Group: "Authentication Flow"
│   ├── 🌐 HTTP Request: "Login"
│   ├── ⚙️ JSON Extractor: "Extract JWT Token"
│   └── ✅ Response Assertion: "Login Success"
├── 📊 Thread Group: "Authenticated Operations"
│   ├── 🔒 HTTP Header Manager: "JWT Authorization"
│   ├── 🌐 HTTP Request: "Get Profile"
│   ├── 🌐 HTTP Request: "Get Cart"
│   └── 🌐 HTTP Request: "Add to Cart"
└── 📈 Listeners
```

### **2. User Defined Variables:**
```
Variable Name          | Value
--------------------- | ----------------------------------
BASE_URL              | http://localhost:3000
JWT_TOKEN             | (empty - filled automatically)
USER_EMAIL            | demo@example.com
USER_PASSWORD         | 123456
PRODUCT_ID            | 1
CART_QUANTITY         | 1
```

### **3. HTTP Header Manager (Para requests autenticados):**
```
Name: Authorization
Value: Bearer ${JWT_TOKEN}
```

---

## 📋 **Script de Validación JWT**

Crea un **BeanShell PostProcessor** para validar el token:

```javascript
// Validar que el token se extrajo correctamente
String token = vars.get("JWT_TOKEN");

if (token == null || token.isEmpty()) {
    log.error("❌ JWT Token no se pudo extraer!");
    SampleResult.setSuccessful(false);
    SampleResult.setResponseMessage("JWT Token missing");
} else {
    log.info("✅ JWT Token extraído exitosamente");
    log.info("Token length: " + token.length());
    log.info("Token preview: " + token.substring(0, Math.min(30, token.length())) + "...");
    
    // Opcional: Decodificar el payload (solo para debug)
    try {
        String[] parts = token.split("\\.");
        if (parts.length == 3) {
            // El payload está en parts[1]
            byte[] payload = java.util.Base64.getUrlDecoder().decode(parts[1]);
            String payloadJson = new String(payload);
            log.info("JWT Payload: " + payloadJson);
        }
    } catch (Exception e) {
        log.warn("No se pudo decodificar JWT payload: " + e.getMessage());
    }
}
```

---

## 🚨 **Troubleshooting JWT**

### **Error: 401 Unauthorized**
```
❌ Problema: Token inválido o expirado
✅ Solución:
1. Verificar que el login fue exitoso
2. Revisar que el token se extrajo correctamente  
3. Verificar formato del header: "Bearer <token>"
4. Comprobar que el token no ha expirado (7 días según tu .env)
```

### **Error: Token no se extrae**
```
❌ Problema: JSON Path incorrecto
✅ Solución:
1. Verificar response del login: debe ser {"success": true, "data": {"token": "..."}}
2. JSON Path correcto: $.data.token
3. Verificar que no hay espacios en blanco
4. Usar Response Viewer para ver la respuesta exacta
```

### **Error: Header malformado**
```
❌ Problema: Authorization header incorrecto
✅ Formato correcto: 
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
❌ Formatos incorrectos:
   Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (falta "Bearer ")
   Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sobran ":")
```

---

## 🧪 **Test de Validación Rápida**

```bash
# 1. Probar login manual
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"123456"}'

# 2. Usar token en request protegido (reemplazar <TOKEN>)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 💡 **Tips Importantes**

1. **El JWT_SECRET se usa automáticamente** - No lo configures en JMeter, tu backend lo maneja
2. **Token expira en 7 días** - Para pruebas largas, renueva el login
3. **Un token por usuario** - Si usas múltiples usuarios, cada uno necesita su token
4. **Variables por Thread** - En pruebas concurrentes, cada hilo necesita su propio token

---

## 📊 **Ejemplo Completo de Request Autenticado**

```
Thread Group: "Authenticated Cart Operations"
├── HTTP Request: "Login to get JWT"
│   Method: POST
│   Path: /api/auth/login
│   Body: {"email":"${USER_EMAIL}","password":"${USER_PASSWORD}"}
│   
├── JSON Extractor: "Extract JWT Token" 
│   JSON Path: $.data.token
│   Variable: JWT_TOKEN
│   
├── HTTP Header Manager: "Add JWT to all requests"
│   Authorization: Bearer ${JWT_TOKEN}
│   
├── HTTP Request: "Add Product to Cart"
│   Method: POST  
│   Path: /api/cart/items
│   Body: {"productId":${PRODUCT_ID},"quantity":${CART_QUANTITY}}
│   
└── Response Assertion: "Cart Updated Successfully"
    Response Field: Text Response
    Pattern: "success.*true"
```

¿Te queda claro cómo funciona? ¡El JWT_SECRET se usa automáticamente en el backend, tú solo necesitas obtener y usar el token!

/**
 * Pruebas de Integración - Sistema Completo
 * Autor: Eddy Alexander Ramirez Lorenzana
 * Fecha: 06/09/2025
 */

const request = require('supertest');
const path = require('path');

// Configurar la ruta para importar el servidor
const backendPath = path.join(__dirname, '../../../backend');
process.chdir(backendPath);

// Importar el servidor después de cambiar el directorio  
const server = require('../../../backend/server.js');

describe('Pruebas de Integración - Sistema CISNET', () => {
  let app;

  beforeAll(async () => {
    // Esperar un poco para que la base de datos se inicialice
    await new Promise(resolve => setTimeout(resolve, 3000));
    app = server.app;
  });

  afterAll(async () => {
    if (server.server) {
      await server.stop();
    }
  });

  describe('Endpoints del Sistema', () => {
    test('GET / - Ruta raíz debe estar disponible', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('endpoints');
      
      // Verificar que los endpoints están documentados
      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('docs');
      expect(response.body.endpoints).toHaveProperty('auth');
      expect(response.body.endpoints).toHaveProperty('products');
      expect(response.body.endpoints).toHaveProperty('cart');
    });

    test('GET /health - Health check debe funcionar', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment', 'development');
      
      // Verificar que el timestamp es reciente (menos de 10 segundos)
      const timestamp = new Date(response.body.timestamp);
      const now = new Date();
      const diff = now - timestamp;
      expect(diff).toBeLessThan(10000); // 10 segundos
    });
  });

  describe('API de Productos', () => {
    test('GET /api/products - Debe devolver lista de productos', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Si hay productos, verificar estructura
      if (response.body.data.length > 0) {
        const product = response.body.data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
      }
    });

    test('GET /api/products?limit=6 - Debe limitar resultados', async () => {
      const response = await request(app)
        .get('/api/products?limit=6')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(6);
    });

    test('GET /api/products/categories - Debe devolver categorías', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/products/price-range - Debe devolver rango de precios', async () => {
      const response = await request(app)
        .get('/api/products/price-range')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('min');
      expect(response.body.data).toHaveProperty('max');
    });
  });

  describe('Búsqueda de Productos', () => {
    test('GET /api/products/search - Búsqueda sin parámetros', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
    });

    test('GET /api/products/search?page=1&limit=12 - Búsqueda con paginación', async () => {
      const response = await request(app)
        .get('/api/products/search?page=1&limit=12')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.data.length).toBeLessThanOrEqual(12);
      
      if (response.body.pagination) {
        expect(response.body.pagination).toHaveProperty('page', 1);
        expect(response.body.pagination).toHaveProperty('limit', 12);
      }
    });
  });

  describe('Detalle de Producto', () => {
    let productId;

    beforeAll(async () => {
      // Obtener un producto existente para probar el detalle
      const productsResponse = await request(app)
        .get('/api/products?limit=1');
      
      if (productsResponse.body.success && productsResponse.body.data.length > 0) {
        productId = productsResponse.body.data[0].id;
      }
    });

    test('GET /api/products/:id - Debe devolver detalle de producto existente', async () => {
      if (!productId) {
        console.log('No hay productos para probar detalle, saltando test');
        return;
      }

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', productId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('price');
    });

    test('GET /api/products/9999 - Debe devolver error para producto inexistente', async () => {
      const response = await request(app)
        .get('/api/products/9999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Documentación API', () => {
    test('GET /api-docs - Documentación Swagger debe estar disponible', async () => {
      const response = await request(app)
        .get('/api-docs/')
        .expect(301); // Redirección esperada de Swagger UI
    });
  });

  describe('Manejo de Errores', () => {
    test('GET /ruta-inexistente - Debe devolver 404', async () => {
      const response = await request(app)
        .get('/ruta-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    });

    test('GET /api/ruta-api-inexistente - Debe devolver 404', async () => {
      const response = await request(app)
        .get('/api/ruta-api-inexistente')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    });
  });
});
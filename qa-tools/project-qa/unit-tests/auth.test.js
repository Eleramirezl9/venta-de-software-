/**
 * Pruebas Unitarias - Autenticación
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

describe('Autenticación - API Tests', () => {
  let app;

  beforeAll(async () => {
    // Esperar un poco para que la base de datos se inicialice
    await new Promise(resolve => setTimeout(resolve, 2000));
    app = server.app;
  });

  afterAll(async () => {
    if (server.server) {
      await server.stop();
    }
  });

  describe('POST /api/auth/register', () => {
    const testUser = {
      name: 'Test User Unit',
      email: `testunit${Date.now()}@example.com`,
      password: '123456',
      confirmPassword: '123456'
    };

    test('Debe registrar un usuario válido exitosamente', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('Debe fallar con email duplicado', async () => {
      // Registrar el usuario una vez
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User Duplicate',
          email: 'duplicate@example.com',
          password: '123456',
          confirmPassword: '123456'
        });

      // Intentar registrar con el mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User Duplicate 2',
          email: 'duplicate@example.com',
          password: '123456',
          confirmPassword: '123456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Ya existe un usuario');
    });

    test('Debe fallar con contraseñas que no coinciden', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'mismatch@example.com',
          password: '123456',
          confirmPassword: '654321'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('Debe fallar con datos incompletos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          // email faltante
          password: '123456',
          confirmPassword: '123456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    const loginUser = {
      name: 'Login Test User',
      email: 'logintest@example.com',
      password: '123456',
      confirmPassword: '123456'
    };

    beforeAll(async () => {
      // Registrar usuario para las pruebas de login
      await request(app)
        .post('/api/auth/register')
        .send(loginUser);
    });

    test('Debe hacer login con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: loginUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login exitoso');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    test('Debe fallar con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Credenciales inválidas');
    });

    test('Debe fallar con email inexistente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: '123456'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    test('Debe fallar con datos incompletos', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email
          // password faltante
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /health', () => {
    test('Debe devolver estado de salud del sistema', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /', () => {
    test('Debe devolver información de la API', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });
});
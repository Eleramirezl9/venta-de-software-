require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Database = require('./src/shared/infrastructure/database/Database');
const ErrorHandler = require('./src/shared/infrastructure/middleware/ErrorHandler');
const AuthMiddleware = require('./src/shared/infrastructure/middleware/AuthMiddleware');

// Controladores
const AuthController = require('./src/auth/infrastructure/controllers/AuthController');
const ProductController = require('./src/products/infrastructure/controllers/ProductController');
const CartController = require('./src/cart/infrastructure/controllers/CartController');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        // Inicializar controladores
        this.authController = new AuthController();
        this.productController = new ProductController();
        this.cartController = new CartController();
        
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        // Seguridad
        this.app.use(helmet());
        
        // CORS
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
            credentials: true
        }));
        
        // Logging
        if (process.env.NODE_ENV !== 'test') {
            this.app.use(morgan('combined'));
        }
        
        // Parseo de JSON
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // Archivos estáticos
        this.app.use('/images', express.static('public/images'));
    }

    initializeRoutes() {
        // Ruta raíz - API Principal  
        this.app.get('/', (req, res) => {
            res.json({
                message: 'CISNET API - Sistema de Venta de Software',
                version: '1.0.0',
                status: 'OK',
                timestamp: new Date().toISOString(),
                endpoints: {
                    health: '/health',
                    docs: '/api-docs',
                    auth: '/api/auth/*',
                    products: '/api/products/*',
                    cart: '/api/cart/*'
                }
            });
        });

        // Ruta de salud
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development'
            });
        });

        // Rutas de autenticación
        this.app.post('/api/auth/register', this.authController.register);
        this.app.post('/api/auth/login', this.authController.login);
        this.app.post('/api/auth/recover', this.authController.recover);
        this.app.post('/api/auth/reset-password', this.authController.resetPassword);
        this.app.post('/api/auth/logout', AuthMiddleware.authenticate(), this.authController.logout);
        this.app.get('/api/auth/profile', AuthMiddleware.authenticate(), this.authController.profile);

        // Rutas de productos (públicas)
        this.app.get('/api/products', this.productController.getAll);
        this.app.get('/api/products/search', this.productController.search);
        this.app.get('/api/products/categories', this.productController.getCategories);
        this.app.get('/api/products/price-range', this.productController.getPriceRange);
        this.app.get('/api/products/:id', this.productController.getById);

        // Rutas de carrito (requieren autenticación)
        this.app.get('/api/cart', AuthMiddleware.authenticate(), this.cartController.getCart);
        this.app.post('/api/cart/items', AuthMiddleware.authenticate(), this.cartController.addItem);
        this.app.put('/api/cart/items/:id', AuthMiddleware.authenticate(), this.cartController.updateItem);
        this.app.delete('/api/cart/items/:id', AuthMiddleware.authenticate(), this.cartController.removeItem);
        this.app.delete('/api/cart', AuthMiddleware.authenticate(), this.cartController.clearCart);
    }

    initializeSwagger() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'CISNET API',
                    version: '1.0.0',
                    description: 'API para sistema de venta de software con arquitectura hexagonal',
                    contact: {
                        name: 'Eddy Alexander Ramirez Lorenzana',
                        email: 'eddy@example.com'
                    }
                },
                servers: [
                    {
                        url: `http://localhost:${this.port}`,
                        description: 'Servidor de desarrollo'
                    }
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        }
                    }
                }
            },
            apis: ['./src/**/*.js'] // Rutas a los archivos que contienen definiciones de OpenAPI
        };

        const specs = swaggerJsdoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    initializeErrorHandling() {
        // Middleware para rutas no encontradas
        this.app.use(ErrorHandler.notFound());
        
        // Middleware global de manejo de errores
        this.app.use(ErrorHandler.handle());
    }

    async start() {
        try {
            // Conectar a la base de datos
            await Database.connect();
            console.log('✅ Base de datos conectada');
            
            // Iniciar servidor
            this.server = this.app.listen(this.port, '0.0.0.0', () => {
                console.log(`🚀 Servidor ejecutándose en http://localhost:${this.port}`);
                console.log(`📚 Documentación API disponible en http://localhost:${this.port}/api-docs`);
                console.log(`🏥 Health check disponible en http://localhost:${this.port}/health`);
                console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
            });
        } catch (error) {
            console.error('❌ Error iniciando el servidor:', error);
            process.exit(1);
        }
    }

    async stop() {
        try {
            if (this.server) {
                this.server.close();
                console.log('🛑 Servidor detenido');
            }
            
            await Database.close();
            console.log('🔌 Base de datos desconectada');
        } catch (error) {
            console.error('❌ Error deteniendo el servidor:', error);
        }
    }
}

// Manejo de señales del sistema
const server = new Server();

process.on('SIGTERM', async () => {
    console.log('📡 SIGTERM recibido, cerrando servidor...');
    await server.stop();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('📡 SIGINT recibido, cerrando servidor...');
    await server.stop();
    process.exit(0);
});

// Iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    server.start();
}

module.exports = server;


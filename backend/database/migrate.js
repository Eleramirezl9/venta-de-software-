const Database = require('../src/shared/infrastructure/database/Database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    try {
        await Database.connect();
        
        // Crear tabla de usuarios
        await Database.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de productos
        await Database.run(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category VARCHAR(50) NOT NULL,
                version VARCHAR(20),
                compatibility VARCHAR(100),
                image_url VARCHAR(255),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear tabla de items del carrito
        await Database.run(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                UNIQUE(user_id, product_id)
            )
        `);

        // Crear índices para mejorar rendimiento
        await Database.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
        await Database.run(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
        await Database.run(`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`);
        await Database.run(`CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id)`);

        console.log('✅ Migraciones ejecutadas exitosamente');
        
    } catch (error) {
        console.error('❌ Error ejecutando migraciones:', error);
        process.exit(1);
    } finally {
        await Database.close();
    }
}

// Ejecutar migraciones si se llama directamente
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };


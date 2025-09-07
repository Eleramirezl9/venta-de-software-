const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const dbPath = process.env.DB_PATH || './database/software_sales.db';
            const fullPath = path.resolve(dbPath);
            
            this.db = new sqlite3.Database(fullPath, (err) => {
                if (err) {
                    console.error('Error conectando a la base de datos:', err.message);
                    reject(err);
                } else {
                    console.log('Conectado a la base de datos SQLite');
                    this.enableForeignKeys();
                    resolve(this.db);
                }
            });
        });
    }

    enableForeignKeys() {
        this.db.run('PRAGMA foreign_keys = ON');
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Conexión a la base de datos cerrada');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }

    getConnection() {
        return this.db;
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = new Database();


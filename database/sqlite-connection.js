import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// SQLite connection pool equivalent
class SQLitePool {
    constructor() {
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            this.db = await open({
                filename: './database/learnex.db',
                driver: sqlite3.Database
            });
        }
        return {
            query: async (sql, params = []) => {
                try {
                    if (sql.trim().toLowerCase().startsWith('select')) {
                        const rows = await this.db.all(sql, params);
                        return { rows };
                    } else {
                        const result = await this.db.run(sql, params);
                        return { rows: [], rowCount: result.changes };
                    }
                } catch (error) {
                    throw error;
                }
            },
            release: () => {
                // SQLite doesn't need connection release like PostgreSQL
            }
        };
    }

    async end() {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}

export const sqlitePool = new SQLitePool();

// Test connection
export async function testSQLiteConnection() {
    try {
        const client = await sqlitePool.connect();
        const result = await client.query('SELECT 1 as test');
        console.log('✅ Conexión a SQLite exitosa');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a SQLite:', error.message);
        return false;
    }
}
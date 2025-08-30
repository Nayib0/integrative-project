import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
    host:       "localhost",
    database:   "learnex",         // Database name in PostgreSQL
    port:       5432,              // PostgreSQL default port
    user:       "postgres",        // PostgreSQL user
    password:   "postgres",     // Password
    max:        10,                // maximum active connections
    idleTimeoutMillis: 30000,      // maximum downtime before closing
    connectionTimeoutMillis: 2000  // connection wait time
});

async function DataBaseConnection() {
    try {
        const client = await pool.connect();
        console.log("✅ Connection to PostgreSQL successful");
        client.release(); // liberar conexión al pool
    } catch (error) {
        console.error("❌ Error connecting to PostgreSQL:", error.message);
    }
}

DataBaseConnection();

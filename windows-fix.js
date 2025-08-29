/**
 * Windows Database Fix - Same credentials as original
 */

const { Pool } = require('pg');

// Try different common PostgreSQL configurations for Windows
const configs = [
    { user: 'postgres', password: '123456', database: 'learnex', host: 'localhost', port: 5432 },
    { user: 'postgres', password: 'postgres', database: 'learnex', host: 'localhost', port: 5432 },
    { user: 'postgres', password: 'admin', database: 'learnex', host: 'localhost', port: 5432 },
    { user: 'postgres', password: '', database: 'learnex', host: 'localhost', port: 5432 }
];

async function testConnection() {
    console.log('🔍 Probando conexiones a PostgreSQL...');
    
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        console.log(`\n${i + 1}. Probando: usuario=postgres, password=${config.password || '(vacía)'}`);
        
        try {
            const pool = new Pool(config);
            await pool.query('SELECT 1');
            console.log('✅ ¡CONEXIÓN EXITOSA!');
            console.log(`\n📋 Configuración correcta para Windows:`);
            console.log(`DB_USER=postgres`);
            console.log(`DB_PASSWORD=${config.password}`);
            console.log(`DB_HOST=localhost`);
            console.log(`DB_NAME=learnex`);
            console.log(`DB_PORT=5432`);
            
            // Create .env file
            const envContent = `DB_USER=postgres
DB_HOST=localhost
DB_NAME=learnex
DB_PASSWORD=${config.password}
DB_PORT=5432
DEEPSEEK_API_KEY=
PORT=3000`;
            
            require('fs').writeFileSync('.env', envContent);
            console.log('\n✅ Archivo .env creado automáticamente');
            
            await pool.end();
            return config;
        } catch (error) {
            console.log(`❌ Falló: ${error.message}`);
        }
    }
    
    console.log('\n❌ No se pudo conectar con ninguna configuración');
    console.log('\n🔧 Soluciones:');
    console.log('1. Verificar que PostgreSQL esté instalado y ejecutándose');
    console.log('2. Crear base de datos "learnex" en pgAdmin');
    console.log('3. Verificar la contraseña del usuario postgres');
    return null;
}

testConnection().then(config => {
    if (config) {
        console.log('\n🎉 ¡Listo! Ahora ejecuta: npm start');
    }
    process.exit(config ? 0 : 1);
});
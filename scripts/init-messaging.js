/**
 * Initialize Messaging System Database Tables
 */

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
});

async function initializeMessagingTables() {
    try {
        console.log('🔄 Inicializando tablas del sistema de mensajería...');
        
        // Check if tables exist
        const checkTables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'learnex' 
            AND table_name IN ('conversations', 'conversation_participants', 'messages', 'notifications')
        `);
        
        if (checkTables.rows.length === 4) {
            console.log('✅ Las tablas de mensajería ya existen');
            
            // Create some demo conversations
            await createDemoConversations();
            return;
        }
        
        console.log('📋 Creando tablas de mensajería...');
        
        // Create conversations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS learnex.conversations (
                id_conversation SERIAL PRIMARY KEY,
                title VARCHAR(200),
                type VARCHAR(20) DEFAULT 'private',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create conversation_participants table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS learnex.conversation_participants (
                id_participant SERIAL PRIMARY KEY,
                id_conversation INT NOT NULL REFERENCES learnex.conversations(id_conversation) ON DELETE CASCADE,
                id_user INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                role VARCHAR(20) DEFAULT 'member'
            )
        `);
        
        // Create messages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS learnex.messages (
                id_message SERIAL PRIMARY KEY,
                id_conversation INT NOT NULL REFERENCES learnex.conversations(id_conversation) ON DELETE CASCADE,
                id_sender INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
                content TEXT NOT NULL,
                message_type VARCHAR(20) DEFAULT 'text',
                file_path VARCHAR(500),
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                read_by JSONB DEFAULT '[]'
            )
        `);
        
        // Create notifications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS learnex.notifications (
                id_notification SERIAL PRIMARY KEY,
                id_user INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
                title VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) NOT NULL,
                related_id INT,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_messages_conversation ON learnex.messages(id_conversation);
            CREATE INDEX IF NOT EXISTS idx_messages_sender ON learnex.messages(id_sender);
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON learnex.notifications(id_user);
        `);
        
        console.log('✅ Tablas de mensajería creadas exitosamente');
        
        // Create demo conversations
        await createDemoConversations();
        
    } catch (error) {
        console.error('❌ Error inicializando tablas:', error);
    }
}

async function createDemoConversations() {
    try {
        console.log('📝 Creando conversaciones de demostración...');
        
        // Get some users
        const users = await pool.query('SELECT id_user, name, last_name, rol FROM learnex.users LIMIT 10');
        
        if (users.rows.length < 2) {
            console.log('⚠️ No hay suficientes usuarios para crear conversaciones demo');
            return;
        }
        
        // Create a general conversation
        const conv1 = await pool.query(`
            INSERT INTO learnex.conversations (title, type) 
            VALUES ('Consultas Generales', 'group') 
            RETURNING id_conversation
        `);
        
        // Add participants to general conversation
        for (let i = 0; i < Math.min(5, users.rows.length); i++) {
            await pool.query(`
                INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) 
                VALUES ($1, $2, $3)
            `, [conv1.rows[0].id_conversation, users.rows[i].id_user, i === 0 ? 'admin' : 'member']);
        }
        
        // Create a teacher-student conversation
        const teacher = users.rows.find(u => u.rol === 'teacher');
        const student = users.rows.find(u => u.rol === 'student');
        
        if (teacher && student) {
            const conv2 = await pool.query(`
                INSERT INTO learnex.conversations (title, type) 
                VALUES ('Consulta Matemáticas', 'private') 
                RETURNING id_conversation
            `);
            
            await pool.query(`
                INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) 
                VALUES ($1, $2, 'admin'), ($1, $3, 'member')
            `, [conv2.rows[0].id_conversation, teacher.id_user, student.id_user]);
            
            // Add some demo messages
            await pool.query(`
                INSERT INTO learnex.messages (id_conversation, id_sender, content) 
                VALUES 
                ($1, $2, 'Hola, tengo una duda sobre el ejercicio de álgebra'),
                ($1, $3, 'Hola! Claro, dime cuál es tu duda'),
                ($1, $2, 'No entiendo cómo resolver ecuaciones de segundo grado'),
                ($1, $3, 'Te explico paso a paso. Primero identifica los coeficientes a, b y c...')
            `, [conv2.rows[0].id_conversation, student.id_user, teacher.id_user]);
        }
        
        console.log('✅ Conversaciones demo creadas');
        
    } catch (error) {
        console.error('❌ Error creando conversaciones demo:', error);
    }
}

// Run initialization
initializeMessagingTables().then(() => {
    console.log('🎉 Sistema de mensajería inicializado correctamente');
    process.exit(0);
}).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});
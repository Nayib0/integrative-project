/**
 * Create Teacher-Parent Conversations
 */

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
});

async function createTeacherParentChats() {
    try {
        console.log('👨‍🏫👨‍👩‍👧‍👦 Creando chats profesor-padre...');
        
        // Get teachers and parents
        const teachers = await pool.query("SELECT id_user, name, last_name FROM learnex.users WHERE rol = 'teacher' LIMIT 5");
        const parents = await pool.query("SELECT id_user, name, last_name FROM learnex.users WHERE rol = 'parent' LIMIT 5");
        
        if (teachers.rows.length === 0 || parents.rows.length === 0) {
            console.log('⚠️ No hay profesores o padres disponibles');
            return;
        }
        
        // Create teacher-parent conversations
        for (let i = 0; i < Math.min(teachers.rows.length, parents.rows.length); i++) {
            const teacher = teachers.rows[i];
            const parent = parents.rows[i];
            
            // Create conversation
            const conv = await pool.query(`
                INSERT INTO learnex.conversations (title, type) 
                VALUES ($1, 'private') 
                RETURNING id_conversation
            `, [`Comunicación: Prof. ${teacher.name} - ${parent.name}`]);
            
            // Add participants
            await pool.query(`
                INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) 
                VALUES ($1, $2, 'admin'), ($1, $3, 'member')
            `, [conv.rows[0].id_conversation, teacher.id_user, parent.id_user]);
            
            // Add demo messages
            await pool.query(`
                INSERT INTO learnex.messages (id_conversation, id_sender, content) 
                VALUES 
                ($1, $2, 'Buenos días, quería consultarle sobre el rendimiento de mi hijo/a'),
                ($1, $3, 'Hola! Por supuesto, hablemos sobre el progreso académico'),
                ($1, $2, '¿Cómo va en matemáticas? He notado que tiene dificultades'),
                ($1, $3, 'Efectivamente, necesita refuerzo en álgebra. Le recomiendo práctica extra')
            `, [conv.rows[0].id_conversation, parent.id_user, teacher.id_user]);
            
            console.log(`✅ Chat creado: ${teacher.name} ↔ ${parent.name}`);
        }
        
        // Create a general parent-teacher group
        const groupConv = await pool.query(`
            INSERT INTO learnex.conversations (title, type) 
            VALUES ('Comunicación Padres-Profesores', 'group') 
            RETURNING id_conversation
        `);
        
        // Add all teachers and parents to group
        for (const teacher of teachers.rows) {
            await pool.query(`
                INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) 
                VALUES ($1, $2, 'admin')
            `, [groupConv.rows[0].id_conversation, teacher.id_user]);
        }
        
        for (const parent of parents.rows) {
            await pool.query(`
                INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) 
                VALUES ($1, $2, 'member')
            `, [groupConv.rows[0].id_conversation, parent.id_user]);
        }
        
        // Add group messages
        await pool.query(`
            INSERT INTO learnex.messages (id_conversation, id_sender, content) 
            VALUES 
            ($1, $2, 'Bienvenidos al grupo de comunicación padres-profesores'),
            ($1, $3, 'Gracias por crear este espacio de comunicación'),
            ($1, $2, 'Aquí podremos coordinar reuniones y compartir información importante')
        `, [groupConv.rows[0].id_conversation, teachers.rows[0].id_user, parents.rows[0].id_user]);
        
        console.log('✅ Grupo general padres-profesores creado');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

createTeacherParentChats().then(() => {
    console.log('🎉 Chats profesor-padre creados exitosamente');
    process.exit(0);
});
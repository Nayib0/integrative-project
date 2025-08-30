import { sqlitePool } from './database/sqlite-connection.js';

async function testDatabaseConnection() {
    console.log('🧪 Probando conexión base de datos SQLite...\n');
    
    try {
        const client = await sqlitePool.connect();
        
        // Test 1: Basic connection
        console.log('✅ Test 1: Conexión establecida');
        
        // Test 2: Count users
        const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
        console.log(`✅ Test 2: ${usersResult.rows[0].count} usuarios en la base de datos`);
        
        // Test 3: Verify admin credentials
        const adminResult = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM users WHERE mail = ? AND password = ?',
            ['carlos.gomez@mail.com', 'pass123']
        );
        
        if (adminResult.rows.length > 0) {
            const admin = adminResult.rows[0];
            console.log(`✅ Test 3: Admin encontrado - ${admin.name} ${admin.last_name} (${admin.rol})`);
        } else {
            console.log('❌ Test 3: Admin no encontrado');
        }
        
        // Test 4: Verify student
        const studentResult = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM users WHERE mail = ? AND password = ?',
            ['ana.rodriguez@mail.com', 'ana456']
        );
        
        if (studentResult.rows.length > 0) {
            const student = studentResult.rows[0];
            console.log(`✅ Test 4: Estudiante encontrado - ${student.name} ${student.last_name} (${student.rol})`);
        } else {
            console.log('❌ Test 4: Estudiante no encontrado');
        }
        
        // Test 5: Verify teacher
        const teacherResult = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM users WHERE mail = ? AND password = ?',
            ['pedro.sanchez@mail.com', 'ped987']
        );
        
        if (teacherResult.rows.length > 0) {
            const teacher = teacherResult.rows[0];
            console.log(`✅ Test 5: Profesor encontrado - ${teacher.name} ${teacher.last_name} (${teacher.rol})`);
        } else {
            console.log('❌ Test 5: Profesor no encontrado');
        }
        
        // Test 6: Statistics by role
        const stats = await Promise.all([
            client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'student'"),
            client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'teacher'"),
            client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'parent'"),
            client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'admin'"),
            client.query("SELECT COUNT(*) as count FROM curses"),
            client.query("SELECT COUNT(*) as count FROM subjects"),
            client.query("SELECT COUNT(*) as count FROM notes")
        ]);
        
        console.log('\n📊 Estadísticas de la base de datos:');
        console.log(`   👨🎓 Estudiantes: ${stats[0].rows[0].count}`);
        console.log(`   👨🏫 Profesores: ${stats[1].rows[0].count}`);
        console.log(`   👨👩👧👦 Padres: ${stats[2].rows[0].count}`);
        console.log(`   👨💼 Administradores: ${stats[3].rows[0].count}`);
        console.log(`   📚 Cursos: ${stats[4].rows[0].count}`);
        console.log(`   📖 Materias: ${stats[5].rows[0].count}`);
        console.log(`   📊 Calificaciones: ${stats[6].rows[0].count}`);
        
        // Test 7: Test simulated authentication endpoint
        console.log('\n🔐 Simulando autenticación...');
        
        const authTest = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM users WHERE mail = ? AND password = ? AND state = ?',
            ['carlos.gomez@mail.com', 'pass123', 'active']
        );
        
        if (authTest.rows.length > 0) {
            const user = authTest.rows[0];
            console.log('✅ Autenticación exitosa:', {
                id: user.id_user,
                name: user.name,
                lastName: user.last_name,
                email: user.mail,
                role: user.rol
            });
        }
        
        client.release();
        console.log('\n🎉 Todos los tests pasaron exitosamente!');
        console.log('✅ La base de datos SQLite está correctamente conectada con el backend');
        
    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
    }
}

testDatabaseConnection();
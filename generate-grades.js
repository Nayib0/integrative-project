import { sqlitePool } from './database/sqlite-connection.js';

async function generateGrades() {
    const client = await sqlitePool.connect();
    
    try {
        console.log('📊 Generando calificaciones...\n');
        
        // Limpiar calificaciones existentes
        await client.query('DELETE FROM notes');
        
        // Obtener asignaciones y estudiantes
        const assignments = await client.query(`
            SELECT cst.id_cst, cst.id_teacher, cst.id_curse, cst.id_subject,
                   s.name_subject, c.grade, u.name as teacher_name
            FROM curse_subject_teacher cst
            JOIN subjects s ON cst.id_subject = s.id_subjects
            JOIN curses c ON cst.id_curse = c.id_curse
            JOIN users u ON cst.id_teacher = u.id_user
        `);
        
        const students = await client.query(`
            SELECT sc.id_user, sc.id_curse, u.name, u.last_name
            FROM students_curses sc
            JOIN users u ON sc.id_user = u.id_user
        `);
        
        console.log(`📋 Asignaciones: ${assignments.rows.length}`);
        console.log(`👥 Estudiantes: ${students.rows.length}\n`);
        
        let gradeId = 1;
        let totalGrades = 0;
        
        // Generar calificaciones para cada asignación
        for (const assignment of assignments.rows) {
            // Obtener estudiantes del curso de esta asignación
            const courseStudents = students.rows.filter(s => s.id_curse === assignment.id_curse);
            
            // Generar 2-4 calificaciones por estudiante por materia
            for (const student of courseStudents) {
                const numGrades = Math.floor(Math.random() * 3) + 2; // 2-4 calificaciones
                
                for (let i = 0; i < numGrades; i++) {
                    // Generar calificación entre 2.0 y 5.0
                    const grade = (Math.random() * 3 + 2).toFixed(1);
                    
                    await client.query(
                        'INSERT INTO notes (id_note, id_student, id_cst, calification) VALUES (?, ?, ?, ?)',
                        [gradeId++, student.id_user, assignment.id_cst, parseFloat(grade)]
                    );
                    
                    totalGrades++;
                }
            }
        }
        
        console.log(`✅ ${totalGrades} calificaciones generadas\n`);
        
        // Mostrar estadísticas por profesor
        const teacherStats = await client.query(`
            SELECT u.name, u.last_name,
                   COUNT(n.id_note) as total_grades,
                   AVG(n.calification) as average_grade,
                   COUNT(DISTINCT n.id_student) as total_students,
                   COUNT(DISTINCT s.name_subject) as total_subjects
            FROM users u
            JOIN curse_subject_teacher cst ON u.id_user = cst.id_teacher
            JOIN notes n ON cst.id_cst = n.id_cst
            JOIN subjects s ON cst.id_subject = s.id_subjects
            WHERE u.rol = 'teacher'
            GROUP BY u.id_user, u.name, u.last_name
            ORDER BY u.name
        `);
        
        console.log('📊 Estadísticas por profesor:\n');
        teacherStats.rows.forEach(teacher => {
            console.log(`👨🏫 ${teacher.name} ${teacher.last_name}:`);
            console.log(`   📝 Calificaciones asignadas: ${teacher.total_grades}`);
            console.log(`   👥 Estudiantes: ${teacher.total_students}`);
            console.log(`   📖 Materias: ${teacher.total_subjects}`);
            console.log(`   📊 Promedio: ${parseFloat(teacher.average_grade).toFixed(1)}\n`);
        });
        
        // Estadísticas por estudiante
        const studentStats = await client.query(`
            SELECT u.name, u.last_name,
                   COUNT(n.id_note) as total_grades,
                   AVG(n.calification) as average_grade
            FROM users u
            JOIN notes n ON u.id_user = n.id_student
            WHERE u.rol = 'student'
            GROUP BY u.id_user, u.name, u.last_name
            ORDER BY average_grade DESC
            LIMIT 10
        `);
        
        console.log('🏆 Top 10 estudiantes por promedio:\n');
        studentStats.rows.forEach((student, index) => {
            console.log(`${index + 1}. ${student.name} ${student.last_name}: ${parseFloat(student.average_grade).toFixed(1)} (${student.total_grades} calificaciones)`);
        });
        
        console.log('\n🎉 Calificaciones generadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        client.release();
    }
}

generateGrades();
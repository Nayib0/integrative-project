import { sqlitePool } from './database/sqlite-connection.js';

async function completeTeacherAssignments() {
    const client = await sqlitePool.connect();
    
    try {
        console.log('🔧 Completando asignaciones de profesores...\n');
        
        // Obtener profesores, cursos y materias
        const teachers = await client.query("SELECT id_user, name, last_name FROM users WHERE rol = 'teacher'");
        const courses = await client.query("SELECT id_curse, grade FROM curses ORDER BY id_curse");
        const subjects = await client.query("SELECT id_subjects, name_subject FROM subjects ORDER BY id_subjects");
        
        console.log(`👨🏫 Profesores: ${teachers.rows.length}`);
        console.log(`📚 Cursos: ${courses.rows.length}`);
        console.log(`📖 Materias: ${subjects.rows.length}\n`);
        
        // Limpiar asignaciones existentes
        await client.query('DELETE FROM curse_subject_teacher');
        console.log('🧹 Asignaciones anteriores eliminadas\n');
        
        // Crear asignaciones sistemáticas
        let assignmentId = 1;
        const assignments = [];
        
        // Asignar cada profesor a múltiples materias y cursos
        for (let i = 0; i < teachers.rows.length; i++) {
            const teacher = teachers.rows[i];
            
            // Cada profesor enseña 2-3 materias en 2-3 cursos
            const teacherSubjects = subjects.rows.slice(i * 2, (i * 2) + 3);
            const teacherCourses = courses.rows.slice(i, i + 3);
            
            for (const course of teacherCourses) {
                for (const subject of teacherSubjects) {
                    if (subject) {
                        assignments.push({
                            id_cst: assignmentId++,
                            id_curse: course.id_curse,
                            id_subject: subject.id_subjects,
                            id_teacher: teacher.id_user,
                            teacher_name: `${teacher.name} ${teacher.last_name}`,
                            course_name: course.grade,
                            subject_name: subject.name_subject
                        });
                    }
                }
            }
        }
        
        // Insertar asignaciones
        for (const assignment of assignments) {
            await client.query(
                'INSERT INTO curse_subject_teacher (id_cst, id_curse, id_subject, id_teacher) VALUES (?, ?, ?, ?)',
                [assignment.id_cst, assignment.id_curse, assignment.id_subject, assignment.id_teacher]
            );
        }
        
        console.log(`✅ ${assignments.length} asignaciones creadas\n`);
        
        // Mostrar resumen por profesor
        console.log('📋 Resumen de asignaciones:\n');
        for (const teacher of teachers.rows) {
            const teacherAssignments = assignments.filter(a => a.id_teacher === teacher.id_user);
            console.log(`👨🏫 ${teacher.name} ${teacher.last_name}:`);
            
            const subjects = [...new Set(teacherAssignments.map(a => a.subject_name))];
            const courses = [...new Set(teacherAssignments.map(a => a.course_name))];
            
            console.log(`   📖 Materias: ${subjects.join(', ')}`);
            console.log(`   📚 Cursos: ${courses.join(', ')}`);
            console.log(`   🔢 Total asignaciones: ${teacherAssignments.length}\n`);
        }
        
        // Verificar estudiantes por curso
        const studentsPerCourse = await client.query(`
            SELECT c.grade, COUNT(sc.id_user) as student_count
            FROM curses c
            LEFT JOIN students_curses sc ON c.id_curse = sc.id_curse
            GROUP BY c.id_curse, c.grade
            ORDER BY c.id_curse
        `);
        
        console.log('👥 Estudiantes por curso:');
        studentsPerCourse.rows.forEach(row => {
            console.log(`   📚 ${row.grade}: ${row.student_count} estudiantes`);
        });
        
        console.log('\n🎉 Asignaciones completadas exitosamente!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        client.release();
    }
}

completeTeacherAssignments();
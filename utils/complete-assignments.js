import { sqlitePool } from './database/sqlite-connection.js';

async function completeTeacherAssignments() {
    const client = await sqlitePool.connect();
    
    try {
        console.log('🔧 Completing teacher assignments...\n');
        
        // Get teachers, courses and subjects
        const teachers = await client.query("SELECT id_user, name, last_name FROM users WHERE rol = 'teacher'");
        const courses = await client.query("SELECT id_curse, grade FROM curses ORDER BY id_curse");
        const subjects = await client.query("SELECT id_subjects, name_subject FROM subjects ORDER BY id_subjects");
        
        console.log(`👨🏫 Teachers: ${teachers.rows.length}`);
        console.log(`📚 Courses: ${courses.rows.length}`);
        console.log(`📖 Subjects: ${subjects.rows.length}\n`);
        
        // Clear existing assignments
        await client.query('DELETE FROM curse_subject_teacher');
        console.log('🧹 Previous assignments deleted\n');
        
        // Create systematic assignments
        let assignmentId = 1;
        const assignments = [];
        
        // Assign each teacher to multiple subjects and courses
        for (let i = 0; i < teachers.rows.length; i++) {
            const teacher = teachers.rows[i];
            
            // Each teacher teaches 2-3 subjects in 2-3 courses
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
        
        // Insert assignments
        for (const assignment of assignments) {
            await client.query(
                'INSERT INTO curse_subject_teacher (id_cst, id_curse, id_subject, id_teacher) VALUES (?, ?, ?, ?)',
                [assignment.id_cst, assignment.id_curse, assignment.id_subject, assignment.id_teacher]
            );
        }
        
        console.log(`✅ ${assignments.length} assignments created\n`);
        
        // Show summary by teacher
        console.log('📋 Assignment summary:\n');
        for (const teacher of teachers.rows) {
            const teacherAssignments = assignments.filter(a => a.id_teacher === teacher.id_user);
            console.log(`👨🏫 ${teacher.name} ${teacher.last_name}:`);
            
            const subjects = [...new Set(teacherAssignments.map(a => a.subject_name))];
            const courses = [...new Set(teacherAssignments.map(a => a.course_name))];
            
            console.log(`   📖 Subjects: ${subjects.join(', ')}`);
            console.log(`   📚 Courses: ${courses.join(', ')}`);
            console.log(`   🔢 Total assignments: ${teacherAssignments.length}\n`);
        }
        
        // Check students per course
        const studentsPerCourse = await client.query(`
            SELECT c.grade, COUNT(sc.id_user) as student_count
            FROM curses c
            LEFT JOIN students_curses sc ON c.id_curse = sc.id_curse
            GROUP BY c.id_curse, c.grade
            ORDER BY c.id_curse
        `);
        
        console.log('👥 Students per course:');
        studentsPerCourse.rows.forEach(row => {
            console.log(`   📚 ${row.grade}: ${row.student_count} students`);
        });
        
        console.log('\n🎉 Assignments completed successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        client.release();
    }
}

completeTeacherAssignments();
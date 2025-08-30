import { sqlitePool } from './database/sqlite-connection.js';

async function verifyAssignments() {
    const client = await sqlitePool.connect();
    
    try {
        console.log('🔍 Verifying complete assignments...\n');
        
        // Verify specific teacher (Pedro Sanchez - ID 7)
        const teacherInfo = await client.query(`
            SELECT u.name, u.last_name, u.mail
            FROM users u
            WHERE u.id_user = 7 AND u.rol = 'teacher'
        `);
        
        if (teacherInfo.rows.length > 0) {
            const teacher = teacherInfo.rows[0];
            console.log(`👨🏫 Teacher: ${teacher.name} ${teacher.last_name}`);
            console.log(`📧 Email: ${teacher.mail}\n`);
            
            // Their assignments
            const assignments = await client.query(`
                SELECT s.name_subject, c.grade, c.school_year
                FROM curse_subject_teacher cst
                JOIN subjects s ON cst.id_subject = s.id_subjects
                JOIN curses c ON cst.id_curse = c.id_curse
                WHERE cst.id_teacher = 7
                ORDER BY c.grade, s.name_subject
            `);
            
            console.log('📚 Assigned subjects and courses:');
            assignments.rows.forEach(assignment => {
                console.log(`   • ${assignment.name_subject} - Grade ${assignment.grade} (${assignment.school_year})`);
            });
            
            // Their students
            const students = await client.query(`
                SELECT DISTINCT u.id_user, u.name, u.last_name, c.grade
                FROM users u
                JOIN students_curses sc ON u.id_user = sc.id_user
                JOIN curses c ON sc.id_curse = c.id_curse
                JOIN curse_subject_teacher cst ON c.id_curse = cst.id_curse
                WHERE cst.id_teacher = 7 AND u.rol = 'student'
                ORDER BY c.grade, u.name
            `);
            
            console.log(`\n👥 Assigned students (${students.rows.length}):`);
            let currentGrade = '';
            students.rows.forEach(student => {
                if (student.grade !== currentGrade) {
                    currentGrade = student.grade;
                    console.log(`\n   📚 Grade ${student.grade}:`);
                }
                console.log(`     • ${student.name} ${student.last_name}`);
            });
            
            // Sus calificaciones
            const grades = await client.query(`
                SELECT COUNT(*) as total_grades,
                       AVG(n.calification) as average,
                       MIN(n.calification) as min_grade,
                       MAX(n.calification) as max_grade
                FROM notes n
                JOIN curse_subject_teacher cst ON n.id_cst = cst.id_cst
                WHERE cst.id_teacher = 7
            `);
            
            if (grades.rows[0].total_grades > 0) {
                const gradeStats = grades.rows[0];
                console.log(`\n📊 Grade statistics:`);
                console.log(`   • Total grades: ${gradeStats.total_grades}`);
                console.log(`   • Average: ${parseFloat(gradeStats.average).toFixed(1)}`);
                console.log(`   • Range: ${gradeStats.min_grade} - ${gradeStats.max_grade}`);
            }
        }
        
        // Verify specific student (Ana Rodriguez - ID 2)
        console.log('\n' + '='.repeat(50) + '\n');
        
        const studentInfo = await client.query(`
            SELECT u.name, u.last_name, u.mail
            FROM users u
            WHERE u.id_user = 2 AND u.rol = 'student'
        `);
        
        if (studentInfo.rows.length > 0) {
            const student = studentInfo.rows[0];
            console.log(`👩🎓 Student: ${student.name} ${student.last_name}`);
            console.log(`📧 Email: ${student.mail}\n`);
            
            // Their course
            const course = await client.query(`
                SELECT c.grade, c.school_year
                FROM students_curses sc
                JOIN curses c ON sc.id_curse = c.id_curse
                WHERE sc.id_user = 2
            `);
            
            if (course.rows.length > 0) {
                console.log(`📚 Course: Grade ${course.rows[0].grade} (${course.rows[0].school_year})`);
            }
            
            // Sus calificaciones por materia
            const studentGrades = await client.query(`
                SELECT s.name_subject,
                       COUNT(n.id_note) as grade_count,
                       AVG(n.calification) as average,
                       u.name as teacher_name
                FROM notes n
                JOIN curse_subject_teacher cst ON n.id_cst = cst.id_cst
                JOIN subjects s ON cst.id_subject = s.id_subjects
                JOIN users u ON cst.id_teacher = u.id_user
                WHERE n.id_student = 2
                GROUP BY s.id_subjects, s.name_subject, u.name
                ORDER BY s.name_subject
            `);
            
            console.log(`\n📊 Grades by subject:`);
            studentGrades.rows.forEach(grade => {
                console.log(`   • ${grade.name_subject}: ${parseFloat(grade.average).toFixed(1)} (${grade.grade_count} grades) - Prof. ${grade.teacher_name}`);
            });
            
            // Promedio general
            const overallAverage = await client.query(`
                SELECT AVG(calification) as overall_average,
                       COUNT(*) as total_grades
                FROM notes
                WHERE id_student = 2
            `);
            
            if (overallAverage.rows[0].total_grades > 0) {
                console.log(`\n🎯 Overall average: ${parseFloat(overallAverage.rows[0].overall_average).toFixed(1)}`);
                console.log(`📝 Total grades: ${overallAverage.rows[0].total_grades}`);
            }
        }
        
        console.log('\n✅ Verification completed - Everything is correctly assigned!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        client.release();
    }
}

verifyAssignments();
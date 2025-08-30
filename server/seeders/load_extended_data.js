const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
});

async function loadExtendedData() {
    try {
        console.log('🚀 Cargando datos extendidos de Learnex...');

        // Clear existing data
        await pool.query('TRUNCATE TABLE learnex.students_curses CASCADE');
        await pool.query('TRUNCATE TABLE learnex.curse_subject_teacher CASCADE');
        await pool.query('TRUNCATE TABLE learnex.notes CASCADE');
        await pool.query('TRUNCATE TABLE learnex.users CASCADE');
        await pool.query('TRUNCATE TABLE learnex.curses CASCADE');

        // Load users
        console.log('📥 Cargando usuarios extendidos...');
        const usersData = fs.readFileSync(path.join(__dirname, '../data/01_users_extended.csv'), 'utf8');
        const userLines = usersData.split('\n').slice(1).filter(line => line.trim());
        
        for (const line of userLines) {
            const [id_user, name, last_name, mail, password, rol, state, parent_id, grade] = line.split(';');
            if (id_user && name && mail) {
                await pool.query(
                    'INSERT INTO learnex.users (id_user, name, last_name, mail, password, rol, state) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [parseInt(id_user), name, last_name, mail, password, rol, state]
                );
            }
        }

        // Load courses
        console.log('📚 Cargando cursos extendidos...');
        const coursesData = fs.readFileSync(path.join(__dirname, '../data/02_curses_extended.csv'), 'utf8');
        const courseLines = coursesData.split('\n').slice(1).filter(line => line.trim());
        
        for (const line of courseLines) {
            const [id_curse, grade, school_year, section, max_students] = line.split(';');
            if (id_curse && grade) {
                await pool.query(
                    'INSERT INTO learnex.curses (id_curse, grade, school_year) VALUES ($1, $2, $3)',
                    [parseInt(id_curse), grade, parseInt(school_year)]
                );
            }
        }

        // Load subjects (keep original)
        console.log('📖 Cargando materias...');
        const subjectsData = fs.readFileSync(path.join(__dirname, '../data/03_subjects.csv'), 'utf8');
        const subjectLines = subjectsData.split('\n').slice(1).filter(line => line.trim());
        
        for (const line of subjectLines) {
            const [id_subjects, name_subject] = line.split(';');
            if (id_subjects && name_subject) {
                await pool.query(
                    'INSERT INTO learnex.subjects (id_subjects, name_subject) VALUES ($1, $2)',
                    [parseInt(id_subjects), name_subject]
                );
            }
        }

        // Load teacher assignments
        console.log('👨‍🏫 Cargando asignaciones de profesores...');
        const teacherData = fs.readFileSync(path.join(__dirname, '../data/04_curse_subject_teacher_extended.csv'), 'utf8');
        const teacherLines = teacherData.split('\n').slice(1).filter(line => line.trim());
        
        for (const line of teacherLines) {
            const [id_cst, id_curse, id_subject, id_teacher] = line.split(';');
            if (id_cst && id_curse && id_subject && id_teacher) {
                await pool.query(
                    'INSERT INTO learnex.curse_subject_teacher (id_cst, id_curse, id_subject, id_teacher) VALUES ($1, $2, $3, $4)',
                    [parseInt(id_cst), parseInt(id_curse), parseInt(id_subject), parseInt(id_teacher)]
                );
            }
        }

        // Load student enrollments
        console.log('🎓 Cargando inscripciones de estudiantes...');
        const enrollmentData = fs.readFileSync(path.join(__dirname, '../data/06_students_curses_extended.csv'), 'utf8');
        const enrollmentLines = enrollmentData.split('\n').slice(1).filter(line => line.trim());
        
        for (const line of enrollmentLines) {
            const [id_student_curse, id_user, id_curse] = line.split(';');
            if (id_student_curse && id_user && id_curse) {
                await pool.query(
                    'INSERT INTO learnex.students_curses (id_student_curse, id_user, id_curse) VALUES ($1, $2, $3)',
                    [parseInt(id_student_curse), parseInt(id_user), parseInt(id_curse)]
                );
            }
        }

        // Generate sample grades
        console.log('📊 Generando calificaciones de muestra...');
        const students = await pool.query('SELECT id_user FROM learnex.users WHERE rol = $1', ['student']);
        const assignments = await pool.query('SELECT id_cst FROM learnex.curse_subject_teacher');
        
        let noteId = 1;
        for (const student of students.rows) {
            // Generate 3-5 random grades per student
            const numGrades = Math.floor(Math.random() * 3) + 3;
            for (let i = 0; i < numGrades; i++) {
                const randomAssignment = assignments.rows[Math.floor(Math.random() * assignments.rows.length)];
                const grade = (Math.random() * 2 + 3).toFixed(1); // Grades between 3.0 and 5.0
                
                await pool.query(
                    'INSERT INTO learnex.notes (id_note, id_student, id_cst, calification) VALUES ($1, $2, $3, $4)',
                    [noteId++, student.id_user, randomAssignment.id_cst, parseFloat(grade)]
                );
            }
        }

        console.log('✅ Datos extendidos cargados exitosamente!');
        console.log('📈 Estadísticas:');
        
        const stats = await Promise.all([
            pool.query('SELECT COUNT(*) FROM learnex.users WHERE rol = $1', ['student']),
            pool.query('SELECT COUNT(*) FROM learnex.users WHERE rol = $1', ['teacher']),
            pool.query('SELECT COUNT(*) FROM learnex.users WHERE rol = $1', ['parent']),
            pool.query('SELECT COUNT(*) FROM learnex.users WHERE rol = $1', ['admin']),
            pool.query('SELECT COUNT(*) FROM learnex.curses'),
            pool.query('SELECT COUNT(*) FROM learnex.notes')
        ]);

        console.log(`   👨‍🎓 Estudiantes: ${stats[0].rows[0].count}`);
        console.log(`   👨‍🏫 Profesores: ${stats[1].rows[0].count}`);
        console.log(`   👨‍👩‍👧‍👦 Padres: ${stats[2].rows[0].count}`);
        console.log(`   👨‍💼 Administradores: ${stats[3].rows[0].count}`);
        console.log(`   📚 Cursos: ${stats[4].rows[0].count} (Grados 1-11)`);
        console.log(`   📊 Calificaciones: ${stats[5].rows[0].count}`);

    } catch (error) {
        console.error('❌ Error cargando datos:', error);
    } finally {
        pool.end();
    }
}

if (require.main === module) {
    loadExtendedData();
}

module.exports = { loadExtendedData };
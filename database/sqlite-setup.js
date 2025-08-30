import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import csv from 'csv-parser';

// Create SQLite database with same structure as PostgreSQL
export async function setupSQLiteDatabase() {
    const db = await open({
        filename: './database/learnex.db',
        driver: sqlite3.Database
    });

    console.log('🗄️ Creando base de datos SQLite...');

    // Create tables with same structure as PostgreSQL
    await db.exec(`
        -- USERS TABLE
        CREATE TABLE IF NOT EXISTS users (
            id_user INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            mail TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL,
            state TEXT NOT NULL
        );

        -- CURSES TABLE
        CREATE TABLE IF NOT EXISTS curses (
            id_curse INTEGER PRIMARY KEY,
            grade TEXT NOT NULL,
            school_year INTEGER NOT NULL
        );

        -- SUBJECTS TABLE
        CREATE TABLE IF NOT EXISTS subjects (
            id_subjects INTEGER PRIMARY KEY,
            name_subject TEXT NOT NULL
        );

        -- CURSE_SUBJECT_TEACHER TABLE
        CREATE TABLE IF NOT EXISTS curse_subject_teacher (
            id_cst INTEGER PRIMARY KEY,
            id_curse INTEGER NOT NULL,
            id_subject INTEGER NOT NULL,
            id_teacher INTEGER NOT NULL,
            FOREIGN KEY (id_curse) REFERENCES curses(id_curse),
            FOREIGN KEY (id_subject) REFERENCES subjects(id_subjects),
            FOREIGN KEY (id_teacher) REFERENCES users(id_user)
        );

        -- NOTES TABLE
        CREATE TABLE IF NOT EXISTS notes (
            id_note INTEGER PRIMARY KEY,
            id_student INTEGER NOT NULL,
            id_cst INTEGER NOT NULL,
            calification REAL NOT NULL,
            FOREIGN KEY (id_student) REFERENCES users(id_user),
            FOREIGN KEY (id_cst) REFERENCES curse_subject_teacher(id_cst)
        );

        -- STUDENTS_CURSES TABLE
        CREATE TABLE IF NOT EXISTS students_curses (
            id_student_curse INTEGER PRIMARY KEY,
            id_user INTEGER NOT NULL,
            id_curse INTEGER NOT NULL,
            FOREIGN KEY (id_user) REFERENCES users(id_user),
            FOREIGN KEY (id_curse) REFERENCES curses(id_curse)
        );
    `);

    console.log('✅ Tablas SQLite creadas');
    return db;
}

// Load data from CSV files
export async function loadDataToSQLite() {
    const db = await setupSQLiteDatabase();

    try {
        // Clear existing data
        await db.exec(`
            DELETE FROM students_curses;
            DELETE FROM notes;
            DELETE FROM curse_subject_teacher;
            DELETE FROM subjects;
            DELETE FROM curses;
            DELETE FROM users;
        `);

        // Load users
        console.log('📥 Cargando usuarios...');
        const users = await loadCSV('server/data/01_users.csv');
        for (const user of users) {
            await db.run(
                'INSERT INTO users (id_user, name, last_name, mail, password, rol, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user.id_user, user.name, user.last_name, user.mail, user.password, user.rol, user.state]
            );
        }
        console.log(`✅ ${users.length} usuarios cargados`);

        // Load curses
        console.log('📥 Cargando cursos...');
        const curses = await loadCSV('server/data/02_curses.csv');
        for (const curse of curses) {
            await db.run(
                'INSERT INTO curses (id_curse, grade, school_year) VALUES (?, ?, ?)',
                [curse.id_curse, curse.grade, curse.school_year]
            );
        }
        console.log(`✅ ${curses.length} cursos cargados`);

        // Load subjects
        console.log('📥 Cargando materias...');
        const subjects = await loadCSV('server/data/03_subjects.csv');
        for (const subject of subjects) {
            await db.run(
                'INSERT INTO subjects (id_subjects, name_subject) VALUES (?, ?)',
                [subject.id_subjects, subject.name_subject]
            );
        }
        console.log(`✅ ${subjects.length} materias cargadas`);

        // Load curse_subject_teacher
        console.log('📥 Cargando asignaciones profesor-materia...');
        const cst = await loadCSV('server/data/04_curse_subject_teacher.csv');
        for (const assignment of cst) {
            await db.run(
                'INSERT INTO curse_subject_teacher (id_cst, id_curse, id_subject, id_teacher) VALUES (?, ?, ?, ?)',
                [assignment.id_cst, assignment.id_curse, assignment.id_subject, assignment.id_teacher]
            );
        }
        console.log(`✅ ${cst.length} asignaciones cargadas`);

        // Load notes
        console.log('📥 Cargando calificaciones...');
        const notes = await loadCSV('server/data/05_notes.csv');
        for (const note of notes) {
            await db.run(
                'INSERT INTO notes (id_note, id_student, id_cst, calification) VALUES (?, ?, ?, ?)',
                [note.id_note, note.id_student, note.id_cst, note.calification]
            );
        }
        console.log(`✅ ${notes.length} calificaciones cargadas`);

        // Load students_curses
        console.log('📥 Cargando inscripciones estudiantes...');
        const studentsCurses = await loadCSV('server/data/06_students_curses.csv');
        for (const sc of studentsCurses) {
            await db.run(
                'INSERT INTO students_curses (id_student_curse, id_user, id_curse) VALUES (?, ?, ?)',
                [sc.id_student_curse, sc.id_user, sc.id_curse]
            );
        }
        console.log(`✅ ${studentsCurses.length} inscripciones cargadas`);

        console.log('🎉 Base de datos SQLite configurada exitosamente!');
        
        // Show statistics
        const stats = await Promise.all([
            db.get("SELECT COUNT(*) as count FROM users WHERE rol = 'student'"),
            db.get("SELECT COUNT(*) as count FROM users WHERE rol = 'teacher'"),
            db.get("SELECT COUNT(*) as count FROM users WHERE rol = 'parent'"),
            db.get("SELECT COUNT(*) as count FROM users WHERE rol = 'admin'"),
            db.get("SELECT COUNT(*) as count FROM curses"),
            db.get("SELECT COUNT(*) as count FROM notes")
        ]);

        console.log('📊 Estadísticas:');
        console.log(`   👨🎓 Estudiantes: ${stats[0].count}`);
        console.log(`   👨🏫 Profesores: ${stats[1].count}`);
        console.log(`   👨👩👧👦 Padres: ${stats[2].count}`);
        console.log(`   👨💼 Administradores: ${stats[3].count}`);
        console.log(`   📚 Cursos: ${stats[4].count}`);
        console.log(`   📊 Calificaciones: ${stats[5].count}`);

    } catch (error) {
        console.error('❌ Error cargando datos:', error);
    } finally {
        await db.close();
    }
}

// Helper function to load CSV
async function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

// Run automatically
loadDataToSQLite().catch(console.error);
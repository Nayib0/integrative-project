-- ==========================
-- CREATE TABLES FOR PROJECT
-- ==========================

CREATE DATABASE learnex;
CREATE SCHEMA learnex

-- USERS
CREATE TABLE learnex.users (
    id_user INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    mail VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    state VARCHAR(20) NOT NULL
);

-- CURSES
CREATE TABLE learnex.curses (
    id_curse INT PRIMARY KEY,
    grade VARCHAR(20) NOT NULL,
    school_year INT NOT NULL
);

-- SUBJECTS
CREATE TABLE learnex.subjects (
    id_subjects INT PRIMARY KEY,
    name_subject VARCHAR(100) NOT NULL
);

-- CURSE - SUBJECT - TEACHER (RELATION)
CREATE TABLE learnex.curse_subject_teacher (
    id_cst INT PRIMARY KEY,
    id_curse INT NOT NULL REFERENCES learnex.curses(id_curse) ON DELETE CASCADE,
    id_subject INT NOT NULL REFERENCES learnex.subjects(id_subjects) ON DELETE CASCADE,
    id_teacher INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE
);

-- NOTES
CREATE TABLE learnex.notes (
    id_note INT PRIMARY KEY,
    id_student INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    id_cst INT NOT NULL REFERENCES learnex.curse_subject_teacher(id_cst) ON DELETE CASCADE,
    calification NUMERIC(3,1) NOT NULL
);

-- STUDENTS - CURSES (RELATION)
CREATE TABLE learnex.students_curses (
    id_student_curse INT PRIMARY KEY,
    id_user INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    id_curse INT NOT NULL REFERENCES learnex.curses(id_curse) ON DELETE CASCADE
);

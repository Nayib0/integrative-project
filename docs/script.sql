-- Crear la base de datos
CREATE DATABASE learnex;

-- Conectarse a la base
\c learnex;

-- Crear esquema learnex
CREATE SCHEMA learnex;

--------------------------------------------------
-- 1. Roles
--------------------------------------------------
CREATE TABLE learnex.roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

--------------------------------------------------
-- 2. Usuarios
--------------------------------------------------
CREATE TABLE learnex.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    id_rol INT REFERENCES learnex.roles(id_rol),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo','inactivo'))
);

--------------------------------------------------
-- 3. Cursos
--------------------------------------------------
CREATE TABLE learnex.cursos (
    id_curso SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grado VARCHAR(10) NOT NULL,
    año_escolar INT NOT NULL
);

--------------------------------------------------
-- 4. Asignaturas
--------------------------------------------------
CREATE TABLE learnex.asignaturas (
    id_asignatura SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

--------------------------------------------------
-- 5. Curso_asignatura (relación cursos ↔ asignaturas)
--------------------------------------------------
CREATE TABLE learnex.curso_asignatura (
    id_curso_asignatura SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES learnex.cursos(id_curso),
    id_asignatura INT NOT NULL REFERENCES learnex.asignaturas(id_asignatura),
    id_profesor INT NOT NULL REFERENCES learnex.usuarios(id_usuario)
);

--------------------------------------------------
-- 6. Estudiante_curso (relación estudiantes ↔ cursos)
--------------------------------------------------
CREATE TABLE learnex.estudiante_curso (
    id_estudiante_curso SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES learnex.usuarios(id_usuario),
    id_curso INT NOT NULL REFERENCES learnex.cursos(id_curso)
);

--------------------------------------------------
-- 7. Evaluaciones
--------------------------------------------------
CREATE TABLE learnex.evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    id_curso_asignatura INT NOT NULL REFERENCES learnex.curso_asignatura(id_curso_asignatura),
    porcentaje NUMERIC(5,2) NOT NULL
);

--------------------------------------------------
-- 8. Notas
--------------------------------------------------
CREATE TABLE learnex.notas (
    id_nota SERIAL PRIMARY KEY,
    id_evaluacion INT NOT NULL REFERENCES learnex.evaluaciones(id_evaluacion),
    id_estudiante INT NOT NULL REFERENCES learnex.usuarios(id_usuario),
    calificacion NUMERIC(5,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_ingreso VARCHAR(20) DEFAULT 'manual' CHECK (metodo_ingreso IN ('manual','ocr','excel'))
);

--------------------------------------------------
-- 9. Reportes
--------------------------------------------------
CREATE TABLE learnex.reportes (
    id_reporte SERIAL PRIMARY KEY,
    id_estudiante INT NOT NULL REFERENCES learnex.usuarios(id_usuario),
    id_curso INT NOT NULL REFERENCES learnex.cursos(id_curso),
    promedio_general NUMERIC(5,2),
    estado VARCHAR(20) CHECK (estado IN ('aprobado','reprobado')),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exportado VARCHAR(10) CHECK (exportado IN ('pdf','excel'))
);

--------------------------------------------------
-- 10. Notificaciones
--------------------------------------------------
CREATE TABLE learnex.notificaciones (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES learnex.usuarios(id_usuario),
    mensaje TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('recordatorio','alerta','aviso')),
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE
);

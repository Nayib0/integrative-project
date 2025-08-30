/**
 * PDF Report System for Learnex
 * Generate academic reports, certificates, attendance reports
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFSystem {
    constructor(pool) {
        this.pool = pool;
        this.reportsDir = path.join(__dirname, '../../reports');
        this.ensureReportsDirectory();
    }

    ensureReportsDirectory() {
        if (!fs.existsSync(this.reportsDir)) {
            fs.mkdirSync(this.reportsDir, { recursive: true });
        }
    }

    // Generate student report card
    async generateStudentReportCard(studentId, period = null) {
        try {
            const studentData = await this.getStudentData(studentId);
            const grades = await this.getStudentGrades(studentId, period);
            const attendance = await this.getStudentAttendance(studentId, period);
            
            if (!studentData.success) {
                return studentData;
            }

            const filename = `reporte_${studentData.student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
            const filepath = path.join(this.reportsDir, filename);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(filepath));

            // Header
            this.addHeader(doc, 'REPORTE ACADÉMICO ESTUDIANTIL');
            
            // Student info
            this.addStudentInfo(doc, studentData.student);
            
            // Grades table
            this.addGradesTable(doc, grades.grades);
            
            // Statistics
            this.addGradeStatistics(doc, grades.grades);
            
            // Attendance info
            if (attendance.success) {
                this.addAttendanceInfo(doc, attendance.attendance);
            }
            
            // Footer
            this.addFooter(doc);
            
            doc.end();

            return { 
                success: true, 
                filename, 
                filepath,
                message: 'Reporte generado exitosamente' 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate class performance report
    async generateClassReport(teacherId, courseId, subjectId) {
        try {
            const classData = await this.getClassData(teacherId, courseId, subjectId);
            const students = await this.getClassStudents(courseId);
            const performance = await this.getClassPerformance(courseId, subjectId);

            const filename = `reporte_clase_${courseId}_${subjectId}_${Date.now()}.pdf`;
            const filepath = path.join(this.reportsDir, filename);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(filepath));

            // Header
            this.addHeader(doc, 'REPORTE DE RENDIMIENTO DE CLASE');
            
            // Class info
            this.addClassInfo(doc, classData.class);
            
            // Performance summary
            this.addPerformanceSummary(doc, performance.summary);
            
            // Students table
            this.addStudentsPerformanceTable(doc, students.students, performance.grades);
            
            // Recommendations
            this.addTeacherRecommendations(doc, performance.analysis);
            
            this.addFooter(doc);
            doc.end();

            return { success: true, filename, filepath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate attendance report
    async generateAttendanceReport(courseId, startDate, endDate) {
        try {
            const attendanceData = await this.getAttendanceData(courseId, startDate, endDate);
            
            const filename = `reporte_asistencia_${courseId}_${Date.now()}.pdf`;
            const filepath = path.join(this.reportsDir, filename);

            const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
            doc.pipe(fs.createWriteStream(filepath));

            this.addHeader(doc, 'REPORTE DE ASISTENCIA');
            this.addAttendanceTable(doc, attendanceData.data);
            this.addAttendanceStatistics(doc, attendanceData.statistics);
            this.addFooter(doc);
            
            doc.end();

            return { success: true, filename, filepath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate certificate
    async generateCertificate(studentId, certificateType, details) {
        try {
            const studentData = await this.getStudentData(studentId);
            
            if (!studentData.success) {
                return studentData;
            }

            const filename = `certificado_${studentData.student.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
            const filepath = path.join(this.reportsDir, filename);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(filepath));

            this.addCertificateDesign(doc, studentData.student, certificateType, details);
            
            doc.end();

            return { success: true, filename, filepath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate institutional analytics report
    async generateInstitutionalReport(startDate, endDate) {
        try {
            const analytics = await this.getInstitutionalAnalytics(startDate, endDate);
            
            const filename = `reporte_institucional_${Date.now()}.pdf`;
            const filepath = path.join(this.reportsDir, filename);

            const doc = new PDFDocument({ margin: 50 });
            doc.pipe(fs.createWriteStream(filepath));

            this.addHeader(doc, 'REPORTE INSTITUCIONAL');
            this.addInstitutionalStats(doc, analytics.stats);
            this.addPerformanceTrends(doc, analytics.trends);
            this.addRecommendations(doc, analytics.recommendations);
            this.addFooter(doc);
            
            doc.end();

            return { success: true, filename, filepath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // PDF Layout Methods
    addHeader(doc, title) {
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text('INSTITUCIÓN EDUCATIVA LEARNEX', 50, 50, { align: 'center' });
        
        doc.fontSize(16)
           .text(title, 50, 80, { align: 'center' });
        
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 50, 110, { align: 'right' });
        
        doc.moveTo(50, 130)
           .lineTo(550, 130)
           .stroke();
    }

    addStudentInfo(doc, student) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORMACIÓN DEL ESTUDIANTE', 50, 150);
        
        doc.fontSize(12)
           .font('Helvetica')
           .text(`Nombre: ${student.name} ${student.last_name}`, 50, 175)
           .text(`Email: ${student.mail}`, 50, 195)
           .text(`Grado: ${student.grade || 'N/A'}`, 50, 215)
           .text(`Año Escolar: ${student.school_year || new Date().getFullYear()}`, 300, 215);
    }

    addGradesTable(doc, grades) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('CALIFICACIONES', 50, 250);

        let y = 280;
        
        // Table headers
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('Materia', 50, y)
           .text('Calificación', 200, y)
           .text('Fecha', 300, y)
           .text('Estado', 400, y);

        y += 20;
        doc.moveTo(50, y).lineTo(500, y).stroke();
        y += 10;

        // Table rows
        doc.font('Helvetica');
        grades.forEach(grade => {
            const status = grade.calification >= 3.0 ? 'Aprobado' : 'Reprobado';
            const color = grade.calification >= 3.0 ? 'green' : 'red';
            
            doc.text(grade.name_subject || 'N/A', 50, y)
               .text(grade.calification.toString(), 200, y)
               .text(new Date(grade.created_at || Date.now()).toLocaleDateString('es-ES'), 300, y)
               .fillColor(color)
               .text(status, 400, y)
               .fillColor('black');
            
            y += 20;
        });
    }

    addGradeStatistics(doc, grades) {
        if (grades.length === 0) return;

        const average = grades.reduce((sum, g) => sum + parseFloat(g.calification), 0) / grades.length;
        const highest = Math.max(...grades.map(g => parseFloat(g.calification)));
        const lowest = Math.min(...grades.map(g => parseFloat(g.calification)));
        const passing = grades.filter(g => parseFloat(g.calification) >= 3.0).length;

        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('ESTADÍSTICAS', 50, doc.y + 30);

        doc.fontSize(12)
           .font('Helvetica')
           .text(`Promedio General: ${average.toFixed(2)}`, 50, doc.y + 20)
           .text(`Calificación Más Alta: ${highest}`, 50, doc.y + 15)
           .text(`Calificación Más Baja: ${lowest}`, 50, doc.y + 15)
           .text(`Materias Aprobadas: ${passing}/${grades.length}`, 50, doc.y + 15);
    }

    addClassInfo(doc, classData) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORMACIÓN DE LA CLASE', 50, 150);
        
        doc.fontSize(12)
           .font('Helvetica')
           .text(`Materia: ${classData.subject}`, 50, 175)
           .text(`Grado: ${classData.grade}`, 50, 195)
           .text(`Año Escolar: ${classData.school_year}`, 50, 215)
           .text(`Profesor: ${classData.teacher}`, 300, 175)
           .text(`Total Estudiantes: ${classData.student_count}`, 300, 195);
    }

    addCertificateDesign(doc, student, type, details) {
        // Certificate border
        doc.rect(30, 30, 535, 750).stroke();
        doc.rect(40, 40, 515, 730).stroke();

        // Title
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('CERTIFICADO', 50, 100, { align: 'center' });

        doc.fontSize(18)
           .text(`DE ${type.toUpperCase()}`, 50, 140, { align: 'center' });

        // Content
        doc.fontSize(14)
           .font('Helvetica')
           .text('Se certifica que', 50, 200, { align: 'center' });

        doc.fontSize(20)
           .font('Helvetica-Bold')
           .text(`${student.name} ${student.last_name}`, 50, 240, { align: 'center' });

        doc.fontSize(14)
           .font('Helvetica')
           .text(details.description || 'Ha completado satisfactoriamente los requisitos académicos', 50, 300, { align: 'center', width: 500 });

        // Date and signatures
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 50, 500);
        
        doc.text('_________________________', 50, 600)
           .text('Director Académico', 50, 620);
        
        doc.text('_________________________', 350, 600)
           .text('Secretario Académico', 350, 620);
    }

    addFooter(doc) {
        doc.fontSize(8)
           .text('Este documento es generado automáticamente por el Sistema Learnex', 50, 750, { align: 'center' });
    }

    // Data retrieval methods
    async getStudentData(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT u.*, c.grade, c.school_year
                 FROM learnex.users u
                 LEFT JOIN learnex.students_curses sc ON u.id_user = sc.id_user
                 LEFT JOIN learnex.curses c ON sc.id_curse = c.id_curse
                 WHERE u.id_user = $1 AND u.rol = 'student'`,
                [studentId]
            );
            
            if (result.rows.length === 0) {
                return { success: false, error: 'Student not found' };
            }
            
            return { success: true, student: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudentGrades(studentId, period = null) {
        try {
            let query = `
                SELECT n.*, s.name_subject, n.calification
                FROM learnex.notes n
                JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst
                JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                WHERE n.id_student = $1
            `;
            
            const params = [studentId];
            
            if (period) {
                query += ' AND EXTRACT(YEAR FROM n.created_at) = $2';
                params.push(period);
            }
            
            query += ' ORDER BY s.name_subject';
            
            const result = await this.pool.query(query, params);
            
            return { success: true, grades: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudentAttendance(studentId, period = null) {
        // This would require an attendance table - placeholder implementation
        return { 
            success: true, 
            attendance: {
                total_days: 180,
                present_days: 165,
                absent_days: 15,
                percentage: 91.7
            }
        };
    }

    async getInstitutionalAnalytics(startDate, endDate) {
        try {
            const stats = await this.pool.query(`
                SELECT 
                    COUNT(CASE WHEN rol = 'student' THEN 1 END) as total_students,
                    COUNT(CASE WHEN rol = 'teacher' THEN 1 END) as total_teachers,
                    AVG(n.calification) as average_grade
                FROM learnex.users u
                LEFT JOIN learnex.notes n ON u.id_user = n.id_student
                WHERE u.state = 'active'
            `);
            
            return {
                stats: stats.rows[0],
                trends: [],
                recommendations: [
                    'Mantener el nivel académico actual',
                    'Implementar programas de apoyo para estudiantes en riesgo',
                    'Continuar con la capacitación docente'
                ]
            };
        } catch (error) {
            throw error;
        }
    }

    // Utility methods
    addInstitutionalStats(doc, stats) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('ESTADÍSTICAS INSTITUCIONALES', 50, 150);
        
        doc.fontSize(12)
           .font('Helvetica')
           .text(`Total Estudiantes: ${stats.total_students}`, 50, 180)
           .text(`Total Profesores: ${stats.total_teachers}`, 50, 200)
           .text(`Promedio Institucional: ${parseFloat(stats.average_grade || 0).toFixed(2)}`, 50, 220);
    }

    addPerformanceTrends(doc, trends) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('TENDENCIAS DE RENDIMIENTO', 50, 260);
        
        doc.fontSize(12)
           .font('Helvetica')
           .text('Análisis de tendencias disponible en versión completa', 50, 290);
    }

    addRecommendations(doc, recommendations) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('RECOMENDACIONES', 50, 330);
        
        doc.fontSize(12)
           .font('Helvetica');
        
        let y = 360;
        recommendations.forEach((rec, index) => {
            doc.text(`${index + 1}. ${rec}`, 50, y);
            y += 20;
        });
    }

    // Get list of generated reports
    async getReportsList() {
        try {
            const files = fs.readdirSync(this.reportsDir);
            const reports = files.map(file => {
                const filepath = path.join(this.reportsDir, file);
                const stats = fs.statSync(filepath);
                
                return {
                    filename: file,
                    created: stats.birthtime,
                    size: stats.size
                };
            });
            
            return { success: true, reports };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete old reports
    async cleanupOldReports(daysOld = 30) {
        try {
            const files = fs.readdirSync(this.reportsDir);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            let deletedCount = 0;
            
            files.forEach(file => {
                const filepath = path.join(this.reportsDir, file);
                const stats = fs.statSync(filepath);
                
                if (stats.birthtime < cutoffDate) {
                    fs.unlinkSync(filepath);
                    deletedCount++;
                }
            });
            
            return { success: true, deleted: deletedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = { PDFSystem };
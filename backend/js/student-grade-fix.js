// Fix for student grade display - adds course/grade information
// This file adds the missing endpoint to get student information with their grade/course

const { Pool } = require('pg');

// Database configuration
const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
};

function createPool() {
    return new Pool(dbConfig);
}

async function executeQuery(query, params = []) {
    const pool = createPool();
    try {
        const result = await pool.query(query, params);
        return result;
    } finally {
        pool.end();
    }
}

// Add student grade endpoints to existing server
function addStudentGradeEndpoints(app) {
    
    // Get student grades with course information
    app.get('/api/student-grades/:studentId', async (req, res) => {
        const { studentId } = req.params;
        
        try {
            // Get student grades with course and subject information
            const gradesQuery = `
                SELECT 
                    n.calification,
                    s.name_subject,
                    c.grade as course_grade,
                    c.school_year,
                    u.name as teacher_name,
                    u.last_name as teacher_last_name,
                    n.created_at as date
                FROM learnex.notes n
                JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst
                JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                JOIN learnex.curses c ON cst.id_curse = c.id_curse
                JOIN learnex.users u ON cst.id_teacher = u.id_user
                WHERE n.id_student = $1
                ORDER BY n.created_at DESC
            `;
            
            const gradesResult = await executeQuery(gradesQuery, [studentId]);
            
            // Get student course information
            const courseQuery = `
                SELECT 
                    c.grade,
                    c.school_year,
                    u.name,
                    u.last_name,
                    u.mail
                FROM learnex.students_curses sc
                JOIN learnex.curses c ON sc.id_curse = c.id_curse
                JOIN learnex.users u ON sc.id_user = u.id_user
                WHERE sc.id_user = $1
            `;
            
            const courseResult = await executeQuery(courseQuery, [studentId]);
            
            const studentInfo = courseResult.rows[0] || {};
            const grades = gradesResult.rows.map(grade => ({
                ...grade,
                teacher: `${grade.teacher_name} ${grade.teacher_last_name}`,
                subject: grade.name_subject
            }));
            
            res.json({
                success: true,
                student: {
                    name: `${studentInfo.name} ${studentInfo.last_name}`,
                    email: studentInfo.mail,
                    grade: studentInfo.grade,
                    school_year: studentInfo.school_year
                },
                grades: grades
            });
            
        } catch (error) {
            console.error('Error getting student grades:', error);
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get student dashboard data with course info
    app.get('/api/dashboard/:userId/:userRole', async (req, res) => {
        const { userId, userRole } = req.params;
        
        try {
            if (userRole === 'student') {
                // Get student course information
                const courseQuery = `
                    SELECT 
                        c.grade,
                        c.school_year,
                        u.name,
                        u.last_name
                    FROM learnex.students_curses sc
                    JOIN learnex.curses c ON sc.id_curse = c.id_curse
                    JOIN learnex.users u ON sc.id_user = u.id_user
                    WHERE sc.id_user = $1
                `;
                
                const courseResult = await executeQuery(courseQuery, [userId]);
                const studentInfo = courseResult.rows[0] || {};
                
                // Get grades average
                const avgQuery = `
                    SELECT AVG(n.calification) as average, COUNT(*) as total_grades
                    FROM learnex.notes n
                    WHERE n.id_student = $1
                `;
                
                const avgResult = await executeQuery(avgQuery, [userId]);
                const gradeInfo = avgResult.rows[0] || { average: 0, total_grades: 0 };
                
                res.json({
                    success: true,
                    data: {
                        student: {
                            name: `${studentInfo.name} ${studentInfo.last_name}`,
                            grade: studentInfo.grade,
                            school_year: studentInfo.school_year,
                            average: parseFloat(gradeInfo.average || 0).toFixed(1),
                            total_grades: gradeInfo.total_grades
                        }
                    }
                });
            } else {
                res.json({ success: true, data: {} });
            }
            
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            res.json({ success: false, error: error.message });
        }
    });
}

module.exports = { addStudentGradeEndpoints };
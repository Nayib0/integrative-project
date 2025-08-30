/**
 * API Routes for Learnex Educational Platform
 * Handles all HTTP endpoints for the application
 */

const { Pool } = require('pg');

// Database configuration
const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
};

/**
 * Create database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
function createPool() {
    return new Pool(dbConfig);
}

/**
 * Execute database query with error handling
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
async function executeQuery(query, params = []) {
    const pool = createPool();
    try {
        const result = await pool.query(query, params);
        return result;
    } finally {
        pool.end();
    }
}

/**
 * Setup all API routes
 * @param {Express} app - Express application instance
 */
function setupRoutes(app) {
    
    // Authentication endpoint
    app.post('/api/auth', async (req, res) => {
        const { username, password } = req.body;
        
        try {
            const result = await executeQuery(
                'SELECT * FROM learnex.users WHERE mail = $1 AND password = $2 AND state = $3',
                [username, password, 'active']
            );
            
            if (result.rows.length > 0) {
                const user = result.rows[0];
                res.json({
                    success: true,
                    user: {
                        id: user.id_user,
                        username: user.mail,
                        name: `${user.name} ${user.last_name}`,
                        role: user.rol
                    }
                });
            } else {
                res.json({ success: false, error: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Database error:', error);
            res.json({ success: false, error: 'Connection error' });
        }
    });
    
    // Test database connection
    app.get('/api/test-db', async (req, res) => {
        try {
            const result = await executeQuery('SELECT * FROM learnex.users LIMIT 5');
            res.json({ success: true, users: result.rows });
        } catch (error) {
            console.error('Database test error:', error);
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get all students
    app.get('/api/students', async (req, res) => {
        try {
            const result = await executeQuery(
                'SELECT u.id_user, u.name, u.last_name, u.mail FROM learnex.users u WHERE u.rol = $1 AND u.state = $2',
                ['student', 'active']
            );
            
            res.json({ success: true, students: result.rows });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get student grades
    app.get('/api/students/:id/grades', async (req, res) => {
        const { id } = req.params;
        
        try {
            const result = await executeQuery(
                'SELECT n.*, s.name_subject FROM learnex.notes n JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst JOIN learnex.subjects s ON cst.id_subject = s.id_subjects WHERE n.id_student = $1',
                [id]
            );
            
            res.json({ success: true, grades: result.rows });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get all teachers
    app.get('/api/teachers', async (req, res) => {
        try {
            const result = await executeQuery(
                'SELECT id_user, name, last_name, mail FROM learnex.users WHERE rol = $1 AND state = $2',
                ['teacher', 'active']
            );
            
            res.json({ success: true, teachers: result.rows });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get all subjects
    app.get('/api/subjects', async (req, res) => {
        try {
            const result = await executeQuery('SELECT * FROM learnex.subjects');
            res.json({ success: true, subjects: result.rows });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get all courses
    app.get('/api/courses', async (req, res) => {
        try {
            const result = await executeQuery('SELECT * FROM learnex.curses');
            res.json({ success: true, courses: result.rows });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Create new grade
    app.post('/api/grades', async (req, res) => {
        const { id_student, id_cst, calification } = req.body;
        
        try {
            const result = await executeQuery(
                'INSERT INTO learnex.notes (id_student, id_cst, calification) VALUES ($1, $2, $3) RETURNING *',
                [id_student, id_cst, calification]
            );
            
            res.json({ success: true, grade: result.rows[0] });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
    
    // Get analytics
    app.get('/api/analytics', async (req, res) => {
        try {
            const students = await executeQuery(
                'SELECT COUNT(*) FROM learnex.users WHERE rol = $1 AND state = $2',
                ['student', 'active']
            );
            
            const teachers = await executeQuery(
                'SELECT COUNT(*) FROM learnex.users WHERE rol = $1 AND state = $2',
                ['teacher', 'active']
            );
            
            const avgGrade = await executeQuery('SELECT AVG(calification) FROM learnex.notes');
            
            res.json({
                success: true,
                analytics: {
                    totalStudents: parseInt(students.rows[0].count),
                    totalTeachers: parseInt(teachers.rows[0].count),
                    averageGrade: parseFloat(avgGrade.rows[0].avg || 0).toFixed(1)
                }
            });
        } catch (error) {
            res.json({ success: false, error: error.message });
        }
    });
}

module.exports = { setupRoutes };
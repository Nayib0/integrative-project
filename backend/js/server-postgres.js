import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { pool } from '../../server/conexion_db.js';
import { AIEnhancedFeatures } from './ai-enhanced-features.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Initialize AI Enhanced Features
const aiFeatures = new AIEnhancedFeatures(DEEPSEEK_API_KEY);

// Middleware
app.use(express.static(path.join(__dirname, '../../')));
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        res.json({ 
            success: true, 
            database: 'PostgreSQL',
            message: 'Conexión exitosa'
        });
    } catch (error) {
        res.json({ 
            success: false, 
            database: 'PostgreSQL',
            message: error.message
        });
    }
});

// Authentication endpoint - SAME LOGIC AS SQLite
app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM learnex.users WHERE mail = $1 AND password = $2 AND state = $3',
            [email, password, 'active']
        );
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({
                success: true,
                user: {
                    id: user.id_user,
                    name: user.name,
                    lastName: user.last_name,
                    email: user.mail,
                    role: user.rol
                }
            });
        } else {
            res.json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        client.release();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({
            success: false,
            message: 'Error del servidor: ' + error.message
        });
    }
});

// AI-Enhanced Dashboard
app.get('/api/ai-dashboard/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;
    
    try {
        const client = await pool.connect();
        
        // Get user data
        const userResult = await client.query(
            'SELECT name, last_name FROM learnex.users WHERE id_user = $1',
            [userId]
        );
        
        let userData = { name: 'Usuario' };
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            userData.name = `${user.name} ${user.last_name}`;
        }
        
        // Get role-specific data
        if (role === 'student') {
            const avgResult = await client.query(
                'SELECT AVG(calification) as average FROM learnex.notes WHERE id_student = $1',
                [userId]
            );
            userData.average = avgResult.rows[0]?.average || 0;
        }
        
        // Generate AI content
        const aiContent = await aiFeatures.generateDashboardContent(role, userData);
        
        res.json({ success: true, data: aiContent, userData });
        client.release();
        
    } catch (error) {
        console.error('Error en AI dashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get teacher's students
app.get('/api/teacher-students/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    
    try {
        const client = await pool.connect();
        
        // Get students assigned to this teacher's classes
        const studentsResult = await client.query(`
            SELECT DISTINCT u.id_user, u.name, u.last_name, u.mail,
                   AVG(n.calification) as average,
                   COUNT(n.id_note) as total_grades,
                   c.grade as course_grade
            FROM learnex.users u
            JOIN learnex.students_curses sc ON u.id_user = sc.id_user
            JOIN learnex.curses c ON sc.id_curse = c.id_curse
            JOIN learnex.curse_subject_teacher cst ON c.id_curse = cst.id_curse
            LEFT JOIN learnex.notes n ON u.id_user = n.id_student AND n.id_cst = cst.id_cst
            WHERE cst.id_teacher = $1 AND u.rol = 'student'
            GROUP BY u.id_user, u.name, u.last_name, u.mail, c.grade
            ORDER BY u.name, u.last_name
        `, [teacherId]);
        
        const students = studentsResult.rows.map(student => ({
            id: student.id_user,
            name: `${student.name} ${student.last_name}`,
            email: student.mail,
            average: student.average ? parseFloat(student.average).toFixed(1) : 'N/A',
            totalGrades: student.total_grades || 0,
            courseGrade: student.course_grade
        }));
        
        res.json({ success: true, students });
        client.release();
        
    } catch (error) {
        console.error('Error obteniendo estudiantes del profesor:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get detailed student info
app.get('/api/student-details/:studentId', async (req, res) => {
    const { studentId } = req.params;
    
    try {
        const client = await pool.connect();
        
        // Get student basic info
        const studentResult = await client.query(
            'SELECT id_user, name, last_name, mail FROM learnex.users WHERE id_user = $1 AND rol = $2',
            [studentId, 'student']
        );
        
        if (studentResult.rows.length === 0) {
            return res.json({ success: false, message: 'Estudiante no encontrado' });
        }
        
        const student = studentResult.rows[0];
        
        // Get student grades
        const gradesResult = await client.query(`
            SELECT n.calification, s.name_subject, n.id_note
            FROM learnex.notes n
            JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst
            JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
            WHERE n.id_student = $1
            ORDER BY n.id_note DESC
        `, [studentId]);
        
        // Get student course info
        const courseResult = await client.query(`
            SELECT c.grade, c.school_year
            FROM learnex.students_curses sc
            JOIN learnex.curses c ON sc.id_curse = c.id_curse
            WHERE sc.id_user = $1
        `, [studentId]);
        
        const studentDetails = {
            id: student.id_user,
            name: `${student.name} ${student.last_name}`,
            email: student.mail,
            grades: gradesResult.rows,
            course: courseResult.rows[0] || null,
            average: gradesResult.rows.length > 0 ? 
                (gradesResult.rows.reduce((sum, g) => sum + g.calification, 0) / gradesResult.rows.length).toFixed(1) : 'N/A'
        };
        
        res.json({ success: true, student: studentDetails });
        client.release();
        
    } catch (error) {
        console.error('Error obteniendo detalles del estudiante:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// AI Study Plan Generator
app.post('/api/ai-study-plan', async (req, res) => {
    const { userId } = req.body;
    
    try {
        const client = await pool.connect();
        
        const avgResult = await client.query(
            'SELECT AVG(calification) as average FROM learnex.notes WHERE id_student = $1',
            [userId]
        );
        
        const studentData = {
            average: avgResult.rows[0]?.average || 0
        };
        
        const studyPlan = await aiFeatures.generateStudyPlan(studentData, ['Matemáticas', 'Ciencias', 'Historia']);
        
        res.json({ success: true, studyPlan });
        client.release();
        
    } catch (error) {
        console.error('Error generando plan de estudio:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// AI Class Insights for Teachers
app.get('/api/ai-class-insights/:teacherId', async (req, res) => {
    const { teacherId } = req.params;
    
    try {
        const client = await pool.connect();
        
        // Get class data
        const classResult = await client.query(`
            SELECT COUNT(DISTINCT sc.id_user) as total_students,
                   AVG(n.calification) as average
            FROM learnex.curse_subject_teacher cst
            LEFT JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
            LEFT JOIN learnex.notes n ON cst.id_cst = n.id_cst
            WHERE cst.id_teacher = $1
        `, [teacherId]);
        
        const classData = {
            totalStudents: classResult.rows[0]?.total_students || 0,
            average: classResult.rows[0]?.average || 0,
            gradeDistribution: { excellent: 20, good: 50, regular: 25, poor: 5 }
        };
        
        const insights = await aiFeatures.generateClassInsights(classData);
        
        res.json({ success: true, insights, classData });
        client.release();
        
    } catch (error) {
        console.error('Error en class insights:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user dashboard data - SAME LOGIC AS SQLite
app.get('/api/dashboard/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;
    
    try {
        const client = await pool.connect();
        let dashboardData = {};
        
        if (role === 'student') {
            // Get student grades
            const grades = await client.query(`
                SELECT n.calification, s.name_subject, c.grade
                FROM learnex.notes n
                JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst
                JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                JOIN learnex.curses c ON cst.id_curse = c.id_curse
                WHERE n.id_student = $1
                ORDER BY n.id_note DESC
                LIMIT 10
            `, [userId]);
            
            // Calculate average
            const avgResult = await client.query(`
                SELECT AVG(calification) as average
                FROM learnex.notes
                WHERE id_student = $1
            `, [userId]);
            
            dashboardData = {
                grades: grades.rows,
                average: avgResult.rows[0]?.average || 0,
                totalGrades: grades.rows.length
            };
            
        } else if (role === 'teacher') {
            // Get teacher's classes
            const classes = await client.query(`
                SELECT DISTINCT c.grade, s.name_subject, COUNT(sc.id_user) as student_count
                FROM learnex.curse_subject_teacher cst
                JOIN learnex.curses c ON cst.id_curse = c.id_curse
                JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                LEFT JOIN learnex.students_curses sc ON c.id_curse = sc.id_curse
                WHERE cst.id_teacher = $1
                GROUP BY c.id_curse, s.id_subjects
            `, [userId]);
            
            dashboardData = {
                classes: classes.rows,
                totalClasses: classes.rows.length
            };
            
        } else if (role === 'admin') {
            // Get system statistics
            const stats = await Promise.all([
                client.query("SELECT COUNT(*) as count FROM learnex.users WHERE rol = 'student'"),
                client.query("SELECT COUNT(*) as count FROM learnex.users WHERE rol = 'teacher'"),
                client.query("SELECT COUNT(*) as count FROM learnex.curses"),
                client.query("SELECT COUNT(*) as count FROM learnex.notes")
            ]);
            
            dashboardData = {
                totalStudents: stats[0].rows[0].count,
                totalTeachers: stats[1].rows[0].count,
                totalCourses: stats[2].rows[0].count,
                totalGrades: stats[3].rows[0].count
            };
        }
        
        res.json({ success: true, data: dashboardData });
        client.release();
        
    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({ success: false, message: 'Error del servidor: ' + error.message });
    }
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Chatbot API - SAME AS SQLite
app.post('/api/chatbot', async (req, res) => {
    const { message, userRole } = req.body;
    
    try {
        const response = await generateAIResponse(message, userRole);
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        const fallbackResponse = generateChatbotResponse(message, userRole);
        res.json({ response: fallbackResponse });
    }
});

// AI Response function
async function generateAIResponse(message, userRole) {
    const systemPrompt = `Eres un tutor virtual educativo para ${userRole === 'student' ? 'estudiantes' : 'profesores'}. 
Responde de forma clara, educativa y útil. Usa emojis y formato estructurado.
Si es sobre el sistema educativo, menciona las secciones relevantes como "Mis Tareas", "Calificaciones", etc.`;
    
    try {
        const response = await axios.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.choices[0].message.content;
    } catch (error) {
        throw error;
    }
}

// Fallback chatbot function
function generateChatbotResponse(message, userRole) {
    const msg = message.toLowerCase();
    
    if (msg.includes('segunda guerra mundial') || msg.includes('wwii') || msg.includes('guerra mundial')) {
        return '🌍 **Segunda Guerra Mundial (1939-1945)**\\n\\n📅 **Fechas clave:**\\n• Inicio: 1 sept 1939 (invasión a Polonia)\\n• Fin: 2 sept 1945 (rendición de Japón)\\n\\n⚔️ **Bandos principales:**\\n• Aliados: Reino Unido, URSS, EE.UU., Francia\\n• Eje: Alemania, Italia, Japón\\n\\n🔥 **Eventos importantes:**\\n• Pearl Harbor (1941)\\n• Desembarco de Normandía (1944)\\n• Bombas atómicas (Hiroshima y Nagasaki)\\n\\n¿Quieres saber sobre algún aspecto específico?';
    }
    
    if (userRole === 'student') {
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola! 👋 Soy tu tutor virtual con PostgreSQL. Puedo ayudarte con:\\n• Tareas y calificaciones\\n• Conceptos académicos\\n• Horarios y asistencia\\n\\n¿En qué te ayudo?';
        }
    }
    
    if (userRole === 'teacher') {
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola profesor! 👨🏫 Sistema con PostgreSQL activo. Estoy aquí para ayudarte con:\\n• Gestión de clase\\n• Seguimiento estudiantil\\n\\n¿En qué puedo asistirte?';
        }
    }
    
    return '🤖 **Sistema Learnex con PostgreSQL:**\\n\\n✅ Base de datos empresarial activa\\n\\n📚 Puedo ayudarte con:\\n• Conceptos académicos\\n• Tareas y calificaciones\\n• Técnicas de estudio\\n\\n¿Sobre qué tema quieres aprender?';
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Learnex con PostgreSQL ejecutándose en http://localhost:${PORT}`);
    console.log('🐘 Base de datos: PostgreSQL (Empresarial)');
    
    // Test database connection on startup
    try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ Base de datos PostgreSQL conectada');
    } catch (error) {
        console.log('❌ Error: PostgreSQL no disponible');
        console.log('💡 Verifica que PostgreSQL esté ejecutándose');
        console.log('💡 Ejecuta: npm run seed (para cargar datos)');
    }
});
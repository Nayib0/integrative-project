import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { sqlitePool, testSQLiteConnection } from '../../database/sqlite-connection.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Middleware
app.use(express.static(path.join(__dirname, '../../')));
app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
    const isConnected = await testSQLiteConnection();
    res.json({ 
        success: isConnected, 
        database: 'SQLite',
        message: isConnected ? 'Conexión exitosa' : 'Error de conexión'
    });
});

// Authentication endpoint
app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const client = await sqlitePool.connect();
        const result = await client.query(
            'SELECT id_user, name, last_name, mail, rol FROM users WHERE mail = ? AND password = ? AND state = ?',
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
            message: 'Error del servidor'
        });
    }
});

// Get user dashboard data
app.get('/api/dashboard/:userId/:role', async (req, res) => {
    const { userId, role } = req.params;
    
    try {
        const client = await sqlitePool.connect();
        let dashboardData = {};
        
        if (role === 'student') {
            // Get student grades
            const grades = await client.query(`
                SELECT n.calification, s.name_subject, c.grade
                FROM notes n
                JOIN curse_subject_teacher cst ON n.id_cst = cst.id_cst
                JOIN subjects s ON cst.id_subject = s.id_subjects
                JOIN curses c ON cst.id_curse = c.id_curse
                WHERE n.id_student = ?
                ORDER BY n.id_note DESC
                LIMIT 10
            `, [userId]);
            
            // Calculate average
            const avgResult = await client.query(`
                SELECT AVG(calification) as average
                FROM notes
                WHERE id_student = ?
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
                FROM curse_subject_teacher cst
                JOIN curses c ON cst.id_curse = c.id_curse
                JOIN subjects s ON cst.id_subject = s.id_subjects
                LEFT JOIN students_curses sc ON c.id_curse = sc.id_curse
                WHERE cst.id_teacher = ?
                GROUP BY c.id_curse, s.id_subjects
            `, [userId]);
            
            dashboardData = {
                classes: classes.rows,
                totalClasses: classes.rows.length
            };
            
        } else if (role === 'admin') {
            // Get system statistics
            const stats = await Promise.all([
                client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'student'"),
                client.query("SELECT COUNT(*) as count FROM users WHERE rol = 'teacher'"),
                client.query("SELECT COUNT(*) as count FROM curses"),
                client.query("SELECT COUNT(*) as count FROM notes")
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
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// API del chatbot
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

// Función con IA DeepSeek
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

// Función de respaldo local
function generateChatbotResponse(message, userRole) {
    const msg = message.toLowerCase();
    
    // CONOCIMIENTO ACADÉMICO - Historia
    if (msg.includes('segunda guerra mundial') || msg.includes('wwii') || msg.includes('guerra mundial')) {
        return '🌍 **Segunda Guerra Mundial (1939-1945)**\\n\\n📅 **Fechas clave:**\\n• Inicio: 1 sept 1939 (invasión a Polonia)\\n• Fin: 2 sept 1945 (rendición de Japón)\\n\\n⚔️ **Bandos principales:**\\n• Aliados: Reino Unido, URSS, EE.UU., Francia\\n• Eje: Alemania, Italia, Japón\\n\\n🔥 **Eventos importantes:**\\n• Pearl Harbor (1941)\\n• Desembarco de Normandía (1944)\\n• Bombas atómicas (Hiroshima y Nagasaki)\\n\\n¿Quieres saber sobre algún aspecto específico?';
    }
    
    // CONOCIMIENTO ACADÉMICO - Matemáticas
    if (msg.includes('ecuacion') || msg.includes('algebra') || msg.includes('formula')) {
        return '🔢 **Matemáticas - Conceptos clave:**\\n\\n📐 **Ecuaciones lineales:** ax + b = 0\\n• Solución: x = -b/a\\n\\n📊 **Ecuación cuadrática:** ax² + bx + c = 0\\n• Fórmula: x = (-b ± √(b²-4ac)) / 2a\\n\\n📈 **Funciones básicas:**\\n• Lineal: f(x) = mx + b\\n• Cuadrática: f(x) = ax² + bx + c\\n\\n¿Necesitas ayuda con algún problema específico?';
    }
    
    // CONOCIMIENTO ACADÉMICO - Ciencias
    if (msg.includes('fotosintesis') || msg.includes('plantas') || msg.includes('biologia')) {
        return '🌱 **Fotosíntesis:**\\n\\n🔬 **Proceso:** Las plantas convierten luz solar en energía\\n\\n⚗️ **Ecuación:**\\n6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂\\n\\n📍 **Lugar:** Cloroplastos (hojas verdes)\\n\\n✨ **Importancia:**\\n• Produce oxígeno\\n• Base de la cadena alimentaria\\n• Absorbe CO₂ del ambiente\\n\\n¿Quieres saber más sobre biología?';
    }
    
    if (msg.includes('fisica') || msg.includes('newton') || msg.includes('gravedad')) {
        return '⚡ **Física - Leyes de Newton:**\\n\\n1️⃣ **Primera Ley (Inercia):**\\nUn objeto en reposo permanece en reposo\\n\\n2️⃣ **Segunda Ley:**\\nF = ma (Fuerza = masa × aceleración)\\n\\n3️⃣ **Tercera Ley:**\\nA toda acción corresponde una reacción igual y opuesta\\n\\n🌍 **Gravedad:** g = 9.8 m/s²\\n\\n¿Te interesa algún concepto específico de física?';
    }
    
    // Respuestas para estudiantes
    if (userRole === 'student') {
        if (msg.includes('tarea') || msg.includes('homework')) {
            return '📚 Para ver tus tareas pendientes, ve a la sección "Mis Tareas". También puedo ayudarte con conceptos académicos. ¿En qué materia necesitas ayuda?';
        }
        if (msg.includes('calificacion') || msg.includes('nota') || msg.includes('grade')) {
            return '⭐ Puedes revisar tus calificaciones en "Mis Calificaciones". ¡Sigue así!';
        }
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola! 👋 Soy tu tutor virtual con base de datos SQLite. Puedo ayudarte con:\\n• Tareas y calificaciones\\n• Conceptos académicos (historia, matemáticas, ciencias)\\n• Horarios y asistencia\\n• Consejos de estudio\\n\\n¿En qué te ayudo?';
        }
    }
    
    // Respuestas para profesores
    if (userRole === 'teacher') {
        if (msg.includes('estudiante') || msg.includes('student')) {
            return '👥 Puedes ver el progreso de tus estudiantes en el dashboard. ¿Quieres información sobre algún estudiante específico?';
        }
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola profesor! 👨🏫 Sistema con SQLite activo. Estoy aquí para ayudarte con:\\n• Gestión de clase y calificaciones\\n• Contenido académico para enseñar\\n• Seguimiento estudiantil\\n• Recursos educativos\\n\\n¿En qué puedo asistirte?';
        }
    }
    
    return '🤖 **Sistema Learnex con SQLite:**\\n\\n✅ Base de datos portátil activa\\n\\n📚 Puedo ayudarte con:\\n• Conceptos académicos (historia, matemáticas, ciencias)\\n• Tareas y calificaciones\\n• Horarios y asistencia\\n• Técnicas de estudio\\n\\n¿Sobre qué tema quieres aprender?';
}

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`🚀 Servidor Learnex con SQLite ejecutándose en http://localhost:${PORT}`);
    console.log('🗄️ Base de datos: SQLite (Portátil)');
    
    // Test database connection on startup
    const isConnected = await testSQLiteConnection();
    if (isConnected) {
        console.log('✅ Base de datos SQLite lista');
    } else {
        console.log('❌ Error: Base de datos SQLite no disponible');
        console.log('💡 Ejecuta: npm run setup-sqlite');
    }
});
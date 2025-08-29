require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');
const multer = require('multer');

// Import all systems
const { setupRoutes } = require('./routes');
const { TasksSystem, upload } = require('./tasks-system');
const { MessagingSystem } = require('./messaging-system');
const { AnalyticsSystem } = require('./analytics-system');
const { EvaluationSystem } = require('./evaluation-system');
const { ScheduleSystem } = require('./schedule-system');
const { PDFSystem } = require('./pdf-system');
const { GamificationSystem } = require('./gamification-system');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: '123456',
    port: 5432,
});

// Initialize systems
const tasksSystem = new TasksSystem(pool);
const messagingSystem = new MessagingSystem(pool, io);
const analyticsSystem = new AnalyticsSystem(pool);
const evaluationSystem = new EvaluationSystem(pool);
const scheduleSystem = new ScheduleSystem(pool);
const pdfSystem = new PDFSystem(pool);
const gamificationSystem = new GamificationSystem(pool);

// DeepSeek API Configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Middleware
app.use(express.static(path.join(__dirname, '../../')));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use('/reports', express.static(path.join(__dirname, '../../reports')));

// Setup original routes
setupRoutes(app);

// ==========================================
// TASKS SYSTEM ROUTES
// ==========================================

// Create task
app.post('/api/tasks', async (req, res) => {
    const result = await tasksSystem.createTask(req.body);
    res.json(result);
});

// Get teacher tasks
app.get('/api/tasks/teacher/:teacherId', async (req, res) => {
    const result = await tasksSystem.getTeacherTasks(req.params.teacherId);
    res.json(result);
});

// Get student tasks
app.get('/api/tasks/student/:studentId', async (req, res) => {
    const result = await tasksSystem.getStudentTasks(req.params.studentId);
    res.json(result);
});

// Submit task
app.post('/api/tasks/submit', upload.single('file'), async (req, res) => {
    const result = await tasksSystem.submitTask(req.body, req.file);
    res.json(result);
});

// Grade submission
app.post('/api/tasks/grade', async (req, res) => {
    const { submissionId, score, feedback } = req.body;
    const result = await tasksSystem.gradeSubmission(submissionId, score, feedback);
    res.json(result);
});

// Get task submissions
app.get('/api/tasks/:taskId/submissions', async (req, res) => {
    const result = await tasksSystem.getTaskSubmissions(req.params.taskId);
    res.json(result);
});

// Auto-grade task
app.post('/api/tasks/:taskId/auto-grade', async (req, res) => {
    const result = await tasksSystem.autoGradeTask(req.params.taskId);
    res.json(result);
});

// ==========================================
// MESSAGING SYSTEM ROUTES
// ==========================================

// Create conversation
app.post('/api/conversations', async (req, res) => {
    const { title, type, creatorId, participantIds } = req.body;
    const result = await messagingSystem.createConversation(title, type, creatorId, participantIds);
    res.json(result);
});

// Get user conversations
app.get('/api/conversations/user/:userId', async (req, res) => {
    const result = await messagingSystem.getUserConversations(req.params.userId);
    res.json(result);
});

// Send message
app.post('/api/messages', async (req, res) => {
    const { conversationId, senderId, content, messageType, filePath } = req.body;
    const result = await messagingSystem.sendMessage(conversationId, senderId, content, messageType, filePath);
    res.json(result);
});

// Get messages
app.get('/api/conversations/:conversationId/messages', async (req, res) => {
    const { userId, limit, offset } = req.query;
    const result = await messagingSystem.getMessages(req.params.conversationId, userId, limit, offset);
    res.json(result);
});

// Mark as read
app.post('/api/conversations/:conversationId/read', async (req, res) => {
    const { userId } = req.body;
    const result = await messagingSystem.markAsRead(req.params.conversationId, userId);
    res.json(result);
});

// Create class group
app.post('/api/conversations/class-group', async (req, res) => {
    const { teacherId, courseId, subjectId } = req.body;
    const result = await messagingSystem.createClassGroup(teacherId, courseId, subjectId);
    res.json(result);
});

// ==========================================
// ANALYTICS SYSTEM ROUTES
// ==========================================

// Get dashboard analytics
app.get('/api/analytics/dashboard/:userId/:userRole', async (req, res) => {
    const result = await analyticsSystem.getDashboardAnalytics(req.params.userId, req.params.userRole);
    res.json(result);
});

// Export analytics data
app.get('/api/analytics/export/:userId/:userRole', async (req, res) => {
    const { format } = req.query;
    const result = await analyticsSystem.exportAnalyticsData(req.params.userId, req.params.userRole, format);
    res.json(result);
});

// ==========================================
// EVALUATION SYSTEM ROUTES
// ==========================================

// Create exam
app.post('/api/exams', async (req, res) => {
    const result = await evaluationSystem.createExam(req.body);
    res.json(result);
});

// Add question to exam
app.post('/api/exams/questions', async (req, res) => {
    const result = await evaluationSystem.addQuestion(req.body);
    res.json(result);
});

// Get teacher exams
app.get('/api/exams/teacher/:teacherId', async (req, res) => {
    const result = await evaluationSystem.getTeacherExams(req.params.teacherId);
    res.json(result);
});

// Get student exams
app.get('/api/exams/student/:studentId', async (req, res) => {
    const result = await evaluationSystem.getStudentExams(req.params.studentId);
    res.json(result);
});

// Start exam attempt
app.post('/api/exams/:examId/start', async (req, res) => {
    const { studentId } = req.body;
    const result = await evaluationSystem.startExamAttempt(req.params.examId, studentId);
    res.json(result);
});

// Submit answer
app.post('/api/exams/answer', async (req, res) => {
    const { attemptId, questionId, answerText } = req.body;
    const result = await evaluationSystem.submitAnswer(attemptId, questionId, answerText);
    res.json(result);
});

// Finish exam
app.post('/api/exams/attempts/:attemptId/finish', async (req, res) => {
    const result = await evaluationSystem.finishExamAttempt(req.params.attemptId);
    res.json(result);
});

// Get exam results
app.get('/api/exams/:examId/results', async (req, res) => {
    const result = await evaluationSystem.getExamResults(req.params.examId);
    res.json(result);
});

// Get exam analysis
app.get('/api/exams/:examId/analysis', async (req, res) => {
    const result = await evaluationSystem.getExamAnalysis(req.params.examId);
    res.json(result);
});

// ==========================================
// SCHEDULE SYSTEM ROUTES
// ==========================================

// Create schedule
app.post('/api/schedules', async (req, res) => {
    const result = await scheduleSystem.createSchedule(req.body);
    res.json(result);
});

// Get teacher schedule
app.get('/api/schedules/teacher/:teacherId', async (req, res) => {
    const result = await scheduleSystem.getTeacherSchedule(req.params.teacherId);
    res.json(result);
});

// Get student schedule
app.get('/api/schedules/student/:studentId', async (req, res) => {
    const result = await scheduleSystem.getStudentSchedule(req.params.studentId);
    res.json(result);
});

// Create event
app.post('/api/events', async (req, res) => {
    const result = await scheduleSystem.createEvent(req.body);
    res.json(result);
});

// Get user events
app.get('/api/events/user/:userId', async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await scheduleSystem.getUserEvents(req.params.userId, startDate, endDate);
    res.json(result);
});

// Get calendar data
app.get('/api/calendar/:userId/:year/:month', async (req, res) => {
    const result = await scheduleSystem.getCalendarData(req.params.userId, req.params.year, req.params.month);
    res.json(result);
});

// Get upcoming events
app.get('/api/events/upcoming/:userId', async (req, res) => {
    const { limit } = req.query;
    const result = await scheduleSystem.getUpcomingEvents(req.params.userId, limit);
    res.json(result);
});

// ==========================================
// PDF SYSTEM ROUTES
// ==========================================

// Generate student report card
app.post('/api/reports/student-card', async (req, res) => {
    const { studentId, period } = req.body;
    const result = await pdfSystem.generateStudentReportCard(studentId, period);
    res.json(result);
});

// Generate class report
app.post('/api/reports/class', async (req, res) => {
    const { teacherId, courseId, subjectId } = req.body;
    const result = await pdfSystem.generateClassReport(teacherId, courseId, subjectId);
    res.json(result);
});

// Generate attendance report
app.post('/api/reports/attendance', async (req, res) => {
    const { courseId, startDate, endDate } = req.body;
    const result = await pdfSystem.generateAttendanceReport(courseId, startDate, endDate);
    res.json(result);
});

// Generate certificate
app.post('/api/reports/certificate', async (req, res) => {
    const { studentId, certificateType, details } = req.body;
    const result = await pdfSystem.generateCertificate(studentId, certificateType, details);
    res.json(result);
});

// Get reports list
app.get('/api/reports/list', async (req, res) => {
    const result = await pdfSystem.getReportsList();
    res.json(result);
});

// ==========================================
// GAMIFICATION SYSTEM ROUTES
// ==========================================

// Get student profile
app.get('/api/gamification/profile/:studentId', async (req, res) => {
    const result = await gamificationSystem.getStudentProfile(req.params.studentId);
    res.json(result);
});

// Award points
app.post('/api/gamification/award-points', async (req, res) => {
    const { studentId, pointType, metadata } = req.body;
    const result = await gamificationSystem.awardPoints(studentId, pointType, metadata);
    res.json(result);
});

// Get leaderboard
app.get('/api/gamification/leaderboard', async (req, res) => {
    const { limit, courseId } = req.query;
    const result = await gamificationSystem.getLeaderboard(limit, courseId);
    res.json(result);
});

// Get active challenges
app.get('/api/gamification/challenges', async (req, res) => {
    const result = await gamificationSystem.getActiveChallenges();
    res.json(result);
});

// Initialize achievements
app.post('/api/gamification/init-achievements', async (req, res) => {
    const result = await gamificationSystem.initializeDefaultAchievements();
    res.json(result);
});

// ==========================================
// ENHANCED CHATBOT WITH SYSTEM INTEGRATION
// ==========================================

app.post('/api/chatbot', async (req, res) => {
    const { message, userRole, userId } = req.body;
    
    try {
        const response = await generateEnhancedAIResponse(message, userRole, userId);
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        const fallbackResponse = generateChatbotResponse(message, userRole);
        res.json({ response: fallbackResponse });
    }
});

// Enhanced AI response with system integration
async function generateEnhancedAIResponse(message, userRole, userId) {
    // Get user context from systems
    let userContext = '';
    
    if (userId && userRole === 'student') {
        try {
            const [tasks, profile] = await Promise.all([
                tasksSystem.getStudentTasks(userId),
                gamificationSystem.getStudentProfile(userId)
            ]);
            
            userContext = `Usuario: Estudiante con ${tasks.tasks?.length || 0} tareas, ${profile.profile?.points?.total_points || 0} puntos de gamificación.`;
        } catch (error) {
            console.error('Error getting student context:', error);
        }
    } else if (userId && userRole === 'teacher') {
        try {
            const tasks = await tasksSystem.getTeacherTasks(userId);
            userContext = `Usuario: Profesor con ${tasks.tasks?.length || 0} tareas creadas.`;
        } catch (error) {
            console.error('Error getting teacher context:', error);
        }
    }
    
    const systemPrompt = `Eres un tutor virtual educativo para ${userRole === 'student' ? 'estudiantes' : 'profesores'}.
${userContext}
Responde de forma clara, educativa y útil. Usa emojis y formato estructurado.
Si es sobre el sistema educativo, menciona las secciones relevantes como "Mis Tareas", "Calificaciones", etc.
Puedes hacer referencia a las funcionalidades del sistema como tareas, mensajería, horarios, gamificación, etc.`;
    
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

// Original chatbot fallback function
function generateChatbotResponse(message, userRole) {
    const msg = message.toLowerCase();
    
    // Enhanced responses with new system features
    if (userRole === 'student') {
        if (msg.includes('tarea') || msg.includes('homework')) {
            return '📚 **Sistema de Tareas Mejorado:**\\n\\n• Ve a "Mis Tareas" para ver pendientes\\n• Puedes subir archivos directamente\\n• Recibe notificaciones de vencimiento\\n• Sistema de calificación automática\\n\\n¿Necesitas ayuda con alguna tarea específica?';
        }
        if (msg.includes('puntos') || msg.includes('gamificacion')) {
            return '🎮 **Sistema de Gamificación:**\\n\\n🏆 Gana puntos por:\\n• Completar tareas (+10 pts)\\n• Exámenes aprobados (+20 pts)\\n• Entregas tempranas (+5 pts)\\n\\n🎯 Ve tu ranking en "Logros"\\n\\n¿Quieres saber sobre los desafíos activos?';
        }
        if (msg.includes('examen') || msg.includes('evaluacion')) {
            return '📝 **Sistema de Evaluaciones:**\\n\\n✨ Nuevas funciones:\\n• Exámenes online interactivos\\n• Corrección automática\\n• Resultados inmediatos\\n• Análisis de rendimiento\\n\\nRevisa "Evaluaciones" para ver próximos exámenes.';
        }
    }
    
    if (userRole === 'teacher') {
        if (msg.includes('mensaje') || msg.includes('chat')) {
            return '💬 **Sistema de Mensajería Avanzado:**\\n\\n📱 Funciones nuevas:\\n• Chat en tiempo real\\n• Grupos de clase\\n• Notificaciones push\\n• Historial completo\\n\\n¿Quieres crear un grupo para tu clase?';
        }
        if (msg.includes('reporte') || msg.includes('pdf')) {
            return '📊 **Sistema de Reportes PDF:**\\n\\n📋 Genera automáticamente:\\n• Boletines estudiantiles\\n• Reportes de clase\\n• Certificados digitales\\n• Análisis de asistencia\\n\\n¿Qué tipo de reporte necesitas?';
        }
        if (msg.includes('horario') || msg.includes('calendario')) {
            return '📅 **Gestión de Horarios:**\\n\\n🗓️ Funciones:\\n• Calendario interactivo\\n• Programación de clases\\n• Recordatorios automáticos\\n• Sincronización Google Calendar\\n\\n¿Necesitas programar un evento?';
        }
    }
    
    // Original responses...
    if (msg.includes('segunda guerra mundial') || msg.includes('wwii') || msg.includes('guerra mundial')) {
        return '🌍 **Segunda Guerra Mundial (1939-1945)**\\n\\n📅 **Fechas clave:**\\n• Inicio: 1 sept 1939 (invasión a Polonia)\\n• Fin: 2 sept 1945 (rendición de Japón)\\n\\n⚔️ **Bandos principales:**\\n• Aliados: Reino Unido, URSS, EE.UU., Francia\\n• Eje: Alemania, Italia, Japón\\n\\n🔥 **Eventos importantes:**\\n• Pearl Harbor (1941)\\n• Desembarco de Normandía (1944)\\n• Bombas atómicas (Hiroshima y Nagasaki)\\n\\n¿Quieres saber sobre algún aspecto específico?';
    }
    
    return '🤖 **Sistema Learnex Mejorado:**\\n\\n🆕 **Nuevas funciones:**\\n• 📚 Sistema de tareas con archivos\\n• 💬 Mensajería en tiempo real\\n• 📊 Analytics con IA\\n• 📝 Evaluaciones online\\n• 📅 Calendario interactivo\\n• 📄 Reportes PDF automáticos\\n• 🎮 Gamificación completa\\n\\n¿Qué funcionalidad quieres explorar?';
}

// ==========================================
// SOCKET.IO REAL-TIME FEATURES
// ==========================================

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    
    // Setup messaging system socket events
    messagingSystem.setupSocketEvents(socket);
    
    // Handle notifications
    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
    });
    
    // Handle real-time analytics updates
    socket.on('request_analytics_update', async (data) => {
        const analytics = await analyticsSystem.getDashboardAnalytics(data.userId, data.userRole);
        socket.emit('analytics_update', analytics);
    });
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

// ==========================================
// SCHEDULED TASKS
// ==========================================

// Check for due tasks every hour
setInterval(async () => {
    try {
        await tasksSystem.checkDueTasks();
        await scheduleSystem.createReminders();
        console.log('✅ Scheduled tasks completed');
    } catch (error) {
        console.error('❌ Error in scheduled tasks:', error);
    }
}, 60 * 60 * 1000); // 1 hour

// Clean up old reports weekly
setInterval(async () => {
    try {
        await pdfSystem.cleanupOldReports(30);
        console.log('✅ Old reports cleaned up');
    } catch (error) {
        console.error('❌ Error cleaning reports:', error);
    }
}, 7 * 24 * 60 * 60 * 1000); // 1 week

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Initialize systems on startup
async function initializeSystems() {
    try {
        await gamificationSystem.initializeDefaultAchievements();
        console.log('✅ Systems initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing systems:', error);
    }
}

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Servidor Learnex ejecutándose en http://localhost:${PORT}`);
    console.log('🔥 Funcionalidades activas:');
    console.log('   📚 Sistema de Tareas con archivos');
    console.log('   💬 Mensajería en tiempo real');
    console.log('   📊 Analytics con IA');
    console.log('   📝 Evaluaciones online');
    console.log('   📅 Gestión de horarios');
    console.log('   📄 Reportes PDF');
    console.log('   🎮 Sistema de gamificación');
    
    initializeSystems();
});
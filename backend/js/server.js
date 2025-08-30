import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
// // import { setupRoutes } from './routes.js'; // Comentado temporalmente

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

// Setup API routes - comentado temporalmente
// setupRoutes(app);

// Import and setup student grade fix
const { addStudentGradeEndpoints } = require('./student-grade-fix');
addStudentGradeEndpoints(app);

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
        return '🌍 **Segunda Guerra Mundial (1939-1945)**\n\n📅 **Fechas clave:**\n• Inicio: 1 sept 1939 (invasión a Polonia)\n• Fin: 2 sept 1945 (rendición de Japón)\n\n⚔️ **Bandos principales:**\n• Aliados: Reino Unido, URSS, EE.UU., Francia\n• Eje: Alemania, Italia, Japón\n\n🔥 **Eventos importantes:**\n• Pearl Harbor (1941)\n• Desembarco de Normandía (1944)\n• Bombas atómicas (Hiroshima y Nagasaki)\n\n¿Quieres saber sobre algún aspecto específico?';
    }
    
    // CONOCIMIENTO ACADÉMICO - Matemáticas
    if (msg.includes('ecuacion') || msg.includes('algebra') || msg.includes('formula')) {
        return '🔢 **Matemáticas - Conceptos clave:**\n\n📐 **Ecuaciones lineales:** ax + b = 0\n• Solución: x = -b/a\n\n📊 **Ecuación cuadrática:** ax² + bx + c = 0\n• Fórmula: x = (-b ± √(b²-4ac)) / 2a\n\n📈 **Funciones básicas:**\n• Lineal: f(x) = mx + b\n• Cuadrática: f(x) = ax² + bx + c\n\n¿Necesitas ayuda con algún problema específico?';
    }
    
    // CONOCIMIENTO ACADÉMICO - Ciencias
    if (msg.includes('fotosintesis') || msg.includes('plantas') || msg.includes('biologia')) {
        return '🌱 **Fotosíntesis:**\n\n🔬 **Proceso:** Las plantas convierten luz solar en energía\n\n⚗️ **Ecuación:**\n6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂\n\n📍 **Lugar:** Cloroplastos (hojas verdes)\n\n✨ **Importancia:**\n• Produce oxígeno\n• Base de la cadena alimentaria\n• Absorbe CO₂ del ambiente\n\n¿Quieres saber más sobre biología?';
    }
    
    if (msg.includes('fisica') || msg.includes('newton') || msg.includes('gravedad')) {
        return '⚡ **Física - Leyes de Newton:**\n\n1️⃣ **Primera Ley (Inercia):**\nUn objeto en reposo permanece en reposo\n\n2️⃣ **Segunda Ley:**\nF = ma (Fuerza = masa × aceleración)\n\n3️⃣ **Tercera Ley:**\nA toda acción corresponde una reacción igual y opuesta\n\n🌍 **Gravedad:** g = 9.8 m/s²\n\n¿Te interesa algún concepto específico de física?';
    }
    
    // Respuestas para estudiantes
    if (userRole === 'student') {
        if (msg.includes('tarea') || msg.includes('homework')) {
            return '📚 Para ver tus tareas pendientes, ve a la sección "Mis Tareas". También puedo ayudarte con conceptos académicos. ¿En qué materia necesitas ayuda?';
        }
        if (msg.includes('calificacion') || msg.includes('nota') || msg.includes('grade')) {
            return '⭐ Puedes revisar tus calificaciones en "Mis Calificaciones". Tu promedio actual es 4.2. ¡Sigue así!';
        }
        if (msg.includes('matematicas') || msg.includes('math')) {
            return '🔢 Para matemáticas te recomiendo: 1) Revisar los ejercicios del libro, 2) Practicar 30 min diarios, 3) Preguntar dudas al profesor. ¿Necesitas ayuda con algún tema específico como álgebra o geometría?';
        }
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola! 👋 Soy tu tutor virtual. Puedo ayudarte con:\n• Tareas y calificaciones\n• Conceptos académicos (historia, matemáticas, ciencias)\n• Horarios y asistencia\n• Consejos de estudio\n\n¿En qué te ayudo?';
        }
    }
    
    // Respuestas para profesores
    if (userRole === 'teacher') {
        if (msg.includes('calificar') || msg.includes('grade')) {
            return '📝 Tienes 8 tareas pendientes por calificar. Ve a "Calificaciones" para revisarlas. ¿Necesitas ayuda con algún criterio?';
        }
        if (msg.includes('estudiante') || msg.includes('student')) {
            return '👥 Tienes 32 estudiantes activos. El promedio de la clase es 4.1. ¿Quieres ver el progreso de algún estudiante específico?';
        }
        if (msg.includes('asistencia') || msg.includes('attendance')) {
            return '📅 La asistencia promedio de tu clase es 92%. Puedes tomar asistencia en la sección correspondiente.';
        }
        if (msg.includes('hola') || msg.includes('hello')) {
            return '¡Hola profesor! 👨🏫 Estoy aquí para ayudarte con:\n• Gestión de clase y calificaciones\n• Contenido académico para enseñar\n• Seguimiento estudiantil\n• Recursos educativos\n\n¿En qué puedo asistirte?';
        }
    }
    
    // Respuestas generales
    if (msg.includes('horario') || msg.includes('schedule')) {
        return '🕐 Puedes ver tu horario completo en la sección "Mi Horario". ¿Necesitas información sobre alguna clase específica?';
    }
    
    if (msg.includes('estudiar') || msg.includes('study')) {
        return '📖 **Técnicas de estudio efectivas:**\n\n⏰ **Técnica Pomodoro:** 25 min estudio + 5 min descanso\n\n📝 **Métodos:**\n• Resúmenes y mapas mentales\n• Práctica activa\n• Enseñar a otros\n\n🧠 **Consejos:**\n• Estudia en lugar silencioso\n• Elimina distracciones\n• Descansa bien\n\n¿Qué materia estás estudiando?';
    }
    
    return '🤖 Puedo ayudarte con:\n• 📚 Conceptos académicos (historia, matemáticas, ciencias)\n• 📋 Tareas y calificaciones\n• 📅 Horarios y asistencia\n• 💡 Técnicas de estudio\n\n¿Sobre qué tema quieres aprender?';
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
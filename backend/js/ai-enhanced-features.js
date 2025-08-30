import axios from 'axios';

// AI-Enhanced Features for Learnex
export class AIEnhancedFeatures {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
    }

    // Generate AI-powered dashboard content
    async generateDashboardContent(userRole, userData) {
        const prompt = this.getDashboardPrompt(userRole, userData);
        
        try {
            const response = await this.callDeepSeek(prompt);
            return this.parseDashboardResponse(response, userRole);
        } catch (error) {
            return this.getFallbackDashboard(userRole);
        }
    }

    // Generate personalized recommendations
    async generateRecommendations(userRole, userId, performanceData) {
        const prompt = this.getRecommendationsPrompt(userRole, performanceData);
        
        try {
            const response = await this.callDeepSeek(prompt);
            return this.parseRecommendations(response);
        } catch (error) {
            return this.getFallbackRecommendations(userRole);
        }
    }

    // Generate dynamic reports
    async generateReport(reportType, data) {
        const prompt = this.getReportPrompt(reportType, data);
        
        try {
            const response = await this.callDeepSeek(prompt);
            return this.parseReportResponse(response);
        } catch (error) {
            return this.getFallbackReport(reportType);
        }
    }

    // Generate study plans
    async generateStudyPlan(studentData, subjects) {
        const prompt = `Crea un plan de estudio personalizado para un estudiante con:
        - Promedio actual: ${studentData.average || 'N/A'}
        - Materias: ${subjects.join(', ')}
        - Fortalezas y debilidades basadas en calificaciones
        
        Genera un plan semanal con:
        1. Horarios de estudio específicos
        2. Técnicas recomendadas por materia
        3. Metas semanales alcanzables
        4. Recursos de apoyo
        
        Formato: JSON con estructura clara`;

        try {
            const response = await this.callDeepSeek(prompt);
            return JSON.parse(response);
        } catch (error) {
            return this.getFallbackStudyPlan();
        }
    }

    // Generate class insights for teachers
    async generateClassInsights(classData) {
        const prompt = `Analiza estos datos de clase y genera insights:
        - Total estudiantes: ${classData.totalStudents}
        - Promedio general: ${classData.average}
        - Distribución de calificaciones: ${JSON.stringify(classData.gradeDistribution)}
        
        Proporciona:
        1. Análisis del rendimiento general
        2. Estudiantes que necesitan atención
        3. Recomendaciones pedagógicas
        4. Estrategias de mejora
        
        Formato: JSON estructurado`;

        try {
            const response = await this.callDeepSeek(prompt);
            return JSON.parse(response);
        } catch (error) {
            return this.getFallbackClassInsights();
        }
    }

    // Core DeepSeek API call
    async callDeepSeek(prompt) {
        const response = await axios.post(this.apiUrl, {
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'Eres un asistente educativo experto. Responde en español con información práctica y útil.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 800,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.choices[0].message.content;
    }

    // Dashboard prompts by role
    getDashboardPrompt(userRole, userData) {
        switch (userRole) {
            case 'student':
                return `Genera contenido de dashboard para estudiante:
                - Nombre: ${userData.name}
                - Promedio: ${userData.average || 'N/A'}
                - Materias activas: ${userData.subjects || 'Varias'}
                
                Incluye:
                1. Mensaje motivacional personalizado
                2. 3 consejos de estudio específicos
                3. Metas sugeridas para la semana
                4. Recordatorios importantes
                
                Formato: JSON con campos: message, tips, goals, reminders`;

            case 'teacher':
                return `Genera contenido de dashboard para profesor:
                - Nombre: ${userData.name}
                - Clases: ${userData.totalClasses || 'Varias'}
                - Estudiantes: ${userData.totalStudents || 'Varios'}
                
                Incluye:
                1. Resumen del día
                2. Tareas pendientes prioritarias
                3. Estudiantes que requieren atención
                4. Sugerencias pedagógicas
                
                Formato: JSON con campos: summary, tasks, attention, suggestions`;

            case 'admin':
                return `Genera contenido de dashboard para administrador:
                - Sistema: Learnex v2.0
                - Usuarios totales: ${userData.totalUsers || 'N/A'}
                
                Incluye:
                1. Estado general del sistema
                2. Métricas clave del día
                3. Alertas o recomendaciones
                4. Acciones sugeridas
                
                Formato: JSON con campos: status, metrics, alerts, actions`;

            default:
                return 'Genera un mensaje de bienvenida general para el sistema educativo Learnex.';
        }
    }

    getRecommendationsPrompt(userRole, performanceData) {
        return `Basado en estos datos de rendimiento: ${JSON.stringify(performanceData)}
        
        Genera 5 recomendaciones específicas para mejorar el rendimiento académico.
        Incluye acciones concretas y medibles.
        
        Formato: Array de objetos con {title, description, priority, timeframe}`;
    }

    getReportPrompt(reportType, data) {
        return `Genera un reporte de ${reportType} con estos datos: ${JSON.stringify(data)}
        
        Incluye análisis, conclusiones y recomendaciones.
        Formato profesional y educativo.`;
    }

    // Parse AI responses
    parseDashboardResponse(response, userRole) {
        try {
            return JSON.parse(response);
        } catch (error) {
            return {
                message: response.substring(0, 200) + '...',
                type: userRole,
                generated: true
            };
        }
    }

    parseRecommendations(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            return [{
                title: "Recomendación AI",
                description: response.substring(0, 150) + '...',
                priority: "medium",
                timeframe: "1 semana"
            }];
        }
    }

    parseReportResponse(response) {
        return {
            content: response,
            generated: new Date().toISOString(),
            type: 'ai-generated'
        };
    }

    // Fallback responses when AI fails
    getFallbackDashboard(userRole) {
        const fallbacks = {
            student: {
                message: "¡Bienvenido! Hoy es un gran día para aprender algo nuevo.",
                tips: ["Revisa tus tareas pendientes", "Dedica 30 min a repasar", "Mantén un horario de estudio"],
                goals: ["Completar tareas del día", "Mejorar en matemáticas", "Participar en clase"],
                reminders: ["Examen de ciencias el viernes", "Entrega de proyecto el lunes"]
            },
            teacher: {
                summary: "Dashboard del profesor - Sistema funcionando correctamente",
                tasks: ["Revisar tareas pendientes", "Preparar clase de mañana", "Calificar exámenes"],
                attention: ["Estudiantes con bajo rendimiento", "Asistencia irregular"],
                suggestions: ["Implementar actividades grupales", "Reforzar conceptos básicos"]
            },
            admin: {
                status: "Sistema operativo - Todos los servicios funcionando",
                metrics: ["110 usuarios activos", "88 estudiantes", "11 profesores"],
                alerts: ["Ninguna alerta crítica"],
                actions: ["Revisar reportes semanales", "Actualizar contenido"]
            }
        };
        
        return fallbacks[userRole] || { message: "Sistema funcionando correctamente" };
    }

    getFallbackRecommendations(userRole) {
        return [
            {
                title: "Mantener rutina de estudio",
                description: "Establece horarios fijos para estudiar cada día",
                priority: "high",
                timeframe: "Inmediato"
            },
            {
                title: "Participar activamente",
                description: "Haz preguntas y participa en discusiones de clase",
                priority: "medium",
                timeframe: "Esta semana"
            }
        ];
    }

    getFallbackReport(reportType) {
        return {
            content: `Reporte de ${reportType} generado automáticamente. Los datos muestran un rendimiento general satisfactorio con oportunidades de mejora en áreas específicas.`,
            generated: new Date().toISOString(),
            type: 'fallback'
        };
    }

    getFallbackStudyPlan() {
        return {
            weeklyPlan: {
                monday: ["Matemáticas: 2 horas", "Lectura: 1 hora"],
                tuesday: ["Ciencias: 2 horas", "Historia: 1 hora"],
                wednesday: ["Matemáticas: 1 hora", "Repaso general: 2 horas"],
                thursday: ["Ciencias: 2 horas", "Escritura: 1 hora"],
                friday: ["Repaso semanal: 2 horas", "Preparación exámenes: 1 hora"]
            },
            goals: ["Mejorar promedio en 0.5 puntos", "Completar todas las tareas", "Participar más en clase"],
            techniques: ["Mapas mentales", "Resúmenes", "Práctica activa"]
        };
    }

    getFallbackClassInsights() {
        return {
            performance: "El rendimiento general de la clase es satisfactorio",
            attention: ["Estudiantes con calificaciones por debajo de 3.0"],
            recommendations: ["Implementar tutorías", "Actividades de refuerzo"],
            strategies: ["Aprendizaje colaborativo", "Evaluación formativa"]
        };
    }
}
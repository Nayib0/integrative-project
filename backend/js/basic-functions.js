// Basic functions for all views

function getRoleSpecificData(role) {
    const baseData = {
        admin: {
            totalUsers: 1250,
            activeStudents: 856,
            teachers: 42,
            avgGrade: 4.2
        },
        teacher: {
            myStudents: 32,
            pendingTasks: 8,
            avgAttendance: 92,
            classAvg: 4.1
        },
        student: {
            myAverage: 4.2,
            completedTasks: 12,
            pendingTasks: 3,
            myAttendance: 95
        },
        parent: {
            childAverage: 4.3,
            childAttendance: 96,
            pendingTasks: 2,
            newMessages: 3
        }
    };
    
    return baseData[role] || baseData.student;
}

function generateRecentActivity(role) {
    const activities = {
        admin: [
            { icon: 'fas fa-user-plus', color: 'blue', title: 'Nuevo usuario registrado', desc: 'Profesor Juan Martínez', time: 'Hace 1 hora' },
            { icon: 'fas fa-chart-line', color: 'green', title: 'Reporte generado', desc: 'Análisis mensual completado', time: 'Hace 2 horas' },
            { icon: 'fas fa-cog', color: 'orange', title: 'Configuración actualizada', desc: 'Período académico modificado', time: 'Ayer' }
        ],
        teacher: [
            { icon: 'fas fa-check', color: 'green', title: 'Calificaciones registradas', desc: 'Examen de Matemáticas - 10°A', time: 'Hace 30 min' },
            { icon: 'fas fa-tasks', color: 'blue', title: 'Nueva tarea asignada', desc: 'Ejercicios de álgebra', time: 'Hace 1 hora' },
            { icon: 'fas fa-calendar-check', color: 'orange', title: 'Asistencia tomada', desc: 'Clase de hoy registrada', time: 'Hace 2 horas' }
        ],
        student: [
            { icon: 'fas fa-star', color: 'green', title: 'Calificación recibida', desc: 'Matemáticas: 4.5', time: 'Hace 1 hora' },
            { icon: 'fas fa-upload', color: 'blue', title: 'Tarea entregada', desc: 'Ensayo de Literatura', time: 'Hace 3 horas' },
            { icon: 'fas fa-trophy', color: 'orange', title: 'Logro desbloqueado', desc: 'Estudiante Destacado', time: 'Ayer' }
        ],
        parent: [
            { icon: 'fas fa-star', color: 'green', title: 'Calificación del hijo', desc: 'Ciencias: 4.2', time: 'Hace 2 horas' },
            { icon: 'fas fa-comments', color: 'blue', title: 'Mensaje del profesor', desc: 'Prof. García envió mensaje', time: 'Hace 4 horas' },
            { icon: 'fas fa-calendar', color: 'orange', title: 'Reunión programada', desc: 'Viernes 2:00 PM', time: 'Ayer' }
        ]
    };
    
    return activities[role] || activities.student;
}

function generateAchievementsView() {
    return `
        <h1>🏆 Mis Logros</h1>
        <div class="achievements-container">
            <div class="achievements-grid">
                <div class="achievement-card earned">
                    <div class="achievement-icon">🏆</div>
                    <h3>Estudiante Destacado</h3>
                    <p>Promedio superior a 4.5</p>
                    <span class="earned">✓ Desbloqueado</span>
                </div>
                <div class="achievement-card earned">
                    <div class="achievement-icon">📅</div>
                    <h3>Asistencia Perfecta</h3>
                    <p>100% de asistencia mensual</p>
                    <span class="earned">✓ Desbloqueado</span>
                </div>
                <div class="achievement-card">
                    <div class="achievement-icon">🙋‍♂️</div>
                    <h3>Participación Activa</h3>
                    <p>Participar en 10 clases</p>
                    <span class="progress">7/10</span>
                </div>
            </div>
        </div>
    `;
}

function generateMessagingView() {
    return `
        <h1>💬 Mensajería</h1>
        <div class="messaging-container">
            <div class="messages-list">
                <div class="message-item unread">
                    <div class="message-avatar">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="message-content">
                        <h4>Prof. García</h4>
                        <p>Excelente trabajo en el último examen</p>
                        <span class="message-time">Hace 2 horas</span>
                    </div>
                </div>
                <div class="message-item">
                    <div class="message-avatar">
                        <i class="fas fa-user-cog"></i>
                    </div>
                    <div class="message-content">
                        <h4>Administración</h4>
                        <p>Recordatorio: Reunión de padres el viernes</p>
                        <span class="message-time">Ayer</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateAITutorView() {
    return `
        <h1>🤖 Tutor Virtual IA</h1>
        <div class="ai-tutor-container">
            <div class="chat-container">
                <div class="chat-messages">
                    <div class="message ai">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>¡Hola! Soy tu tutor virtual. ¿En qué materia necesitas ayuda hoy?</p>
                        </div>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Escribe tu pregunta...">
                    <button class="btn-primary">Enviar</button>
                </div>
            </div>
        </div>
    `;
}

function generateObservationsView() {
    return `
        <h1>👁️ Observaciones Estudiantiles</h1>
        <div class="observations-container">
            <div class="table-container">
                <div class="table-header">
                    <h2>Registro de Observaciones</h2>
                    <button class="btn-primary">Nueva Observación</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Estudiante</th>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Observación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Ana García</td>
                            <td>2024-01-15</td>
                            <td><span class="badge positive">Positiva</span></td>
                            <td>Excelente participación en clase</td>
                            <td><button class="btn-secondary">Ver</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateResourcesView() {
    return `
        <h1>📚 Recursos Educativos</h1>
        <div class="resources-container">
            <div class="resources-grid">
                <div class="resource-card">
                    <div class="resource-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="resource-info">
                        <h3>Guías de Estudio</h3>
                        <p>Material de apoyo por materia</p>
                        <button class="btn-primary">Descargar</button>
                    </div>
                </div>
                <div class="resource-card">
                    <div class="resource-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="resource-info">
                        <h3>Videos Educativos</h3>
                        <p>Contenido multimedia</p>
                        <button class="btn-primary">Ver</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateTeachersView() {
    return `
        <h1>👩‍🏫 Gestión de Profesores</h1>
        <div class="table-container">
            <div class="table-header">
                <h2>Lista de Profesores</h2>
                <button class="btn-primary">Agregar Profesor</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Materias</th>
                        <th>Estudiantes</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Prof. María García</td>
                        <td>Matemáticas, Física</td>
                        <td>45</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td><button class="btn-secondary">Ver Perfil</button></td>
                    </tr>
                    <tr>
                        <td>Prof. Carlos López</td>
                        <td>Español, Literatura</td>
                        <td>38</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td><button class="btn-secondary">Ver Perfil</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function generateReportsView() {
    return `
        <h1>📊 Reportes Institucionales</h1>
        <div class="reports-container">
            <div class="reports-grid">
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="report-info">
                        <h3>Reporte Académico</h3>
                        <p>Rendimiento general de estudiantes</p>
                        <button class="btn-primary">Generar</button>
                    </div>
                </div>
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="report-info">
                        <h3>Reporte de Asistencia</h3>
                        <p>Análisis de asistencia mensual</p>
                        <button class="btn-primary">Generar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateChildProgressView() {
    return `
        <h1>📈 Progreso de mi Hijo</h1>
        <div class="child-progress-container">
            <div class="child-info">
                <div class="child-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="child-details">
                    <h2>Ana García</h2>
                    <p>Grado 10°A • Promedio: 4.2</p>
                </div>
            </div>
            <div class="progress-stats">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <h3>4.2</h3>
                        <p>Promedio General</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>96%</h3>
                        <p>Asistencia</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateMeetingsView() {
    return `
        <h1>🤝 Reuniones con Profesores</h1>
        <div class="meetings-container">
            <div class="meetings-header">
                <button class="btn-primary">Agendar Reunión</button>
            </div>
            <div class="meetings-list">
                <div class="meeting-card upcoming">
                    <div class="meeting-date">
                        <span class="day">20</span>
                        <span class="month">ENE</span>
                    </div>
                    <div class="meeting-info">
                        <h3>Reunión con Prof. García</h3>
                        <p>Viernes 2:00 PM - Seguimiento académico</p>
                        <span class="meeting-status upcoming">Próxima</span>
                    </div>
                    <div class="meeting-actions">
                        <button class="btn-secondary">Unirse</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function viewTask(taskId) {
    showModal(`
        <h2>📝 Detalles de la Tarea</h2>
        <div class="task-details">
            <h3>Tarea de Ejemplo</h3>
            <p><strong>Materia:</strong> Matemáticas</p>
            <p><strong>Fecha límite:</strong> 2024-01-20</p>
            <p><strong>Estado:</strong> Pendiente</p>
            <p><strong>Descripción:</strong> Resolver ejercicios de álgebra</p>
            <div class="task-actions">
                <button class="btn-primary" onclick="closeModal()">Cerrar</button>
            </div>
        </div>
    `);
}

function editGrade(subject) {
    showModal(`
        <h2>✏️ Editar Calificación</h2>
        <div class="grade-form">
            <div class="form-group">
                <label>Materia:</label>
                <input type="text" value="${subject}" readonly>
            </div>
            <div class="form-group">
                <label>Nueva Calificación:</label>
                <input type="number" min="0" max="5" step="0.1" placeholder="4.5">
            </div>
            <div class="form-actions">
                <button class="btn-primary" onclick="closeModal()">Guardar</button>
                <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
            </div>
        </div>
    `);
}

// Missing additional features
function addAdvancedFilters() {
    return `
        <div class="advanced-filters">
            <select>
                <option>Todos los grados</option>
                <option>10°A</option>
                <option>10°B</option>
                <option>11°A</option>
            </select>
            <select>
                <option>Todas las materias</option>
                <option>Matemáticas</option>
                <option>Español</option>
                <option>Ciencias</option>
            </select>
        </div>
    `;
}

function createGradeCalculator() {
    return `
        <div class="grade-calculator">
            <h3>Calculadora de Calificaciones</h3>
            <div class="calculator-inputs">
                <div class="input-row">
                    <label>Exámenes (40%):</label>
                    <input type="number" min="0" max="5" step="0.1">
                </div>
                <div class="input-row">
                    <label>Tareas (30%):</label>
                    <input type="number" min="0" max="5" step="0.1">
                </div>
                <div class="result">
                    <strong>Calificación Final: <span>0.0</span></strong>
                </div>
            </div>
        </div>
    `;
}

function generateEvaluationsView() {
    return `
        <h1>📋 Evaluaciones</h1>
        <div class="evaluations-container">
            <div class="table-container">
                <div class="table-header">
                    <h2>Mis Evaluaciones</h2>
                    <button class="btn-primary">Nueva Evaluación</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Materia</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Examen Parcial</td>
                            <td>Matemáticas</td>
                            <td>2024-01-20</td>
                            <td><span style="color: green;">Activo</span></td>
                            <td><button class="btn-secondary">Ver</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function generateAIRecommendationsView() {
    return `
        <h1>🧠 IA Educativa</h1>
        <div class="ai-recommendations-container">
            <div class="recommendations-grid">
                <div class="recommendation-card">
                    <div class="recommendation-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="recommendation-content">
                        <h3>Recomendación Personalizada</h3>
                        <p>Basado en el rendimiento de tus estudiantes, se sugiere reforzar los temas de álgebra.</p>
                        <button class="btn-primary">Ver Detalles</button>
                    </div>
                </div>
                <div class="recommendation-card">
                    <div class="recommendation-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="recommendation-content">
                        <h3>Análisis de Progreso</h3>
                        <p>El 85% de tus estudiantes han mejorado en las últimas evaluaciones.</p>
                        <button class="btn-primary">Ver Análisis</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateVideoCallsView() {
    return `
        <h1>📹 Clases Virtuales</h1>
        <div class="video-calls-container">
            <div class="calls-header">
                <button class="btn-primary">Nueva Videollamada</button>
            </div>
            <div class="calls-grid">
                <div class="call-card">
                    <div class="call-info">
                        <h3>Clase de Matemáticas</h3>
                        <p>10°A • Hoy 2:00 PM</p>
                        <span class="call-status upcoming">Próxima</span>
                    </div>
                    <div class="call-actions">
                        <button class="btn-primary">Iniciar</button>
                    </div>
                </div>
                <div class="call-card">
                    <div class="call-info">
                        <h3>Tutoría Individual</h3>
                        <p>Ana García • Mañana 10:00 AM</p>
                        <span class="call-status scheduled">Programada</span>
                    </div>
                    <div class="call-actions">
                        <button class="btn-secondary">Editar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDigitalLibrary() {
    return `
        <h1>📚 Biblioteca Digital</h1>
        <div class="library-container">
            <div class="library-header">
                <input type="text" placeholder="Buscar recursos..." class="search-input">
                <button class="btn-primary">Subir Recurso</button>
            </div>
            <div class="library-grid">
                <div class="resource-item">
                    <div class="resource-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="resource-info">
                        <h4>Guía de Álgebra</h4>
                        <p>Matemáticas • PDF</p>
                        <button class="btn-secondary">Descargar</button>
                    </div>
                </div>
                <div class="resource-item">
                    <div class="resource-icon">
                        <i class="fas fa-video"></i>
                    </div>
                    <div class="resource-info">
                        <h4>Video Tutorial</h4>
                        <p>Ciencias • MP4</p>
                        <button class="btn-secondary">Ver</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createAdvancedAnalytics() {
    return `
        <h1>📊 Analíticas Avanzadas</h1>
        <div class="analytics-container">
            <div class="analytics-stats">
                <div class="stat-card">
                    <div class="stat-icon blue">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3>85%</h3>
                        <p>Tasa de Aprobación</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>92%</h3>
                        <p>Asistencia Promedio</p>
                    </div>
                </div>
            </div>
            <div class="analytics-charts">
                <div class="chart-placeholder">
                    <h3>Rendimiento por Materia</h3>
                    <p>Gráfico de barras mostrando el rendimiento promedio por materia</p>
                </div>
                <div class="chart-placeholder">
                    <h3>Tendencia de Calificaciones</h3>
                    <p>Gráfico de líneas mostrando la evolución temporal</p>
                </div>
            </div>
        </div>
    `;
}

function createGamificationSystem() {
    return `
        <h1>🎮 Sistema de Gamificación</h1>
        <div class="gamification-container">
            <div class="game-stats">
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <h3>1,250</h3>
                        <p>Puntos Totales</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-info">
                        <h3>15</h3>
                        <p>Logros Desbloqueados</p>
                    </div>
                </div>
            </div>
            <div class="achievements-showcase">
                <h3>Logros Recientes</h3>
                <div class="achievement-list">
                    <div class="achievement-item">
                        <span class="achievement-icon">🏆</span>
                        <span>Estudiante del Mes</span>
                    </div>
                    <div class="achievement-item">
                        <span class="achievement-icon">📚</span>
                        <span>Lector Avanzado</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createDataImportSystem() {
    return `
        <h1>📤 Importar Datos</h1>
        <div class="import-container">
            <div class="import-options">
                <div class="import-card">
                    <div class="import-icon">
                        <i class="fas fa-file-excel"></i>
                    </div>
                    <div class="import-info">
                        <h3>Importar desde Excel</h3>
                        <p>Cargar datos de estudiantes y calificaciones</p>
                        <button class="btn-primary">Seleccionar Archivo</button>
                    </div>
                </div>
                <div class="import-card">
                    <div class="import-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="import-info">
                        <h3>Importar desde CSV</h3>
                        <p>Cargar datos en formato CSV</p>
                        <button class="btn-primary">Seleccionar Archivo</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createBackupSystem() {
    return `
        <h1>💾 Sistema de Backup</h1>
        <div class="backup-container">
            <div class="backup-options">
                <div class="backup-card">
                    <h3>Crear Backup</h3>
                    <p>Generar copia de seguridad completa</p>
                    <button class="btn-primary">Crear Backup</button>
                </div>
                <div class="backup-card">
                    <h3>Restaurar Backup</h3>
                    <p>Restaurar desde copia de seguridad</p>
                    <button class="btn-secondary">Restaurar</button>
                </div>
            </div>
        </div>
    `;
}

function createSMTPConfig() {
    return `
        <h1>📧 Configuración SMTP</h1>
        <div class="smtp-container">
            <div class="config-form">
                <div class="form-group">
                    <label>Servidor SMTP:</label>
                    <input type="text" placeholder="smtp.gmail.com">
                </div>
                <div class="form-group">
                    <label>Puerto:</label>
                    <input type="number" placeholder="587">
                </div>
                <div class="form-group">
                    <label>Usuario:</label>
                    <input type="email" placeholder="usuario@dominio.com">
                </div>
                <button class="btn-primary">Guardar Configuración</button>
            </div>
        </div>
    `;
}

function createEmailTemplates() {
    return `
        <h1>📄 Plantillas de Email</h1>
        <div class="templates-container">
            <div class="templates-grid">
                <div class="template-card">
                    <h3>Bienvenida</h3>
                    <p>Plantilla para nuevos usuarios</p>
                    <button class="btn-secondary">Editar</button>
                </div>
                <div class="template-card">
                    <h3>Notificación de Calificaciones</h3>
                    <p>Envío automático de notas</p>
                    <button class="btn-secondary">Editar</button>
                </div>
            </div>
        </div>
    `;
}

function createAcademicPeriods() {
    return `
        <h1>📅 Períodos Académicos</h1>
        <div class="periods-container">
            <div class="table-container">
                <div class="table-header">
                    <h2>Gestión de Períodos</h2>
                    <button class="btn-primary">Nuevo Período</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Período</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Primer Semestre 2024</td>
                            <td>2024-01-15</td>
                            <td>2024-06-30</td>
                            <td><span style="color: green;">Activo</span></td>
                            <td><button class="btn-secondary">Editar</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function createSubjectAssignment() {
    return `
        <h1>📚 Asignación de Materias</h1>
        <div class="assignment-container">
            <div class="assignment-form">
                <div class="form-group">
                    <label>Profesor:</label>
                    <select>
                        <option>Seleccionar profesor...</option>
                        <option>Prof. García</option>
                        <option>Prof. López</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Materia:</label>
                    <select>
                        <option>Seleccionar materia...</option>
                        <option>Matemáticas</option>
                        <option>Español</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Grado:</label>
                    <select>
                        <option>Seleccionar grado...</option>
                        <option>10°A</option>
                        <option>10°B</option>
                    </select>
                </div>
                <button class="btn-primary">Asignar</button>
            </div>
        </div>
    `;
}
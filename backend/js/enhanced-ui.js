/**
 * Enhanced UI Components for Learnex
 * Modern interface with all new system integrations
 */

// Enhanced App State with new systems
const EnhancedAppState = {
    ...AppState,
    socket: null,
    notifications: [],
    realTimeData: {
        messages: [],
        analytics: {},
        gamification: {}
    }
};

// Initialize Socket.IO connection
function initializeSocket() {
    if (typeof io !== 'undefined') {
        EnhancedAppState.socket = io();
        
        EnhancedAppState.socket.on('connect', () => {
            console.log('🔌 Connected to real-time server');
            if (AppState.currentUser) {
                EnhancedAppState.socket.emit('join_user_room', AppState.currentUser.id);
            }
        });
        
        EnhancedAppState.socket.on('new_message', (message) => {
            displayNewMessageNotification(message);
            updateMessagesUI(message);
        });
        
        EnhancedAppState.socket.on('analytics_update', (analytics) => {
            EnhancedAppState.realTimeData.analytics = analytics;
            updateAnalyticsUI(analytics);
        });
    }
}

// Enhanced view rendering with new systems
function renderEnhancedViewContent(viewName, contentArea) {
    let content = '';
    
    switch(viewName) {
        case 'tasks':
            content = generateEnhancedTasksView();
            break;
        case 'messaging':
            content = generateMessagingView();
            break;
        case 'analytics':
            content = generateAnalyticsView();
            break;
        case 'evaluations':
            content = generateEvaluationsView();
            break;
        case 'schedule':
            content = generateScheduleView();
            break;
        case 'reports':
            content = generateReportsView();
            break;
        case 'gamification':
            content = generateGamificationView();
            break;
        default:
            content = renderViewContent(viewName, contentArea);
            return;
    }
    
    contentArea.innerHTML = content;
    contentArea.classList.add('fade-in');
    setTimeout(() => contentArea.classList.remove('fade-in'), 500);
    
    // Initialize view-specific functionality
    initializeViewFunctionality(viewName);
}

// Enhanced Tasks View
function generateEnhancedTasksView() {
    const userRole = AppState.currentUser?.role;
    
    if (userRole === 'teacher') {
        return `
            <div class="enhanced-header">
                <h1>📚 Gestión de Tareas</h1>
                <div class="header-actions">
                    <button class="btn-primary" onclick="showCreateTaskModal()">
                        <i class="fas fa-plus"></i> Nueva Tarea
                    </button>
                    <button class="btn-secondary" onclick="autoGradeAllTasks()">
                        <i class="fas fa-robot"></i> Auto-calificar
                    </button>
                </div>
            </div>
            
            <div class="stats-cards">
                <div class="stat-card">
                    <div class="stat-icon blue"><i class="fas fa-tasks"></i></div>
                    <div class="stat-info">
                        <h3 id="totalTasks">-</h3>
                        <p>Tareas Creadas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3 id="pendingSubmissions">-</h3>
                        <p>Por Calificar</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green"><i class="fas fa-check"></i></div>
                    <div class="stat-info">
                        <h3 id="completedTasks">-</h3>
                        <p>Completadas</p>
                    </div>
                </div>
            </div>
            
            <div class="enhanced-table-container">
                <div class="table-filters">
                    <input type="text" id="taskSearch" placeholder="🔍 Buscar tareas..." onkeyup="filterTasks()">
                    <select id="statusFilter" onchange="filterTasks()">
                        <option value="">Todos los estados</option>
                        <option value="active">Activas</option>
                        <option value="completed">Completadas</option>
                        <option value="overdue">Vencidas</option>
                    </select>
                </div>
                
                <div id="tasksTableContainer">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Cargando tareas...
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="enhanced-header">
                <h1>📖 Mis Tareas</h1>
                <div class="header-stats">
                    <span class="stat-badge pending" id="pendingCount">0 Pendientes</span>
                    <span class="stat-badge completed" id="completedCount">0 Completadas</span>
                </div>
            </div>
            
            <div class="tasks-grid" id="studentTasksGrid">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> Cargando tareas...
                </div>
            </div>
        `;
    }
}

// Enhanced Messaging View
function generateMessagingView() {
    return `
        <div class="messaging-container">
            <div class="conversations-sidebar">
                <div class="sidebar-header">
                    <h2>💬 Conversaciones</h2>
                    <button class="btn-primary btn-sm" onclick="showNewConversationModal()">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="conversation-search">
                    <input type="text" placeholder="🔍 Buscar conversaciones..." onkeyup="searchConversations(this.value)">
                </div>
                
                <div id="conversationsList" class="conversations-list">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Cargando...
                    </div>
                </div>
            </div>
            
            <div class="chat-area">
                <div class="chat-header" id="chatHeader">
                    <div class="chat-info">
                        <h3>Selecciona una conversación</h3>
                        <p>Elige una conversación para comenzar a chatear</p>
                    </div>
                </div>
                
                <div class="messages-container" id="messagesContainer">
                    <div class="no-conversation">
                        <i class="fas fa-comments fa-3x"></i>
                        <p>Selecciona una conversación para ver los mensajes</p>
                    </div>
                </div>
                
                <div class="message-input-container" id="messageInputContainer" style="display: none;">
                    <div class="typing-indicator" id="typingIndicator" style="display: none;">
                        <span>Alguien está escribiendo...</span>
                    </div>
                    
                    <div class="message-input">
                        <input type="text" id="messageInput" placeholder="Escribe tu mensaje..." onkeypress="handleMessageKeyPress(event)">
                        <button class="btn-primary" onclick="sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Enhanced Analytics View
function generateAnalyticsView() {
    return `
        <div class="analytics-dashboard">
            <div class="dashboard-header">
                <h1>📊 Analytics Dashboard</h1>
                <div class="header-actions">
                    <button class="btn-secondary" onclick="exportAnalytics('pdf')">
                        <i class="fas fa-file-pdf"></i> Exportar PDF
                    </button>
                    <button class="btn-secondary" onclick="exportAnalytics('csv')">
                        <i class="fas fa-file-csv"></i> Exportar CSV
                    </button>
                    <button class="btn-primary" onclick="refreshAnalytics()">
                        <i class="fas fa-sync"></i> Actualizar
                    </button>
                </div>
            </div>
            
            <div class="analytics-filters">
                <select id="periodFilter" onchange="updateAnalyticsPeriod()">
                    <option value="week">Esta Semana</option>
                    <option value="month" selected>Este Mes</option>
                    <option value="quarter">Este Trimestre</option>
                    <option value="year">Este Año</option>
                </select>
                
                <select id="typeFilter" onchange="updateAnalyticsType()">
                    <option value="overview">Vista General</option>
                    <option value="academic">Rendimiento Académico</option>
                    <option value="engagement">Participación</option>
                    <option value="progress">Progreso</option>
                </select>
            </div>
            
            <div class="analytics-grid">
                <div class="chart-container">
                    <h3>📈 Tendencias de Rendimiento</h3>
                    <canvas id="performanceChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>🎯 Distribución de Calificaciones</h3>
                    <canvas id="gradesChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>📅 Asistencia por Materia</h3>
                    <canvas id="attendanceChart"></canvas>
                </div>
                
                <div class="chart-container">
                    <h3>🏆 Progreso de Logros</h3>
                    <canvas id="achievementsChart"></canvas>
                </div>
            </div>
            
            <div class="analytics-insights">
                <h3>🧠 Insights con IA</h3>
                <div id="aiInsights" class="insights-container">
                    <div class="loading-spinner">
                        <i class="fas fa-brain fa-spin"></i> Generando insights...
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Enhanced Gamification View
function generateGamificationView() {
    return `
        <div class="gamification-dashboard">
            <div class="player-profile">
                <div class="profile-header">
                    <div class="avatar">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="profile-info">
                        <h2 id="playerName">${AppState.currentUser?.name || 'Estudiante'}</h2>
                        <div class="level-info">
                            <span class="level-badge" id="currentLevel">Nivel 1</span>
                            <span class="level-name" id="levelName">Principiante</span>
                        </div>
                    </div>
                    <div class="points-display">
                        <div class="points-circle">
                            <span id="totalPoints">0</span>
                            <small>puntos</small>
                        </div>
                    </div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="levelProgress" style="width: 0%"></div>
                    <span class="progress-text" id="progressText">0 / 100 puntos para siguiente nivel</span>
                </div>
            </div>
            
            <div class="gamification-grid">
                <div class="achievements-section">
                    <h3>🏆 Logros</h3>
                    <div id="achievementsList" class="achievements-grid">
                        <div class="loading-spinner">
                            <i class="fas fa-trophy fa-spin"></i> Cargando logros...
                        </div>
                    </div>
                </div>
                
                <div class="leaderboard-section">
                    <h3>🥇 Ranking</h3>
                    <div id="leaderboard" class="leaderboard-list">
                        <div class="loading-spinner">
                            <i class="fas fa-medal fa-spin"></i> Cargando ranking...
                        </div>
                    </div>
                </div>
                
                <div class="challenges-section">
                    <h3>🎯 Desafíos Activos</h3>
                    <div id="challengesList" class="challenges-grid">
                        <div class="loading-spinner">
                            <i class="fas fa-target fa-spin"></i> Cargando desafíos...
                        </div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h3>📈 Actividad Reciente</h3>
                    <div id="recentActivity" class="activity-list">
                        <div class="loading-spinner">
                            <i class="fas fa-history fa-spin"></i> Cargando actividad...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize view-specific functionality
function initializeViewFunctionality(viewName) {
    switch(viewName) {
        case 'tasks':
            loadTasksData();
            break;
        case 'messaging':
            loadConversations();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'gamification':
            loadGamificationData();
            break;
        case 'evaluations':
            loadEvaluationsData();
            break;
        case 'schedule':
            loadScheduleData();
            break;
    }
}

// Load tasks data
async function loadTasksData() {
    const userId = AppState.currentUser?.id;
    const userRole = AppState.currentUser?.role;
    
    if (!userId) return;
    
    try {
        const endpoint = userRole === 'teacher' 
            ? `/api/tasks/teacher/${userId}` 
            : `/api/tasks/student/${userId}`;
            
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success) {
            displayTasksData(data.tasks, userRole);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Load conversations
async function loadConversations() {
    const userId = AppState.currentUser?.id;
    if (!userId) return;
    
    try {
        const response = await fetch(`/api/conversations/user/${userId}`);
        const data = await response.json();
        
        if (data.success) {
            displayConversations(data.conversations);
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Load gamification data
async function loadGamificationData() {
    const userId = AppState.currentUser?.id;
    if (!userId || AppState.currentUser?.role !== 'student') return;
    
    try {
        const [profileResponse, leaderboardResponse, challengesResponse] = await Promise.all([
            fetch(`/api/gamification/profile/${userId}`),
            fetch('/api/gamification/leaderboard?limit=10'),
            fetch('/api/gamification/challenges')
        ]);
        
        const [profile, leaderboard, challenges] = await Promise.all([
            profileResponse.json(),
            leaderboardResponse.json(),
            challengesResponse.json()
        ]);
        
        if (profile.success) displayGamificationProfile(profile.profile);
        if (leaderboard.success) displayLeaderboard(leaderboard.leaderboard);
        if (challenges.success) displayChallenges(challenges.challenges);
        
    } catch (error) {
        console.error('Error loading gamification data:', error);
    }
}

// Display functions
function displayTasksData(tasks, userRole) {
    if (userRole === 'teacher') {
        displayTeacherTasks(tasks);
    } else {
        displayStudentTasks(tasks);
    }
}

function displayTeacherTasks(tasks) {
    const container = document.getElementById('tasksTableContainer');
    if (!container) return;
    
    const totalTasks = tasks.length;
    const pendingSubmissions = tasks.reduce((sum, task) => sum + (task.submissions_count - task.graded_count), 0);
    const completedTasks = tasks.filter(task => task.submissions_count === task.graded_count).length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingSubmissions').textContent = pendingSubmissions;
    document.getElementById('completedTasks').textContent = completedTasks;
    
    const tableHTML = `
        <table class="enhanced-table">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Materia</th>
                    <th>Fecha Límite</th>
                    <th>Entregas</th>
                    <th>Calificadas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => `
                    <tr>
                        <td>
                            <div class="task-title">
                                <strong>${task.title}</strong>
                                <small>${task.description?.substring(0, 50) || ''}...</small>
                            </div>
                        </td>
                        <td>${task.name_subject}</td>
                        <td>
                            <span class="date-badge ${new Date(task.due_date) < new Date() ? 'overdue' : 'active'}">
                                ${new Date(task.due_date).toLocaleDateString()}
                            </span>
                        </td>
                        <td>
                            <span class="count-badge">${task.submissions_count}</span>
                        </td>
                        <td>
                            <span class="count-badge ${task.graded_count === task.submissions_count ? 'complete' : 'pending'}">
                                ${task.graded_count}
                            </span>
                        </td>
                        <td>
                            <span class="status-badge ${task.status}">
                                ${task.status === 'active' ? 'Activa' : 'Completada'}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-sm btn-secondary" onclick="viewTaskSubmissions(${task.id_task})">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-sm btn-primary" onclick="gradeTask(${task.id_task})">
                                    <i class="fas fa-star"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function displayStudentTasks(tasks) {
    const container = document.getElementById('studentTasksGrid');
    if (!container) return;
    
    const pendingTasks = tasks.filter(task => !task.id_submission).length;
    const completedTasks = tasks.filter(task => task.id_submission).length;
    
    document.getElementById('pendingCount').textContent = `${pendingTasks} Pendientes`;
    document.getElementById('completedCount').textContent = `${completedTasks} Completadas`;
    
    const tasksHTML = tasks.map(task => `
        <div class="task-card ${task.id_submission ? 'completed' : 'pending'}">
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="subject-badge">${task.name_subject}</span>
            </div>
            
            <div class="task-content">
                <p>${task.description || 'Sin descripción'}</p>
                
                <div class="task-meta">
                    <div class="due-date">
                        <i class="fas fa-calendar"></i>
                        <span class="${new Date(task.due_date) < new Date() ? 'overdue' : ''}">
                            Vence: ${new Date(task.due_date).toLocaleDateString()}
                        </span>
                    </div>
                    
                    <div class="teacher-info">
                        <i class="fas fa-user"></i>
                        <span>${task.teacher_name}</span>
                    </div>
                </div>
            </div>
            
            <div class="task-footer">
                ${task.id_submission ? `
                    <div class="submission-info">
                        <span class="status-completed">✅ Entregada</span>
                        ${task.score ? `<span class="score">Nota: ${task.score}</span>` : '<span class="pending-grade">Pendiente calificación</span>'}
                    </div>
                ` : `
                    <button class="btn-primary" onclick="submitTask(${task.id_task})">
                        <i class="fas fa-upload"></i> Entregar Tarea
                    </button>
                `}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = tasksHTML || '<div class="no-tasks">No hay tareas disponibles</div>';
}

function displayGamificationProfile(profile) {
    if (!profile.points) return;
    
    document.getElementById('totalPoints').textContent = profile.points.total_points || 0;
    document.getElementById('currentLevel').textContent = `Nivel ${profile.points.level_number || 1}`;
    document.getElementById('levelName').textContent = profile.points.level_name || 'Principiante';
    
    // Update progress bar
    const nextLevel = profile.nextLevel;
    if (nextLevel) {
        const progress = Math.min(100, ((profile.points.total_points || 0) / nextLevel.level.minPoints) * 100);
        document.getElementById('levelProgress').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = 
            `${profile.points.total_points || 0} / ${nextLevel.level.minPoints} puntos para ${nextLevel.level.name}`;
    }
    
    // Display achievements
    if (profile.achievements) {
        displayAchievements(profile.achievements);
    }
}

function displayAchievements(achievements) {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    const achievementsHTML = achievements.map(achievement => `
        <div class="achievement-card earned">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <span class="points">+${achievement.points_earned} pts</span>
            </div>
            <div class="earned-date">
                ${new Date(achievement.earned_at).toLocaleDateString()}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = achievementsHTML || '<div class="no-achievements">No hay logros aún</div>';
}

// Modal functions
function showCreateTaskModal() {
    showModal(`
        <h2>📚 Nueva Tarea</h2>
        <form id="createTaskForm" onsubmit="createTask(event)">
            <div class="form-group">
                <label>Título:</label>
                <input type="text" name="title" required>
            </div>
            
            <div class="form-group">
                <label>Descripción:</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Fecha límite:</label>
                    <input type="datetime-local" name="due_date" required>
                </div>
                
                <div class="form-group">
                    <label>Puntuación máxima:</label>
                    <input type="number" name="max_score" value="5.0" step="0.1" min="0" max="5">
                </div>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" name="allow_files" checked>
                    Permitir archivos adjuntos
                </label>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Crear Tarea</button>
            </div>
        </form>
    `);
}

// Event handlers
async function createTask(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        id_teacher: AppState.currentUser?.id,
        id_cst: 1, // This should be selected from available courses
        due_date: formData.get('due_date'),
        max_score: parseFloat(formData.get('max_score')),
        allow_files: formData.has('allow_files')
    };
    
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeModal();
            loadTasksData();
            showNotification('✅ Tarea creada exitosamente', 'success');
        } else {
            showNotification('❌ Error al crear tarea: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Error de conexión', 'error');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize enhanced UI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Override original renderViewContent
    window.renderViewContent = renderEnhancedViewContent;
    
    // Initialize socket connection
    initializeSocket();
    
    // Add enhanced styles
    addEnhancedStyles();
});

// Add enhanced CSS styles
function addEnhancedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .enhanced-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            color: white;
        }
        
        .header-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .enhanced-table-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .table-filters {
            padding: 1rem;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            gap: 1rem;
        }
        
        .enhanced-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .enhanced-table th,
        .enhanced-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        
        .enhanced-table th {
            background: #f8f9fa;
            font-weight: 600;
        }
        
        .task-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #007bff;
        }
        
        .task-card.completed {
            border-left-color: #28a745;
            opacity: 0.8;
        }
        
        .messaging-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            height: 600px;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .conversations-sidebar {
            border-right: 1px solid #dee2e6;
            background: #f8f9fa;
        }
        
        .chat-area {
            display: flex;
            flex-direction: column;
        }
        
        .gamification-dashboard {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .player-profile {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 1rem;
        }
        
        .avatar {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        .points-circle {
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
        }
        
        .progress-bar {
            background: rgba(255,255,255,0.2);
            height: 10px;
            border-radius: 5px;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill {
            background: #28a745;
            height: 100%;
            border-radius: 5px;
            transition: width 0.3s ease;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background: #28a745;
        }
        
        .notification.error {
            background: #dc3545;
        }
        
        .notification.info {
            background: #17a2b8;
        }
        
        @media (max-width: 768px) {
            .messaging-container {
                grid-template-columns: 1fr;
            }
            
            .conversations-sidebar {
                display: none;
            }
            
            .enhanced-header {
                flex-direction: column;
                gap: 1rem;
            }
            
            .stats-cards {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Export functions for global access
window.showCreateTaskModal = showCreateTaskModal;
window.createTask = createTask;
window.loadTasksData = loadTasksData;
window.showNotification = showNotification;
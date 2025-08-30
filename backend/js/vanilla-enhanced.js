/**
 * Learnex v2.0 - Enhanced Features in Vanilla JavaScript
 * All new systems without external dependencies
 */

// Enhanced App State with new features
const LearnexV2 = {
    // Task Management System
    tasks: {
        list: [],
        submissions: [],
        
        create(taskData) {
            const task = {
                id: Date.now(),
                title: taskData.title,
                description: taskData.description,
                subject: taskData.subject,
                dueDate: taskData.dueDate,
                maxScore: taskData.maxScore || 5.0,
                createdAt: new Date(),
                status: 'active',
                submissions: []
            };
            this.list.push(task);
            this.saveToStorage();
            return task;
        },
        
        submit(taskId, studentId, content, file = null) {
            const submission = {
                id: Date.now(),
                taskId: taskId,
                studentId: studentId,
                content: content,
                file: file,
                submittedAt: new Date(),
                score: null,
                feedback: null,
                status: 'submitted'
            };
            this.submissions.push(submission);
            this.saveToStorage();
            return submission;
        },
        
        grade(submissionId, score, feedback) {
            const submission = this.submissions.find(s => s.id === submissionId);
            if (submission) {
                submission.score = score;
                submission.feedback = feedback;
                submission.status = 'graded';
                this.saveToStorage();
                
                // Award gamification points
                LearnexV2.gamification.awardPoints(submission.studentId, 'TASK_COMPLETED', 10);
            }
            return submission;
        },
        
        saveToStorage() {
            localStorage.setItem('learnex_tasks', JSON.stringify(this.list));
            localStorage.setItem('learnex_submissions', JSON.stringify(this.submissions));
        },
        
        loadFromStorage() {
            this.list = JSON.parse(localStorage.getItem('learnex_tasks') || '[]');
            this.submissions = JSON.parse(localStorage.getItem('learnex_submissions') || '[]');
        }
    },
    
    // Messaging System
    messaging: {
        conversations: [],
        messages: [],
        
        createConversation(title, participants) {
            const conversation = {
                id: Date.now(),
                title: title,
                participants: participants,
                createdAt: new Date(),
                lastMessage: null
            };
            this.conversations.push(conversation);
            this.saveToStorage();
            return conversation;
        },
        
        sendMessage(conversationId, senderId, content) {
            const message = {
                id: Date.now(),
                conversationId: conversationId,
                senderId: senderId,
                content: content,
                sentAt: new Date(),
                read: false
            };
            this.messages.push(message);
            
            // Update conversation last message
            const conversation = this.conversations.find(c => c.id === conversationId);
            if (conversation) {
                conversation.lastMessage = message;
            }
            
            this.saveToStorage();
            this.showNotification(`Nuevo mensaje de ${this.getSenderName(senderId)}`);
            return message;
        },
        
        getConversationMessages(conversationId) {
            return this.messages.filter(m => m.conversationId === conversationId);
        },
        
        getSenderName(senderId) {
            return AppState.currentUser?.name || 'Usuario';
        },
        
        saveToStorage() {
            localStorage.setItem('learnex_conversations', JSON.stringify(this.conversations));
            localStorage.setItem('learnex_messages', JSON.stringify(this.messages));
        },
        
        loadFromStorage() {
            this.conversations = JSON.parse(localStorage.getItem('learnex_conversations') || '[]');
            this.messages = JSON.parse(localStorage.getItem('learnex_messages') || '[]');
        },
        
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    },
    
    // Analytics System
    analytics: {
        data: {
            pageViews: 0,
            tasksCompleted: 0,
            messagesExchanged: 0,
            loginCount: 0,
            studyTime: 0
        },
        
        track(event, value = 1) {
            if (this.data[event] !== undefined) {
                this.data[event] += value;
                this.saveToStorage();
            }
        },
        
        getStats() {
            return {
                ...this.data,
                averageGrade: this.calculateAverageGrade(),
                completionRate: this.calculateCompletionRate(),
                engagement: this.calculateEngagement()
            };
        },
        
        calculateAverageGrade() {
            const submissions = LearnexV2.tasks.submissions.filter(s => s.score !== null);
            if (submissions.length === 0) return 0;
            const total = submissions.reduce((sum, s) => sum + s.score, 0);
            return (total / submissions.length).toFixed(2);
        },
        
        calculateCompletionRate() {
            const totalTasks = LearnexV2.tasks.list.length;
            const completedTasks = LearnexV2.tasks.submissions.length;
            return totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
        },
        
        calculateEngagement() {
            const factors = [
                this.data.pageViews > 10 ? 25 : this.data.pageViews * 2.5,
                this.data.tasksCompleted * 15,
                this.data.messagesExchanged * 5,
                this.data.loginCount * 10
            ];
            return Math.min(100, factors.reduce((sum, f) => sum + f, 0)).toFixed(0);
        },
        
        saveToStorage() {
            localStorage.setItem('learnex_analytics', JSON.stringify(this.data));
        },
        
        loadFromStorage() {
            this.data = JSON.parse(localStorage.getItem('learnex_analytics') || JSON.stringify(this.data));
        }
    },
    
    // Gamification System
    gamification: {
        points: 0,
        level: 1,
        achievements: [],
        badges: [],
        
        levels: [
            { level: 1, name: 'Principiante', minPoints: 0 },
            { level: 2, name: 'Estudiante', minPoints: 100 },
            { level: 3, name: 'Aplicado', minPoints: 250 },
            { level: 4, name: 'Destacado', minPoints: 500 },
            { level: 5, name: 'Experto', minPoints: 1000 },
            { level: 6, name: 'Maestro', minPoints: 2000 },
            { level: 7, name: 'Leyenda', minPoints: 5000 }
        ],
        
        awardPoints(userId, action, points) {
            this.points += points;
            this.checkLevelUp();
            this.checkAchievements(action);
            this.saveToStorage();
            
            this.showPointsNotification(points, action);
        },
        
        checkLevelUp() {
            const newLevel = this.levels.find(l => 
                this.points >= l.minPoints && 
                (this.levels[l.level] ? this.points < this.levels[l.level].minPoints : true)
            );
            
            if (newLevel && newLevel.level > this.level) {
                this.level = newLevel.level;
                this.showLevelUpNotification(newLevel);
            }
        },
        
        checkAchievements(action) {
            const achievements = {
                'FIRST_TASK': { name: 'Primera Tarea', icon: '📝', condition: () => LearnexV2.tasks.submissions.length >= 1 },
                'TASK_MASTER': { name: 'Maestro de Tareas', icon: '🏆', condition: () => LearnexV2.tasks.submissions.length >= 10 },
                'SOCIAL_BUTTERFLY': { name: 'Mariposa Social', icon: '💬', condition: () => LearnexV2.messaging.messages.length >= 20 },
                'PERFECT_SCORE': { name: 'Puntuación Perfecta', icon: '⭐', condition: () => LearnexV2.tasks.submissions.some(s => s.score === 5.0) }
            };
            
            Object.keys(achievements).forEach(key => {
                if (!this.achievements.includes(key) && achievements[key].condition()) {
                    this.achievements.push(key);
                    this.showAchievementNotification(achievements[key]);
                }
            });
        },
        
        showPointsNotification(points, action) {
            const notification = document.createElement('div');
            notification.className = 'notification points';
            notification.innerHTML = `<i class="fas fa-star"></i> +${points} puntos por ${action}`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        },
        
        showLevelUpNotification(level) {
            const notification = document.createElement('div');
            notification.className = 'notification levelup';
            notification.innerHTML = `🎉 ¡Subiste a ${level.name}! (Nivel ${level.level})`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        },
        
        showAchievementNotification(achievement) {
            const notification = document.createElement('div');
            notification.className = 'notification achievement';
            notification.innerHTML = `🏆 Logro desbloqueado: ${achievement.icon} ${achievement.name}`;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        },
        
        saveToStorage() {
            const data = {
                points: this.points,
                level: this.level,
                achievements: this.achievements,
                badges: this.badges
            };
            localStorage.setItem('learnex_gamification', JSON.stringify(data));
        },
        
        loadFromStorage() {
            const data = JSON.parse(localStorage.getItem('learnex_gamification') || '{}');
            this.points = data.points || 0;
            this.level = data.level || 1;
            this.achievements = data.achievements || [];
            this.badges = data.badges || [];
        }
    },
    
    // Schedule System
    schedule: {
        events: [],
        
        addEvent(title, date, time, type = 'class') {
            const event = {
                id: Date.now(),
                title: title,
                date: date,
                time: time,
                type: type,
                createdAt: new Date()
            };
            this.events.push(event);
            this.saveToStorage();
            return event;
        },
        
        getEventsForDate(date) {
            return this.events.filter(e => e.date === date);
        },
        
        getUpcomingEvents(days = 7) {
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + days);
            
            return this.events.filter(e => {
                const eventDate = new Date(e.date);
                return eventDate >= today && eventDate <= futureDate;
            });
        },
        
        saveToStorage() {
            localStorage.setItem('learnex_schedule', JSON.stringify(this.events));
        },
        
        loadFromStorage() {
            this.events = JSON.parse(localStorage.getItem('learnex_schedule') || '[]');
        }
    },
    
    // Initialize all systems
    init() {
        this.tasks.loadFromStorage();
        this.messaging.loadFromStorage();
        this.analytics.loadFromStorage();
        this.gamification.loadFromStorage();
        this.schedule.loadFromStorage();
        
        // Track page view
        this.analytics.track('pageViews');
        
        console.log('🚀 Learnex v2.0 initialized with enhanced features');
    }
};

// Enhanced UI Functions
const EnhancedUI = {
    // Enhanced Tasks View
    renderTasksView() {
        const userRole = AppState.currentUser?.role;
        
        if (userRole === 'teacher') {
            return this.renderTeacherTasksView();
        } else {
            return this.renderStudentTasksView();
        }
    },
    
    renderTeacherTasksView() {
        const tasks = LearnexV2.tasks.list;
        const submissions = LearnexV2.tasks.submissions;
        
        return `
            <div class="enhanced-header">
                <h1>📚 Gestión de Tareas v2.0</h1>
                <button class="btn-primary" onclick="EnhancedUI.showCreateTaskModal()">
                    <i class="fas fa-plus"></i> Nueva Tarea
                </button>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card blue">
                    <div class="stat-icon"><i class="fas fa-tasks"></i></div>
                    <div class="stat-info">
                        <h3>${tasks.length}</h3>
                        <p>Tareas Creadas</p>
                    </div>
                </div>
                <div class="stat-card orange">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-info">
                        <h3>${submissions.filter(s => !s.score).length}</h3>
                        <p>Por Calificar</p>
                    </div>
                </div>
                <div class="stat-card green">
                    <div class="stat-icon"><i class="fas fa-check"></i></div>
                    <div class="stat-info">
                        <h3>${submissions.filter(s => s.score).length}</h3>
                        <p>Calificadas</p>
                    </div>
                </div>
            </div>
            
            <div class="tasks-table">
                <h3>📋 Lista de Tareas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Materia</th>
                            <th>Fecha Límite</th>
                            <th>Entregas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tasks.map(task => `
                            <tr>
                                <td><strong>${task.title}</strong></td>
                                <td>${task.subject}</td>
                                <td>${new Date(task.dueDate).toLocaleDateString()}</td>
                                <td>${submissions.filter(s => s.taskId === task.id).length}</td>
                                <td>
                                    <button class="btn-sm btn-secondary" onclick="EnhancedUI.viewTaskSubmissions(${task.id})">
                                        Ver Entregas
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },
    
    renderStudentTasksView() {
        const tasks = LearnexV2.tasks.list;
        const submissions = LearnexV2.tasks.submissions;
        const userSubmissions = submissions.filter(s => s.studentId === AppState.currentUser?.id);
        
        return `
            <div class="enhanced-header">
                <h1>📖 Mis Tareas v2.0</h1>
                <div class="header-stats">
                    <span class="stat-badge pending">${tasks.length - userSubmissions.length} Pendientes</span>
                    <span class="stat-badge completed">${userSubmissions.length} Completadas</span>
                </div>
            </div>
            
            <div class="tasks-grid">
                ${tasks.map(task => {
                    const submission = userSubmissions.find(s => s.taskId === task.id);
                    return `
                        <div class="task-card ${submission ? 'completed' : 'pending'}">
                            <div class="task-header">
                                <h3>${task.title}</h3>
                                <span class="subject-badge">${task.subject}</span>
                            </div>
                            <div class="task-content">
                                <p>${task.description}</p>
                                <div class="task-meta">
                                    <span class="due-date">
                                        <i class="fas fa-calendar"></i>
                                        Vence: ${new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div class="task-footer">
                                ${submission ? `
                                    <div class="submission-info">
                                        <span class="status-completed">✅ Entregada</span>
                                        ${submission.score ? `<span class="score">Nota: ${submission.score}</span>` : '<span class="pending-grade">Pendiente calificación</span>'}
                                    </div>
                                ` : `
                                    <button class="btn-primary" onclick="EnhancedUI.showSubmitTaskModal(${task.id})">
                                        <i class="fas fa-upload"></i> Entregar Tarea
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },
    
    // Enhanced Messaging View
    renderMessagingView() {
        const conversations = LearnexV2.messaging.conversations;
        
        return `
            <div class="messaging-container">
                <div class="conversations-sidebar">
                    <div class="sidebar-header">
                        <h2>💬 Conversaciones</h2>
                        <button class="btn-primary btn-sm" onclick="EnhancedUI.showNewConversationModal()">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="conversations-list">
                        ${conversations.map(conv => `
                            <div class="conversation-item" onclick="EnhancedUI.openConversation(${conv.id})">
                                <div class="conversation-info">
                                    <h4>${conv.title}</h4>
                                    <p>${conv.lastMessage ? conv.lastMessage.content.substring(0, 30) + '...' : 'Sin mensajes'}</p>
                                </div>
                                <div class="conversation-time">
                                    ${conv.lastMessage ? new Date(conv.lastMessage.sentAt).toLocaleTimeString() : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chat-area">
                    <div class="chat-header">
                        <h3>Selecciona una conversación</h3>
                    </div>
                    <div class="messages-container" id="messagesContainer">
                        <div class="no-conversation">
                            <i class="fas fa-comments fa-3x"></i>
                            <p>Selecciona una conversación para comenzar a chatear</p>
                        </div>
                    </div>
                    <div class="message-input-container" style="display: none;">
                        <input type="text" id="messageInput" placeholder="Escribe tu mensaje...">
                        <button class="btn-primary" onclick="EnhancedUI.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Enhanced Analytics View
    renderAnalyticsView() {
        const stats = LearnexV2.analytics.getStats();
        
        return `
            <div class="analytics-dashboard">
                <div class="dashboard-header">
                    <h1>📊 Analytics Dashboard v2.0</h1>
                    <button class="btn-secondary" onclick="EnhancedUI.exportAnalytics()">
                        <i class="fas fa-download"></i> Exportar Datos
                    </button>
                </div>
                
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h3>📈 Estadísticas Generales</h3>
                        <div class="stats-list">
                            <div class="stat-item">
                                <span class="stat-label">Páginas Visitadas:</span>
                                <span class="stat-value">${stats.pageViews}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Tareas Completadas:</span>
                                <span class="stat-value">${stats.tasksCompleted}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Mensajes Enviados:</span>
                                <span class="stat-value">${stats.messagesExchanged}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Inicios de Sesión:</span>
                                <span class="stat-value">${stats.loginCount}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>🎯 Rendimiento Académico</h3>
                        <div class="performance-metrics">
                            <div class="metric-circle">
                                <div class="circle-progress" data-percent="${stats.completionRate}">
                                    <span>${stats.completionRate}%</span>
                                </div>
                                <p>Tasa de Completación</p>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Promedio General:</span>
                                <span class="metric-value">${stats.averageGrade}</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-label">Nivel de Engagement:</span>
                                <span class="metric-value">${stats.engagement}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>🧠 Insights con IA</h3>
                        <div class="ai-insights">
                            ${this.generateAIInsights(stats)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Enhanced Gamification View
    renderGamificationView() {
        const gam = LearnexV2.gamification;
        const currentLevel = gam.levels.find(l => l.level === gam.level);
        const nextLevel = gam.levels.find(l => l.level === gam.level + 1);
        
        return `
            <div class="gamification-dashboard">
                <div class="player-profile">
                    <div class="profile-header">
                        <div class="avatar">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <div class="profile-info">
                            <h2>${AppState.currentUser?.name || 'Estudiante'}</h2>
                            <div class="level-info">
                                <span class="level-badge">Nivel ${gam.level}</span>
                                <span class="level-name">${currentLevel?.name}</span>
                            </div>
                        </div>
                        <div class="points-display">
                            <div class="points-circle">
                                <span>${gam.points}</span>
                                <small>puntos</small>
                            </div>
                        </div>
                    </div>
                    
                    ${nextLevel ? `
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((gam.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100}%"></div>
                            <span class="progress-text">${gam.points} / ${nextLevel.minPoints} puntos para ${nextLevel.name}</span>
                        </div>
                    ` : '<p class="max-level">¡Has alcanzado el nivel máximo!</p>'}
                </div>
                
                <div class="gamification-grid">
                    <div class="achievements-section">
                        <h3>🏆 Logros Desbloqueados</h3>
                        <div class="achievements-list">
                            ${gam.achievements.map(achievement => `
                                <div class="achievement-item earned">
                                    <span class="achievement-icon">🏆</span>
                                    <span class="achievement-name">${achievement}</span>
                                </div>
                            `).join('') || '<p class="no-achievements">Aún no has desbloqueado logros</p>'}
                        </div>
                    </div>
                    
                    <div class="points-history">
                        <h3>📈 Actividad Reciente</h3>
                        <div class="activity-list">
                            <div class="activity-item">
                                <span class="activity-icon">📚</span>
                                <span class="activity-text">Tareas completadas: ${LearnexV2.tasks.submissions.length}</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-icon">💬</span>
                                <span class="activity-text">Mensajes enviados: ${LearnexV2.messaging.messages.length}</span>
                            </div>
                            <div class="activity-item">
                                <span class="activity-icon">📊</span>
                                <span class="activity-text">Páginas visitadas: ${LearnexV2.analytics.data.pageViews}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Modal Functions
    showCreateTaskModal() {
        showModal(`
            <h2>📚 Nueva Tarea</h2>
            <form onsubmit="EnhancedUI.createTask(event)">
                <div class="form-group">
                    <label>Título:</label>
                    <input type="text" name="title" required>
                </div>
                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea name="description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Materia:</label>
                    <select name="subject" required>
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Español">Español</option>
                        <option value="Ciencias">Ciencias</option>
                        <option value="Historia">Historia</option>
                        <option value="Inglés">Inglés</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Fecha límite:</label>
                    <input type="date" name="dueDate" required>
                </div>
                <div class="form-group">
                    <label>Puntuación máxima:</label>
                    <input type="number" name="maxScore" value="5.0" step="0.1" min="0" max="5">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Crear Tarea</button>
                </div>
            </form>
        `);
    },
    
    showSubmitTaskModal(taskId) {
        showModal(`
            <h2>📤 Entregar Tarea</h2>
            <form onsubmit="EnhancedUI.submitTask(event, ${taskId})">
                <div class="form-group">
                    <label>Contenido de la entrega:</label>
                    <textarea name="content" rows="5" placeholder="Escribe tu respuesta aquí..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Archivo (opcional):</label>
                    <input type="file" name="file" accept=".pdf,.doc,.docx,.txt">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Entregar</button>
                </div>
            </form>
        `);
    },
    
    // Event Handlers
    createTask(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            subject: formData.get('subject'),
            dueDate: formData.get('dueDate'),
            maxScore: parseFloat(formData.get('maxScore'))
        };
        
        LearnexV2.tasks.create(taskData);
        closeModal();
        showView('tasks');
        
        // Show success notification
        LearnexV2.messaging.showNotification('✅ Tarea creada exitosamente');
    },
    
    submitTask(event, taskId) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        LearnexV2.tasks.submit(
            taskId,
            AppState.currentUser?.id,
            formData.get('content'),
            formData.get('file')?.name
        );
        
        closeModal();
        showView('tasks');
        
        // Track analytics and award points
        LearnexV2.analytics.track('tasksCompleted');
        LearnexV2.gamification.awardPoints(AppState.currentUser?.id, 'TASK_COMPLETED', 10);
        
        LearnexV2.messaging.showNotification('✅ Tarea entregada exitosamente');
    },
    
    generateAIInsights(stats) {
        const insights = [];
        
        if (stats.completionRate > 80) {
            insights.push('🎯 Excelente tasa de completación de tareas');
        } else if (stats.completionRate < 50) {
            insights.push('⚠️ Considera mejorar la entrega de tareas');
        }
        
        if (stats.averageGrade > 4.0) {
            insights.push('⭐ Rendimiento académico sobresaliente');
        } else if (stats.averageGrade < 3.0) {
            insights.push('📚 Recomendamos sesiones de refuerzo');
        }
        
        if (stats.engagement > 70) {
            insights.push('🔥 Alto nivel de participación en la plataforma');
        }
        
        return insights.map(insight => `<div class="insight-item">${insight}</div>`).join('') || 
               '<div class="insight-item">📊 Continúa usando la plataforma para generar más insights</div>';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LearnexV2.init();
    
    // Override original view rendering
    const originalShowView = window.showView;
    window.showView = function(viewName) {
        LearnexV2.analytics.track('pageViews');
        
        const contentArea = document.getElementById('contentArea');
        let content = '';
        
        switch(viewName) {
            case 'tasks':
                content = EnhancedUI.renderTasksView();
                break;
            case 'messaging':
                content = EnhancedUI.renderMessagingView();
                break;
            case 'analytics':
                content = EnhancedUI.renderAnalyticsView();
                break;
            case 'gamification':
                content = EnhancedUI.renderGamificationView();
                break;
            default:
                return originalShowView(viewName);
        }
        
        if (content) {
            contentArea.innerHTML = content;
            contentArea.classList.add('fade-in');
            setTimeout(() => contentArea.classList.remove('fade-in'), 500);
        }
    };
});

// Export for global access
window.LearnexV2 = LearnexV2;
window.EnhancedUI = EnhancedUI;
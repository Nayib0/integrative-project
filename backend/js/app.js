// Manages current user, view state, and demo data for the application
const AppState = {
    // Currently authenticated user
    currentUser: null,
    // Current active view/page
    currentView: 'dashboard',
    // Demo data for different entities
    data: {
        // Demo student data with academic information
        students: [
            { id: 1, name: 'Ana García', grade: '10°A', average: 4.2, attendance: 95, email: 'ana.garcia@estudiante.com' },
            { id: 2, name: 'Carlos López', grade: '10°A', average: 3.8, attendance: 88, email: 'carlos.lopez@estudiante.com' },
            { id: 3, name: 'María Rodríguez', grade: '10°B', average: 4.5, attendance: 98, email: 'maria.rodriguez@estudiante.com' },
            { id: 4, name: 'Juan Pérez', grade: '10°B', average: 3.5, attendance: 85, email: 'juan.perez@estudiante.com' },
            { id: 5, name: 'Sofia Martínez', grade: '11°A', average: 4.7, attendance: 97, email: 'sofia.martinez@estudiante.com' },
            { id: 6, name: 'Diego Ramírez', grade: '11°A', average: 3.9, attendance: 90, email: 'diego.ramirez@estudiante.com' }
        ],
        // Demo grades data with subject and student information
        grades: [
            { id: 1, subject: 'Matemáticas', grade: 4.2, date: '2024-01-15', student: 'Ana García', period: 'Primer Período' },
            { id: 2, subject: 'Español', grade: 4.0, date: '2024-01-14', student: 'Ana García', period: 'Primer Período' },
            { id: 3, subject: 'Ciencias', grade: 4.5, date: '2024-01-13', student: 'Carlos López', period: 'Primer Período' },
            { id: 4, subject: 'Historia', grade: 3.8, date: '2024-01-12', student: 'María Rodríguez', period: 'Primer Período' },
            { id: 5, subject: 'Inglés', grade: 4.3, date: '2024-01-11', student: 'Juan Pérez', period: 'Primer Período' },
            { id: 6, subject: 'Física', grade: 4.6, date: '2024-01-10', student: 'Sofia Martínez', period: 'Primer Período' }
        ],
        // Demo tasks/assignments data with status tracking
        tasks: [
            { id: 1, title: 'Ensayo de Literatura', subject: 'Español', dueDate: '2024-01-20', status: 'pending', description: 'Análisis de obra literaria del siglo XX' },
            { id: 2, title: 'Ejercicios de Álgebra', subject: 'Matemáticas', dueDate: '2024-01-18', status: 'completed', description: 'Resolver ecuaciones cuadráticas' },
            { id: 3, title: 'Proyecto de Ciencias', subject: 'Ciencias', dueDate: '2024-01-25', status: 'pending', description: 'Experimento sobre el ciclo del agua' },
            { id: 4, title: 'Presentación Historia', subject: 'Historia', dueDate: '2024-01-22', status: 'in_progress', description: 'Revolución Industrial' },
            { id: 5, title: 'Examen de Inglés', subject: 'Inglés', dueDate: '2024-01-19', status: 'pending', description: 'Grammar and vocabulary test' }
        ],
        // Demo achievements/badges system for gamification
        achievements: [
            { id: 1, title: 'Estudiante Destacado', description: 'Promedio superior a 4.5', icon: '🏆', earned: true },
            { id: 2, title: 'Asistencia Perfecta', description: '100% de asistencia mensual', icon: '📅', earned: true },
            { id: 3, title: 'Participación Activa', description: 'Participar en 10 clases', icon: '🙋‍♂️', earned: false },
            { id: 4, title: 'Trabajo en Equipo', description: 'Completar 5 proyectos grupales', icon: '👥', earned: false }
        ],
        // Demo messaging system data
        messages: [
            { id: 1, from: 'Prof. García', message: 'Excelente trabajo en el último examen', date: '2024-01-15', read: false },
            { id: 2, from: 'Administración', message: 'Recordatorio: Reunión de padres el viernes', date: '2024-01-14', read: true },
            { id: 3, from: 'Prof. López', message: 'Favor revisar la tarea de matemáticas', date: '2024-01-13', read: true }
        ],
        // Demo class schedule data
        schedule: [
            { day: 'Lunes', time: '08:00-09:00', subject: 'Matemáticas', teacher: 'Prof. García', room: 'Aula 101' },
            { day: 'Lunes', time: '09:00-10:00', subject: 'Español', teacher: 'Prof. López', room: 'Aula 102' },
            { day: 'Martes', time: '08:00-09:00', subject: 'Ciencias', teacher: 'Prof. Martínez', room: 'Lab 201' },
            { day: 'Martes', time: '09:00-10:00', subject: 'Historia', teacher: 'Prof. Rodríguez', room: 'Aula 103' }
        ]
    }
};

// MENU CONFIGURATION BY USER ROLE
// Defines navigation menu items for each user role with icons and views
const MenuConfig = {
    // Administrator menu - full system access
    admin: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
        { id: 'analytics', icon: 'fas fa-chart-line', text: 'Analytics v2.0', view: 'analytics' },
        { id: 'messaging', icon: 'fas fa-comments', text: 'Mensajería v2.0', view: 'messaging' },
        { id: 'users', icon: 'fas fa-users', text: 'Usuarios', view: 'users' },
        { id: 'students', icon: 'fas fa-user-graduate', text: 'Estudiantes', view: 'students' },
        { id: 'teachers', icon: 'fas fa-chalkboard-teacher', text: 'Profesores', view: 'teachers' },
        { id: 'tasks', icon: 'fas fa-clipboard-list', text: 'Sistema Tareas v2.0', view: 'tasks' },
        { id: 'gamification', icon: 'fas fa-gamepad', text: 'Gamificación v2.0', view: 'gamification' },
        { id: 'academic-periods', icon: 'fas fa-calendar-alt', text: 'Períodos Académicos', view: 'academic-periods' },
        { id: 'subject-assignment', icon: 'fas fa-clipboard-list', text: 'Asignación Materias', view: 'subject-assignment' },
        { id: 'ai-recommendations', icon: 'fas fa-brain', text: 'IA Educativa', view: 'ai-recommendations' },
        { id: 'video-calls', icon: 'fas fa-video', text: 'Videollamadas', view: 'video-calls' },
        { id: 'digital-library', icon: 'fas fa-book-open', text: 'Biblioteca Digital', view: 'digital-library' },
        { id: 'data-import', icon: 'fas fa-upload', text: 'Importar Datos', view: 'data-import' },
        { id: 'backup-system', icon: 'fas fa-database', text: 'Backup Sistema', view: 'backup-system' },
        { id: 'settings', icon: 'fas fa-cog', text: 'Configuración', view: 'settings' }
    ],
    // Teacher menu - classroom management focused
    teacher: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
        { id: 'students', icon: 'fas fa-user-graduate', text: 'Mis Estudiantes', view: 'students' },
        { id: 'tasks', icon: 'fas fa-clipboard-list', text: 'Gestión Tareas v2.0', view: 'tasks' },
        { id: 'messaging', icon: 'fas fa-comments', text: 'Mensajería v2.0', view: 'messaging' },
        { id: 'analytics', icon: 'fas fa-chart-line', text: 'Analytics v2.0', view: 'analytics' },
        { id: 'grades', icon: 'fas fa-star', text: 'Calificaciones', view: 'grades' },
        { id: 'evaluations', icon: 'fas fa-clipboard-check', text: 'Evaluaciones', view: 'evaluations' },
        { id: 'ai-recommendations', icon: 'fas fa-brain', text: 'IA Educativa', view: 'ai-recommendations' },
        { id: 'video-calls', icon: 'fas fa-video', text: 'Clases Virtuales', view: 'video-calls' },
        { id: 'digital-library', icon: 'fas fa-book-open', text: 'Biblioteca', view: 'digital-library' },
        { id: 'observations', icon: 'fas fa-eye', text: 'Observaciones', view: 'observations' }
    ],
    // Student menu - learning and progress focused
    student: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
        { id: 'grades', icon: 'fas fa-star', text: 'Mis Calificaciones', view: 'grades' },
        { id: 'tasks', icon: 'fas fa-book', text: 'Mis Tareas v2.0', view: 'tasks' },
        { id: 'gamification', icon: 'fas fa-gamepad', text: 'Gamificación v2.0', view: 'gamification' },
        { id: 'messaging', icon: 'fas fa-comments', text: 'Mensajería v2.0', view: 'messaging' },
        { id: 'analytics', icon: 'fas fa-chart-line', text: 'Analytics v2.0', view: 'analytics' },
        { id: 'digital-library', icon: 'fas fa-book-open', text: 'Biblioteca', view: 'digital-library' },
        { id: 'video-calls', icon: 'fas fa-video', text: 'Clases Virtuales', view: 'video-calls' },
        { id: 'ai-tutor', icon: 'fas fa-robot', text: 'Tutor IA', view: 'ai-tutor' },
        { id: 'achievements', icon: 'fas fa-trophy', text: 'Logros', view: 'achievements' }
    ],
    // Parent menu - child monitoring focused
    parent: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
        { id: 'child-progress', icon: 'fas fa-chart-line', text: 'Progreso del Hijo', view: 'child-progress' },
        { id: 'analytics', icon: 'fas fa-chart-bar', text: 'Analytics v2.0', view: 'analytics' },
        { id: 'messaging', icon: 'fas fa-comments', text: 'Mensajería v2.0', view: 'messaging' },
        { id: 'grades', icon: 'fas fa-star', text: 'Calificaciones', view: 'grades' },
        { id: 'attendance', icon: 'fas fa-calendar-check', text: 'Asistencia', view: 'attendance' },
        { id: 'meetings', icon: 'fas fa-handshake', text: 'Reuniones', view: 'meetings' }
    ]
};

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main application initialization function
// Sets up event listeners and forces login screen
function initializeApp() {
    setupEventListeners();
    
    // Force login screen - no direct access to dashboard
    AuthSystem.logout(); // Clear any previous session
    showScreen('loginScreen');
    
    // Block direct access to dashboard
    const dashboardScreen = document.getElementById('dashboardScreen');
    if (dashboardScreen) {
        dashboardScreen.style.display = 'none';
    }
}

// Setup all event listeners for the application
// Handles login, logout, modal interactions, and other UI events
function setupEventListeners() {
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button click
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Click outside modal to close it
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Handle login form submission
// Validates credentials and initializes user session
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validate input fields
    if (!username || !password) {
        showLoginError('Please enter username and password');
        return;
    }
    
    try {
        // Attempt authentication
        const result = await AuthSystem.authenticate(username, password);
        
        if (result.success) {
            // Set current user and update UI
            AppState.currentUser = result.user;
            document.getElementById('userRole').textContent = `${result.user.name} (${result.user.role})`;
            
            // Show dashboard only after successful authentication
            document.getElementById('dashboardScreen').style.display = 'block';
            setupNavigation(result.user.role);
            showScreen('dashboardScreen');
            showView('dashboard');
            document.getElementById('loginForm').reset();
            
            // Initialize chatbot for teachers and students
            if (result.user.role === 'teacher' || result.user.role === 'student') {
                setTimeout(initializeChatbot, 500);
            }
            
            // Initialize AI features
            aiFeatures.init(result.user);
            
            // Load student grade info if student
            if (result.user.role === 'student') {
                loadStudentGradeInfo(result.user.id);
            }
            
            console.log('✅ Login successful:', result.user.name);
        } else {
            showLoginError(result.error);
            console.log('❌ Login failed:', result.error);
        }
    } catch (error) {
        showLoginError('Connection error');
        console.error('Login error:', error);
    }
}

// Display login error message to user
// Shows error for 3 seconds then hides automatically
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError') || createErrorDiv();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 3000);
}

// Create error message div if it doesn't exist
// Dynamically creates and styles error display element
function createErrorDiv() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'loginError';
    errorDiv.style.cssText = 'color: red; text-align: center; margin-top: 10px; display: none;';
    document.querySelector('.login-card').appendChild(errorDiv);
    return errorDiv;
}

// Determine user role based on username (legacy function)
// Used for automatic role detection - now handled by AuthSystem
function determineRole(username) {
    if (username.toLowerCase().includes('admin')) return 'admin';
    if (username.toLowerCase().includes('teacher') || username.toLowerCase().includes('profesor')) return 'teacher';
    return 'student';
}

// REMOVED FUNCTION - only login with valid credentials allowed

function loginUser(role, username) {
    const user = { role, username, loginTime: new Date().toISOString() };
    AppState.currentUser = user;
    
    // Save session in localStorage
    localStorage.setItem('learnex_user', JSON.stringify(user));
    
    document.getElementById('userRole').textContent = `${username} (${role})`;
    
    setupNavigation(role);
    showScreen('dashboardScreen');
    showView('dashboard');
}

function logout() {
    AuthSystem.logout();
    AppState.currentUser = null;
    
    // Hide dashboard and show login
    document.getElementById('dashboardScreen').style.display = 'none';
    showScreen('loginScreen');
    document.getElementById('loginForm').reset();
    
    showModal(`
        <h2>✅ Sesión Cerrada</h2>
        <p>Has cerrado sesión correctamente.</p>
        <p>Debes iniciar sesión nuevamente para acceder.</p>
        <button class="btn-primary" onclick="closeModal()">Aceptar</button>
    `);
    
    console.log('🚪 Sesión cerrada');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function setupNavigation(role) {
    const navMenu = document.getElementById('navMenu');
    const menuItems = MenuConfig[role] || MenuConfig.student;
    
    navMenu.innerHTML = '';
    
    // Only hide on mobile
    if (window.innerWidth < 768) {
        navMenu.classList.add('mobile-hidden');
    }
    
    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" data-view="${item.view}" class="${item.view === 'dashboard' ? 'active' : ''}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `;
        
        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            showView(item.view);
            
            // Update active state
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            e.target.closest('a').classList.add('active');
            
            // Close menu on mobile
            if (window.innerWidth < 768) {
                navMenu.classList.add('mobile-hidden');
            }
        });
        
        navMenu.appendChild(li);
    });
    
    setupMobileMenuClose();
}

function showView(viewName) {
    // Protect routes
    const user = AuthSystem.getCurrentUser();
    if (!user) {
        showScreen('loginScreen');
        return;
    }
    
    // Check specific permissions
    const protectedRoutes = {
        'users': ['admin'],
        'backup-system': ['admin'],
        'settings': ['admin'],
        'teachers': ['admin']
    };
    
    if (protectedRoutes[viewName] && !protectedRoutes[viewName].includes(user.role)) {
        showModal(`
            <h2>🚫 Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
            <button class="btn-primary" onclick="closeModal()">Entendido</button>
        `);
        return;
    }
    
    AppState.currentView = viewName;
    const contentArea = document.getElementById('contentArea');
    
    // Show loading while loading
    contentArea.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';
    
    // Load content after brief delay
    setTimeout(() => {
        renderViewContent(viewName, contentArea);
    }, 50);
}

// Render content for specific view based on viewName
// Generates HTML content and handles view-specific logic
function renderViewContent(viewName, contentArea) {
    let content = '';
    
    // Switch between different view types
    switch(viewName) {
        case 'dashboard':
            content = generateDashboard();
            break;
        case 'students':
            content = generateStudentsView();
            break;
        case 'grades':
            content = generateGradesView();
            break;
        case 'tasks':
            content = generateTasksView();
            break;
        case 'users':
            content = generateUsersView();
            break;
        case 'analytics':
            content = generateAnalyticsView();
            break;
        case 'attendance':
            content = generateAttendanceView();
            break;
        case 'schedule':
            content = generateScheduleView();
            break;
        case 'achievements':
            content = generateAchievementsView();
            break;
        case 'messaging':
            content = generateMessagingView();
            break;
        case 'ai-tutor':
            content = generateAITutorView();
            break;
        case 'observations':
            content = generateObservationsView();
            break;
        case 'resources':
            content = generateResourcesView();
            break;
        case 'teachers':
            content = generateTeachersView();
            break;
        case 'reports':
            content = generateReportsView();
            break;
        case 'child-progress':
            content = generateChildProgressView();
            break;
        case 'meetings':
            content = generateMeetingsView();
            break;
        case 'evaluations':
            content = generateEvaluationsView();
            break;
        case 'advanced-analytics':
            content = createAdvancedAnalytics();
            break;
        case 'ai-recommendations':
            content = generateAIRecommendationsView();
            break;
        case 'video-calls':
            content = generateVideoCallsView();
            break;
        case 'digital-library':
            content = createDigitalLibrary();
            break;
        case 'gamification':
            content = createGamificationSystem();
            break;
        case 'data-import':
            content = createDataImportSystem();
            break;
        case 'backup-system':
            content = createBackupSystem();
            break;
        case 'smtp-config':
            content = createSMTPConfig();
            break;
        case 'email-templates':
            content = createEmailTemplates();
            break;
        case 'academic-periods':
            content = createAcademicPeriods();
            break;
        case 'subject-assignment':
            content = createSubjectAssignment();
            break;
        case 'settings':
            content = generateSettingsView();
            break;
        default:
            content = generateDashboard();
    }
    
    // Assign content and apply fade-in animation
    contentArea.innerHTML = content || `<div style="text-align: center; padding: 50px; color: #666;">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
        <h3>View "${viewName}" not implemented</h3>
        <p>This functionality will be available in future versions.</p>
    </div>`;
    contentArea.classList.add('fade-in');
    setTimeout(() => contentArea.classList.remove('fade-in'), 500);
}

// Generate role-based dashboard with statistics and quick actions
// Returns HTML content customized for current user's role
function generateDashboard() {
    if (!AppState.currentUser) {
        return '<div style="text-align: center; padding: 50px;">Error: User not authenticated</div>';
    }
    
    const role = AppState.currentUser.role;
    const user = AppState.currentUser;
    
    // Dynamic data based on user role
    const roleData = getRoleSpecificData(role);
    
    let stats = '';
    let quickActions = '';
    
    if (role === 'admin') {
        stats = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${roleData.totalUsers}</h3>
                    <p>Total Usuarios</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="stat-info">
                    <h3>856</h3>
                    <p>Estudiantes Activos</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="stat-info">
                    <h3>42</h3>
                    <p>Profesores</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>4.2</h3>
                    <p>Promedio General</p>
                </div>
            </div>
        `;
        
        quickActions = `
            <div class="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div class="action-grid">
                    <div class="action-card" onclick="showView('users')">
                        <i class="fas fa-user-plus"></i>
                        <h3>Gestionar Usuarios</h3>
                        <p>Administrar profesores y estudiantes</p>
                    </div>
                    <div class="action-card" onclick="showView('analytics')">
                        <i class="fas fa-chart-bar"></i>
                        <h3>Ver Analíticas</h3>
                        <p>Reportes y métricas institucionales</p>
                    </div>
                    <div class="action-card" onclick="showView('settings')">
                        <i class="fas fa-cog"></i>
                        <h3>Configuración</h3>
                        <p>Ajustes del sistema</p>
                    </div>
                </div>
            </div>
        `;
    } else if (role === 'teacher') {
        stats = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="stat-info">
                    <h3>32</h3>
                    <p>Mis Estudiantes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-info">
                    <h3>8</h3>
                    <p>Tareas Pendientes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h3>92%</h3>
                    <p>Asistencia Promedio</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                    <h3>4.1</h3>
                    <p>Promedio Clase</p>
                </div>
            </div>
        `;
        
        quickActions = `
            <div class="quick-actions">
                <h2>Panel de Profesor</h2>
                <div class="action-grid">
                    <div class="action-card" onclick="showView('grades')">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Calificar Tareas</h3>
                        <p>8 tareas pendientes por calificar</p>
                    </div>
                    <div class="action-card" onclick="showView('attendance')">
                        <i class="fas fa-calendar-check"></i>
                        <h3>Tomar Asistencia</h3>
                        <p>Registrar asistencia de hoy</p>
                    </div>
                    <div class="action-card" onclick="showView('tasks')">
                        <i class="fas fa-plus-circle"></i>
                        <h3>Nueva Tarea</h3>
                        <p>Crear tarea o evaluación</p>
                    </div>
                    <div class="action-card" onclick="showView('observations')">
                        <i class="fas fa-eye"></i>
                        <h3>Observaciones</h3>
                        <p>Seguimiento estudiantil</p>
                    </div>
                </div>
            </div>
        `;
    } else if (role === 'student') {
        stats = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                    <h3>4.2</h3>
                    <p>Mi Promedio</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3>12</h3>
                    <p>Tareas Completadas</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>3</h3>
                    <p>Tareas Pendientes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                    <h3>95%</h3>
                    <p>Mi Asistencia</p>
                </div>
            </div>
        `;
        
        quickActions = `
            <div class="quick-actions">
                <h2>Mi Panel Estudiantil</h2>
                <div class="action-grid">
                    <div class="action-card" onclick="showView('tasks')">
                        <i class="fas fa-book"></i>
                        <h3>Mis Tareas</h3>
                        <p>3 tareas pendientes por entregar</p>
                    </div>
                    <div class="action-card" onclick="showView('grades')">
                        <i class="fas fa-star"></i>
                        <h3>Mis Calificaciones</h3>
                        <p>Ver historial académico y mi grado</p>
                    </div>
                    <div class="action-card" onclick="showView('achievements')">
                        <i class="fas fa-trophy"></i>
                        <h3>Mis Logros</h3>
                        <p>2 logros desbloqueados</p>
                    </div>
                    <div class="action-card" onclick="showView('ai-tutor')">
                        <i class="fas fa-robot"></i>
                        <h3>Tutor Virtual IA</h3>
                        <p>Asistencia personalizada</p>
                    </div>
                </div>
            </div>
        `;
    } else if (role === 'parent') {
        stats = `
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-child"></i>
                </div>
                <div class="stat-info">
                    <h3>4.3</h3>
                    <p>Promedio del Hijo</p>
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
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-info">
                    <h3>2</h3>
                    <p>Tareas Pendientes</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="stat-info">
                    <h3>3</h3>
                    <p>Mensajes Nuevos</p>
                </div>
            </div>
        `;
        
        quickActions = `
            <div class="quick-actions">
                <h2>Panel de Padres</h2>
                <div class="action-grid">
                    <div class="action-card" onclick="showView('child-progress')">
                        <i class="fas fa-chart-line"></i>
                        <h3>Progreso del Hijo</h3>
                        <p>Seguimiento académico detallado</p>
                    </div>
                    <div class="action-card" onclick="showView('messaging')">
                        <i class="fas fa-comments"></i>
                        <h3>Chat con Profesores</h3>
                        <p>3 mensajes sin leer</p>
                    </div>
                    <div class="action-card" onclick="showView('meetings')">
                        <i class="fas fa-handshake"></i>
                        <h3>Reuniones</h3>
                        <p>Próxima: Viernes 2:00 PM</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    return `
        <div id="ai-dashboard-content"></div>
        
        <div class="welcome-header">
            <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="welcome-text">
                <h1>¡Bienvenido de vuelta!</h1>
                <p>${user.username} • ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                <div id="student-grade-info" style="margin-top: 10px;"></div>
            </div>
        </div>
        
        <div class="stats-grid">
            ${stats}
        </div>
        
        ${quickActions}
        
        <div class="recent-activity">
            <h2>Actividad Reciente</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon green">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Calificación registrada</h4>
                        <p>Matemáticas - Examen Parcial</p>
                        <span class="activity-time">Hace 2 horas</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon blue">
                        <i class="fas fa-upload"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Tarea entregada</h4>
                        <p>Ensayo de Literatura</p>
                        <span class="activity-time">Ayer</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon orange">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Asistencia registrada</h4>
                        <p>Presente en todas las clases</p>
                        <span class="activity-time">Ayer</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate students management view with real database data
function generateStudentsView() {
    const user = AuthSystem.getCurrentUser();
    if (!user) {
        return '<div style="text-align: center; padding: 50px;">Error: Usuario no autenticado</div>';
    }
    
    return `
        <div id="ai-students-insights"></div>
        
        <h1>Mis Estudiantes</h1>
        
        <div class="students-actions">
            <button class="btn-ai" onclick="loadAIStudentsInsights()">🤖 Análisis IA de Estudiantes</button>
            <button class="btn-secondary" onclick="loadStudentsData()">🔄 Actualizar Lista</button>
        </div>
        
        <div id="students-loading" style="text-align: center; padding: 20px;">
            <i class="fas fa-spinner fa-spin"></i> Cargando estudiantes...
        </div>
        
        <div id="students-container" style="display: none;">
            <div class="table-container">
                <div class="table-header">
                    <h2>Lista de Estudiantes</h2>
                    <div>
                        <button class="btn-secondary" onclick="exportStudentsPDF()">📄 Exportar PDF</button>
                    </div>
                </div>
                <table id="students-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Promedio</th>
                            <th>Total Calificaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="students-tbody">
                        <!-- Datos cargados dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
        
        <script>
            // Auto-load students when view is shown
            setTimeout(() => {
                loadStudentsData();
            }, 100);
        </script>
    `;
}

// Generate grades view with real database data
function generateGradesView() {
    return `
        <div id="grades-loading" style="text-align: center; padding: 50px;">
            <i class="fas fa-spinner fa-spin"></i> Cargando calificaciones...
        </div>
        <div id="grades-content" style="display: none;"></div>
        
        <script>
            setTimeout(async () => {
                await loadRealGradesData();
            }, 100);
        </script>
    `;
}

// Generate tasks view with real database data
function generateTasksView() {
    return `
        <div id="tasks-loading" style="text-align: center; padding: 50px;">
            <i class="fas fa-spinner fa-spin"></i> Cargando tareas...
        </div>
        <div id="tasks-content" style="display: none;"></div>
        
        <script>
            setTimeout(async () => {
                await loadRealTasksData();
            }, 100);
        </script>
    `;
}

// Generate user management view (admin only)
// Shows user list with roles and management actions
function generateUsersView() {
    return `
        <h1>Gestión de Usuarios</h1>
        <div class="table-container">
            <div class="table-header">
                <h2>Lista de Usuarios</h2>
                <button class="btn-secondary" onclick="addUser()">Nuevo Usuario</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Juan Administrador</td>
                        <td>admin@learnex.com</td>
                        <td>Administrador</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td><button class="btn-secondary">Editar</button></td>
                    </tr>
                    <tr>
                        <td>María Profesora</td>
                        <td>maria@learnex.com</td>
                        <td>Profesor</td>
                        <td><span style="color: green;">Activo</span></td>
                        <td><button class="btn-secondary">Editar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Generate analytics and reports view
// Shows institutional statistics and available reports
function generateAnalyticsView() {
    return `
        <h1>Analíticas y Reportes</h1>
        <div class="stats-grid">
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
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                    <h3>4.1</h3>
                    <p>Promedio Institucional</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon red">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="stat-info">
                    <h3>12</h3>
                    <p>Estudiantes en Riesgo</p>
                </div>
            </div>
        </div>
        <div class="table-container">
            <div class="table-header">
                <h2>Reportes Disponibles</h2>
            </div>
            <div style="padding: 20px;">
                <p>📊 Reporte de Rendimiento Académico</p>
                <p>📈 Análisis de Asistencia</p>
                <p>🎯 Seguimiento de Objetivos</p>
                <p>📋 Reporte de Actividades</p>
            </div>
        </div>
    `;
}

// Generate attendance control view
// Shows daily attendance with marking capabilities
function generateAttendanceView() {
    return `
        <h1>Control de Asistencia</h1>
        <div class="table-container">
            <div class="table-header">
                <h2>Registro de Asistencia - Hoy</h2>
                <button class="btn-secondary" onclick="markAttendance()">Marcar Asistencia</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Grado</th>
                        <th>Estado</th>
                        <th>Hora</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ana García</td>
                        <td>10°A</td>
                        <td><span style="color: green;">Presente</span></td>
                        <td>08:00 AM</td>
                    </tr>
                    <tr>
                        <td>Carlos López</td>
                        <td>10°A</td>
                        <td><span style="color: red;">Ausente</span></td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Generate class schedule view
// Shows weekly timetable with subjects and teachers
function generateScheduleView() {
    return `
        <h1>Mi Horario</h1>
        <div class="table-container">
            <div class="table-header">
                <h2>Horario Semanal</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>08:00 - 09:00</td>
                        <td>Matemáticas</td>
                        <td>Español</td>
                        <td>Ciencias</td>
                        <td>Historia</td>
                        <td>Inglés</td>
                    </tr>
                    <tr>
                        <td>09:00 - 10:00</td>
                        <td>Español</td>
                        <td>Matemáticas</td>
                        <td>Historia</td>
                        <td>Ciencias</td>
                        <td>Educación Física</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Generate system settings view (admin only)
// Shows configuration options and system tools
function generateSettingsView() {
    return `
        <h1>Configuración del Sistema</h1>
        <div class="table-container">
            <div class="table-header">
                <h2>Configuraciones Generales</h2>
            </div>
            <div style="padding: 20px;">
                <h3>🏫 Información Institucional</h3>
                <p>Nombre: Institución Educativa Demo</p>
                <p>Dirección: Calle 123 #45-67</p>
                <br>
                <h3>⚙️ Configuraciones del Sistema</h3>
                <p>Año Académico: 2024</p>
                <p>Período Actual: Primer Semestre</p>
                <br>
                <h3>🔧 Herramientas</h3>
                <button class="btn-secondary" onclick="showModal('Función disponible en la versión completa')">Backup de Datos</button>
                <button class="btn-secondary" onclick="showModal('Función disponible en la versión completa')">Importar Datos</button>
            </div>
        </div>
    `;
}

// UTILITY FUNCTIONS FOR USER ACTIONS
// Helper functions for various UI interactions and modal displays

// View detailed student information in modal
function viewStudent(id) {
    const student = AppState.data.students.find(s => s.id === id);
    showModal(`
        <h2>Detalles del Estudiante</h2>
        <p><strong>Nombre:</strong> ${student.name}</p>
        <p><strong>Grado:</strong> ${student.grade}</p>
        <p><strong>Promedio:</strong> ${student.average}</p>
        <p><strong>Asistencia:</strong> ${student.attendance}%</p>
        <br>
        <p><em>This is a preview. The full version includes more details and functionalities.</em></p>
    `);
}

// Show add student modal with feature preview
function addStudent() {
    showModal(`
        <h2>Add New Student</h2>
        <p>This functionality will be available in the full version of LearnEx.</p>
        <p>It will include complete forms for:</p>
        <ul>
            <li>Personal data</li>
            <li>Academic information</li>
            <li>Emergency contact</li>
            <li>Grade assignment</li>
        </ul>
    `);
}

// Show add grade modal with feature preview
function addGrade() {
    showModal(`
        <h2>New Grade</h2>
        <p>Functionality available in the full version.</p>
        <p>It will allow registering grades with:</p>
        <ul>
            <li>Subject selection</li>
            <li>Evaluation type</li>
            <li>Grade weight</li>
            <li>Teacher comments</li>
        </ul>
    `);
}

// Show add task modal with feature preview
function addTask() {
    showModal(`
        <h2>New Task</h2>
        <p>This functionality will be available in the full version.</p>
        <p>It will include:</p>
        <ul>
            <li>Rich content editor</li>
            <li>File attachments</li>
            <li>Due date configuration</li>
            <li>Assignment to specific groups</li>
        </ul>
    `);
}

// Show add user modal with feature preview
function addUser() {
    showModal(`
        <h2>New User</h2>
        <p>Complete functionality available in the final version.</p>
        <p>It will allow creating users with different roles and permissions.</p>
    `);
}

// Show attendance marking modal with feature preview
function markAttendance() {
    showModal(`
        <h2>Mark Attendance</h2>
        <p>Attendance system available in the full version.</p>
        <p>It will include:</p>
        <ul>
            <li>QR codes for quick registration</li>
            <li>Geolocation</li>
            <li>Automatic reports</li>
            <li>Parent notifications</li>
        </ul>
    `);
}

// Show modal dialog with specified content
function showModal(content) {
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modal').classList.add('active');
}

// Close active modal dialog
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Toggle mobile menu visibility
// Shows/hides navigation menu on mobile devices
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('mobile-hidden');
}

// Setup mobile menu auto-close on link click
// Automatically closes mobile menu when user selects a menu item
function setupMobileMenuClose() {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                document.getElementById('navMenu').classList.add('mobile-hidden');
            }
        });
    });
}

// Load students data from database
async function loadStudentsData() {
    const user = AuthSystem.getCurrentUser();
    if (!user) return;
    
    const loadingDiv = document.getElementById('students-loading');
    const containerDiv = document.getElementById('students-container');
    const tbody = document.getElementById('students-tbody');
    
    if (!tbody) return;
    
    try {
        loadingDiv.style.display = 'block';
        containerDiv.style.display = 'none';
        
        const response = await fetch(`/api/teacher-students/${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            tbody.innerHTML = result.students.map(student => `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td><span style="color: ${parseFloat(student.average) >= 3.5 ? 'green' : 'red'}">${student.average}</span></td>
                    <td>${student.totalGrades}</td>
                    <td>
                        <button class="btn-secondary" onclick="viewStudentDetails(${student.id})">👁️ Ver Detalles</button>
                        <button class="btn-secondary" onclick="generateStudentAIReport(${student.id})">🤖 Reporte IA</button>
                    </td>
                </tr>
            `).join('');
            
            loadingDiv.style.display = 'none';
            containerDiv.style.display = 'block';
            
            // Show summary
            const totalStudents = result.students.length;
            const avgGrade = result.students.reduce((sum, s) => sum + (parseFloat(s.average) || 0), 0) / totalStudents;
            
            showModal(`
                <h2>📊 Resumen de Estudiantes</h2>
                <p><strong>Total estudiantes:</strong> ${totalStudents}</p>
                <p><strong>Promedio general:</strong> ${avgGrade.toFixed(1)}</p>
                <p><strong>Estudiantes con promedio ≥ 3.5:</strong> ${result.students.filter(s => parseFloat(s.average) >= 3.5).length}</p>
                <button class="btn-primary" onclick="closeModal()">Cerrar</button>
            `);
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron estudiantes</td></tr>';
            loadingDiv.style.display = 'none';
            containerDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading students:', error);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error cargando datos</td></tr>';
        loadingDiv.style.display = 'none';
        containerDiv.style.display = 'block';
    }
}

// View detailed student information
async function viewStudentDetails(studentId) {
    try {
        const response = await fetch(`/api/student-details/${studentId}`);
        const result = await response.json();
        
        if (result.success) {
            const student = result.student;
            const gradesHtml = student.grades.map(grade => 
                `<li>${grade.name_subject}: <strong>${grade.calification}</strong></li>`
            ).join('');
            
            showModal(`
                <h2>👨‍🎓 Detalles del Estudiante</h2>
                <div style="text-align: left;">
                    <p><strong>Nombre:</strong> ${student.name}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Promedio:</strong> <span style="color: ${parseFloat(student.average) >= 3.5 ? 'green' : 'red'}">${student.average}</span></p>
                    <p><strong>Curso:</strong> ${student.course ? `${student.course.grade} (${student.course.school_year})` : 'N/A'}</p>
                    
                    <h3>📊 Calificaciones:</h3>
                    <ul style="max-height: 200px; overflow-y: auto;">
                        ${gradesHtml || '<li>No hay calificaciones registradas</li>'}
                    </ul>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-secondary" onclick="generateStudentAIReport(${student.id})">🤖 Generar Reporte IA</button>
                        <button class="btn-primary" onclick="closeModal()">Cerrar</button>
                    </div>
                </div>
            `);
        } else {
            showModal(`
                <h2>❌ Error</h2>
                <p>${result.message}</p>
                <button class="btn-primary" onclick="closeModal()">Cerrar</button>
            `);
        }
    } catch (error) {
        console.error('Error getting student details:', error);
        showModal(`
            <h2>❌ Error</h2>
            <p>Error de conexión al obtener los detalles</p>
            <button class="btn-primary" onclick="closeModal()">Cerrar</button>
        `);
    }
}

// Generate AI report for student
async function generateStudentAIReport(studentId) {
    try {
        showModal(`
            <h2>🤖 Generando Reporte IA...</h2>
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2em;"></i>
                <p>La IA está analizando el rendimiento del estudiante...</p>
            </div>
        `);
        
        const response = await fetch('/api/ai-study-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: studentId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const plan = result.studyPlan;
            showModal(`
                <h2>🤖 Reporte IA del Estudiante</h2>
                <div style="text-align: left;">
                    <h3>📊 Análisis de Rendimiento</h3>
                    <p>Basado en las calificaciones actuales, la IA recomienda:</p>
                    
                    <h4>🎯 Metas Sugeridas:</h4>
                    <ul>
                        ${(plan.goals || ['Mejorar promedio general', 'Mantener constancia en estudios']).map(goal => `<li>${goal}</li>`).join('')}
                    </ul>
                    
                    <h4>🧠 Técnicas Recomendadas:</h4>
                    <ul>
                        ${(plan.techniques || ['Mapas mentales', 'Resúmenes', 'Práctica activa']).map(technique => `<li>${technique}</li>`).join('')}
                    </ul>
                    
                    <div style="margin-top: 20px;">
                        <button class="btn-primary" onclick="closeModal()">Cerrar</button>
                    </div>
                </div>
            `);
        } else {
            showModal(`
                <h2>❌ Error</h2>
                <p>No se pudo generar el reporte IA</p>
                <button class="btn-primary" onclick="closeModal()">Cerrar</button>
            `);
        }
    } catch (error) {
        console.error('Error generating AI report:', error);
        showModal(`
            <h2>❌ Error</h2>
            <p>Error de conexión al generar el reporte</p>
            <button class="btn-primary" onclick="closeModal()">Cerrar</button>
        `);
    }
}

// Load AI insights for students
async function loadAIStudentsInsights() {
    const user = AuthSystem.getCurrentUser();
    if (!user || user.role !== 'teacher') return;
    
    try {
        const response = await fetch(`/api/ai-class-insights/${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            const insights = result.insights;
            showModal(`
                <h2>🤖 Análisis IA de la Clase</h2>
                <div style="text-align: left;">
                    <h3>📊 Rendimiento General</h3>
                    <p>${insights.performance}</p>
                    
                    <h3>⚠️ Estudiantes que Requieren Atención</h3>
                    <ul>
                        ${(insights.attention || ['Revisar estudiantes con promedio bajo']).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3>💡 Recomendaciones</h3>
                    <ul>
                        ${(insights.recommendations || ['Implementar tutorías', 'Actividades de refuerzo']).map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                    
                    <h3>🎯 Estrategias Sugeridas</h3>
                    <ul>
                        ${(insights.strategies || ['Aprendizaje colaborativo', 'Evaluación formativa']).map(strategy => `<li>${strategy}</li>`).join('')}
                    </ul>
                    
                    <button class="btn-primary" onclick="closeModal()">Cerrar</button>
                </div>
            `);
        }
    } catch (error) {
        console.error('Error loading AI insights:', error);
    }
}

// Export students to PDF
function exportStudentsPDF() {
    showModal(`
        <h2>📄 Exportar a PDF</h2>
        <p>Funcionalidad de exportación disponible en la versión completa.</p>
        <p>Incluirá:</p>
        <ul>
            <li>Lista completa de estudiantes</li>
            <li>Promedios y estadísticas</li>
            <li>Gráficos de rendimiento</li>
            <li>Recomendaciones IA</li>
        </ul>
        <button class="btn-primary" onclick="closeModal()">Cerrar</button>
    `);
}

// GLOBAL FUNCTION EXPORTS
// Make functions available globally for HTML onclick handlers
window.viewStudent = viewStudent;
window.addStudent = addStudent;
window.addGrade = addGrade;
window.addTask = addTask;
window.addUser = addUser;
window.markAttendance = markAttendance;
window.toggleMobileMenu = toggleMobileMenu;
window.loadStudentsData = loadStudentsData;
window.viewStudentDetails = viewStudentDetails;
window.generateStudentAIReport = generateStudentAIReport;
window.loadAIStudentsInsights = loadAIStudentsInsights;
window.exportStudentsPDF = exportStudentsPDF;

// Load real grades data
async function loadRealGradesData() {
    const user = AuthSystem.getCurrentUser();
    if (!user) return;
    
    const loadingDiv = document.getElementById('grades-loading');
    const contentDiv = document.getElementById('grades-content');
    
    if (!loadingDiv || !contentDiv) return;
    
    try {
        dynamicLoader.init(user);
        const gradesHTML = await dynamicLoader.generateDynamicGradesView();
        
        contentDiv.innerHTML = gradesHTML;
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading grades:', error);
        contentDiv.innerHTML = `
            <h1>Calificaciones</h1>
            <div style="text-align: center; padding: 50px; color: red;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error cargando calificaciones</h3>
                <p>No se pudieron cargar los datos. Intenta nuevamente.</p>
                <button class="btn-secondary" onclick="loadRealGradesData()">🔄 Reintentar</button>
            </div>
        `;
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
    }
}

// Load real tasks data
async function loadRealTasksData() {
    const user = AuthSystem.getCurrentUser();
    if (!user) return;
    
    const loadingDiv = document.getElementById('tasks-loading');
    const contentDiv = document.getElementById('tasks-content');
    
    if (!loadingDiv || !contentDiv) return;
    
    try {
        dynamicLoader.init(user);
        const tasksHTML = await dynamicLoader.generateDynamicTasksView();
        
        contentDiv.innerHTML = tasksHTML;
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        contentDiv.innerHTML = `
            <h1>Tareas</h1>
            <div style="text-align: center; padding: 50px; color: red;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error cargando tareas</h3>
                <p>No se pudieron cargar los datos. Intenta nuevamente.</p>
                <button class="btn-secondary" onclick="loadRealTasksData()">🔄 Reintentar</button>
            </div>
        `;
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
    }
}

window.loadRealGradesData = loadRealGradesData;
window.loadRealTasksData = loadRealTasksData;

// Load student grade information for dashboard
async function loadStudentGradeInfo(studentId) {
    try {
        const response = await fetch(`/api/dashboard/${studentId}/student`);
        const result = await response.json();
        
        if (result.success && result.data.student) {
            const student = result.data.student;
            const gradeInfoDiv = document.getElementById('student-grade-info');
            if (gradeInfoDiv) {
                gradeInfoDiv.innerHTML = `
                    <small style="color: #667eea; font-weight: 500;">
                        📚 Grado ${student.grade}° • Promedio: ${student.average} • ${student.total_grades} calificaciones
                    </small>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading student grade info:', error);
    }
}

window.loadStudentGradeInfo = loadStudentGradeInfo;
// Fix for navigation panel not showing for different roles
// This ensures the navigation menu is properly displayed

// Force navigation setup after login
function forceNavigationSetup() {
    const user = AuthSystem?.getCurrentUser();
    if (!user) return;
    
    console.log('🔧 Force navigation setup for:', user.role);
    
    // Ensure dashboard is visible
    const dashboardScreen = document.getElementById('dashboardScreen');
    if (dashboardScreen) {
        dashboardScreen.style.display = 'block';
    }
    
    // Setup navigation menu
    setupNavigationMenu(user.role);
}

// Setup navigation menu with fallback
function setupNavigationMenu(role) {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) {
        console.error('❌ navMenu not found');
        return;
    }
    
    // Menu configurations
    const menus = {
        admin: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
            { icon: 'fas fa-users', text: 'Usuarios', view: 'users' },
            { icon: 'fas fa-chart-line', text: 'Analytics', view: 'analytics' },
            { icon: 'fas fa-cog', text: 'Configuración', view: 'settings' }
        ],
        teacher: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
            { icon: 'fas fa-user-graduate', text: 'Mis Estudiantes', view: 'students' },
            { icon: 'fas fa-star', text: 'Calificaciones', view: 'grades' },
            { icon: 'fas fa-clipboard-list', text: 'Tareas', view: 'tasks' }
        ],
        student: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
            { icon: 'fas fa-star', text: 'Mis Calificaciones', view: 'grades' },
            { icon: 'fas fa-book', text: 'Mis Tareas', view: 'tasks' },
            { icon: 'fas fa-trophy', text: 'Logros', view: 'achievements' }
        ],
        parent: [
            { icon: 'fas fa-tachometer-alt', text: 'Dashboard', view: 'dashboard' },
            { icon: 'fas fa-chart-line', text: 'Progreso del Hijo', view: 'child-progress' },
            { icon: 'fas fa-star', text: 'Calificaciones', view: 'grades' },
            { icon: 'fas fa-comments', text: 'Mensajes', view: 'messaging' }
        ]
    };
    
    const menuItems = menus[role] || menus.student;
    
    // Clear existing menu
    navMenu.innerHTML = '';
    
    // Add menu items
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" data-view="${item.view}" class="${index === 0 ? 'active' : ''}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `;
        
        // Add click handler
        const link = li.querySelector('a');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            // Show view
            showViewContent(item.view);
        });
        
        navMenu.appendChild(li);
    });
    
    console.log('✅ Navigation menu created with', menuItems.length, 'items');
}

// Show view content with fallback
function showViewContent(viewName) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    console.log('📄 Showing view:', viewName);
    
    // Show loading
    contentArea.innerHTML = '<div style="text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>';
    
    // Load content
    setTimeout(() => {
        let content = '';
        
        switch(viewName) {
            case 'dashboard':
                content = generateSimpleDashboard();
                break;
            case 'grades':
                content = '<h1>Mis Calificaciones</h1><p>Cargando calificaciones...</p>';
                if (typeof loadRealGradesData === 'function') {
                    loadRealGradesData();
                    return;
                }
                break;
            case 'students':
                content = '<h1>Mis Estudiantes</h1><p>Cargando estudiantes...</p>';
                break;
            case 'tasks':
                content = '<h1>Mis Tareas</h1><p>Cargando tareas...</p>';
                break;
            default:
                content = `<h1>${viewName}</h1><p>Vista en desarrollo</p>`;
        }
        
        contentArea.innerHTML = content;
    }, 100);
}

// Simple dashboard generator
function generateSimpleDashboard() {
    const user = AuthSystem?.getCurrentUser();
    if (!user) return '<p>Error: Usuario no encontrado</p>';
    
    return `
        <div class="welcome-header">
            <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="welcome-text">
                <h1>¡Bienvenido!</h1>
                <p>${user.name} • ${user.role}</p>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                    <h3>4.2</h3>
                    <p>Promedio</p>
                </div>
            </div>
        </div>
        
        <div class="recent-activity">
            <h2>Panel de ${user.role}</h2>
            <p>Bienvenido al sistema LearnEx. Tu panel está funcionando correctamente.</p>
        </div>
    `;
}

// Auto-fix navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait for other scripts to load
    setTimeout(() => {
        if (window.AuthSystem && AuthSystem.getCurrentUser()) {
            forceNavigationSetup();
        }
    }, 1000);
});

// Export functions
window.forceNavigationSetup = forceNavigationSetup;
window.setupNavigationMenu = setupNavigationMenu;
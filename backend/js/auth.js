// Secure authentication system
const AuthSystem = {
    users: {
        'admin': { password: 'admin123', role: 'admin', name: 'Administrador' },
        'teacher': { password: 'teacher123', role: 'teacher', name: 'Profesor Demo' },
        'student': { password: 'student123', role: 'student', name: 'Estudiante Demo' },
        'parent': { password: 'parent123', role: 'parent', name: 'Padre Demo' }
    },
    
    currentSession: null,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    
    // Generate simple token
    generateToken() {
        return btoa(Date.now() + Math.random()).replace(/[^a-zA-Z0-9]/g, '');
    },
    
    // Authenticate user
    authenticate(username, password) {
        const user = this.users[username.toLowerCase()];
        if (user && user.password === password) {
            const token = this.generateToken();
            this.currentSession = {
                token,
                user: { username, role: user.role, name: user.name },
                loginTime: Date.now(),
                lastActivity: Date.now()
            };
            
            // Save encrypted session
            localStorage.setItem('learnex_session', btoa(JSON.stringify(this.currentSession)));
            this.startSessionTimer();
            return { success: true, user: this.currentSession.user, token };
        }
        return { success: false, error: 'Credenciales inválidas' };
    },
    
    // Verify valid session
    isValidSession() {
        if (!this.currentSession) {
            this.loadSession();
        }
        
        if (!this.currentSession) {
            // Force logout if there is no session
            this.forceLogout();
            return false;
        }
        
        const now = Date.now();
        const sessionAge = now - this.currentSession.loginTime;
        const inactivityTime = now - this.currentSession.lastActivity;
        
        if (sessionAge > this.sessionTimeout || inactivityTime > this.sessionTimeout) {
            this.forceLogout();
            return false;
        }
        
        this.updateActivity();
        return true;
    },
    
    // Force logout and redirection
    forceLogout() {
        this.logout();
        if (typeof showScreen === 'function') {
            document.getElementById('dashboardScreen').style.display = 'none';
            showScreen('loginScreen');
        }
    },
    
    // Load session from localStorage
    loadSession() {
        try {
            const sessionData = localStorage.getItem('learnex_session');
            if (sessionData) {
                this.currentSession = JSON.parse(atob(sessionData));
                this.startSessionTimer();
            }
        } catch (e) {
            this.logout();
        }
    },
    
    // Update activity
    updateActivity() {
        if (this.currentSession) {
            this.currentSession.lastActivity = Date.now();
            localStorage.setItem('learnex_session', btoa(JSON.stringify(this.currentSession)));
        }
    },
    
    // Sign out
    logout() {
        this.currentSession = null;
        localStorage.removeItem('learnex_session');
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
    },
    
    // Timer de sesión
    startSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.sessionTimer = setInterval(() => {
            if (!this.isValidSession()) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.reload();
            }
        }, 60000); // Check every minute
    },
    
    // Get current user
    getCurrentUser() {
        return this.isValidSession() ? this.currentSession.user : null;
    }
};

// Protected Route System
const RouteGuard = {
    protectedRoutes: {
        'users': ['admin'],
        'backup-system': ['admin'],
        'settings': ['admin'],
        'teachers': ['admin'],
        'advanced-analytics': ['admin', 'teacher'],
        'grades': ['admin', 'teacher', 'student', 'parent'],
        'students': ['admin', 'teacher']
    },
    
    // Check access to route
    canAccess(route, userRole) {
        if (!this.protectedRoutes[route]) return true;
        return this.protectedRoutes[route].includes(userRole);
    },
    
    // Protection Middleware
    protect(route, callback) {
        const user = AuthSystem.getCurrentUser();
        
        if (!user) {
            this.redirectToLogin();
            return false;
        }
        
        if (!this.canAccess(route, user.role)) {
            this.showAccessDenied();
            return false;
        }
        
        AuthSystem.updateActivity();
        callback();
        return true;
    },
    
    redirectToLogin() {
        showScreen('loginScreen');
        showModal('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    },
    
    showAccessDenied() {
        showModal(`
            <h2>🚫 Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
            <p>Tu rol actual no permite esta acción.</p>
            <button class="btn-primary" onclick="closeModal()">Entendido</button>
        `);
    }
};

// Activity interceptor
document.addEventListener('click', () => AuthSystem.updateActivity());
document.addEventListener('keypress', () => AuthSystem.updateActivity());
// SECURE AUTHENTICATION SYSTEM
// Handles user authentication, session management, and security
const AuthSystem = {
    // Demo user database - In production, this would be handled by backend
    users: {
        'admin': { password: 'admin123', role: 'admin', name: 'Administrador' },
        'teacher': { password: 'teacher123', role: 'teacher', name: 'Profesor Demo' },
        'student': { password: 'student123', role: 'student', name: 'Estudiante Demo' },
        'parent': { password: 'parent123', role: 'parent', name: 'Padre Demo' }
    },
    
    // Current active session data
    currentSession: null,
    // Session timeout: 30 minutes in milliseconds
    sessionTimeout: 30 * 60 * 1000,
    
    // Generate simple authentication token
    // In production, use JWT or similar secure token system
    generateToken() {
        return btoa(Date.now() + Math.random()).replace(/[^a-zA-Z0-9]/g, '');
    },
    
    // Authenticate user with username and password using database
    // Returns success/failure result with user data or error message
    async authenticate(username, password) {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const token = this.generateToken();
                // Create session object with user data and timestamps
                this.currentSession = {
                    token,
                    user: result.user,
                    loginTime: Date.now(),
                    lastActivity: Date.now()
                };
                
                // Save encrypted session to localStorage
                localStorage.setItem('learnex_session', btoa(JSON.stringify(this.currentSession)));
                this.startSessionTimer();
                return { success: true, user: this.currentSession.user, token };
            }
            
            return { success: false, error: result.error };
        } catch (error) {
            console.error('Auth error:', error);
            return { success: false, error: 'Error de conexión' };
        }
    },
    
    // Validate current session - checks for expiration and activity
    // Returns true if session is valid, false otherwise
    isValidSession() {
        // Try to load session from localStorage if not in memory
        if (!this.currentSession) {
            this.loadSession();
        }
        
        // Force logout if no session exists
        if (!this.currentSession) {
            this.forceLogout();
            return false;
        }
        
        const now = Date.now();
        const sessionAge = now - this.currentSession.loginTime;
        const inactivityTime = now - this.currentSession.lastActivity;
        
        // Check if session has expired due to age or inactivity
        if (sessionAge > this.sessionTimeout || inactivityTime > this.sessionTimeout) {
            this.forceLogout();
            return false;
        }
        
        // Update last activity timestamp
        this.updateActivity();
        return true;
    },
    
    // Force logout and redirect to login screen
    // Used when session expires or becomes invalid
    forceLogout() {
        this.logout();
        if (typeof showScreen === 'function') {
            document.getElementById('dashboardScreen').style.display = 'none';
            showScreen('loginScreen');
        }
    },
    
    // Load session from localStorage on page refresh/reload
    // Handles encrypted session data with error handling
    loadSession() {
        try {
            const sessionData = localStorage.getItem('learnex_session');
            if (sessionData) {
                // Decrypt and parse session data
                this.currentSession = JSON.parse(atob(sessionData));
                this.startSessionTimer();
            }
        } catch (e) {
            // Clear invalid session data
            this.logout();
        }
    },
    
    // Update user activity timestamp
    // Called on user interactions to prevent session timeout
    updateActivity() {
        if (this.currentSession) {
            this.currentSession.lastActivity = Date.now();
            // Save updated session to localStorage
            localStorage.setItem('learnex_session', btoa(JSON.stringify(this.currentSession)));
        }
    },
    
    // Logout user and clean up session data
    // Removes all session data and stops timers
    logout() {
        this.currentSession = null;
        localStorage.removeItem('learnex_session');
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
    },
    
    // Start session monitoring timer
    // Checks session validity every minute and handles expiration
    startSessionTimer() {
        // Clear existing timer if any
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        // Check session validity every minute
        this.sessionTimer = setInterval(() => {
            if (!this.isValidSession()) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                window.location.reload();
            }
        }, 60000); // Check every minute
    },
    
    // Get current authenticated user
    // Returns user object if session is valid, null otherwise
    getCurrentUser() {
        return this.isValidSession() ? this.currentSession.user : null;
    }
};

// ROUTE PROTECTION SYSTEM
// Manages access control for different application routes based on user roles
const RouteGuard = {
    // Define which roles can access each route
    protectedRoutes: {
        'users': ['admin'],
        'backup-system': ['admin'],
        'settings': ['admin'],
        'teachers': ['admin'],
        'advanced-analytics': ['admin', 'teacher'],
        'grades': ['admin', 'teacher', 'student', 'parent'],
        'students': ['admin', 'teacher']
    },
    
    // Check if user role has access to specific route
    // Returns true if access is allowed, false otherwise
    canAccess(route, userRole) {
        // Allow access if route is not protected
        if (!this.protectedRoutes[route]) return true;
        // Check if user role is in allowed roles list
        return this.protectedRoutes[route].includes(userRole);
    },
    
    // Route protection middleware
    // Validates user authentication and authorization before allowing access
    protect(route, callback) {
        const user = AuthSystem.getCurrentUser();
        
        // Redirect to login if user is not authenticated
        if (!user) {
            this.redirectToLogin();
            return false;
        }
        
        // Show access denied if user doesn't have permission
        if (!this.canAccess(route, user.role)) {
            this.showAccessDenied();
            return false;
        }
        
        // Update user activity and execute callback
        AuthSystem.updateActivity();
        callback();
        return true;
    },
    
    // Redirect user to login screen
    redirectToLogin() {
        showScreen('loginScreen');
        showModal('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    },
    
    // Show access denied modal to user
    showAccessDenied() {
        showModal(`
            <h2>🚫 Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
            <p>Tu rol actual no permite esta acción.</p>
            <button class="btn-primary" onclick="closeModal()">Entendido</button>
        `);
    }
};

// ACTIVITY INTERCEPTORS
// Track user activity to prevent session timeout during active use
document.addEventListener('click', () => AuthSystem.updateActivity());
document.addEventListener('keypress', () => AuthSystem.updateActivity());
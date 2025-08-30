// Clean fix for session and messaging - no conflicts
(function() {
    'use strict';
    
    // Wait for DOM and other scripts to load
    setTimeout(function() {
        // Fix session persistence
        const originalLogin = window.login;
        if (originalLogin && !window.loginFixed) {
            window.loginFixed = true;
            
            window.login = function(username, password) {
                const result = originalLogin.call(this, username, password);
                if (result && AppState && AppState.currentUser) {
                    localStorage.setItem('learnex_session', JSON.stringify({
                        user: AppState.currentUser,
                        loginTime: Date.now()
                    }));
                }
                return result;
            };
        }
        
        // Restore session on page load
        const savedSession = localStorage.getItem('learnex_session');
        if (savedSession && AppState && !AppState.isAuthenticated) {
            try {
                const session = JSON.parse(savedSession);
                if (Date.now() - session.loginTime < 24 * 60 * 60 * 1000) {
                    AppState.currentUser = session.user;
                    AppState.isAuthenticated = true;
                    if (window.showDashboard) {
                        showDashboard();
                    }
                }
            } catch (error) {
                localStorage.removeItem('learnex_session');
            }
        }
        
        // Fix logout
        const originalLogout = window.logout;
        if (originalLogout && !window.logoutFixed) {
            window.logoutFixed = true;
            
            window.logout = function() {
                localStorage.removeItem('learnex_session');
                if (originalLogout) {
                    originalLogout.call(this);
                }
            };
        }
        
        console.log('✅ Session fix applied cleanly');
    }, 1000);
})();
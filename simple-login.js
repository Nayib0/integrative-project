// Simple login without database for Windows
document.addEventListener('DOMContentLoaded', function() {
    // Override login function to work without database
    window.login = function(username, password) {
        const users = {
            'carlos.gomez@mail.com': { id: 1, name: 'Carlos Gomez', role: 'admin' },
            'luis.perez@mail.com': { id: 3, name: 'Luis Perez', role: 'teacher' },
            'ana.rodriguez@mail.com': { id: 2, name: 'Ana Rodriguez', role: 'student' },
            'roberto.rodriguez@mail.com': { id: 102, name: 'Roberto Rodriguez', role: 'parent' },
            'pedro.sanchez@mail.com': { id: 7, name: 'Pedro Sanchez', role: 'teacher' },
            'patricia.jimenez@mail.com': { id: 103, name: 'Patricia Jimenez', role: 'parent' }
        };
        
        const passwords = {
            'carlos.gomez@mail.com': 'pass123',
            'luis.perez@mail.com': 'luis789',
            'ana.rodriguez@mail.com': 'ana456',
            'roberto.rodriguez@mail.com': 'rob888',
            'pedro.sanchez@mail.com': 'ped987',
            'patricia.jimenez@mail.com': 'pat999'
        };
        
        if (users[username] && passwords[username] === password) {
            AppState.currentUser = users[username];
            AppState.isAuthenticated = true;
            
            localStorage.setItem('learnex_session', JSON.stringify({
                user: users[username],
                loginTime: Date.now()
            }));
            
            showDashboard();
            console.log('✅ Login exitoso (modo simple)');
            return true;
        }
        
        console.log('❌ Credenciales incorrectas');
        return false;
    };
    
    console.log('🔄 Modo simple activado - Login sin base de datos');
});
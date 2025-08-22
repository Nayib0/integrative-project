// Register system
class RegisterSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const registerForm = document.getElementById('register-form');
        const backToLogin = document.querySelectorAll('#back-to-login, #back-to-login-mobile');
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        backToLogin.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.loginSystem.showScreen('login');
            });
        });
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            id: Date.now(),
            createdAt: new Date().toISOString()
        };

        if (this.validateUser(userData)) {
            this.users.push(userData);
            localStorage.setItem('users', JSON.stringify(this.users));
            this.showSuccess('¡Registro exitoso! Ahora puedes iniciar sesión');
            setTimeout(() => window.loginSystem.showScreen('login'), 2000);
            e.target.reset();
        }
    }

    validateUser(userData) {
        if (!userData.name || !userData.email || !userData.password || !userData.role) {
            this.showError('Todos los campos son obligatorios');
            return false;
        }

        if (userData.password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (this.users.find(u => u.email === userData.email)) {
            this.showError('Este email ya está registrado');
            return false;
        }

        return true;
    }



    showError(message) {
        showMessage(message, 'error');
    }

    showSuccess(message) {
        showMessage(message, 'success');
    }


}

// starting DOM
document.addEventListener('DOMContentLoaded', () => {
    window.registerSystem = new RegisterSystem();
});
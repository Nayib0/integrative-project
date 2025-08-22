// Dashboard system
class Dashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        if (!this.currentUser) {
            showScreen('login');
            return;
        }
        
        this.setupUserInfo();
        this.setupNavigation();
        this.setupRolePermissions();
        this.loadSection('home');
    }

    setupUserInfo() {
        document.getElementById('user-name').textContent = this.currentUser.name;
        const roleElement = document.getElementById('user-role');
        roleElement.textContent = this.getRoleText(this.currentUser.role);
        roleElement.className = `role-badge role-${this.currentUser.role}`;
    }

    setupNavigation() {
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.loadSection(section);
            });
        });
    }

    setupRolePermissions() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const teacherOnlyElements = document.querySelectorAll('.teacher-only');
        
        if (this.currentUser.role === 'admin') {
            adminOnlyElements.forEach(el => el.classList.add('show'));
        }
        
        if (this.currentUser.role === 'teacher' || this.currentUser.role === 'admin') {
            teacherOnlyElements.forEach(el => el.classList.add('show'));
        }
    }

    loadSection(section) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        const contentArea = document.getElementById('content-area');
        
        switch(section) {
            case 'home':
                contentArea.innerHTML = this.getHomeContent();
                break;
            case 'profile':
                contentArea.innerHTML = this.getProfileContent();
                break;
            case 'users':
                contentArea.innerHTML = this.getUsersContent();
                break;
            case 'subjects':
                contentArea.innerHTML = this.getSubjectsContent();
                break;
            case 'grades':
                contentArea.innerHTML = this.getGradesContent();
                break;
        }
    }

    getHomeContent() {
        return `
            <div class="dashboard-header">
                <h2>Bienvenido, ${this.currentUser.name}</h2>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.users.length}</h3>
                        <p>Usuarios Totales</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.users.filter(u => u.role === 'student').length}</h3>
                        <p>Estudiantes</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${this.users.filter(u => u.role === 'teacher').length}</h3>
                        <p>Profesores</p>
                    </div>
                </div>
            </div>
        `;
    }

    getProfileContent() {
        return `
            <div class="section-header">
                <h2>Mi Perfil</h2>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-4">
                            <div class="profile-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                        </div>
                        <div class="col">
                            <h3>${this.currentUser.name}</h3>
                            <p><strong>Email:</strong> ${this.currentUser.email}</p>
                            <p><strong>Rol:</strong> ${this.getRoleText(this.currentUser.role)}</p>
                            <p><strong>Fecha de registro:</strong> ${new Date(this.currentUser.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getUsersContent() {
        if (this.currentUser.role !== 'admin') {
            return '<div class="alert alert-danger">No tienes permisos para ver esta sección</div>';
        }
        
        const usersTable = this.users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${user.role}">${this.getRoleText(user.role)}</span></td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');

        return `
            <div class="section-header">
                <h2>Gestión de Usuarios</h2>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha de Registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usersTable}
                    </tbody>
                </table>
            </div>
        `;
    }

    getSubjectsContent() {
        return `
            <div class="section-header">
                <h2>Materias</h2>
            </div>
            <div class="subjects-grid">
                <div class="subject-card">
                    <h3>Matemáticas</h3>
                    <p><strong>Profesor:</strong> Juan Pérez</p>
                    <p><strong>Estudiantes:</strong> 25</p>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-sm">Ver Detalles</button>
                    </div>
                </div>
                <div class="subject-card">
                    <h3>Programación</h3>
                    <p><strong>Profesor:</strong> María García</p>
                    <p><strong>Estudiantes:</strong> 30</p>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-sm">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `;
    }

    getGradesContent() {
        return `
            <div class="section-header">
                <h2>Calificaciones</h2>
            </div>
            <div class="grades-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Estudiante</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Matemáticas</td>
                            <td>Ana López</td>
                            <td>8.5</td>
                            <td><span class="grade-badge grade-pass">Aprobado</span></td>
                        </tr>
                        <tr>
                            <td>Programación</td>
                            <td>Carlos Ruiz</td>
                            <td>6.0</td>
                            <td><span class="grade-badge grade-pass">Aprobado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getRoleText(role) {
        const roles = {
            'admin': 'Administrador',
            'teacher': 'Profesor',
            'student': 'Estudiante'
        };
        return roles[role] || role;
    }

    logout() {
        localStorage.removeItem('currentUser');
        showScreen('login');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
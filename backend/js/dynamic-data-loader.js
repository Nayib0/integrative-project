// Dynamic Data Loader - Converts static sections to real database data
class DynamicDataLoader {
    constructor() {
        this.cache = new Map();
        this.currentUser = null;
        this.studentInfo = null;
    }

    init(user) {
        this.currentUser = user;
        this.cache.clear();
    }

    // Load real grades data
    async loadGradesData() {
        if (!this.currentUser) return [];

        try {
            const endpoint = this.currentUser.role === 'student' 
                ? `/api/student-grades/${this.currentUser.id}`
                : `/api/teacher-grades/${this.currentUser.id}`;
                
            const response = await fetch(endpoint);
            const result = await response.json();
            
            // Store student info for later use
            if (result.success && result.student) {
                this.studentInfo = result.student;
            }
            
            return result.success ? result.grades : [];
        } catch (error) {
            console.error('Error loading grades:', error);
            return [];
        }
    }

    // Load real dashboard data
    async loadDashboardData() {
        if (!this.currentUser) return {};

        try {
            const response = await fetch(`/api/dashboard/${this.currentUser.id}/${this.currentUser.role}`);
            const result = await response.json();
            
            return result.success ? result.data : {};
        } catch (error) {
            console.error('Error loading dashboard:', error);
            return {};
        }
    }

    // Load real tasks data
    async loadTasksData() {
        if (!this.currentUser) return [];

        try {
            const endpoint = this.currentUser.role === 'student' 
                ? `/api/student-tasks/${this.currentUser.id}`
                : `/api/teacher-tasks/${this.currentUser.id}`;
                
            const response = await fetch(endpoint);
            const result = await response.json();
            
            return result.success ? result.tasks : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    // Generate dynamic grades view
    async generateDynamicGradesView() {
        const grades = await this.loadGradesData();
        
        // Student info header
        const studentHeader = this.studentInfo ? `
            <div class="student-info-header">
                <div class="student-avatar">
                    <i class="fas fa-user-graduate"></i>
                </div>
                <div class="student-details">
                    <h2>${this.studentInfo.name}</h2>
                    <p><strong>Grado:</strong> ${this.studentInfo.grade}° (${this.studentInfo.school_year})</p>
                    <p><strong>Email:</strong> ${this.studentInfo.email}</p>
                </div>
            </div>
        ` : '';
        
        if (grades.length === 0) {
            return `
                <h1>Mis Calificaciones</h1>
                ${studentHeader}
                <div class="no-data-message">
                    <i class="fas fa-star" style="font-size: 3em; color: #ddd;"></i>
                    <h3>No hay calificaciones registradas</h3>
                    <p>Las calificaciones aparecerán aquí cuando sean registradas por los profesores.</p>
                </div>
            `;
        }

        const gradesRows = grades.map(grade => `
            <tr>
                <td>${grade.subject || grade.name_subject}</td>
                <td><span style="color: ${grade.calification >= 3.5 ? 'green' : 'red'}">${grade.calification}</span></td>
                <td>${grade.date ? new Date(grade.date).toLocaleDateString() : 'N/A'}</td>
                <td>${grade.teacher || 'N/A'}</td>
            </tr>
        `).join('');

        const average = grades.reduce((sum, g) => sum + g.calification, 0) / grades.length;

        return `
            <h1>Mis Calificaciones</h1>
            ${studentHeader}
            
            <div class="grades-summary">
                <div class="summary-card">
                    <h3>Promedio General</h3>
                    <div class="average-display" style="color: ${average >= 3.5 ? 'green' : 'red'}">
                        ${average.toFixed(1)}
                    </div>
                </div>
                <div class="summary-card">
                    <h3>Total Calificaciones</h3>
                    <div class="count-display">${grades.length}</div>
                </div>
                <div class="summary-card">
                    <h3>Mi Grado</h3>
                    <div class="grade-display">${this.studentInfo?.grade || 'N/A'}°</div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2>Historial de Calificaciones</h2>
                    <button class="btn-secondary" onclick="exportGradesPDF()">📄 Exportar PDF</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Calificación</th>
                            <th>Fecha</th>
                            <th>Profesor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gradesRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Generate dynamic tasks view
    async generateDynamicTasksView() {
        const tasks = await this.loadTasksData();
        
        if (tasks.length === 0) {
            return `
                <h1>Mis Tareas</h1>
                <div class="no-data-message">
                    <i class="fas fa-tasks" style="font-size: 3em; color: #ddd;"></i>
                    <h3>No hay tareas asignadas</h3>
                    <p>Las tareas aparecerán aquí cuando sean asignadas por los profesores.</p>
                </div>
            `;
        }

        const tasksRows = tasks.map(task => `
            <tr>
                <td>${task.title}</td>
                <td>${task.subject}</td>
                <td>${task.due_date || task.dueDate}</td>
                <td>
                    <span class="status-badge ${task.status}">
                        ${task.status === 'completed' ? '✅ Completada' : 
                          task.status === 'pending' ? '⏳ Pendiente' : '🔄 En Progreso'}
                    </span>
                </td>
                <td>
                    <button class="btn-secondary" onclick="viewTaskDetails(${task.id})">Ver Detalles</button>
                </td>
            </tr>
        `).join('');

        const pendingCount = tasks.filter(t => t.status === 'pending').length;
        const completedCount = tasks.filter(t => t.status === 'completed').length;

        return `
            <h1>Mis Tareas</h1>
            
            <div class="tasks-summary">
                <div class="summary-card">
                    <h3>Pendientes</h3>
                    <div class="count-display" style="color: orange">${pendingCount}</div>
                </div>
                <div class="summary-card">
                    <h3>Completadas</h3>
                    <div class="count-display" style="color: green">${completedCount}</div>
                </div>
                <div class="summary-card">
                    <h3>Total</h3>
                    <div class="count-display">${tasks.length}</div>
                </div>
            </div>

            <div class="table-container">
                <div class="table-header">
                    <h2>Lista de Tareas</h2>
                    <button class="btn-secondary" onclick="refreshTasks()">🔄 Actualizar</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Materia</th>
                            <th>Fecha Límite</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tasksRows}
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Initialize dynamic data loader
const dynamicLoader = new DynamicDataLoader();

// Export functions
window.dynamicLoader = dynamicLoader;
window.exportGradesPDF = () => {
    showModal(`
        <h2>📄 Exportar Calificaciones</h2>
        <p>Funcionalidad disponible en la versión completa.</p>
        <button class="btn-primary" onclick="closeModal()">Cerrar</button>
    `);
};

window.refreshTasks = () => {
    showView('tasks'); // Reload current view
};

window.viewTaskDetails = (taskId) => {
    showModal(`
        <h2>📋 Detalles de la Tarea</h2>
        <p>Cargando detalles de la tarea ${taskId}...</p>
        <p>Funcionalidad completa disponible en la versión final.</p>
        <button class="btn-primary" onclick="closeModal()">Cerrar</button>
    `);
};
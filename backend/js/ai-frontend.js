// AI-Enhanced Frontend Features
class AIFrontend {
    constructor() {
        this.currentUser = null;
        this.aiCache = new Map();
    }

    // Initialize AI features for current user
    init(user) {
        this.currentUser = user;
        this.loadAIDashboard();
    }

    // Load AI-enhanced dashboard
    async loadAIDashboard() {
        if (!this.currentUser) return;

        try {
            const response = await fetch(`/api/ai-dashboard/${this.currentUser.id}/${this.currentUser.role}`);
            const result = await response.json();

            if (result.success) {
                this.renderAIDashboard(result.data);
            }
        } catch (error) {
            console.error('Error loading AI dashboard:', error);
        }
    }

    // Render AI dashboard content
    renderAIDashboard(aiData) {
        const dashboardContainer = document.getElementById('ai-dashboard-content');
        if (!dashboardContainer) return;

        let content = '';

        if (this.currentUser.role === 'student') {
            content = `
                <div class="ai-dashboard-card">
                    <h3>🤖 Tu Asistente Personal</h3>
                    <div class="ai-message">${aiData.message || 'Bienvenido al sistema'}</div>
                    
                    <div class="ai-tips">
                        <h4>💡 Consejos del día:</h4>
                        <ul>
                            ${(aiData.tips || []).map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="ai-goals">
                        <h4>🎯 Metas sugeridas:</h4>
                        <ul>
                            ${(aiData.goals || []).map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <button onclick="aiFeatures.loadRecommendations()" class="btn-ai">
                        Ver Recomendaciones IA
                    </button>
                    <button onclick="aiFeatures.generateStudyPlan()" class="btn-ai">
                        Generar Plan de Estudio
                    </button>
                </div>
            `;
        } else if (this.currentUser.role === 'teacher') {
            content = `
                <div class="ai-dashboard-card">
                    <h3>🎓 Asistente del Profesor</h3>
                    <div class="ai-message">${aiData.summary || 'Dashboard del profesor'}</div>
                    
                    <div class="ai-tasks">
                        <h4>📋 Tareas prioritarias:</h4>
                        <ul>
                            ${(aiData.tasks || []).map(task => `<li>${task}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="ai-attention">
                        <h4>⚠️ Requieren atención:</h4>
                        <ul>
                            ${(aiData.attention || []).map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <button onclick="aiFeatures.loadClassInsights()" class="btn-ai">
                        Análisis de Clase IA
                    </button>
                </div>
            `;
        } else if (this.currentUser.role === 'admin') {
            content = `
                <div class="ai-dashboard-card">
                    <h3>⚙️ Panel Administrativo IA</h3>
                    <div class="ai-message">${aiData.status || 'Sistema operativo'}</div>
                    
                    <div class="ai-metrics">
                        <h4>📊 Métricas del sistema:</h4>
                        <ul>
                            ${(aiData.metrics || []).map(metric => `<li>${metric}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="ai-actions">
                        <h4>🔧 Acciones sugeridas:</h4>
                        <ul>
                            ${(aiData.actions || []).map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        dashboardContainer.innerHTML = content;
    }

    // Load AI recommendations
    async loadRecommendations() {
        if (!this.currentUser) return;

        try {
            const response = await fetch(`/api/ai-recommendations/${this.currentUser.id}/${this.currentUser.role}`);
            const result = await response.json();

            if (result.success) {
                this.showRecommendationsModal(result.recommendations);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    // Show recommendations in modal
    showRecommendationsModal(recommendations) {
        const modalContent = `
            <h2>🎯 Recomendaciones Personalizadas</h2>
            <div class="recommendations-list">
                ${recommendations.map(rec => `
                    <div class="recommendation-item priority-${rec.priority}">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <div class="rec-meta">
                            <span class="priority">Prioridad: ${rec.priority}</span>
                            <span class="timeframe">Tiempo: ${rec.timeframe}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="closeModal()" class="btn-primary">Cerrar</button>
        `;

        showModal(modalContent);
    }

    // Generate study plan
    async generateStudyPlan() {
        if (!this.currentUser || this.currentUser.role !== 'student') return;

        try {
            const response = await fetch('/api/ai-study-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: this.currentUser.id })
            });

            const result = await response.json();

            if (result.success) {
                this.showStudyPlanModal(result.studyPlan);
            }
        } catch (error) {
            console.error('Error generating study plan:', error);
        }
    }

    // Show study plan in modal
    showStudyPlanModal(studyPlan) {
        const modalContent = `
            <h2>📚 Plan de Estudio Personalizado</h2>
            
            <div class="study-plan-section">
                <h3>📅 Plan Semanal</h3>
                <div class="weekly-plan">
                    ${Object.entries(studyPlan.weeklyPlan || {}).map(([day, activities]) => `
                        <div class="day-plan">
                            <h4>${this.translateDay(day)}</h4>
                            <ul>
                                ${activities.map(activity => `<li>${activity}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="study-plan-section">
                <h3>🎯 Metas</h3>
                <ul>
                    ${(studyPlan.goals || []).map(goal => `<li>${goal}</li>`).join('')}
                </ul>
            </div>
            
            <div class="study-plan-section">
                <h3>🧠 Técnicas Recomendadas</h3>
                <ul>
                    ${(studyPlan.techniques || []).map(technique => `<li>${technique}</li>`).join('')}
                </ul>
            </div>
            
            <button onclick="closeModal()" class="btn-primary">Cerrar</button>
        `;

        showModal(modalContent);
    }

    // Load class insights for teachers
    async loadClassInsights() {
        if (!this.currentUser || this.currentUser.role !== 'teacher') return;

        try {
            const response = await fetch(`/api/ai-class-insights/${this.currentUser.id}`);
            const result = await response.json();

            if (result.success) {
                this.showClassInsightsModal(result.insights);
            }
        } catch (error) {
            console.error('Error loading class insights:', error);
        }
    }

    // Show class insights modal
    showClassInsightsModal(insights) {
        const modalContent = `
            <h2>📊 Análisis de Clase con IA</h2>
            
            <div class="insights-section">
                <h3>📈 Rendimiento General</h3>
                <p>${insights.performance}</p>
            </div>
            
            <div class="insights-section">
                <h3>⚠️ Estudiantes que Requieren Atención</h3>
                <ul>
                    ${(insights.attention || []).map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="insights-section">
                <h3>💡 Recomendaciones</h3>
                <ul>
                    ${(insights.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="insights-section">
                <h3>🎯 Estrategias Sugeridas</h3>
                <ul>
                    ${(insights.strategies || []).map(strategy => `<li>${strategy}</li>`).join('')}
                </ul>
            </div>
            
            <button onclick="closeModal()" class="btn-primary">Cerrar</button>
        `;

        showModal(modalContent);
    }

    // Helper function to translate days
    translateDay(day) {
        const days = {
            monday: 'Lunes',
            tuesday: 'Martes',
            wednesday: 'Miércoles',
            thursday: 'Jueves',
            friday: 'Viernes',
            saturday: 'Sábado',
            sunday: 'Domingo'
        };
        return days[day] || day;
    }

    // Add AI section to existing content
    addAISection(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const aiSection = document.createElement('div');
        aiSection.id = 'ai-dashboard-content';
        aiSection.className = 'ai-enhanced-section';
        
        container.insertBefore(aiSection, container.firstChild);
        this.loadAIDashboard();
    }
}

// Initialize AI features
const aiFeatures = new AIFrontend();

// Auto-initialize when user logs in
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and initialize AI features
    const user = AuthSystem.getCurrentUser();
    if (user) {
        aiFeatures.init(user);
    }
});

// CSS for AI features
const aiStyles = `
<style>
.ai-enhanced-section {
    margin-bottom: 20px;
}

.ai-dashboard-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.ai-dashboard-card h3 {
    margin-top: 0;
    font-size: 1.4em;
}

.ai-message {
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    font-style: italic;
}

.ai-tips, .ai-goals, .ai-tasks, .ai-attention, .ai-metrics, .ai-actions {
    margin: 15px 0;
}

.ai-tips h4, .ai-goals h4, .ai-tasks h4, .ai-attention h4, .ai-metrics h4, .ai-actions h4 {
    margin-bottom: 10px;
    font-size: 1.1em;
}

.ai-tips ul, .ai-goals ul, .ai-tasks ul, .ai-attention ul, .ai-metrics ul, .ai-actions ul {
    list-style: none;
    padding: 0;
}

.ai-tips li, .ai-goals li, .ai-tasks li, .ai-attention li, .ai-metrics li, .ai-actions li {
    background: rgba(255,255,255,0.1);
    padding: 8px 12px;
    margin: 5px 0;
    border-radius: 6px;
    border-left: 3px solid rgba(255,255,255,0.3);
}

.btn-ai {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    margin: 5px;
    transition: all 0.3s ease;
}

.btn-ai:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

.recommendations-list {
    max-height: 400px;
    overflow-y: auto;
}

.recommendation-item {
    background: #f8f9fa;
    padding: 15px;
    margin: 10px 0;
    border-radius: 8px;
    border-left: 4px solid #007bff;
}

.recommendation-item.priority-high {
    border-left-color: #dc3545;
}

.recommendation-item.priority-medium {
    border-left-color: #ffc107;
}

.recommendation-item.priority-low {
    border-left-color: #28a745;
}

.rec-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    font-size: 0.9em;
    color: #666;
}

.study-plan-section, .insights-section {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
}

.weekly-plan {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.day-plan {
    background: white;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #dee2e6;
}

.day-plan h4 {
    margin-top: 0;
    color: #495057;
}
</style>
`;

// Inject AI styles
document.head.insertAdjacentHTML('beforeend', aiStyles);
// Force messaging to work - Simple fix
document.addEventListener('DOMContentLoaded', function() {
    // Override the messaging view completely
    const originalShowView = window.showView;
    
    window.showView = function(viewName) {
        if (viewName === 'messaging') {
            const contentArea = document.getElementById('contentArea');
            contentArea.innerHTML = `
                <div class="messaging-container enhanced">
                    <div class="conversations-sidebar">
                        <div class="sidebar-header">
                            <h2>💬 Mensajes 2.0 ACTIVO</h2>
                            <button class="btn-primary btn-sm" onclick="loadRealConversations()">
                                <i class="fas fa-sync"></i> Cargar
                            </button>
                        </div>
                        <div class="conversations-list" id="realConversations">
                            <div class="loading-conversations">
                                <i class="fas fa-spinner fa-spin"></i>
                                <p>Conectando al servidor...</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-area">
                        <div class="chat-header">
                            <h3>Sistema de Mensajería en Tiempo Real</h3>
                        </div>
                        <div class="messages-container" id="messagesContainer">
                            <div class="no-conversation">
                                <i class="fas fa-comments fa-3x"></i>
                                <p>Sistema dinámico activado</p>
                                <small>Haz clic en "Cargar" para ver conversaciones reales</small>
                            </div>
                        </div>
                        <div class="message-input-container" style="display: none;">
                            <input type="text" id="messageInput" placeholder="Escribe tu mensaje...">
                            <button class="btn-primary" onclick="sendRealMessage()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Call original for other views
        if (originalShowView) {
            originalShowView(viewName);
        }
    };
});

// Load real conversations from database
async function loadRealConversations() {
    const container = document.getElementById('realConversations');
    const userId = AppState.currentUser?.id || 1;
    
    try {
        const response = await fetch(`/api/conversations/user/${userId}`);
        const result = await response.json();
        
        if (result.success && result.conversations) {
            container.innerHTML = result.conversations.map(conv => `
                <div class="conversation-item" onclick="openRealConversation(${conv.id_conversation})">
                    <div class="conversation-avatar teacher-parent">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="conversation-info">
                        <h4>${conv.title}</h4>
                        <p class="last-message">${conv.last_message || 'Sin mensajes'}</p>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p style="padding: 20px; text-align: center;">No hay conversaciones disponibles</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: red;">Error conectando al servidor</p>';
    }
}

// Open real conversation
async function openRealConversation(conversationId) {
    const messagesContainer = document.getElementById('messagesContainer');
    const inputContainer = document.querySelector('.message-input-container');
    const userId = AppState.currentUser?.id || 1;
    
    try {
        const response = await fetch(`/api/conversations/${conversationId}/messages?userId=${userId}`);
        const result = await response.json();
        
        if (result.success) {
            messagesContainer.innerHTML = result.messages.map(msg => `
                <div class="message ${msg.id_sender === userId ? 'own' : 'other'}">
                    <div class="message-content">
                        ${msg.id_sender !== userId ? `<div class="message-sender">${msg.name} ${msg.last_name}</div>` : ''}
                        <div class="message-text">${msg.content}</div>
                        <div class="message-time">${new Date(msg.sent_at).toLocaleTimeString()}</div>
                    </div>
                </div>
            `).join('');
            
            inputContainer.style.display = 'flex';
            window.currentConversationId = conversationId;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Send real message
async function sendRealMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !window.currentConversationId) return;
    
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                conversationId: window.currentConversationId,
                senderId: AppState.currentUser?.id || 1,
                content: content
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            input.value = '';
            // Reload messages
            openRealConversation(window.currentConversationId);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
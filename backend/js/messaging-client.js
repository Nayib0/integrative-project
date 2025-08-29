/**
 * Learnex Messaging Client - Real-time messaging with Socket.IO
 */

class MessagingClient {
    constructor() {
        this.socket = null;
        this.currentConversation = null;
        this.conversations = [];
        this.messages = [];
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        // Initialize Socket.IO connection
        if (typeof io !== 'undefined') {
            this.socket = io();
            this.setupSocketEvents();
        } else {
            console.warn('Socket.IO not available, using fallback mode');
            this.loadFromStorage();
        }
    }
    
    setupSocketEvents() {
        this.socket.on('connect', () => {
            console.log('✅ Conectado al servidor de mensajería');
            this.isConnected = true;
            
            // Join user room for notifications
            if (AppState.currentUser) {
                this.socket.emit('join_user_room', AppState.currentUser.id);
            }
        });
        
        this.socket.on('disconnect', () => {
            console.log('❌ Desconectado del servidor');
            this.isConnected = false;
        });
        
        this.socket.on('new_message', (message) => {
            this.handleNewMessage(message);
        });
        
        this.socket.on('user_typing', (data) => {
            this.showTypingIndicator(data);
        });
        
        this.socket.on('user_stop_typing', (data) => {
            this.hideTypingIndicator(data);
        });
    }
    
    async loadConversations() {
        if (!AppState.currentUser) return;
        
        try {
            const response = await fetch(`/api/conversations/user/${AppState.currentUser.id}`);
            const result = await response.json();
            
            if (result.success) {
                this.conversations = result.conversations;
                this.renderConversationsList();
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            this.loadFromStorage();
        }
    }
    
    async createConversation(title, participantIds = []) {
        if (!AppState.currentUser) return;
        
        try {
            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    type: participantIds.length > 1 ? 'group' : 'private',
                    creatorId: AppState.currentUser.id,
                    participantIds
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.conversations.push(result.conversation);
                this.renderConversationsList();
                this.showNotification('✅ Conversación creada');
                return result.conversation;
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    }
    
    async sendMessage(content, messageType = 'text') {
        if (!this.currentConversation || !content.trim()) return;
        
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: this.currentConversation.id_conversation,
                    senderId: AppState.currentUser.id,
                    content: content.trim(),
                    messageType
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Message will be received via socket event
                this.clearMessageInput();
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('❌ Error enviando mensaje');
        }
    }
    
    async openConversation(conversationId) {
        try {
            // Find conversation
            const conversation = this.conversations.find(c => c.id_conversation === conversationId);
            if (!conversation) return;
            
            this.currentConversation = conversation;
            
            // Join conversation room
            if (this.socket) {
                this.socket.emit('join_conversation', conversationId);
            }
            
            // Load messages
            const response = await fetch(`/api/conversations/${conversationId}/messages?userId=${AppState.currentUser.id}`);
            const result = await response.json();
            
            if (result.success) {
                this.messages = result.messages;
                this.renderChatArea();
                this.markAsRead(conversationId);
            }
        } catch (error) {
            console.error('Error opening conversation:', error);
        }
    }
    
    async markAsRead(conversationId) {
        try {
            await fetch(`/api/conversations/${conversationId}/read`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: AppState.currentUser.id })
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }
    
    handleNewMessage(message) {
        // Add to messages if it's for current conversation
        if (this.currentConversation && message.id_conversation === this.currentConversation.id_conversation) {
            this.messages.push(message);
            this.appendMessageToChat(message);
        }
        
        // Update conversation list
        this.updateConversationLastMessage(message);
        
        // Show notification if not current conversation
        if (!this.currentConversation || message.id_conversation !== this.currentConversation.id_conversation) {
            this.showNotification(`💬 ${message.sender_name}: ${message.content.substring(0, 30)}...`);
        }
    }
    
    renderConversationsList() {
        const container = document.querySelector('.conversations-list');
        if (!container) return;
        
        // Group conversations by type
        const grouped = {
            'teacher-parent': this.conversations.filter(c => c.title.includes('Prof.') || c.title.includes('Comunicación:')),
            'group': this.conversations.filter(c => c.type === 'group' && !c.title.includes('Prof.')),
            'other': this.conversations.filter(c => !c.title.includes('Prof.') && c.type !== 'group')
        };
        
        let html = '';
        
        // Teacher-Parent conversations
        if (grouped['teacher-parent'].length > 0) {
            html += '<div class="conversation-section"><h4>👨🏫👨👩👧👦 Profesores-Padres</h4>';
            html += grouped['teacher-parent'].map(conv => this.renderConversationItem(conv)).join('');
            html += '</div>';
        }
        
        // Group conversations
        if (grouped['group'].length > 0) {
            html += '<div class="conversation-section"><h4>👥 Grupos</h4>';
            html += grouped['group'].map(conv => this.renderConversationItem(conv)).join('');
            html += '</div>';
        }
        
        // Other conversations
        if (grouped['other'].length > 0) {
            html += '<div class="conversation-section"><h4>💬 Otros</h4>';
            html += grouped['other'].map(conv => this.renderConversationItem(conv)).join('');
            html += '</div>';
        }
        
        container.innerHTML = html;
    }
    
    renderConversationItem(conv) {
        const isTeacherParent = conv.title.includes('Prof.') || conv.title.includes('Comunicación:');
        const icon = isTeacherParent ? 'chalkboard-teacher' : (conv.type === 'group' ? 'users' : 'user');
        
        return `
            <div class="conversation-item ${this.currentConversation?.id_conversation === conv.id_conversation ? 'active' : ''}" 
                 onclick="messagingClient.openConversation(${conv.id_conversation})">
                <div class="conversation-avatar ${isTeacherParent ? 'teacher-parent' : ''}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="conversation-info">
                    <h4>${conv.title}</h4>
                    <p class="last-message">${conv.last_message || 'Sin mensajes'}</p>
                </div>
                <div class="conversation-meta">
                    ${conv.last_message_time ? `<span class="time">${new Date(conv.last_message_time).toLocaleTimeString()}</span>` : ''}
                    ${conv.unread_count > 0 ? `<span class="unread-badge">${conv.unread_count}</span>` : ''}
                </div>
            </div>
        `;
    }
    
    renderChatArea() {
        const chatHeader = document.querySelector('.chat-header');
        const messagesContainer = document.getElementById('messagesContainer');
        const inputContainer = document.querySelector('.message-input-container');
        
        if (!chatHeader || !messagesContainer || !inputContainer) return;
        
        // Update header
        chatHeader.innerHTML = `
            <div class="chat-title">
                <i class="fas fa-${this.currentConversation.type === 'group' ? 'users' : 'user'}"></i>
                <h3>${this.currentConversation.title}</h3>
            </div>
            <div class="chat-actions">
                <button class="btn-icon" onclick="messagingClient.showConversationInfo()">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        `;
        
        // Render messages
        messagesContainer.innerHTML = this.messages.map(msg => this.renderMessage(msg)).join('');
        
        // Show input
        inputContainer.style.display = 'flex';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    renderMessage(message) {
        const isOwn = message.id_sender === AppState.currentUser.id;
        const time = new Date(message.sent_at).toLocaleTimeString();
        
        return `
            <div class="message ${isOwn ? 'own' : 'other'}">
                <div class="message-content">
                    ${!isOwn ? `<div class="message-sender">${message.name} ${message.last_name}</div>` : ''}
                    <div class="message-text">${message.content}</div>
                    <div class="message-time">${time}</div>
                </div>
            </div>
        `;
    }
    
    appendMessageToChat(message) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        const messageElement = document.createElement('div');
        messageElement.innerHTML = this.renderMessage(message);
        messagesContainer.appendChild(messageElement.firstElementChild);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    clearMessageInput() {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value = '';
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification messaging';
        notification.innerHTML = `<i class="fas fa-comment"></i> ${message}`;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    updateConversationLastMessage(message) {
        const conversation = this.conversations.find(c => c.id_conversation === message.id_conversation);
        if (conversation) {
            conversation.last_message = message.content;
            conversation.last_message_time = message.sent_at;
            this.renderConversationsList();
        }
    }
    
    showTypingIndicator(data) {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;
        
        // Remove existing typing indicator
        const existing = messagesContainer.querySelector('.typing-indicator');
        if (existing) existing.remove();
        
        // Add new typing indicator
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message other">
                <div class="message-content">
                    <div class="message-sender">${data.userName}</div>
                    <div class="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator(data) {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }
    
    // Fallback methods for offline mode
    loadFromStorage() {
        this.conversations = JSON.parse(localStorage.getItem('learnex_conversations') || '[]');
        this.messages = JSON.parse(localStorage.getItem('learnex_messages') || '[]');
    }
    
    saveToStorage() {
        localStorage.setItem('learnex_conversations', JSON.stringify(this.conversations));
        localStorage.setItem('learnex_messages', JSON.stringify(this.messages));
    }
}

// Enhanced UI for messaging
const MessagingUI = {
    renderMessagingView() {
        return `
            <div class="messaging-container enhanced">
                <div class="conversations-sidebar">
                    <div class="sidebar-header">
                        <h2>💬 Mensajes 2.0</h2>
                        <div class="header-actions">
                            <button class="btn-primary btn-sm" onclick="MessagingUI.showNewConversationModal()">
                                <i class="fas fa-plus"></i> Nueva
                            </button>
                            <button class="btn-icon" onclick="messagingClient.loadConversations()">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="conversations-list">
                        <div class="loading-conversations">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Cargando conversaciones...</p>
                        </div>
                    </div>
                </div>
                
                <div class="chat-area">
                    <div class="chat-header">
                        <h3>Selecciona una conversación</h3>
                    </div>
                    <div class="messages-container" id="messagesContainer">
                        <div class="no-conversation">
                            <i class="fas fa-comments fa-3x"></i>
                            <p>Selecciona una conversación para comenzar a chatear</p>
                            <small>Sistema de mensajería en tiempo real activado</small>
                        </div>
                    </div>
                    <div class="message-input-container" style="display: none;">
                        <input type="text" id="messageInput" placeholder="Escribe tu mensaje..." 
                               onkeypress="MessagingUI.handleKeyPress(event)">
                        <button class="btn-primary" onclick="MessagingUI.sendMessage()">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    showNewConversationModal() {
        const userRole = AppState.currentUser?.role;
        
        showModal(`
            <h2>💬 Nueva Conversación</h2>
            <form onsubmit="MessagingUI.createConversation(event)">
                <div class="form-group">
                    <label>Título de la conversación:</label>
                    <input type="text" name="title" placeholder="Ej: Consulta sobre Matemáticas" required>
                </div>
                <div class="form-group">
                    <label>Tipo:</label>
                    <select name="type" onchange="MessagingUI.handleTypeChange(this.value)">
                        <option value="private">Conversación Privada</option>
                        <option value="group">Grupo de Clase</option>
                        ${userRole === 'teacher' ? '<option value="teacher-parent">Comunicación con Padres</option>' : ''}
                        ${userRole === 'parent' ? '<option value="parent-teacher">Consulta a Profesor</option>' : ''}
                    </select>
                </div>
                <div id="participantSelection" style="display: none;">
                    <div class="form-group">
                        <label>Seleccionar participantes:</label>
                        <div id="participantsList"></div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button type="submit" class="btn-primary">Crear</button>
                </div>
            </form>
        `);
    },
    
    handleTypeChange(type) {
        const selection = document.getElementById('participantSelection');
        const list = document.getElementById('participantsList');
        
        if (type === 'teacher-parent' || type === 'parent-teacher') {
            selection.style.display = 'block';
            this.loadParticipantOptions(type);
        } else {
            selection.style.display = 'none';
        }
    },
    
    async loadParticipantOptions(type) {
        const list = document.getElementById('participantsList');
        const targetRole = type === 'teacher-parent' ? 'parent' : 'teacher';
        
        try {
            // This would normally fetch from API, for now use demo data
            const participants = [
                { id: 102, name: 'Roberto Rodriguez', role: 'parent' },
                { id: 103, name: 'Patricia Jimenez', role: 'parent' },
                { id: 3, name: 'Luis Perez', role: 'teacher' },
                { id: 7, name: 'Pedro Sanchez', role: 'teacher' }
            ].filter(p => p.role === targetRole);
            
            list.innerHTML = participants.map(p => `
                <label class="participant-option">
                    <input type="checkbox" name="participants" value="${p.id}">
                    <span>${p.name}</span>
                </label>
            `).join('');
        } catch (error) {
            console.error('Error loading participants:', error);
        }
    },
    
    async createConversation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const title = formData.get('title');
        const type = formData.get('type');
        
        // For demo, create with empty participants
        await messagingClient.createConversation(title, []);
        closeModal();
    },
    
    sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input || !input.value.trim()) return;
        
        messagingClient.sendMessage(input.value);
    },
    
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }
};

// Initialize messaging client
let messagingClient;

document.addEventListener('DOMContentLoaded', function() {
    messagingClient = new MessagingClient();
    
    // Force override messaging view
    window.showView = function(viewName) {
        if (viewName === 'messaging') {
            const contentArea = document.getElementById('contentArea');
            contentArea.innerHTML = MessagingUI.renderMessagingView();
            setTimeout(() => messagingClient.loadConversations(), 100);
            return;
        }
        
        // Call original function for other views
        if (window.originalShowView) {
            window.originalShowView(viewName);
        }
    };
    
    // Store original function
    if (!window.originalShowView && window.showView) {
        window.originalShowView = window.showView;
    }
});

// Auto-load conversations when messaging view is shown
document.addEventListener('viewChanged', function(event) {
    if (event.detail === 'messaging' && messagingClient) {
        setTimeout(() => messagingClient.loadConversations(), 100);
    }
});

window.MessagingUI = MessagingUI;
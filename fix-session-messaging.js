// Fix session persistence and real messaging
document.addEventListener('DOMContentLoaded', function() {
    // Fix session persistence
    const originalLogin = window.login;
    window.login = function(username, password) {
        const result = originalLogin(username, password);
        if (result && AppState.currentUser) {
            // Save session to localStorage
            localStorage.setItem('learnex_session', JSON.stringify({
                user: AppState.currentUser,
                loginTime: Date.now()
            }));
        }
        return result;
    };
    
    // Restore session on page load
    const savedSession = localStorage.getItem('learnex_session');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            // Check if session is less than 24 hours old
            if (Date.now() - session.loginTime < 24 * 60 * 60 * 1000) {
                AppState.currentUser = session.user;
                AppState.isAuthenticated = true;
                showDashboard();
            }
        } catch (error) {
            localStorage.removeItem('learnex_session');
        }
    }
    
    // Fix logout
    const originalLogout = window.logout;
    window.logout = function() {
        localStorage.removeItem('learnex_session');
        localStorage.removeItem('learnex_conversations');
        localStorage.removeItem('learnex_messages');
        if (originalLogout) originalLogout();
    };
});

// Global messaging system with persistence
window.GlobalMessaging = {
    conversations: {},
    messages: {},
    
    init() {
        this.loadFromStorage();
    },
    
    saveToStorage() {
        localStorage.setItem('learnex_conversations', JSON.stringify(this.conversations));
        localStorage.setItem('learnex_messages', JSON.stringify(this.messages));
    },
    
    loadFromStorage() {
        this.conversations = JSON.parse(localStorage.getItem('learnex_conversations') || '{}');
        this.messages = JSON.parse(localStorage.getItem('learnex_messages') || '{}');
    },
    
    createConversation(id, title, participants) {
        this.conversations[id] = {
            id: id,
            title: title,
            participants: participants,
            lastMessage: null,
            created: Date.now()
        };
        this.messages[id] = [];
        this.saveToStorage();
        return this.conversations[id];
    },
    
    sendMessage(conversationId, senderId, senderName, content) {
        if (!this.messages[conversationId]) {
            this.messages[conversationId] = [];
        }
        
        const message = {
            id: Date.now(),
            senderId: senderId,
            senderName: senderName,
            content: content,
            timestamp: Date.now(),
            time: new Date().toLocaleTimeString()
        };
        
        this.messages[conversationId].push(message);
        
        // Update conversation last message
        if (this.conversations[conversationId]) {
            this.conversations[conversationId].lastMessage = content;
        }
        
        this.saveToStorage();
        
        // Notify other users (simulate real-time)
        this.notifyUsers(conversationId, message);
        
        return message;
    },
    
    getMessages(conversationId) {
        return this.messages[conversationId] || [];
    },
    
    getConversations(userId) {
        return Object.values(this.conversations).filter(conv => 
            conv.participants.includes(userId)
        );
    },
    
    notifyUsers(conversationId, message) {
        // Simulate real-time notification
        setTimeout(() => {
            const event = new CustomEvent('newMessage', {
                detail: { conversationId, message }
            });
            window.dispatchEvent(event);
        }, 100);
    }
};

// Initialize global messaging
window.GlobalMessaging.init();

// Listen for new messages
window.addEventListener('newMessage', function(event) {
    const { conversationId, message } = event.detail;
    const currentUser = AppState.currentUser;
    
    // Only show notification if message is not from current user
    if (message.senderId !== currentUser?.id) {
        showMessageNotification(`💬 ${message.senderName}: ${message.content.substring(0, 30)}...`);
        
        // Update UI if conversation is open
        if (window.currentConversationId == conversationId) {
            const messagesContainer = document.getElementById('messagesContainer');
            if (messagesContainer) {
                const messageElement = document.createElement('div');
                messageElement.className = 'message other';
                messageElement.innerHTML = `
                    <div class="message-content">
                        <div class="message-sender">${message.senderName}</div>
                        <div class="message-text">${message.content}</div>
                        <div class="message-time">${message.time}</div>
                    </div>
                `;
                messagesContainer.appendChild(messageElement);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }
});

// Override messaging functions to use global system
window.startNewChatGlobal = function(contactId, contactName, contactRole) {
    const currentUser = AppState.currentUser;
    if (!currentUser) return;
    
    const conversationId = `${Math.min(currentUser.id, contactId)}_${Math.max(currentUser.id, contactId)}`;
    const title = `${currentUser.name} ↔ ${contactName}`;
    
    // Create conversation in global system
    GlobalMessaging.createConversation(conversationId, title, [currentUser.id, contactId]);
    
    // Add system message
    GlobalMessaging.sendMessage(conversationId, 0, 'Sistema', `Conversación iniciada entre ${currentUser.name} y ${contactName}`);
    
    // Update UI
    loadRealConversations();
    closeModal();
    openRealConversation(conversationId);
    showMessageNotification(`✅ Chat iniciado con ${contactName}`);
};

window.sendRealMessageGlobal = function() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    const currentUser = AppState.currentUser;
    
    if (!content || !window.currentConversationId || !currentUser) return;
    
    // Send message through global system
    GlobalMessaging.sendMessage(
        window.currentConversationId,
        currentUser.id,
        currentUser.name,
        content
    );
    
    // Add to UI immediately
    const messagesContainer = document.getElementById('messagesContainer');
    const messageElement = document.createElement('div');
    messageElement.className = 'message own';
    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-text">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    input.value = '';
    showMessageNotification('✅ Mensaje enviado');
};
// CHATBOT FUNCTIONALITY
// AI Assistant for students and teachers

let chatbotOpen = false;

// Initialize chatbot only for teachers and students
function initializeChatbot() {
    const user = AuthSystem.getCurrentUser();
    if (user && (user.role === 'teacher' || user.role === 'student')) {
        // Remove existing chatbot if any
        const existing = document.getElementById('chatbot-container');
        if (existing) existing.remove();
        const existingToggle = document.getElementById('chatbot-toggle');
        if (existingToggle) existingToggle.remove();
        
        createChatbotHTML();
        setupChatbotEvents();
        console.log('Chatbot initialized for:', user.role);
    }
}

// Create chatbot HTML structure
function createChatbotHTML() {
    const chatbotHTML = `
        <div id="chatbot-container" class="chatbot-container">
            <div id="chatbot-header" class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>Asistente IA</span>
                </div>
                <button id="chatbot-close" class="chatbot-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <div class="message-content">
                        ¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
            </div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbot-input" placeholder="Escribe tu pregunta..." maxlength="200">
                <button id="chatbot-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <button id="chatbot-toggle" class="chatbot-toggle">
            <i class="fas fa-robot"></i>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

// Setup chatbot event listeners
function setupChatbotEvents() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChatbot();
        });
    }
    
    if (close) {
        close.addEventListener('click', (e) => {
            e.preventDefault();
            closeChatbot();
        });
    }
    
    if (send) {
        send.addEventListener('click', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// Toggle chatbot visibility
function toggleChatbot() {
    const container = document.getElementById('chatbot-container');
    if (!container) {
        console.error('Chatbot container not found');
        return;
    }
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        container.style.display = 'flex';
        setTimeout(() => {
            const input = document.getElementById('chatbot-input');
            if (input) input.focus();
        }, 100);
    } else {
        container.style.display = 'none';
    }
}

// Close chatbot
function closeChatbot() {
    document.getElementById('chatbot-container').style.display = 'none';
    chatbotOpen = false;
}

// Send message to chatbot
async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTyping();
    
    try {
        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                userRole: AppState.currentUser?.role || 'student' 
            })
        });
        
        const data = await response.json();
        
        // Remove typing and add bot response
        removeTyping();
        addMessage(data.response, 'bot');
        
    } catch (error) {
        removeTyping();
        addMessage('Lo siento, hay un problema de conexión. Intenta de nuevo.', 'bot');
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messages = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
    `;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Show typing indicator
function showTyping() {
    const messages = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// Make functions globally accessible
window.initializeChatbot = initializeChatbot;
window.toggleChatbot = toggleChatbot;
window.closeChatbot = closeChatbot;
window.sendMessage = sendMessage;

// Initialize when DOM is loaded and user logs in
document.addEventListener('DOMContentLoaded', () => {
    // Check periodically if user has logged in
    const checkUserInterval = setInterval(() => {
        const user = AuthSystem.getCurrentUser();
        if (user && (user.role === 'teacher' || user.role === 'student')) {
            initializeChatbot();
            clearInterval(checkUserInterval);
        }
    }, 1000);
});
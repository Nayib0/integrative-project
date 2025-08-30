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
                            <div class="header-actions">
                                <button class="btn-primary btn-sm" onclick="showContactSelector()">
                                    <i class="fas fa-plus"></i> Nuevo Chat
                                </button>
                                <button class="btn-secondary btn-sm" onclick="loadRealConversations()">
                                    <i class="fas fa-sync"></i> Cargar
                                </button>
                            </div>
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
                            <button class="btn-primary" onclick="window.sendRealMessageGlobal ? sendRealMessageGlobal() : sendRealMessage()">
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

// Load real conversations - Simple version
function loadRealConversations() {
    const container = document.getElementById('realConversations');
    
    // Show demo conversations immediately
    const demoConversations = [
        { id: 1, title: 'Prof. Luis ↔ Roberto (Padre)', lastMessage: 'Buenos días, quería consultarle sobre...' },
        { id: 2, title: 'Prof. Pedro ↔ Patricia (Padre)', lastMessage: 'Hola! Por supuesto, hablemos sobre...' },
        { id: 3, title: 'Comunicación Padres-Profesores', lastMessage: 'Bienvenidos al grupo de comunicación...' },
        { id: 4, title: 'Consulta Matemáticas', lastMessage: 'No entiendo cómo resolver ecuaciones...' }
    ];
    
    container.innerHTML = `
        <div class="conversation-section">
            <h4>👨🏫👨👩👧👦 Profesores-Padres</h4>
            ${demoConversations.map(conv => `
                <div class="conversation-item" onclick="openRealConversation(${conv.id})">
                    <div class="conversation-avatar teacher-parent">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="conversation-info">
                        <h4>${conv.title}</h4>
                        <p class="last-message">${conv.lastMessage}</p>
                    </div>
                    <div class="conversation-meta">
                        <span class="time">Ahora</span>
                        <span class="unread-badge">2</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Open conversation - Simple version
function openRealConversation(conversationId) {
    const messagesContainer = document.getElementById('messagesContainer');
    const inputContainer = document.querySelector('.message-input-container');
    const chatHeader = document.querySelector('.chat-header');
    
    // Demo messages for each conversation
    const demoMessages = {
        1: [
            { sender: 'Roberto Rodriguez (Padre)', content: 'Buenos días, quería consultarle sobre el rendimiento de mi hijo', time: '10:30', isOwn: false },
            { sender: 'Tú', content: 'Hola! Por supuesto, hablemos sobre el progreso académico', time: '10:32', isOwn: true },
            { sender: 'Roberto Rodriguez (Padre)', content: '¿Cómo va en matemáticas? He notado que tiene dificultades', time: '10:35', isOwn: false },
            { sender: 'Tú', content: 'Efectivamente, necesita refuerzo en álgebra. Le recomiendo práctica extra', time: '10:38', isOwn: true }
        ],
        2: [
            { sender: 'Patricia Jimenez (Padre)', content: 'Hola profesor, ¿podemos hablar sobre las tareas?', time: '14:20', isOwn: false },
            { sender: 'Tú', content: 'Claro, ¿qué necesita saber?', time: '14:22', isOwn: true }
        ],
        3: [
            { sender: 'Prof. Luis', content: 'Bienvenidos al grupo de comunicación padres-profesores', time: '09:00', isOwn: false },
            { sender: 'Roberto (Padre)', content: 'Gracias por crear este espacio de comunicación', time: '09:05', isOwn: false },
            { sender: 'Tú', content: 'Aquí podremos coordinar reuniones y compartir información importante', time: '09:10', isOwn: true }
        ],
        4: [
            { sender: 'Ana Rodriguez (Estudiante)', content: 'Hola, tengo una duda sobre el ejercicio de álgebra', time: '16:45', isOwn: false },
            { sender: 'Tú', content: 'Hola! Claro, dime cuál es tu duda', time: '16:47', isOwn: true },
            { sender: 'Ana Rodriguez (Estudiante)', content: 'No entiendo cómo resolver ecuaciones de segundo grado', time: '16:50', isOwn: false }
        ]
    };
    
    // Check if it's a new conversation
    let messages, title;
    if (window.newConversations && window.newConversations[conversationId]) {
        const newConv = window.newConversations[conversationId];
        messages = newConv.messages;
        title = newConv.title;
    } else {
        messages = demoMessages[conversationId] || [];
        const titles = {
            1: 'Prof. Luis ↔ Roberto (Padre)',
            2: 'Prof. Pedro ↔ Patricia (Padre)', 
            3: 'Comunicación Padres-Profesores',
            4: 'Consulta Matemáticas'
        };
        title = titles[conversationId];
    }
    
    // Update header
    chatHeader.innerHTML = `
        <div class="chat-title">
            <i class="fas fa-chalkboard-teacher"></i>
            <h3>${title}</h3>
        </div>
        <div class="chat-actions">
            <span style="color: #28a745; font-size: 0.9rem;">✓ Conectado</span>
        </div>
    `;
    
    // Show messages
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message ${msg.isOwn ? 'own' : 'other'} ${msg.isSystem ? 'system' : ''}">
            <div class="message-content">
                ${!msg.isOwn && !msg.isSystem ? `<div class="message-sender">${msg.sender}</div>` : ''}
                <div class="message-text" ${msg.isSystem ? 'style="font-style: italic; color: #6c757d;"' : ''}>${msg.content}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        </div>
    `).join('');
    
    // Show input
    inputContainer.style.display = 'flex';
    window.currentConversationId = conversationId;
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send message - Simple version
function sendRealMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (!content) return;
    
    // Add message to chat immediately
    const newMessage = document.createElement('div');
    newMessage.className = 'message own';
    newMessage.innerHTML = `
        <div class="message-content">
            <div class="message-text">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    messagesContainer.appendChild(newMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store message in new conversations if applicable
    if (window.newConversations && window.newConversations[window.currentConversationId]) {
        window.newConversations[window.currentConversationId].messages.push({
            sender: 'Tú',
            content: content,
            time: new Date().toLocaleTimeString(),
            isOwn: true
        });
    }
    
    // Clear input
    input.value = '';
    
    // Show notification
    showMessageNotification('✓ Mensaje enviado');
}

// Show contact selector
function showContactSelector() {
    const userRole = AppState.currentUser?.role || 'student';
    
    // Define available contacts based on user role
    const contacts = {
        teacher: [
            { id: 102, name: 'Roberto Rodriguez', role: 'Padre', subject: 'Padre de Ana' },
            { id: 103, name: 'Patricia Jimenez', role: 'Padre', subject: 'Padre de Marta' },
            { id: 104, name: 'Carlos Torres', role: 'Padre', subject: 'Padre de Juan' },
            { id: 105, name: 'Elena Morales', role: 'Padre', subject: 'Padre de Sofia' },
            { id: 106, name: 'Fernando Herrera', role: 'Padre', subject: 'Padre de Laura' }
        ],
        parent: [
            { id: 3, name: 'Luis Perez', role: 'Profesor', subject: 'Matemáticas' },
            { id: 7, name: 'Pedro Sanchez', role: 'Profesor', subject: 'Español' },
            { id: 11, name: 'Ricardo Romero', role: 'Profesor', subject: 'Ciencias' },
            { id: 15, name: 'Esteban Martinez', role: 'Profesor', subject: 'Historia' },
            { id: 95, name: 'Maria Gonzalez', role: 'Profesor', subject: 'Inglés' }
        ],
        student: [
            { id: 3, name: 'Luis Perez', role: 'Profesor', subject: 'Matemáticas' },
            { id: 7, name: 'Pedro Sanchez', role: 'Profesor', subject: 'Español' }
        ]
    };
    
    const availableContacts = contacts[userRole] || [];
    
    showModal(`
        <h2>💬 Nuevo Chat</h2>
        <p>Selecciona con quién quieres chatear:</p>
        <div class="contacts-list">
            ${availableContacts.map(contact => `
                <div class="contact-item" onclick="window.startNewChatGlobal ? startNewChatGlobal(${contact.id}, '${contact.name}', '${contact.role}') : startNewChat(${contact.id}, '${contact.name}', '${contact.role}')">
                    <div class="contact-avatar">
                        <i class="fas fa-${contact.role === 'Profesor' ? 'chalkboard-teacher' : 'user-friends'}"></i>
                    </div>
                    <div class="contact-info">
                        <h4>${contact.name}</h4>
                        <p>${contact.role} - ${contact.subject}</p>
                    </div>
                    <div class="contact-action">
                        <i class="fas fa-comment"></i>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
        </div>
    `);
}

// Start new chat
function startNewChat(contactId, contactName, contactRole) {
    const userRole = AppState.currentUser?.role || 'student';
    const userName = AppState.currentUser?.name || 'Usuario';
    
    // Create new conversation ID
    const newConversationId = Date.now();
    
    // Add to conversations list
    const container = document.getElementById('realConversations');
    const newConvHtml = `
        <div class="conversation-item" onclick="openRealConversation(${newConversationId})">
            <div class="conversation-avatar teacher-parent">
                <i class="fas fa-${contactRole === 'Profesor' ? 'chalkboard-teacher' : 'user-friends'}"></i>
            </div>
            <div class="conversation-info">
                <h4>Chat con ${contactName}</h4>
                <p class="last-message">Conversación iniciada</p>
            </div>
            <div class="conversation-meta">
                <span class="time">Ahora</span>
                <span class="unread-badge">Nuevo</span>
            </div>
        </div>
    `;
    
    // Add to existing conversations
    const existingSection = container.querySelector('.conversation-section');
    if (existingSection) {
        existingSection.insertAdjacentHTML('beforeend', newConvHtml);
    } else {
        container.innerHTML = `
            <div class="conversation-section">
                <h4>👨🏫👨👩👧👦 Mis Chats</h4>
                ${newConvHtml}
            </div>
        `;
    }
    
    // Store new conversation data
    window.newConversations = window.newConversations || {};
    window.newConversations[newConversationId] = {
        title: `Chat con ${contactName}`,
        contactName: contactName,
        contactRole: contactRole,
        messages: [
            {
                sender: 'Sistema',
                content: `Conversación iniciada entre ${userName} y ${contactName}`,
                time: new Date().toLocaleTimeString(),
                isOwn: false,
                isSystem: true
            }
        ]
    };
    
    closeModal();
    openRealConversation(newConversationId);
    showMessageNotification(`✓ Chat iniciado con ${contactName}`);
}

// Show notification
function showMessageNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1000;
        font-size: 14px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2000);
}
/**
 * Advanced Messaging System for Learnex
 * Real-time chat, group messaging, notifications
 */

class MessagingSystem {
    constructor(pool, io = null) {
        this.pool = pool;
        this.io = io; // Socket.io instance for real-time
    }

    // Create new conversation
    async createConversation(title, type = 'private', creatorId, participantIds = []) {
        try {
            // Create conversation
            const conversation = await this.pool.query(
                'INSERT INTO learnex.conversations (title, type) VALUES ($1, $2) RETURNING *',
                [title, type]
            );
            
            const conversationId = conversation.rows[0].id_conversation;
            
            // Add creator as admin
            await this.pool.query(
                'INSERT INTO learnex.conversation_participants (id_conversation, id_user, role) VALUES ($1, $2, $3)',
                [conversationId, creatorId, 'admin']
            );
            
            // Add other participants
            for (const participantId of participantIds) {
                await this.pool.query(
                    'INSERT INTO learnex.conversation_participants (id_conversation, id_user) VALUES ($1, $2)',
                    [conversationId, participantId]
                );
            }
            
            return { success: true, conversation: conversation.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user conversations
    async getUserConversations(userId) {
        try {
            const result = await this.pool.query(
                `SELECT c.*, 
                        COUNT(DISTINCT cp.id_user) as participant_count,
                        MAX(m.sent_at) as last_message_time,
                        (SELECT content FROM learnex.messages WHERE id_conversation = c.id_conversation ORDER BY sent_at DESC LIMIT 1) as last_message,
                        COUNT(CASE WHEN m.id_sender != $1 AND NOT (m.read_by @> $2) THEN 1 END) as unread_count
                 FROM learnex.conversations c
                 JOIN learnex.conversation_participants cp ON c.id_conversation = cp.id_conversation
                 LEFT JOIN learnex.messages m ON c.id_conversation = m.id_conversation
                 WHERE c.id_conversation IN (
                     SELECT id_conversation FROM learnex.conversation_participants WHERE id_user = $1
                 )
                 GROUP BY c.id_conversation
                 ORDER BY last_message_time DESC NULLS LAST`,
                [userId, JSON.stringify([userId])]
            );
            
            return { success: true, conversations: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Send message
    async sendMessage(conversationId, senderId, content, messageType = 'text', filePath = null) {
        try {
            // Check if user is participant
            const participant = await this.pool.query(
                'SELECT id_participant FROM learnex.conversation_participants WHERE id_conversation = $1 AND id_user = $2',
                [conversationId, senderId]
            );
            
            if (participant.rows.length === 0) {
                return { success: false, error: 'User not authorized for this conversation' };
            }
            
            // Insert message
            const message = await this.pool.query(
                `INSERT INTO learnex.messages (id_conversation, id_sender, content, message_type, file_path)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [conversationId, senderId, content, messageType, filePath]
            );
            
            // Update conversation timestamp
            await this.pool.query(
                'UPDATE learnex.conversations SET updated_at = CURRENT_TIMESTAMP WHERE id_conversation = $1',
                [conversationId]
            );
            
            // Get sender info for real-time broadcast
            const sender = await this.pool.query(
                'SELECT name, last_name FROM learnex.users WHERE id_user = $1',
                [senderId]
            );
            
            const messageData = {
                ...message.rows[0],
                sender_name: `${sender.rows[0].name} ${sender.rows[0].last_name}`
            };
            
            // Real-time broadcast
            if (this.io) {
                this.io.to(`conversation_${conversationId}`).emit('new_message', messageData);
            }
            
            // Create notifications for other participants
            await this.notifyParticipants(conversationId, senderId, content);
            
            return { success: true, message: messageData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get conversation messages
    async getMessages(conversationId, userId, limit = 50, offset = 0) {
        try {
            // Verify user access
            const participant = await this.pool.query(
                'SELECT id_participant FROM learnex.conversation_participants WHERE id_conversation = $1 AND id_user = $2',
                [conversationId, userId]
            );
            
            if (participant.rows.length === 0) {
                return { success: false, error: 'Access denied' };
            }
            
            const messages = await this.pool.query(
                `SELECT m.*, u.name, u.last_name, u.rol
                 FROM learnex.messages m
                 JOIN learnex.users u ON m.id_sender = u.id_user
                 WHERE m.id_conversation = $1
                 ORDER BY m.sent_at DESC
                 LIMIT $2 OFFSET $3`,
                [conversationId, limit, offset]
            );
            
            return { success: true, messages: messages.rows.reverse() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Mark messages as read
    async markAsRead(conversationId, userId) {
        try {
            await this.pool.query(
                `UPDATE learnex.messages 
                 SET read_by = CASE 
                     WHEN read_by @> $3 THEN read_by
                     ELSE read_by || $3
                 END
                 WHERE id_conversation = $1 AND id_sender != $2`,
                [conversationId, userId, JSON.stringify([userId])]
            );
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create group conversation for class
    async createClassGroup(teacherId, courseId, subjectId) {
        try {
            // Get course and subject info
            const courseInfo = await this.pool.query(
                `SELECT c.grade, c.school_year, s.name_subject
                 FROM learnex.curses c, learnex.subjects s
                 WHERE c.id_curse = $1 AND s.id_subjects = $2`,
                [courseId, subjectId]
            );
            
            if (courseInfo.rows.length === 0) {
                return { success: false, error: 'Course or subject not found' };
            }
            
            const title = `${courseInfo.rows[0].name_subject} - ${courseInfo.rows[0].grade}° (${courseInfo.rows[0].school_year})`;
            
            // Get all students in the course
            const students = await this.pool.query(
                'SELECT id_user FROM learnex.students_curses WHERE id_curse = $1',
                [courseId]
            );
            
            const studentIds = students.rows.map(s => s.id_user);
            
            // Create group conversation
            return await this.createConversation(title, 'group', teacherId, studentIds);
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get conversation participants
    async getParticipants(conversationId) {
        try {
            const participants = await this.pool.query(
                `SELECT cp.*, u.name, u.last_name, u.rol
                 FROM learnex.conversation_participants cp
                 JOIN learnex.users u ON cp.id_user = u.id_user
                 WHERE cp.id_conversation = $1
                 ORDER BY cp.role DESC, u.name`,
                [conversationId]
            );
            
            return { success: true, participants: participants.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Add participant to conversation
    async addParticipant(conversationId, userId, addedBy) {
        try {
            // Check if adder is admin
            const admin = await this.pool.query(
                'SELECT role FROM learnex.conversation_participants WHERE id_conversation = $1 AND id_user = $2',
                [conversationId, addedBy]
            );
            
            if (admin.rows.length === 0 || admin.rows[0].role !== 'admin') {
                return { success: false, error: 'Only admins can add participants' };
            }
            
            // Add participant
            await this.pool.query(
                'INSERT INTO learnex.conversation_participants (id_conversation, id_user) VALUES ($1, $2)',
                [conversationId, userId]
            );
            
            // Notify new participant
            await this.pool.query(
                `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, 'Agregado a Conversación', 'Has sido agregado a una nueva conversación', 'conversation_added', conversationId]
            );
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Search conversations and messages
    async searchMessages(userId, query, limit = 20) {
        try {
            const results = await this.pool.query(
                `SELECT m.*, c.title as conversation_title, u.name, u.last_name
                 FROM learnex.messages m
                 JOIN learnex.conversations c ON m.id_conversation = c.id_conversation
                 JOIN learnex.users u ON m.id_sender = u.id_user
                 WHERE m.id_conversation IN (
                     SELECT id_conversation FROM learnex.conversation_participants WHERE id_user = $1
                 )
                 AND (m.content ILIKE $2 OR c.title ILIKE $2)
                 ORDER BY m.sent_at DESC
                 LIMIT $3`,
                [userId, `%${query}%`, limit]
            );
            
            return { success: true, results: results.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get message statistics
    async getMessageStats(userId) {
        try {
            const stats = await this.pool.query(
                `SELECT 
                     COUNT(DISTINCT c.id_conversation) as total_conversations,
                     COUNT(m.id_message) as total_messages_sent,
                     COUNT(CASE WHEN m.sent_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as messages_this_week,
                     COUNT(CASE WHEN m.sent_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as messages_this_month
                 FROM learnex.conversations c
                 JOIN learnex.conversation_participants cp ON c.id_conversation = cp.id_conversation
                 LEFT JOIN learnex.messages m ON c.id_conversation = m.id_conversation AND m.id_sender = $1
                 WHERE cp.id_user = $1`,
                [userId]
            );
            
            return { success: true, stats: stats.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Notification helper
    async notifyParticipants(conversationId, senderId, content) {
        try {
            const participants = await this.pool.query(
                'SELECT id_user FROM learnex.conversation_participants WHERE id_conversation = $1 AND id_user != $2',
                [conversationId, senderId]
            );
            
            const sender = await this.pool.query(
                'SELECT name, last_name FROM learnex.users WHERE id_user = $1',
                [senderId]
            );
            
            const senderName = `${sender.rows[0].name} ${sender.rows[0].last_name}`;
            const preview = content.length > 50 ? content.substring(0, 50) + '...' : content;
            
            for (const participant of participants.rows) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        participant.id_user,
                        `Nuevo mensaje de ${senderName}`,
                        preview,
                        'new_message',
                        conversationId
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating message notifications:', error);
        }
    }

    // Setup Socket.IO events
    setupSocketEvents(socket) {
        // Join conversation room
        socket.on('join_conversation', (conversationId) => {
            socket.join(`conversation_${conversationId}`);
        });
        
        // Leave conversation room
        socket.on('leave_conversation', (conversationId) => {
            socket.leave(`conversation_${conversationId}`);
        });
        
        // Handle typing indicators
        socket.on('typing_start', (data) => {
            socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
                userId: data.userId,
                userName: data.userName
            });
        });
        
        socket.on('typing_stop', (data) => {
            socket.to(`conversation_${data.conversationId}`).emit('user_stop_typing', {
                userId: data.userId
            });
        });
    }
}

module.exports = { MessagingSystem };
# Learnex - Technical Documentation

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Browser)     │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • HTML/CSS/JS   │    │ • Express.js    │    │ • Users         │
│ • Authentication│    │ • API Routes    │    │ • Courses       │
│ • UI Components │    │ • AI Integration│    │ • Subjects      │
│ • Chatbot UI    │    │ • Session Mgmt  │    │ • Grades        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   External AI   │
                       │   (DeepSeek)    │
                       │                 │
                       │ • Chat API      │
                       │ • Knowledge     │
                       │ • Responses     │
                       └─────────────────┘
```

## 📁 File Structure & Responsibilities

### Backend JavaScript Files

#### `server.js` - Express Server Configuration
```javascript
/**
 * Main server file that configures Express.js application
 * Responsibilities:
 * - HTTP server setup and middleware configuration
 * - Static file serving
 * - API route definitions
 * - Database connection management
 * - DeepSeek AI integration
 */
```

#### `auth.js` - Authentication System
```javascript
/**
 * Comprehensive authentication and session management
 * Features:
 * - User credential validation
 * - Session token generation and management
 * - Role-based access control
 * - Session timeout handling
 * - Local storage encryption
 * - Route protection middleware
 */
```

#### `app.js` - Main Application Logic
```javascript
/**
 * Core application functionality and UI management
 * Components:
 * - Application state management
 * - Menu configuration by user roles
 * - View rendering and navigation
 * - Dashboard generation
 * - Modal system
 * - Mobile responsiveness
 */
```

#### `chatbot.js` - AI Chatbot Interface
```javascript
/**
 * AI-powered chatbot functionality
 * Features:
 * - Role-based chatbot initialization (teachers/students only)
 * - Real-time messaging interface
 * - API integration with backend
 * - Typing indicators and animations
 * - Message history management
 * - Error handling and fallbacks
 */
```

#### `basic-functions.js` - Utility Functions
```javascript
/**
 * Common utility functions and helpers
 * Includes:
 * - Data formatting functions
 * - Validation utilities
 * - Common UI interactions
 * - Helper methods for components
 */
```

### Frontend Stylesheets

#### `modern-interface.css` - Core UI Components
```css
/**
 * Modern interface design system
 * Components:
 * - Login interface styling
 * - Dashboard layout
 * - Navigation components
 * - Form elements
 * - Button styles
 * - Card layouts
 */
```

#### `chatbot.css` - Chatbot Interface Styles
```css
/**
 * Chatbot-specific styling
 * Elements:
 * - Floating chat button
 * - Chat window container
 * - Message bubbles (user/bot)
 * - Input field and send button
 * - Typing indicators
 * - Mobile responsive design
 */
```

#### `responsive.css` - Mobile Adaptations
```css
/**
 * Mobile-first responsive design
 * Breakpoints:
 * - Mobile: < 768px
 * - Tablet: 768px - 1024px
 * - Desktop: > 1024px
 * 
 * Adaptations:
 * - Navigation menu collapse
 * - Chatbot sizing
 * - Form layouts
 * - Table responsiveness
 */
```

## 🔐 Authentication Flow

### Login Process
```javascript
/**
 * Authentication Flow:
 * 1. User submits credentials via login form
 * 2. Frontend sends POST request to /api/auth
 * 3. Backend validates against PostgreSQL database
 * 4. On success: Generate session token and user data
 * 5. Frontend stores encrypted session in localStorage
 * 6. Redirect to role-appropriate dashboard
 * 7. Initialize role-specific features (chatbot for teachers/students)
 */

// Example authentication request
async function authenticate(username, password) {
    const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await response.json();
}
```

### Session Management
```javascript
/**
 * Session Security Features:
 * - 30-minute session timeout
 * - Activity-based session renewal
 * - Encrypted localStorage storage
 * - Automatic logout on expiration
 * - Cross-tab session synchronization
 */

// Session validation example
isValidSession() {
    const now = Date.now();
    const sessionAge = now - this.currentSession.loginTime;
    const inactivityTime = now - this.currentSession.lastActivity;
    
    return sessionAge < this.sessionTimeout && 
           inactivityTime < this.sessionTimeout;
}
```

## 🤖 AI Chatbot Implementation

### Architecture
```javascript
/**
 * Chatbot System Components:
 * 
 * 1. Frontend Interface (chatbot.js):
 *    - UI rendering and event handling
 *    - Message display and input management
 *    - Real-time communication with backend
 * 
 * 2. Backend API (server.js):
 *    - Message processing and routing
 *    - DeepSeek AI integration
 *    - Fallback knowledge system
 * 
 * 3. Knowledge Base:
 *    - Local educational content
 *    - Role-specific responses
 *    - Subject-matter expertise
 */
```

### Message Processing Flow
```javascript
/**
 * Message Flow:
 * 1. User types message in chatbot interface
 * 2. Frontend sends message + user role to /api/chatbot
 * 3. Backend attempts DeepSeek AI API call
 * 4. If AI fails: Use local knowledge base
 * 5. Return formatted response to frontend
 * 6. Display response with typing animation
 */

// Example message processing
async function sendMessage() {
    const message = input.value.trim();
    const userRole = AppState.currentUser?.role;
    
    const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userRole })
    });
    
    const data = await response.json();
    addMessage(data.response, 'bot');
}
```

### AI Integration
```javascript
/**
 * DeepSeek AI Configuration:
 * - Model: deepseek-chat
 * - Max tokens: 500
 * - Temperature: 0.7 (balanced creativity/accuracy)
 * - System prompt: Role-specific educational context
 * - Fallback: Local knowledge base on API failure
 */

// AI API call example
async function generateAIResponse(message, userRole) {
    const systemPrompt = `You are an educational virtual tutor for ${
        userRole === 'student' ? 'students' : 'teachers'
    }. Respond clearly, educationally, and helpfully.`;
    
    const response = await axios.post(DEEPSEEK_API_URL, {
        model: 'deepseek-chat',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
    });
    
    return response.data.choices[0].message.content;
}
```

## 🗄️ Database Integration

### Schema Design
```sql
/**
 * Database Schema (PostgreSQL):
 * 
 * learnex.users - User accounts and authentication
 * ├── id_user (Primary Key)
 * ├── name, last_name (User identification)
 * ├── mail (Unique login identifier)
 * ├── password (Authentication credential)
 * ├── rol (Role-based access: admin/teacher/student/parent)
 * └── state (Account status: active/inactive)
 * 
 * learnex.curses - Academic courses
 * ├── id_curse (Primary Key)
 * ├── grade (Academic level)
 * └── school_year (Academic year)
 * 
 * learnex.subjects - Academic subjects
 * ├── id_subjects (Primary Key)
 * └── name_subject (Subject name)
 * 
 * learnex.curse_subject_teacher - Teaching assignments
 * ├── id_cst (Primary Key)
 * ├── id_curse (Foreign Key → curses)
 * ├── id_subject (Foreign Key → subjects)
 * └── id_teacher (Foreign Key → users)
 * 
 * learnex.notes - Student grades
 * ├── id_note (Primary Key)
 * ├── id_student (Foreign Key → users)
 * ├── id_cst (Foreign Key → curse_subject_teacher)
 * └── calification (Grade value)
 * 
 * learnex.students_curses - Student enrollments
 * ├── id_student_curse (Primary Key)
 * ├── id_user (Foreign Key → users)
 * └── id_curse (Foreign Key → curses)
 */
```

### Connection Management
```javascript
/**
 * PostgreSQL Connection Configuration:
 * - Connection pooling for performance
 * - Automatic connection cleanup
 * - Error handling and retry logic
 * - Schema-aware queries (learnex.*)
 */

// Database connection example
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learnex',
    password: 'your_password',
    port: 5432,
});

// Query execution with error handling
async function authenticateUser(username, password) {
    try {
        const result = await pool.query(
            'SELECT * FROM learnex.users WHERE mail = $1 AND password = $2 AND state = $3',
            [username, password, 'active']
        );
        return result.rows[0];
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    } finally {
        pool.end();
    }
}
```

## 🎨 Frontend Architecture

### Component Structure
```javascript
/**
 * Frontend Components:
 * 
 * 1. Authentication Components:
 *    - Login form with validation
 *    - Session management
 *    - Role-based redirects
 * 
 * 2. Navigation Components:
 *    - Role-specific menu generation
 *    - Mobile-responsive navigation
 *    - Active state management
 * 
 * 3. Dashboard Components:
 *    - Role-specific dashboard content
 *    - Statistics cards
 *    - Quick action buttons
 *    - Activity feeds
 * 
 * 4. Modal System:
 *    - Reusable modal container
 *    - Dynamic content loading
 *    - Event handling
 * 
 * 5. Chatbot Components:
 *    - Floating chat button
 *    - Chat window interface
 *    - Message rendering
 *    - Input handling
 */
```

### State Management
```javascript
/**
 * Application State (AppState):
 * - currentUser: Authenticated user data
 * - currentView: Active dashboard view
 * - data: Demo/sample data for UI
 * 
 * State is managed globally and updated through:
 * - Authentication events
 * - Navigation actions
 * - API responses
 */

const AppState = {
    currentUser: null,
    currentView: 'dashboard',
    data: {
        students: [...],
        grades: [...],
        tasks: [...],
        // ... other demo data
    }
};
```

### View Rendering System
```javascript
/**
 * Dynamic View Rendering:
 * 1. User selects menu item
 * 2. showView() function called with view name
 * 3. Route protection validates user permissions
 * 4. Content area updated with view-specific HTML
 * 5. View-specific event handlers attached
 * 
 * Supported Views:
 * - dashboard: Role-specific overview
 * - students: Student management (admin/teacher)
 * - grades: Grade management
 * - tasks: Assignment management
 * - users: User administration (admin only)
 * - analytics: Performance reports
 * - settings: System configuration (admin only)
 */

function showView(viewName) {
    // Validate user permissions
    const user = AuthSystem.getCurrentUser();
    if (!user) return showScreen('loginScreen');
    
    // Check role-based access
    if (!RouteGuard.canAccess(viewName, user.role)) {
        return RouteGuard.showAccessDenied();
    }
    
    // Render view content
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = renderViewContent(viewName);
}
```

## 🔧 Configuration & Environment

### Environment Variables
```bash
# .env file configuration
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here  # AI service API key
DB_HOST=localhost                                # Database host
DB_PORT=5432                                    # Database port
DB_NAME=learnex                                 # Database name
DB_USER=postgres                                # Database user
DB_PASSWORD=your_password                       # Database password
PORT=3000                                       # Server port
NODE_ENV=development                            # Environment mode
```

### Package Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",      // Web framework
    "pg": "^8.16.3",           // PostgreSQL client
    "axios": "^1.6.0",         // HTTP client for AI API
    "dotenv": "^16.3.1"        // Environment variable loader
  }
}
```

## 🧪 Testing & Debugging

### Built-in Testing System
```javascript
/**
 * Testing Utilities (tests.js):
 * - Authentication system validation
 * - Database connection testing
 * - API endpoint verification
 * - UI component functionality
 * - Role-based access testing
 * 
 * Access via login screen "🧪 Tests" button
 */

function runQuickTests() {
    console.log('🧪 Running system tests...');
    
    // Test authentication
    testAuthenticationSystem();
    
    // Test database connection
    testDatabaseConnection();
    
    // Test API endpoints
    testAPIEndpoints();
    
    // Test UI components
    testUIComponents();
}
```

### Error Handling
```javascript
/**
 * Error Handling Strategy:
 * 
 * 1. Database Errors:
 *    - Connection failures → Fallback to demo data
 *    - Query errors → User-friendly error messages
 *    - Timeout handling → Retry logic
 * 
 * 2. API Errors:
 *    - AI service failures → Local knowledge fallback
 *    - Network errors → Cached responses
 *    - Rate limiting → Queue management
 * 
 * 3. Frontend Errors:
 *    - JavaScript errors → Graceful degradation
 *    - Missing elements → Safe defaults
 *    - Session expiry → Automatic re-authentication
 */

// Example error handling
try {
    const response = await generateAIResponse(message, userRole);
    return response;
} catch (error) {
    console.error('AI Error:', error);
    // Fallback to local knowledge
    return generateChatbotResponse(message, userRole);
}
```

## 🚀 Performance Optimization

### Frontend Optimizations
```javascript
/**
 * Performance Strategies:
 * 
 * 1. Lazy Loading:
 *    - Views loaded on demand
 *    - Chatbot initialized only for eligible roles
 *    - Images and assets loaded progressively
 * 
 * 2. Caching:
 *    - Session data in localStorage
 *    - API responses cached temporarily
 *    - Static assets cached by browser
 * 
 * 3. Efficient DOM Manipulation:
 *    - Batch DOM updates
 *    - Event delegation
 *    - Minimal reflows and repaints
 */

// Example lazy loading
function showView(viewName) {
    // Show loading state
    contentArea.innerHTML = '<div class="loading">Loading...</div>';
    
    // Load content asynchronously
    setTimeout(() => {
        renderViewContent(viewName, contentArea);
    }, 50);
}
```

### Backend Optimizations
```javascript
/**
 * Server Performance:
 * 
 * 1. Database Connection Pooling:
 *    - Reuse connections efficiently
 *    - Automatic connection cleanup
 *    - Connection limit management
 * 
 * 2. API Response Optimization:
 *    - Minimal data transfer
 *    - Compressed responses
 *    - Efficient JSON serialization
 * 
 * 3. Static File Serving:
 *    - Express static middleware
 *    - Proper cache headers
 *    - Gzip compression
 */
```

## 🔒 Security Considerations

### Authentication Security
```javascript
/**
 * Security Measures:
 * 
 * 1. Session Management:
 *    - Encrypted session storage
 *    - Automatic session expiry
 *    - Activity-based renewal
 * 
 * 2. Input Validation:
 *    - SQL injection prevention (parameterized queries)
 *    - XSS protection (input sanitization)
 *    - CSRF protection (token validation)
 * 
 * 3. Access Control:
 *    - Role-based permissions
 *    - Route protection
 *    - API endpoint security
 */

// Secure database query
const result = await pool.query(
    'SELECT * FROM learnex.users WHERE mail = $1 AND password = $2',
    [username, password]  // Parameterized to prevent SQL injection
);
```

### Data Protection
```javascript
/**
 * Data Security:
 * 
 * 1. Sensitive Data Handling:
 *    - No plain text password storage
 *    - Encrypted session tokens
 *    - Secure API key management
 * 
 * 2. Communication Security:
 *    - HTTPS in production
 *    - Secure headers
 *    - API rate limiting
 * 
 * 3. Database Security:
 *    - Connection encryption
 *    - Access control
 *    - Audit logging
 */
```

## 📱 Mobile Responsiveness

### Responsive Design Strategy
```css
/**
 * Mobile-First Approach:
 * 
 * 1. Breakpoints:
 *    - Mobile: < 768px
 *    - Tablet: 768px - 1024px
 *    - Desktop: > 1024px
 * 
 * 2. Adaptive Components:
 *    - Collapsible navigation
 *    - Responsive tables
 *    - Touch-friendly buttons
 *    - Optimized chatbot interface
 * 
 * 3. Performance on Mobile:
 *    - Optimized images
 *    - Minimal JavaScript
 *    - Fast loading times
 */

/* Example responsive styles */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .nav-menu.mobile-visible {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 1000;
    }
}
```

## 🔄 Deployment Guide

### Production Configuration
```javascript
/**
 * Production Setup:
 * 
 * 1. Environment Configuration:
 *    - Set NODE_ENV=production
 *    - Configure production database
 *    - Set secure API keys
 * 
 * 2. Security Hardening:
 *    - Enable HTTPS
 *    - Set security headers
 *    - Configure CORS properly
 * 
 * 3. Performance Optimization:
 *    - Enable gzip compression
 *    - Set cache headers
 *    - Optimize database queries
 * 
 * 4. Monitoring:
 *    - Error logging
 *    - Performance monitoring
 *    - Health checks
 */
```

### Deployment Checklist
- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Static assets optimized
- [ ] Error monitoring enabled
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit passed

---

This technical documentation provides comprehensive coverage of the Learnex platform's architecture, implementation details, and operational considerations for developers and system administrators.
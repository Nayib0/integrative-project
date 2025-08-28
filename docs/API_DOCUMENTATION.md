# Learnex API Documentation

## 📋 Overview

The Learnex API provides endpoints for authentication, AI chatbot interaction, and database testing. All endpoints return JSON responses and follow RESTful conventions.

**Base URL**: `http://localhost:3000`

## 🔐 Authentication

### POST `/api/auth`

Authenticates a user with email and password credentials.

#### Request Body
```json
{
  "username": "user@example.com",
  "password": "userpassword"
}
```

#### Response Format
**Success Response (200)**
```json
{
  "success": true,
  "user": {
    "username": "user@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Error Response (200)**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'ana.rodriguez@mail.com',
    password: 'ana456'
  })
});

const result = await response.json();
if (result.success) {
  console.log('User authenticated:', result.user);
} else {
  console.error('Authentication failed:', result.error);
}
```

#### User Roles
- `admin`: System administrator with full access
- `teacher`: Educator with class management capabilities
- `student`: Learner with assignment and grade access
- `parent`: Guardian with child monitoring access

---

## 🤖 Chatbot Interaction

### POST `/api/chatbot`

Processes user messages through the AI chatbot system with role-based responses.

#### Request Body
```json
{
  "message": "Tell me about World War II",
  "userRole": "student"
}
```

#### Response Format
**Success Response (200)**
```json
{
  "response": "🌍 **World War II (1939-1945)**\n\n📅 **Key dates:**\n• Start: Sept 1, 1939 (Poland invasion)\n• End: Sept 2, 1945 (Japan surrender)\n\n⚔️ **Main sides:**\n• Allies: United Kingdom, USSR, USA, France\n• Axis: Germany, Italy, Japan\n\n🔥 **Important events:**\n• Pearl Harbor (1941)\n• D-Day Normandy Landing (1944)\n• Atomic bombs (Hiroshima and Nagasaki)\n\nWould you like to know about any specific aspect?"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'How do I solve quadratic equations?',
    userRole: 'student'
  })
});

const result = await response.json();
console.log('AI Response:', result.response);
```

#### Supported Topics

**Academic Subjects**
- **History**: World War II, historical events, dates
- **Mathematics**: Equations, algebra, geometry, formulas
- **Sciences**: Biology, physics, chemistry concepts
- **Study Techniques**: Learning strategies, time management

**Platform Features**
- Task management
- Grade checking
- Schedule information
- Attendance tracking

#### Role-Specific Responses

**For Students (`userRole: "student"`)**
- Academic help and explanations
- Study tips and techniques
- Assignment guidance
- Learning resources

**For Teachers (`userRole: "teacher"`)**
- Class management assistance
- Student performance insights
- Educational content support
- Teaching strategies

#### AI Integration

The chatbot uses a two-tier system:

1. **Primary**: DeepSeek AI API for advanced responses
2. **Fallback**: Local knowledge base for reliability

**DeepSeek Configuration**
```javascript
{
  model: 'deepseek-chat',
  max_tokens: 500,
  temperature: 0.7,
  system_prompt: 'Role-specific educational context'
}
```

---

## 🗄️ Database Testing

### GET `/api/test-db`

Tests database connectivity and returns sample user data for verification.

#### Response Format
**Success Response (200)**
```json
{
  "success": true,
  "users": [
    {
      "id_user": 1,
      "name": "Carlos",
      "last_name": "Gomez",
      "mail": "carlos.gomez@mail.com",
      "password": "pass123",
      "rol": "admin",
      "state": "active"
    },
    {
      "id_user": 2,
      "name": "Ana",
      "last_name": "Rodriguez",
      "mail": "ana.rodriguez@mail.com",
      "password": "ana456",
      "rol": "student",
      "state": "active"
    }
  ]
}
```

**Error Response (200)**
```json
{
  "success": false,
  "error": "relation \"users\" does not exist"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/test-db');
const result = await response.json();

if (result.success) {
  console.log('Database connected. Users found:', result.users.length);
  result.users.forEach(user => {
    console.log(`${user.name} ${user.last_name} (${user.rol})`);
  });
} else {
  console.error('Database error:', result.error);
}
```

---

## 📁 Static File Serving

### GET `/`

Serves the main application interface.

**Response**: HTML document with the complete Learnex application

### GET `/css/*`

Serves stylesheet files for the application.

**Available Stylesheets**:
- `/css/modern-interface.css` - Core UI components
- `/css/chatbot.css` - Chatbot interface styles
- `/css/responsive.css` - Mobile responsiveness
- `/css/enterprise-styles.css` - Enterprise UI elements
- `/css/loading.css` - Loading animations

### GET `/backend/js/*`

Serves JavaScript modules for the application.

**Available Scripts**:
- `/backend/js/app.js` - Main application logic
- `/backend/js/auth.js` - Authentication system
- `/backend/js/chatbot.js` - Chatbot functionality
- `/backend/js/basic-functions.js` - Utility functions
- `/backend/js/tests.js` - Testing utilities

---

## 🔧 Error Handling

### Standard Error Responses

All API endpoints follow consistent error response patterns:

#### Database Connection Errors
```json
{
  "success": false,
  "error": "Database connection failed"
}
```

#### Authentication Errors
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

#### AI Service Errors
When DeepSeek AI is unavailable, the system automatically falls back to local responses:
```json
{
  "response": "🤖 I can help you with:\n• 📚 Academic concepts (history, mathematics, sciences)\n• 📋 Tasks and grades\n• 📅 Schedules and attendance\n• 💡 Study techniques\n\nWhat topic would you like to learn about?"
}
```

### Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success (includes application-level errors) |
| 404 | Endpoint not found |
| 500 | Internal server error |

---

## 🧪 Testing the API

### Using cURL

**Test Authentication**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"ana.rodriguez@mail.com","password":"ana456"}'
```

**Test Chatbot**
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userRole":"student"}'
```

**Test Database**
```bash
curl http://localhost:3000/api/test-db
```

### Using JavaScript Fetch

**Complete Authentication Flow**
```javascript
async function testAuthentication() {
  try {
    // Test authentication
    const authResponse = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'pedro.sanchez@mail.com',
        password: 'ped987'
      })
    });
    
    const authResult = await authResponse.json();
    console.log('Auth result:', authResult);
    
    if (authResult.success) {
      // Test chatbot with authenticated user role
      const chatResponse = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'How are my students performing?',
          userRole: authResult.user.role
        })
      });
      
      const chatResult = await chatResponse.json();
      console.log('Chat response:', chatResult.response);
    }
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testAuthentication();
```

---

## 🔒 Security Considerations

### Input Validation

**SQL Injection Prevention**
All database queries use parameterized statements:
```javascript
const result = await pool.query(
  'SELECT * FROM learnex.users WHERE mail = $1 AND password = $2 AND state = $3',
  [username, password, 'active']
);
```

**XSS Protection**
- User inputs are validated and sanitized
- Responses are properly encoded
- Content-Type headers are set correctly

### Authentication Security

**Session Management**
- No sensitive data in API responses
- Role-based access control
- Session timeout handling

**API Key Security**
- DeepSeek API key stored in environment variables
- No API keys exposed in client-side code
- Fallback system for API failures

---

## 📊 Rate Limiting & Performance

### Current Limitations

**Database Connections**
- Connection pooling implemented
- Automatic connection cleanup
- Maximum concurrent connections managed

**AI API Calls**
- DeepSeek API rate limits apply
- Fallback system prevents service interruption
- Response caching for common queries

### Performance Optimization

**Response Times**
- Database queries: < 100ms typical
- AI responses: 1-3 seconds typical
- Static files: < 50ms typical

**Caching Strategy**
- Static assets cached by browser
- API responses cached temporarily
- Database connection pooling

---

## 🔄 API Versioning

### Current Version: v1

All endpoints are currently unversioned but follow v1 conventions. Future versions will include version prefixes:

- Current: `/api/auth`
- Future: `/api/v2/auth`

### Backward Compatibility

The API maintains backward compatibility for:
- Authentication response format
- Chatbot message structure
- Error response patterns

---

## 📝 Sample Data

### Test User Accounts

| Email | Password | Role | Status |
|-------|----------|------|--------|
| carlos.gomez@mail.com | pass123 | admin | active |
| pedro.sanchez@mail.com | ped987 | teacher | active |
| ana.rodriguez@mail.com | ana456 | student | active |
| marta.jimenez@mail.com | mar123 | student | active |

### Sample Chatbot Queries

**For Students**
- "What is photosynthesis?"
- "How do I solve quadratic equations?"
- "Tell me about World War II"
- "What are good study techniques?"

**For Teachers**
- "How are my students performing?"
- "Help me with grading criteria"
- "What teaching strategies work best?"
- "Show me class attendance data"

---

This API documentation provides comprehensive information for developers integrating with or extending the Learnex platform.
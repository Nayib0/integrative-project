# Learnex - Educational Management Platform

## Overview
Learnex is a comprehensive educational web application that connects **parents, teachers, and students** in a unified environment. The platform enables assignment management, video calls, and integrates **AI-powered features** to encourage self-learning, educational management, and improved academic performance.

## 🚀 Key Features

### For Teachers
- **Assignment Management**: Create and assign tasks and activities
- **Automated Reporting**: Generate student performance reports automatically
- **Grade Overview**: View grades and overall class performance metrics
- **AI Recommendations**: Get AI-generated suggestions for supporting underperforming students
- **AI Chatbot**: Educational assistant for teaching support

### For Students
- **Online Assignments**: Access and complete assignments and activities online
- **Educational Video Calls**: Participate in virtual classes
- **AI-Powered Assistant**: Chat and voice-enabled AI tutor for academic questions
- **Course Recommendations**: Get personalized course suggestions based on performance
- **Learning Activities**: Receive customized learning activities for improvement
- **AI Chatbot**: Educational assistant for learning support

### For Parents
- **Performance Monitoring**: Track children's academic performance
- **Grade Reports**: Access detailed grade reports and learning progress
- **Teacher Communication**: Direct communication with teachers through the platform

### For Administrators
- **User Management**: Manage teachers, students, and parents
- **System Configuration**: Configure platform settings and parameters
- **Analytics Dashboard**: View institutional metrics and reports
- **Data Management**: Import/export data and system backups

## 🤖 Integrated Artificial Intelligence

### AI Chatbot Features
- **Role-Based Responses**: Customized responses for teachers and students
- **Educational Content**: Comprehensive knowledge base covering:
  - History (World War II, historical events)
  - Mathematics (Equations, algebra, formulas)
  - Sciences (Photosynthesis, physics, Newton's laws)
  - Study techniques and learning strategies
- **DeepSeek Integration**: Advanced AI capabilities with unlimited knowledge
- **Fallback System**: Local knowledge base when AI service is unavailable

### AI Capabilities
- **Personalized Recommendations**: Suggests courses and educational resources
- **Performance Analysis**: Detects students with poor performance and proposes improvement strategies
- **Educational Management Support**: Provides data analysis for educational decisions
- **Comprehensive Reports**: Facilitates teacher overview of group performance

## 🏗️ Technical Architecture

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with responsive design
- **JavaScript (ES6+)**: Interactive functionality and API integration
- **Font Awesome**: Icon library for UI elements

### Backend Technologies
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database management
- **Axios**: HTTP client for API requests

### AI Integration
- **DeepSeek API**: Advanced AI language model
- **Local Knowledge Base**: Fallback educational content
- **Role-Based AI**: Contextual responses based on user roles

## 📁 Project Structure

```
integrative-project/
│
├── backend/
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── auth.js             # Authentication system
│   │   ├── basic-functions.js  # Utility functions
│   │   ├── chatbot.js          # AI chatbot functionality
│   │   ├── server.js           # Express server configuration
│   │   ├── tests.js            # Testing utilities
│   │   └── index.js            # Entry point
│   │
│   └── css/
│       ├── chatbot.css         # Chatbot interface styles
│       ├── enterprise-styles.css # Enterprise UI components
│       ├── loading.css         # Loading animations
│       ├── modern-interface.css # Modern UI design
│       ├── responsive.css      # Mobile responsiveness
│       └── styles.css          # General styles
│
├── server/
│   ├── data/                   # CSV data files
│   │   ├── 01_users.csv
│   │   ├── 02_curses.csv
│   │   ├── 03_subjects.csv
│   │   ├── 04_curse_subject_teacher.csv
│   │   ├── 05_notes.csv
│   │   └── 06_students_curses.csv
│   │
│   └── seeders/                # Database seeders
│       ├── conexion_db.js      # Database connection
│       ├── load_*.js           # Data loading scripts
│       └── run_seeders.js      # Seeder execution
│
├── docs/
│   ├── estructura-navegacion.txt
│   ├── modelo-entidad-relacion.png
│   └── script.sql              # Database schema
│
├── .env                        # Environment variables
├── index.html                  # Main HTML file
├── package.json                # Node.js dependencies
└── README.md                   # Project documentation
```

## 🗄️ Database Schema

### Tables Overview
- **users**: User accounts (students, teachers, parents, admins)
- **curses**: Academic courses and grades
- **subjects**: Academic subjects
- **curse_subject_teacher**: Relationship between courses, subjects, and teachers
- **notes**: Student grades and evaluations
- **students_curses**: Student enrollment in courses

### Key Relationships
- Users can have multiple roles (student, teacher, parent, admin)
- Teachers are assigned to specific subject-course combinations
- Students are enrolled in multiple courses
- Grades are linked to specific student-subject-teacher combinations

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- DeepSeek API key (optional, for AI features)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd integrative-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb learnex
   
   # Run database schema
   psql -d learnex -f docs/script.sql
   
   # Load sample data
   node server/seeders/run_seeders.js
   ```

4. **Environment Configuration**
   ```bash
   # Edit .env file
   DEEPSEEK_API_KEY=your-deepseek-api-key-here
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open browser to `http://localhost:3000`

## 🔐 Authentication System

### User Roles & Permissions
- **Admin**: Full system access, user management, system configuration
- **Teacher**: Class management, grading, student monitoring, AI chatbot access
- **Student**: Assignment access, grade viewing, AI chatbot access
- **Parent**: Child monitoring, grade reports, teacher communication

### Sample Credentials
Based on the database seeding:
- **Admin**: `carlos.gomez@mail.com` / `pass123`
- **Teacher**: `pedro.sanchez@mail.com` / `ped987`
- **Student**: `ana.rodriguez@mail.com` / `ana456`

### Security Features
- Session-based authentication
- Role-based access control
- Encrypted session storage
- Automatic session timeout
- Route protection middleware

## 🤖 AI Chatbot Usage

### Availability
- **Teachers**: Full access to educational content and class management features
- **Students**: Full access to learning support and educational content
- **Admins/Parents**: No chatbot access (restricted)

### Supported Topics
- **History**: World War II, historical events and dates
- **Mathematics**: Equations, algebra, geometry, formulas
- **Sciences**: Biology, physics, chemistry concepts
- **Study Techniques**: Learning strategies, time management
- **Platform Navigation**: Help with system features

### Example Interactions
```
Student: "Tell me about World War II"
AI: "🌍 **World War II (1939-1945)**
📅 **Key dates:**
• Start: Sept 1, 1939 (Poland invasion)
• End: Sept 2, 1945 (Japan surrender)
..."

Teacher: "How are my students performing?"
AI: "👥 You have 32 active students. Class average is 4.1. 
Would you like to see progress for any specific student?"
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth` - User authentication
- `GET /api/test-db` - Database connection test

### Chatbot
- `POST /api/chatbot` - AI chatbot interaction

### Static Files
- `GET /` - Main application interface
- `GET /css/*` - Stylesheet files
- `GET /backend/js/*` - JavaScript modules

## 🧪 Testing

### Running Tests
```bash
# Access testing utilities through the interface
# Click the "🧪 Tests" button on the login screen
```

### Test Coverage
- Authentication system validation
- Database connection testing
- API endpoint verification
- UI component functionality

## 🔧 Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learnex
DB_USER=postgres
DB_PASSWORD=your_password

# AI Configuration
DEEPSEEK_API_KEY=your-deepseek-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database Configuration
Update PostgreSQL credentials in `server.js`:
```javascript
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'learnex',
    password: 'your_password',
    port: 5432,
});
```

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set production values for all environment variables
2. **Database**: Use production PostgreSQL instance
3. **Security**: Enable HTTPS and secure headers
4. **Performance**: Implement caching and optimization
5. **Monitoring**: Add logging and error tracking

### Deployment Steps
1. Build production assets
2. Configure production database
3. Set environment variables
4. Deploy to hosting platform
5. Configure domain and SSL

## 🤝 Contributing

### Development Guidelines
1. Follow existing code structure and naming conventions
2. Add comments for complex functionality
3. Test new features thoroughly
4. Update documentation for new features
5. Follow security best practices

### Code Style
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Follow consistent indentation (2 spaces)
- Use modern JavaScript features (ES6+)

## 📝 License

This project is developed as an educational platform prototype. All rights reserved.

## 📞 Support

For technical support or questions about the platform:
- Review the documentation
- Check the database schema in `docs/script.sql`
- Test API endpoints using the built-in testing tools
- Verify environment configuration

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with core functionality
- User authentication and role management
- AI chatbot integration with DeepSeek
- Database integration with PostgreSQL
- Responsive web interface
- Educational content management

---

**Learnex** - Empowering education through technology and artificial intelligence.
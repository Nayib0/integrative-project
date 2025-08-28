# Learnex API Endpoints Documentation

## 📋 Base URL
```
http://localhost:3000
```

## 🔐 Authentication Endpoints

### POST `/api/auth`
Authenticate user with email and password.

**Request Body:**
```json
{
  "username": "ana.rodriguez@mail.com",
  "password": "ana456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 2,
    "username": "ana.rodriguez@mail.com",
    "name": "Ana Rodriguez",
    "role": "student"
  }
}
```

### GET `/api/test-db`
Test database connection and return sample users.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id_user": 1,
      "name": "Carlos",
      "last_name": "Gomez",
      "mail": "carlos.gomez@mail.com",
      "rol": "admin",
      "state": "active"
    }
  ]
}
```

---

## 👥 User Management Endpoints

### GET `/api/users`
Get all users with optional role filter.

**Query Parameters:**
- `role` (optional): Filter by user role (admin, teacher, student, parent)

**Example:** `/api/users?role=student`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id_user": 2,
      "name": "Ana",
      "last_name": "Rodriguez",
      "mail": "ana.rodriguez@mail.com",
      "rol": "student",
      "state": "active"
    }
  ]
}
```

### POST `/api/users`
Create new user.

**Request Body:**
```json
{
  "name": "John",
  "last_name": "Doe",
  "mail": "john.doe@mail.com",
  "password": "password123",
  "rol": "student"
}
```

### PUT `/api/users/:id`
Update user information.

**Request Body:**
```json
{
  "name": "John",
  "last_name": "Smith",
  "mail": "john.smith@mail.com",
  "rol": "student",
  "state": "active"
}
```

---

## 🎓 Student Management Endpoints

### GET `/api/students`
Get all active students with course information.

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id_user": 2,
      "name": "Ana",
      "last_name": "Rodriguez",
      "mail": "ana.rodriguez@mail.com",
      "grade": "10°A",
      "school_year": 2024
    }
  ]
}
```

### GET `/api/students/:id/grades`
Get all grades for a specific student.

**Example:** `/api/students/2/grades`

**Response:**
```json
{
  "success": true,
  "grades": [
    {
      "id_note": 1,
      "id_student": 2,
      "calification": 4.5,
      "name_subject": "Mathematics",
      "teacher_name": "Pedro",
      "teacher_lastname": "Sanchez"
    }
  ]
}
```

---

## 👨‍🏫 Teacher Management Endpoints

### GET `/api/teachers`
Get all active teachers.

**Response:**
```json
{
  "success": true,
  "teachers": [
    {
      "id_user": 7,
      "name": "Pedro",
      "last_name": "Sanchez",
      "mail": "pedro.sanchez@mail.com"
    }
  ]
}
```

### GET `/api/teachers/:id/subjects`
Get subjects taught by a specific teacher.

**Example:** `/api/teachers/7/subjects`

**Response:**
```json
{
  "success": true,
  "subjects": [
    {
      "id_subjects": 1,
      "name_subject": "Mathematics",
      "grade": "10°A",
      "school_year": 2024
    }
  ]
}
```

---

## 📊 Grade Management Endpoints

### GET `/api/grades`
Get all grades with optional filters.

**Query Parameters:**
- `student_id` (optional): Filter by student ID
- `teacher_id` (optional): Filter by teacher ID
- `subject_id` (optional): Filter by subject ID

**Example:** `/api/grades?student_id=2`

**Response:**
```json
{
  "success": true,
  "grades": [
    {
      "id_note": 1,
      "calification": 4.5,
      "name_subject": "Mathematics",
      "student_name": "Ana",
      "student_lastname": "Rodriguez",
      "teacher_name": "Pedro",
      "teacher_lastname": "Sanchez"
    }
  ]
}
```

### POST `/api/grades`
Create new grade entry.

**Request Body:**
```json
{
  "id_student": 2,
  "id_cst": 1,
  "calification": 4.5
}
```

**Response:**
```json
{
  "success": true,
  "grade": {
    "id_note": 10,
    "id_student": 2,
    "id_cst": 1,
    "calification": 4.5
  }
}
```

### PUT `/api/grades/:id`
Update existing grade.

**Request Body:**
```json
{
  "calification": 4.8
}
```

---

## 📚 Subject Management Endpoints

### GET `/api/subjects`
Get all subjects.

**Response:**
```json
{
  "success": true,
  "subjects": [
    {
      "id_subjects": 1,
      "name_subject": "Mathematics"
    },
    {
      "id_subjects": 2,
      "name_subject": "Spanish"
    }
  ]
}
```

### POST `/api/subjects`
Create new subject.

**Request Body:**
```json
{
  "name_subject": "Physics"
}
```

---

## 🏫 Course Management Endpoints

### GET `/api/courses`
Get all courses.

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id_curse": 1,
      "grade": "10°A",
      "school_year": 2024
    }
  ]
}
```

### POST `/api/courses`
Create new course.

**Request Body:**
```json
{
  "grade": "11°B",
  "school_year": 2024
}
```

---

## 📈 Analytics Endpoints

### GET `/api/analytics`
Get system analytics and statistics.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalStudents": 8,
    "totalTeachers": 3,
    "averageGrade": "4.2",
    "totalGrades": 15
  }
}
```

### GET `/api/analytics/performance`
Get performance analytics by subject.

**Response:**
```json
{
  "success": true,
  "performance": {
    "bySubject": [
      {
        "name_subject": "Mathematics",
        "avg_grade": "4.5",
        "total_grades": "5"
      },
      {
        "name_subject": "Spanish",
        "avg_grade": "4.2",
        "total_grades": "4"
      }
    ]
  }
}
```

---

## 🤖 Chatbot Endpoint

### POST `/api/chatbot`
Process user messages through AI chatbot.

**Request Body:**
```json
{
  "message": "Tell me about World War II",
  "userRole": "student"
}
```

**Response:**
```json
{
  "response": "🌍 **World War II (1939-1945)**\n\n📅 **Key dates:**\n• Start: Sept 1, 1939 (Poland invasion)\n• End: Sept 2, 1945 (Japan surrender)\n\n⚔️ **Main sides:**\n• Allies: United Kingdom, USSR, USA, France\n• Axis: Germany, Italy, Japan\n\n🔥 **Important events:**\n• Pearl Harbor (1941)\n• D-Day Normandy Landing (1944)\n• Atomic bombs (Hiroshima and Nagasaki)\n\nWould you like to know about any specific aspect?"
}
```

---

## 🧪 Testing Examples

### Using cURL

**Test Authentication:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"username":"ana.rodriguez@mail.com","password":"ana456"}'
```

**Get Students:**
```bash
curl http://localhost:3000/api/students
```

**Get Analytics:**
```bash
curl http://localhost:3000/api/analytics
```

**Create Grade:**
```bash
curl -X POST http://localhost:3000/api/grades \
  -H "Content-Type: application/json" \
  -d '{"id_student":2,"id_cst":1,"calification":4.5}'
```

### Using JavaScript Fetch

**Get Student Grades:**
```javascript
async function getStudentGrades(studentId) {
  const response = await fetch(`/api/students/${studentId}/grades`);
  const data = await response.json();
  
  if (data.success) {
    console.log('Student grades:', data.grades);
  } else {
    console.error('Error:', data.error);
  }
}

getStudentGrades(2);
```

**Create New User:**
```javascript
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  return result;
}

const newUser = {
  name: 'Jane',
  last_name: 'Smith',
  mail: 'jane.smith@mail.com',
  password: 'password123',
  rol: 'student'
};

createUser(newUser).then(result => {
  console.log('User created:', result);
});
```

---

## 🔒 Error Handling

All endpoints return consistent error responses:

**Database Error:**
```json
{
  "success": false,
  "error": "relation \"users\" does not exist"
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": "Invalid input parameters"
}
```

**Not Found Error:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

---

## 📊 HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success (includes application-level errors) |
| 404 | Endpoint not found |
| 500 | Internal server error |

---

## 🔧 Query Parameters Summary

| Endpoint | Parameters | Description |
|----------|------------|-------------|
| `/api/users` | `role` | Filter users by role |
| `/api/grades` | `student_id`, `teacher_id`, `subject_id` | Filter grades |

---

## 📝 Sample Test Data

### Test User Accounts
| Email | Password | Role | ID |
|-------|----------|------|-----|
| carlos.gomez@mail.com | pass123 | admin | 1 |
| ana.rodriguez@mail.com | ana456 | student | 2 |
| pedro.sanchez@mail.com | ped987 | teacher | 7 |
| marta.jimenez@mail.com | mar123 | student | 4 |

### Sample API Calls
```javascript
// Get all students
fetch('/api/students')

// Get specific student's grades
fetch('/api/students/2/grades')

// Get analytics
fetch('/api/analytics')

// Get teachers
fetch('/api/teachers')

// Get subjects
fetch('/api/subjects')
```

This comprehensive endpoint documentation provides all the information needed to interact with the Learnex API effectively.
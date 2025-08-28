# Integrative Project – Learnex

This project is an **educational web application** that connects **parents, teachers, and students** in a single environment.
The platform allows for assignments, video calls, and also integrates **AI** that encourages self-learning, educational management, and improved academic performance.

## Key Features

### For Teachers
- Assignment of assignments and activities.
- Automatic reporting of student performance.
- Viewing of grades and overall class performance.
- AI-generated recommendations on how to support underperforming students.

### For Students
- Access to online assignments and activities.
- Educational video calls for virtual classes.
- AI-powered assistant in the form of **chat and voice** that answers academic questions.
- Recommendation of additional courses based on performance.
- Suggestion of personalized learning activities to improve in specific areas.

### For Parents
- Monitor your children's academic performance.
- Access grade reports and learning progress.
- Direct communication with teachers through the platform.

### Integrated Artificial Intelligence
- Recommends personalized courses and educational resources.
- Detects students with **poor performance** and proposes improvement strategies.
- Provides support for educational management with data analysis.
- Facilitates reports so teachers have an **overview of the group**.

---

## Project Structure

INTEGRATIVE-PROJECT/
│
├── .vscode/
│ └── settings.json
│
├── backend/
│ ├── js/
│ │ ├── app.js
│ │ ├── auth.js
│ │ ├── basic-functions.js
│ │ ├── chatbot.js
│ │ ├── server.js
│ │ ├── tests.js
│ │ └── index.js
│ │
│ └── css/
│ ├── chatbot.css
│ ├── enterprise-styles.css
│ ├── loading.css
│ ├── modern-interface.css
│ ├── responsive.css
│ └── styles.css
│
├── docs/
│ ├── estructura-navegacion.txt
│ ├── modelo-entidad-relacion.png
│ └── script.sql
│
├── node_modules/
│
├── server/
│ ├── data/
│ │ ├── 01_users.csv
│ │ ├── 02_curses.csv
│ │ ├── 03_subjects.csv
│ │ ├── 04_curse_subject_teacher.csv
│ │ ├── 05_notes.csv
│ │ └── 06_students_curses.csv
│ │
│ └── seeders/
│ ├── load_curse_subject_teacher.js
│ ├── load_curses.js
│ ├── load_notes.js
│ ├── load_students_curses.js
│ ├── load_subjects.js
│ ├── load_users.js
│ ├── run_seeders.js
│ └── conexion_db.js
│
├── .env
├── index.html
├── package-lock.json
├── package.json
└── README.md
---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Express)
- **Database:** SQL (structure and scripts in `/docs`)
- **AI:** Recommendation engine and chatbot (text + voice)
- **Video calls:** Integration with real-time communication services
- **Storage:** Management of users, tasks, and grades in a database

---

## Example of Interaction with AI

A student with poor math performance receives:
- A recommendation for an **additional reinforcement course**.
- A series of personalized **learning activities**.
- Chat or voice support to resolve any questions.

The teacher receives:
- A **general report** showing that 30% of students have poor math performance.
- Suggestions on how to approach new classroom activities.

---

## Project Objectives

- Improve **interaction between parents, teachers, and students**.
- Encourage **self-learning** through AI.
- Facilitate **academic management** and performance monitoring.
- Provide a modern, interactive, and efficient educational environment.

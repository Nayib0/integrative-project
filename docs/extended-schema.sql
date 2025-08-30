-- ==========================
-- EXTENDED SCHEMA FOR LEARNEX
-- ==========================

-- EXISTING TABLES (from original script.sql)
-- users, curses, subjects, curse_subject_teacher, notes, students_curses

-- ==========================
-- 1. TASKS/ASSIGNMENTS SYSTEM
-- ==========================

CREATE TABLE learnex.tasks (
    id_task SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    id_teacher INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    id_cst INT NOT NULL REFERENCES learnex.curse_subject_teacher(id_cst) ON DELETE CASCADE,
    due_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    max_score NUMERIC(3,1) DEFAULT 5.0,
    status VARCHAR(20) DEFAULT 'active',
    allow_files BOOLEAN DEFAULT true
);

CREATE TABLE learnex.task_submissions (
    id_submission SERIAL PRIMARY KEY,
    id_task INT NOT NULL REFERENCES learnex.tasks(id_task) ON DELETE CASCADE,
    id_student INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    content TEXT,
    file_path VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score NUMERIC(3,1),
    feedback TEXT,
    status VARCHAR(20) DEFAULT 'submitted'
);

-- ==========================
-- 2. MESSAGING SYSTEM
-- ==========================

CREATE TABLE learnex.conversations (
    id_conversation SERIAL PRIMARY KEY,
    title VARCHAR(200),
    type VARCHAR(20) DEFAULT 'private', -- private, group
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learnex.conversation_participants (
    id_participant SERIAL PRIMARY KEY,
    id_conversation INT NOT NULL REFERENCES learnex.conversations(id_conversation) ON DELETE CASCADE,
    id_user INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(20) DEFAULT 'member' -- admin, member
);

CREATE TABLE learnex.messages (
    id_message SERIAL PRIMARY KEY,
    id_conversation INT NOT NULL REFERENCES learnex.conversations(id_conversation) ON DELETE CASCADE,
    id_sender INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, file, image
    file_path VARCHAR(500),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_by JSONB DEFAULT '[]'
);

-- ==========================
-- 3. EVALUATIONS SYSTEM
-- ==========================

CREATE TABLE learnex.exams (
    id_exam SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    id_teacher INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    id_cst INT NOT NULL REFERENCES learnex.curse_subject_teacher(id_cst) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL,
    total_score NUMERIC(5,2) DEFAULT 100.0,
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, finished
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learnex.questions (
    id_question SERIAL PRIMARY KEY,
    id_exam INT NOT NULL REFERENCES learnex.exams(id_exam) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL, -- multiple_choice, true_false, short_answer
    options JSONB, -- for multiple choice questions
    correct_answer TEXT NOT NULL,
    points NUMERIC(4,2) DEFAULT 1.0,
    order_num INT NOT NULL
);

CREATE TABLE learnex.exam_attempts (
    id_attempt SERIAL PRIMARY KEY,
    id_exam INT NOT NULL REFERENCES learnex.exams(id_exam) ON DELETE CASCADE,
    id_student INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP,
    total_score NUMERIC(5,2),
    status VARCHAR(20) DEFAULT 'in_progress' -- in_progress, completed, timeout
);

CREATE TABLE learnex.student_answers (
    id_answer SERIAL PRIMARY KEY,
    id_attempt INT NOT NULL REFERENCES learnex.exam_attempts(id_attempt) ON DELETE CASCADE,
    id_question INT NOT NULL REFERENCES learnex.questions(id_question) ON DELETE CASCADE,
    answer_text TEXT,
    is_correct BOOLEAN,
    points_earned NUMERIC(4,2) DEFAULT 0.0
);

-- ==========================
-- 4. SCHEDULE SYSTEM
-- ==========================

CREATE TABLE learnex.schedules (
    id_schedule SERIAL PRIMARY KEY,
    id_cst INT NOT NULL REFERENCES learnex.curse_subject_teacher(id_cst) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    classroom VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learnex.events (
    id_event SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- class, meeting, exam, holiday
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    id_creator INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    participants JSONB DEFAULT '[]', -- array of user IDs
    location VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 5. GAMIFICATION SYSTEM
-- ==========================

CREATE TABLE learnex.achievements (
    id_achievement SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    points INT DEFAULT 0,
    criteria JSONB, -- conditions to unlock
    category VARCHAR(50), -- academic, participation, attendance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learnex.student_achievements (
    id_student_achievement SERIAL PRIMARY KEY,
    id_student INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    id_achievement INT NOT NULL REFERENCES learnex.achievements(id_achievement) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    points_earned INT DEFAULT 0
);

CREATE TABLE learnex.student_points (
    id_student_points SERIAL PRIMARY KEY,
    id_student INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    total_points INT DEFAULT 0,
    level_name VARCHAR(50) DEFAULT 'Beginner',
    level_number INT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 6. NOTIFICATIONS SYSTEM
-- ==========================

CREATE TABLE learnex.notifications (
    id_notification SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- task_due, new_message, grade_posted, achievement
    related_id INT, -- ID of related entity (task, message, etc.)
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 7. ANALYTICS SYSTEM
-- ==========================

CREATE TABLE learnex.analytics_logs (
    id_log SERIAL PRIMARY KEY,
    id_user INT REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- task, exam, message, etc.
    entity_id INT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- 8. FILE MANAGEMENT
-- ==========================

CREATE TABLE learnex.files (
    id_file SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    id_uploader INT NOT NULL REFERENCES learnex.users(id_user) ON DELETE CASCADE,
    entity_type VARCHAR(50), -- task_submission, message, profile
    entity_id INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- INDEXES FOR PERFORMANCE
-- ==========================

CREATE INDEX idx_tasks_teacher ON learnex.tasks(id_teacher);
CREATE INDEX idx_tasks_due_date ON learnex.tasks(due_date);
CREATE INDEX idx_submissions_task ON learnex.task_submissions(id_task);
CREATE INDEX idx_submissions_student ON learnex.task_submissions(id_student);
CREATE INDEX idx_messages_conversation ON learnex.messages(id_conversation);
CREATE INDEX idx_messages_sender ON learnex.messages(id_sender);
CREATE INDEX idx_notifications_user ON learnex.notifications(id_user);
CREATE INDEX idx_notifications_read ON learnex.notifications(is_read);
CREATE INDEX idx_analytics_user ON learnex.analytics_logs(id_user);
CREATE INDEX idx_analytics_created ON learnex.analytics_logs(created_at);
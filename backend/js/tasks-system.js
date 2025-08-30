/**
 * Tasks/Assignments System for Learnex
 * Handles task creation, submission, grading, and file management
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/tasks');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

class TasksSystem {
    constructor(pool) {
        this.pool = pool;
    }

    // Create new task
    async createTask(taskData) {
        const { title, description, id_teacher, id_cst, due_date, max_score, allow_files } = taskData;
        
        try {
            const result = await this.pool.query(
                `INSERT INTO learnex.tasks (title, description, id_teacher, id_cst, due_date, max_score, allow_files)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [title, description, id_teacher, id_cst, due_date, max_score, allow_files]
            );
            
            // Create notifications for students
            await this.notifyStudentsNewTask(result.rows[0]);
            
            return { success: true, task: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get tasks for teacher
    async getTeacherTasks(teacherId) {
        try {
            const result = await this.pool.query(
                `SELECT t.*, s.name_subject, c.grade, c.school_year,
                        COUNT(ts.id_submission) as submissions_count,
                        COUNT(CASE WHEN ts.score IS NOT NULL THEN 1 END) as graded_count
                 FROM learnex.tasks t
                 JOIN learnex.curse_subject_teacher cst ON t.id_cst = cst.id_cst
                 JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                 JOIN learnex.curses c ON cst.id_curse = c.id_curse
                 LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task
                 WHERE t.id_teacher = $1
                 GROUP BY t.id_task, s.name_subject, c.grade, c.school_year
                 ORDER BY t.due_date DESC`,
                [teacherId]
            );
            
            return { success: true, tasks: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get tasks for student
    async getStudentTasks(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT t.*, s.name_subject, u.name as teacher_name,
                        ts.id_submission, ts.submitted_at, ts.score, ts.feedback, ts.status as submission_status
                 FROM learnex.tasks t
                 JOIN learnex.curse_subject_teacher cst ON t.id_cst = cst.id_cst
                 JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                 JOIN learnex.users u ON cst.id_teacher = u.id_user
                 JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
                 LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task AND ts.id_student = $1
                 WHERE sc.id_user = $1 AND t.status = 'active'
                 ORDER BY t.due_date ASC`,
                [studentId]
            );
            
            return { success: true, tasks: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Submit task
    async submitTask(submissionData, file = null) {
        const { id_task, id_student, content } = submissionData;
        
        try {
            // Check if already submitted
            const existing = await this.pool.query(
                'SELECT id_submission FROM learnex.task_submissions WHERE id_task = $1 AND id_student = $2',
                [id_task, id_student]
            );
            
            if (existing.rows.length > 0) {
                return { success: false, error: 'Task already submitted' };
            }
            
            const file_path = file ? file.path : null;
            
            const result = await this.pool.query(
                `INSERT INTO learnex.task_submissions (id_task, id_student, content, file_path)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [id_task, id_student, content, file_path]
            );
            
            // Notify teacher
            await this.notifyTeacherNewSubmission(result.rows[0]);
            
            return { success: true, submission: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Grade submission
    async gradeSubmission(submissionId, score, feedback) {
        try {
            const result = await this.pool.query(
                `UPDATE learnex.task_submissions 
                 SET score = $1, feedback = $2, status = 'graded'
                 WHERE id_submission = $3 RETURNING *`,
                [score, feedback, submissionId]
            );
            
            if (result.rows.length > 0) {
                // Notify student
                await this.notifyStudentGraded(result.rows[0]);
                return { success: true, submission: result.rows[0] };
            }
            
            return { success: false, error: 'Submission not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get task submissions for teacher
    async getTaskSubmissions(taskId) {
        try {
            const result = await this.pool.query(
                `SELECT ts.*, u.name, u.last_name, u.mail
                 FROM learnex.task_submissions ts
                 JOIN learnex.users u ON ts.id_student = u.id_user
                 WHERE ts.id_task = $1
                 ORDER BY ts.submitted_at DESC`,
                [taskId]
            );
            
            return { success: true, submissions: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Auto-grade simple tasks (basic implementation)
    async autoGradeTask(taskId) {
        try {
            // Get task and submissions
            const task = await this.pool.query('SELECT * FROM learnex.tasks WHERE id_task = $1', [taskId]);
            const submissions = await this.pool.query(
                'SELECT * FROM learnex.task_submissions WHERE id_task = $1 AND score IS NULL',
                [taskId]
            );
            
            if (task.rows.length === 0) {
                return { success: false, error: 'Task not found' };
            }
            
            // Simple auto-grading logic (can be enhanced with AI)
            for (const submission of submissions.rows) {
                let score = 0;
                
                // Basic scoring based on content length and submission time
                if (submission.content && submission.content.length > 50) {
                    score = Math.min(task.rows[0].max_score, 4.0);
                } else if (submission.content && submission.content.length > 20) {
                    score = Math.min(task.rows[0].max_score, 3.0);
                } else {
                    score = Math.min(task.rows[0].max_score, 2.0);
                }
                
                // Bonus for early submission
                const dueDate = new Date(task.rows[0].due_date);
                const submittedDate = new Date(submission.submitted_at);
                if (submittedDate < dueDate) {
                    score = Math.min(task.rows[0].max_score, score + 0.5);
                }
                
                await this.gradeSubmission(submission.id_submission, score, 'Auto-graded based on content and timeliness');
            }
            
            return { success: true, message: `Auto-graded ${submissions.rows.length} submissions` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Notification helpers
    async notifyStudentsNewTask(task) {
        try {
            // Get students in the course
            const students = await this.pool.query(
                `SELECT DISTINCT sc.id_user
                 FROM learnex.students_curses sc
                 JOIN learnex.curse_subject_teacher cst ON sc.id_curse = cst.id_curse
                 WHERE cst.id_cst = $1`,
                [task.id_cst]
            );
            
            // Create notifications
            for (const student of students.rows) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        student.id_user,
                        'Nueva Tarea Asignada',
                        `Se ha asignado la tarea: ${task.title}`,
                        'task_assigned',
                        task.id_task
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating notifications:', error);
        }
    }

    async notifyTeacherNewSubmission(submission) {
        try {
            const task = await this.pool.query('SELECT * FROM learnex.tasks WHERE id_task = $1', [submission.id_task]);
            const student = await this.pool.query('SELECT name, last_name FROM learnex.users WHERE id_user = $1', [submission.id_student]);
            
            if (task.rows.length > 0 && student.rows.length > 0) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        task.rows[0].id_teacher,
                        'Nueva Entrega de Tarea',
                        `${student.rows[0].name} ${student.rows[0].last_name} ha entregado: ${task.rows[0].title}`,
                        'task_submitted',
                        submission.id_submission
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating teacher notification:', error);
        }
    }

    async notifyStudentGraded(submission) {
        try {
            const task = await this.pool.query('SELECT title FROM learnex.tasks WHERE id_task = $1', [submission.id_task]);
            
            if (task.rows.length > 0) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        submission.id_student,
                        'Tarea Calificada',
                        `Tu tarea "${task.rows[0].title}" ha sido calificada: ${submission.score}`,
                        'task_graded',
                        submission.id_submission
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating student notification:', error);
        }
    }

    // Check for due tasks and send reminders
    async checkDueTasks() {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const dueTasks = await this.pool.query(
                `SELECT t.*, sc.id_user as student_id
                 FROM learnex.tasks t
                 JOIN learnex.curse_subject_teacher cst ON t.id_cst = cst.id_cst
                 JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
                 LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task AND ts.id_student = sc.id_user
                 WHERE t.due_date::date = $1 AND ts.id_submission IS NULL AND t.status = 'active'`,
                [tomorrow.toISOString().split('T')[0]]
            );
            
            for (const task of dueTasks.rows) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        task.student_id,
                        'Recordatorio de Tarea',
                        `La tarea "${task.title}" vence mañana`,
                        'task_due_reminder',
                        task.id_task
                    ]
                );
            }
            
            return { success: true, reminders_sent: dueTasks.rows.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = { TasksSystem, upload };
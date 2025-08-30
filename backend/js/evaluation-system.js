/**
 * Evaluation System for Learnex
 * Online exams, question bank, auto-grading, results analysis
 */

class EvaluationSystem {
    constructor(pool) {
        this.pool = pool;
    }

    // Create new exam
    async createExam(examData) {
        const { title, description, id_teacher, id_cst, start_time, end_time, duration_minutes, total_score } = examData;
        
        try {
            const result = await this.pool.query(
                `INSERT INTO learnex.exams (title, description, id_teacher, id_cst, start_time, end_time, duration_minutes, total_score)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [title, description, id_teacher, id_cst, start_time, end_time, duration_minutes, total_score]
            );
            
            return { success: true, exam: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Add question to exam
    async addQuestion(questionData) {
        const { id_exam, question_text, question_type, options, correct_answer, points, order_num } = questionData;
        
        try {
            const result = await this.pool.query(
                `INSERT INTO learnex.questions (id_exam, question_text, question_type, options, correct_answer, points, order_num)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [id_exam, question_text, question_type, JSON.stringify(options), correct_answer, points, order_num]
            );
            
            return { success: true, question: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get teacher's exams
    async getTeacherExams(teacherId) {
        try {
            const result = await this.pool.query(
                `SELECT e.*, s.name_subject, c.grade, c.school_year,
                        COUNT(q.id_question) as question_count,
                        COUNT(ea.id_attempt) as attempt_count,
                        COUNT(CASE WHEN ea.status = 'completed' THEN 1 END) as completed_count
                 FROM learnex.exams e
                 JOIN learnex.curse_subject_teacher cst ON e.id_cst = cst.id_cst
                 JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                 JOIN learnex.curses c ON cst.id_curse = c.id_curse
                 LEFT JOIN learnex.questions q ON e.id_exam = q.id_exam
                 LEFT JOIN learnex.exam_attempts ea ON e.id_exam = ea.id_exam
                 WHERE e.id_teacher = $1
                 GROUP BY e.id_exam, s.name_subject, c.grade, c.school_year
                 ORDER BY e.created_at DESC`,
                [teacherId]
            );
            
            return { success: true, exams: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get available exams for student
    async getStudentExams(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT e.*, s.name_subject, u.name as teacher_name,
                        ea.id_attempt, ea.started_at, ea.finished_at, ea.total_score as student_score, ea.status as attempt_status,
                        COUNT(q.id_question) as question_count
                 FROM learnex.exams e
                 JOIN learnex.curse_subject_teacher cst ON e.id_cst = cst.id_cst
                 JOIN learnex.subjects s ON cst.id_subject = s.id_subjects
                 JOIN learnex.users u ON cst.id_teacher = u.id_user
                 JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
                 LEFT JOIN learnex.questions q ON e.id_exam = q.id_exam
                 LEFT JOIN learnex.exam_attempts ea ON e.id_exam = ea.id_exam AND ea.id_student = $1
                 WHERE sc.id_user = $1 AND e.status IN ('active', 'finished')
                 GROUP BY e.id_exam, s.name_subject, u.name, ea.id_attempt, ea.started_at, ea.finished_at, ea.total_score, ea.status
                 ORDER BY e.start_time DESC`,
                [studentId]
            );
            
            return { success: true, exams: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Start exam attempt
    async startExamAttempt(examId, studentId) {
        try {
            // Check if exam is available
            const exam = await this.pool.query(
                'SELECT * FROM learnex.exams WHERE id_exam = $1 AND status = $2 AND start_time <= NOW() AND end_time > NOW()',
                [examId, 'active']
            );
            
            if (exam.rows.length === 0) {
                return { success: false, error: 'Exam not available' };
            }
            
            // Check if student already has an attempt
            const existingAttempt = await this.pool.query(
                'SELECT id_attempt FROM learnex.exam_attempts WHERE id_exam = $1 AND id_student = $2',
                [examId, studentId]
            );
            
            if (existingAttempt.rows.length > 0) {
                return { success: false, error: 'Exam already attempted' };
            }
            
            // Create attempt
            const attempt = await this.pool.query(
                'INSERT INTO learnex.exam_attempts (id_exam, id_student) VALUES ($1, $2) RETURNING *',
                [examId, studentId]
            );
            
            // Get questions
            const questions = await this.pool.query(
                'SELECT id_question, question_text, question_type, options, points, order_num FROM learnex.questions WHERE id_exam = $1 ORDER BY order_num',
                [examId]
            );
            
            return { 
                success: true, 
                attempt: attempt.rows[0], 
                questions: questions.rows,
                exam: exam.rows[0]
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Submit answer
    async submitAnswer(attemptId, questionId, answerText) {
        try {
            // Get question details
            const question = await this.pool.query(
                'SELECT correct_answer, points, question_type FROM learnex.questions WHERE id_question = $1',
                [questionId]
            );
            
            if (question.rows.length === 0) {
                return { success: false, error: 'Question not found' };
            }
            
            const { correct_answer, points, question_type } = question.rows[0];
            
            // Check if answer is correct
            let isCorrect = false;
            let pointsEarned = 0;
            
            if (question_type === 'multiple_choice' || question_type === 'true_false') {
                isCorrect = answerText.toLowerCase().trim() === correct_answer.toLowerCase().trim();
                pointsEarned = isCorrect ? points : 0;
            } else if (question_type === 'short_answer') {
                // Simple text matching - can be enhanced with fuzzy matching
                isCorrect = answerText.toLowerCase().includes(correct_answer.toLowerCase());
                pointsEarned = isCorrect ? points : points * 0.5; // Partial credit
            }
            
            // Insert or update answer
            const result = await this.pool.query(
                `INSERT INTO learnex.student_answers (id_attempt, id_question, answer_text, is_correct, points_earned)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id_attempt, id_question) 
                 DO UPDATE SET answer_text = $3, is_correct = $4, points_earned = $5
                 RETURNING *`,
                [attemptId, questionId, answerText, isCorrect, pointsEarned]
            );
            
            return { success: true, answer: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Finish exam attempt
    async finishExamAttempt(attemptId) {
        try {
            // Calculate total score
            const scoreResult = await this.pool.query(
                'SELECT SUM(points_earned) as total_score FROM learnex.student_answers WHERE id_attempt = $1',
                [attemptId]
            );
            
            const totalScore = scoreResult.rows[0].total_score || 0;
            
            // Update attempt
            const result = await this.pool.query(
                `UPDATE learnex.exam_attempts 
                 SET finished_at = NOW(), total_score = $1, status = 'completed'
                 WHERE id_attempt = $2 RETURNING *`,
                [totalScore, attemptId]
            );
            
            if (result.rows.length > 0) {
                // Create grade record
                const attempt = result.rows[0];
                const exam = await this.pool.query('SELECT id_cst, total_score FROM learnex.exams WHERE id_exam = $1', [attempt.id_exam]);
                
                if (exam.rows.length > 0) {
                    const gradeValue = (totalScore / exam.rows[0].total_score) * 5.0; // Convert to 5.0 scale
                    
                    await this.pool.query(
                        'INSERT INTO learnex.notes (id_student, id_cst, calification) VALUES ($1, $2, $3)',
                        [attempt.id_student, exam.rows[0].id_cst, gradeValue]
                    );
                }
                
                // Notify student
                await this.notifyExamCompleted(attempt);
                
                return { success: true, attempt: result.rows[0], totalScore };
            }
            
            return { success: false, error: 'Attempt not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get exam results for teacher
    async getExamResults(examId) {
        try {
            const results = await this.pool.query(
                `SELECT ea.*, u.name, u.last_name, u.mail,
                        COUNT(sa.id_answer) as answered_questions,
                        COUNT(CASE WHEN sa.is_correct THEN 1 END) as correct_answers,
                        e.total_score as max_score
                 FROM learnex.exam_attempts ea
                 JOIN learnex.users u ON ea.id_student = u.id_user
                 JOIN learnex.exams e ON ea.id_exam = e.id_exam
                 LEFT JOIN learnex.student_answers sa ON ea.id_attempt = sa.id_attempt
                 WHERE ea.id_exam = $1
                 GROUP BY ea.id_attempt, u.name, u.last_name, u.mail, e.total_score
                 ORDER BY ea.total_score DESC NULLS LAST`,
                [examId]
            );
            
            return { success: true, results: results.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get detailed exam analysis
    async getExamAnalysis(examId) {
        try {
            const [examInfo, questionAnalysis, studentPerformance] = await Promise.all([
                this.getExamInfo(examId),
                this.getQuestionAnalysis(examId),
                this.getStudentPerformanceAnalysis(examId)
            ]);
            
            return {
                success: true,
                analysis: {
                    examInfo: examInfo.rows[0],
                    questionAnalysis: questionAnalysis.rows,
                    studentPerformance: studentPerformance.rows,
                    statistics: await this.calculateExamStatistics(examId)
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Question analysis
    async getQuestionAnalysis(examId) {
        return await this.pool.query(
            `SELECT q.*, 
                    COUNT(sa.id_answer) as total_answers,
                    COUNT(CASE WHEN sa.is_correct THEN 1 END) as correct_answers,
                    ROUND(COUNT(CASE WHEN sa.is_correct THEN 1 END)::numeric / NULLIF(COUNT(sa.id_answer), 0) * 100, 2) as success_rate
             FROM learnex.questions q
             LEFT JOIN learnex.student_answers sa ON q.id_question = sa.id_question
             WHERE q.id_exam = $1
             GROUP BY q.id_question
             ORDER BY q.order_num`,
            [examId]
        );
    }

    // Calculate exam statistics
    async calculateExamStatistics(examId) {
        const stats = await this.pool.query(
            `SELECT 
                COUNT(ea.id_attempt) as total_attempts,
                COUNT(CASE WHEN ea.status = 'completed' THEN 1 END) as completed_attempts,
                AVG(ea.total_score) as average_score,
                MIN(ea.total_score) as min_score,
                MAX(ea.total_score) as max_score,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ea.total_score) as median_score
             FROM learnex.exam_attempts ea
             WHERE ea.id_exam = $1 AND ea.status = 'completed'`,
            [examId]
        );
        
        return stats.rows[0];
    }

    // Auto-grade essay questions (basic implementation)
    async autoGradeEssays(examId) {
        try {
            const essays = await this.pool.query(
                `SELECT sa.*, q.correct_answer, q.points
                 FROM learnex.student_answers sa
                 JOIN learnex.questions q ON sa.id_question = q.id_question
                 JOIN learnex.exam_attempts ea ON sa.id_attempt = ea.id_attempt
                 WHERE ea.id_exam = $1 AND q.question_type = 'short_answer' AND sa.points_earned IS NULL`,
                [examId]
            );
            
            for (const essay of essays.rows) {
                // Simple keyword-based grading
                const keywords = essay.correct_answer.toLowerCase().split(' ');
                const studentText = essay.answer_text.toLowerCase();
                
                let matchCount = 0;
                keywords.forEach(keyword => {
                    if (studentText.includes(keyword)) matchCount++;
                });
                
                const score = (matchCount / keywords.length) * essay.points;
                
                await this.pool.query(
                    'UPDATE learnex.student_answers SET points_earned = $1, is_correct = $2 WHERE id_answer = $3',
                    [score, score > essay.points * 0.6, essay.id_answer]
                );
            }
            
            return { success: true, graded: essays.rows.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Question bank management
    async createQuestionBank(teacherId, subject, questions) {
        try {
            // This would store questions for reuse across multiple exams
            // Implementation would depend on specific requirements
            return { success: true, message: 'Question bank feature to be implemented' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Notification helper
    async notifyExamCompleted(attempt) {
        try {
            await this.pool.query(
                `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    attempt.id_student,
                    'Examen Completado',
                    `Has completado el examen. Puntuación: ${attempt.total_score}`,
                    'exam_completed',
                    attempt.id_exam
                ]
            );
        } catch (error) {
            console.error('Error creating exam notification:', error);
        }
    }

    // Helper methods
    async getExamInfo(examId) {
        return await this.pool.query(
            'SELECT e.*, s.name_subject, c.grade FROM learnex.exams e JOIN learnex.curse_subject_teacher cst ON e.id_cst = cst.id_cst JOIN learnex.subjects s ON cst.id_subject = s.id_subjects JOIN learnex.curses c ON cst.id_curse = c.id_curse WHERE e.id_exam = $1',
            [examId]
        );
    }

    async getStudentPerformanceAnalysis(examId) {
        return await this.pool.query(
            `SELECT u.name, u.last_name, ea.total_score, ea.started_at, ea.finished_at,
                    EXTRACT(EPOCH FROM (ea.finished_at - ea.started_at))/60 as duration_minutes
             FROM learnex.exam_attempts ea
             JOIN learnex.users u ON ea.id_student = u.id_user
             WHERE ea.id_exam = $1 AND ea.status = 'completed'
             ORDER BY ea.total_score DESC`,
            [examId]
        );
    }
}

module.exports = { EvaluationSystem };
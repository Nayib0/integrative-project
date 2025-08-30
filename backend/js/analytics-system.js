/**
 * Advanced Analytics System for Learnex
 * Interactive charts, performance reports, AI predictions
 */

class AnalyticsSystem {
    constructor(pool) {
        this.pool = pool;
    }

    // Get comprehensive dashboard analytics
    async getDashboardAnalytics(userId, userRole) {
        try {
            let analytics = {};
            
            switch (userRole) {
                case 'admin':
                    analytics = await this.getAdminAnalytics();
                    break;
                case 'teacher':
                    analytics = await this.getTeacherAnalytics(userId);
                    break;
                case 'student':
                    analytics = await this.getStudentAnalytics(userId);
                    break;
                case 'parent':
                    analytics = await this.getParentAnalytics(userId);
                    break;
            }
            
            return { success: true, analytics };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Admin analytics
    async getAdminAnalytics() {
        const [
            userStats,
            gradeStats,
            taskStats,
            attendanceStats,
            monthlyTrends,
            topPerformers,
            riskStudents
        ] = await Promise.all([
            this.getUserStatistics(),
            this.getGradeStatistics(),
            this.getTaskStatistics(),
            this.getAttendanceStatistics(),
            this.getMonthlyTrends(),
            this.getTopPerformers(),
            this.getRiskStudents()
        ]);

        return {
            userStats,
            gradeStats,
            taskStats,
            attendanceStats,
            monthlyTrends,
            topPerformers,
            riskStudents,
            chartData: await this.getAdminChartData()
        };
    }

    // Teacher analytics
    async getTeacherAnalytics(teacherId) {
        const [
            classStats,
            gradeDistribution,
            taskCompletion,
            studentProgress,
            subjectPerformance
        ] = await Promise.all([
            this.getTeacherClassStats(teacherId),
            this.getGradeDistribution(teacherId),
            this.getTaskCompletionStats(teacherId),
            this.getStudentProgressData(teacherId),
            this.getSubjectPerformance(teacherId)
        ]);

        return {
            classStats,
            gradeDistribution,
            taskCompletion,
            studentProgress,
            subjectPerformance,
            chartData: await this.getTeacherChartData(teacherId)
        };
    }

    // Student analytics
    async getStudentAnalytics(studentId) {
        const [
            personalStats,
            gradeHistory,
            taskProgress,
            subjectPerformance,
            achievements,
            predictions
        ] = await Promise.all([
            this.getStudentPersonalStats(studentId),
            this.getStudentGradeHistory(studentId),
            this.getStudentTaskProgress(studentId),
            this.getStudentSubjectPerformance(studentId),
            this.getStudentAchievements(studentId),
            this.getStudentPredictions(studentId)
        ]);

        return {
            personalStats,
            gradeHistory,
            taskProgress,
            subjectPerformance,
            achievements,
            predictions,
            chartData: await this.getStudentChartData(studentId)
        };
    }

    // User statistics
    async getUserStatistics() {
        const result = await this.pool.query(`
            SELECT 
                COUNT(CASE WHEN rol = 'student' THEN 1 END) as total_students,
                COUNT(CASE WHEN rol = 'teacher' THEN 1 END) as total_teachers,
                COUNT(CASE WHEN rol = 'parent' THEN 1 END) as total_parents,
                COUNT(CASE WHEN rol = 'admin' THEN 1 END) as total_admins,
                COUNT(CASE WHEN state = 'active' THEN 1 END) as active_users,
                COUNT(*) as total_users
            FROM learnex.users
        `);
        
        return result.rows[0];
    }

    // Grade statistics
    async getGradeStatistics() {
        const result = await this.pool.query(`
            SELECT 
                AVG(calification) as average_grade,
                MIN(calification) as min_grade,
                MAX(calification) as max_grade,
                COUNT(*) as total_grades,
                COUNT(CASE WHEN calification >= 4.0 THEN 1 END) as passing_grades,
                COUNT(CASE WHEN calification < 3.0 THEN 1 END) as failing_grades
            FROM learnex.notes
        `);
        
        return result.rows[0];
    }

    // Task statistics
    async getTaskStatistics() {
        const result = await this.pool.query(`
            SELECT 
                COUNT(t.id_task) as total_tasks,
                COUNT(CASE WHEN t.status = 'active' THEN 1 END) as active_tasks,
                COUNT(ts.id_submission) as total_submissions,
                COUNT(CASE WHEN ts.score IS NOT NULL THEN 1 END) as graded_submissions,
                AVG(ts.score) as average_task_score
            FROM learnex.tasks t
            LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task
        `);
        
        return result.rows[0];
    }

    // Monthly trends
    async getMonthlyTrends() {
        const result = await this.pool.query(`
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as task_count,
                AVG(CASE WHEN ts.score IS NOT NULL THEN ts.score END) as avg_score
            FROM learnex.tasks t
            LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task
            WHERE t.created_at >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month
        `);
        
        return result.rows;
    }

    // Top performers
    async getTopPerformers(limit = 10) {
        const result = await this.pool.query(`
            SELECT 
                u.name, u.last_name, u.mail,
                AVG(n.calification) as average_grade,
                COUNT(n.id_note) as total_grades,
                sp.total_points
            FROM learnex.users u
            JOIN learnex.notes n ON u.id_user = n.id_student
            LEFT JOIN learnex.student_points sp ON u.id_user = sp.id_student
            WHERE u.rol = 'student'
            GROUP BY u.id_user, u.name, u.last_name, u.mail, sp.total_points
            HAVING COUNT(n.id_note) >= 3
            ORDER BY AVG(n.calification) DESC, sp.total_points DESC NULLS LAST
            LIMIT $1
        `, [limit]);
        
        return result.rows;
    }

    // Students at risk
    async getRiskStudents() {
        const result = await this.pool.query(`
            SELECT 
                u.name, u.last_name, u.mail,
                AVG(n.calification) as average_grade,
                COUNT(n.id_note) as total_grades,
                COUNT(CASE WHEN n.calification < 3.0 THEN 1 END) as failing_grades,
                COUNT(ts.id_submission) as submitted_tasks,
                COUNT(t.id_task) as total_tasks
            FROM learnex.users u
            LEFT JOIN learnex.notes n ON u.id_user = n.id_student
            LEFT JOIN learnex.students_curses sc ON u.id_user = sc.id_user
            LEFT JOIN learnex.curse_subject_teacher cst ON sc.id_curse = cst.id_curse
            LEFT JOIN learnex.tasks t ON cst.id_cst = t.id_cst
            LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task AND ts.id_student = u.id_user
            WHERE u.rol = 'student'
            GROUP BY u.id_user, u.name, u.last_name, u.mail
            HAVING AVG(n.calification) < 3.5 OR 
                   (COUNT(ts.id_submission)::float / NULLIF(COUNT(t.id_task), 0)) < 0.7
            ORDER BY AVG(n.calification) ASC NULLS FIRST
        `);
        
        return result.rows;
    }

    // Teacher class statistics
    async getTeacherClassStats(teacherId) {
        const result = await this.pool.query(`
            SELECT 
                COUNT(DISTINCT sc.id_user) as total_students,
                COUNT(DISTINCT t.id_task) as total_tasks,
                COUNT(ts.id_submission) as total_submissions,
                AVG(n.calification) as class_average,
                COUNT(CASE WHEN n.calification >= 4.0 THEN 1 END) as excellent_grades,
                COUNT(CASE WHEN n.calification < 3.0 THEN 1 END) as poor_grades
            FROM learnex.curse_subject_teacher cst
            LEFT JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
            LEFT JOIN learnex.tasks t ON cst.id_cst = t.id_cst
            LEFT JOIN learnex.task_submissions ts ON t.id_task = ts.id_task
            LEFT JOIN learnex.notes n ON cst.id_cst = n.id_cst
            WHERE cst.id_teacher = $1
        `, [teacherId]);
        
        return result.rows[0];
    }

    // Grade distribution for teacher
    async getGradeDistribution(teacherId) {
        const result = await this.pool.query(`
            SELECT 
                CASE 
                    WHEN n.calification >= 4.5 THEN 'Excelente (4.5-5.0)'
                    WHEN n.calification >= 4.0 THEN 'Bueno (4.0-4.4)'
                    WHEN n.calification >= 3.5 THEN 'Aceptable (3.5-3.9)'
                    WHEN n.calification >= 3.0 THEN 'Insuficiente (3.0-3.4)'
                    ELSE 'Deficiente (< 3.0)'
                END as grade_range,
                COUNT(*) as count
            FROM learnex.notes n
            JOIN learnex.curse_subject_teacher cst ON n.id_cst = cst.id_cst
            WHERE cst.id_teacher = $1
            GROUP BY grade_range
            ORDER BY MIN(n.calification) DESC
        `, [teacherId]);
        
        return result.rows;
    }

    // Student predictions using simple AI logic
    async getStudentPredictions(studentId) {
        try {
            // Get recent performance data
            const recentGrades = await this.pool.query(`
                SELECT calification, 
                       ROW_NUMBER() OVER (ORDER BY n.id_note DESC) as recency
                FROM learnex.notes n
                WHERE n.id_student = $1
                ORDER BY n.id_note DESC
                LIMIT 10
            `, [studentId]);
            
            if (recentGrades.rows.length < 3) {
                return { prediction: 'Insufficient data', confidence: 0 };
            }
            
            const grades = recentGrades.rows.map(g => parseFloat(g.calification));
            const weights = recentGrades.rows.map(g => 1 / g.recency); // More recent = higher weight
            
            // Weighted average
            const weightedSum = grades.reduce((sum, grade, i) => sum + (grade * weights[i]), 0);
            const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
            const weightedAverage = weightedSum / totalWeight;
            
            // Trend analysis
            const recentAvg = grades.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
            const olderAvg = grades.slice(3).reduce((a, b) => a + b, 0) / (grades.length - 3);
            const trend = recentAvg - olderAvg;
            
            // Prediction
            let prediction = 'Stable';
            let confidence = 0.7;
            
            if (trend > 0.3) {
                prediction = 'Improving';
                confidence = 0.8;
            } else if (trend < -0.3) {
                prediction = 'Declining';
                confidence = 0.8;
            }
            
            if (weightedAverage >= 4.0) {
                prediction += ' - High Performance';
            } else if (weightedAverage < 3.0) {
                prediction += ' - Needs Support';
            }
            
            return {
                prediction,
                confidence,
                currentAverage: weightedAverage.toFixed(2),
                trend: trend.toFixed(2),
                recommendations: this.generateRecommendations(weightedAverage, trend)
            };
        } catch (error) {
            return { prediction: 'Error calculating prediction', confidence: 0 };
        }
    }

    // Generate AI recommendations
    generateRecommendations(average, trend) {
        const recommendations = [];
        
        if (average < 3.0) {
            recommendations.push('Programar sesiones de refuerzo académico');
            recommendations.push('Revisar métodos de estudio');
            recommendations.push('Considerar apoyo tutorial personalizado');
        }
        
        if (trend < -0.3) {
            recommendations.push('Identificar factores que afectan el rendimiento');
            recommendations.push('Aumentar seguimiento y apoyo');
            recommendations.push('Comunicar con padres/tutores');
        }
        
        if (average >= 4.0 && trend > 0.2) {
            recommendations.push('Proporcionar desafíos adicionales');
            recommendations.push('Considerar actividades de liderazgo');
            recommendations.push('Mantener motivación con reconocimientos');
        }
        
        return recommendations;
    }

    // Chart data for different roles
    async getAdminChartData() {
        const [gradesTrend, userGrowth, subjectPerformance] = await Promise.all([
            this.getGradesTrendData(),
            this.getUserGrowthData(),
            this.getSubjectPerformanceData()
        ]);
        
        return { gradesTrend, userGrowth, subjectPerformance };
    }

    async getTeacherChartData(teacherId) {
        const [studentProgress, gradeDistribution, taskCompletion] = await Promise.all([
            this.getStudentProgressChart(teacherId),
            this.getGradeDistributionChart(teacherId),
            this.getTaskCompletionChart(teacherId)
        ]);
        
        return { studentProgress, gradeDistribution, taskCompletion };
    }

    async getStudentChartData(studentId) {
        const [gradeHistory, subjectRadar, progressLine] = await Promise.all([
            this.getStudentGradeChart(studentId),
            this.getStudentSubjectRadar(studentId),
            this.getStudentProgressLine(studentId)
        ]);
        
        return { gradeHistory, subjectRadar, progressLine };
    }

    // Export data functionality
    async exportAnalyticsData(userId, userRole, format = 'json') {
        try {
            const analytics = await this.getDashboardAnalytics(userId, userRole);
            
            if (format === 'csv') {
                return this.convertToCSV(analytics.analytics);
            }
            
            return analytics.analytics;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Convert data to CSV format
    convertToCSV(data) {
        // Simple CSV conversion - can be enhanced
        const headers = Object.keys(data);
        const csvContent = headers.join(',') + '\n';
        
        // This is a basic implementation - would need enhancement for complex nested data
        return csvContent;
    }

    // Log analytics events
    async logAnalyticsEvent(userId, action, entityType, entityId, metadata = {}) {
        try {
            await this.pool.query(
                `INSERT INTO learnex.analytics_logs (id_user, action, entity_type, entity_id, metadata)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, action, entityType, entityId, JSON.stringify(metadata)]
            );
        } catch (error) {
            console.error('Error logging analytics event:', error);
        }
    }
}

module.exports = { AnalyticsSystem };
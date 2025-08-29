/**
 * Gamification System for Learnex
 * Points, badges, achievements, leaderboards, challenges
 */

class GamificationSystem {
    constructor(pool) {
        this.pool = pool;
        this.pointsConfig = {
            TASK_COMPLETED: 10,
            EXAM_PASSED: 20,
            PERFECT_ATTENDANCE_WEEK: 15,
            EARLY_SUBMISSION: 5,
            HIGH_GRADE: 25,
            PARTICIPATION: 5,
            HELPING_PEER: 10,
            STREAK_BONUS: 5
        };
        
        this.levels = [
            { level: 1, name: 'Principiante', minPoints: 0, maxPoints: 99 },
            { level: 2, name: 'Estudiante', minPoints: 100, maxPoints: 249 },
            { level: 3, name: 'Aplicado', minPoints: 250, maxPoints: 499 },
            { level: 4, name: 'Destacado', minPoints: 500, maxPoints: 999 },
            { level: 5, name: 'Experto', minPoints: 1000, maxPoints: 1999 },
            { level: 6, name: 'Maestro', minPoints: 2000, maxPoints: 4999 },
            { level: 7, name: 'Leyenda', minPoints: 5000, maxPoints: Infinity }
        ];
    }

    // Initialize student points record
    async initializeStudentPoints(studentId) {
        try {
            const existing = await this.pool.query(
                'SELECT id_student_points FROM learnex.student_points WHERE id_student = $1',
                [studentId]
            );
            
            if (existing.rows.length === 0) {
                await this.pool.query(
                    'INSERT INTO learnex.student_points (id_student, total_points, level_name, level_number) VALUES ($1, $2, $3, $4)',
                    [studentId, 0, 'Principiante', 1]
                );
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Award points to student
    async awardPoints(studentId, pointType, metadata = {}) {
        try {
            await this.initializeStudentPoints(studentId);
            
            const points = this.pointsConfig[pointType] || 0;
            if (points === 0) {
                return { success: false, error: 'Invalid point type' };
            }
            
            // Update student points
            const result = await this.pool.query(
                'UPDATE learnex.student_points SET total_points = total_points + $1, updated_at = CURRENT_TIMESTAMP WHERE id_student = $2 RETURNING *',
                [points, studentId]
            );
            
            if (result.rows.length > 0) {
                const newTotal = result.rows[0].total_points;
                
                // Check for level up
                const levelUp = await this.checkLevelUp(studentId, newTotal);
                
                // Check for new achievements
                await this.checkAchievements(studentId, pointType, metadata);
                
                // Log the points award
                await this.logPointsActivity(studentId, pointType, points, metadata);
                
                return { 
                    success: true, 
                    pointsAwarded: points, 
                    totalPoints: newTotal,
                    levelUp: levelUp.leveledUp,
                    newLevel: levelUp.newLevel
                };
            }
            
            return { success: false, error: 'Failed to award points' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Check if student leveled up
    async checkLevelUp(studentId, totalPoints) {
        try {
            const currentLevel = this.getLevelByPoints(totalPoints);
            
            const studentData = await this.pool.query(
                'SELECT level_number FROM learnex.student_points WHERE id_student = $1',
                [studentId]
            );
            
            if (studentData.rows.length > 0 && currentLevel.level > studentData.rows[0].level_number) {
                // Level up!
                await this.pool.query(
                    'UPDATE learnex.student_points SET level_number = $1, level_name = $2 WHERE id_student = $3',
                    [currentLevel.level, currentLevel.name, studentId]
                );
                
                // Create notification
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type)
                     VALUES ($1, $2, $3, $4)`,
                    [
                        studentId,
                        '🎉 ¡Subiste de Nivel!',
                        `¡Felicitaciones! Ahora eres ${currentLevel.name} (Nivel ${currentLevel.level})`,
                        'level_up'
                    ]
                );
                
                return { leveledUp: true, newLevel: currentLevel };
            }
            
            return { leveledUp: false, newLevel: null };
        } catch (error) {
            console.error('Error checking level up:', error);
            return { leveledUp: false, newLevel: null };
        }
    }

    // Get level by points
    getLevelByPoints(points) {
        return this.levels.find(level => points >= level.minPoints && points <= level.maxPoints) || this.levels[0];
    }

    // Check for new achievements
    async checkAchievements(studentId, actionType, metadata = {}) {
        try {
            const achievements = await this.pool.query(
                'SELECT * FROM learnex.achievements WHERE category = $1 OR category = $2',
                ['academic', 'participation']
            );
            
            for (const achievement of achievements.rows) {
                const earned = await this.evaluateAchievement(studentId, achievement, actionType, metadata);
                
                if (earned && !(await this.hasAchievement(studentId, achievement.id_achievement))) {
                    await this.awardAchievement(studentId, achievement);
                }
            }
        } catch (error) {
            console.error('Error checking achievements:', error);
        }
    }

    // Evaluate if student earned achievement
    async evaluateAchievement(studentId, achievement, actionType, metadata) {
        try {
            const criteria = JSON.parse(achievement.criteria || '{}');
            
            switch (achievement.name) {
                case 'Primera Tarea':
                    return actionType === 'TASK_COMPLETED';
                
                case 'Estudiante Destacado':
                    const avgGrade = await this.getStudentAverageGrade(studentId);
                    return avgGrade >= 4.5;
                
                case 'Asistencia Perfecta':
                    return actionType === 'PERFECT_ATTENDANCE_WEEK';
                
                case 'Madrugador':
                    return actionType === 'EARLY_SUBMISSION';
                
                case 'Excelencia Académica':
                    return actionType === 'HIGH_GRADE' && metadata.grade >= 5.0;
                
                case 'Participativo':
                    const participationCount = await this.getParticipationCount(studentId);
                    return participationCount >= 10;
                
                case 'Mentor':
                    return actionType === 'HELPING_PEER';
                
                default:
                    return false;
            }
        } catch (error) {
            return false;
        }
    }

    // Award achievement to student
    async awardAchievement(studentId, achievement) {
        try {
            await this.pool.query(
                'INSERT INTO learnex.student_achievements (id_student, id_achievement, points_earned) VALUES ($1, $2, $3)',
                [studentId, achievement.id_achievement, achievement.points]
            );
            
            // Award points for achievement
            if (achievement.points > 0) {
                await this.pool.query(
                    'UPDATE learnex.student_points SET total_points = total_points + $1 WHERE id_student = $2',
                    [achievement.points, studentId]
                );
            }
            
            // Create notification
            await this.pool.query(
                `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    studentId,
                    '🏆 ¡Nuevo Logro Desbloqueado!',
                    `Has obtenido el logro: ${achievement.name} (+${achievement.points} puntos)`,
                    'achievement_earned',
                    achievement.id_achievement
                ]
            );
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Check if student has achievement
    async hasAchievement(studentId, achievementId) {
        try {
            const result = await this.pool.query(
                'SELECT id_student_achievement FROM learnex.student_achievements WHERE id_student = $1 AND id_achievement = $2',
                [studentId, achievementId]
            );
            
            return result.rows.length > 0;
        } catch (error) {
            return false;
        }
    }

    // Get student gamification profile
    async getStudentProfile(studentId) {
        try {
            const [points, achievements, recentActivity, ranking] = await Promise.all([
                this.getStudentPoints(studentId),
                this.getStudentAchievements(studentId),
                this.getRecentActivity(studentId),
                this.getStudentRanking(studentId)
            ]);
            
            return {
                success: true,
                profile: {
                    points: points.points,
                    achievements: achievements.achievements,
                    recentActivity: recentActivity.activities,
                    ranking: ranking.ranking,
                    nextLevel: this.getNextLevel(points.points?.total_points || 0)
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get student points
    async getStudentPoints(studentId) {
        try {
            const result = await this.pool.query(
                'SELECT * FROM learnex.student_points WHERE id_student = $1',
                [studentId]
            );
            
            return { success: true, points: result.rows[0] || null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get student achievements
    async getStudentAchievements(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT sa.*, a.name, a.description, a.icon, a.category
                 FROM learnex.student_achievements sa
                 JOIN learnex.achievements a ON sa.id_achievement = a.id_achievement
                 WHERE sa.id_student = $1
                 ORDER BY sa.earned_at DESC`,
                [studentId]
            );
            
            return { success: true, achievements: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get leaderboard
    async getLeaderboard(limit = 10, courseId = null) {
        try {
            let query = `
                SELECT sp.*, u.name, u.last_name,
                       ROW_NUMBER() OVER (ORDER BY sp.total_points DESC) as rank
                FROM learnex.student_points sp
                JOIN learnex.users u ON sp.id_student = u.id_user
                WHERE u.rol = 'student' AND u.state = 'active'
            `;
            
            const params = [];
            
            if (courseId) {
                query += ` AND sp.id_student IN (
                    SELECT id_user FROM learnex.students_curses WHERE id_curse = $1
                )`;
                params.push(courseId);
            }
            
            query += ` ORDER BY sp.total_points DESC LIMIT $${params.length + 1}`;
            params.push(limit);
            
            const result = await this.pool.query(query, params);
            
            return { success: true, leaderboard: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create challenge
    async createChallenge(challengeData) {
        const { title, description, type, criteria, reward_points, start_date, end_date, created_by } = challengeData;
        
        try {
            // This would require a challenges table - basic implementation
            const challenge = {
                id: Date.now(),
                title,
                description,
                type,
                criteria: JSON.stringify(criteria),
                reward_points,
                start_date,
                end_date,
                created_by,
                participants: 0,
                completed: 0
            };
            
            // In a real implementation, this would be stored in database
            return { success: true, challenge };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get active challenges
    async getActiveChallenges() {
        try {
            // Placeholder - would query challenges table
            const challenges = [
                {
                    id: 1,
                    title: 'Semana de Excelencia',
                    description: 'Obtén calificaciones superiores a 4.0 en todas las materias esta semana',
                    type: 'academic',
                    reward_points: 50,
                    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    participants: 25,
                    completed: 8
                },
                {
                    id: 2,
                    title: 'Entrega Temprana',
                    description: 'Entrega 3 tareas antes de la fecha límite',
                    type: 'participation',
                    reward_points: 30,
                    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    participants: 42,
                    completed: 15
                }
            ];
            
            return { success: true, challenges };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Initialize default achievements
    async initializeDefaultAchievements() {
        try {
            const defaultAchievements = [
                {
                    name: 'Primera Tarea',
                    description: 'Completa tu primera tarea',
                    icon: '📝',
                    points: 10,
                    category: 'academic',
                    criteria: JSON.stringify({ type: 'task_completed', count: 1 })
                },
                {
                    name: 'Estudiante Destacado',
                    description: 'Mantén un promedio superior a 4.5',
                    icon: '⭐',
                    points: 50,
                    category: 'academic',
                    criteria: JSON.stringify({ type: 'average_grade', value: 4.5 })
                },
                {
                    name: 'Asistencia Perfecta',
                    description: 'Asiste a todas las clases durante una semana',
                    icon: '📅',
                    points: 25,
                    category: 'attendance',
                    criteria: JSON.stringify({ type: 'perfect_attendance', period: 'week' })
                },
                {
                    name: 'Madrugador',
                    description: 'Entrega 5 tareas antes de la fecha límite',
                    icon: '🌅',
                    points: 30,
                    category: 'participation',
                    criteria: JSON.stringify({ type: 'early_submission', count: 5 })
                },
                {
                    name: 'Excelencia Académica',
                    description: 'Obtén una calificación perfecta (5.0)',
                    icon: '🏆',
                    points: 100,
                    category: 'academic',
                    criteria: JSON.stringify({ type: 'perfect_grade', value: 5.0 })
                }
            ];
            
            for (const achievement of defaultAchievements) {
                const existing = await this.pool.query(
                    'SELECT id_achievement FROM learnex.achievements WHERE name = $1',
                    [achievement.name]
                );
                
                if (existing.rows.length === 0) {
                    await this.pool.query(
                        `INSERT INTO learnex.achievements (name, description, icon, points, category, criteria)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [achievement.name, achievement.description, achievement.icon, achievement.points, achievement.category, achievement.criteria]
                    );
                }
            }
            
            return { success: true, message: 'Default achievements initialized' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Helper methods
    async getStudentAverageGrade(studentId) {
        try {
            const result = await this.pool.query(
                'SELECT AVG(calification) as avg_grade FROM learnex.notes WHERE id_student = $1',
                [studentId]
            );
            
            return parseFloat(result.rows[0]?.avg_grade || 0);
        } catch (error) {
            return 0;
        }
    }

    async getParticipationCount(studentId) {
        // This would require a participation tracking system
        return Math.floor(Math.random() * 20); // Placeholder
    }

    async getStudentRanking(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT rank FROM (
                    SELECT id_student, total_points,
                           ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
                    FROM learnex.student_points
                ) ranked WHERE id_student = $1`,
                [studentId]
            );
            
            return { success: true, ranking: result.rows[0]?.rank || null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getNextLevel(currentPoints) {
        const currentLevel = this.getLevelByPoints(currentPoints);
        const nextLevelIndex = this.levels.findIndex(l => l.level === currentLevel.level) + 1;
        
        if (nextLevelIndex < this.levels.length) {
            const nextLevel = this.levels[nextLevelIndex];
            return {
                level: nextLevel,
                pointsNeeded: nextLevel.minPoints - currentPoints
            };
        }
        
        return null; // Max level reached
    }

    async logPointsActivity(studentId, actionType, points, metadata) {
        try {
            await this.pool.query(
                `INSERT INTO learnex.analytics_logs (id_user, action, entity_type, metadata)
                 VALUES ($1, $2, $3, $4)`,
                [studentId, 'points_awarded', actionType, JSON.stringify({ points, ...metadata })]
            );
        } catch (error) {
            console.error('Error logging points activity:', error);
        }
    }

    async getRecentActivity(studentId, limit = 10) {
        try {
            const result = await this.pool.query(
                `SELECT * FROM learnex.analytics_logs 
                 WHERE id_user = $1 AND action = 'points_awarded'
                 ORDER BY created_at DESC LIMIT $2`,
                [studentId, limit]
            );
            
            return { success: true, activities: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = { GamificationSystem };
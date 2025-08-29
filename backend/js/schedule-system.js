/**
 * Schedule Management System for Learnex
 * Interactive calendar, class scheduling, reminders, Google Calendar sync
 */

class ScheduleSystem {
    constructor(pool) {
        this.pool = pool;
    }

    // Create class schedule
    async createSchedule(scheduleData) {
        const { id_cst, day_of_week, start_time, end_time, classroom } = scheduleData;
        
        try {
            // Check for conflicts
            const conflict = await this.pool.query(
                `SELECT id_schedule FROM learnex.schedules 
                 WHERE id_cst = $1 AND day_of_week = $2 
                 AND ((start_time <= $3 AND end_time > $3) OR (start_time < $4 AND end_time >= $4))`,
                [id_cst, day_of_week, start_time, end_time]
            );
            
            if (conflict.rows.length > 0) {
                return { success: false, error: 'Schedule conflict detected' };
            }
            
            const result = await this.pool.query(
                `INSERT INTO learnex.schedules (id_cst, day_of_week, start_time, end_time, classroom)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [id_cst, day_of_week, start_time, end_time, classroom]
            );
            
            return { success: true, schedule: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get teacher schedule
    async getTeacherSchedule(teacherId) {
        try {
            const result = await this.pool.query(
                `SELECT s.*, sub.name_subject, c.grade, c.school_year,
                        CASE s.day_of_week
                            WHEN 1 THEN 'Lunes'
                            WHEN 2 THEN 'Martes'
                            WHEN 3 THEN 'Miércoles'
                            WHEN 4 THEN 'Jueves'
                            WHEN 5 THEN 'Viernes'
                            WHEN 6 THEN 'Sábado'
                            WHEN 7 THEN 'Domingo'
                        END as day_name
                 FROM learnex.schedules s
                 JOIN learnex.curse_subject_teacher cst ON s.id_cst = cst.id_cst
                 JOIN learnex.subjects sub ON cst.id_subject = sub.id_subjects
                 JOIN learnex.curses c ON cst.id_curse = c.id_curse
                 WHERE cst.id_teacher = $1
                 ORDER BY s.day_of_week, s.start_time`,
                [teacherId]
            );
            
            return { success: true, schedule: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get student schedule
    async getStudentSchedule(studentId) {
        try {
            const result = await this.pool.query(
                `SELECT s.*, sub.name_subject, u.name as teacher_name, u.last_name as teacher_lastname,
                        CASE s.day_of_week
                            WHEN 1 THEN 'Lunes'
                            WHEN 2 THEN 'Martes'
                            WHEN 3 THEN 'Miércoles'
                            WHEN 4 THEN 'Jueves'
                            WHEN 5 THEN 'Viernes'
                            WHEN 6 THEN 'Sábado'
                            WHEN 7 THEN 'Domingo'
                        END as day_name
                 FROM learnex.schedules s
                 JOIN learnex.curse_subject_teacher cst ON s.id_cst = cst.id_cst
                 JOIN learnex.subjects sub ON cst.id_subject = sub.id_subjects
                 JOIN learnex.users u ON cst.id_teacher = u.id_user
                 JOIN learnex.students_curses sc ON cst.id_curse = sc.id_curse
                 WHERE sc.id_user = $1
                 ORDER BY s.day_of_week, s.start_time`,
                [studentId]
            );
            
            return { success: true, schedule: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create event
    async createEvent(eventData) {
        const { title, description, event_type, start_datetime, end_datetime, id_creator, participants, location } = eventData;
        
        try {
            const result = await this.pool.query(
                `INSERT INTO learnex.events (title, description, event_type, start_datetime, end_datetime, id_creator, participants, location)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [title, description, event_type, start_datetime, end_datetime, id_creator, JSON.stringify(participants), location]
            );
            
            // Create notifications for participants
            if (participants && participants.length > 0) {
                await this.notifyEventParticipants(result.rows[0], participants);
            }
            
            return { success: true, event: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user events
    async getUserEvents(userId, startDate, endDate) {
        try {
            const result = await this.pool.query(
                `SELECT e.*, u.name as creator_name, u.last_name as creator_lastname
                 FROM learnex.events e
                 JOIN learnex.users u ON e.id_creator = u.id_user
                 WHERE (e.id_creator = $1 OR e.participants @> $4)
                 AND e.start_datetime >= $2 AND e.start_datetime <= $3
                 ORDER BY e.start_datetime`,
                [userId, startDate, endDate, JSON.stringify([userId])]
            );
            
            return { success: true, events: result.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get calendar data for a specific month
    async getCalendarData(userId, year, month) {
        try {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            
            // Get regular schedule
            const schedule = await this.getUserSchedule(userId);
            
            // Get events
            const events = await this.getUserEvents(userId, startDate, endDate);
            
            // Generate calendar with recurring classes
            const calendarData = this.generateCalendarData(schedule.schedule, events.events, startDate, endDate);
            
            return { success: true, calendar: calendarData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate calendar data with recurring events
    generateCalendarData(schedule, events, startDate, endDate) {
        const calendarEvents = [];
        
        // Add one-time events
        events.forEach(event => {
            calendarEvents.push({
                id: `event_${event.id_event}`,
                title: event.title,
                start: event.start_datetime,
                end: event.end_datetime,
                type: event.event_type,
                description: event.description,
                location: event.location,
                isRecurring: false
            });
        });
        
        // Add recurring schedule events
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay(); // Convert Sunday from 0 to 7
            
            schedule.forEach(scheduleItem => {
                if (scheduleItem.day_of_week === dayOfWeek) {
                    const eventStart = new Date(currentDate);
                    const eventEnd = new Date(currentDate);
                    
                    const [startHour, startMinute] = scheduleItem.start_time.split(':');
                    const [endHour, endMinute] = scheduleItem.end_time.split(':');
                    
                    eventStart.setHours(parseInt(startHour), parseInt(startMinute), 0);
                    eventEnd.setHours(parseInt(endHour), parseInt(endMinute), 0);
                    
                    calendarEvents.push({
                        id: `schedule_${scheduleItem.id_schedule}_${currentDate.toISOString().split('T')[0]}`,
                        title: scheduleItem.name_subject,
                        start: eventStart.toISOString(),
                        end: eventEnd.toISOString(),
                        type: 'class',
                        classroom: scheduleItem.classroom,
                        teacher: scheduleItem.teacher_name ? `${scheduleItem.teacher_name} ${scheduleItem.teacher_lastname}` : null,
                        grade: scheduleItem.grade,
                        isRecurring: true
                    });
                }
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return calendarEvents;
    }

    // Get user schedule (helper method)
    async getUserSchedule(userId) {
        const user = await this.pool.query('SELECT rol FROM learnex.users WHERE id_user = $1', [userId]);
        
        if (user.rows.length === 0) {
            return { success: false, error: 'User not found' };
        }
        
        const role = user.rows[0].rol;
        
        if (role === 'teacher') {
            return await this.getTeacherSchedule(userId);
        } else if (role === 'student') {
            return await this.getStudentSchedule(userId);
        } else {
            return { success: true, schedule: [] };
        }
    }

    // Update event
    async updateEvent(eventId, eventData, userId) {
        try {
            // Check if user can edit this event
            const event = await this.pool.query(
                'SELECT id_creator FROM learnex.events WHERE id_event = $1',
                [eventId]
            );
            
            if (event.rows.length === 0) {
                return { success: false, error: 'Event not found' };
            }
            
            if (event.rows[0].id_creator !== userId) {
                return { success: false, error: 'Not authorized to edit this event' };
            }
            
            const { title, description, start_datetime, end_datetime, location } = eventData;
            
            const result = await this.pool.query(
                `UPDATE learnex.events 
                 SET title = $1, description = $2, start_datetime = $3, end_datetime = $4, location = $5
                 WHERE id_event = $6 RETURNING *`,
                [title, description, start_datetime, end_datetime, location, eventId]
            );
            
            return { success: true, event: result.rows[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete event
    async deleteEvent(eventId, userId) {
        try {
            const result = await this.pool.query(
                'DELETE FROM learnex.events WHERE id_event = $1 AND id_creator = $2 RETURNING *',
                [eventId, userId]
            );
            
            if (result.rows.length === 0) {
                return { success: false, error: 'Event not found or not authorized' };
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get upcoming events/classes
    async getUpcomingEvents(userId, limit = 10) {
        try {
            const now = new Date();
            const events = await this.pool.query(
                `SELECT e.*, u.name as creator_name, u.last_name as creator_lastname
                 FROM learnex.events e
                 JOIN learnex.users u ON e.id_creator = u.id_user
                 WHERE (e.id_creator = $1 OR e.participants @> $3)
                 AND e.start_datetime > $2
                 ORDER BY e.start_datetime
                 LIMIT $4`,
                [userId, now.toISOString(), JSON.stringify([userId]), limit]
            );
            
            // Also get today's classes from schedule
            const todayClasses = await this.getTodayClasses(userId);
            
            return { 
                success: true, 
                upcoming: {
                    events: events.rows,
                    todayClasses: todayClasses.classes || []
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get today's classes
    async getTodayClasses(userId) {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
            
            const schedule = await this.getUserSchedule(userId);
            
            if (!schedule.success) {
                return schedule;
            }
            
            const todayClasses = schedule.schedule.filter(item => item.day_of_week === dayOfWeek);
            
            return { success: true, classes: todayClasses };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create reminder notifications
    async createReminders() {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);
            
            // Get events for tomorrow
            const events = await this.pool.query(
                `SELECT e.*, e.participants
                 FROM learnex.events e
                 WHERE e.start_datetime >= $1 AND e.start_datetime < $2`,
                [tomorrow.toISOString(), dayAfter.toISOString()]
            );
            
            // Create reminders for event participants
            for (const event of events.rows) {
                const participants = JSON.parse(event.participants || '[]');
                participants.push(event.id_creator); // Include creator
                
                for (const participantId of participants) {
                    await this.pool.query(
                        `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                         VALUES ($1, $2, $3, $4, $5)`,
                        [
                            participantId,
                            'Recordatorio de Evento',
                            `Tienes el evento "${event.title}" mañana a las ${new Date(event.start_datetime).toLocaleTimeString()}`,
                            'event_reminder',
                            event.id_event
                        ]
                    );
                }
            }
            
            return { success: true, reminders_created: events.rows.length };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Google Calendar integration (basic structure)
    async syncWithGoogleCalendar(userId, googleCalendarId) {
        try {
            // This would require Google Calendar API integration
            // Basic structure for future implementation
            
            const userEvents = await this.getUserEvents(userId, new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
            
            // Here you would:
            // 1. Authenticate with Google Calendar API
            // 2. Create/update events in Google Calendar
            // 3. Handle conflicts and sync back
            
            return { 
                success: true, 
                message: 'Google Calendar sync feature to be implemented',
                events_to_sync: userEvents.events.length 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get schedule conflicts
    async getScheduleConflicts(userId) {
        try {
            const conflicts = await this.pool.query(
                `SELECT s1.*, s2.*, sub1.name_subject as subject1, sub2.name_subject as subject2
                 FROM learnex.schedules s1
                 JOIN learnex.schedules s2 ON s1.day_of_week = s2.day_of_week 
                     AND s1.id_schedule != s2.id_schedule
                     AND ((s1.start_time <= s2.start_time AND s1.end_time > s2.start_time) 
                          OR (s1.start_time < s2.end_time AND s1.end_time >= s2.end_time))
                 JOIN learnex.curse_subject_teacher cst1 ON s1.id_cst = cst1.id_cst
                 JOIN learnex.curse_subject_teacher cst2 ON s2.id_cst = cst2.id_cst
                 JOIN learnex.subjects sub1 ON cst1.id_subject = sub1.id_subjects
                 JOIN learnex.subjects sub2 ON cst2.id_subject = sub2.id_subjects
                 WHERE cst1.id_teacher = $1 OR cst2.id_teacher = $1`,
                [userId]
            );
            
            return { success: true, conflicts: conflicts.rows };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Notification helper
    async notifyEventParticipants(event, participants) {
        try {
            for (const participantId of participants) {
                await this.pool.query(
                    `INSERT INTO learnex.notifications (id_user, title, message, type, related_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [
                        participantId,
                        'Nuevo Evento Programado',
                        `Has sido invitado al evento: ${event.title}`,
                        'event_invitation',
                        event.id_event
                    ]
                );
            }
        } catch (error) {
            console.error('Error creating event notifications:', error);
        }
    }
}

module.exports = { ScheduleSystem };
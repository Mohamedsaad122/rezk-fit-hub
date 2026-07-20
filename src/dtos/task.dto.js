import BaseDto from './base.dto';

export class TaskDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            title: payload.title || '',
            description: payload.description || '',
            clientId: payload.clientId ?? payload.client_id ?? null,
            appointmentId: payload.appointmentId ?? payload.appointment_id ?? null,
            assignedTo: payload.assignedTo || payload.assigned_to || 'Coach',
            priority: payload.priority || 'Medium',
            status: payload.status || 'Todo',
            category: payload.category || 'Reminder',
            startDate: payload.startDate || payload.start_date || null,
            dueDate: payload.dueDate || payload.due_date || null,
            completedAt: payload.completedAt || payload.completed_at || null,
            estimatedMinutes: payload.estimatedMinutes ?? payload.estimated_minutes ?? 0,
            actualMinutes: payload.actualMinutes ?? payload.actual_minutes ?? 0,
            createdAt: payload.createdAt || payload.created_at || null,
            updatedAt: payload.updatedAt || payload.updated_at || null
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            title: domain.title,
            description: domain.description,
            client_id: domain.clientId,
            appointment_id: domain.appointmentId,
            assigned_to: domain.assignedTo,
            priority: domain.priority,
            status: domain.status,
            category: domain.category,
            start_date: domain.startDate,
            due_date: domain.dueDate,
            completed_at: domain.completedAt,
            estimated_minutes: domain.estimatedMinutes,
            actual_minutes: domain.actualMinutes
        };
    }
}

export default TaskDto;

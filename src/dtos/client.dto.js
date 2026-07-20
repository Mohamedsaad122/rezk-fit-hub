import BaseDto from './base.dto';

export class ClientDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            name: payload.name || payload.full_name || '',
            email: payload.email || '',
            phone: payload.phone || '',
            avatar: payload.avatar || null,
            progress: payload.progress ?? payload.progress_percentage ?? 0,
            workouts: payload.workouts ?? payload.workouts_count ?? 0,
            streak: payload.streak ?? payload.workout_streak ?? 0,
            subscriptionStatus: payload.subscriptionStatus || payload.subscription_status || 'نشط',
            joinDate: payload.joinDate || payload.join_date || null,
            assignedCategoryId: payload.assignedCategoryId || payload.assigned_category_id || null,
            goal: payload.goal || ''
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            name: domain.name,
            full_name: domain.name,
            email: domain.email,
            phone: domain.phone,
            avatar: domain.avatar,
            progress_percentage: domain.progress,
            workouts_count: domain.workouts,
            workout_streak: domain.streak,
            subscription_status: domain.subscriptionStatus,
            join_date: domain.joinDate,
            assigned_category_id: domain.assignedCategoryId,
            goal: domain.goal
        };
    }
}

export default ClientDto;

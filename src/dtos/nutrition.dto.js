import BaseDto from './base.dto';

export class NutritionDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            clientId: payload.clientId ?? payload.client_id ?? null,
            title: payload.title || '',
            notes: payload.notes || '',
            caloriesGoal: payload.caloriesGoal ?? payload.calories_goal ?? 2000,
            proteinGoal: payload.proteinGoal ?? payload.protein_goal ?? 150,
            carbsGoal: payload.carbsGoal ?? payload.carbs_goal ?? 200,
            fatsGoal: payload.fatsGoal ?? payload.fats_goal ?? 70,
            status: payload.status || 'Draft',
            createdAt: payload.createdAt || payload.created_at || null,
            updatedAt: payload.updatedAt || payload.updated_at || null
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            client_id: domain.clientId,
            title: domain.title,
            notes: domain.notes,
            calories_goal: domain.caloriesGoal,
            protein_goal: domain.proteinGoal,
            carbs_goal: domain.carbsGoal,
            fats_goal: domain.fatsGoal,
            status: domain.status
        };
    }
}

export default NutritionDto;

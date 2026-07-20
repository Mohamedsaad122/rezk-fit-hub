import BaseDto from './base.dto';

export class ExerciseDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            name: payload.name || '',
            videoUrl: payload.videoUrl || payload.video_url || '',
            difficulty: payload.difficulty || 'Beginner',
            description: payload.description || '',
            category: payload.category || 'Strength',
            muscleGroup: payload.muscleGroup || payload.muscle_group || '',
            equipment: payload.equipment || '',
            safetyCues: payload.safetyCues || payload.safety_cues || ''
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            name: domain.name,
            video_url: domain.videoUrl,
            difficulty: domain.difficulty,
            description: domain.description,
            category: domain.category,
            muscle_group: domain.muscleGroup,
            equipment: domain.equipment,
            safety_cues: domain.safetyCues
        };
    }
}

export default ExerciseDto;

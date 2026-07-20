import BaseDto from './base.dto';

export class AppointmentDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            title: payload.title || '',
            clientId: payload.clientId ?? payload.client_id ?? null,
            trainerId: payload.trainerId ?? payload.trainer_id ?? null,
            date: payload.date || null,
            startTime: payload.startTime || payload.start_time || '',
            endTime: payload.endTime || payload.end_time || '',
            status: payload.status || 'Scheduled',
            location: payload.location || '',
            notes: payload.notes || '',
            type: payload.type || 'Personal Training',
            duration: payload.duration ?? 60
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            title: domain.title,
            client_id: domain.clientId,
            trainer_id: domain.trainerId,
            date: domain.date,
            start_time: domain.startTime,
            end_time: domain.endTime,
            status: domain.status,
            location: domain.location,
            notes: domain.notes,
            type: domain.type,
            duration: domain.duration
        };
    }
}

export default AppointmentDto;

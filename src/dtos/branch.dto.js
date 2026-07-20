import BaseDto from './base.dto';

export class BranchDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            name: payload.name || '',
            code: payload.code || '',
            address: payload.address || '',
            phone: payload.phone || '',
            manager: payload.manager || '',
            status: payload.status || 'Active',
            timezone: payload.timezone || 'Asia/Riyadh'
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            name: domain.name,
            code: domain.code,
            address: domain.address,
            phone: domain.phone,
            manager: domain.manager,
            status: domain.status,
            timezone: domain.timezone
        };
    }
}

export default BranchDto;

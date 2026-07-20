import BaseDto from './base.dto';

export class UserDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            fullName: payload.fullName || payload.full_name || '',
            email: payload.email || '',
            phone: payload.phone || '',
            avatar: payload.avatar || null,
            role: payload.role || 'Coach',
            status: payload.status || 'Active',
            lastLogin: payload.lastLogin || payload.last_login || null,
            createdAt: payload.createdAt || payload.created_at || null,
            branch: payload.branch || '',
            notes: payload.notes || ''
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            full_name: domain.fullName,
            email: domain.email,
            phone: domain.phone,
            avatar: domain.avatar,
            role: domain.role,
            status: domain.status,
            last_login: domain.lastLogin,
            branch: domain.branch,
            notes: domain.notes
        };
    }
}

export default UserDto;

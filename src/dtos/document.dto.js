import BaseDto from './base.dto';

export class DocumentDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            name: payload.name || '',
            extension: payload.extension || '',
            size: payload.size ?? 0,
            url: payload.url || '',
            category: payload.category || 'General',
            owner: payload.owner || 'Coach',
            isFavorite: payload.isFavorite ?? payload.is_favorite ?? false,
            isArchived: payload.isArchived ?? payload.is_archived ?? false,
            clientId: payload.clientId ?? payload.client_id ?? null,
            createdAt: payload.createdAt || payload.created_at || null,
            updatedAt: payload.updatedAt || payload.updated_at || null
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            name: domain.name,
            extension: domain.extension,
            size: domain.size,
            url: domain.url,
            category: domain.category,
            owner: domain.owner,
            is_favorite: domain.isFavorite,
            is_archived: domain.isArchived,
            client_id: domain.clientId
        };
    }
}

export default DocumentDto;

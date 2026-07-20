import BaseDto from './base.dto';

export class MessageDto extends BaseDto {
    static toDomain(payload) {
        if (!payload) return null;
        return {
            id: payload.id,
            senderId: payload.senderId ?? payload.sender_id ?? null,
            senderName: payload.senderName || payload.sender_name || '',
            senderAvatar: payload.senderAvatar || payload.sender_avatar || null,
            recipientId: payload.recipientId ?? payload.recipient_id ?? null,
            content: payload.content || '',
            timestamp: payload.timestamp || null,
            isRead: payload.isRead ?? payload.is_read ?? false,
            attachmentUrl: payload.attachmentUrl || payload.attachment_url || null,
            attachmentName: payload.attachmentName || payload.attachment_name || null,
            attachmentType: payload.attachmentType || payload.attachment_type || null
        };
    }

    static toRequest(domain) {
        if (!domain) return null;
        return {
            sender_id: domain.senderId,
            sender_name: domain.senderName,
            sender_avatar: domain.senderAvatar,
            recipient_id: domain.recipientId,
            content: domain.content,
            timestamp: domain.timestamp,
            is_read: domain.isRead,
            attachment_url: domain.attachmentUrl,
            attachment_name: domain.attachmentName,
            attachment_type: domain.attachmentType
        };
    }
}

export default MessageDto;

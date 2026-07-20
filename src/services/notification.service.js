import { NotificationRepository } from '@/repositories/notification.repository';

/**
 * Service acting as a business logic layer for notifications.
 */
export const NotificationService = {
    getAllNotifications: (options = {}) => {
        return NotificationRepository.getAll(options);
    },

    getNotificationById: (id) => {
        return NotificationRepository.getById(id);
    },

    createNotification: (data) => {
        return NotificationRepository.create(data);
    },

    updateNotification: (id, data) => {
        return NotificationRepository.update(id, data);
    },

    deleteNotification: (id) => {
        return NotificationRepository.delete(id);
    },

    markAllRead: () => {
        return NotificationRepository.markAllRead();
    },

    getSettings: () => {
        return NotificationRepository.getSettings();
    },

    updateSettings: (settingsData) => {
        return NotificationRepository.updateSettings(settingsData);
    }
};

export default NotificationService;

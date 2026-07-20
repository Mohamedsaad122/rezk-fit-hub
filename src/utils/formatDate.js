import { logger } from '@/utils/logger';

/**
 * Localizes and formats dates to string values.
 * Supports standard locales, default is Arabic ('ar').
 */
export const formatDate = (date, options = {}, locale = 'ar') => {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    };
    
    try {
        const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
        return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
    } catch (e) {
        logger.error('Error formatting date:', e);
        return '';
    }
};

export default formatDate;

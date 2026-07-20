import { logger } from '@/utils/logger';

/**
 * Localizes number values with support for different numerical layouts.
 * Defaults to Arabic locale formatting ('ar').
 */
export const formatNumber = (number, options = {}, locale = 'ar') => {
    try {
        return new Intl.NumberFormat(locale, options).format(Number(number));
    } catch (e) {
        logger.error('Error formatting number:', e);
        return String(number);
    }
};

export default formatNumber;

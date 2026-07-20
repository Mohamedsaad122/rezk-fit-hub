import { toast } from 'sonner';

/**
 * Centralized Toast Notification Service.
 * Ensures the UI page or mutation triggers the alert, rather than the repository layer.
 */
export const toastService = {
    success: (message, description = '') => {
        toast.success(message, {
            description,
            className: 'rtl text-right font-sans',
        });
    },

    error: (message, description = '') => {
        toast.error(message, {
            description,
            className: 'rtl text-right font-sans',
        });
    },

    warning: (message, description = '') => {
        toast.warning(message, {
            description,
            className: 'rtl text-right font-sans',
        });
    },

    info: (message, description = '') => {
        toast.info(message, {
            description,
            className: 'rtl text-right font-sans',
        });
    }
};

export default toastService;

import { create } from 'zustand';

export const useLicenseStore = create((set, get) => ({
    activeLicense: null,
    isValid: false,
    errorMessage: '',

    setLicense: (license) => {
        if (!license) {
            set({ activeLicense: null, isValid: false, errorMessage: 'لا يوجد ترخيص نشط للنظام' });
            return;
        }

        const isExpired = new Date(license.expiresAt) < new Date();
        if (isExpired) {
            set({ activeLicense: license, isValid: false, errorMessage: 'انتهت صلاحية الترخيص الإداري' });
        } else if (license.status === 'Revoked') {
            set({ activeLicense: license, isValid: false, errorMessage: 'تم إلغاء صلاحية هذا الترخيص' });
        } else {
            set({ activeLicense: license, isValid: true, errorMessage: '' });
        }
    },

    checkSeatAvailability: (currentSeats) => {
        const license = get().activeLicense;
        if (!license) return false;
        return currentSeats < license.seatsCount;
    }
}));

export default useLicenseStore;

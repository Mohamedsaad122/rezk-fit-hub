import { LicenseRepository } from '@/repositories/license.repository';
import { useLicenseStore } from '@/store/license.store';

export const LicenseService = {
    checkLicenseValidity: async (tenantId) => {
        try {
            const license = await LicenseRepository.get(tenantId);
            if (!license) {
                useLicenseStore.getState().setLicense(null);
                return { isValid: false, message: 'لا يوجد ترخيص لهذا الحساب' };
            }

            const now = new Date();
            const expires = new Date(license.expiresAt);
            const isExpired = expires < now;

            if (isExpired) {
                const graceDays = LicenseService.getGracePeriodRemainingDays(license.expiresAt);
                if (graceDays > 0) {
                    useLicenseStore.getState().setLicense({ ...license, status: 'GracePeriod' });
                    return { isValid: true, status: 'GracePeriod', message: `الترخيص منتهي. فترة السماح الإضافية: ${graceDays} أيام المتبقية.` };
                }
                useLicenseStore.getState().setLicense({ ...license, status: 'Expired' });
                return { isValid: false, status: 'Expired', message: 'انتهت صلاحية الترخيص بالكامل' };
            }

            if (license.status === 'Revoked') {
                useLicenseStore.getState().setLicense(license);
                return { isValid: false, status: 'Revoked', message: 'تم إيقاف أو سحب الترخيص' };
            }

            useLicenseStore.getState().setLicense(license);
            return { isValid: true, status: 'Active', message: 'الترخيص سليم ونشط' };
        } catch (error) {
            console.error('Failed to run license validation:', error);
            return { isValid: false, message: 'فشل التحقق من الترخيص' };
        }
    },

    getGracePeriodRemainingDays: (expiresAtStr) => {
        const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days grace period
        const expires = new Date(expiresAtStr);
        const deadline = new Date(expires.getTime() + gracePeriodMs);
        const now = new Date();
        
        if (now > deadline) return 0;
        const diffMs = deadline.getTime() - now.getTime();
        return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    },

    parseOfflineLicense: (base64Code) => {
        try {
            const decodedStr = atob(base64Code);
            const data = JSON.parse(decodedStr);
            
            if (!data.tenantId || !data.expiresAt || !data.seatsCount || !data.signature) {
                throw new Error('بيانات الترخيص المعتمدة غير كاملة');
            }

            // Verify mock signature (signature must start with 'SIGN_')
            if (!data.signature.startsWith('SIGN_')) {
                throw new Error('توقيع الترخيص الرقمي غير صالح');
            }

            return {
                tenantId: data.tenantId,
                expiresAt: data.expiresAt,
                seatsCount: Number(data.seatsCount),
                deviceCount: Number(data.deviceCount || 1),
                licenseKey: `OFFLINE-KEY-${data.tenantId}-${data.seatsCount}`,
                status: 'Active',
                issuedAt: new Date().toISOString(),
                offlineData: base64Code
            };
        } catch (error) {
            console.error('Offline license block parsing failed:', error);
            throw new Error('فشل فك تشفير وفك حزمة الترخيص دون اتصال');
        }
    }
};

export default LicenseService;

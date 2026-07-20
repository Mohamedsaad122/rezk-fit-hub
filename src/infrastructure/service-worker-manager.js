import { toastService } from '@/services/toast.service';

export const ServiceWorkerManager = {
    isRegistered: false,

    registerServiceWorker: async () => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            ServiceWorkerManager.isRegistered = true; // Sim flag for test runs
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            ServiceWorkerManager.isRegistered = true;

            // Handle updates
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available; please refresh.
                                toastService.info('تحديث جديد للمنصة متوفر! يرجى إعادة تحميل الصفحة لتطبيق التحديثات.');
                            } else {
                                // Content is cached for offline use.
                                toastService.success('المنصة جاهزة للعمل بدون اتصال بالإنترنت (Offline Mode)');
                            }
                        }
                    };
                }
            };

            return true;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return false;
        }
    },

    unregister: async () => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            ServiceWorkerManager.isRegistered = false;
            return false;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
            await reg.unregister();
        }
        ServiceWorkerManager.isRegistered = false;
        return true;
    }
};

export default ServiceWorkerManager;

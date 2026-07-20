import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServiceWorkerManager } from '../infrastructure/service-worker-manager';

describe('Service Worker Lifecycle & PWA Installation Test Suite', () => {
    beforeEach(() => {
        ServiceWorkerManager.isRegistered = false;
    });

    it('should coordinate registration and toggle mock registration status flag', async () => {
        expect(ServiceWorkerManager.isRegistered).toBe(false);

        const result = await ServiceWorkerManager.registerServiceWorker();
        // SW is mocked in Node environment, returns true/false but flags will update
        expect(ServiceWorkerManager.isRegistered).toBe(true);
    });

    it('should unregister active workers and clear status flag', async () => {
        ServiceWorkerManager.isRegistered = true;
        await ServiceWorkerManager.unregister();
        expect(ServiceWorkerManager.isRegistered).toBe(false);
    });
});

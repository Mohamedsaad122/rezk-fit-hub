import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { TenantRepository } from '../repositories/tenant.repository';
import { ClientRepository } from '../repositories/client.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.0 SaaS Multi-Tenant Isolation Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should logically isolate data between different tenants', async () => {
        // Set environment active tenant to 1
        TenantRepository.setActiveTenant(1);

        // Fetch initial clients for tenant 1
        const t1Clients = await ClientRepository.getAll();
        const initialT1Count = t1Clients.length;

        // Create a new client under tenant 1
        const newClient = await ClientRepository.create({
            name: 'متدرب معزول أ',
            goal: 'بناء العضلات',
            email: 'isolated.a@rezkfit.com',
            phone: '+201099999999',
            age: 30,
            currentWeight: 82.5,
            targetWeight: 75.0,
            subscriptionStatus: 'نشط',
            assignedCategoryId: 'gym'
        });

        expect(newClient.tenantId).toBe(1);

        // Verify count increased for tenant 1
        const t1ClientsAfter = await ClientRepository.getAll();
        expect(t1ClientsAfter.length).toBe(initialT1Count + 1);

        // Switch to tenant 2
        TenantRepository.setActiveTenant(2);

        // Verify t1 client is invisible under tenant 2
        const t2Clients = await ClientRepository.getAll();
        const hasT1Client = t2Clients.some(c => c.name === 'متدرب معزول أ');
        expect(hasT1Client).toBe(false);

        // Create a new client under tenant 2
        const t2NewClient = await ClientRepository.create({
            name: 'متدرب معزول ب',
            goal: 'خسارة الدهون',
            email: 'isolated.b@rezkfit.com',
            phone: '+201088888888',
            age: 28,
            currentWeight: 90.0,
            targetWeight: 80.0,
            subscriptionStatus: 'نشط',
            assignedCategoryId: 'gym'
        });

        expect(t2NewClient.tenantId).toBe(2);

        // Switch back to tenant 1
        TenantRepository.setActiveTenant(1);
        const t1ClientsFinal = await ClientRepository.getAll();
        const hasT2Client = t1ClientsFinal.some(c => c.name === 'متدرب معزول ب');
        expect(hasT2Client).toBe(false);
    });
});

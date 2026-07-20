import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { IntegrationRepository } from '../repositories/integration.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.4 Integrations Tenant Isolation & Status Toggles', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should retrieve active integrations list filtered by active tenant context', async () => {
        TenantRepository.setActiveTenant(1);

        const list = await IntegrationRepository.getAll();
        expect(list.length).toBe(3);
        expect(list[0].provider).toBe('Google Calendar');
    });

    it('should update and toggle active integration status from Connected to Disconnected', async () => {
        TenantRepository.setActiveTenant(1);

        const updated = await IntegrationRepository.update(1, { status: 'Disconnected' });
        expect(updated.status).toBe('Disconnected');

        const list = await IntegrationRepository.getAll();
        expect(list.find(i => i.id === 1).status).toBe('Disconnected');
    });
});

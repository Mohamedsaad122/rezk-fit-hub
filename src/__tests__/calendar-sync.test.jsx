import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { CalendarSyncService } from '../services/calendar-sync.service';
import { ProviderRepository } from '../repositories/provider.repository';
import { TenantRepository } from '../repositories/tenant.repository';

describe('Calendar Sync Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        TenantRepository.setActiveTenant(1);
    });

    it('should sync successfully with Google Calendar provider', async () => {
        const log = await CalendarSyncService.syncWithProvider('Google Calendar');
        expect(log.id).toBeDefined();
        expect(log.provider).toBe('Google Calendar');
        expect(log.status).toBe('Success');
        expect(log.syncedItemsCount).toBe(12);
        expect(log.errorMessage).toBeNull();

        const logs = await ProviderRepository.getSyncLogs();
        expect(logs.length).toBe(1);
        expect(logs[0].id).toBe(log.id);
    });

    it('should sync successfully with Microsoft Outlook provider', async () => {
        const log = await CalendarSyncService.syncWithProvider('Microsoft Outlook');
        expect(log.provider).toBe('Microsoft Outlook');
        expect(log.status).toBe('Success');
        expect(log.syncedItemsCount).toBe(8);
    });

    it('should log simulated failure with correct error message', async () => {
        const log = await CalendarSyncService.syncWithProvider('FailedProvider');
        expect(log.status).toBe('Failed');
        expect(log.syncedItemsCount).toBe(0);
        expect(log.errorMessage).toBe('API timeout response from remote calendar authority');
    });

    it('should preserve tenant isolation for calendar sync logs', async () => {
        TenantRepository.setActiveTenant(1);
        const log1 = await CalendarSyncService.syncWithProvider('Google Calendar');

        TenantRepository.setActiveTenant(2);
        const log2 = await CalendarSyncService.syncWithProvider('Microsoft Outlook');

        // Assert log1 only visible to Tenant 1
        TenantRepository.setActiveTenant(1);
        const logsTenant1 = await ProviderRepository.getSyncLogs();
        expect(logsTenant1.find(l => l.id === log1.id)).toBeDefined();
        expect(logsTenant1.find(l => l.id === log2.id)).toBeUndefined();

        // Assert log2 only visible to Tenant 2
        TenantRepository.setActiveTenant(2);
        const logsTenant2 = await ProviderRepository.getSyncLogs();
        expect(logsTenant2.find(l => l.id === log2.id)).toBeDefined();
        expect(logsTenant2.find(l => l.id === log1.id)).toBeUndefined();
    });
});

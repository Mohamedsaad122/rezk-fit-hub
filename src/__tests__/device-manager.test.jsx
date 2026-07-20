import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { OfflineService } from '../services/offline.service';
import { TenantRepository } from '../repositories/tenant.repository';

describe('Device Manager & Tenant Caching Isolation Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        TenantRepository.setActiveTenant(1);
    });

    it('should register a device and query connected devices registry', async () => {
        const device = await OfflineService.registerCurrentDevice('المدرب الآيباد الرئيسي', 'iOS');
        
        expect(device.id).toBeDefined();
        expect(device.name).toBe('المدرب الآيباد الرئيسي');
        expect(device.status).toBe('Active');

        const all = await OfflineService.getDevices();
        expect(all.length).toBe(1);
        expect(all[0].name).toBe('المدرب الآيباد الرئيسي');
    });

    it('should isolate devices list between different tenant sessions', async () => {
        // Tenant 1 registers device
        TenantRepository.setActiveTenant(1);
        const d1 = await OfflineService.registerCurrentDevice('جهاز فرع الرياض', 'Android');

        // Tenant 2 registers device
        TenantRepository.setActiveTenant(2);
        const d2 = await OfflineService.registerCurrentDevice('جهاز فرع جدة', 'iOS');

        // Verify isolation for Tenant 1
        TenantRepository.setActiveTenant(1);
        const list1 = await OfflineService.getDevices();
        expect(list1.find(d => d.id === d1.id)).toBeDefined();
        expect(list1.find(d => d.id === d2.id)).toBeUndefined();

        // Verify isolation for Tenant 2
        TenantRepository.setActiveTenant(2);
        const list2 = await OfflineService.getDevices();
        expect(list2.find(d => d.id === d2.id)).toBeDefined();
        expect(list2.find(d => d.id === d1.id)).toBeUndefined();
    });
});

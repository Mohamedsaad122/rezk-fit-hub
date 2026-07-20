import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { OrganizationRepository } from '../repositories/organization.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.1 Enterprise Organizations CRUD & Isolation', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should support CRUD operations and enforce tenant-level isolation', async () => {
        // Set tenant to 1
        TenantRepository.setActiveTenant(1);

        const initialOrgs = await OrganizationRepository.getAll();
        const initialCount = initialOrgs.length;

        // Create new organization for Tenant 1
        const newOrg = await OrganizationRepository.create({
            name: 'منظمة مستقلة للمدربين',
            settings: {
                timezone: 'Asia/Riyadh',
                currency: 'SAR',
                primaryColor: '#0ea5e9'
            }
        });

        expect(newOrg.tenantId).toBe(1);
        expect(newOrg.name).toBe('منظمة مستقلة للمدربين');

        // Verify it exists in Tenant 1's list
        const orgsAfter = await OrganizationRepository.getAll();
        expect(orgsAfter.length).toBe(initialCount + 1);

        // Switch to Tenant 2
        TenantRepository.setActiveTenant(2);

        // Verify the organization created under Tenant 1 is not visible
        const t2Orgs = await OrganizationRepository.getAll();
        const containsT1Org = t2Orgs.some(o => o.name === 'منظمة مستقلة للمدربين');
        expect(containsT1Org).toBe(false);

        // Switch back to Tenant 1 and test update
        TenantRepository.setActiveTenant(1);
        const updatedOrg = await OrganizationRepository.update(newOrg.id, {
            name: 'منظمة الكوادر الرياضية'
        });
        expect(updatedOrg.name).toBe('منظمة الكوادر الرياضية');

        // Test delete
        const deleteSuccess = await OrganizationRepository.delete(newOrg.id);
        expect(deleteSuccess).toBe(true);

        const finalOrgs = await OrganizationRepository.getAll();
        expect(finalOrgs.length).toBe(initialCount);
    });
});

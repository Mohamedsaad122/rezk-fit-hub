import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { OrganizationRepository } from '../repositories/organization.repository';
import { TeamRepository } from '../repositories/team.repository';
import { MemberRepository } from '../repositories/member.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { OrganizationService } from '../services/organization.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.1 Organization Switching Scoping & Contexts', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should retrieve teams and members scoped to the active organization switcher', async () => {
        TenantRepository.setActiveTenant(1);

        // Active Org is 1 initially
        OrganizationRepository.setActiveOrganization(1);

        // Fetch team/members for organization 1
        const org1Teams = await TeamRepository.getAll();
        const org1Members = await MemberRepository.getAll();

        expect(org1Teams.every(t => t.organizationId === 1)).toBe(true);
        expect(org1Members.every(m => m.organizationId === 1)).toBe(true);

        // Switch to organization 2
        await OrganizationService.switchOrganization(2);

        // Fetch team/members for organization 2
        const org2Teams = await TeamRepository.getAll();
        const org2Members = await MemberRepository.getAll();

        expect(org2Teams.every(t => t.organizationId === 2)).toBe(true);
        expect(org2Members.every(m => m.organizationId === 2)).toBe(true);

        // Ensure different lists were loaded
        const hasOverlap = org1Teams.some(t1 => org2Teams.some(t2 => t1.id === t2.id));
        expect(hasOverlap).toBe(false);
    });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { TeamRepository } from '../repositories/team.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { TeamService } from '../services/team.service';
import { MemberRepository } from '../repositories/member.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.1 Enterprise Teams CRUD & Assignments', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should support team CRUD operations isolated by active organization', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        const initialTeams = await TeamRepository.getAll();
        const initialCount = initialTeams.length;

        // Create team
        const newTeam = await TeamRepository.create({
            name: 'فريق كمال الأجسام والحديد',
            description: 'فريق الإعداد لبطولات كمال الأجسام'
        });

        expect(newTeam.organizationId).toBe(1);

        // Verify count
        const teamsAfter = await TeamRepository.getAll();
        expect(teamsAfter.length).toBe(initialCount + 1);

        // Switch organization to 2
        OrganizationRepository.setActiveOrganization(2);

        // Verify Team created under Org 1 is invisible under Org 2
        const org2Teams = await TeamRepository.getAll();
        const containsTeam = org2Teams.some(t => t.name === 'فريق كمال الأجسام والحديد');
        expect(containsTeam).toBe(false);
    });

    it('should support adding and removing members to/from teams', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        const team = await TeamRepository.getById(1);
        const member = await MemberRepository.getById(3); // initially has teamIds: [2] and team 1 has memberIds: [1, 2]

        expect(team.memberIds).not.toContain(3);
        expect(member.teamIds).not.toContain(1);

        // Add member 3 to team 1
        await TeamService.addMemberToTeam(1, 3);

        const updatedTeam = await TeamRepository.getById(1);
        const updatedMember = await MemberRepository.getById(3);

        expect(updatedTeam.memberIds).toContain(3);
        expect(updatedMember.teamIds).toContain(1);

        // Remove member 3 from team 1
        await TeamService.removeMemberFromTeam(1, 3);

        const finalTeam = await TeamRepository.getById(1);
        const finalMember = await MemberRepository.getById(3);

        expect(finalTeam.memberIds).not.toContain(3);
        expect(finalMember.teamIds).not.toContain(1);
    });
});

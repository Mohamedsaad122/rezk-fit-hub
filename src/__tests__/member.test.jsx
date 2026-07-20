import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { MemberRepository } from '../repositories/member.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { MemberService } from '../services/member.service';
import { OrganizationService } from '../services/organization.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.1 Member Management & Ownership Swaps', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should support modifying member roles and suspending member status', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        const memberId = 3;
        const member = await MemberRepository.getById(memberId);
        expect(member.role).toBe('Coach');
        expect(member.status).toBe('Active');

        // Suspend member
        await MemberService.suspendMember(memberId);
        const suspended = await MemberRepository.getById(memberId);
        expect(suspended.status).toBe('Suspended');

        // Reactivate member
        await MemberService.reactivateMember(memberId);
        const reactivated = await MemberRepository.getById(memberId);
        expect(reactivated.status).toBe('Active');

        // Change role
        await MemberService.changeRole(memberId, 'Nutritionist');
        const updatedRole = await MemberRepository.getById(memberId);
        expect(updatedRole.role).toBe('Nutritionist');
    });

    it('should support swapping ownership status between organization members', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        const owner = await MemberRepository.getById(1); // 'الكوتش أحمد'
        const admin = await MemberRepository.getById(2); // 'سارة أحمد'

        expect(owner.role).toBe('Owner');
        expect(admin.role).toBe('Administrator');

        // Transfer ownership from member 1 to member 2
        await OrganizationService.transferOwnership(1, 1, 2);

        const newOwner = await MemberRepository.getById(2);
        const demotedAdmin = await MemberRepository.getById(1);

        expect(newOwner.role).toBe('Owner');
        expect(demotedAdmin.role).toBe('Administrator');
    });

    it('should reject ownership transfers from members who are not owners', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        // Attempt transfer from a non-owner (member 2 is Admin)
        await expect(OrganizationService.transferOwnership(1, 2, 3)).rejects.toThrow('فقط مالك المنظمة يستطيع نقل الملكية');
    });
});

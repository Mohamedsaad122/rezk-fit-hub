import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { InvitationRepository } from '../repositories/invitation.repository';
import { MemberRepository } from '../repositories/member.repository';
import { OrganizationRepository } from '../repositories/organization.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { InvitationService } from '../services/invitation.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.1 Invitation Lifecycle & Conversions', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should support sending, declining, and cancelling invitations', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        // Send invitation
        const invite = await InvitationService.sendInvitation('new.invite@rezkfit.com', 1, 'Coach');
        expect(invite.email).toBe('new.invite@rezkfit.com');
        expect(invite.status).toBe('Pending');
        expect(invite.role).toBe('Coach');

        // Decline invitation
        const declined = await InvitationService.declineInvitation(invite.id);
        expect(declined.status).toBe('Declined');

        // Cancel/Delete invitation
        const cancelSuccess = await InvitationService.cancelInvitation(invite.id);
        expect(cancelSuccess).toBe(true);
    });

    it('should support accepting invitations and auto-converting to active members', async () => {
        TenantRepository.setActiveTenant(1);
        OrganizationRepository.setActiveOrganization(1);

        const invite = await InvitationService.sendInvitation('target.user@rezkfit.com', 1, 'Nutritionist');

        const initialMembers = await MemberRepository.getAll();
        const initialCount = initialMembers.length;

        // Accept invitation
        const result = await InvitationService.acceptInvitation(invite.id);
        expect(result.invite.status).toBe('Accepted');

        // Verify member is spawned
        expect(result.member.email).toBe('target.user@rezkfit.com');
        expect(result.member.role).toBe('Nutritionist');
        expect(result.member.status).toBe('Active');

        const membersAfter = await MemberRepository.getAll();
        expect(membersAfter.length).toBe(initialCount + 1);
        expect(membersAfter.some(m => m.email === 'target.user@rezkfit.com')).toBe(true);
    });
});

import { InvitationRepository } from '@/repositories/invitation.repository';
import { MemberRepository } from '@/repositories/member.repository';

export const InvitationService = {
    sendInvitation: async (email, organizationId, role) => {
        try {
            return await InvitationRepository.create({ email, organizationId, role });
        } catch (error) {
            console.error('Failed to send invitation:', error);
            throw error;
        }
    },

    acceptInvitation: async (inviteId) => {
        try {
            const invite = await InvitationRepository.getById(inviteId);
            if (!invite) throw new Error('الدعوة غير موجودة أو غير صالحة');

            // 1. Mark invitation as Accepted
            const updatedInvite = await InvitationRepository.update(inviteId, { status: 'Accepted' });

            // 2. Create actual member record
            const newMember = await MemberRepository.create({
                email: invite.email,
                name: invite.email.split('@')[0], // default name
                organizationId: invite.organizationId,
                role: invite.role,
                status: 'Active'
            });

            return { invite: updatedInvite, member: newMember };
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            throw error;
        }
    },

    declineInvitation: async (inviteId) => {
        try {
            return await InvitationRepository.update(inviteId, { status: 'Declined' });
        } catch (error) {
            console.error('Failed to decline invitation:', error);
            throw error;
        }
    },

    cancelInvitation: async (inviteId) => {
        try {
            return await InvitationRepository.delete(inviteId);
        } catch (error) {
            console.error('Failed to cancel invitation:', error);
            throw error;
        }
    }
};

export default InvitationService;

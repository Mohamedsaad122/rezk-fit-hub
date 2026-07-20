import { OrganizationRepository } from '@/repositories/organization.repository';
import { MemberRepository } from '@/repositories/member.repository';

export const OrganizationService = {
    switchOrganization: async (orgId) => {
        try {
            OrganizationRepository.setActiveOrganization(orgId);
            return true;
        } catch (error) {
            console.error('Failed to switch organization context:', error);
            return false;
        }
    },

    transferOwnership: async (orgId, currentOwnerId, targetMemberId) => {
        try {
            const currentOwner = await MemberRepository.getById(currentOwnerId);
            if (!currentOwner || currentOwner.role !== 'Owner') {
                throw new Error('فقط مالك المنظمة يستطيع نقل الملكية');
            }

            const targetMember = await MemberRepository.getById(targetMemberId);
            if (!targetMember) {
                throw new Error('العضو المستهدف غير موجود');
            }

            // Swap roles
            await MemberRepository.update(currentOwnerId, { role: 'Administrator' });
            await MemberRepository.update(targetMemberId, { role: 'Owner' });
            
            return true;
        } catch (error) {
            console.error('Ownership transfer failed:', error);
            throw error;
        }
    }
};

export default OrganizationService;

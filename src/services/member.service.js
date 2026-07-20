import { MemberRepository } from '@/repositories/member.repository';

export const MemberService = {
    suspendMember: async (memberId) => {
        try {
            return await MemberRepository.update(memberId, { status: 'Suspended' });
        } catch (error) {
            console.error('Failed to suspend member:', error);
            throw error;
        }
    },

    reactivateMember: async (memberId) => {
        try {
            return await MemberRepository.update(memberId, { status: 'Active' });
        } catch (error) {
            console.error('Failed to reactivate member:', error);
            throw error;
        }
    },

    changeRole: async (memberId, newRole) => {
        try {
            return await MemberRepository.update(memberId, { role: newRole });
        } catch (error) {
            console.error('Failed to change member role:', error);
            throw error;
        }
    }
};

export default MemberService;

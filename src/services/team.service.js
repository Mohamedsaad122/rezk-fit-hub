import { TeamRepository } from '@/repositories/team.repository';
import { MemberRepository } from '@/repositories/member.repository';

export const TeamService = {
    addMemberToTeam: async (teamId, memberId) => {
        try {
            const team = await TeamRepository.getById(teamId);
            const member = await MemberRepository.getById(memberId);
            if (!team || !member) throw new Error('فريق أو عضو غير صالح');

            if (!team.memberIds.includes(memberId)) {
                const updatedMemberIds = [...team.memberIds, memberId];
                await TeamRepository.update(teamId, { memberIds: updatedMemberIds });
            }

            if (!member.teamIds.includes(teamId)) {
                const updatedTeamIds = [...member.teamIds, teamId];
                await MemberRepository.update(memberId, { teamIds: updatedTeamIds });
            }

            return true;
        } catch (error) {
            console.error('Failed to add member to team:', error);
            throw error;
        }
    },

    removeMemberFromTeam: async (teamId, memberId) => {
        try {
            const team = await TeamRepository.getById(teamId);
            const member = await MemberRepository.getById(memberId);
            if (!team || !member) throw new Error('فريق أو عضو غير صالح');

            const updatedMemberIds = team.memberIds.filter(id => id !== memberId);
            await TeamRepository.update(teamId, { memberIds: updatedMemberIds });

            const updatedTeamIds = member.teamIds.filter(id => id !== teamId);
            await MemberRepository.update(memberId, { teamIds: updatedTeamIds });

            return true;
        } catch (error) {
            console.error('Failed to remove member from team:', error);
            throw error;
        }
    }
};

export default TeamService;

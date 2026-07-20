import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamRepository } from '@/repositories/team.repository';
import { TeamService } from '@/services/team.service';

export const useTeams = () => {
    const queryClient = useQueryClient();

    const teamsQuery = useQuery({
        queryKey: ['saas', 'teams'],
        queryFn: () => TeamRepository.getAll()
    });

    const createTeamMutation = useMutation({
        mutationFn: (newTeam) => TeamRepository.create(newTeam),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
        }
    });

    const updateTeamMutation = useMutation({
        mutationFn: ({ id, data }) => TeamRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
        }
    });

    const deleteTeamMutation = useMutation({
        mutationFn: (id) => TeamRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
        }
    });

    const addMemberMutation = useMutation({
        mutationFn: ({ teamId, memberId }) => TeamService.addMemberToTeam(teamId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    const removeMemberMutation = useMutation({
        mutationFn: ({ teamId, memberId }) => TeamService.removeMemberFromTeam(teamId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    return {
        teams: teamsQuery.data || [],
        isLoading: teamsQuery.isLoading,
        isError: teamsQuery.isError,
        createTeam: createTeamMutation.mutateAsync,
        updateTeam: updateTeamMutation.mutateAsync,
        deleteTeam: deleteTeamMutation.mutateAsync,
        addMemberToTeam: addMemberMutation.mutateAsync,
        removeMemberFromTeam: removeMemberMutation.mutateAsync
    };
};

export const useTeam = (teamId) => {
    const teamQuery = useQuery({
        queryKey: ['saas', 'team', teamId],
        queryFn: () => TeamRepository.getById(teamId),
        enabled: !!teamId
    });

    return {
        team: teamQuery.data || null,
        isLoading: teamQuery.isLoading
    };
};

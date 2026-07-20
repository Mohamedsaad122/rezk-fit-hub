import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvitationRepository } from '@/repositories/invitation.repository';
import { InvitationService } from '@/services/invitation.service';

export const useInvitations = () => {
    const queryClient = useQueryClient();

    const invitationsQuery = useQuery({
        queryKey: ['saas', 'invitations'],
        queryFn: () => InvitationRepository.getAll()
    });

    const inviteMemberMutation = useMutation({
        mutationFn: ({ email, organizationId, role }) => 
            InvitationService.sendInvitation(email, organizationId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invitations'] });
        }
    });

    const acceptInvitationMutation = useMutation({
        mutationFn: (id) => InvitationService.acceptInvitation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invitations'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    const declineInvitationMutation = useMutation({
        mutationFn: (id) => InvitationService.declineInvitation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invitations'] });
        }
    });

    const cancelInvitationMutation = useMutation({
        mutationFn: (id) => InvitationService.cancelInvitation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invitations'] });
        }
    });

    return {
        invitations: invitationsQuery.data || [],
        isLoading: invitationsQuery.isLoading,
        isError: invitationsQuery.isError,
        inviteMember: inviteMemberMutation.mutateAsync,
        acceptInvitation: acceptInvitationMutation.mutateAsync,
        declineInvitation: declineInvitationMutation.mutateAsync,
        cancelInvitation: cancelInvitationMutation.mutateAsync
    };
};

export default useInvitations;

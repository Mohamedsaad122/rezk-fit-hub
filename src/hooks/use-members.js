import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MemberRepository } from '@/repositories/member.repository';
import { MemberService } from '@/services/member.service';

export const useMembers = () => {
    const queryClient = useQueryClient();

    const membersQuery = useQuery({
        queryKey: ['saas', 'members'],
        queryFn: () => MemberRepository.getAll()
    });

    const updateMemberMutation = useMutation({
        mutationFn: ({ id, data }) => MemberRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
        }
    });

    const suspendMemberMutation = useMutation({
        mutationFn: (id) => MemberService.suspendMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    const reactivateMemberMutation = useMutation({
        mutationFn: (id) => MemberService.reactivateMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    const changeRoleMutation = useMutation({
        mutationFn: ({ id, role }) => MemberService.changeRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    const deleteMemberMutation = useMutation({
        mutationFn: (id) => MemberRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'teams'] });
        }
    });

    return {
        members: membersQuery.data || [],
        isLoading: membersQuery.isLoading,
        isError: membersQuery.isError,
        updateMember: updateMemberMutation.mutateAsync,
        suspendMember: suspendMemberMutation.mutateAsync,
        reactivateMember: reactivateMemberMutation.mutateAsync,
        changeRole: changeRoleMutation.mutateAsync,
        deleteMember: deleteMemberMutation.mutateAsync
    };
};

export const useMember = (memberId) => {
    const memberQuery = useQuery({
        queryKey: ['saas', 'member', memberId],
        queryFn: () => MemberRepository.getById(memberId),
        enabled: !!memberId
    });

    return {
        member: memberQuery.data || null,
        isLoading: memberQuery.isLoading
    };
};

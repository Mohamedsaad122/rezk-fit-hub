import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizationRepository } from '@/repositories/organization.repository';
import { OrganizationService } from '@/services/organization.service';
import { useOrganizationStore } from '@/store/organization.store';

export const useOrganizations = () => {
    const queryClient = useQueryClient();
    const { setActiveOrganizationId, activeOrganizationId } = useOrganizationStore();

    const organizationsQuery = useQuery({
        queryKey: ['saas', 'organizations'],
        queryFn: () => OrganizationRepository.getAll()
    });

    const createOrgMutation = useMutation({
        mutationFn: (newOrg) => OrganizationRepository.create(newOrg),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'organizations'] });
        }
    });

    const updateOrgMutation = useMutation({
        mutationFn: ({ id, data }) => OrganizationRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'organizations'] });
        }
    });

    const deleteOrgMutation = useMutation({
        mutationFn: (id) => OrganizationRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'organizations'] });
        }
    });

    const transferOwnershipMutation = useMutation({
        mutationFn: ({ orgId, currentOwnerId, targetMemberId }) => 
            OrganizationService.transferOwnership(orgId, currentOwnerId, targetMemberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'members'] });
        }
    });

    return {
        organizations: organizationsQuery.data || [],
        isLoading: organizationsQuery.isLoading,
        isError: organizationsQuery.isError,
        activeOrganizationId,
        switchOrganization: (id) => {
            setActiveOrganizationId(id);
            queryClient.invalidateQueries();
        },
        createOrganization: createOrgMutation.mutateAsync,
        updateOrganization: updateOrgMutation.mutateAsync,
        deleteOrganization: deleteOrgMutation.mutateAsync,
        transferOwnership: transferOwnershipMutation.mutateAsync
    };
};

export const useOrganization = (orgId) => {
    const queryClient = useQueryClient();

    const organizationQuery = useQuery({
        queryKey: ['saas', 'organization', orgId],
        queryFn: () => OrganizationRepository.getById(orgId),
        enabled: !!orgId
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (settings) => OrganizationRepository.update(orgId, { settings }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'organization', orgId] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'organizations'] });
        }
    });

    return {
        organization: organizationQuery.data || null,
        isLoading: organizationQuery.isLoading,
        updateSettings: updateSettingsMutation.mutateAsync
    };
};

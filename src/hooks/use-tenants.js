import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TenantRepository } from '@/repositories/tenant.repository';
import { TenantService } from '@/services/tenant.service';

export const useTenants = () => {
    const queryClient = useQueryClient();

    const tenantsQuery = useQuery({
        queryKey: ['saas', 'tenants'],
        queryFn: () => TenantRepository.getAll()
    });

    const createTenantMutation = useMutation({
        mutationFn: (newTenant) => TenantRepository.create(newTenant),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'tenants'] });
        }
    });

    const updateTenantMutation = useMutation({
        mutationFn: ({ id, data }) => TenantRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'tenants'] });
        }
    });

    const deleteTenantMutation = useMutation({
        mutationFn: (id) => TenantRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'tenants'] });
        }
    });

    return {
        tenants: tenantsQuery.data || [],
        isLoading: tenantsQuery.isLoading,
        isError: tenantsQuery.isError,
        refetch: tenantsQuery.refetch,
        createTenant: createTenantMutation.mutateAsync,
        updateTenant: updateTenantMutation.mutateAsync,
        deleteTenant: deleteTenantMutation.mutateAsync
    };
};

export const useTenantSettings = (tenantId) => {
    const queryClient = useQueryClient();

    const settingsQuery = useQuery({
        queryKey: ['saas', 'tenant-settings', tenantId],
        queryFn: () => TenantRepository.getSettings(tenantId),
        enabled: !!tenantId
    });

    const updateSettingsMutation = useMutation({
        mutationFn: (brandingData) => TenantService.updateTenantBranding(tenantId, brandingData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'tenant-settings', tenantId] });
        }
    });

    return {
        settings: settingsQuery.data || null,
        isLoading: settingsQuery.isLoading,
        updateSettings: updateSettingsMutation.mutateAsync
    };
};

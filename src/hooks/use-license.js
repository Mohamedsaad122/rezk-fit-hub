import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LicenseRepository } from '@/repositories/license.repository';
import { LicenseService } from '@/services/license.service';

export const useLicenses = () => {
    const licensesQuery = useQuery({
        queryKey: ['saas', 'licenses'],
        queryFn: () => LicenseRepository.getAll()
    });

    return {
        licenses: licensesQuery.data || [],
        isLoading: licensesQuery.isLoading,
        isError: licensesQuery.isError
    };
};

export const useLicense = (tenantId) => {
    const queryClient = useQueryClient();

    const licenseQuery = useQuery({
        queryKey: ['saas', 'license', tenantId],
        queryFn: () => LicenseRepository.get(tenantId),
        enabled: !!tenantId
    });

    const updateLicenseMutation = useMutation({
        mutationFn: ({ id, data }) => LicenseRepository.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'license', tenantId] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'licenses'] });
        }
    });

    const validateLicenseMutation = useMutation({
        mutationFn: () => LicenseService.checkLicenseValidity(tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'license', tenantId] });
        }
    });

    return {
        license: licenseQuery.data || null,
        isLoading: licenseQuery.isLoading,
        updateLicense: updateLicenseMutation.mutateAsync,
        validateLicense: validateLicenseMutation.mutateAsync
    };
};

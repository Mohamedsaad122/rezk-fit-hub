import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLogService } from '@/services/auditLog.service';

export const useAuditLogs = (filters = {}) => {
    const query = useQuery({
        queryKey: ['auditLogs', filters],
        queryFn: () => AuditLogService.getAllLogs(filters),
        placeholderData: (prev) => prev
    });

    return {
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        data: query.data?.data || [],
        meta: query.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        refetch: query.refetch
    };
};

export const useCreateAuditLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (logData) => AuditLogService.createLog(logData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
        }
    });
};

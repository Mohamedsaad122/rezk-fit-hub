import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertsService } from '@/services/alerts.service';
import { useAlertsStore } from '@/store/alerts.store';

export const useAlerts = () => {
    const queryClient = useQueryClient();
    const { alerts, setAlerts, addAlert, resolveAlert: resolveInStore } = useAlertsStore();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['devops-alerts'],
        queryFn: async () => {
            const list = await AlertsService.getAlerts();
            setAlerts(list);
            return list;
        }
    });

    const triggerMutation = useMutation({
        mutationFn: async ({ title, message, severity, category }) => {
            return AlertsService.triggerAlert(title, message, severity, category);
        },
        onSuccess: (newAlert) => {
            addAlert(newAlert);
            queryClient.invalidateQueries(['devops-alerts']);
        }
    });

    const resolveMutation = useMutation({
        mutationFn: async (id) => {
            return AlertsService.resolveAlert(id);
        },
        onSuccess: (_, id) => {
            resolveInStore(id);
            queryClient.invalidateQueries(['devops-alerts']);
        }
    });

    return {
        alerts: data || alerts,
        isLoading,
        refetch,
        triggerAlert: triggerMutation.mutateAsync,
        resolveAlert: resolveMutation.mutateAsync
    };
};

export default useAlerts;

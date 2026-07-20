import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IntegrationRepository } from '@/repositories/integration.repository';
import { WebhookRepository } from '@/repositories/webhook.repository';
import { ProviderRepository } from '@/repositories/provider.repository';
import { WebhookService } from '@/services/webhook.service';
import { CalendarSyncService } from '@/services/calendar-sync.service';

export const useIntegrations = () => {
    const queryClient = useQueryClient();

    const integrationsQuery = useQuery({
        queryKey: ['saas', 'integrations'],
        queryFn: () => IntegrationRepository.getAll()
    });

    const webhooksQuery = useQuery({
        queryKey: ['saas', 'webhooks'],
        queryFn: () => WebhookRepository.getAll()
    });

    const webhookLogsQuery = useQuery({
        queryKey: ['saas', 'webhooks', 'logs'],
        queryFn: () => WebhookRepository.getLogs()
    });

    const syncLogsQuery = useQuery({
        queryKey: ['saas', 'sync', 'logs'],
        queryFn: () => ProviderRepository.getSyncLogs()
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ id, currentStatus }) => IntegrationRepository.update(id, {
            status: currentStatus === 'Connected' ? 'Disconnected' : 'Connected'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'integrations'] });
        }
    });

    const createWebhookMutation = useMutation({
        mutationFn: (data) => WebhookRepository.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'webhooks'] });
        }
    });

    const deleteWebhookMutation = useMutation({
        mutationFn: (id) => WebhookRepository.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'webhooks'] });
        }
    });

    const replayWebhookEventMutation = useMutation({
        mutationFn: (logId) => WebhookService.replayEvent(logId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'webhooks', 'logs'] });
        }
    });

    const triggerCalendarSyncMutation = useMutation({
        mutationFn: (provider) => CalendarSyncService.syncWithProvider(provider),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'sync', 'logs'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'integrations'] });
        }
    });

    return {
        integrations: integrationsQuery.data || [],
        isIntegrationsLoading: integrationsQuery.isLoading,

        webhooks: webhooksQuery.data || [],
        isWebhooksLoading: webhooksQuery.isLoading,

        webhookLogs: webhookLogsQuery.data || [],
        isWebhookLogsLoading: webhookLogsQuery.isLoading,

        syncLogs: syncLogsQuery.data || [],
        isSyncLogsLoading: syncLogsQuery.isLoading,

        toggleStatus: toggleStatusMutation.mutateAsync,
        isTogglingStatus: toggleStatusMutation.isPending,

        createWebhook: createWebhookMutation.mutateAsync,
        isCreatingWebhook: createWebhookMutation.isPending,

        deleteWebhook: deleteWebhookMutation.mutateAsync,
        isDeletingWebhook: deleteWebhookMutation.isPending,

        replayWebhookEvent: replayWebhookEventMutation.mutateAsync,
        isReplayingWebhookEvent: replayWebhookEventMutation.isPending,

        triggerCalendarSync: triggerCalendarSyncMutation.mutateAsync,
        isSyncingCalendar: triggerCalendarSyncMutation.isPending
    };
};

export default useIntegrations;

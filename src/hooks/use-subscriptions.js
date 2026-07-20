import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SubscriptionRepository } from '@/repositories/subscription.repository';

export const useSubscriptions = () => {
    const queryClient = useQueryClient();

    const subscriptionsQuery = useQuery({
        queryKey: ['saas', 'subscriptions'],
        queryFn: () => SubscriptionRepository.getAll()
    });

    return {
        subscriptions: subscriptionsQuery.data || [],
        isLoading: subscriptionsQuery.isLoading,
        isError: subscriptionsQuery.isError
    };
};

export const useSubscription = (tenantId) => {
    const queryClient = useQueryClient();

    const subscriptionQuery = useQuery({
        queryKey: ['saas', 'subscription', tenantId],
        queryFn: () => SubscriptionRepository.get(tenantId),
        enabled: !!tenantId
    });

    const updateSubscriptionMutation = useMutation({
        mutationFn: ({ data }) => SubscriptionRepository.update(tenantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'subscription', tenantId] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'subscriptions'] });
        }
    });

    return {
        subscription: subscriptionQuery.data || null,
        isLoading: subscriptionQuery.isLoading,
        updateSubscription: updateSubscriptionMutation.mutateAsync
    };
};

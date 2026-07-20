import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingRepository } from '@/repositories/billing.repository';
import { SubscriptionRepository } from '@/repositories/subscription.repository';
import { BillingService } from '@/services/billing.service';

export const useBilling = (tenantId = 1) => {
    const queryClient = useQueryClient();

    const billingQuery = useQuery({
        queryKey: ['saas', 'billing'],
        queryFn: () => BillingRepository.get()
    });

    const subscriptionQuery = useQuery({
        queryKey: ['saas', 'subscription', tenantId],
        queryFn: () => SubscriptionRepository.get(tenantId)
    });

    const updateBillingMutation = useMutation({
        mutationFn: (data) => BillingRepository.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'billing'] });
        }
    });

    const renewSubscriptionMutation = useMutation({
        mutationFn: () => BillingService.renewSubscription(tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'subscription', tenantId] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'billing'] });
        }
    });

    const cancelSubscriptionMutation = useMutation({
        mutationFn: () => BillingService.cancelSubscription(tenantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'subscription', tenantId] });
        }
    });

    return {
        billingProfile: billingQuery.data || null,
        isBillingLoading: billingQuery.isLoading,
        subscription: subscriptionQuery.data || null,
        isSubscriptionLoading: subscriptionQuery.isLoading,
        updateBilling: updateBillingMutation.mutateAsync,
        renewSubscription: renewSubscriptionMutation.mutateAsync,
        cancelSubscription: cancelSubscriptionMutation.mutateAsync
    };
};

export default useBilling;

import { SubscriptionRepository } from '@/repositories/subscription.repository';
import { eventBus } from '@/realtime/event-bus';

export const BillingService = {
    renewSubscription: async (tenantId) => {
        try {
            const subscription = await SubscriptionRepository.get(tenantId);
            if (!subscription) throw new Error('الاشتراك غير موجود');

            const currentEndDate = new Date(subscription.endDate);
            const newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1)).toISOString();

            const updated = await SubscriptionRepository.update(tenantId, {
                status: 'Active',
                startDate: new Date().toISOString(),
                endDate: newEndDate
            });

            eventBus.publish('SUBSCRIPTION_RENEWED', updated);
            return updated;
        } catch (error) {
            console.error('Failed to renew subscription:', error);
            throw error;
        }
    },

    cancelSubscription: async (tenantId) => {
        try {
            const updated = await SubscriptionRepository.update(tenantId, {
                status: 'Cancelled'
            });
            return updated;
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            throw error;
        }
    },

    expireSubscription: async (tenantId) => {
        try {
            const updated = await SubscriptionRepository.update(tenantId, {
                status: 'Expired'
            });
            return updated;
        } catch (error) {
            console.error('Failed to expire subscription:', error);
            throw error;
        }
    },

    markPastDue: async (tenantId) => {
        try {
            const updated = await SubscriptionRepository.update(tenantId, {
                status: 'PastDue'
            });
            return updated;
        } catch (error) {
            console.error('Failed to update subscription to PastDue:', error);
            throw error;
        }
    }
};

export default BillingService;

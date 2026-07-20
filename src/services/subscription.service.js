import { SubscriptionRepository } from '@/repositories/subscription.repository';

export const PLAN_LIMITS = {
    Starter: {
        users: 3,
        storageGb: 5,
        reportsEnabled: false,
        analyticsEnabled: true,
        realtimeEnabled: false,
        exportsEnabled: false,
        apiAccessEnabled: false
    },
    Professional: {
        users: 10,
        storageGb: 20,
        reportsEnabled: true,
        analyticsEnabled: true,
        realtimeEnabled: true,
        exportsEnabled: true,
        apiAccessEnabled: false
    },
    Business: {
        users: 20,
        storageGb: 50,
        reportsEnabled: true,
        analyticsEnabled: true,
        realtimeEnabled: true,
        exportsEnabled: true,
        apiAccessEnabled: true
    },
    Enterprise: {
        users: 100,
        storageGb: 500,
        reportsEnabled: true,
        analyticsEnabled: true,
        realtimeEnabled: true,
        exportsEnabled: true,
        apiAccessEnabled: true
    },
    Unlimited: {
        users: 999999,
        storageGb: 999999,
        reportsEnabled: true,
        analyticsEnabled: true,
        realtimeEnabled: true,
        exportsEnabled: true,
        apiAccessEnabled: true
    }
};

export const SubscriptionService = {
    getLimitsForPlan: (planId) => {
        return PLAN_LIMITS[planId] || PLAN_LIMITS.Starter;
    },

    checkQuotaLimit: async (tenantId, limitKey, currentCount) => {
        try {
            const subscription = await SubscriptionRepository.get(tenantId);
            if (!subscription) return false;
            
            const limits = subscription.limits || PLAN_LIMITS[subscription.planId] || PLAN_LIMITS.Starter;
            const max = limits[limitKey];
            
            if (typeof max === 'boolean') {
                return max;
            }
            return currentCount < max;
        } catch (error) {
            console.error('Failed to verify subscription quotas limit:', error);
            return false;
        }
    }
};

export default SubscriptionService;

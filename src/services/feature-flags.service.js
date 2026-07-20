import { FeatureFlagsRepository } from '@/repositories/feature-flags.repository';
import { SubscriptionRepository } from '@/repositories/subscription.repository';
import { eventBus } from '@/realtime/event-bus';

export const FeatureFlagsService = {
    getFeatureFlags: async () => {
        return FeatureFlagsRepository.getAll();
    },

    isEnabled: async (flagKey, tenantId, _context = {}) => {
        try {
            const flags = await FeatureFlagsRepository.getAll();
            const flag = flags.find(f => f.key === flagKey);
            if (flag) {
                if (flag.status === 'Disabled') return false;
                
                if (flag.rolloutPercent !== undefined) {
                    const tenantNum = Number(tenantId || 1);
                    const isRolloutMatch = (tenantNum * 17) % 100 < flag.rolloutPercent;
                    if (!isRolloutMatch) return false;
                }
                return flag.status === 'Active';
            }

            const subscription = await SubscriptionRepository.get(tenantId);
            if (!subscription) return false;

            const FALLBACK_POLICIES = {
                nutritionModule: ['Professional', 'Business', 'Enterprise', 'Unlimited'],
                analyticsDashboard: ['Starter', 'Professional', 'Business', 'Enterprise', 'Unlimited'],
                betaRealtime: ['Business', 'Enterprise', 'Unlimited'],
                exportPDF: ['Professional', 'Business', 'Enterprise', 'Unlimited']
            };

            const allowedPlans = FALLBACK_POLICIES[flagKey];
            if (!allowedPlans) return false;
            return allowedPlans.includes(subscription.planId);
        } catch {
            return false;
        }
    },

    updateFlag: async (key, updates) => {
        const flag = await FeatureFlagsRepository.update(key, updates);
        eventBus.publish('FEATURE_FLAG_UPDATED', flag);
        return flag;
    },

    createFlag: async (data) => {
        const flag = await FeatureFlagsRepository.create(data);
        eventBus.publish('FEATURE_FLAG_UPDATED', flag);
        return flag;
    }
};

export default FeatureFlagsService;

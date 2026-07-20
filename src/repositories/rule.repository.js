import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AutomationRuleSchema, AutomationRuleListSchema } from '@/contracts/rule.contract';

export const RuleRepository = {
    getRules: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.automationRules.getAll());
        } else {
            const res = await api.get('/api/saas/rules');
            result = res.data;
        }
        return parseApiResponse(AutomationRuleListSchema, result, 'Rules List');
    },

    createRule: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.automationRules.create(data));
        } else {
            const res = await api.post('/api/saas/rules', data);
            result = res.data;
        }
        return parseApiResponse(AutomationRuleSchema, result, 'Rule Create');
    },

    deleteRule: async (id) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.automationRules.delete(id));
        } else {
            const res = await api.delete(`/api/saas/rules/${id}`);
            return res.data.success;
        }
    }
};

export default RuleRepository;

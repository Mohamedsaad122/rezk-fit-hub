import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { AIInsightsRepository } from '../repositories/ai-insights.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.3 AI Insights & Predictive Warnings', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should query predictive insights lists isolated by tenant context', async () => {
        TenantRepository.setActiveTenant(1);

        const list = await AIInsightsRepository.getAll();
        expect(list.length).toBe(2);
        expect(list[0].title).toBe('احتمالية انسحاب عالية لبعض المتدربين');
    });

    it('should create new insights and publish notification events', async () => {
        TenantRepository.setActiveTenant(1);

        const newInsight = await AIInsightsRepository.createInsight({
            type: 'General',
            title: 'تقييم الالتزام العام',
            content: 'مستويات النشاط جيدة جداً هذا الأسبوع.',
            recommendedActions: ['الاستمرار على التنبيهات الحالية']
        });
        expect(newInsight.id).toBeDefined();

        const all = await AIInsightsRepository.getAll();
        expect(all.length).toBe(3);
    });
});

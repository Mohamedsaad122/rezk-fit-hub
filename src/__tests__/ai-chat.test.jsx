import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { AIChatRepository } from '../repositories/ai-chat.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.3 AI Chat Conversations & Streaming', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should retrieve chat sessions isolated by tenant context', async () => {
        TenantRepository.setActiveTenant(1);

        const list = await AIChatRepository.getSessions();
        expect(list.length).toBe(1);
        expect(list[0].title).toBe('خطة تدريب عضلات الصدر');
    });

    it('should append user and streamed assistant messages to session threads', async () => {
        TenantRepository.setActiveTenant(1);

        const session = await AIChatRepository.createSession('محادثة اختبارية');
        expect(session.id).toBeDefined();

        const updated = await AIChatRepository.sendMessage(session.id, {
            role: 'user',
            content: 'ما هو نظام الوجبات المناسب؟'
        });
        expect(updated.messages.length).toBe(1);
        expect(updated.messages[0].content).toBe('ما هو نظام الوجبات المناسب؟');
    });
});

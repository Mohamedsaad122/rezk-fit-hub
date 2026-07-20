import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { AutomationService } from '../services/automation.service';
import { WorkflowService } from '../services/workflow.service';
import { AutomationRepository } from '../repositories/automation.repository';

describe('Event Automation & Realtime Event Broker Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should trigger automation events, log success, and publish realtime broker events', async () => {
        // Subscribe to events
        const receivedEvents = [];
        const unsubscribe = AutomationService.subscribe((evt) => {
            receivedEvents.push(evt);
        });

        // Trigger Event
        const eventName = 'ClientCreated';
        const payload = { clientId: 42, name: 'سيد محمد' };
        await AutomationService.triggerEvent(eventName, payload);

        // Check if logs are written
        const logs = await AutomationRepository.getLogs();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0].triggerEvent).toBe(eventName);

        // Check if event was broadcasted
        expect(receivedEvents.some(e => e.eventName === eventName)).toBe(true);
        expect(receivedEvents.some(e => e.eventName === 'AUTOMATION_TRIGGERED')).toBe(true);

        unsubscribe();
    });

    it('should match and automatically execute active workflows of correct trigger type', async () => {
        // Create active workflow for trigger type ClientDeleted
        const wf = await WorkflowService.createWorkflow(
            'أتمتة حذف العميل',
            'حذف خطط العميل تلقائيا عند حذفه',
            'ClientDeleted',
            [
                { id: 'node_1', type: 'Trigger', label: 'بدء الحذف' },
                { id: 'node_2', type: 'Delay', label: 'تأخير', parameters: { seconds: 1 } }
            ],
            [],
            'Active'
        );

        const runsBefore = await WorkflowService.getWorkflowRuns();
        expect(runsBefore.length).toBe(0);

        // Trigger event
        await AutomationService.triggerEvent('ClientDeleted', { clientId: 10 });

        // Run is created and executed
        const runsAfter = await WorkflowService.getWorkflowRuns();
        expect(runsAfter.length).toBe(1);
        expect(runsAfter[0].workflowId).toBe(wf.id);
    });
});

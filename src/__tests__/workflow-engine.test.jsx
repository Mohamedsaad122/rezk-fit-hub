import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { WorkflowService } from '../services/workflow.service';
import { WorkflowEngineService } from '../services/workflow-engine.service';

describe('Workflow Engine Execution Steps & Gates Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should run custom visual nodes and mark status completed', async () => {
        const wf = await WorkflowService.createWorkflow(
            'التسلسلي',
            'تشغيل خطوتين',
            'ClientCreated',
            [
                { id: 'step_1', type: 'Trigger', label: 'Start Trigger' },
                { id: 'step_2', type: 'Delay', label: 'Wait 1 Sec', parameters: { seconds: 1 } }
            ]
        );

        const run = await WorkflowService.triggerRun(wf.id);
        const result = await WorkflowEngineService.executeRun(run.id);

        expect(result.status).toBe('Completed');
        expect(result.executedNodes).toContain('step_1');
        expect(result.executedNodes).toContain('step_2');
    });

    it('should halt branches execution if any conditional node fails evaluation', async () => {
        const wf = await WorkflowService.createWorkflow(
            'شرطي',
            'فحص بوابة شرطية',
            'ClientCreated',
            [
                { id: 'step_1', type: 'Trigger', label: 'Start' },
                { id: 'step_2', type: 'Condition', label: 'IF Value is True', parameters: { value: false } },
                { id: 'step_3', type: 'Action', label: 'Send Mail' }
            ]
        );

        const run = await WorkflowService.triggerRun(wf.id);
        const result = await WorkflowEngineService.executeRun(run.id);

        // Stops at condition, doesn't execute step 3
        expect(result.status).toBe('Completed');
        expect(result.executedNodes).toContain('step_1');
        expect(result.executedNodes).toContain('step_2');
        expect(result.executedNodes).not.toContain('step_3');
    });
});

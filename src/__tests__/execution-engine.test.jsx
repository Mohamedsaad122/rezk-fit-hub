import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { WorkflowService } from '../services/workflow.service';
import { ExecutionEngineService } from '../services/execution-engine.service';
import { AutomationService } from '../services/automation.service';

describe('Workflow Execution Engine Pipeline & Rollbacks Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should execute sequential workflows through execution engine, log completion, and emit event notifications', async () => {
        const wf = await WorkflowService.createWorkflow(
            'أتمتة الفواتير المكتملة',
            'إشعار نجاح سداد واحتساب نسب النجاح',
            'InvoiceGenerated',
            [
                { id: 'node_1', type: 'Trigger', label: 'بدء' },
                { id: 'node_2', type: 'Action', label: 'إشعار فوري', parameters: { text: 'نجح الدفع' } }
            ],
            [
                { source: 'node_1', target: 'node_2' }
            ],
            'Active'
        );

        const receivedEvents = [];
        const unsubscribe = AutomationService.subscribe(evt => {
            receivedEvents.push(evt.eventName);
        });

        const res = await ExecutionEngineService.triggerAndRun(wf.id);
        expect(res.status).toBe('Completed');
        expect(res.executedNodes).toContain('node_1');
        expect(res.executedNodes).toContain('node_2');

        expect(receivedEvents).toContain('WORKFLOW_STARTED');
        expect(receivedEvents).toContain('WORKFLOW_COMPLETED');

        unsubscribe();
    });

    it('should halt branch routing when conditional node evaluates to false', async () => {
        const wf = await WorkflowService.createWorkflow(
            'مسار عمل شرطي متقدم',
            'التحقق من صحة الشرط المرئي',
            'WorkoutAssigned',
            [
                { id: 't1', type: 'Trigger', label: 'Start' },
                { id: 'c1', type: 'Condition', label: 'IF Value', parameters: { value: false } },
                { id: 'a1', type: 'Action', label: 'Action after Condition' }
            ],
            [
                { source: 't1', target: 'c1' },
                { source: 'c1', target: 'a1', condition: 'true' }
            ],
            'Active'
        );

        const res = await ExecutionEngineService.triggerAndRun(wf.id);
        expect(res.status).toBe('Completed');
        expect(res.executedNodes).toContain('t1');
        expect(res.executedNodes).toContain('c1');
        expect(res.executedNodes).not.toContain('a1');
    });

    it('should apply rollback nodes when node executes with failure', async () => {
        // Create workflow where action throws failure, but has rollback configuration
        const wf = await WorkflowService.createWorkflow(
            'مسار مع استرجاع أخطاء',
            'عند حدوث خطأ يتم تفعيل خطوة الاسترجاع',
            'ClientCreated',
            [
                { id: 't1', type: 'Trigger', label: 'بدء' },
                { 
                    id: 'act_fail', 
                    type: 'Action', 
                    label: 'إجراء فاشل بالمهلة', 
                    parameters: { 
                        fail: true,
                        timeoutSeconds: 0.001,
                        rollbackNodeId: 'act_rollback' 
                    } 
                },
                { id: 'act_rollback', type: 'Action', label: 'خطوة التراجع والإنقاذ' }
            ],
            [
                { source: 't1', target: 'act_fail' }
            ],
            'Active'
        );

        const res = await ExecutionEngineService.triggerAndRun(wf.id);
        expect(res.status).toBe('Failed');
        expect(res.executedNodes).toContain('t1');
        expect(res.executedNodes).toContain('act_fail');
        expect(res.executedNodes).toContain('act_rollback'); // rollback executed
    });
});

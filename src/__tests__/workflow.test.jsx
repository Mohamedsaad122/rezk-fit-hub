import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { WorkflowService } from '../services/workflow.service';

describe('Workflow CRUD & Templates Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should create a custom workflow in draft mode and list all workflows', async () => {
        const wf = await WorkflowService.createWorkflow(
            'أتمتة الفواتير تلقائياً',
            'إرسال تنبيه بالبريد لكل فاتورة جديدة',
            'InvoiceGenerated',
            [{ id: 'n1', type: 'Trigger', label: 'بدء' }],
            []
        );

        expect(wf.id).toBeDefined();
        expect(wf.name).toBe('أتمتة الفواتير تلقائياً');
        expect(wf.status).toBe('Draft');

        const all = await WorkflowService.getWorkflows();
        expect(all.length).toBe(1);
    });

    it('should delete a workflow configuration from registry', async () => {
        const wf = await WorkflowService.createWorkflow('تمرين مهمل', 'حذف', 'ClientCreated');
        const listBefore = await WorkflowService.getWorkflows();
        expect(listBefore.length).toBe(1);

        await WorkflowService.deleteWorkflow(wf.id);
        const listAfter = await WorkflowService.getWorkflows();
        expect(listAfter.length).toBe(0);
    });
});

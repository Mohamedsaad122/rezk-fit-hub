import { WorkflowService } from './workflow.service';
import { WorkflowEngineService } from './workflow-engine.service';
import { AutomationService } from './automation.service';

export const ExecutionEngineService = {
    triggerAndRun: async (workflowId) => {
        const run = await WorkflowService.triggerRun(workflowId);
        AutomationService.publishRealtimeEvent('WORKFLOW_STARTED', run);
        
        try {
            const res = await WorkflowEngineService.executeRun(run.id);
            if (res.status === 'Completed') {
                AutomationService.publishRealtimeEvent('WORKFLOW_COMPLETED', { runId: run.id });
            } else {
                AutomationService.publishRealtimeEvent('WORKFLOW_FAILED', { runId: run.id, error: res.error });
            }
            return res;
        } catch (err) {
            AutomationService.publishRealtimeEvent('WORKFLOW_FAILED', { runId: run.id, error: err.message });
            return { status: 'Failed', error: err.message };
        }
    }
};

export default ExecutionEngineService;

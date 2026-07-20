import { WorkflowRepository } from '@/repositories/workflow.repository';
import { WorkflowEngineService } from './workflow-engine.service';
import { AutomationRepository } from '@/repositories/automation.repository';

// Keep track of event listeners for realtime integrations
const listeners = new Set();

export const AutomationService = {
    triggerEvent: async (eventName, payload = {}) => {
        // 1. Log event
        await AutomationRepository.createLog({
            ruleId: 1,
            triggerEvent: eventName,
            status: 'Success',
            details: `Event "${eventName}" triggered successfully.`
        });

        // 2. Publish realtime event notifications
        AutomationService.publishRealtimeEvent(eventName, payload);
        AutomationService.publishRealtimeEvent('AUTOMATION_TRIGGERED', { eventName, payload });

        // 3. Match workflows with the same triggerType
        const workflows = await WorkflowRepository.getWorkflows();
        const matches = workflows.filter(w => w.triggerType === eventName && w.status === 'Active');

        const runs = [];
        for (const w of matches) {
            const run = await WorkflowRepository.createWorkflowRun({
                workflowId: w.id,
                status: 'Running',
                executedNodes: [],
                startTime: new Date().toISOString()
            });
            
            // Execute run asynchronously or synchronously
            const result = await WorkflowEngineService.executeRun(run.id);
            runs.push({ workflowId: w.id, runId: run.id, status: result.status });
        }

        return runs;
    },

    subscribe: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },

    publishRealtimeEvent: (eventName, data) => {
        listeners.forEach(cb => cb({ eventName, data, timestamp: new Date().toISOString() }));
    }
};

export default AutomationService;

import { WorkflowRepository } from '@/repositories/workflow.repository';

export const WorkflowService = {
    getWorkflows: async () => {
        return WorkflowRepository.getWorkflows();
    },

    createWorkflow: async (name, description, triggerType, nodes = [], edges = [], status = 'Draft') => {
        const payload = {
            name,
            description,
            triggerType,
            nodes,
            edges,
            status,
            version: 1
        };
        return WorkflowRepository.createWorkflow(payload);
    },

    deleteWorkflow: async (id) => {
        return WorkflowRepository.deleteWorkflow(id);
    },

    getWorkflowRuns: async () => {
        return WorkflowRepository.getWorkflowRuns();
    },

    triggerRun: async (workflowId) => {
        const payload = {
            workflowId,
            status: 'Running',
            executedNodes: [],
            startTime: new Date().toISOString()
        };
        return WorkflowRepository.createWorkflowRun(payload);
    }
};

export default WorkflowService;

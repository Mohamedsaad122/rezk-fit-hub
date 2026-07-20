import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { WorkflowSchema, WorkflowListSchema } from '@/contracts/workflow.contract';
import { WorkflowRunSchema, WorkflowRunListSchema } from '@/contracts/workflow-run.contract';

export const WorkflowRepository = {
    getWorkflows: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.workflows.getAll());
        } else {
            const res = await api.get('/api/saas/workflows');
            result = res.data;
        }
        return parseApiResponse(WorkflowListSchema, result, 'Workflows List');
    },

    createWorkflow: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.workflows.create(data));
        } else {
            const res = await api.post('/api/saas/workflows', data);
            result = res.data;
        }
        return parseApiResponse(WorkflowSchema, result, 'Workflow Create');
    },

    deleteWorkflow: async (id) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.workflows.delete(id));
        } else {
            const res = await api.delete(`/api/saas/workflows/${id}`);
            return res.data.success;
        }
    },

    getWorkflowRuns: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.workflowRuns.getAll());
        } else {
            const res = await api.get('/api/saas/workflows/runs');
            result = res.data;
        }
        return parseApiResponse(WorkflowRunListSchema, result, 'Workflow Runs List');
    },

    createWorkflowRun: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.workflowRuns.create(data));
        } else {
            const res = await api.post('/api/saas/workflows/runs', data);
            result = res.data;
        }
        return parseApiResponse(WorkflowRunSchema, result, 'Workflow Run Create');
    },

    updateWorkflowRunStatus: async (runId, status, error = null) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.workflowRuns.updateStatus(runId, status, error));
        } else {
            const res = await api.patch(`/api/saas/workflows/runs/${runId}`, { status, error });
            return res.data;
        }
    }
};

export default WorkflowRepository;

import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ApprovalRequestSchema, ApprovalRequestListSchema } from '@/contracts/approval.contract';

export const ApprovalRepository = {
    getApprovals: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.approvals.getAll());
        } else {
            const res = await api.get('/api/saas/approvals');
            result = res.data;
        }
        return parseApiResponse(ApprovalRequestListSchema, result, 'Approvals List');
    },

    createApproval: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.approvals.create(data));
        } else {
            const res = await api.post('/api/saas/approvals', data);
            result = res.data;
        }
        return parseApiResponse(ApprovalRequestSchema, result, 'Approval Create');
    },

    updateApprovalStatus: async (id, status, response = null) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.approvals.update(id, status, response));
        } else {
            const res = await api.patch(`/api/saas/approvals/${id}`, { status, response });
            result = res.data;
        }
        return parseApiResponse(ApprovalRequestSchema, result, 'Approval Status Update');
    }
};

export default ApprovalRepository;

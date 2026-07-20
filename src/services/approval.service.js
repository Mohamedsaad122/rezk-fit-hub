import { ApprovalRepository } from '@/repositories/approval.repository';
import { AutomationService } from './automation.service';

export const ApprovalService = {
    getApprovals: async () => {
        return ApprovalRepository.getApprovals();
    },

    createApprovalRequest: async (title, description, approvers = [], maxLevels = 1, options = {}) => {
        const payload = {
            title,
            description,
            approvers,
            maxLevels,
            parallel: options.parallel ?? false,
            timeoutHours: options.timeoutHours ?? 24,
            status: 'Pending',
            currentLevel: 1,
            responses: []
        };
        const req = await ApprovalRepository.createApproval(payload);
        AutomationService.publishRealtimeEvent('APPROVAL_REQUESTED', req);
        return req;
    },

    submitDecision: async (approvalId, approver, decision, comment = '') => {
        const list = await ApprovalRepository.getApprovals();
        const request = list.find(a => String(a.id) === String(approvalId));
        if (!request) {
            throw new Error(`Approval request ${approvalId} not found`);
        }

        if (request.status !== 'Pending' && request.status !== 'Escalated') {
            throw new Error('Approval request is already resolved');
        }

        const newResponse = {
            level: request.currentLevel,
            approver,
            decision,
            comment,
            timestamp: new Date().toISOString()
        };

        const updatedResponses = [...(request.responses || []), newResponse];
        let nextStatus = 'Pending';
        let nextLevel = request.currentLevel;

        if (decision === 'Rejected') {
            nextStatus = 'Rejected';
            AutomationService.publishRealtimeEvent('APPROVAL_REJECTED', { approvalId, decision, comment });
        } else if (decision === 'Approved') {
            let isLevelFullyApproved = true;
            if (request.parallel) {
                const levelApprovals = updatedResponses.filter(r => r.level === request.currentLevel && r.decision === 'Approved');
                const requiredApprovers = request.approvers || [];
                isLevelFullyApproved = requiredApprovers.every(appr => levelApprovals.some(r => r.approver === appr));
            }

            if (isLevelFullyApproved) {
                if (request.currentLevel >= request.maxLevels) {
                    nextStatus = 'Approved';
                    AutomationService.publishRealtimeEvent('APPROVAL_APPROVED', { approvalId, decision, comment });
                } else {
                    nextLevel = request.currentLevel + 1;
                }
            }
        }

        const updateData = {
            responses: updatedResponses,
            status: nextStatus,
            currentLevel: nextLevel,
            updatedAt: new Date().toISOString()
        };

        return ApprovalRepository.updateApprovalStatus(approvalId, nextStatus, updateData);
    },

    escalateApproval: async (approvalId) => {
        const list = await ApprovalRepository.getApprovals();
        const request = list.find(a => String(a.id) === String(approvalId));
        if (!request) return null;

        const updateData = {
            status: 'Escalated',
            escalatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const updated = await ApprovalRepository.updateApprovalStatus(approvalId, 'Escalated', updateData);
        AutomationService.publishRealtimeEvent('APPROVAL_REJECTED', { approvalId, decision: 'Escalated', comment: 'Auto escalated due to timeout' });
        return updated;
    }
};

export default ApprovalService;

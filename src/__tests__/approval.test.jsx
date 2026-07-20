import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { ApprovalService } from '../services/approval.service';
import { ApprovalRepository } from '../repositories/approval.repository';
import { AutomationService } from '../services/automation.service';

describe('Multi-Level & Parallel Approval Engine Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should create approval requests, submit sequential decisions, and transition status to approved', async () => {
        // Create 2-level sequential approval request
        const req = await ApprovalService.createApprovalRequest(
            'طلب شراء معدات رياضية للفرع',
            'اعتماد مالي للفرع الجديد بقيمة 15000',
            ['manager1@fit.com', 'director1@fit.com'],
            2
        );

        expect(req.id).toBeDefined();
        expect(req.status).toBe('Pending');
        expect(req.currentLevel).toBe(1);

        // Submit first approval (Level 1)
        const res1 = await ApprovalService.submitDecision(req.id, 'manager1@fit.com', 'Approved', 'موافق من طرف مدير الفرع');
        expect(res1.status).toBe('Pending'); // still pending level 2
        expect(res1.currentLevel).toBe(2);

        // Submit second approval (Level 2)
        const res2 = await ApprovalService.submitDecision(req.id, 'director1@fit.com', 'Approved', 'موافق ومكتمل من طرف المدير التنفيذي');
        expect(res2.status).toBe('Approved'); // fully approved
    });

    it('should implement reject flows that instantly reject the entire sequence', async () => {
        const req = await ApprovalService.createApprovalRequest(
            'سلفة مدرب',
            'طلب سلفة مالية بقيمة 2000',
            ['manager1@fit.com', 'director1@fit.com'],
            2
        );

        // Level 1 Rejects
        const res = await ApprovalService.submitDecision(req.id, 'manager1@fit.com', 'Rejected', 'مرفوض لعدم استيفاء الشروط');
        expect(res.status).toBe('Rejected');
        expect(res.currentLevel).toBe(1); // halted at level 1
    });

    it('should support parallel approvals requiring all approvers at the level to sign off', async () => {
        // Create parallel approval request
        const req = await ApprovalService.createApprovalRequest(
            'طلب تعديل تصميم الصالة',
            'موافقة مشتركة من قسم التصميم وقسم العمليات',
            ['designer@fit.com', 'ops@fit.com'],
            1,
            { parallel: true }
        );

        // Approver 1 approves
        const res1 = await ApprovalService.submitDecision(req.id, 'designer@fit.com', 'Approved', 'موافقة المصمم');
        expect(res1.status).toBe('Pending'); // Still pending because ops@fit.com hasn't approved yet

        // Approver 2 approves
        const res2 = await ApprovalService.submitDecision(req.id, 'ops@fit.com', 'Approved', 'موافقة العمليات');
        expect(res2.status).toBe('Approved'); // fully approved
    });

    it('should handle timeout escalation triggers and update status correctly', async () => {
        const req = await ApprovalService.createApprovalRequest(
            'شراء وجبات بروتين',
            'اعتماد فوري سريع',
            ['finance@fit.com'],
            1
        );

        const escalated = await ApprovalService.escalateApproval(req.id);
        expect(escalated.status).toBe('Escalated');
    });
});

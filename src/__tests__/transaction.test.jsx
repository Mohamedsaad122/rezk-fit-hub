import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { PaymentRepository } from '../repositories/payment.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Transaction General Ledger', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should retrieve general ledger transactions filtered by tenantId', async () => {
        TenantRepository.setActiveTenant(1);

        const list = await PaymentRepository.getTransactions();
        expect(list.length).toBe(1);
        expect(list[0].amount).toBe(1035);
        expect(list[0].type).toBe('Credit');
    });
});

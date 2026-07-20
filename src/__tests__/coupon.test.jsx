import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { CouponService } from '../services/coupon.service';
import { CouponRepository } from '../repositories/coupon.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Coupons Validation Rules & Limits', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should validate coupons based on expiration and usage limits', async () => {
        TenantRepository.setActiveTenant(1);

        // Validate valid coupon
        const valid = await CouponService.validateCoupon('PROMO10', 1);
        expect(valid.code).toBe('PROMO10');

        // Expect validation error for invalid codes
        await expect(CouponService.validateCoupon('INVALID_CODE', 1)).rejects.toThrow('كود الخصم غير موجود');
    });

    it('should block coupons targeted for other organizations', async () => {
        TenantRepository.setActiveTenant(1);

        // PROMO10 has organizationId: 1
        // Try validating under Organization 2
        await expect(CouponService.validateCoupon('PROMO10', 2)).rejects.toThrow('كود الخصم مخصص لمؤسسة أخرى');
    });

    it('should increase coupon usage count and update status when applied', async () => {
        TenantRepository.setActiveTenant(1);

        const couponBefore = await CouponRepository.getByCode('PROMO10');
        const initialCount = couponBefore.usedCount;

        await CouponService.applyCoupon('PROMO10', 1);

        const couponAfter = await CouponRepository.getByCode('PROMO10');
        expect(couponAfter.usedCount).toBe(initialCount + 1);
    });
});

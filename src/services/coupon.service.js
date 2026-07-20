import { CouponRepository } from '@/repositories/coupon.repository';

export const CouponService = {
    validateCoupon: async (code, organizationId = null) => {
        try {
            const coupon = await CouponRepository.getByCode(code);
            if (!coupon) {
                throw new Error('كود الخصم غير موجود');
            }

            if (coupon.status !== 'Active') {
                throw new Error('كود الخصم غير فعال حالياً');
            }

            if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
                throw new Error('كود الخصم منتهي الصلاحية');
            }

            if (coupon.usedCount >= coupon.maxUses) {
                throw new Error('كود الخصم استنفد الحد الأقصى للاستخدام');
            }

            if (coupon.organizationId && Number(coupon.organizationId) !== Number(organizationId)) {
                throw new Error('كود الخصم مخصص لمؤسسة أخرى');
            }

            return coupon;
        } catch (error) {
            console.error('Coupon validation error:', error);
            throw error;
        }
    },

    applyCoupon: async (code, organizationId = null) => {
        try {
            const coupon = await CouponService.validateCoupon(code, organizationId);
            
            await CouponRepository.update(coupon.id, {
                usedCount: coupon.usedCount + 1,
                status: coupon.usedCount + 1 >= coupon.maxUses ? 'MaxedOut' : 'Active'
            });

            return coupon;
        } catch (error) {
            console.error('Failed to apply coupon:', error);
            throw error;
        }
    }
};

export default CouponService;

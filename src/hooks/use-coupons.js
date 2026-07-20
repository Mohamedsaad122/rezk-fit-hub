import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CouponRepository } from '@/repositories/coupon.repository';
import { CouponService } from '@/services/coupon.service';

export const useCoupons = () => {
    const queryClient = useQueryClient();

    const couponsQuery = useQuery({
        queryKey: ['saas', 'coupons'],
        queryFn: () => CouponRepository.getAll()
    });

    const createCouponMutation = useMutation({
        mutationFn: (data) => CouponRepository.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'coupons'] });
        }
    });

    const applyCouponMutation = useMutation({
        mutationFn: ({ code, organizationId }) => 
            CouponService.applyCoupon(code, organizationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'coupons'] });
        }
    });

    const validateCouponMutation = useMutation({
        mutationFn: ({ code, organizationId }) => 
            CouponService.validateCoupon(code, organizationId)
    });

    return {
        coupons: couponsQuery.data || [],
        isLoading: couponsQuery.isLoading,
        createCoupon: createCouponMutation.mutateAsync,
        applyCoupon: applyCouponMutation.mutateAsync,
        validateCoupon: validateCouponMutation.mutateAsync
    };
};

export default useCoupons;

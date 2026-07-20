import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentRepository } from '@/repositories/payment.repository';
import { PaymentService } from '@/services/payment.service';

export const usePayments = () => {
    const queryClient = useQueryClient();

    const paymentsQuery = useQuery({
        queryKey: ['saas', 'payments'],
        queryFn: () => PaymentRepository.getAll()
    });

    const transactionsQuery = useQuery({
        queryKey: ['saas', 'transactions'],
        queryFn: () => PaymentRepository.getTransactions()
    });

    const processPaymentMutation = useMutation({
        mutationFn: ({ invoiceId, amount, method, gateway }) => 
            PaymentService.processPayment(invoiceId, amount, method, gateway),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'payments'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'invoices'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'transactions'] });
        }
    });

    return {
        payments: paymentsQuery.data || [],
        isPaymentsLoading: paymentsQuery.isLoading,
        transactions: transactionsQuery.data || [],
        isTransactionsLoading: transactionsQuery.isLoading,
        processPayment: processPaymentMutation.mutateAsync
    };
};

export default usePayments;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoiceRepository } from '@/repositories/invoice.repository';

export const useInvoices = () => {
    const queryClient = useQueryClient();

    const invoicesQuery = useQuery({
        queryKey: ['saas', 'invoices'],
        queryFn: () => InvoiceRepository.getAll()
    });

    const createInvoiceMutation = useMutation({
        mutationFn: (data) => InvoiceRepository.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invoices'] });
        }
    });

    const refundMutation = useMutation({
        mutationFn: ({ invoiceId, amount, reason }) => InvoiceRepository.refund(invoiceId, amount, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'invoices'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'payments'] });
            queryClient.invalidateQueries({ queryKey: ['saas', 'transactions'] });
        }
    });

    return {
        invoices: invoicesQuery.data || [],
        isLoading: invoicesQuery.isLoading,
        isError: invoicesQuery.isError,
        createInvoice: createInvoiceMutation.mutateAsync,
        refundInvoice: refundMutation.mutateAsync
    };
};

export const useInvoice = (id) => {
    const invoiceQuery = useQuery({
        queryKey: ['saas', 'invoice', id],
        queryFn: () => InvoiceRepository.getById(id),
        enabled: !!id
    });

    return {
        invoice: invoiceQuery.data || null,
        isLoading: invoiceQuery.isLoading
    };
};

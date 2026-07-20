import { PaymentRepository } from '@/repositories/payment.repository';

export const PaymentService = {
    processPayment: async (invoiceId, amount, method, gateway = 'MockGateway') => {
        try {
            let status = 'Success';
            let gatewayToken = `token_${method.toLowerCase()}_${Math.random().toString(36).substring(2, 11)}`;

            if (amount === 999999) {
                status = 'Failed';
                gatewayToken = null;
            }

            const payment = await PaymentRepository.create({
                invoiceId,
                amount,
                method,
                gateway,
                status,
                gatewayToken
            });

            return payment;
        } catch (error) {
            console.error('Payment processing failed:', error);
            throw error;
        }
    }
};

export default PaymentService;

export const PaymentWebhookAdapters = {
    Stripe: {
        verifySignature: (payload, signature, secret) => {
            if (!payload || !signature || !secret) return false;
            return signature === `stripe_sig_${secret}`;
        },
        processPayload: (payload) => {
            const amount = payload.data?.object?.amount || 0;
            const invoiceId = payload.data?.object?.metadata?.invoiceId || payload.data?.object?.invoiceId;
            return {
                id: payload.id,
                gateway: 'Stripe',
                amount,
                status: payload.type === 'payment_intent.succeeded' ? 'Success' : 'Failed',
                invoiceId: invoiceId ? Number(invoiceId) : null,
                referenceToken: payload.id
            };
        }
    },
    PayPal: {
        verifySignature: (payload, signature, secret) => {
            if (!payload || !signature || !secret) return false;
            return signature === `paypal_sig_${secret}`;
        },
        processPayload: (payload) => {
            const amount = Number(payload.resource?.amount?.value || 0);
            const invoiceId = payload.resource?.invoice_id || payload.resource?.custom_id;
            return {
                id: payload.id,
                gateway: 'PayPal',
                amount,
                status: payload.event_type === 'PAYMENT.CAPTURE.COMPLETED' ? 'Success' : 'Failed',
                invoiceId: invoiceId ? Number(invoiceId) : null,
                referenceToken: payload.id
            };
        }
    },
    MyFatoorah: {
        verifySignature: (payload, signature, secret) => {
            if (!payload || !signature || !secret) return false;
            return signature === `myfatoorah_sig_${secret}`;
        },
        processPayload: (payload) => {
            const data = payload.Data || {};
            return {
                id: payload.id || data.InvoiceId,
                gateway: 'MyFatoorah',
                amount: data.InvoiceValue || 0,
                status: payload.Event === 'TransactionStatusChanged' && data.TransactionStatus === '2' ? 'Success' : 'Failed',
                invoiceId: data.CustomerReference ? Number(data.CustomerReference) : null,
                referenceToken: data.InvoiceId
            };
        }
    },
    Paymob: {
        verifySignature: (payload, signature, secret) => {
            if (!payload || !signature || !secret) return false;
            return signature === `paymob_sig_${secret}`;
        },
        processPayload: (payload) => {
            const obj = payload.obj || {};
            return {
                id: payload.id || String(obj.id),
                gateway: 'Paymob',
                amount: (obj.amount_cents || 0) / 100,
                status: obj.success === true ? 'Success' : 'Failed',
                invoiceId: obj.order?.merchant_order_id ? Number(obj.order.merchant_order_id) : null,
                referenceToken: String(obj.id)
            };
        }
    },
    Moyasar: {
        verifySignature: (payload, signature, secret) => {
            if (!payload || !signature || !secret) return false;
            return signature === `moyasar_sig_${secret}`;
        },
        processPayload: (payload) => {
            const data = payload.data || {};
            return {
                id: payload.id || data.id,
                gateway: 'Moyasar',
                amount: (data.amount || 0) / 100,
                status: data.status === 'paid' ? 'Success' : 'Failed',
                invoiceId: data.metadata?.invoice_id ? Number(data.metadata.invoice_id) : null,
                referenceToken: data.id
            };
        }
    },
    Mock: {
        verifySignature: (payload, signature, secret) => {
            return true;
        },
        processPayload: (payload) => {
            return {
                id: payload.id || 'mock_payment_id',
                gateway: 'Mock',
                amount: payload.amount || 100,
                status: payload.status || 'Success',
                invoiceId: payload.invoiceId ? Number(payload.invoiceId) : null,
                referenceToken: 'mock_ref_token'
            };
        }
    }
};

export default PaymentWebhookAdapters;

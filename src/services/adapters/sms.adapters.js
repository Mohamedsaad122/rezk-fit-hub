const createSmsAdapter = (providerName) => ({
    sendSms: async ({ to, message }) => {
        return {
            success: true,
            provider: providerName,
            sid: `sms_sid_${Math.random().toString(36).substring(2, 9)}`,
            to,
            message
        };
    }
});

export const SmsAdapters = {
    Twilio: createSmsAdapter('Twilio'),
    FirebaseSMS: createSmsAdapter('FirebaseSMS'),
    Mock: createSmsAdapter('Mock')
};

export default SmsAdapters;

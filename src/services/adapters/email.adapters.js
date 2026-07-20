const createEmailAdapter = (providerName) => ({
    sendEmail: async ({ to, subject, body }) => {
        return {
            success: true,
            provider: providerName,
            messageId: `msg_${Math.random().toString(36).substring(2, 9)}`,
            to,
            subject
        };
    }
});

export const EmailAdapters = {
    SMTP: createEmailAdapter('SMTP'),
    SendGrid: createEmailAdapter('SendGrid'),
    Mailgun: createEmailAdapter('Mailgun'),
    Mock: createEmailAdapter('Mock')
};

export default EmailAdapters;

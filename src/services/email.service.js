import { ProviderManagerService } from './provider-manager.service';
import { EmailAdapters } from './adapters/email.adapters';

export const EmailService = {
    sendEmail: async ({ to, subject, body }) => {
        const provider = ProviderManagerService.getEmailProvider();
        const adapter = EmailAdapters[provider] || EmailAdapters.Mock;
        return adapter.sendEmail({ to, subject, body });
    }
};

export default EmailService;

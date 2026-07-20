import { ProviderManagerService } from './provider-manager.service';
import { SmsAdapters } from './adapters/sms.adapters';

export const SmsService = {
    sendSms: async ({ to, message }) => {
        const provider = ProviderManagerService.getSmsProvider();
        const adapter = SmsAdapters[provider] || SmsAdapters.Mock;
        return adapter.sendSms({ to, message });
    }
};

export default SmsService;

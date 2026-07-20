export const ProviderManagerService = {
    smsConfig: { activeProvider: 'Twilio' },
    emailConfig: { activeProvider: 'SendGrid' },
    storageConfig: { activeProvider: 'AWS_S3' },

    getSmsProvider: () => ProviderManagerService.smsConfig.activeProvider,
    setSmsProvider: (provider) => {
        ProviderManagerService.smsConfig.activeProvider = provider;
    },

    getEmailProvider: () => ProviderManagerService.emailConfig.activeProvider,
    setEmailProvider: (provider) => {
        ProviderManagerService.emailConfig.activeProvider = provider;
    },

    getStorageProvider: () => ProviderManagerService.storageConfig.activeProvider,
    setStorageProvider: (provider) => {
        ProviderManagerService.storageConfig.activeProvider = provider;
    }
};

export default ProviderManagerService;

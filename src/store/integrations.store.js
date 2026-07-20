import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import ProviderManagerService from '@/services/provider-manager.service';

export const useIntegrationsStore = create(
    devtools(
        (set) => ({
            smsProvider: ProviderManagerService.getSmsProvider(),
            emailProvider: ProviderManagerService.getEmailProvider(),
            storageProvider: ProviderManagerService.getStorageProvider(),

            setSmsProvider: (provider) => {
                ProviderManagerService.setSmsProvider(provider);
                set({ smsProvider: provider }, false, 'integrations/setSmsProvider');
            },

            setEmailProvider: (provider) => {
                ProviderManagerService.setEmailProvider(provider);
                set({ emailProvider: provider }, false, 'integrations/setEmailProvider');
            },

            setStorageProvider: (provider) => {
                ProviderManagerService.setStorageProvider(provider);
                set({ storageProvider: provider }, false, 'integrations/setStorageProvider');
            }
        }),
        { name: 'IntegrationsStore' }
    )
);

export default useIntegrationsStore;

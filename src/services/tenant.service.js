import { TenantRepository } from '@/repositories/tenant.repository';
import { useTenantStore } from '@/store/tenant.store';
import { useBrandingStore } from '@/store/branding.store';

export const TenantService = {
    initializeTenant: async (tenantId) => {
        const id = Number(tenantId || 1);
        useTenantStore.getState().setActiveTenantId(id);
        
        try {
            const settings = await TenantRepository.getSettings(id);
            if (settings) {
                useTenantStore.getState().setActiveSettings(settings);
                useBrandingStore.getState().updateBrandingState(settings);
                useBrandingStore.getState().applyBrandingToDOM(settings);
            }
            return settings;
        } catch (error) {
            console.error('Failed to initialize tenant configurations:', error);
            return null;
        }
    },

    updateTenantBranding: async (tenantId, brandingData) => {
        const id = Number(tenantId);
        try {
            const updatedSettings = await TenantRepository.updateSettings(id, brandingData);
            if (id === Number(useTenantStore.getState().activeTenantId)) {
                useTenantStore.getState().setActiveSettings(updatedSettings);
                useBrandingStore.getState().updateBrandingState(updatedSettings);
                useBrandingStore.getState().applyBrandingToDOM(updatedSettings);
            }
            return updatedSettings;
        } catch (error) {
            console.error('Failed to update tenant branding settings:', error);
            throw error;
        }
    }
};

export default TenantService;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TenantRepository } from '@/repositories/tenant.repository';
import STORAGE_KEYS from '@/constants/storage.constants';

const SAAS_TENANT_KEY = 'rezk_saas_active_tenant';

export const useTenantStore = create(
    persist(
        (set, get) => ({
            activeTenantId: 1,
            tenants: [],
            activeSettings: null,

            setTenants: (tenants) => set({ tenants }),
            
            setActiveTenantId: (id) => {
                const numericId = Number(id);
                set({ activeTenantId: numericId });
                TenantRepository.setActiveTenant(numericId);
            },

            setActiveSettings: (settings) => set({ activeSettings: settings }),

            loadActiveTenantSettings: async () => {
                try {
                    const settings = await TenantRepository.getSettings(get().activeTenantId);
                    set({ activeSettings: settings });
                    return settings;
                } catch (error) {
                    console.error('Failed to load active tenant settings:', error);
                    return null;
                }
            }
        }),
        {
            name: SAAS_TENANT_KEY,
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useTenantStore;

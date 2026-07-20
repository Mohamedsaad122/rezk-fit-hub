import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OrganizationRepository } from '@/repositories/organization.repository';

const SAAS_ORGANIZATION_KEY = 'rezk_saas_active_organization';

export const useOrganizationStore = create(
    persist(
        (set) => ({
            activeOrganizationId: 1,
            organizations: [],

            setOrganizations: (organizations) => set({ organizations }),
            
            setActiveOrganizationId: (id) => {
                const numericId = Number(id);
                set({ activeOrganizationId: numericId });
                OrganizationRepository.setActiveOrganization(numericId);
            }
        }),
        {
            name: SAAS_ORGANIZATION_KEY,
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export default useOrganizationStore;

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useFeatureFlagsStore = create(
    devtools(
        (set) => ({
            flags: [],
            setFlags: (flags) => set({ flags }, false, 'featureFlags/setFlags'),
            updateFlag: (key, updates) => set((state) => ({
                flags: state.flags.map(f => f.key === key ? { ...f, ...updates } : f)
            }), false, 'featureFlags/updateFlag')
        }),
        { name: 'FeatureFlagsStore' }
    )
);

export default useFeatureFlagsStore;

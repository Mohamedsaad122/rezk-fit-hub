import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useReleaseStore = create(
    devtools(
        (set) => ({
            releases: [],
            setReleases: (releases) => set({ releases }, false, 'release/setReleases'),
            addRelease: (release) => set((state) => ({ releases: [release, ...state.releases] }), false, 'release/addRelease'),
            rollbackRelease: (id) => set((state) => ({
                releases: state.releases.map(r => String(r.id) === String(id) ? { ...r, status: 'RolledBack', rolledBackAt: new Date().toISOString() } : r)
            }), false, 'release/rollbackRelease')
        }),
        { name: 'ReleaseStore' }
    )
);

export default useReleaseStore;

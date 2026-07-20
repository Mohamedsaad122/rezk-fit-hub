import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useBackgroundJobsStore = create(
    devtools(
        (set) => ({
            jobs: [],

            addJob: (job) => set((state) => ({
                jobs: [...state.jobs, job]
            }), false, 'jobs/addJob'),

            removeJob: (id) => set((state) => ({
                jobs: state.jobs.filter(x => x.id !== id)
            }), false, 'jobs/removeJob'),

            updateJob: (id, updates) => set((state) => ({
                jobs: state.jobs.map(x => x.id === id ? { ...x, ...updates } : x)
            }), false, 'jobs/updateJob')
        }),
        { name: 'BackgroundJobsStore' }
    )
);

export default useBackgroundJobsStore;

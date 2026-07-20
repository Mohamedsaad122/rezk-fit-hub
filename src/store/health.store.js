import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useHealthStore = create(
    devtools(
        (set) => ({
            systemHealth: {},
            setSystemHealth: (systemHealth) => set({ systemHealth }, false, 'health/setSystemHealth'),
            updateServiceHealth: (serviceKey, health) => set((state) => ({
                systemHealth: { ...state.systemHealth, [serviceKey]: health }
            }), false, 'health/updateServiceHealth')
        }),
        { name: 'HealthStore' }
    )
);

export default useHealthStore;

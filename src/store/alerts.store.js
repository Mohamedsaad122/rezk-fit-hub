import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAlertsStore = create(
    devtools(
        (set) => ({
            alerts: [],
            setAlerts: (alerts) => set({ alerts }, false, 'alerts/setAlerts'),
            addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] }), false, 'alerts/addAlert'),
            resolveAlert: (id) => set((state) => ({
                alerts: state.alerts.map(a => String(a.id) === String(id) ? { ...a, status: 'Resolved', resolvedAt: new Date().toISOString() } : a)
            }), false, 'alerts/resolveAlert')
        }),
        { name: 'AlertsStore' }
    )
);

export default useAlertsStore;

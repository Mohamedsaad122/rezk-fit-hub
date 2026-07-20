import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const DEFAULT_SETTINGS = {
    categories: {
        appointment: true,
        workout: true,
        nutrition: true,
        client: true,
        assessment: true,
        progress: true,
        system: true,
    },
    muteReminders: false,
    reminderTiming: 15, // in minutes
    soundEnabled: true,
    desktopNotifications: true,
};

/**
 * Persisted Zustand store to manage user notification preferences.
 */
export const useNotificationStore = create(
    persist(
        (set) => ({
            settings: { ...DEFAULT_SETTINGS },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        ...newSettings,
                        categories: newSettings.categories
                            ? { ...state.settings.categories, ...newSettings.categories }
                            : state.settings.categories
                    }
                }));
            },

            toggleCategory: (category) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        categories: {
                            ...state.settings.categories,
                            [category]: !state.settings.categories[category]
                        }
                    }
                }));
            },

            resetSettings: () => {
                set({ settings: { ...DEFAULT_SETTINGS } });
            }
        }),
        {
            name: 'rezk_fit_notification_settings',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useNotificationStore;

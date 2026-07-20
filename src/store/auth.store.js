import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import STORAGE_KEYS from '@/constants/storage.constants';

/**
 * Persisted Zustand store containing user session states.
 */
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            role: null,
            permissions: [],
            isAuthenticated: false,

            login: (sessionData) => {
                const { user, accessToken, refreshToken } = sessionData;
                
                // Keep standard LocalStorage token set if any external systems check it
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                
                set({
                    user,
                    accessToken,
                    refreshToken,
                    role: user.role,
                    permissions: user.permissions || [],
                    isAuthenticated: true,
                });
            },

            logout: () => {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    role: null,
                    permissions: [],
                    isAuthenticated: false,
                });
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                    role: userData.role || (state.user ? state.user.role : null),
                }));
            },

            clearSession: () => {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    role: null,
                    permissions: [],
                    isAuthenticated: false,
                });
            }
        }),
        {
            name: STORAGE_KEYS.USER,
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;

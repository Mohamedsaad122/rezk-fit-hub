import { describe, it, expect, beforeEach } from 'vitest';
import apiInstance from '../api/axios';
import { useAuthStore } from '../store/auth.store';
import AppConfig from '../config/app.config';

describe('Authentication & Token Refresh Queue Tests', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        
        useAuthStore.getState().login({
            user: { id: 1, name: 'Coach Yousef', role: 'coach', email: 'coach@rezkfit.com' },
            accessToken: 'original-expired-token',
            refreshToken: 'valid-refresh-token'
        });
    });

    it('should correctly initialize Zustand store session', () => {
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.accessToken).toBe('original-expired-token');
    });

    it('should clear full Zustand store and localStorage keys on logout', () => {
        useAuthStore.getState().clearSession();
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.accessToken).toBeNull();
        expect(state.user).toBeNull();
        expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('should configure request headers correctly', () => {
        // Fetch request interceptor handler from the instance
        const handler = apiInstance.interceptors.request.handlers[0];
        expect(handler).toBeDefined();
        
        const mockConfig = { headers: {} };
        const resultConfig = handler.fulfilled(mockConfig);
        expect(resultConfig.headers.Authorization).toBe('Bearer original-expired-token');
    });

    it('should trigger silent refresh and update Zustand token on 401 response', async () => {
        const handler = apiInstance.interceptors.response.handlers[0];
        expect(handler).toBeDefined();

        const mockError = {
            config: { headers: {}, _retry: false },
            response: { status: 401 }
        };

        // Trigger response error callback (handler.rejected)
        try {
            await handler.rejected(mockError);
        } catch {
            // catch promise rejects
        }

        const state = useAuthStore.getState();
        expect(state.accessToken).toContain('mock-jwt-accessToken-refreshed');
    });
});

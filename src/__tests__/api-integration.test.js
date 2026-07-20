import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { ClientRepository } from '../repositories/client.repository';
import { NutritionRepository } from '../repositories/nutrition.repository';
import { useAuthStore } from '../store/auth.store';
import AppConfig from '../config/app.config';
import { ServerError } from '../api/axios';

// Mock window.location if tests run in jsdom and need navigation
if (typeof window !== 'undefined') {
    delete window.location;
    window.location = { href: 'http://localhost:3000/' };
}

// MSW Server Setup
const handlers = [];
const server = setupServer(...handlers);

describe('API-Mode HTTP Integration & Authentication Queue Tests', () => {
    let refreshCallCount = 0;
    let requestHistory = [];

    beforeAll(() => {
        server.listen({ onUnhandledRequest: 'bypass' });
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(() => {
        // Enforce API/Network Mode, not mock mode
        AppConfig.enableMock = false;
        
        // Reset counters and history
        refreshCallCount = 0;
        requestHistory = [];
        server.resetHandlers();

        // Seed initial auth store
        useAuthStore.getState().login({
            user: { id: 1, name: 'Coach Yousef', role: 'coach', email: 'coach@rezkfit.com' },
            accessToken: 'original-token',
            refreshToken: 'valid-refresh-token'
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('GET paginated clients captures query parameters and forwards them correctly', async () => {
        server.use(
            http.get('http://localhost:8000/api/trainees', ({ request }) => {
                const url = new URL(request.url);
                requestHistory.push({
                    page: url.searchParams.get('page'),
                    limit: url.searchParams.get('limit'),
                    search: url.searchParams.get('search'),
                    status: url.searchParams.get('status')
                });

                return HttpResponse.json({
                    data: [
                        {
                            id: 1,
                            name: 'سارة أحمد',
                            email: 'sara@example.com',
                            phone: '+201011111111',
                            age: 24,
                            currentWeight: 68.5,
                            targetWeight: 60.0,
                            goal: 'خسارة الوزن',
                            subscriptionStatus: 'نشط',
                            joinDate: '2026-01-15',
                            assignedCategoryId: 'gym',
                            progress: 10,
                            workouts: 5,
                            streak: 3,
                            avatar: '👩'
                        }
                    ],
                    meta: {
                        page: 2,
                        limit: 5,
                        total: 15,
                        totalPages: 3
                    }
                });
            })
        );

        const response = await ClientRepository.getAll({
            page: 2,
            limit: 5,
            search: 'احمد',
            status: 'نشط'
        });

        // Verify parameter forwarding
        expect(requestHistory.length).toBe(1);
        expect(requestHistory[0]).toEqual({
            page: '2',
            limit: '5',
            search: 'احمد',
            status: 'نشط'
        });

        // Verify successful paginated response structure validation
        expect(response).toHaveProperty('data');
        expect(response).toHaveProperty('meta');
        expect(response.data.length).toBe(1);
        expect(response.meta.page).toBe(2);
        expect(response.meta.totalPages).toBe(3);
    });

    it('GET paginated nutrition plans returns correct validated schema', async () => {
        server.use(
            http.get('http://localhost:8000/api/nutrition-plans', ({ request }) => {
                const url = new URL(request.url);
                requestHistory.push({
                    page: url.searchParams.get('page'),
                    limit: url.searchParams.get('limit')
                });

                return HttpResponse.json({
                    data: [
                        {
                            id: 1,
                            name: 'برنامج الكيتو دايت',
                            description: 'برنامج قليل الكربوهيدرات مرتفع الدهون',
                            duration: '4 أسابيع',
                            participants: 2,
                            calories: 1800,
                            image: '🥑',
                            macros: {
                                protein: { value: 20, color: 'bg-red-500' },
                                carbs: { value: 5, color: 'bg-yellow-500' },
                                fats: { value: 75, color: 'bg-blue-500' }
                            },
                            meals: [
                                { name: 'فطور بيض وزبدة', time: '09:00', calories: 450 }
                            ],
                            assignedClientId: 3,
                            status: 'نشط'
                        }
                    ],
                    meta: {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1
                    }
                });
            })
        );

        const response = await NutritionRepository.getAll({ page: 1, limit: 10 });
        expect(response.data[0].name).toBe('برنامج الكيتو دايت');
        expect(response.meta.total).toBe(1);
    });

    it('Invalid response contract is correctly rejected by repository schema validation', async () => {
        server.use(
            http.get('http://localhost:8000/api/trainees', () => {
                // Invalid response: data is an object instead of array of trainees
                return HttpResponse.json({
                    data: { id: 1, name: 'Trainee' },
                    meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
                });
            })
        );

        // Should throw validation error due to contract schema violation
        await expect(ClientRepository.getAll({ page: 1 })).rejects.toThrow();
    });

    it('Server 500 internal errors are normalized to ServerError', async () => {
        server.use(
            http.get('http://localhost:8000/api/trainees', () => {
                return new HttpResponse(
                    JSON.stringify({ message: 'Internal Database Crash' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            })
        );

        await expect(ClientRepository.getAll()).rejects.toThrow(ServerError);
    });

    it('401 Unauthorized triggers silent token refresh and retries the original request with new token', async () => {
        let traineeRequestsCount = 0;

        server.use(
            http.post('http://localhost:8000/api/auth/refresh', async ({ request }) => {
                refreshCallCount++;
                const body = await request.json();
                expect(body.refreshToken).toBe('valid-refresh-token');

                return HttpResponse.json({
                    accessToken: 'new-jwt-access-token',
                    refreshToken: 'new-refresh-token'
                });
            }),

            http.get('http://localhost:8000/api/trainees', ({ request }) => {
                traineeRequestsCount++;
                const authHeader = request.headers.get('Authorization');

                if (authHeader === 'Bearer original-token') {
                    // Fail the first request with 401
                    return new HttpResponse(null, { status: 401 });
                }

                // Succeed the retried request if it has the refreshed token
                if (authHeader === 'Bearer new-jwt-access-token') {
                    return HttpResponse.json({
                        data: [],
                        meta: { page: 1, limit: 10, total: 0, totalPages: 0 }
                    });
                }

                return new HttpResponse(null, { status: 403 });
            })
        );

        const response = await ClientRepository.getAll();
        
        // Assertions
        expect(response.data.length).toBe(0);
        expect(traineeRequestsCount).toBe(2);
        expect(refreshCallCount).toBe(1);
        
        // Persisted state updated
        const state = useAuthStore.getState();
        expect(state.accessToken).toBe('new-jwt-access-token');
        expect(state.refreshToken).toBe('new-refresh-token');
    });

    it('Multiple concurrent 401 errors trigger ONLY one refresh call and retry all queued requests', async () => {
        let clientsCallCount = 0;
        let nutritionCallCount = 0;

        server.use(
            http.post('http://localhost:8000/api/auth/refresh', () => {
                refreshCallCount++;
                return HttpResponse.json({
                    accessToken: 'shared-refreshed-token',
                    refreshToken: 'next-refresh-token'
                });
            }),

            http.get('http://localhost:8000/api/trainees', ({ request }) => {
                clientsCallCount++;
                const auth = request.headers.get('Authorization');
                if (auth === 'Bearer original-token') {
                    return new HttpResponse(null, { status: 401 });
                }
                if (auth === 'Bearer shared-refreshed-token') {
                    return HttpResponse.json({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
                }
                return new HttpResponse(null, { status: 403 });
            }),

            http.get('http://localhost:8000/api/nutrition-plans', ({ request }) => {
                nutritionCallCount++;
                const auth = request.headers.get('Authorization');
                if (auth === 'Bearer original-token') {
                    return new HttpResponse(null, { status: 401 });
                }
                if (auth === 'Bearer shared-refreshed-token') {
                    return HttpResponse.json({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } });
                }
                return new HttpResponse(null, { status: 403 });
            })
        );

        // Run concurrently
        const [clientsRes, nutritionRes] = await Promise.all([
            ClientRepository.getAll(),
            NutritionRepository.getAll()
        ]);

        expect(clientsRes.data.length).toBe(0);
        expect(nutritionRes.data.length).toBe(0);
        
        expect(clientsCallCount).toBe(2);
        expect(nutritionCallCount).toBe(2);
        expect(refreshCallCount).toBe(1); // Crucial: Only one refresh call triggered
        expect(useAuthStore.getState().accessToken).toBe('shared-refreshed-token');
    });

    it('Refresh failure wipes session from Zustand store and rejects original requests', async () => {
        server.use(
            http.post('http://localhost:8000/api/auth/refresh', () => {
                return new HttpResponse(null, { status: 401 });
            }),

            http.get('http://localhost:8000/api/trainees', () => {
                return new HttpResponse(null, { status: 401 });
            })
        );

        await expect(ClientRepository.getAll()).rejects.toThrow();

        // Check store is cleared
        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.accessToken).toBeNull();
        expect(state.user).toBeNull();
    });
});

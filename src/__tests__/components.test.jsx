import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Clients from '../pages/Clients';
import ClientDetails from '../pages/ClientDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock TanStack React Query Hooks
vi.mock('../hooks/use-clients', () => ({
    useClients: () => ({
        isLoading: false,
        isError: false,
        data: {
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
                    assignedCategoryId: 'gym'
                }
            ],
            meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
        }
    }),
    useClientDetails: (id) => ({
        isLoading: false,
        isError: false,
        data: id === '1' ? {
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
            assignedCategoryId: null // Unassigned workout category
        } : null
    }),
    useCreateClient: () => ({ mutate: vi.fn(), isPending: false }),
    useUpdateClient: () => ({ mutate: vi.fn(), isPending: false }),
    useDeleteClient: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../hooks/use-exercises', () => ({
    useExercises: () => ({
        isLoading: false,
        data: [
            { id: 'gym', name: 'تمارين صالة الجيم', description: 'تمارين الحديد والقوة', exercises: [] }
        ]
    }),
    useCreateExercise: () => ({ mutate: vi.fn(), isPending: false }),
    useUpdateExercise: () => ({ mutate: vi.fn(), isPending: false }),
    useDeleteExercise: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../hooks/use-nutrition', () => ({
    useNutrition: () => ({
        isLoading: false,
        data: {
            data: [
                { id: 1, name: 'خطة حرق الدهون', description: 'حمية منخفضة الكربوهيدرات', assignedClientId: 99 } // assigned to client 99, not client 1
            ],
            meta: { page: 1, limit: 10, total: 1, totalPages: 1 }
        }
    }),
    useDeleteNutrition: () => ({ mutate: vi.fn(), isPending: false }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('UI Component Layout & Accessibility Tests', () => {
    describe('Clients Card Structural Accessibility', () => {
        it('should render edit/delete actions as siblings of the navigation Link, not children', () => {
            render(
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter initialEntries={['/clients']}>
                            <Routes>
                                <Route path="/clients" element={<Clients />} />
                            </Routes>
                        </MemoryRouter>
                    </QueryClientProvider>
                </HelmetProvider>
            );

            // Locate elements in card
            const detailLink = screen.getByRole('link', { name: /عرض التفاصيل/i });
            expect(detailLink).toBeInTheDocument();

            // Locate buttons
            const editButton = screen.getAllByRole('button').find(
                btn => btn.querySelector('svg')?.classList.contains('text-muted-foreground') || false
            );
            const deleteButton = screen.getAllByRole('button').find(
                btn => btn.classList.contains('text-destructive') || false
            );

            // Verify they are not descendants of the anchor detailLink
            if (editButton) {
                expect(detailLink).not.toContainElement(editButton);
            }
            if (deleteButton) {
                expect(detailLink).not.toContainElement(deleteButton);
            }
        });
    });

    describe('Client Details Plan Assignment Fallbacks', () => {
        it('should render explicit EmptyState warnings and never fall back to plans[0] when unassigned', () => {
            render(
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter initialEntries={['/clients/1']}>
                            <Routes>
                                <Route path="/clients/:clientId" element={<ClientDetails />} />
                            </Routes>
                        </MemoryRouter>
                    </QueryClientProvider>
                </HelmetProvider>
            );

            // Verify unassigned workout message
            expect(screen.getByText('لا يوجد برنامج تدريبي مخصص')).toBeInTheDocument();
            expect(screen.getByText('لم يتم تعيين أي برنامج تدريبي لهذا المتدرب بعد.')).toBeInTheDocument();

            // Verify unassigned nutrition warning is displayed (no plans[0] fallback)
            expect(screen.getByText('لا يوجد نظام غذائي مخصص')).toBeInTheDocument();
            expect(screen.getByText('لم يتم تعيين أي نظام غذائي لهذا المتدرب بعد.')).toBeInTheDocument();
            expect(screen.queryByText('خطة حرق الدهون')).not.toBeInTheDocument(); // should not show client 99's plan
        });
    });
});

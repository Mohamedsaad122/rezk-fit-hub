import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from '../components/auth/GuestRoute';
import RoleRoute from '../components/auth/RoleRoute';

describe('Enterprise Authentication & RBAC Route Guards', () => {
    beforeEach(() => {
        useAuthStore.getState().clearSession();
    });

    it('ProtectedRoute should redirect to login if user is unauthenticated', () => {
        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div>صفحة تسجيل الدخول</div>} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/protected" element={<div>محتوى محمي</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('صفحة تسجيل الدخول')).toBeInTheDocument();
        expect(screen.queryByText('محتوى محمي')).not.toBeInTheDocument();
    });

    it('ProtectedRoute should render children if user is authenticated', () => {
        useAuthStore.getState().login({
            user: { id: 1, name: 'أحمد', role: 'coach', permissions: [] },
            accessToken: 'mock-access',
            refreshToken: 'mock-refresh'
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/protected" element={<div>محتوى محمي</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('محتوى محمي')).toBeInTheDocument();
    });

    it('GuestRoute should redirect to dashboard if user is authenticated', () => {
        useAuthStore.getState().login({
            user: { id: 1, name: 'أحمد', role: 'coach', permissions: [] },
            accessToken: 'mock-access',
            refreshToken: 'mock-refresh'
        });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/dashboard" element={<div>لوحة التحكم الرئيسية</div>} />
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<div>صفحة الدخول للضيوف</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('لوحة التحكم الرئيسية')).toBeInTheDocument();
        expect(screen.queryByText('صفحة الدخول للضيوف')).not.toBeInTheDocument();
    });

    it('RoleRoute should redirect to unauthorized if user does not possess role', () => {
        useAuthStore.getState().login({
            user: { id: 1, name: 'أحمد', role: 'trainee', permissions: [] },
            accessToken: 'mock-access',
            refreshToken: 'mock-refresh'
        });

        render(
            <MemoryRouter initialEntries={['/admin-path']}>
                <Routes>
                    <Route path="/unauthorized" element={<div>غير مصرح بالوصول</div>} />
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                        <Route path="/admin-path" element={<div>محتوى الإدارة</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('غير مصرح بالوصول')).toBeInTheDocument();
        expect(screen.queryByText('محتوى الإدارة')).not.toBeInTheDocument();
    });

    it('RoleRoute should render children if user role matches allowedRoles list', () => {
        useAuthStore.getState().login({
            user: { id: 1, name: 'أحمد', role: 'admin', permissions: [] },
            accessToken: 'mock-access',
            refreshToken: 'mock-refresh'
        });

        render(
            <MemoryRouter initialEntries={['/admin-path']}>
                <Routes>
                    <Route element={<RoleRoute allowedRoles={['admin']} />}>
                        <Route path="/admin-path" element={<div>محتوى الإدارة</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('محتوى الإدارة')).toBeInTheDocument();
    });
});

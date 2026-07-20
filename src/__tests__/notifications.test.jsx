import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { NotificationRepository } from '../repositories/notification.repository';
import { 
    NotificationResponseSchema, 
    NotificationSettingsSchema 
} from '../contracts/notification.contract';
import { useNotificationStore } from '../store/notification.store';
import { UnreadBadge } from '../components/UnreadBadge';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationFilters } from '../components/NotificationFilters';
import { NotificationBell } from '../components/NotificationBell';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

const renderWithProviders = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('Enterprise Notification Center Sprint 3.4 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
        useNotificationStore.getState().resetSettings();
    });

    describe('1. Zod Contract Validation', () => {
        it('should validate notification object matching the schema', () => {
            const notif = {
                id: 10,
                title: "تنبيه اختبار",
                description: "تفاصيل رسالة الاختبار من المطور",
                type: "Workout Assigned",
                priority: "Normal",
                status: "Unread",
                createdAt: new Date().toISOString(),
                readAt: null,
                actionUrl: "/clients/1",
                clientId: 1,
                icon: "💪",
                color: "purple"
            };
            const result = NotificationResponseSchema.safeParse(notif);
            expect(result.success).toBe(true);
        });

        it('should validate notification settings correctly', () => {
            const settings = {
                categories: {
                    appointment: true,
                    workout: false,
                    nutrition: true,
                    client: true,
                    assessment: false,
                    progress: true,
                    system: true
                },
                muteReminders: false,
                reminderTiming: 30,
                soundEnabled: true,
                desktopNotifications: true
            };
            const result = NotificationSettingsSchema.safeParse(settings);
            expect(result.success).toBe(true);
        });
    });

    describe('2. Repository CRUD & Settings Transactions', () => {
        it('should fetch all notification listings', async () => {
            const result = await NotificationRepository.getAll();
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.meta.total).toBeGreaterThan(0);
            expect(result.data[0]).toHaveProperty('id');
            expect(result.data[0]).toHaveProperty('status');
        });

        it('should mark all notifications as read', async () => {
            const success = await NotificationRepository.markAllRead();
            expect(success).toBe(true);

            const result = await NotificationRepository.getAll({ status: 'Unread' });
            expect(result.data.length).toBe(0);
        });

        it('should delete a notification successfully', async () => {
            const resultBefore = await NotificationRepository.getAll();
            const countBefore = resultBefore.meta.total;

            const deleted = await NotificationRepository.delete(1);
            expect(deleted).toBe(true);

            const resultAfter = await NotificationRepository.getAll();
            expect(resultAfter.meta.total).toBe(countBefore - 1);
        });

        it('should get and update notification settings', async () => {
            const current = await NotificationRepository.getSettings();
            expect(current.reminderTiming).toBe(15);

            const updated = await NotificationRepository.updateSettings({
                reminderTiming: 60,
                muteReminders: true
            });
            expect(updated.reminderTiming).toBe(60);
            expect(updated.muteReminders).toBe(true);
        });
    });

    describe('3. Notification Automatic Generation Triggers', () => {
        it('should automatically generate Client Created notification when a trainee is added', async () => {
            // Add trainee
            const initialCount = mockDatabase.notifications.getAll().length;
            mockDatabase.clients.create({
                name: 'خالد عبد الرحمن',
                email: 'khaled.abdo@gmail.com',
                phone: '+201088888888',
                age: 28,
                currentWeight: 75,
                targetWeight: 70,
                goal: 'خسارة الوزن'
            });

            const notifications = mockDatabase.notifications.getAll();
            expect(notifications.length).toBe(initialCount + 2);
            const clientNotif = notifications[notifications.length - 2];
            expect(clientNotif.type).toBe('Client Created');
            expect(clientNotif.title).toBe('متدرب جديد');
        });

        it('should generate Appointment Cancelled notification when a calendar event is updated to Cancelled', async () => {
            // Create event first
            const event = mockDatabase.calendarEvents.create({
                title: "جلسة قوة بدنية",
                date: "2026-07-15",
                startTime: "18:00",
                endTime: "19:00",
                type: "Workout Session",
                status: "Scheduled"
            });

            const initialCount = mockDatabase.notifications.getAll().length;
            
            // Cancel event
            mockDatabase.calendarEvents.update(event.id, { status: "Cancelled" });

            const notifications = mockDatabase.notifications.getAll();
            expect(notifications.length).toBe(initialCount + 1);
            const latest = notifications[notifications.length - 1];
            expect(latest.type).toBe('Appointment Cancelled');
        });
    });

    describe('4. UI Components Rendering and Interactivity', () => {
        it('should render UnreadBadge count correctly', () => {
            render(<UnreadBadge count={5} />);
            expect(screen.getByText('5')).toBeInTheDocument();

            const { container } = render(<UnreadBadge count={0} />);
            expect(container.firstChild).toBeNull();
        });

        it('should render NotificationItem detail and handle callbacks', () => {
            const notif = {
                id: 99,
                title: "تنبيه تجريبي",
                description: "وصف الإشعار التجريبي",
                priority: "High",
                status: "Unread",
                createdAt: new Date().toISOString(),
                icon: "💡",
                color: "blue"
            };
            const onMarkRead = vi.fn();
            const onDelete = vi.fn();

            renderWithProviders(
                <NotificationItem
                    notification={notif}
                    onMarkRead={onMarkRead}
                    onDelete={onDelete}
                />
            );

            expect(screen.getByText('تنبيه تجريبي')).toBeInTheDocument();
            expect(screen.getByText('وصف الإشعار التجريبي')).toBeInTheDocument();

            // Click the check button to mark as read
            const checkButton = screen.getByTitle('تحديد كمقروء');
            fireEvent.click(checkButton);
            expect(onMarkRead).toHaveBeenCalledWith(99);

            // Click delete button
            const deleteButton = screen.getByTitle('حذف');
            fireEvent.click(deleteButton);
            expect(onDelete).toHaveBeenCalledWith(99);
        });

        it('should render NotificationFilters search and dropdowns', () => {
            const onSearchChange = vi.fn();
            const onStatusChange = vi.fn();

            render(
                <NotificationFilters
                    search="جلسة"
                    onSearchChange={onSearchChange}
                    status="All"
                    onStatusChange={onStatusChange}
                    priority="All"
                    onPriorityChange={vi.fn()}
                    sortBy="Newest"
                    onSortByChange={vi.fn()}
                />
            );

            const input = screen.getByPlaceholderText(/البحث/);
            expect(input.value).toBe('جلسة');

            fireEvent.change(input, { target: { value: 'تمارين' } });
            expect(onSearchChange).toHaveBeenCalledWith('تمارين');
        });

        it('should render NotificationBell and animate based on unread updates', async () => {
            renderWithProviders(<NotificationBell />);
            
            // Bell triggers and renders unread counts
            const badgeCount = await screen.findByText('4');
            expect(badgeCount).toBeInTheDocument();
        });
    });
});

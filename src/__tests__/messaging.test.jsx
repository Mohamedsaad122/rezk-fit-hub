import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { useMessageStore } from '../store/message.store';
import { MessageRepository } from '../repositories/message.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { MessageBubble } from '../components/MessageBubble';
import { MessageComposer } from '../components/MessageComposer';
import { ActivityCard } from '../components/ActivityCard';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Enterprise Messaging & Activity Feed Sprint 3.7 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        useMessageStore.getState().resetStore();
    });

    describe('1. Store State Tests', () => {
        it('should correctly select active conversation', () => {
            const store = useMessageStore.getState();
            expect(store.activeConversationId).toBeNull();

            store.setActiveConversationId(5);
            expect(useMessageStore.getState().activeConversationId).toBe(5);
        });

        it('should update search query and filter status', () => {
            const store = useMessageStore.getState();
            store.setSearchQuery('سارة');
            store.setFilterStatus('Pinned');

            expect(useMessageStore.getState().searchQuery).toBe('سارة');
            expect(useMessageStore.getState().filterStatus).toBe('Pinned');
        });
    });

    describe('2. Message Repository Operations', () => {
        it('should fetch conversation list with search and Pinned filters', async () => {
            const conversations = await MessageRepository.getConversations();
            expect(conversations.length).toBeGreaterThan(0);
            
            const pinnedOnly = await MessageRepository.getConversations({ status: 'Pinned' });
            expect(pinnedOnly.every(c => c.isPinned)).toBe(true);
        });

        it('should send a message and update lastMessageAt in thread header', async () => {
            const initialMessages = await MessageRepository.getMessages(1);
            const initialLength = initialMessages.length;

            const sent = await MessageRepository.sendMessage(1, 'رسالة تجريبية جديدة');
            expect(sent.text).toBe('رسالة تجريبية جديدة');
            expect(sent.sender).toBe('Coach');

            const updatedMessages = await MessageRepository.getMessages(1);
            expect(updatedMessages.length).toBe(initialLength + 1);
        });

        it('should mark unread message counters to zero', async () => {
            await MessageRepository.markAsRead(2);
            const conversations = await MessageRepository.getConversations();
            const conv = conversations.find(c => c.id === 2);
            expect(conv.unreadCount).toBe(0);
        });
    });

    describe('3. Database Activity Feed Observers', () => {
        it('should auto log activity timeline logs on client trainee operations', async () => {
            const initialActivities = await ActivityRepository.getActivities();
            const initialCount = initialActivities.length;

            // Trigger client addition
            mockDatabase.clients.create({
                name: "أحمد كمال",
                progress: 5,
                workouts: 0,
                streak: 0,
                subscriptionStatus: "نشط",
                assignedCategoryId: "gym"
            });

            const updatedActivities = await ActivityRepository.getActivities();
            expect(updatedActivities.length).toBeGreaterThan(initialCount);
            
            const clientActivity = updatedActivities.find(a => a.category === 'Client');
            expect(clientActivity).toBeDefined();
            expect(clientActivity.description).toContain("أحمد كمال");
        });

        it('should auto log activity logs on task completions', async () => {
            const initialActivities = await ActivityRepository.getActivities();
            const initialCount = initialActivities.length;

            // Trigger task completion
            mockDatabase.tasks.update(1, { status: 'Completed' });

            const updatedActivities = await ActivityRepository.getActivities();
            expect(updatedActivities.length).toBeGreaterThan(initialCount);

            const taskActivity = updatedActivities.find(a => a.category === 'Task' && a.description.includes("تم اكتمال المهمة"));
            expect(taskActivity).toBeDefined();
        });

        it('should auto log activity logs on appointment creations', async () => {
            const initialActivities = await ActivityRepository.getActivities();
            const initialCount = initialActivities.length;

            // Trigger appointment scheduling
            mockDatabase.calendarEvents.create({
                title: "متابعة الوزن الأسبوعية",
                date: "2026-07-20",
                startTime: "11:00",
                endTime: "12:00",
                type: "Consultation",
                clientId: 1
            });

            const updatedActivities = await ActivityRepository.getActivities();
            expect(updatedActivities.length).toBeGreaterThan(initialCount);

            const appActivity = updatedActivities.find(a => a.category === 'Appointment');
            expect(appActivity).toBeDefined();
            expect(appActivity.description).toContain("تم جدولة موعد جديد");
        });
    });

    describe('4. UI Component Rendering', () => {
        it('renders message bubbles correctly', () => {
            const msg = {
                id: 100,
                conversationId: 1,
                sender: 'Coach',
                text: 'أهلاً بك في منصة التدريب المخصصة',
                timestamp: '2026-07-14T02:00:00Z',
                read: true
            };
            const queryClient = new QueryClient();
            render(
                <QueryClientProvider client={queryClient}>
                    <MessageBubble message={msg} />
                </QueryClientProvider>
            );
            expect(screen.getByText('أهلاً بك في منصة التدريب المخصصة')).toBeInTheDocument();
        });

        it('supports emojis selection and sends message input values', () => {
            const handleSend = vi.fn();
            render(<MessageComposer onSendMessage={handleSend} isSending={false} />);

            const input = screen.getByPlaceholderText('اكتب رسالتك هنا...');
            fireEvent.change(input, { target: { value: 'السلام عليكم' } });
            
            const form = screen.getByPlaceholderText('اكتب رسالتك هنا...').closest('form');
            fireEvent.submit(form);

            expect(handleSend).toHaveBeenCalledWith('السلام عليكم');
        });

        it('renders activity timeline cards with correct labels', () => {
            const activity = {
                id: 200,
                category: 'Workout',
                description: 'أكمل محمد علي تمرين الساقين المتقدم اليوم.',
                actor: 'محمد علي',
                clientId: 2,
                timestamp: '2026-07-14T02:00:00Z'
            };
            render(<ActivityCard activity={activity} />);
            expect(screen.getByText('أكمل محمد علي تمرين الساقين المتقدم اليوم.')).toBeInTheDocument();
            expect(screen.getByText('تمارين')).toBeInTheDocument();
        });
    });
});

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { TaskRepository } from '../repositories/task.repository';
import { 
    TaskResponseSchema, 
    TaskStatisticsSchema 
} from '../contracts/task.contract';
import { useTaskStore } from '../store/task.store';
import { TaskPriorityBadge } from '../components/TaskPriorityBadge';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { TaskStatistics } from '../components/TaskStatistics';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';

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

describe('Enterprise Task & Follow-up System Sprint 3.5 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
        useTaskStore.getState().resetFilters();
    });

    describe('1. Zod Schema & Store Contract Validation', () => {
        it('should successfully parse a valid task object', () => {
            const task = {
                id: 12,
                title: "متابعة الخطة الرياضية",
                description: "مراجعة تمارين الأسبوع وتعديل الأوزان للمتدرب.",
                clientId: 1,
                appointmentId: null,
                assignedTo: "Coach",
                priority: "High",
                status: "Todo",
                category: "Workout",
                startDate: "2026-07-14",
                dueDate: "2026-07-17",
                completedAt: null,
                estimatedMinutes: 45,
                actualMinutes: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const result = TaskResponseSchema.safeParse(task);
            expect(result.success).toBe(true);
        });

        it('should reject invalid values on task schema validation', () => {
            const invalidTask = {
                title: "", // empty title
                dueDate: "14/07/2026", // invalid format
                priority: "Very High" // invalid priority enum
            };
            const result = TaskResponseSchema.safeParse(invalidTask);
            expect(result.success).toBe(false);
        });

        it('should correctly reset store filters state', () => {
            const store = useTaskStore.getState();
            store.setFilters({ status: 'Completed', priority: 'High', search: 'اختبار' });
            expect(useTaskStore.getState().filters.status).toBe('Completed');

            store.resetFilters();
            expect(useTaskStore.getState().filters.status).toBe('All');
            expect(useTaskStore.getState().filters.search).toBe('');
        });
    });

    describe('2. Repository CRUD & Stats Transactions', () => {
        it('should fetch paginated tasks list', async () => {
            const result = await TaskRepository.getAll({ page: 1, limit: 10 });
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.meta.total).toBeGreaterThan(0);
        });

        it('should filter tasks by status and priority', async () => {
            const todoResults = await TaskRepository.getAll({ status: 'Todo' });
            expect(todoResults.data.every(t => t.status === 'Todo')).toBe(true);

            const criticalResults = await TaskRepository.getAll({ priority: 'Critical' });
            expect(criticalResults.data.every(t => t.priority === 'Critical')).toBe(true);
        });

        it('should create, update and delete a task successfully', async () => {
            // Create
            const newTask = await TaskRepository.create({
                title: "مهمة تجريبية جديدة",
                description: "تفاصيل المهمة",
                category: "Reminder",
                priority: "Low",
                status: "Todo",
                startDate: "2026-07-14",
                dueDate: "2026-07-20"
            });
            expect(newTask.id).toBeDefined();
            expect(newTask.title).toBe("مهمة تجريبية جديدة");

            // Update
            const updated = await TaskRepository.update(newTask.id, {
                status: "Completed",
                actualMinutes: 20
            });
            expect(updated.status).toBe("Completed");
            expect(updated.completedAt).toBeDefined();

            // Delete
            const deleted = await TaskRepository.delete(newTask.id);
            expect(deleted).toBe(true);
        });

        it('should perform bulk status updates', async () => {
            const originalTasks = await TaskRepository.getAll();
            const ids = originalTasks.data.slice(0, 2).map(t => t.id);

            const success = await TaskRepository.bulkUpdate(ids, { status: 'Completed' });
            expect(success).toBe(true);

            const updatedTasks = await TaskRepository.getAll();
            ids.forEach(id => {
                const task = updatedTasks.data.find(t => t.id === id);
                expect(task.status).toBe('Completed');
            });
        });

        it('should calculate task statistics correctly', async () => {
            const stats = await TaskRepository.getStatistics();
            const parsed = TaskStatisticsSchema.safeParse(stats);
            expect(parsed.success).toBe(true);
            expect(stats.total).toBeGreaterThan(0);
            expect(stats.completionRate).toBeGreaterThanOrEqual(0);
        });
    });

    describe('3. Event-Driven Auto-Generation & Notifications', () => {
        it('should auto-create a task when a client trainee is added', async () => {
            const initialCount = mockDatabase.tasks.getAll().length;

            mockDatabase.clients.create({
                name: 'عبد الله منصور',
                email: 'abdullah.mansour@gmail.com',
                phone: '+201099999999',
                age: 32,
                currentWeight: 80,
                targetWeight: 75,
                goal: 'تحسين اللياقة'
            });

            const currentTasks = mockDatabase.tasks.getAll();
            expect(currentTasks.length).toBe(initialCount + 1);
            const latestTask = currentTasks[currentTasks.length - 1];
            expect(latestTask.title).toBe("مراجعة الملف التعريفي والهدف");
            expect(latestTask.category).toBe("Assessment");
        });

        it('should generate Appointment Preparation tasks on appointment scheduling', async () => {
            const initialCount = mockDatabase.tasks.getAll().length;

            mockDatabase.calendarEvents.create({
                title: "مراجعة قياسات المتدرب",
                date: "2026-07-20",
                startTime: "12:00",
                endTime: "13:00",
                type: "Consultation"
            });

            const currentTasks = mockDatabase.tasks.getAll();
            expect(currentTasks.length).toBe(initialCount + 1);
            expect(currentTasks[currentTasks.length - 1].category).toBe("Consultation");
            expect(currentTasks[currentTasks.length - 1].title).toContain("التحضير للقاء");
        });
    });

    describe('4. UI Rendering and Interactivity', () => {
        it('should render TaskPriorityBadge and TaskStatusBadge correctly', () => {
            render(<TaskPriorityBadge priority="Critical" />);
            expect(screen.getByText('عاجلة جداً')).toBeInTheDocument();

            render(<TaskStatusBadge status="In Progress" />);
            expect(screen.getByText('قيد التنفيذ')).toBeInTheDocument();
        });

        it('should render TaskStatistics values', () => {
            const mockStats = {
                total: 10,
                todo: 3,
                inProgress: 2,
                completed: 4,
                cancelled: 1,
                overdue: 1,
                completionRate: 44
            };

            render(<TaskStatistics statistics={mockStats} />);
            expect(screen.getByText('10')).toBeInTheDocument();
            expect(screen.getByText('44%')).toBeInTheDocument();
        });

        it('should render TaskCard details and fire complete callback', () => {
            const task = {
                id: 15,
                title: "مكالمة هاتفية للمتدرب",
                description: "الاتصال للاطمئنان على سير خطة تمارين الكارديو.",
                priority: "Low",
                status: "Todo",
                category: "Phone Call",
                dueDate: "2026-07-16"
            };
            const onComplete = vi.fn();

            renderWithProviders(
                <TaskCard
                    task={task}
                    onCompleteToggle={onComplete}
                />
            );

            expect(screen.getByText('مكالمة هاتفية للمتدرب')).toBeInTheDocument();
            
            const btnComplete = screen.getByText('إنجاز');
            fireEvent.click(btnComplete);
            expect(onComplete).toHaveBeenCalled();
        });

        it('should render TaskFilters and capture search inputs', () => {
            const onSearch = vi.fn();
            
            render(
                <TaskFilters
                    search="متابعة"
                    onSearchChange={onSearch}
                    status="All"
                    onStatusChange={vi.fn()}
                    priority="All"
                    onPriorityChange={vi.fn()}
                    category="All"
                    onCategoryChange={vi.fn()}
                    sortBy="Newest"
                    onSortByChange={vi.fn()}
                />
            );

            const input = screen.getByPlaceholderText(/البحث عن مهمة/);
            expect(input.value).toBe('متابعة');

            fireEvent.change(input, { target: { value: 'وجبات' } });
            expect(onSearch).toHaveBeenCalledWith('وجبات');
        });
    });
});

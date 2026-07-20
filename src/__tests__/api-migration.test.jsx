import { describe, it, expect, beforeEach } from 'vitest';
import { useNetworkStore } from '../store/network.store';
import { ClientDto } from '../dtos/client.dto';
import { TaskDto } from '../dtos/task.dto';
import { AppointmentDto } from '../dtos/appointment.dto';
import { keysToCamel, keysToSnake } from '../api/axios';

describe('Sprint 4.0 API Migration & Integration Test Suite', () => {
    beforeEach(() => {
        useNetworkStore.getState().resetNetworkState();
    });

    describe('1. Case Converter Interceptors', () => {
        it('should recursively map snake_case response payload keys to camelCase', () => {
            const rawApiData = {
                id: 101,
                full_name: 'كابتن محمود',
                assigned_category_id: 5,
                nested_info: {
                    progress_percentage: 75,
                    workout_streak: 12
                }
            };
            const mapped = keysToCamel(rawApiData);
            expect(mapped.id).toBe(101);
            expect(mapped.fullName).toBe('كابتن محمود');
            expect(mapped.assignedCategoryId).toBe(5);
            expect(mapped.nestedInfo.progressPercentage).toBe(75);
            expect(mapped.nestedInfo.workoutStreak).toBe(12);
        });

        it('should recursively map camelCase request payload keys to snake_case', () => {
            const domainData = {
                fullName: 'فيصل الحربي',
                subscriptionStatus: 'نشط',
                nestedData: {
                    estimatedMinutes: 45,
                    completedAt: null
                }
            };
            const mapped = keysToSnake(domainData);
            expect(mapped.full_name).toBe('فيصل الحربي');
            expect(mapped.subscription_status).toBe('نشط');
            expect(mapped.nested_data.estimated_minutes).toBe(45);
            expect(mapped.nested_data.completed_at).toBe(null);
        });

        it('should automatically parse ISO date strings to Javascript Date objects', () => {
            const payload = {
                created_at: '2026-07-15T02:00:00.000Z',
                normal_string: 'normal string text'
            };
            const converted = keysToCamel(payload);
            expect(converted.createdAt instanceof Date).toBe(true);
            expect(converted.createdAt.toISOString()).toBe('2026-07-15T02:00:00.000Z');
            expect(converted.normalString).toBe('normal string text');
        });
    });

    describe('2. DTO Serialization/Deserialization Layer', () => {
        it('should map Client api payload to domain format and request format', () => {
            const payload = {
                id: 1,
                name: 'خالد عبدالله',
                progress_percentage: 80,
                subscription_status: 'نشط',
                join_date: '2026-06-01'
            };

            const domain = ClientDto.toDomain(payload);
            expect(domain.name).toBe('خالد عبدالله');
            expect(domain.progress).toBe(80);
            expect(domain.subscriptionStatus).toBe('نشط');
            expect(domain.joinDate).toBe('2026-06-01');

            const request = ClientDto.toRequest(domain);
            expect(request.full_name).toBe('خالد عبدالله');
            expect(request.progress_percentage).toBe(80);
            expect(request.subscription_status).toBe('نشط');
        });

        it('should map Task api payload to domain format and request format', () => {
            const payload = {
                id: 5,
                title: 'تجهيز جدول التغذية الكيتو',
                assigned_to: 'Coach',
                estimated_minutes: 30,
                completed_at: '2026-07-14T20:30:00.000Z'
            };

            const domain = TaskDto.toDomain(payload);
            expect(domain.id).toBe(5);
            expect(domain.title).toBe('تجهيز جدول التغذية الكيتو');
            expect(domain.assignedTo).toBe('Coach');
            expect(domain.estimatedMinutes).toBe(30);

            const request = TaskDto.toRequest(domain);
            expect(request.title).toBe('تجهيز جدول التغذية الكيتو');
            expect(request.assigned_to).toBe('Coach');
            expect(request.estimated_minutes).toBe(30);
        });

        it('should map Appointment api payload to domain format and request format', () => {
            const payload = {
                id: 12,
                title: 'جلسة تقييم اللياقة',
                client_id: 4,
                start_time: '18:00',
                end_time: '19:00',
                duration: 60
            };

            const domain = AppointmentDto.toDomain(payload);
            expect(domain.id).toBe(12);
            expect(domain.title).toBe('جلسة تقييم اللياقة');
            expect(domain.clientId).toBe(4);
            expect(domain.startTime).toBe('18:00');
            expect(domain.endTime).toBe('19:00');

            const request = AppointmentDto.toRequest(domain);
            expect(request.title).toBe('جلسة تقييم اللياقة');
            expect(request.client_id).toBe(4);
            expect(request.start_time).toBe('18:00');
            expect(request.end_time).toBe('19:00');
        });
    });

    describe('3. Global Loading State & Network Manager Store', () => {
        it('should track active requests count correctly', () => {
            const store = useNetworkStore.getState();
            expect(store.activeRequests).toBe(0);

            store.incrementRequests();
            expect(useNetworkStore.getState().activeRequests).toBe(1);

            store.incrementRequests();
            expect(useNetworkStore.getState().activeRequests).toBe(2);

            store.decrementRequests();
            expect(useNetworkStore.getState().activeRequests).toBe(1);
        });

        it('should toggle offline and maintenance flags', () => {
            const store = useNetworkStore.getState();
            expect(store.isOffline).toBeDefined(); // Checks baseline boolean state
            expect(store.isMaintenance).toBe(false);

            store.setOffline(true);
            expect(useNetworkStore.getState().isOffline).toBe(true);

            store.setMaintenance(true);
            expect(useNetworkStore.getState().isMaintenance).toBe(true);
        });
    });
});

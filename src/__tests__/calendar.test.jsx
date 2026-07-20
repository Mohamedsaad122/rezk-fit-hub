import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { CalendarRepository } from '../modules/calendar/repositories/calendar.repository';
import { CalendarEventCreate } from '../modules/calendar/contracts/calendar.contract';
import Calendar from '../modules/calendar/pages/Calendar';
import { detectConflict, generateMonthMatrix, generateWeekDays } from '../modules/calendar/utils/calendar-utils';

// Helper query client wrapper
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

describe('Appointment Management Sprint 3.3 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
    });

    describe('1. Appointment validation and schemas', () => {
        it('should validate complete request parameters successfully', () => {
            const validRequest = {
                title: "جلسة قوة عضلية",
                description: "تمارين حديد الجزء العلوي",
                date: "2026-07-13",
                startTime: "10:00",
                endTime: "11:00",
                type: "Workout Session",
                status: "Scheduled",
                coachId: 1,
                clientId: 1,
                color: "blue",
                notes: "يجب الالتزام بالراحة البينية"
            };
            const result = CalendarEventCreate.safeParse(validRequest);
            expect(result.success).toBe(true);
        });

        it('should reject invalid values on event request validation', () => {
            const invalidRequest = {
                title: "", // empty title
                date: "13-07-2026", // invalid format YYYY-MM-DD
                type: "InvalidType"
            };
            const result = CalendarEventCreate.safeParse(invalidRequest);
            expect(result.success).toBe(false);
        });

        it('should reject end time that is before or equal to start time', () => {
            const invalidTimes = {
                title: "جلسة تغذية",
                description: "مراجعة وجبات",
                date: "2026-07-13",
                startTime: "12:00",
                endTime: "11:00",
                type: "Nutrition Consultation",
                status: "Scheduled",
                coachId: 1,
                clientId: 1,
                color: "green"
            };
            const result = CalendarEventCreate.safeParse(invalidTimes);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toContain('وقت الانتهاء يجب أن يكون بعد وقت البدء');
            }
        });

        it('should reject descriptions exceeding 500 characters', () => {
            const longDesc = {
                title: "جلسة تقييم",
                description: "a".repeat(501),
                date: "2026-07-13",
                startTime: "10:00",
                endTime: "11:00",
                type: "Assessment",
                status: "Scheduled",
                coachId: 1,
                clientId: 1,
                color: "purple"
            };
            const result = CalendarEventCreate.safeParse(longDesc);
            expect(result.success).toBe(false);
        });
    });

    describe('2. Appointment CRUD Repository Operations', () => {
        it('should create a calendar event and calculate its duration automatically', async () => {
            const payload = {
                title: "جلسة يوجا متقدمة",
                description: "استطالة وتحمل",
                date: "2026-07-13",
                startTime: "09:00",
                endTime: "10:30",
                type: "Workout Session",
                status: "Scheduled",
                coachId: 1,
                clientId: 1,
                color: "blue",
                notes: "ملاحظات إضافية"
            };
            const created = await CalendarRepository.create(payload);
            expect(created).toHaveProperty('id');
            expect(created.duration).toBe(90);
            expect(created.notes).toBe("ملاحظات إضافية");
        });

        it('should update appointment status, details and recalculate duration', async () => {
            const updated = await CalendarRepository.update(1, { 
                status: "Completed",
                startTime: "10:00",
                endTime: "12:00"
            });
            expect(updated.status).toBe("Completed");
            expect(updated.duration).toBe(120);
        });

        it('should delete appointment successfully', async () => {
            const success = await CalendarRepository.delete(1);
            expect(success).toBe(true);

            const fetched = await CalendarRepository.getById(1);
            expect(fetched).toBeNull();
        });
    });

    describe('3. Repository Filters, Search and Sorting Options', () => {
        it('should filter appointments by search term matching notes', async () => {
            const filtered = await CalendarRepository.getAll({ search: 'أبدى التزاماً' });
            expect(filtered.length).toBe(1);
            expect(filtered[0].title).toBe('جلسة تدريب قوة');
        });

        it('should filter appointments by status', async () => {
            const filtered = await CalendarRepository.getAll({ status: 'Completed' });
            expect(filtered.every(e => e.status === 'Completed')).toBe(true);
        });

        it('should filter appointments by session type', async () => {
            const filtered = await CalendarRepository.getAll({ type: 'Nutrition Consultation' });
            expect(filtered.every(e => e.type === 'Nutrition Consultation')).toBe(true);
        });

        it('should filter appointments by client id', async () => {
            const filtered = await CalendarRepository.getAll({ clientId: 2 });
            expect(filtered.every(e => String(e.clientId) === '2')).toBe(true);
        });

        it('should sort appointments by start time chronologically', async () => {
            const filtered = await CalendarRepository.getAll({ date: '2026-07-13', sortBy: 'Start Time' });
            expect(filtered[0].startTime).toBe('10:00');
            expect(filtered[1].startTime).toBe('14:00');
            expect(filtered[2].startTime).toBe('18:00');
        });
    });

    describe('4. Calendar and Appointments UI Component rendering', () => {
        it('should render the Calendar Manager page, filters bar, and action shortcuts', async () => {
            render(
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <MemoryRouter initialEntries={['/calendar']}>
                            <Routes>
                                <Route path="/calendar" element={<Calendar />} />
                            </Routes>
                        </MemoryRouter>
                    </QueryClientProvider>
                </HelmetProvider>
            );

            const header = await screen.findByText('التقويم والجدولة التفاعلية');
            expect(header).toBeInTheDocument();

            expect(screen.getByText('نسبة الإكمال')).toBeInTheDocument();
            expect(screen.getByText('جلسات هذا الأسبوع')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('ابحث عن موعد...')).toBeInTheDocument();
        });
    });

    describe('5. Scheduling Utilities & Conflict Detection', () => {
        it('should identify scheduling overlaps for same coach or client', () => {
            const eventA = {
                id: 1,
                date: "2026-07-13",
                startTime: "10:00",
                endTime: "11:00",
                coachId: 1,
                clientId: 1
            };
            const eventB = {
                id: 2,
                date: "2026-07-13",
                startTime: "10:30", // overlap starts during eventA
                endTime: "11:30",
                coachId: 1,
                clientId: 2
            };
            expect(detectConflict(eventA, eventB)).toBe(true);
        });

        it('should not detect conflicts if times do not overlap', () => {
            const eventA = {
                id: 1,
                date: "2026-07-13",
                startTime: "10:00",
                endTime: "11:00",
                coachId: 1,
                clientId: 1
            };
            const eventB = {
                id: 2,
                date: "2026-07-13",
                startTime: "11:00",
                endTime: "12:00",
                coachId: 1,
                clientId: 1
            };
            expect(detectConflict(eventA, eventB)).toBe(false);
        });

        it('should generate grid matrix boundaries for month views', () => {
            const matrix = generateMonthMatrix("2026-07-13");
            expect(matrix.length).toBe(35);
            expect(matrix[0]).toBe("2026-06-28"); // Sunday before July
        });

        it('should generate weekdays lists correctly', () => {
            const week = generateWeekDays("2026-07-13");
            expect(week.length).toBe(7);
            expect(week[0]).toBe("2026-07-12"); // Sunday
            expect(week[6]).toBe("2026-07-18"); // Saturday
        });
    });
});

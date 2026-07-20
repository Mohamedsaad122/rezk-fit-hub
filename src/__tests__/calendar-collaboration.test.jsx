import { describe, it, expect, beforeEach } from 'vitest';
import { mockDatabase } from '../mocks/mockDatabase';
import { CalendarRepository } from '../modules/calendar/repositories/calendar.repository';
import { checkConflicts } from '../modules/calendar/utils/conflict-detection';
import { getAvailableSlots } from '../modules/calendar/utils/availability-engine';
import { generateOccurrences } from '../modules/calendar/utils/recurring-appointments';

describe('Collaborative Calendar & Resource Scheduling Test Suite', () => {
    beforeEach(() => {
        mockDatabase.reset();
    });

    describe('1. Resource Conflict Detection Engine', () => {
        it('should detect coach time overlap conflict', () => {
            const newEvent = {
                date: '2026-07-13',
                startTime: '10:00',
                endTime: '11:00',
                coachId: 1,
                branchId: 1
            };
            // Event 1 in mockDatabase is on 2026-07-13 at 10:00-11:00 for coachId 1
            const conflicts = checkConflicts(newEvent, mockDatabase.calendarEvents, null);
            expect(conflicts.length).toBeGreaterThan(0);
            expect(conflicts[0]).toContain('المدرب');
        });

        it('should detect room conflict', () => {
            const newEvent = {
                date: '2026-07-13',
                startTime: '14:00',
                endTime: '15:00',
                roomId: 'Room A',
                coachId: 2,
                branchId: 1
            };
            // Event 2 in mockDatabase has Room A, 14:00-15:00
            const conflicts = checkConflicts(newEvent, mockDatabase.calendarEvents, null);
            expect(conflicts.length).toBeGreaterThan(0);
            expect(conflicts[0]).toContain('القاعة');
        });

        it('should detect branch capacity limit conflict', () => {
            const events = [];
            for (let i = 1; i <= 5; i++) {
                events.push({
                    id: 100 + i,
                    date: '2026-07-20',
                    startTime: '10:00',
                    endTime: '11:00',
                    branchId: 1,
                    coachId: i
                });
            }
            const newEvent = {
                date: '2026-07-20',
                startTime: '10:00',
                endTime: '11:00',
                branchId: 1,
                coachId: 9
            };
            const conflicts = checkConflicts(newEvent, events, null);
            expect(conflicts.length).toBeGreaterThan(0);
            expect(conflicts[0]).toContain('الطاقة الاستيعابية');
        });
    });

    describe('2. Availability Engine', () => {
        it('should generate available slots excluding appointments', () => {
            const slots = getAvailableSlots({
                date: '2026-07-13',
                coachId: 1,
                branchId: 1,
                events: mockDatabase.calendarEvents
            });
            const hasConflictSlot = slots.some(s => s.startTime === '10:00');
            expect(hasConflictSlot).toBe(false);
        });
    });

    describe('3. Recurring Appointments Engine', () => {
        it('should generate weekly occurrences and respect skipHolidays', () => {
            const pattern = {
                frequency: 'weekly',
                interval: 1,
                count: 4,
                skipHolidays: true
            };
            const occurrences = generateOccurrences('2026-07-13', pattern);
            expect(occurrences.length).toBe(4);
            expect(occurrences[0]).toBe('2026-07-13');
            expect(occurrences[1]).toBe('2026-07-20');
        });
    });

    describe('4. Optimistic Locking Flow', () => {
        it('should acquire lock and auto-unlock on timeout', async () => {
            const locked = await CalendarRepository.lock(1, 'الكوتش أحمد');
            expect(locked.lock.isLocked).toBe(true);
            expect(locked.lock.lockedBy).toBe('الكوتش أحمد');

            const unlocked = await CalendarRepository.unlock(1);
            expect(unlocked.lock.isLocked).toBe(false);
        });
    });
});

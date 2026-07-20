import { describe, it, expect } from 'vitest';
import { CronService } from '../services/cron.service';

describe('Cron Schedule Evaluator Engine Test Suite', () => {
    it('should evaluate wildcard expressions to true for any date and time', () => {
        const date = new Date('2026-07-20T10:15:30Z');
        const match = CronService.evaluateCron('* * * * *', date);
        expect(match).toBe(true);
    });

    it('should evaluate step-based interval expressions (e.g. step division) correctly', () => {
        const dateMatching = new Date('2026-07-20T10:15:00Z'); // 15 mins (divisible by 5)
        const dateNotMatching = new Date('2026-07-20T10:16:00Z'); // 16 mins (not divisible by 5)

        expect(CronService.evaluateCron('*/5 * * * *', dateMatching)).toBe(true);
        expect(CronService.evaluateCron('*/5 * * * *', dateNotMatching)).toBe(false);

        expect(CronService.evaluateCron('*/10 * * * *', new Date('2026-07-20T10:20:00Z'))).toBe(true);
        expect(CronService.evaluateCron('*/10 * * * *', new Date('2026-07-20T10:25:00Z'))).toBe(false);
    });

    it('should evaluate specific minute matches correctly', () => {
        const dateMatching = new Date('2026-07-20T10:30:00Z');
        const dateNotMatching = new Date('2026-07-20T10:35:00Z');

        expect(CronService.evaluateCron('30 * * * *', dateMatching)).toBe(true);
        expect(CronService.evaluateCron('30 * * * *', dateNotMatching)).toBe(false);
    });

    it('should reject invalid cron expression shapes gracefully', () => {
        expect(CronService.evaluateCron('* * * *', new Date())).toBe(false); // only 4 fields instead of 5
        expect(CronService.evaluateCron('* * * * * *', new Date())).toBe(false); // 6 fields
    });
});

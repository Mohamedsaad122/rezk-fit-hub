import { describe, it, expect } from 'vitest';
import { RiskEngineService } from '../services/risk-engine.service';

describe('Real-Time Risk & Suspicious Login Detection Test Suite', () => {
    it('should assign a low base score to identical logins', () => {
        const current = { ipAddress: '192.168.1.1', userAgent: 'Chrome/Windows', location: 'Riyadh', createdAt: '2026-07-19T10:00:00Z' };
        const previous = [{ ipAddress: '192.168.1.1', userAgent: 'Chrome/Windows', location: 'Riyadh', createdAt: '2026-07-19T09:00:00Z' }];

        const check = RiskEngineService.calculateRisk(current, previous);
        expect(check.score).toBe(10);
        expect(check.isSuspicious).toBe(false);
    });

    it('should raise risk flag when device mismatch is seen', () => {
        const current = { ipAddress: '192.168.1.1', userAgent: 'Safari/iOS', location: 'Riyadh', createdAt: '2026-07-19T10:00:00Z' };
        const previous = [{ ipAddress: '192.168.1.1', userAgent: 'Chrome/Windows', location: 'Riyadh', createdAt: '2026-07-19T09:00:00Z' }];

        const check = RiskEngineService.calculateRisk(current, previous);
        expect(check.score).toBeGreaterThan(10);
        expect(check.triggers).toContain('Device fingerprint mismatch');
    });

    it('should trigger impossible travel when accessing locations geographically apart in short time periods', () => {
        const current = { ipAddress: '10.0.0.2', userAgent: 'Chrome/Windows', location: 'London', createdAt: '2026-07-19T10:30:00Z' }; // 30 mins later
        const previous = [{ ipAddress: '192.168.1.1', userAgent: 'Chrome/Windows', location: 'Riyadh', createdAt: '2026-07-19T10:00:00Z' }];

        const check = RiskEngineService.calculateRisk(current, previous);
        expect(check.isSuspicious).toBe(true);
        expect(check.score).toBeGreaterThan(50);
        expect(check.triggers.some(t => t.includes('Impossible travel detected'))).toBe(true);
    });
});

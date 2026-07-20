import { describe, it, expect } from 'vitest';
import { ComplianceService } from '../services/compliance.service';

describe('Corporate Governance & Security Compliance Test Suite', () => {
    it('should generate compliance audit checklist logs and scores', async () => {
        const stats = await ComplianceService.getComplianceStatus();
        expect(stats.soc2).toBeDefined();
        expect(stats.soc2.status).toBe('Compliant');
        expect(stats.soc2.score).toBeGreaterThanOrEqual(90);

        expect(stats.gdpr.checks.length).toBeGreaterThan(0);
    });

    it('should output valid OWASP compliance HTTP security headers', () => {
        const headers = ComplianceService.getSecurityHeaders();
        expect(headers['X-Frame-Options']).toBe('DENY');
        expect(headers['X-Content-Type-Options']).toBe('nosniff');
        expect(headers['Strict-Transport-Security']).toContain('max-age');
    });
});

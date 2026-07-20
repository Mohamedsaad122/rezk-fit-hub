import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { LoggingService } from '../services/logging.service';

describe('Structured Logging Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should log structured messages at different levels', async () => {
        const log = await LoggingService.info('Billing', 'User checked out');
        expect(log.id).toBeDefined();
        expect(log.level).toBe('Info');
        expect(log.category).toBe('Billing');
    });

    it('should query all log outputs', async () => {
        await LoggingService.error('Security', 'Unauthorized attempt', { ip: '127.0.0.1' });
        const list = await LoggingService.getLogs();
        expect(list.some(l => l.category === 'Security' && l.level === 'Error')).toBe(true);
    });
});

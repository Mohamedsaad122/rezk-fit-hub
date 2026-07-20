import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SecretService } from '../services/secret.service';

describe('Secrets Vault Management Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should register secrets in env profiles', async () => {
        const secret = await SecretService.createSecret('STRIPE_KEY', 'sk_test_123', 'Production');
        expect(secret.key).toBe('STRIPE_KEY');
        expect(secret.environment).toBe('Production');
        expect(secret.version).toBe(1);
    });

    it('should rotate keys, update versions, and capture history traces', async () => {
        const secret = await SecretService.createSecret('DATABASE_URL', 'postgresql://localhost:5432/db', 'Development');
        
        // Rotate value
        const updated = await SecretService.rotateSecret(secret.id, 'postgresql://remote-host:5432/db');
        expect(updated.version).toBe(2);
        expect(updated.value).toBe('postgresql://remote-host:5432/db');
        expect(updated.history.length).toBe(1);
        expect(updated.history[0].value).toBe('postgresql://localhost:5432/db');
    });
});

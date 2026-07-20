import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { ApiGatewayService } from '../services/api-gateway.service';
import { ApiKeyService } from '../services/api-key.service';
import { OauthService } from '../services/oauth.service';
import { DeveloperService } from '../services/developer.service';

describe('API Gateway Verification & Access Controls Test Suite', () => {
    let activeKey;
    let devApp;

    beforeEach(async () => {
        AppConfig.enableMock = true;
        mockDatabase.reset();

        // Seed API key
        activeKey = await ApiKeyService.generateKey('Internal Portal Key', ['clients:read', 'tasks:read']);
        
        // Seed OAuth App
        devApp = await DeveloperService.registerApp('Partner Application', null, ['https://callback.com']);
    });

    it('should validate API Key credentials and return requested clients', async () => {
        const authHeader = `ApiKey ${activeKey.value}`;
        const ip = '192.168.10.5';

        const clients = await ApiGatewayService.handleRequest(
            authHeader,
            ip,
            '/api/v1/clients',
            'GET'
        );

        expect(clients).toBeDefined();
        expect(clients.length).toBeGreaterThan(0);
    });

    it('should validate OAuth Bearer Tokens and check scopes', async () => {
        const token = await OauthService.exchangeToken(
            devApp.clientId,
            null,
            null,
            null,
            devApp.clientSecret
        );

        const authHeader = `Bearer ${token.accessToken}`;
        const ip = '192.168.10.6';

        // Accessing clients with valid Bearer token
        const clients = await ApiGatewayService.handleRequest(
            authHeader,
            ip,
            '/api/v1/clients',
            'GET'
        );
        expect(clients).toBeDefined();
    });

    it('should block requests with missing scopes or invalid keys', async () => {
        const authHeader = `ApiKey ${activeKey.value}`;
        const ip = '192.168.10.7';

        // POST requires write scope which is missing in activeKey
        await expect(ApiGatewayService.handleRequest(
            authHeader,
            ip,
            '/api/v1/clients',
            'POST',
            { name: 'John Doe', email: 'john@example.com' }
        )).rejects.toThrow('Forbidden: Access requires');

        // Invalid key
        await expect(ApiGatewayService.handleRequest(
            'ApiKey invalid_key_value',
            ip,
            '/api/v1/clients',
            'GET'
        )).rejects.toThrow('Unauthorized: Invalid Developer API key');
    });
});

import { ApiKeyService } from './api-key.service';
import { OauthService } from './oauth.service';
import { RateLimitService } from './rate-limit.service';
import { mockDatabase } from '@/mocks/mockDatabase';

export const ApiGatewayService = {
    handleRequest: async (authHeader, ipAddress, endpoint, method, payload = null) => {
        // 1. Rate Limit Checks
        await RateLimitService.checkAndThrottle(ipAddress);

        // 2. Auth Key or Token Validation
        let authContext = null;
        if (!authHeader) {
            throw new Error('Unauthorized: Authentication header required');
        }

        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const intro = await OauthService.introspect(token);
            if (!intro.active) {
                throw new Error('Unauthorized: Invalid OAuth access token');
            }
            authContext = { type: 'OAuth', scopes: intro.scope.split(' ') };
        } else if (authHeader.startsWith('ApiKey ')) {
            const keyVal = authHeader.substring(7);
            const apiKey = await ApiKeyService.validateKey(keyVal);
            if (!apiKey) {
                throw new Error('Unauthorized: Invalid Developer API key');
            }
            authContext = { type: 'ApiKey', scopes: apiKey.scopes };
        } else {
            throw new Error('Unauthorized: Unsupported authorization scheme');
        }

        // 3. Scope validation mapping
        const requiredScope = ApiGatewayService.resolveRequiredScope(endpoint, method);
        const hasScope = authContext.scopes.includes(requiredScope) ||
                         authContext.scopes.includes('admin') ||
                         (requiredScope.endsWith(':read') && authContext.scopes.includes('read')) ||
                         (requiredScope.endsWith(':write') && authContext.scopes.includes('write'));
        if (!hasScope) {
            throw new Error(`Forbidden: Access requires "${requiredScope}" scope`);
        }

        // 4. Mock REST Route Dispatcher
        return ApiGatewayService.dispatchMockRoute(endpoint, method, payload);
    },

    resolveRequiredScope: (endpoint, method) => {
        const cleanEndpoint = endpoint.replace(/^\/api\/v1\//, '');
        const base = cleanEndpoint.split('/')[0] || '';
        const suffix = method === 'GET' ? 'read' : 'write';
        return `${base}:${suffix}`;
    },

    dispatchMockRoute: (endpoint, method, payload) => {
        const cleanEndpoint = endpoint.replace(/^\/api\/v1\//, '');
        
        switch (cleanEndpoint) {
            case 'clients':
                if (method === 'GET') {
                    return mockDatabase.clients.getAll();
                } else if (method === 'POST') {
                    return mockDatabase.clients.create(payload);
                }
                break;
            case 'tasks':
                if (method === 'GET') {
                    return mockDatabase.tasks.getAll();
                } else if (method === 'POST') {
                    return mockDatabase.tasks.create(payload);
                }
                break;
            case 'calendar':
                if (method === 'GET') {
                    return mockDatabase.calendarEvents.getAll();
                }
                break;
            default:
                throw new Error(`Endpoint not found: ${endpoint}`);
        }
        
        throw new Error(`Unsupported method ${method} on endpoint ${endpoint}`);
    }
};

export default ApiGatewayService;

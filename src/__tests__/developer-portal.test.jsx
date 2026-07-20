import { describe, it, expect } from 'vitest';
import { DeveloperPortal } from '../pages/DeveloperPortal';
import { APIKeys } from '../pages/APIKeys';
import { OAuthApps } from '../pages/OAuthApps';
import { GraphQLPlayground } from '../pages/GraphQLPlayground';
import { ApiLogs } from '../pages/ApiLogs';
import { UsageDashboard } from '../pages/UsageDashboard';
import { RateLimits } from '../pages/RateLimits';
import { SDKDownloads } from '../pages/SDKDownloads';

describe('Developer Portal Interface Components Test Suite', () => {
    it('should export all developer platform page components properly', () => {
        expect(DeveloperPortal).toBeDefined();
        expect(APIKeys).toBeDefined();
        expect(OAuthApps).toBeDefined();
        expect(GraphQLPlayground).toBeDefined();
        expect(ApiLogs).toBeDefined();
        expect(UsageDashboard).toBeDefined();
        expect(RateLimits).toBeDefined();
        expect(SDKDownloads).toBeDefined();
    });
});

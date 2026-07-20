import { describe, it, expect } from 'vitest';
import { SdkGeneratorService } from '../services/sdk-generator.service';

describe('SDK Boilerplate Compilation & Code Generation Test Suite', () => {
    const languages = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PHP', 'Java', 'C#', 'Flutter'
    ];

    it('should compile correct templates containing client credentials for each target language', () => {
        const apiKey = 'rfh_live_test_credential_123';

        languages.forEach(lang => {
            const code = SdkGeneratorService.generateSdkCode(lang, apiKey);
            expect(code).toBeDefined();
            expect(code.length).toBeGreaterThan(50);
            
            // Check that custom key or key placeholders are injected
            expect(code).toContain(apiKey);

            // Syntactical checks
            if (lang === 'Python') {
                expect(code).toContain('def __init__');
            } else if (lang === 'JavaScript') {
                expect(code).toContain('class RezkFitHubSDK');
            } else if (lang === 'PHP') {
                expect(code).toContain('<?php');
            } else if (lang === 'C#') {
                expect(code).toContain('class RezkFitHubSDK');
                expect(code).toContain('HttpClient');
            } else if (lang === 'Flutter') {
                expect(code).toContain('class RezkFitHubSDK');
                expect(code).toContain('Future<List');
            }
        });
    });
});

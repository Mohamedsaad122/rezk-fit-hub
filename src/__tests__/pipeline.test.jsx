import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('GitHub Actions CI/CD Pipeline Schema', () => {
    it('should verify standard workflows step structure', () => {
        const pipelinePath = path.resolve('.github/workflows/frontend.yml');
        const pipelineContent = fs.readFileSync(pipelinePath, 'utf8');

        expect(pipelineContent).toContain('name: Rezk Fit Hub CI/CD Pipeline');
        expect(pipelineContent).toContain('Security Vulnerability Scan');
        expect(pipelineContent).toContain('docker-build-publish:');
        expect(pipelineContent).toContain('tag-and-release:');
    });
});

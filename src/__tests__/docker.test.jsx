import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Production Docker Configurations', () => {
    it('should verify the Dockerfile target stages and ports', () => {
        const dockerfilePath = path.resolve('Dockerfile');
        const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');

        expect(dockerfileContent).toContain('FROM node:20-alpine AS development');
        expect(dockerfileContent).toContain('FROM node:20-alpine AS builder');
        expect(dockerfileContent).toContain('FROM nginx:stable-alpine AS runner');
        expect(dockerfileContent).toContain('EXPOSE 80');
    });

    it('should verify the compose configuration structure', () => {
        const composePath = path.resolve('docker-compose.yml');
        const composeContent = fs.readFileSync(composePath, 'utf8');

        expect(composeContent).toContain('version: \'3.8\'');
        expect(composeContent).toContain('frontend:');
        expect(composeContent).toContain('redis:');
    });
});

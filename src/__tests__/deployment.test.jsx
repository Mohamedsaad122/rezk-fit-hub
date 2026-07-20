import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Production Deployment & Ingress Mappings', () => {
    it('should verify load balancing configuration and nginx headers in ingress', () => {
        const ingressPath = path.resolve('kubernetes/ingress.yaml');
        const ingressContent = fs.readFileSync(ingressPath, 'utf8');

        expect(ingressContent).toContain('kubernetes.io/ingress.class: nginx');
        expect(ingressContent).toContain('nginx.ingress.kubernetes.io/affinity: "cookie"');
        expect(ingressContent).toContain('nginx.ingress.kubernetes.io/limit-rps: "10"');
    });
});

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Security Runtime & Policies Settings', () => {
    it('should verify the deployment pods run as non-root with allowPrivilegeEscalation disabled', () => {
        const deploymentPath = path.resolve('kubernetes/deployment.yaml');
        const deploymentContent = fs.readFileSync(deploymentPath, 'utf8');

        expect(deploymentContent).toContain('runAsNonRoot: true');
        expect(deploymentContent).toContain('allowPrivilegeEscalation: false');
    });

    it('should verify Kubernetes network isolation rules defined in NetworkPolicy', () => {
        const netpolPath = path.resolve('kubernetes/network-policy.yaml');
        const netpolContent = fs.readFileSync(netpolPath, 'utf8');

        expect(netpolContent).toContain('NetworkPolicy');
        expect(netpolContent).toContain('podSelector:');
    });
});

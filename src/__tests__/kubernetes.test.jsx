import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Kubernetes Manifests Configurations', () => {
    it('should verify deployment limits and probes configurations', () => {
        const deploymentPath = path.resolve('kubernetes/deployment.yaml');
        const deploymentContent = fs.readFileSync(deploymentPath, 'utf8');

        expect(deploymentContent).toContain('replicas: 3');
        expect(deploymentContent).toContain('cpu: 500m');
        expect(deploymentContent).toContain('livenessProbe:');
        expect(deploymentContent).toContain('readinessProbe:');
    });

    it('should verify Autoscaling limits configured in HPA', () => {
        const hpaPath = path.resolve('kubernetes/hpa.yaml');
        const hpaContent = fs.readFileSync(hpaPath, 'utf8');

        expect(hpaContent).toContain('minReplicas: 2');
        expect(hpaContent).toContain('maxReplicas: 10');
        expect(hpaContent).toContain('averageUtilization: 80');
    });

    it('should verify pod disruption budget minimum availability', () => {
        const pdbPath = path.resolve('kubernetes/pdb.yaml');
        const pdbContent = fs.readFileSync(pdbPath, 'utf8');

        expect(pdbContent).toContain('minAvailable: 2');
    });
});

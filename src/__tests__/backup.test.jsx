import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Disaster Recovery Backup Extractions', () => {
    it('should verify setup configurations present in backup scripts', () => {
        const backupScriptPath = path.resolve('scripts/backup.sh');
        const backupScriptContent = fs.readFileSync(backupScriptPath, 'utf8');

        expect(backupScriptContent).toContain('BACKUP_DIR="/backups"');
        expect(backupScriptContent).toContain('tar -czf');
    });
});

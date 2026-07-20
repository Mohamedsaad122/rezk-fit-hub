import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { ConflictResolver } from '../infrastructure/conflict-resolver';
import { ConflictResolutionService } from '../services/conflict-resolution.service';
import { useSyncStore } from '../store/sync.store';
import { indexedDBService } from '../infrastructure/indexeddb.service';
import { SyncRepository } from '../repositories/sync.repository';

describe('Data Conflict Resolution & Merging Test Suite', () => {
    beforeEach(async () => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        useSyncStore.setState({ conflicts: [] });
        await indexedDBService.clear('pending_mutations');
    });

    it('should resolve using Last Write Wins (LWW) strategy correctly', () => {
        const local = { id: 1, name: 'Local Rezk', updatedAt: '2026-07-19T02:00:00Z' };
        const remote = { id: 1, name: 'Remote Rezk', updatedAt: '2026-07-19T01:00:00Z' };

        const resolved = ConflictResolver.resolveLastWriteWins(local, remote);
        expect(resolved.name).toBe('Local Rezk'); // Local has newer timestamp
    });

    it('should resolve using Field-Level Merge strategy correctly', () => {
        const local = { id: 1, name: 'Modified Name' };
        const remote = { id: 1, name: 'Original Name', description: 'Original Description' };

        const resolved = ConflictResolver.resolveFieldLevelMerge(local, remote);
        expect(resolved.name).toBe('Modified Name');
        expect(resolved.description).toBe('Original Description');
    });

    it('should resolve using Version Comparison strategy correctly', () => {
        const local = { id: 1, name: 'Local', version: 2 };
        const remote = { id: 1, name: 'Remote', version: 3 };

        const resolved = ConflictResolver.resolveVersionComparison(local, remote);
        expect(resolved.name).toBe('Remote'); // Remote version is higher
    });

    it('should handle conflict resolution service and update transaction queue status', async () => {
        const conflictItem = {
            id: 'mut_conf_999',
            tenantId: 1,
            url: '/api/members/1',
            method: 'PUT',
            payload: { name: 'Mohamed local', version: 2 },
            status: 'Conflict',
            timestamp: new Date().toISOString()
        };

        // Seed conflict into Zustand and DB
        useSyncStore.getState().addConflict(conflictItem);
        await indexedDBService.put('pending_mutations', conflictItem);
        await SyncRepository.addToQueue(conflictItem);

        // Resolve conflict using LWW
        const resolved = await ConflictResolutionService.resolveConflict('mut_conf_999', 'LWW');
        
        expect(resolved).toBeDefined();
        expect(resolved.status).toBe('Pending'); // Re-queued
        expect(resolved.conflictType).toBeNull();

        // Conflicts length should be 0
        expect(useSyncStore.getState().conflicts.length).toBe(0);
    });
});

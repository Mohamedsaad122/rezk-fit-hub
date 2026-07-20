import { describe, it, expect, beforeEach } from 'vitest';
import { indexedDBService } from '../infrastructure/indexeddb.service';

describe('IndexedDB Offline Storage & Encryption Test Suite', () => {
    beforeEach(async () => {
        await indexedDBService.clear('drafts');
    });

    it('should insert and read values from IndexedDB successfully', async () => {
        const item = { id: 'draft_1', tenantId: 1, title: 'خطة تدريب الصدر للمشترك محمد' };
        await indexedDBService.put('drafts', item);

        const retrieved = await indexedDBService.get('drafts', 'draft_1');
        expect(retrieved).toBeDefined();
        expect(retrieved.id).toBe('draft_1');
        expect(retrieved.title).toBe('خطة تدريب الصدر للمشترك محمد');
    });

    it('should encrypt values inside raw storage and decrypt upon retrieval', async () => {
        const item = { id: 'draft_2', tenantId: 1, text: 'سرية للغاية' };
        await indexedDBService.put('drafts', item);

        // Verify that data retrieved from service is parsed and decrypted
        const clean = await indexedDBService.get('drafts', 'draft_2');
        expect(clean.text).toBe('سرية للغاية');

        // Access raw memory store to prove data is encrypted in the store
        if (indexedDBService.isMemoryMode) {
            const raw = indexedDBService.memoryStore.drafts.get('draft_2');
            expect(raw).toBeDefined();
            expect(raw).not.toContain('سرية للغاية'); // It is fully base64 encrypted
        }
    });

    it('should delete keys and clear collections from IndexedDB', async () => {
        await indexedDBService.put('drafts', { id: 'k1', val: 'A' });
        await indexedDBService.put('drafts', { id: 'k2', val: 'B' });

        let list = await indexedDBService.getAll('drafts');
        expect(list.length).toBe(2);

        await indexedDBService.delete('drafts', 'k1');
        list = await indexedDBService.getAll('drafts');
        expect(list.length).toBe(1);
        expect(list[0].id).toBe('k2');

        await indexedDBService.clear('drafts');
        list = await indexedDBService.getAll('drafts');
        expect(list.length).toBe(0);
    });
});

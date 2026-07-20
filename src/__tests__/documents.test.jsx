import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { DocumentRepository } from '../repositories/document.repository';
import { MediaRepository } from '../repositories/media.repository';
import { useDocumentStore } from '../store/document.store';
import { formatBytes, getFileCategory, getFileIcon } from '../utils/file-utils';
import { getDocumentPreviewContent } from '../utils/document-preview';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

describe('Sprint 3.8 Enterprise Documents & Media Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
        useDocumentStore.getState().resetFilters();
    });

    describe('1. Zod Schema, File Utils, and Previews', () => {
        it('should successfully calculate storage bytes formatting', () => {
            expect(formatBytes(0)).toBe('0 Bytes');
            expect(formatBytes(1024)).toBe('1 KB');
            expect(formatBytes(1048576)).toBe('1 MB');
        });

        it('should resolve file categories correctly', () => {
            expect(getFileCategory('pdf')).toBe('PDF');
            expect(getFileCategory('png')).toBe('Images');
            expect(getFileCategory('xlsx')).toBe('Excel');
            expect(getFileCategory('zip')).toBe('ZIP');
        });

        it('should resolve file icons correctly', () => {
            expect(getFileIcon('pdf')).toBe('📕');
            expect(getFileIcon('png')).toBe('🖼️');
            expect(getFileIcon('zip')).toBe('📦');
        });

        it('should render document preview component structure', () => {
            const mockDoc = { id: 99, name: 'test.png', extension: 'png', url: 'http://test.com/img.png' };
            const preview = getDocumentPreviewContent(mockDoc);
            render(preview);
            const img = screen.getByAltText('test.png');
            expect(img).toBeDefined();
            expect(img.getAttribute('src')).toBe('http://test.com/img.png');
        });
    });

    describe('2. Zustand Store States & Actions', () => {
        it('should maintain store defaults and toggle filter values', () => {
            const store = useDocumentStore.getState();
            expect(store.filters.category).toBe('All');
            expect(store.filters.isArchived).toBe(false);

            store.setFilters({ category: 'PDF', isArchived: true });
            const updated = useDocumentStore.getState();
            expect(updated.filters.category).toBe('PDF');
            expect(updated.filters.isArchived).toBe(true);

            store.resetFilters();
            const resetStore = useDocumentStore.getState();
            expect(resetStore.filters.category).toBe('All');
            expect(resetStore.filters.isArchived).toBe(false);
        });

        it('should toggle layout modes in store', () => {
            const store = useDocumentStore.getState();
            expect(store.layoutMode).toBe('grid');

            store.setLayoutMode('list');
            expect(useDocumentStore.getState().layoutMode).toBe('list');
        });
    });

    describe('3. Document & Media Repository CRUD and In-Memory Updates', () => {
        it('should retrieve list of all documents from mock database', async () => {
            const docs = await DocumentRepository.getAll();
            expect(docs.length).toBeGreaterThan(0);
            expect(docs[0].name).toBeDefined();
        });

        it('should upload a mock file and verify entry', async () => {
            const beforeCount = (await DocumentRepository.getAll()).length;
            const newDoc = await DocumentRepository.create({
                name: 'تقرير جديد.pdf',
                extension: 'pdf',
                size: 50000,
                category: 'Medical Reports',
                owner: 'Coach'
            });

            expect(newDoc.id).toBeDefined();
            expect(newDoc.name).toBe('تقرير جديد.pdf');

            const afterDocs = await DocumentRepository.getAll();
            expect(afterDocs.length).toBe(beforeCount + 1);
        });

        it('should rename a file successfully', async () => {
            const docs = await DocumentRepository.getAll();
            const first = docs[0];

            const updated = await DocumentRepository.update(first.id, { name: 'اسم_معدل.pdf' });
            expect(updated.name).toBe('اسم_معدل.pdf');

            const checked = await DocumentRepository.getById(first.id);
            expect(checked.name).toBe('اسم_معدل.pdf');
        });

        it('should favorite a document', async () => {
            const docs = await DocumentRepository.getAll();
            const first = docs[0];
            const originalFav = first.isFavorite;

            const updated = await DocumentRepository.update(first.id, { isFavorite: !originalFav });
            expect(updated.isFavorite).toBe(!originalFav);
        });

        it('should duplicate a document', async () => {
            const docs = await DocumentRepository.getAll();
            const first = docs[0];

            const duplicated = await DocumentRepository.duplicate(first.id);
            expect(duplicated.id).not.toBe(first.id);
            expect(duplicated.name).toContain('نسخة');
        });

        it('should archive and retrieve archived documents', async () => {
            const activeDocs = await DocumentRepository.getAll({ isArchived: false });
            const first = activeDocs[0];

            // Archive it
            await DocumentRepository.update(first.id, { isArchived: true });

            const archivedDocs = await DocumentRepository.getAll({ isArchived: true });
            expect(archivedDocs.some(d => d.id === first.id)).toBe(true);

            // Active list should not contain it
            const activeDocsAfter = await DocumentRepository.getAll({ isArchived: false });
            expect(activeDocsAfter.some(d => d.id === first.id)).toBe(false);
        });

        it('should delete a document', async () => {
            const docs = await DocumentRepository.getAll();
            const first = docs[0];
            const beforeLength = docs.length;

            const deleted = await DocumentRepository.delete(first.id);
            expect(deleted).toBe(true);

            const afterDocs = await DocumentRepository.getAll();
            expect(afterDocs.length).toBe(beforeLength - 1);
            expect(afterDocs.some(d => d.id === first.id)).toBe(false);
        });

        it('should retrieve and update media coordinates settings', async () => {
            // Find an image document (id: 3 is the seed progress photo)
            const media = await MediaRepository.getByDocumentId(3);
            expect(media).not.toBeNull();
            expect(media.rotationAngle).toBe(0);

            const updated = await MediaRepository.update(media.id, { rotationAngle: 90, zoomLevel: 1.5 });
            expect(updated.rotationAngle).toBe(90);
            expect(updated.zoomLevel).toBe(1.5);
        });

        it('should calculate storage usage metrics and breakdowns', async () => {
            const usage = await DocumentRepository.getStorageUsage();
            expect(usage.used).toBeGreaterThan(0);
            expect(usage.limit).toBe(5 * 1024 * 1024 * 1024);
            expect(usage.breakdown.pdf).toBeDefined();
        });
    });
});

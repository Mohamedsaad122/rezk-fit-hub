import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import {
    DocumentResponseSchema,
    DocumentListResponseSchema,
    StorageUsageSchema
} from '@/contracts/document.contract';

export const DocumentRepository = {
    getAll: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.getAll(filters));
        } else {
            const response = await api.get('/documents', { params: filters });
            result = response.data;
        }
        return parseApiResponse(DocumentListResponseSchema, result, 'Document List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.getById(id));
        } else {
            const response = await api.get(`/documents/${id}`);
            result = response.data;
        }
        return parseApiResponse(DocumentResponseSchema, result, 'Document Detail');
    },

    create: async (docData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.create(docData));
        } else {
            const response = await api.post('/documents', docData);
            result = response.data;
        }
        return parseApiResponse(DocumentResponseSchema, result, 'Create Document');
    },

    update: async (id, docData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.update(id, docData));
        } else {
            const response = await api.put(`/documents/${id}`, docData);
            result = response.data;
        }
        return parseApiResponse(DocumentResponseSchema, result, 'Update Document');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.delete(id));
        } else {
            const response = await api.delete(`/documents/${id}`);
            result = response.data;
        }
        return result;
    },

    duplicate: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.duplicate(id));
        } else {
            const response = await api.post(`/documents/${id}/duplicate`);
            result = response.data;
        }
        return parseApiResponse(DocumentResponseSchema, result, 'Duplicate Document');
    },

    getStorageUsage: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.documents.getStorageUsage());
        } else {
            const response = await api.get('/documents/storage/usage');
            result = response.data;
        }
        return parseApiResponse(StorageUsageSchema, result, 'Storage Usage');
    }
};

export default DocumentRepository;

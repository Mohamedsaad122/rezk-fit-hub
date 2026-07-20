import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { MediaSchema, MediaListSchema } from '@/contracts/media.contract';

export const MediaRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.media.getAll());
        } else {
            const response = await api.get('/media');
            result = response.data;
        }
        return parseApiResponse(MediaListSchema, result, 'Media List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.media.getById(id));
        } else {
            const response = await api.get(`/media/${id}`);
            result = response.data;
        }
        return parseApiResponse(MediaSchema, result, 'Media Detail');
    },

    getByDocumentId: async (docId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.media.getByDocumentId(docId));
        } else {
            const response = await api.get(`/media/document/${docId}`);
            result = response.data;
        }
        return parseApiResponse(MediaSchema, result, 'Media by Document ID');
    },

    update: async (id, mediaData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.media.update(id, mediaData));
        } else {
            const response = await api.put(`/media/${id}`, mediaData);
            result = response.data;
        }
        return parseApiResponse(MediaSchema, result, 'Update Media');
    }
};

export default MediaRepository;

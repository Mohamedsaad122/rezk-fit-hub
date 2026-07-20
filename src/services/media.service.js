import { MediaRepository } from '@/repositories/media.repository';

export const MediaService = {
    getAllMedia: () => {
        return MediaRepository.getAll();
    },

    getMediaById: (id) => {
        return MediaRepository.getById(id);
    },

    getMediaByDocumentId: (docId) => {
        return MediaRepository.getByDocumentId(docId);
    },

    updateMedia: (id, mediaData) => {
        return MediaRepository.update(id, mediaData);
    }
};

export default MediaService;

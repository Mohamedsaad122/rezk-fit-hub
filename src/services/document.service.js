import { DocumentRepository } from '@/repositories/document.repository';

export const DocumentService = {
    getAllDocuments: (filters = {}) => {
        return DocumentRepository.getAll(filters);
    },

    getDocumentById: (id) => {
        return DocumentRepository.getById(id);
    },

    createDocument: (docData) => {
        return DocumentRepository.create(docData);
    },

    updateDocument: (id, docData) => {
        return DocumentRepository.update(id, docData);
    },

    deleteDocument: (id) => {
        return DocumentRepository.delete(id);
    },

    duplicateDocument: (id) => {
        return DocumentRepository.duplicate(id);
    },

    getStorageUsage: () => {
        return DocumentRepository.getStorageUsage();
    }
};

export default DocumentService;

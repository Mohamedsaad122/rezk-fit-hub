import { ProviderManagerService } from './provider-manager.service';
import { StorageAdapters } from './adapters/storage.adapters';

export const StorageService = {
    uploadFile: async (fileName, fileContent) => {
        const provider = ProviderManagerService.getStorageProvider();
        const adapter = StorageAdapters[provider] || StorageAdapters.Mock;
        return adapter.uploadFile(fileName, fileContent);
    },

    deleteFile: async (fileUrl) => {
        const provider = ProviderManagerService.getStorageProvider();
        const adapter = StorageAdapters[provider] || StorageAdapters.Mock;
        return adapter.deleteFile(fileUrl);
    }
};

export default StorageService;

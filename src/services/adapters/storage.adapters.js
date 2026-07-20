const createStorageAdapter = (providerName) => ({
    uploadFile: async (fileName, fileContent) => {
        return {
            success: true,
            provider: providerName,
            fileUrl: `https://${providerName.toLowerCase().replace('_', '-')}.com/storage/bucket/${fileName}`,
            fileName,
            sizeBytes: fileContent ? fileContent.length : 1024
        };
    },
    deleteFile: async (fileUrl) => {
        return {
            success: true,
            provider: providerName,
            deletedUrl: fileUrl
        };
    }
});

export const StorageAdapters = {
    AWS_S3: createStorageAdapter('AWS_S3'),
    GoogleDrive: createStorageAdapter('GoogleDrive'),
    Dropbox: createStorageAdapter('Dropbox'),
    OneDrive: createStorageAdapter('OneDrive'),
    Cloudinary: createStorageAdapter('Cloudinary'),
    FirebaseStorage: createStorageAdapter('FirebaseStorage'),
    Mock: createStorageAdapter('Mock')
};

export default StorageAdapters;

export const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
};

export const simulateFileUpload = (file, onProgress) => {
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (onProgress) onProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                
                // Return mock file metadata
                const ext = getFileExtension(file.name) || 'pdf';
                let mockUrl = 'https://example.com/files/uploaded_file.pdf';
                
                if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
                    mockUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80';
                } else if (ext === 'mp4') {
                    mockUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                }

                resolve({
                    name: file.name,
                    size: file.size || 102400, // default 100KB
                    extension: ext,
                    url: mockUrl,
                    createdAt: new Date().toISOString()
                });
            }
        }, 100);
    });
};

export default {
    getFileExtension,
    simulateFileUpload
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getFileCategory = (extension) => {
    const ext = extension.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
        return 'Images';
    }
    if (ext === 'pdf') {
        return 'PDF';
    }
    if (['doc', 'docx'].includes(ext)) {
        return 'Word';
    }
    if (['xls', 'xlsx'].includes(ext)) {
        return 'Excel';
    }
    if (ext === 'csv') {
        return 'CSV';
    }
    if (ext === 'zip') {
        return 'ZIP';
    }
    if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) {
        return 'Videos';
    }
    if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) {
        return 'Audio';
    }
    return 'Other';
};

export const getFileIcon = (extension) => {
    const category = getFileCategory(extension);
    switch (category) {
        case 'Images':
            return '🖼️';
        case 'PDF':
            return '📕';
        case 'Word':
            return '📘';
        case 'Excel':
            return '📗';
        case 'CSV':
            return '📝';
        case 'ZIP':
            return '📦';
        case 'Videos':
            return '🎥';
        case 'Audio':
            return '🎵';
        default:
            return '📄';
    }
};

export const getFileTypeLabel = (extension) => {
    const category = getFileCategory(extension);
    switch (category) {
        case 'Images':
            return 'صورة';
        case 'PDF':
            return 'ملف PDF';
        case 'Word':
            return 'مستند Word';
        case 'Excel':
            return 'جدول Excel';
        case 'CSV':
            return 'ملف CSV';
        case 'ZIP':
            return 'ملف مضغوط ZIP';
        case 'Videos':
            return 'فيديو';
        case 'Audio':
            return 'ملف صوتي';
        default:
            return 'ملف عام';
    }
};

export default {
    formatBytes,
    getFileCategory,
    getFileIcon,
    getFileTypeLabel
};

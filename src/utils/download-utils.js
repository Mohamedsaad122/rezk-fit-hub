import { toastService } from '@/services/toast.service';

export const downloadFile = (document) => {
    if (!document) return;
    
    // Simulate starting download
    toastService.success(`جاري تحميل الملف "${document.name}"...`);

    // In a mock environment, we will simulate downloading by opening the url in a new tab
    // if it starts with http, or trigger download link.
    try {
        const link = window.document.createElement('a');
        link.href = document.url;
        link.setAttribute('download', document.name);
        link.setAttribute('target', '_blank');
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    } catch (error) {
        console.error("Download failed, falling back to window.open", error);
        window.open(document.url, '_blank');
    }
};

export default {
    downloadFile
};

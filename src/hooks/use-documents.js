import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentService } from '@/services/document.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';

export const useDocuments = (filters = {}) => {
    const queryKey = QUERY_KEYS.documents?.list ? QUERY_KEYS.documents.list(filters) : ['documents', 'list', filters];

    const query = useQuery({
        queryKey,
        queryFn: () => DocumentService.getAllDocuments(filters),
        placeholderData: (prev) => prev
    });

    return {
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        data: query.data || [],
        refetch: query.refetch
    };
};

export const useDocument = (id) => {
    const query = useQuery({
        queryKey: QUERY_KEYS.documents?.detail ? QUERY_KEYS.documents.detail(id) : ['documents', 'detail', id],
        queryFn: () => DocumentService.getDocumentById(id),
        enabled: !!id
    });

    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data || null,
        refetch: query.refetch
    };
};

export const useCreateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (docData) => DocumentService.createDocument(docData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toastService.success('تم رفع الملف بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل رفع الملف', error.message);
        }
    });
};

export const useUpdateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => DocumentService.updateDocument(id, data),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['documents', 'detail', id] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toastService.success('تم تحديث الملف بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل تحديث الملف', error.message);
        }
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => DocumentService.deleteDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toastService.success('تم حذف الملف بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف الملف', error.message);
        }
    });
};

export const useDuplicateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => DocumentService.duplicateDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toastService.success('تم تكرار الملف بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل تكرار الملف', error.message);
        }
    });
};

export const useStorageUsage = () => {
    const query = useQuery({
        queryKey: QUERY_KEYS.documents?.storage ? QUERY_KEYS.documents.storage() : ['documents', 'storage'],
        queryFn: () => DocumentService.getStorageUsage()
    });

    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data || {
            used: 0,
            limit: 5 * 1024 * 1024 * 1024,
            breakdown: { images: 0, pdf: 0, documents: 0, videos: 0, audio: 0, other: 0 }
        },
        refetch: query.refetch
    };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MediaService } from '@/services/media.service';
import { toastService } from '@/services/toast.service';

export const useAllMedia = () => {
    const query = useQuery({
        queryKey: ['media', 'all'],
        queryFn: () => MediaService.getAllMedia()
    });

    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data || [],
        refetch: query.refetch
    };
};

export const useMedia = (id) => {
    const query = useQuery({
        queryKey: ['media', 'detail', id],
        queryFn: () => MediaService.getMediaById(id),
        enabled: !!id
    });

    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data || null,
        refetch: query.refetch
    };
};

export const useMediaByDocumentId = (docId) => {
    const query = useQuery({
        queryKey: ['media', 'document', docId],
        queryFn: () => MediaService.getMediaByDocumentId(docId),
        enabled: !!docId
    });

    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data || null,
        refetch: query.refetch
    };
};

export const useUpdateMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => MediaService.updateMedia(id, data),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['media'] });
            queryClient.invalidateQueries({ queryKey: ['media', 'detail', id] });
            if (data?.documentId) {
                queryClient.invalidateQueries({ queryKey: ['media', 'document', data.documentId] });
            }
        },
        onError: (error) => {
            toastService.error('فشل تحديث إعدادات الميديا', error.message);
        }
    });
};

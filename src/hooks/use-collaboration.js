import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import CollaborationRepository from '../repositories/collaboration.repository';
import ActivityRepository from '../repositories/activity.repository';
import { eventBus } from '../realtime/event-bus';
import { SOCKET_EVENTS } from '../realtime/socket-events';

// Hook 1: useEntityLock
export const useEntityLock = (entityType, entityId, isEditing, username = 'الكوتش أحمد', avatar = '👤') => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['entity-lock', entityType, entityId], [entityType, entityId]);

    const { data: lockData, refetch } = useQuery({
        queryKey,
        queryFn: () => CollaborationRepository.getLock(entityType, entityId),
        refetchInterval: 15000, // fallback polling
    });

    const acquireMutation = useMutation({
        mutationFn: () => CollaborationRepository.acquireLock(entityType, entityId, username, avatar),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data.lock);
        }
    });

    const releaseMutation = useMutation({
        mutationFn: () => CollaborationRepository.releaseLock(entityType, entityId, username),
        onSuccess: () => {
            queryClient.setQueryData(queryKey, { isLocked: false });
        }
    });

    const renewMutation = useMutation({
        mutationFn: () => CollaborationRepository.renewLock(entityType, entityId, username, avatar),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data.lock);
        }
    });

    const acquireMutate = acquireMutation.mutate;
    const renewMutate = renewMutation.mutate;
    const releaseMutate = releaseMutation.mutate;

    // Setup heartbeat and release lifecycles
    useEffect(() => {
        if (!isEditing || !entityId) return;

        // Try to acquire lock immediately
        acquireMutate();

        // Setup 10 seconds heartbeat interval
        const heartbeatInterval = setInterval(() => {
            renewMutate();
        }, 10000);

        return () => {
            clearInterval(heartbeatInterval);
            releaseMutate();
        };
    }, [isEditing, entityId, acquireMutate, renewMutate, releaseMutate]);

    // Setup real-time socket events for locks
    useEffect(() => {
        if (!entityId) return;

        const handleLocked = (event) => {
            if (event.entityType === entityType && String(event.entityId) === String(entityId)) {
                queryClient.setQueryData(queryKey, event);
            }
        };

        const handleUnlocked = (event) => {
            if (event.entityType === entityType && String(event.entityId) === String(entityId)) {
                queryClient.setQueryData(queryKey, { isLocked: false });
            }
        };

        eventBus.subscribe(SOCKET_EVENTS.ENTITY_LOCKED, handleLocked);
        eventBus.subscribe(SOCKET_EVENTS.ENTITY_UNLOCKED, handleUnlocked);

        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.ENTITY_LOCKED, handleLocked);
            eventBus.unsubscribe(SOCKET_EVENTS.ENTITY_UNLOCKED, handleUnlocked);
        };
    }, [entityType, entityId, queryClient, queryKey]);

    const isLockedByOther = lockData?.isLocked && lockData?.lockedBy !== username;

    return {
        lockData,
        isLockedByOther,
        acquireLock: acquireMutation.mutateAsync,
        releaseLock: releaseMutation.mutateAsync,
        forceUnlock: async () => {
            await CollaborationRepository.releaseLock(entityType, entityId, username);
            queryClient.setQueryData(queryKey, { isLocked: false });
        },
        refetch
    };
};

// Hook 2: useEntityComments
export const useEntityComments = (entityType, entityId) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['comments', entityType, entityId], [entityType, entityId]);

    const { data: comments = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => CollaborationRepository.getComments(entityType, entityId),
        enabled: !!entityId
    });

    const addCommentMutation = useMutation({
        mutationFn: ({ text, author, authorAvatar, parentId }) =>
            CollaborationRepository.addComment(entityType, entityId, text, author, authorAvatar, parentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const updateCommentMutation = useMutation({
        mutationFn: ({ id, text }) => CollaborationRepository.updateComment(id, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (id) => CollaborationRepository.deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const togglePinMutation = useMutation({
        mutationFn: ({ id, isPinned }) => CollaborationRepository.togglePinComment(id, isPinned),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const resolveMutation = useMutation({
        mutationFn: ({ id, isResolved }) => CollaborationRepository.resolveComment(id, isResolved),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const addReactionMutation = useMutation({
        mutationFn: ({ id, username, emoji }) => CollaborationRepository.addReaction(id, username, emoji),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const removeReactionMutation = useMutation({
        mutationFn: ({ id, username, emoji }) => CollaborationRepository.removeReaction(id, username, emoji),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    // Realtime sub for comments
    useEffect(() => {
        if (!entityId) return;

        const handleCommentChange = (event) => {
            if (event.entityType === entityType && String(event.entityId) === String(entityId)) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        const handleCommentDeleted = (event) => {
            if (event.entityType === entityType && String(event.entityId) === String(entityId)) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        eventBus.subscribe(SOCKET_EVENTS.COMMENT_CREATED, handleCommentChange);
        eventBus.subscribe(SOCKET_EVENTS.COMMENT_UPDATED, handleCommentChange);
        eventBus.subscribe(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);

        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_CREATED, handleCommentChange);
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_UPDATED, handleCommentChange);
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_DELETED, handleCommentDeleted);
        };
    }, [entityType, entityId, queryClient, queryKey]);

    return {
        comments,
        isLoading,
        addComment: addCommentMutation.mutateAsync,
        updateComment: updateCommentMutation.mutateAsync,
        deleteComment: deleteCommentMutation.mutateAsync,
        togglePin: togglePinMutation.mutateAsync,
        resolveComment: resolveMutation.mutateAsync,
        addReaction: addReactionMutation.mutateAsync,
        removeReaction: removeReactionMutation.mutateAsync
    };
};

// Hook 3: useEntityTimeline
export const useEntityTimeline = (entityType, entityId) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['timeline', entityType, entityId], [entityType, entityId]);

    const { data: timeline = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => ActivityRepository.getActivities({ entityType, entityId }),
        enabled: !!entityId
    });

    // Realtime sub for timeline activity
    useEffect(() => {
        if (!entityId) return;

        const handleActivity = (event) => {
            if (event.category === entityType && String(event.clientId) === String(entityId)) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        eventBus.subscribe(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivity);

        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.ACTIVITY_CREATED, handleActivity);
        };
    }, [entityType, entityId, queryClient, queryKey]);

    return {
        timeline,
        isLoading
    };
};

// Hook 4: useMergeConflict
export const useMergeConflict = (entityType, entityId) => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['merge-conflict', entityType, entityId], [entityType, entityId]);

    const { data: mergeRequest, refetch } = useQuery({
        queryKey,
        queryFn: () => CollaborationRepository.getMergeRequest(entityType, entityId),
        enabled: !!entityId
    });

    const createMergeRequestMutation = useMutation({
        mutationFn: ({ mine, theirs, merged }) => 
            CollaborationRepository.createMergeRequest(entityType, entityId, mine, theirs, merged),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const resolveMergeConflictMutation = useMutation({
        mutationFn: ({ id, status, mergedData }) => 
            CollaborationRepository.resolveMergeConflict(id, status, mergedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    // Sub for merge requests
    useEffect(() => {
        if (!entityId) return;

        const handleMergeRequest = (event) => {
            if (event.entityType === entityType && String(event.entityId) === String(entityId)) {
                queryClient.invalidateQueries({ queryKey });
            }
        };

        eventBus.subscribe(SOCKET_EVENTS.MERGE_REQUEST, handleMergeRequest);
        eventBus.subscribe(SOCKET_EVENTS.MERGE_ACCEPTED, handleMergeRequest);
        eventBus.subscribe(SOCKET_EVENTS.MERGE_REJECTED, handleMergeRequest);

        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.MERGE_REQUEST, handleMergeRequest);
            eventBus.unsubscribe(SOCKET_EVENTS.MERGE_ACCEPTED, handleMergeRequest);
            eventBus.unsubscribe(SOCKET_EVENTS.MERGE_REJECTED, handleMergeRequest);
        };
    }, [entityType, entityId, queryClient, queryKey]);

    return {
        mergeRequest,
        createMergeRequest: createMergeRequestMutation.mutateAsync,
        resolveMergeConflict: resolveMergeConflictMutation.mutateAsync,
        refetch
    };
};

export const useAllLocks = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['all-locks'], []);

    const { data: locks = [], refetch } = useQuery({
        queryKey,
        queryFn: () => CollaborationRepository.getAllLocks(),
        refetchInterval: 5000,
    });

    useEffect(() => {
        const handleLockChange = () => {
            queryClient.invalidateQueries({ queryKey });
        };
        eventBus.subscribe(SOCKET_EVENTS.ENTITY_LOCKED, handleLockChange);
        eventBus.subscribe(SOCKET_EVENTS.ENTITY_UNLOCKED, handleLockChange);
        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.ENTITY_LOCKED, handleLockChange);
            eventBus.unsubscribe(SOCKET_EVENTS.ENTITY_UNLOCKED, handleLockChange);
        };
    }, [queryClient, queryKey]);

    return { locks, refetch };
};

export const useAllComments = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['all-comments'], []);

    const { data: comments = [], refetch } = useQuery({
        queryKey,
        queryFn: () => CollaborationRepository.getAllComments(),
        refetchInterval: 5000,
    });

    useEffect(() => {
        const handleCommentChange = () => {
            queryClient.invalidateQueries({ queryKey });
        };
        eventBus.subscribe(SOCKET_EVENTS.COMMENT_CREATED, handleCommentChange);
        eventBus.subscribe(SOCKET_EVENTS.COMMENT_UPDATED, handleCommentChange);
        eventBus.subscribe(SOCKET_EVENTS.COMMENT_DELETED, handleCommentChange);
        return () => {
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_CREATED, handleCommentChange);
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_UPDATED, handleCommentChange);
            eventBus.unsubscribe(SOCKET_EVENTS.COMMENT_DELETED, handleCommentChange);
        };
    }, [queryClient, queryKey]);

    return { comments, refetch };
};

import { z } from 'zod';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { simulateApi } from '../utils/mockApi.helper';
import { parseApiResponse } from '../utils/parseApiResponse';
import { CommentSchema, LockSchema, MergeRequestSchema } from '../contracts/collaboration.contract';

export const CollaborationRepository = {
    // Locks Management
    getAllLocks: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.locks.getAll());
        } else {
            result = [];
        }
        return parseApiResponse(z.array(LockSchema), result, 'Get All Entity Locks');
    },

    getLock: async (entityType, entityId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const res = mockDatabase.collaboration.locks.get(entityType, entityId);
                return { entityKey: `${entityType}:${entityId}`, ...res };
            });
        } else {
            result = { entityKey: `${entityType}:${entityId}`, isLocked: false };
        }
        return parseApiResponse(LockSchema, result, 'Get Entity Lock');
    },

    acquireLock: async (entityType, entityId, username, avatar) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.locks.acquire(entityType, entityId, username, avatar));
        } else {
            result = { success: true, lock: { entityKey: `${entityType}:${entityId}`, isLocked: true } };
        }
        return result; // returns { success, lock }
    },

    releaseLock: async (entityType, entityId, username) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.locks.release(entityType, entityId, username));
        } else {
            result = true;
        }
        return result;
    },

    renewLock: async (entityType, entityId, username, avatar) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.locks.renew(entityType, entityId, username, avatar));
        } else {
            result = { success: true };
        }
        return result;
    },

    // Comments Engine
    getAllComments: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.getAllComments());
        } else {
            result = [];
        }
        return parseApiResponse(z.array(CommentSchema), result, 'Get All Comments');
    },

    getComments: async (entityType, entityId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.getAll(entityType, entityId));
        } else {
            result = [];
        }
        return parseApiResponse(z.array(CommentSchema), result, 'Comments List');
    },

    addComment: async (entityType, entityId, text, author, authorAvatar, parentId = null) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.create({
                entityType,
                entityId,
                text,
                author,
                authorAvatar,
                parentId
            }));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Create Comment');
    },

    updateComment: async (id, text) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.update(id, text));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Update Comment');
    },

    deleteComment: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.delete(id));
        } else {
            result = true;
        }
        return !!result;
    },

    togglePinComment: async (id, isPinned) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.togglePin(id, isPinned));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Toggle Pin Comment');
    },

    resolveComment: async (id, isResolved) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.resolve(id, isResolved));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Resolve Comment');
    },

    addReaction: async (id, username, emoji) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.addReaction(id, username, emoji));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Add Comment Reaction');
    },

    removeReaction: async (id, username, emoji) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.comments.removeReaction(id, username, emoji));
        } else {
            result = {};
        }
        return parseApiResponse(CommentSchema, result, 'Remove Comment Reaction');
    },

    // Merge Conflicts
    getMergeRequest: async (entityType, entityId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.mergeRequests.getForEntity(entityType, entityId));
        } else {
            result = null;
        }
        if (result === null) return null;
        return parseApiResponse(MergeRequestSchema, result, 'Get Merge Request');
    },

    createMergeRequest: async (entityType, entityId, mine, theirs, merged) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.mergeRequests.create({
                entityType,
                entityId,
                mine,
                theirs,
                merged
            }));
        } else {
            result = {};
        }
        return parseApiResponse(MergeRequestSchema, result, 'Create Merge Request');
    },

    resolveMergeConflict: async (id, status, mergedData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.collaboration.mergeRequests.resolveConflict(id, status, mergedData));
        } else {
            result = true;
        }
        return !!result;
    }
};

export default CollaborationRepository;

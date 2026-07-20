import { z } from 'zod';

export const CommentSchema = z.object({
    id: z.number().nonnegative(),
    entityType: z.string(),
    entityId: z.string().or(z.number()),
    text: z.string(),
    author: z.string(),
    authorAvatar: z.string().optional().nullable(),
    parentId: z.number().nullable().optional(),
    timestamp: z.string(), // ISO String
    reactions: z.record(z.array(z.number().or(z.string()))).optional(), // e.g. { '🔥': [userId1, userId2] }
    isPinned: z.boolean().default(false),
    isResolved: z.boolean().default(false)
});

export const LockSchema = z.object({
    entityKey: z.string(), // e.g., "Client:1"
    isLocked: z.boolean(),
    lockedBy: z.string().nullable().optional(),
    lockedByAvatar: z.string().nullable().optional(),
    lockedAt: z.string().nullable().optional(),
    timeoutAt: z.string().nullable().optional(),
    remainingTime: z.number().nullable().optional()
});

export const ActivityLogSchema = z.object({
    id: z.number().nonnegative(),
    entityType: z.string(),
    entityId: z.string().or(z.number()),
    type: z.enum(['created', 'updated', 'deleted', 'assigned', 'completed', 'edited', 'commented', 'uploaded', 'downloaded']),
    text: z.string(),
    username: z.string(),
    timestamp: z.string()
});

export const MergeRequestSchema = z.object({
    id: z.number().nonnegative(),
    entityType: z.string(),
    entityId: z.string().or(z.number()),
    mine: z.record(z.any()),
    theirs: z.record(z.any()),
    merged: z.record(z.any()),
    resolved: z.boolean().default(false)
});

export default {
    CommentSchema,
    LockSchema,
    ActivityLogSchema,
    MergeRequestSchema
};

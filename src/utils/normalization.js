/**
 * Normalizes list responses into a unified paginated response structure:
 * {
 *   data: Array,
 *   meta: {
 *     page: Number,
 *     limit: Number,
 *     total: Number,
 *     totalPages: Number
 *   }
 * }
 */
export const normalizeListResponse = (result) => {
    if (result && typeof result === 'object' && 'data' in result && 'meta' in result) {
        const meta = result.meta || {};
        return {
            data: Array.isArray(result.data) ? result.data : [],
            meta: {
                page: Number(meta.page || 1),
                limit: Number(meta.limit || 10),
                total: Number(meta.total || 0),
                totalPages: Number(meta.totalPages || 0)
            }
        };
    }

    const data = Array.isArray(result) ? result : [];
    return {
        data,
        meta: {
            page: 1,
            limit: data.length || 10,
            total: data.length || 0,
            totalPages: data.length ? 1 : 0
        }
    };
};

export default normalizeListResponse;

import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { 
    TaskResponseSchema, 
    TaskListResponseSchema,
    TaskStatisticsSchema
} from '@/contracts/task.contract';
import { createPaginatedResponseSchema } from '@/contracts/pagination.contract';

/**
 * Standardized Tasks Repository.
 * Transparently bridges Axios routes and mock database transactions.
 */
export const TaskRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const allTasks = mockDatabase.tasks.getAll();
                let filtered = [...allTasks];

                // 1. Filter by Client
                if (options.clientId) {
                    filtered = filtered.filter(t => String(t.clientId) === String(options.clientId));
                }

                // 2. Filter by Status
                if (options.status && options.status !== 'All') {
                    filtered = filtered.filter(t => t.status.toLowerCase() === options.status.toLowerCase());
                }

                // 3. Filter by Priority
                if (options.priority && options.priority !== 'All') {
                    filtered = filtered.filter(t => t.priority.toLowerCase() === options.priority.toLowerCase());
                }

                // 4. Filter by Category
                if (options.category && options.category !== 'All') {
                    filtered = filtered.filter(t => t.category.toLowerCase() === options.category.toLowerCase());
                }

                // 5. Filter by Search Query
                if (options.search) {
                    const term = options.search.toLowerCase().trim();
                    filtered = filtered.filter(t => 
                        t.title.toLowerCase().includes(term) ||
                        t.description.toLowerCase().includes(term)
                    );
                }

                // 6. Apply Sorting
                if (options.sortBy) {
                    if (options.sortBy === 'Newest') {
                        filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                    } else if (options.sortBy === 'Oldest') {
                        filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                    } else if (options.sortBy === 'Due Date') {
                        filtered.sort((a, b) => {
                            if (!a.dueDate) return 1;
                            if (!b.dueDate) return -1;
                            return a.dueDate.localeCompare(b.dueDate);
                        });
                    } else if (options.sortBy === 'Priority') {
                        const weights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
                        filtered.sort((a, b) => (weights[b.priority] || 0) - (weights[a.priority] || 0));
                    }
                } else {
                    // Default newest first
                    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                }

                // 7. Apply Pagination
                const page = Number(options.page || 1);
                const limit = Number(options.limit || 10);
                const total = filtered.length;
                const totalPages = Math.ceil(total / limit);
                const start = (page - 1) * limit;
                const sliced = filtered.slice(start, start + limit);

                return {
                    data: sliced,
                    meta: { page, limit, total, totalPages }
                };
            });
        } else {
            const response = await api.get(API_ENDPOINTS.TASKS.BASE, { params: options });
            result = response.data;
        }

        if (result && result.data && result.meta) {
            const PaginatedSchema = createPaginatedResponseSchema(TaskResponseSchema);
            return parseApiResponse(PaginatedSchema, result, 'Task Paginated List');
        }
        return parseApiResponse(TaskListResponseSchema, result, 'Task List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.getById(id));
        } else {
            const response = await api.get(API_ENDPOINTS.TASKS.DETAIL(id));
            result = response.data;
        }

        if (result === null) return null;
        return parseApiResponse(TaskResponseSchema, result, 'Task Details');
    },

    create: async (taskData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.create(taskData));
        } else {
            const response = await api.post(API_ENDPOINTS.TASKS.BASE, taskData);
            result = response.data;
        }

        return parseApiResponse(TaskResponseSchema, result, 'Task Create');
    },

    update: async (id, taskData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.update(id, taskData));
        } else {
            const response = await api.put(API_ENDPOINTS.TASKS.DETAIL(id), taskData);
            result = response.data;
        }

        return parseApiResponse(TaskResponseSchema, result, 'Task Update');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.delete(id));
        } else {
            const response = await api.delete(API_ENDPOINTS.TASKS.DETAIL(id));
            result = response.data;
        }

        return !!result;
    },

    bulkUpdate: async (ids, updateData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.bulkUpdate(ids, updateData));
        } else {
            const response = await api.post(API_ENDPOINTS.TASKS.BULK, { ids, data: updateData });
            result = response.data;
        }

        return !!result;
    },

    getStatistics: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.tasks.getStatistics());
        } else {
            const response = await api.get(API_ENDPOINTS.TASKS.STATS);
            result = response.data;
        }

        return parseApiResponse(TaskStatisticsSchema, result, 'Task Statistics');
    }
};

export default TaskRepository;

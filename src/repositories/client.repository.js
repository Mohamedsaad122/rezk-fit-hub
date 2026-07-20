import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ClientResponseSchema, ClientListResponseSchema } from '@/contracts/client.contract';
import { createPaginatedResponseSchema } from '@/contracts/pagination.contract';

/**
 * Standardized Trainee/Client Repository.
 * Transparently bridges Axios dynamic routes and simulated API responses.
 */
export const ClientRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const allClients = mockDatabase.clients.getAll();
                
                // Return paginated payload if options are passed
                if (options.page || options.limit || options.search || options.status) {
                    const page = Number(options.page || 1);
                    const limit = Number(options.limit || 10);
                    let filtered = [...allClients];
                    
                    if (options.search) {
                        const term = options.search.toLowerCase();
                        filtered = filtered.filter(c => 
                            c.name.toLowerCase().includes(term) ||
                            c.email.toLowerCase().includes(term) ||
                            c.phone.includes(term)
                        );
                    }
                    if (options.status) {
                        filtered = filtered.filter(c => c.subscriptionStatus === options.status);
                    }
                    
                    const total = filtered.length;
                    const totalPages = Math.ceil(total / limit);
                    const start = (page - 1) * limit;
                    const sliced = filtered.slice(start, start + limit);
                    
                    return {
                        data: sliced,
                        meta: { page, limit, total, totalPages }
                    };
                }
                
                return allClients;
            });
        } else {
            const response = await api.get(API_ENDPOINTS.CLIENTS.BASE, { params: options });
            result = response.data;
        }

        // Dynamically validate based on return structure (backward-compatible)
        if (result && result.data && result.meta) {
            const PaginatedClientsSchema = createPaginatedResponseSchema(ClientResponseSchema);
            return parseApiResponse(PaginatedClientsSchema, result, 'Client Paginated List');
        }
        return parseApiResponse(ClientListResponseSchema, result, 'Client List');
    },

    getById: async (clientId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.clients.getById(clientId));
        } else {
            const response = await api.get(API_ENDPOINTS.CLIENTS.DETAIL(clientId));
            result = response.data;
        }

        if (result === null) return null;
        return parseApiResponse(ClientResponseSchema, result, 'Client Details');
    },

    create: async (clientData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.clients.create(clientData));
        } else {
            const response = await api.post(API_ENDPOINTS.CLIENTS.BASE, clientData);
            result = response.data;
        }

        return parseApiResponse(ClientResponseSchema, result, 'Client Create');
    },

    update: async (clientId, clientData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.clients.update(clientId, clientData));
        } else {
            const response = await api.put(API_ENDPOINTS.CLIENTS.DETAIL(clientId), clientData);
            result = response.data;
        }

        return parseApiResponse(ClientResponseSchema, result, 'Client Update');
    },

    delete: async (clientId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.clients.delete(clientId));
        } else {
            await api.delete(API_ENDPOINTS.CLIENTS.DETAIL(clientId));
            result = true;
        }

        return !!result;
    }
};

export default ClientRepository;

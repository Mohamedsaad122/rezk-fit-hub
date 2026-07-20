import { ClientRepository } from '@/repositories/client.repository';

/**
 * Service acting as business layer between controllers and repository actions for Client Trainees.
 */
export const ClientService = {
    getAllClients: (options = {}) => {
        return ClientRepository.getAll(options);
    },

    getClientById: (clientId) => {
        return ClientRepository.getById(clientId);
    },

    createClient: (clientData) => {
        return ClientRepository.create(clientData);
    },

    updateClient: (clientId, clientData) => {
        return ClientRepository.update(clientId, clientData);
    },

    deleteClient: (clientId) => {
        return ClientRepository.delete(clientId);
    }
};

export default ClientService;

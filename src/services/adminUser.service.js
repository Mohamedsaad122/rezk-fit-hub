import { AdminUserRepository } from '@/repositories/adminUser.repository';

export const AdminUserService = {
    getAllUsers: (filters = {}) => {
        return AdminUserRepository.getAll(filters);
    },
    getUserById: (id) => {
        return AdminUserRepository.getById(id);
    },
    createUser: (userData) => {
        return AdminUserRepository.create(userData);
    },
    updateUser: (id, userData) => {
        return AdminUserRepository.update(id, userData);
    },
    deleteUser: (id) => {
        return AdminUserRepository.delete(id);
    }
};

export default AdminUserService;

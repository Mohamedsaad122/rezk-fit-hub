import { BranchRepository } from '@/repositories/branch.repository';

export const BranchService = {
    getAllBranches: (filters = {}) => {
        return BranchRepository.getAll(filters);
    },
    getBranchById: (id) => {
        return BranchRepository.getById(id);
    },
    createBranch: (branchData) => {
        return BranchRepository.create(branchData);
    },
    updateBranch: (id, branchData) => {
        return BranchRepository.update(id, branchData);
    },
    deleteBranch: (id) => {
        return BranchRepository.delete(id);
    }
};

export default BranchService;

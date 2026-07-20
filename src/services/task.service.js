import { TaskRepository } from '@/repositories/task.repository';

/**
 * Service acting as business logic boundary for task transactions.
 */
export const TaskService = {
    getAllTasks: (options = {}) => {
        return TaskRepository.getAll(options);
    },

    getTaskById: (id) => {
        return TaskRepository.getById(id);
    },

    createTask: (taskData) => {
        return TaskRepository.create(taskData);
    },

    updateTask: (id, taskData) => {
        return TaskRepository.update(id, taskData);
    },

    deleteTask: (id) => {
        return TaskRepository.delete(id);
    },

    bulkUpdateTasks: (ids, updateData) => {
        return TaskRepository.bulkUpdate(ids, updateData);
    },

    getStatistics: () => {
        return TaskRepository.getStatistics();
    }
};

export default TaskService;

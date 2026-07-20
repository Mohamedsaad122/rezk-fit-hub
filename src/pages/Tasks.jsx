import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTasks, useTaskStatistics } from '@/hooks/use-tasks';
import { useTaskStore } from '@/store/task.store';
import { useDebounce } from '@/hooks/use-debounce';
import { TaskStatistics } from '@/components/TaskStatistics';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskList } from '@/components/TaskList';
import { TaskDetailsDialog } from '@/components/TaskDetailsDialog';
import { AddEditTaskDialog } from '@/components/AddEditTaskDialog';
import { DeleteTaskDialog } from '@/components/DeleteTaskDialog';
import { motion } from 'framer-motion';

export const Tasks = () => {
    // Zustand UI Filters
    const { filters, setFilters } = useTaskStore();
    const debouncedSearch = useDebounce(filters.search, 400);

    // React Query Queries
    const { data: stats, refetch: refetchStats } = useTaskStatistics();
    const {
        data: tasksData,
        isLoading,
        createTask,
        updateTask,
        deleteTask,
        bulkUpdateTasks
    } = useTasks({
        ...filters,
        search: debouncedSearch
    });

    const tasksList = tasksData?.data || [];
    const meta = tasksData?.meta || null;

    // Selection State
    const [selectedIds, setSelectedIds] = useState([]);

    // Dialog Toggle States
    const [detailOpen, setDetailOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    // Handlers
    const handleSelectToggle = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleViewDetails = (task) => {
        setActiveTask(task);
        setDetailOpen(true);
    };

    const handleEditClick = (task) => {
        setActiveTask(task);
        setFormOpen(true);
    };

    const handleDeleteClick = (task) => {
        setActiveTask(task);
        setDeleteOpen(true);
    };

    const handleCreateClick = () => {
        setActiveTask(null);
        setFormOpen(true);
    };

    const handleCompleteToggle = async (task) => {
        const nextStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
        await updateTask({
            id: task.id,
            data: { status: nextStatus }
        });
        refetchStats();
    };

    const handleDuplicate = async (task) => {
        await createTask({
            title: `${task.title} (نسخة)`,
            description: task.description,
            clientId: task.clientId,
            appointmentId: task.appointmentId,
            assignedTo: task.assignedTo,
            priority: task.priority,
            status: 'Todo',
            category: task.category,
            startDate: new Date().toISOString().split('T')[0],
            dueDate: task.dueDate,
            estimatedMinutes: task.estimatedMinutes
        });
        refetchStats();
    };

    const handleFormSubmit = async (formData) => {
        if (activeTask) {
            await updateTask({
                id: activeTask.id,
                data: formData
            });
        } else {
            await createTask(formData);
        }
        refetchStats();
    };

    const handleDeleteConfirm = async () => {
        if (activeTask) {
            await deleteTask(activeTask.id);
            setDeleteOpen(false);
            setActiveTask(null);
            refetchStats();
        }
    };

    const handleBulkComplete = async () => {
        if (selectedIds.length === 0) return;
        await bulkUpdateTasks({
            ids: selectedIds,
            data: { status: 'Completed' }
        });
        setSelectedIds([]);
        refetchStats();
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm('هل أنت متأكد من رغبتك في حذف المهام المحددة؟')) {
            await Promise.all(selectedIds.map(id => deleteTask(id)));
            setSelectedIds([]);
            refetchStats();
        }
    };

    return (
        <>
            <SEO 
                title="إدارة المهام والمتابعات — Rezk Fit Hub" 
                description="إدارة وتتبع العمليات اليومية وجداول تدريبات المتدربين داخل لوحة تحكم Rezk Fit Hub"
            />
            
            <div className="space-y-6 p-6 rtl text-right max-w-7xl mx-auto">
                {/* Heading Area */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">إدارة المهام والمتابعات</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            تتبع العمل اليومي، المتابعات الدورية، ومذكرات التدريبات الخاصة بالمتدربين.
                        </p>
                    </div>
                    <Button 
                        onClick={handleCreateClick}
                        className="bg-gradient-primary hover:opacity-90 text-white text-xs h-10 px-4 rounded-xl shadow-lg shadow-primary/20 gap-1.5 self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة مهمة جديدة</span>
                    </Button>
                </div>

                {/* Statistics Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <TaskStatistics statistics={stats} />
                </motion.div>

                {/* Filters */}
                <TaskFilters
                    search={filters.search}
                    onSearchChange={(val) => setFilters({ search: val, page: 1 })}
                    status={filters.status}
                    onStatusChange={(val) => setFilters({ status: val, page: 1 })}
                    priority={filters.priority}
                    onPriorityChange={(val) => setFilters({ priority: val, page: 1 })}
                    category={filters.category}
                    onCategoryChange={(val) => setFilters({ category: val, page: 1 })}
                    sortBy={filters.sortBy}
                    onSortByChange={(val) => setFilters({ sortBy: val, page: 1 })}
                    selectedCount={selectedIds.length}
                    onBulkComplete={handleBulkComplete}
                    onBulkDelete={handleBulkDelete}
                />

                {/* Tasks Grid List */}
                <TaskList
                    tasks={tasksList}
                    isLoading={isLoading}
                    selectedIds={selectedIds}
                    onSelectToggle={handleSelectToggle}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onCompleteToggle={handleCompleteToggle}
                    onDuplicate={handleDuplicate}
                    meta={meta}
                    onPageChange={(p) => setFilters({ page: p })}
                />
            </div>

            {/* Timed Modals */}
            <TaskDetailsDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                task={activeTask}
                onEdit={handleEditClick}
                onComplete={handleCompleteToggle}
            />

            <AddEditTaskDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                task={activeTask}
                onSubmit={handleFormSubmit}
            />

            <DeleteTaskDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                taskTitle={activeTask?.title || ''}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
};

export default Tasks;

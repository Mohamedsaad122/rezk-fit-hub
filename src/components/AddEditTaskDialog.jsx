import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TaskRequestSchema } from '@/contracts/task.contract';
import { useClients } from '@/hooks/use-clients';
import { useTasks } from '@/hooks/use-tasks';
import { useDocuments, useUpdateDocument } from '@/hooks/use-documents';
import { mockDatabase } from '@/mocks/mockDatabase';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEntityLock, useMergeConflict } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';
import { MergeConflictDialog } from '@/components/MergeConflictDialog';

const CATEGORIES = [
    { value: 'Workout', label: 'برنامج رياضي (Workout)' },
    { value: 'Nutrition', label: 'برنامج غذائي (Nutrition)' },
    { value: 'Assessment', label: 'تقييم بدني (Assessment)' },
    { value: 'Consultation', label: 'استشارة (Consultation)' },
    { value: 'Follow Up', label: 'متابعة دورية (Follow Up)' },
    { value: 'Phone Call', label: 'مكالمة هاتفية (Phone Call)' },
    { value: 'Meeting', label: 'اجتماع عمل (Meeting)' },
    { value: 'Administrative', label: 'عمل إداري (Administrative)' },
    { value: 'Reminder', label: 'تذكير (Reminder)' }
];

const PRIORITIES = [
    { value: 'Low', label: 'منخفضة (Low)' },
    { value: 'Medium', label: 'متوسطة (Medium)' },
    { value: 'High', label: 'عالية (High)' },
    { value: 'Critical', label: 'عاجلة جداً (Critical)' }
];

const STATUSES = [
    { value: 'Todo', label: 'لم تبدأ (Todo)' },
    { value: 'In Progress', label: 'قيد التنفيذ (In Progress)' },
    { value: 'Completed', label: 'مكتملة (Completed)' },
    { value: 'Cancelled', label: 'ملغاة (Cancelled)' },
    { value: 'Overdue', label: 'متأخرة (Overdue)' }
];

export function AddEditTaskDialog({ open, onOpenChange, task = null, onSubmit }) {
    const isEdit = !!task;
    const { createTask, updateTask } = useTasks();
    const { data: clientsData } = useClients({ limit: 100 });
    const clients = clientsData?.data || [];
    
    // Documents hooks for attachments
    const { data: allDocs = [] } = useDocuments();
    const updateDocMutation = useUpdateDocument();
    const [selectedFileId, setSelectedFileId] = useState('none');

    const [isSaving, setIsSaving] = useState(false);

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'Task',
        task?.id,
        open && isEdit,
        'الكوتش أحمد',
        '👨‍و'
    );

    const { mergeRequest, createMergeRequest, resolveMergeConflict } = useMergeConflict('Task', task?.id);
    const [isConflictOpen, setIsConflictOpen] = useState(false);

    // Retrieve current attachments if editing
    const { data: currentAttachments = [] } = useDocuments(
        task ? { taskId: task.id } : { enabled: false }
    );

    useEffect(() => {
        if (open) {
            if (currentAttachments && currentAttachments.length > 0) {
                setSelectedFileId(String(currentAttachments[0].id));
            } else {
                setSelectedFileId('none');
            }
        }
    }, [currentAttachments, open]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(TaskRequestSchema),
        defaultValues: {
            title: '',
            description: '',
            clientId: null,
            appointmentId: null,
            assignedTo: 'Coach',
            priority: 'Medium',
            status: 'Todo',
            category: 'Reminder',
            startDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estimatedMinutes: 30,
            actualMinutes: 0
        }
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title || '',
                description: task.description || '',
                clientId: task.clientId ? Number(task.clientId) : null,
                appointmentId: task.appointmentId ? Number(task.appointmentId) : null,
                assignedTo: task.assignedTo || 'Coach',
                priority: task.priority || 'Medium',
                status: task.status || 'Todo',
                category: task.category || 'Reminder',
                startDate: task.startDate || new Date().toISOString().split('T')[0],
                dueDate: task.dueDate || '',
                estimatedMinutes: Number(task.estimatedMinutes || 0),
                actualMinutes: Number(task.actualMinutes || 0)
            });
        } else {
            reset({
                title: '',
                description: '',
                clientId: null,
                appointmentId: null,
                assignedTo: 'Coach',
                priority: 'Medium',
                status: 'Todo',
                category: 'Reminder',
                startDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                estimatedMinutes: 30,
                actualMinutes: 0
            });
        }
    }, [task, open, reset]);

    const handleFormSubmit = async (data) => {
        const taskData = {
            ...data,
            clientId: data.clientId === 'none' ? null : Number(data.clientId),
            appointmentId: data.appointmentId ? Number(data.appointmentId) : null,
            estimatedMinutes: Number(data.estimatedMinutes || 0),
            actualMinutes: Number(data.actualMinutes || 0)
        };

        if (isEdit && (window.simulateConflict || Math.random() < 0.05)) {
            const concurrentChange = { ...task, title: task.title + ' (تعديل متزامن)', priority: 'High' };
            await createMergeRequest({
                mine: taskData,
                theirs: concurrentChange,
                merged: { ...concurrentChange, ...taskData }
            });
            setIsConflictOpen(true);
            return;
        }

        await executeSave(taskData);
    };

    const executeSave = async (taskData) => {
        setIsSaving(true);
        try {
            if (isEdit) {
                await updateTask({ id: task.id, data: taskData });
                if (selectedFileId && selectedFileId !== 'none') {
                    updateDocMutation.mutate({
                        id: Number(selectedFileId),
                        data: { taskId: task.id }
                    });
                }
            } else {
                const result = await createTask(taskData);
                const createdId = result?.id || (mockDatabase?.tasks?.getAll?.()?.length ? Math.max(...mockDatabase.tasks.getAll().map(t => t.id)) : null);
                if (selectedFileId && selectedFileId !== 'none' && createdId) {
                    updateDocMutation.mutate({
                        id: Number(selectedFileId),
                        data: { taskId: createdId }
                    });
                }
            }
            if (onSubmit) onSubmit(taskData);
            onOpenChange(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleResolveConflict = async (id, status, mergedData) => {
        setIsConflictOpen(false);
        if (status === 'accepted') {
            await resolveMergeConflict({ id, status, mergedData });
            await executeSave(mergedData);
        } else {
            await resolveMergeConflict({ id, status });
            onOpenChange(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="rtl text-right sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-foreground">
                            {isEdit ? 'تعديل بيانات المهمة' : 'إضافة مهمة جديدة'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            أدخل تفاصيل المهمة والتواريخ والمدرب المخصص لتتبع العمل بانتظام.
                        </DialogDescription>
                    </DialogHeader>

                    {isEdit && (
                        <LockWarningBanner
                            lockData={lockData}
                            isLockedByOther={isLockedByOther}
                            forceUnlock={forceUnlock}
                        />
                    )}

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
                        <fieldset disabled={isSaving || isLockedByOther} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <Label htmlFor="title" className="text-xs font-semibold">عنوان المهمة *</Label>
                        <Input 
                            id="title" 
                            placeholder="مثال: مراجعة قياسات المتدرب سارة" 
                            {...register('title')} 
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                            <p className="text-[10px] text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs font-semibold">الوصف / التفاصيل</Label>
                        <Textarea 
                            id="description" 
                            placeholder="تفاصيل إضافية عن المطلوب إنجازه..." 
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    {/* Attach File Selector */}
                    <div className="space-y-1">
                        <Label htmlFor="attachFile" className="text-xs font-semibold">إرفاق مستند أو تقرير للمهمة</Label>
                        <select
                            id="attachFile"
                            value={selectedFileId}
                            onChange={(e) => setSelectedFileId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="none">بدون إرفاق ملفات</option>
                            {allDocs.map(doc => (
                                <option key={doc.id} value={String(doc.id)}>{doc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1">
                            <Label htmlFor="category" className="text-xs font-semibold">التصنيف / الفئة</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...register('category')}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1">
                            <Label htmlFor="priority" className="text-xs font-semibold">الأولوية</Label>
                            <select
                                id="priority"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...register('priority')}
                            >
                                {PRIORITIES.map(pri => (
                                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs font-semibold">الحالة</Label>
                            <select
                                id="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...register('status')}
                            >
                                {STATUSES.map(stat => (
                                    <option key={stat.value} value={stat.value}>{stat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned To */}
                        <div className="space-y-1">
                            <Label htmlFor="assignedTo" className="text-xs font-semibold">تعيين إلى</Label>
                            <Input 
                                id="assignedTo" 
                                {...register('assignedTo')} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Client ID */}
                        <div className="space-y-1">
                            <Label htmlFor="clientId" className="text-xs font-semibold">المتدرب المرتبط (اختياري)</Label>
                            <select
                                id="clientId"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...register('clientId')}
                                onChange={(e) => setValue('clientId', e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">لا يوجد متدرب مرتبط</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Estimated Minutes */}
                        <div className="space-y-1">
                            <Label htmlFor="estimatedMinutes" className="text-xs font-semibold">الوقت المقدر (بالدقائق)</Label>
                            <Input 
                                id="estimatedMinutes" 
                                type="number" 
                                {...register('estimatedMinutes', { valueAsNumber: true })} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-1">
                            <Label htmlFor="startDate" className="text-xs font-semibold">تاريخ البدء</Label>
                            <Input 
                                id="startDate" 
                                type="date" 
                                {...register('startDate')} 
                                className={errors.startDate ? 'border-destructive' : ''}
                            />
                        </div>

                        {/* Due Date */}
                        <div className="space-y-1">
                            <Label htmlFor="dueDate" className="text-xs font-semibold">تاريخ الاستحقاق (اختياري)</Label>
                            <Input 
                                id="dueDate" 
                                type="date" 
                                {...register('dueDate')} 
                                className={errors.dueDate ? 'border-destructive' : ''}
                            />
                        </div>
                    </div>

                    {isEdit && (
                        <div className="space-y-1">
                            <Label htmlFor="actualMinutes" className="text-xs font-semibold">الوقت المستغرق الفعلي (بالدقائق)</Label>
                            <Input 
                                id="actualMinutes" 
                                type="number" 
                                {...register('actualMinutes', { valueAsNumber: true })} 
                            />
                        </div>
                    )}

                        </fieldset>

                        <DialogFooter className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                            <Button 
                                type="submit" 
                                className="bg-gradient-primary hover:opacity-90 text-white text-xs h-9 px-4 rounded-lg"
                                disabled={isSaving || isLockedByOther}
                            >
                                {isSaving ? 'جاري الحفظ...' : isEdit ? 'تحديث المهمة' : 'إضافة المهمة'}
                            </Button>
                            <Button 
                                type="button" 
                                onClick={() => onOpenChange(false)}
                                variant="outline" 
                                className="text-xs h-9 px-4 rounded-lg border border-border"
                                disabled={isSaving}
                            >
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <MergeConflictDialog
                isOpen={isConflictOpen}
                mergeRequest={mergeRequest}
                onResolve={handleResolveConflict}
            />
        </>
    );
}

export default AddEditTaskDialog;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { ClientRequestSchema } from '@/contracts/client.contract';
import { useCreateClient, useUpdateClient } from '@/hooks/use-clients';
import { useExercises } from '@/hooks/use-exercises';
import { useEntityLock, useMergeConflict } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';
import { MergeConflictDialog } from '@/components/MergeConflictDialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export function AddEditClientDialog({ isOpen, onClose, client = null }) {
    const isEdit = !!client;

    const { mutate: createClient, isPending: isCreatePending } = useCreateClient();
    const { mutate: updateClient, isPending: isUpdatePending } = useUpdateClient();
    const isPending = isCreatePending || isUpdatePending;

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'Client',
        client?.id,
        isOpen && isEdit,
        'الكوتش أحمد',
        '👨‍و'
    );

    const { mergeRequest, createMergeRequest, resolveMergeConflict } = useMergeConflict('Client', client?.id);
    const [isConflictOpen, setIsConflictOpen] = useState(false);

    const { data: categories = [] } = useExercises();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(ClientRequestSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            age: 25,
            currentWeight: 70,
            targetWeight: 65,
            progress: 0,
            workouts: 0,
            streak: 0,
            goal: '',
            subscriptionStatus: 'نشط',
            avatar: '👩',
            assignedCategoryId: null
        }
    });

    const subscriptionStatusValue = watch('subscriptionStatus');
    const avatarValue = watch('avatar');
    const assignedCategoryIdValue = watch('assignedCategoryId');

    useEffect(() => {
        if (isOpen) {
            if (client) {
                reset({
                    name: client.name || '',
                    email: client.email || '',
                    phone: client.phone || '',
                    age: client.age ?? 25,
                    currentWeight: client.currentWeight ?? 70,
                    targetWeight: client.targetWeight ?? 65,
                    progress: client.progress ?? 0,
                    workouts: client.workouts ?? 0,
                    streak: client.streak ?? 0,
                    goal: client.goal || '',
                    subscriptionStatus: client.subscriptionStatus || 'نشط',
                    avatar: client.avatar || '👩',
                    assignedCategoryId: client.assignedCategoryId ?? null
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    phone: '',
                    age: 25,
                    currentWeight: 70,
                    targetWeight: 65,
                    progress: 0,
                    workouts: 0,
                    streak: 0,
                    goal: '',
                    subscriptionStatus: 'نشط',
                    avatar: '👩',
                    assignedCategoryId: null
                });
            }
        }
    }, [isOpen, client, reset]);

    const onSubmit = async (data) => {
        if (isEdit && (window.simulateConflict || Math.random() < 0.05)) {
            const concurrentChange = { ...client, name: client.name + ' (معدل متزامناً)', age: Number(client.age) + 1 };
            await createMergeRequest({
                mine: data,
                theirs: concurrentChange,
                merged: { ...concurrentChange, ...data }
            });
            setIsConflictOpen(true);
            return;
        }

        if (isEdit) {
            updateClient({ clientId: client.id, clientData: data }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            createClient(data, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    const handleResolveConflict = async (id, status, mergedData) => {
        setIsConflictOpen(false);
        if (status === 'accepted') {
            await resolveMergeConflict({ id, status, mergedData });
            updateClient({ clientId: client.id, clientData: mergedData }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            await resolveMergeConflict({ id, status });
            onClose();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="rtl text-right max-w-lg font-sans max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {isEdit ? 'تعديل بيانات المتدرب' : 'إضافة متدرب جديد'}
                        </DialogTitle>
                    </DialogHeader>

                    {isEdit && (
                        <LockWarningBanner
                            lockData={lockData}
                            isLockedByOther={isLockedByOther}
                            forceUnlock={forceUnlock}
                        />
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <fieldset disabled={isPending || isLockedByOther} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">اسم المتدرب</Label>
                            <Input
                                id="name"
                                placeholder="مثال: يوسف أحمد"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.name ? 'border-destructive' : ''}`}
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="yousef@example.com"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.email ? 'border-destructive' : ''}`}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">رقم الهاتف</Label>
                            <Input
                                id="phone"
                                placeholder="مثال: +201012345678"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.phone ? 'border-destructive' : ''}`}
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age">العمر</Label>
                            <Input
                                id="age"
                                type="number"
                                placeholder="25"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.age ? 'border-destructive' : ''}`}
                                {...register('age', { valueAsNumber: true })}
                            />
                            {errors.age && (
                                <p className="text-xs text-destructive font-medium">{errors.age.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Weights & Goal */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentWeight">الوزن الحالي (كجم)</Label>
                            <Input
                                id="currentWeight"
                                type="number"
                                step="0.1"
                                placeholder="70"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.currentWeight ? 'border-destructive' : ''}`}
                                {...register('currentWeight', { valueAsNumber: true })}
                            />
                            {errors.currentWeight && (
                                <p className="text-xs text-destructive font-medium">{errors.currentWeight.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetWeight">الوزن المستهدف</Label>
                            <Input
                                id="targetWeight"
                                type="number"
                                step="0.1"
                                placeholder="65"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.targetWeight ? 'border-destructive' : ''}`}
                                {...register('targetWeight', { valueAsNumber: true })}
                            />
                            {errors.targetWeight && (
                                <p className="text-xs text-destructive font-medium">{errors.targetWeight.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar">أيقونة الملف (Avatar)</Label>
                            <Select
                                value={avatarValue}
                                onValueChange={(val) => setValue('avatar', val)}
                                disabled={isPending || isLockedByOther}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="أيقونة" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="👩">👩 متدربة</SelectItem>
                                    <SelectItem value="👨">👨 متدرب</SelectItem>
                                    <SelectItem value="⚡">⚡ رياضي</SelectItem>
                                    <SelectItem value="👤">👤 افتراضي</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">الهدف التدريبي</Label>
                        <Input
                            id="goal"
                            placeholder="مثال: خسارة الوزن الزائد / تحسين اللياقة البدنية"
                            className={`rounded-xl border-2 focus-visible:ring-primary ${errors.goal ? 'border-destructive' : ''}`}
                            {...register('goal')}
                        />
                        {errors.goal && (
                            <p className="text-xs text-destructive font-medium">{errors.goal.message}</p>
                        )}
                    </div>

                    {/* Workout Program & Subscription */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>البرنامج التدريبي المخصص</Label>
                            <Select
                                value={assignedCategoryIdValue ? String(assignedCategoryIdValue) : 'none'}
                                onValueChange={(val) => setValue('assignedCategoryId', val === 'none' ? null : val)}
                                disabled={isPending || isLockedByOther}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="تخصيص برنامج تدريبي" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="none">بدون برنامج مخصص</SelectItem>
                                    {categories?.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subscriptionStatus">حالة الاشتراك</Label>
                            <Select
                                value={subscriptionStatusValue}
                                onValueChange={(val) => setValue('subscriptionStatus', val, { shouldValidate: true })}
                                disabled={isPending || isLockedByOther}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="حالة الاشتراك" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="نشط">نشط</SelectItem>
                                    <SelectItem value="معلق">معلق</SelectItem>
                                    <SelectItem value="منتهي">منتهي</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.subscriptionStatus && (
                                <p className="text-xs text-destructive font-medium">{errors.subscriptionStatus.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="progress">التقدم (%)</Label>
                            <Input
                                id="progress"
                                type="number"
                                placeholder="0"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.progress ? 'border-destructive' : ''}`}
                                {...register('progress', { valueAsNumber: true })}
                            />
                            {errors.progress && (
                                <p className="text-xs text-destructive font-medium">{errors.progress.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="workouts">عدد التمارين</Label>
                            <Input
                                id="workouts"
                                type="number"
                                placeholder="0"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.workouts ? 'border-destructive' : ''}`}
                                {...register('workouts', { valueAsNumber: true })}
                            />
                            {errors.workouts && (
                                <p className="text-xs text-destructive font-medium">{errors.workouts.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="streak">أيام الالتزام (Streak)</Label>
                            <Input
                                id="streak"
                                type="number"
                                placeholder="0"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.streak ? 'border-destructive' : ''}`}
                                {...register('streak', { valueAsNumber: true })}
                            />
                            {errors.streak && (
                                <p className="text-xs text-destructive font-medium">{errors.streak.message}</p>
                            )}
                        </div>
                    </div>

                        </fieldset>

                        <DialogFooter className="flex flex-row-reverse gap-2 justify-start pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl"
                                disabled={isPending}
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl bg-primary text-white"
                                disabled={isPending || isLockedByOther}
                            >
                                {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة المتدرب'}
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

export default AddEditClientDialog;

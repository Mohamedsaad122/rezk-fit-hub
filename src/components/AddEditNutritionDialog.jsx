import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { NutritionPlanRequestSchema } from '@/contracts/nutrition.contract';
import { useCreateNutrition, useUpdateNutrition } from '@/hooks/use-nutrition';
import { useClients } from '@/hooks/use-clients';
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
import { Plus, Trash2 } from 'lucide-react';

export function AddEditNutritionDialog({ isOpen, onClose, plan = null }) {
    const isEdit = !!plan;

    const { mutate: createPlan, isPending: isCreatePending } = useCreateNutrition();
    const { mutate: updatePlan, isPending: isUpdatePending } = useUpdateNutrition();
    const isPending = isCreatePending || isUpdatePending;

    const { data: clientsData } = useClients();
    const clients = clientsData?.data || [];

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(NutritionPlanRequestSchema),
        defaultValues: {
            name: '',
            description: '',
            duration: '',
            participants: 0,
            calories: 2000,
            image: '🌱',
            macros: {
                protein: { value: 30, color: 'bg-red-500' },
                carbs: { value: 40, color: 'bg-yellow-500' },
                fats: { value: 30, color: 'bg-blue-500' }
            },
            meals: [
                { name: 'الإفطار', time: '08:00', calories: 500 },
                { name: 'الغداء', time: '14:00', calories: 800 },
                { name: 'العشاء', time: '20:00', calories: 700 }
            ],
            assignedClientId: null,
            status: 'نشط'
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'meals'
    });

    const assignedClientIdValue = watch('assignedClientId');
    const statusValue = watch('status');

    useEffect(() => {
        if (isOpen) {
            if (plan) {
                reset({
                    name: plan.name,
                    description: plan.description,
                    duration: plan.duration,
                    participants: plan.participants,
                    calories: plan.calories,
                    image: plan.image || '🌱',
                    macros: {
                        protein: { value: plan.macros?.protein?.value ?? 30, color: 'bg-red-500' },
                        carbs: { value: plan.macros?.carbs?.value ?? 40, color: 'bg-yellow-500' },
                        fats: { value: plan.macros?.fats?.value ?? 30, color: 'bg-blue-500' }
                    },
                    meals: plan.meals || [],
                    assignedClientId: plan.assignedClientId ?? null,
                    status: plan.status || 'نشط'
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    duration: '',
                    participants: 0,
                    calories: 2000,
                    image: '🌱',
                    macros: {
                        protein: { value: 30, color: 'bg-red-500' },
                        carbs: { value: 40, color: 'bg-yellow-500' },
                        fats: { value: 30, color: 'bg-blue-500' }
                    },
                    meals: [
                        { name: 'الإفطار', time: '08:00', calories: 500 },
                        { name: 'الغداء', time: '14:00', calories: 800 },
                        { name: 'العشاء', time: '20:00', calories: 700 }
                    ],
                    assignedClientId: null,
                    status: 'نشط'
                });
            }
        }
    }, [isOpen, plan, reset]);

    const onSubmit = (data) => {
        if (isEdit) {
            updatePlan({ planId: plan.id, planData: data }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            createPlan(data, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rtl text-right max-w-lg font-sans max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? 'تعديل النظام الغذائي' : 'إضافة نظام غذائي جديد'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">اسم النظام</Label>
                        <Input
                            id="name"
                            placeholder="مثال: برنامج خسارة الوزن السريع"
                            className={`rounded-xl border-2 focus-visible:ring-accent ${errors.name ? 'border-destructive' : ''}`}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">وصف النظام</Label>
                        <Input
                            id="description"
                            placeholder="مثال: خطة متكاملة لتقليل الكربوهيدرات وتحفيز الحرق"
                            className={`rounded-xl border-2 focus-visible:ring-accent ${errors.description ? 'border-destructive' : ''}`}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">المدة</Label>
                            <Input
                                id="duration"
                                placeholder="مثال: 8 أسابيع"
                                className={`rounded-xl border-2 focus-visible:ring-accent ${errors.duration ? 'border-destructive' : ''}`}
                                {...register('duration')}
                            />
                            {errors.duration && (
                                <p className="text-xs text-destructive font-medium">{errors.duration.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="calories">السعرات اليومية</Label>
                            <Input
                                id="calories"
                                type="number"
                                placeholder="2000"
                                className={`rounded-xl border-2 focus-visible:ring-accent ${errors.calories ? 'border-destructive' : ''}`}
                                {...register('calories', { valueAsNumber: true })}
                            />
                            {errors.calories && (
                                <p className="text-xs text-destructive font-medium">{errors.calories.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">الرمز (الأيقونة)</Label>
                            <Input
                                id="image"
                                placeholder="مثال: 🌱"
                                className={`rounded-xl border-2 focus-visible:ring-accent ${errors.image ? 'border-destructive' : ''}`}
                                {...register('image')}
                            />
                            {errors.image && (
                                <p className="text-xs text-destructive font-medium">{errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Assigned Client & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>المتدرب المخصص له</Label>
                            <Select
                                value={assignedClientIdValue ? String(assignedClientIdValue) : 'none'}
                                onValueChange={(val) => setValue('assignedClientId', val === 'none' ? null : Number(val))}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اختر متدرباً" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="none">بدون تخصيص</SelectItem>
                                    {clients?.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>حالة النظام</Label>
                            <Select
                                value={statusValue}
                                onValueChange={(val) => setValue('status', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="حالة النظام" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="نشط">نشط</SelectItem>
                                    <SelectItem value="مسودة">مسودة</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-destructive font-medium">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="p-4 rounded-xl border-2 border-dashed space-y-3">
                        <h4 className="font-bold text-sm text-foreground">توزيع الماكروز (يجب أن يكون المجموع 100%)</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">البروتين (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    className="h-9 rounded-lg"
                                    {...register('macros.protein.value', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">الكربوهيدرات (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="40"
                                    className="h-9 rounded-lg"
                                    {...register('macros.carbs.value', { valueAsNumber: true })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">الدهون (%)</Label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    className="h-9 rounded-lg"
                                    {...register('macros.fats.value', { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                        {errors.macros && (
                            <p className="text-xs text-destructive font-medium">{errors.macros.message}</p>
                        )}
                        {errors.macros?.protein && (
                            <p className="text-xs text-destructive font-medium">{errors.macros.protein.message}</p>
                        )}
                    </div>

                    {/* Meals List Array */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="font-bold">قائمة وجبات النظام</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ name: '', time: '12:00', calories: 300 })}
                                className="h-8 rounded-lg text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                إضافة وجبة
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto p-1 border rounded-xl">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-center bg-muted/30 p-2 rounded-lg">
                                    <Input
                                        placeholder="اسم الوجبة"
                                        className="h-9 text-xs"
                                        {...register(`meals.${index}.name`)}
                                    />
                                    <Input
                                        placeholder="الوقت (مثال 14:00)"
                                        className="h-9 text-xs w-28"
                                        {...register(`meals.${index}.time`)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="السعرات"
                                        className="h-9 text-xs w-20"
                                        {...register(`meals.${index}.calories`, { valueAsNumber: true })}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-destructive h-9 w-9"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {errors.meals && (
                            <p className="text-xs text-destructive font-medium">{errors.meals.message}</p>
                        )}
                    </div>

                    <DialogFooter className="flex flex-row-reverse gap-2 justify-start pt-2">
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
                            className="rounded-xl bg-accent hover:bg-accent/90 text-white"
                            disabled={isPending}
                        >
                            {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة النظام'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddEditNutritionDialog;

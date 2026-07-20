import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { ExerciseRequestSchema } from '@/contracts/exercise.contract';
import { useCreateExercise, useUpdateExercise } from '@/hooks/use-exercises';
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

export function AddEditExerciseDialog({ isOpen, onClose, categoryId, exercise = null }) {
    const isEdit = !!exercise;
    
    const { mutate: createExercise, isPending: isCreatePending } = useCreateExercise();
    const { mutate: updateExercise, isPending: isUpdatePending } = useUpdateExercise();
    const isPending = isCreatePending || isUpdatePending;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(ExerciseRequestSchema),
        defaultValues: {
            name: '',
            duration: '',
            difficulty: 'مبتدئ',
            participants: 0,
            sets: '',
            image: '💪'
        }
    });

    const difficultyValue = watch('difficulty');

    useEffect(() => {
        if (isOpen) {
            if (exercise) {
                reset({
                    name: exercise.name,
                    duration: exercise.duration,
                    difficulty: exercise.difficulty,
                    participants: exercise.participants,
                    sets: exercise.sets,
                    image: exercise.image || '💪'
                });
            } else {
                reset({
                    name: '',
                    duration: '',
                    difficulty: 'مبتدئ',
                    participants: 0,
                    sets: '',
                    image: '💪'
                });
            }
        }
    }, [isOpen, exercise, reset]);

    const onSubmit = (data) => {
        if (isEdit) {
            updateExercise({ exerciseId: exercise.id, exerciseData: data }, {
                onSuccess: () => {
                    onClose();
                }
            });
        } else {
            createExercise({ categoryId, exerciseData: data }, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rtl text-right max-w-md font-sans">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? 'تعديل التمرين' : 'إضافة تمرين جديد'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">اسم التمرين</Label>
                        <Input
                            id="name"
                            placeholder="مثال: تمرين الصدر بالدامبل"
                            className={`rounded-xl border-2 focus-visible:ring-primary ${errors.name ? 'border-destructive' : ''}`}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">المدة</Label>
                            <Input
                                id="duration"
                                placeholder="مثال: 45 دقيقة"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.duration ? 'border-destructive' : ''}`}
                                {...register('duration')}
                            />
                            {errors.duration && (
                                <p className="text-xs text-destructive font-medium">{errors.duration.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                            <Select
                                value={difficultyValue}
                                onValueChange={(val) => setValue('difficulty', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2 focus:ring-primary">
                                    <SelectValue placeholder="اختر الصعوبة" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                                    <SelectItem value="متوسط">متوسط</SelectItem>
                                    <SelectItem value="متقدم">متقدم</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && (
                                <p className="text-xs text-destructive font-medium">{errors.difficulty.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="participants">عدد المشاركين</Label>
                            <Input
                                id="participants"
                                type="number"
                                placeholder="0"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.participants ? 'border-destructive' : ''}`}
                                {...register('participants', { valueAsNumber: true })}
                            />
                            {errors.participants && (
                                <p className="text-xs text-destructive font-medium">{errors.participants.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">الرمز التعبيري (الأيقونة)</Label>
                            <Input
                                id="image"
                                placeholder="مثال: 💪"
                                className={`rounded-xl border-2 focus-visible:ring-primary ${errors.image ? 'border-destructive' : ''}`}
                                {...register('image')}
                            />
                            {errors.image && (
                                <p className="text-xs text-destructive font-medium">{errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sets">تفاصيل المجموعات والتكرار</Label>
                        <Input
                            id="sets"
                            placeholder="مثال: 4 مجموعات × 12 تكرار"
                            className={`rounded-xl border-2 focus-visible:ring-primary ${errors.sets ? 'border-destructive' : ''}`}
                            {...register('sets')}
                        />
                        {errors.sets && (
                            <p className="text-xs text-destructive font-medium">{errors.sets.message}</p>
                        )}
                    </div>

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
                            disabled={isPending}
                        >
                            {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة التمرين'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddEditExerciseDialog;

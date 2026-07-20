import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarEventCreate } from '../contracts/calendar.contract';
import { 
    useCreateCalendarEvent, 
    useUpdateCalendarEvent,
    useLockAppointment,
    useUnlockAppointment,
    useCheckConflicts
} from '../hooks/use-calendar';
import { useClients } from '@/hooks/use-clients';
import { useDocuments, useUpdateDocument } from '@/hooks/use-documents';
import { useBranches } from '@/hooks/use-branches';
import { useAdminUsers } from '@/hooks/use-admin-users';
import { mockDatabase } from '@/mocks/mockDatabase';
import { useCalendarPresenceStore } from '@/store/calendar-presence.store';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const SESSION_TYPES = [
    { value: 'Workout Session', label: 'جلسة تدريبية (Workout Session)' },
    { value: 'Nutrition Consultation', label: 'استشارة تغذية (Nutrition Consultation)' },
    { value: 'Assessment', label: 'تقييم أداء (Assessment)' },
    { value: 'Follow-up', label: 'متابعة دورية (Follow-up)' },
    { value: 'Meeting', label: 'اجتماع عمل (Meeting)' },
    { value: 'Personal Training', label: 'تدريب شخصي (Personal Training)' }
];

const SESSION_STATUSES = [
    { value: 'Scheduled', label: 'مجدولة (Scheduled)' },
    { value: 'Completed', label: 'مكتملة (Completed)' },
    { value: 'Cancelled', label: 'ملغاة (Cancelled)' },
    { value: 'Missed', label: 'فائتة (Missed)' },
    { value: 'In Progress', label: 'جاري العمل (In Progress)' }
];

const COLORS = [
    { value: 'blue', label: 'أزرق' },
    { value: 'green', label: 'أخضر' },
    { value: 'purple', label: 'بنفسجي' },
    { value: 'yellow', label: 'أصفر' },
    { value: 'orange', label: 'برتقالي' },
    { value: 'red', label: 'أحمر' }
];

export function AddEditAppointmentDialog({ isOpen, onClose, appointment = null, isDuplicate = false }) {
    const isEdit = !!appointment && !isDuplicate;

    const { mutate: createEvent, isPending: isCreatePending } = useCreateCalendarEvent();
    const { mutate: updateEvent, isPending: isUpdatePending } = useUpdateCalendarEvent();
    const isPending = isCreatePending || isUpdatePending;

    const { data: clientsRes } = useClients();
    const clients = clientsRes?.data || [];

    const { data: branches = [] } = useBranches({ limit: 100 });
    const { data: staffList = [] } = useAdminUsers({ limit: 100 });
    const coachesList = staffList.filter(u => u.role === 'Coach' || u.role === 'Super Admin' || u.role === 'Admin');
    const nutritionistsList = staffList.filter(u => u.role === 'Nutritionist');

    const { mutate: lockApt } = useLockAppointment();
    const { mutate: unlockApt } = useUnlockAppointment();
    const { mutate: checkConflicts } = useCheckConflicts();

    const [conflictsList, setConflictsList] = useState([]);

    const locks = useCalendarPresenceStore(state => state.locks);
    const liveLock = appointment?.id ? locks[appointment.id] : null;
    const isLockedByOther = liveLock?.isLocked && liveLock?.lockedBy !== 'الكوتش أحمد';

    // Documents hooks for attachments
    const { data: allDocs = [] } = useDocuments();
    const updateDocMutation = useUpdateDocument();
    const [selectedFileId, setSelectedFileId] = useState('none');

    // Retrieve current attachments if editing
    const { data: currentAttachments = [] } = useDocuments(
        appointment ? { appointmentId: appointment.id } : { enabled: false }
    );

    useEffect(() => {
        if (isOpen) {
            if (currentAttachments && currentAttachments.length > 0) {
                setSelectedFileId(String(currentAttachments[0].id));
            } else {
                setSelectedFileId('none');
            }
        }
    }, [currentAttachments, isOpen]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(CalendarEventCreate),
        defaultValues: {
            title: '',
            description: '',
            date: '2026-07-13',
            startTime: '10:00',
            endTime: '11:00',
            type: 'Workout Session',
            status: 'Scheduled',
            coachId: 1,
            clientId: null,
            color: 'blue',
            notes: '',
            branchId: 1,
            roomId: null,
            equipmentId: null,
            nutritionistId: null,
            isRecurring: false,
            recurringPattern: null
        }
    });

    const typeValue = watch('type');
    const statusValue = watch('status');
    const clientIdValue = watch('clientId');
    const colorValue = watch('color');
    const coachIdValue = watch('coachId');
    const branchIdValue = watch('branchId');
    const roomIdValue = watch('roomId');
    const equipmentIdValue = watch('equipmentId');
    const nutritionistIdValue = watch('nutritionistId');
    const isRecurringValue = watch('isRecurring');
    const recurringPatternValue = watch('recurringPattern');

    // Acquire lock on edit mount and release on close
    useEffect(() => {
        if (isOpen && isEdit && appointment?.id) {
            lockApt({ id: appointment.id, username: 'الكوتش أحمد' });
        }
        return () => {
            if (isEdit && appointment?.id) {
                unlockApt(appointment.id);
            }
        };
    }, [isOpen, isEdit, appointment?.id, lockApt, unlockApt]);

    // Handle isRecurring automatic subform defaults setting
    useEffect(() => {
        if (isRecurringValue && !recurringPatternValue) {
            setValue('recurringPattern', {
                frequency: 'weekly',
                interval: 1,
                count: 5,
                untilDate: '',
                skipHolidays: true
            });
        } else if (!isRecurringValue && recurringPatternValue) {
            setValue('recurringPattern', null);
        }
    }, [isRecurringValue, recurringPatternValue, setValue]);

    // Debounced conflict checks
    const watchedAll = watch();
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                checkConflicts({
                    id: appointment?.id,
                    title: watchedAll.title || 'موعد جديد',
                    date: watchedAll.date,
                    startTime: watchedAll.startTime,
                    endTime: watchedAll.endTime,
                    coachId: watchedAll.coachId,
                    clientId: watchedAll.clientId,
                    roomId: watchedAll.roomId === 'none' ? null : watchedAll.roomId,
                    equipmentId: watchedAll.equipmentId === 'none' ? null : watchedAll.equipmentId,
                    branchId: watchedAll.branchId,
                    nutritionistId: watchedAll.nutritionistId === 'none' ? null : watchedAll.nutritionistId
                }, {
                    onSuccess: (data) => {
                        setConflictsList(data || []);
                    }
                });
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [
        isOpen,
        appointment?.id,
        watchedAll.date,
        watchedAll.startTime,
        watchedAll.endTime,
        watchedAll.coachId,
        watchedAll.clientId,
        watchedAll.roomId,
        watchedAll.equipmentId,
        watchedAll.branchId,
        watchedAll.nutritionistId,
        watchedAll.title,
        checkConflicts
    ]);

    // Re-populate values on open / change
    useEffect(() => {
        if (isOpen) {
            if (appointment) {
                reset({
                    title: isDuplicate ? `نسخة - ${appointment.title}` : appointment.title,
                    description: appointment.description || '',
                    date: appointment.date,
                    startTime: appointment.startTime,
                    endTime: appointment.endTime,
                    type: appointment.type,
                    status: isDuplicate ? 'Scheduled' : appointment.status,
                    coachId: appointment.coachId || 1,
                    clientId: appointment.clientId ? Number(appointment.clientId) : null,
                    color: appointment.color || 'blue',
                    notes: appointment.notes || '',
                    branchId: appointment.branchId || 1,
                    roomId: appointment.roomId || null,
                    equipmentId: appointment.equipmentId || null,
                    nutritionistId: appointment.nutritionistId || null,
                    isRecurring: !!appointment.isRecurring,
                    recurringPattern: appointment.recurringPattern || null
                });
            } else {
                reset({
                    title: '',
                    description: '',
                    date: '2026-07-13',
                    startTime: '10:00',
                    endTime: '11:00',
                    type: 'Workout Session',
                    status: 'Scheduled',
                    coachId: 1,
                    clientId: null,
                    color: 'blue',
                    notes: '',
                    branchId: 1,
                    roomId: null,
                    equipmentId: null,
                    nutritionistId: null,
                    isRecurring: false,
                    recurringPattern: null
                });
            }
        }
    }, [isOpen, appointment, isDuplicate, reset]);

    const onSubmit = (data) => {
        // Sanitize string option keys
        const cleanedData = {
            ...data,
            roomId: data.roomId === 'none' ? null : data.roomId,
            equipmentId: data.equipmentId === 'none' ? null : data.equipmentId,
            nutritionistId: data.nutritionistId === 'none' ? null : data.nutritionistId
        };
        
        if (isEdit) {
            updateEvent({ id: appointment.id, eventData: cleanedData }, {
                onSuccess: () => {
                    if (selectedFileId && selectedFileId !== 'none') {
                        updateDocMutation.mutate({
                            id: Number(selectedFileId),
                            data: { appointmentId: appointment.id }
                        });
                    }
                    onClose();
                }
            });
        } else {
            createEvent(cleanedData, {
                onSuccess: (savedApt) => {
                    const createdId = savedApt?.id || (mockDatabase?.calendarEvents?.getAll?.()?.length ? Math.max(...mockDatabase.calendarEvents.getAll().map(e => e.id)) : null);
                    if (selectedFileId && selectedFileId !== 'none' && createdId) {
                        updateDocMutation.mutate({
                            id: Number(selectedFileId),
                            data: { appointmentId: createdId }
                        });
                    }
                    onClose();
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rtl text-right max-w-lg font-sans max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border-0">
                <DialogHeader className="border-b pb-2">
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? '*9/JD EH9/' : ',/HD) EH9/ ,/J/'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* Lock Warning Banner */}
                    {isEdit && isLockedByOther && (
                        <div className="bg-destructive/15 border border-destructive/20 text-destructive p-3 rounded-xl text-xs font-bold leading-normal">
                            ⚠️ هذا الموعد قيد التعديل حالياً بواسطة ({liveLock?.lockedBy}). تم تعطيل إمكانية الحفظ منعاً للكتابة الفوقية.
                        </div>
                    )}

                    {/* Conflict Warnings List */}
                    {conflictsList.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 p-3 rounded-xl text-xs font-semibold space-y-1">
                            <div className="font-bold">⚠️ تنبيهات تعارض الموارد والمواعيد:</div>
                            <ul className="list-disc list-inside space-y-0.5">
                                {conflictsList.map((warn, i) => <li key={i}>{warn}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="title">عنوان الموعد</Label>
                        <Input
                            id="title"
                            placeholder="مثال: جلسة تدريب الجزء السفلي"
                            className={`rounded-xl border-2 focus-visible:ring-primary ${errors.title ? 'border-destructive' : ''}`}
                            {...register('title')}
                        />
                        {errors.title && (
                            <p className="text-xs text-destructive font-semibold">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="description">وصف مختصر</Label>
                        <Input
                            id="description"
                            placeholder="تفاصيل سريعة عن الجلسة..."
                            className={`rounded-xl border-2 focus-visible:ring-primary ${errors.description ? 'border-destructive' : ''}`}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive font-semibold">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Date & Times */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5 col-span-1">
                            <Label htmlFor="date">التاريخ</Label>
                            <Input
                                id="date"
                                type="date"
                                className={`rounded-xl border-2 focus-visible:ring-primary font-sans ${errors.date ? 'border-destructive' : ''}`}
                                {...register('date')}
                            />
                            {errors.date && (
                                <p className="text-xs text-destructive font-semibold">{errors.date.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5 col-span-1">
                            <Label htmlFor="startTime">وقت البدء</Label>
                            <Input
                                id="startTime"
                                type="time"
                                className={`rounded-xl border-2 focus-visible:ring-primary font-sans ${errors.startTime ? 'border-destructive' : ''}`}
                                {...register('startTime')}
                            />
                            {errors.startTime && (
                                <p className="text-xs text-destructive font-semibold">{errors.startTime.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5 col-span-1">
                            <Label htmlFor="endTime">وقت الانتهاء</Label>
                            <Input
                                id="endTime"
                                type="time"
                                className={`rounded-xl border-2 focus-visible:ring-primary font-sans ${errors.endTime ? 'border-destructive' : ''}`}
                                {...register('endTime')}
                            />
                            {errors.endTime && (
                                <p className="text-xs text-destructive font-semibold">{errors.endTime.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Session Type & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>نوع الجلسة</Label>
                            <Select
                                value={typeValue}
                                onValueChange={(val) => setValue('type', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اختر نوع الجلسة" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    {SESSION_TYPES.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-xs text-destructive font-semibold">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>الحالة</Label>
                            <Select
                                value={statusValue}
                                onValueChange={(val) => setValue('status', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="الحالة" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    {SESSION_STATUSES.map(stat => (
                                        <SelectItem key={stat.value} value={stat.value}>{stat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-xs text-destructive font-semibold">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Coach & Nutritionist Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>المدرب المسؤول</Label>
                            <Select
                                value={coachIdValue ? String(coachIdValue) : '1'}
                                onValueChange={(val) => setValue('coachId', Number(val), { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اختر مدرباً" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    {coachesList.map(u => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>أخصائي التغذية</Label>
                            <Select
                                value={nutritionistIdValue ? String(nutritionistIdValue) : 'none'}
                                onValueChange={(val) => setValue('nutritionistId', val === 'none' ? null : Number(val), { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اختر أخصائياً" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="none">بدون أخصائي تغذية</SelectItem>
                                    {nutritionistsList.map(u => (
                                        <SelectItem key={u.id} value={String(u.id)}>{u.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Client Selection & Color Tag */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>المتدرب المخصص</Label>
                            <Select
                                value={clientIdValue ? String(clientIdValue) : 'none'}
                                onValueChange={(val) => setValue('clientId', val === 'none' ? null : Number(val), { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اختر متدرباً" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    <SelectItem value="none">بدون تخصيص متدرب</SelectItem>
                                    {clients.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.clientId && (
                                <p className="text-xs text-destructive font-semibold">{errors.clientId.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>اللون المميز بالتقويم</Label>
                            <Select
                                value={colorValue}
                                onValueChange={(val) => setValue('color', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2">
                                    <SelectValue placeholder="اللون" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right">
                                    {COLORS.map(c => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.color && (
                                <p className="text-xs text-destructive font-semibold">{errors.color.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Branch, Room & Equipment Selection Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label>الفرع</Label>
                            <Select
                                value={branchIdValue ? String(branchIdValue) : '1'}
                                onValueChange={(val) => setValue('branchId', Number(val), { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2 font-sans">
                                    <SelectValue placeholder="الفرع" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right font-sans">
                                    {branches.map(b => (
                                        <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>القاعة / الغرفة</Label>
                            <Select
                                value={roomIdValue ? String(roomIdValue) : 'none'}
                                onValueChange={(val) => setValue('roomId', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2 font-sans">
                                    <SelectValue placeholder="الغرفة" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right font-sans">
                                    <SelectItem value="none">بدون قاعة</SelectItem>
                                    <SelectItem value="Room A">الغرفة الرياضية أ</SelectItem>
                                    <SelectItem value="Room B">الغرفة الاستشارية ب</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>المعدة / الجهاز</Label>
                            <Select
                                value={equipmentIdValue ? String(equipmentIdValue) : 'none'}
                                onValueChange={(val) => setValue('equipmentId', val, { shouldValidate: true })}
                            >
                                <SelectTrigger className="rounded-xl border-2 font-sans">
                                    <SelectValue placeholder="الجهاز" />
                                </SelectTrigger>
                                <SelectContent className="rtl text-right font-sans">
                                    <SelectItem value="none">بدون معدات</SelectItem>
                                    <SelectItem value="Treadmill 1">جهاز المشي 1</SelectItem>
                                    <SelectItem value="Dumbbells Set">طقم الدامبلز</SelectItem>
                                    <SelectItem value="Squat Rack">حامل الأثقال</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Recurring Appointment Checkbox & Subform */}
                    <div className="border border-border p-3.5 rounded-xl space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                id="isRecurring"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                {...register('isRecurring')}
                            />
                            <Label htmlFor="isRecurring" className="cursor-pointer font-bold text-xs">تكرار هذا الموعد تلقائياً</Label>
                        </div>

                        {isRecurringValue && recurringPatternValue && (
                            <div className="grid grid-cols-2 gap-3 pt-1 border-t text-xs font-sans">
                                <div className="space-y-1">
                                    <Label className="text-[10px]">دورية التكرار</Label>
                                    <Select
                                        value={recurringPatternValue.frequency || 'weekly'}
                                        onValueChange={(val) => setValue('recurringPattern.frequency', val, { shouldValidate: true })}
                                    >
                                        <SelectTrigger className="h-8 text-xs rounded-lg">
                                            <SelectValue placeholder="الدورية" />
                                        </SelectTrigger>
                                        <SelectContent className="rtl text-right text-xs">
                                            <SelectItem value="daily">يومياً (Daily)</SelectItem>
                                            <SelectItem value="weekly">أسبوعياً (Weekly)</SelectItem>
                                            <SelectItem value="monthly">شهرياً (Monthly)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[10px]">كل كم دورة؟</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        className="h-8 text-xs rounded-lg font-sans"
                                        value={recurringPatternValue.interval ?? 1}
                                        onChange={(e) => setValue('recurringPattern.interval', Number(e.target.value), { shouldValidate: true })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[10px]">عدد التكرارات</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        className="h-8 text-xs rounded-lg font-sans"
                                        placeholder="مثال: 5"
                                        value={recurringPatternValue.count ?? ''}
                                        onChange={(e) => setValue('recurringPattern.count', e.target.value ? Number(e.target.value) : null, { shouldValidate: true })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[10px]">أو ينتهي بتاريخ</Label>
                                    <Input
                                        type="date"
                                        className="h-8 text-xs rounded-lg font-sans"
                                        value={recurringPatternValue.untilDate ?? ''}
                                        onChange={(e) => setValue('recurringPattern.untilDate', e.target.value || null, { shouldValidate: true })}
                                    />
                                </div>

                                <div className="col-span-2 flex items-center gap-2 pt-1">
                                    <input
                                        id="skipHolidays"
                                        type="checkbox"
                                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={recurringPatternValue.skipHolidays ?? true}
                                        onChange={(e) => setValue('recurringPattern.skipHolidays', e.target.checked, { shouldValidate: true })}
                                    />
                                    <Label htmlFor="skipHolidays" className="cursor-pointer text-[10px]">تخطي العطلات الأسبوعية والوطنية (الجمعة والعطلات)</Label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <Label htmlFor="notes">ملاحظات الحصة</Label>
                        <Textarea
                            id="notes"
                            placeholder="ملاحظات توجيهية، قياسات الوزن أو أي تحديثات تخص التدريب..."
                            className="rounded-xl border-2 min-h-20 focus-visible:ring-primary"
                            {...register('notes')}
                        />
                        {errors.notes && (
                            <p className="text-xs text-destructive font-semibold">{errors.notes.message}</p>
                        )}
                    </div>

                    {/* Attach File dropdown selector */}
                    <div className="space-y-1.5">
                        <Label htmlFor="attachFile">إرفاق مستند أو وثيقة للموعد</Label>
                        <Select value={selectedFileId} onValueChange={setSelectedFileId}>
                            <SelectTrigger className="rounded-xl border-2 text-xs font-semibold">
                                <SelectValue placeholder="اختر مستند لإرفاقه..." />
                            </SelectTrigger>
                            <SelectContent className="rtl text-right text-xs font-medium">
                                <SelectItem value="none">بدون إرفاق ملفات</SelectItem>
                                {allDocs.map(doc => (
                                    <SelectItem key={doc.id} value={String(doc.id)}>{doc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="flex flex-row-reverse gap-2 justify-start pt-3 border-t">
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
                            className="rounded-xl bg-primary text-white font-semibold"
                            disabled={isPending || (isEdit && isLockedByOther)}
                        >
                            {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'تأكيد الحجز'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default AddEditAppointmentDialog;

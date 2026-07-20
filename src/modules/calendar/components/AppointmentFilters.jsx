import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-clients';
import { useBranches } from '@/hooks/use-branches';
import { useAdminUsers } from '@/hooks/use-admin-users';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

const SORT_OPTIONS = [
    { value: 'Newest', label: 'الأحدث إنشائاً' },
    { value: 'Oldest', label: 'الأقدم إنشائاً' },
    { value: 'Start Time', label: 'وقت البدء' },
    { value: 'End Time', label: 'وقت الانتهاء' },
    { value: 'Status', label: 'الحالة' }
];

const STATUS_OPTIONS = [
    { value: 'Scheduled', label: 'مجدولة' },
    { value: 'Completed', label: 'مكتملة' },
    { value: 'Cancelled', label: 'ملغاة' },
    { value: 'Missed', label: 'فائتة' },
    { value: 'In Progress', label: 'جاري العمل' }
];

const TYPE_OPTIONS = [
    { value: 'Workout Session', label: 'جلسة تدريبية' },
    { value: 'Nutrition Consultation', label: 'استشارة تغذية' },
    { value: 'Assessment', label: 'تقييم أداء' },
    { value: 'Follow-up', label: 'متابعة دورية' },
    { value: 'Meeting', label: 'اجتماع عمل' },
    { value: 'Personal Training', label: 'تدريب شخصي' }
];

export function AppointmentFilters({ filters, onChange }) {
    const { data: clientsRes } = useClients();
    const clients = clientsRes?.data || [];

    const { data: branches = [] } = useBranches({ limit: 100 });
    const { data: staffList = [] } = useAdminUsers({ limit: 100 });
    const coaches = staffList.filter(u => u.role === 'Coach' || u.role === 'Super Admin' || u.role === 'Admin');

    const [searchLocal, setSearchLocal] = useState(filters.search || '');

    // Synchronize local search state with parent updates
    useEffect(() => {
        setSearchLocal(filters.search || '');
    }, [filters.search]);

    const handleSearchChange = (val) => {
        setSearchLocal(val);
        onChange({ ...filters, search: val });
    };

    const handleFilterSelect = (key, val) => {
        const value = val === 'all' ? '' : val;
        onChange({ ...filters, [key]: value });
    };

    const handleClear = () => {
        setSearchLocal('');
        onChange({
            search: '',
            status: '',
            type: '',
            clientId: '',
            coachId: '',
            branchId: '',
            roomId: '',
            equipmentId: '',
            sortBy: 'Start Time'
        });
    };

    const hasActiveFilters = 
        filters.search || 
        filters.status || 
        filters.type || 
        filters.clientId || 
        filters.coachId ||
        filters.branchId ||
        filters.roomId ||
        filters.equipmentId ||
        filters.sortBy !== 'Start Time';

    return (
        <div className="bg-card border rounded-2xl p-4 shadow-sm space-y-4 rtl text-right">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث عن موعد..."
                        value={searchLocal}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pr-9 rounded-xl border-border focus:ring-primary h-10 text-xs"
                    />
                </div>

                {/* Status Filter */}
                <Select
                    value={filters.status || 'all'}
                    onValueChange={(val) => handleFilterSelect('status', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل الحالات</SelectItem>
                        {STATUS_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Type Filter */}
                <Select
                    value={filters.type || 'all'}
                    onValueChange={(val) => handleFilterSelect('type', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب النوع" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل الأنواع</SelectItem>
                        {TYPE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Client Filter */}
                <Select
                    value={filters.clientId ? String(filters.clientId) : 'all'}
                    onValueChange={(val) => handleFilterSelect('clientId', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب المتدرب" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل المتدربين</SelectItem>
                        {clients.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Coach Filter */}
                <Select
                    value={filters.coachId ? String(filters.coachId) : 'all'}
                    onValueChange={(val) => handleFilterSelect('coachId', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب المدرب" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل المدربين</SelectItem>
                        {coaches.map(u => (
                            <SelectItem key={u.id} value={String(u.id)}>{u.fullName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Branch Filter */}
                <Select
                    value={filters.branchId ? String(filters.branchId) : 'all'}
                    onValueChange={(val) => handleFilterSelect('branchId', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب الفرع" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل الفروع</SelectItem>
                        {branches.map(b => (
                            <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Room Filter */}
                <Select
                    value={filters.roomId || 'all'}
                    onValueChange={(val) => handleFilterSelect('roomId', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب القاعة" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل القاعات</SelectItem>
                        <SelectItem value="Room A">الغرفة الرياضية أ</SelectItem>
                        <SelectItem value="Room B">الغرفة الاستشارية ب</SelectItem>
                    </SelectContent>
                </Select>

                {/* Equipment Filter */}
                <Select
                    value={filters.equipmentId || 'all'}
                    onValueChange={(val) => handleFilterSelect('equipmentId', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs">
                        <SelectValue placeholder="تصفية حسب المعدات" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        <SelectItem value="all">كل الأجهزة</SelectItem>
                        <SelectItem value="Treadmill 1">جهاز المشي 1</SelectItem>
                        <SelectItem value="Dumbbells Set">طقم الدامبلز</SelectItem>
                        <SelectItem value="Squat Rack">حامل الأثقال</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Option */}
                <Select
                    value={filters.sortBy || 'Start Time'}
                    onValueChange={(val) => handleFilterSelect('sortBy', val)}
                >
                    <SelectTrigger className="rounded-xl border-border h-10 text-xs font-semibold">
                        <SelectValue placeholder="ترتيب المواعيد" />
                    </SelectTrigger>
                    <SelectContent className="rtl text-right">
                        {SORT_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasActiveFilters && (
                <div className="flex justify-start">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClear}
                        className="text-xs text-destructive hover:bg-destructive/10 h-8 gap-1.5 px-3 rounded-lg"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>إعادة تعيين الفلاتر</span>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default AppointmentFilters;

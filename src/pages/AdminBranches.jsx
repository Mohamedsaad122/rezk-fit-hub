import React, { useState } from 'react';
import { 
    useBranches, 
    useCreateBranch, 
    useUpdateBranch, 
    useDeleteBranch 
} from '@/hooks/use-branches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { 
    Search, Plus, Edit2, Trash2, MapPin, 
    Building2, Phone, User, Globe 
} from 'lucide-react';
import { useEntityLock, useMergeConflict } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';
import { MergeConflictDialog } from '@/components/MergeConflictDialog';

export const AdminBranches = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [page, setPage] = useState(1);

    const { data: branches, isLoading } = useBranches({
        search,
        status,
        page,
        limit: 10
    });

    const createBranchMutation = useCreateBranch();
    const updateBranchMutation = useUpdateBranch();
    const deleteBranchMutation = useDeleteBranch();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        code: '',
        address: '',
        phone: '',
        manager: '',
        status: 'Active',
        timezone: 'Asia/Riyadh'
    });

    const [branchToDelete, setBranchToDelete] = useState(null);

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'Branch',
        editingBranch?.id,
        isFormOpen && !!editingBranch,
        'الكوتش أحمد',
        '👨‍و'
    );

    const { mergeRequest, createMergeRequest, resolveMergeConflict } = useMergeConflict('Branch', editingBranch?.id);
    const [isConflictOpen, setIsConflictOpen] = useState(false);

    const handleOpenCreate = () => {
        setEditingBranch(null);
        setFormValues({
            name: '',
            code: '',
            address: '',
            phone: '',
            manager: '',
            status: 'Active',
            timezone: 'Asia/Riyadh'
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (branch) => {
        setEditingBranch(branch);
        setFormValues({
            name: branch.name,
            code: branch.code,
            address: branch.address,
            phone: branch.phone,
            manager: branch.manager,
            status: branch.status,
            timezone: branch.timezone
        });
        setIsFormOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (editingBranch && (window.simulateConflict || Math.random() < 0.05)) {
            const concurrentChange = { ...editingBranch, name: editingBranch.name + ' (تعديل متزامن)', manager: 'الكوتش أحمد' };
            await createMergeRequest({
                mine: formValues,
                theirs: concurrentChange,
                merged: { ...concurrentChange, ...formValues }
            });
            setIsConflictOpen(true);
            return;
        }

        executeSave(formValues);
    };

    const executeSave = (data) => {
        if (editingBranch) {
            updateBranchMutation.mutate({
                id: editingBranch.id,
                data
            }, {
                onSuccess: () => setIsFormOpen(false)
            });
        } else {
            createBranchMutation.mutate(data, {
                onSuccess: () => setIsFormOpen(false)
            });
        }
    };

    const handleResolveConflict = async (id, status, mergedData) => {
        setIsConflictOpen(false);
        if (status === 'accepted') {
            await resolveMergeConflict({ id, status, mergedData });
            executeSave(mergedData);
        } else {
            await resolveMergeConflict({ id, status });
            setIsFormOpen(false);
        }
    };

    const handleDelete = () => {
        if (branchToDelete) {
            deleteBranchMutation.mutate(branchToDelete.id, {
                onSuccess: () => setBranchToDelete(null)
            });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 rtl text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">إدارة الفروع الإقليمية</h1>
                    <p className="text-muted-foreground text-sm mt-1">تتبع مواقع صالات التدريب الرياضية والمشرفين المسؤولين عنها.</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto bg-gradient-primary text-white">
                    <Plus className="w-4 h-4" />
                    إضافة فرع جديد
                </Button>
            </div>

            {/* Filters Bar */}
            <Card className="border-border">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="ابحث باسم الفرع، الرمز أو العنوان..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pr-10"
                        />
                    </div>

                    <select 
                        value={status} 
                        onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                    >
                        <option value="All">كل الفروع</option>
                        <option value="Active">نشط فقط</option>
                        <option value="Inactive">غير نشط</option>
                    </select>
                </CardContent>
            </Card>

            {/* Grid of Branches */}
            {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">جاري تحميل الفروع...</div>
            ) : branches.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-card border rounded-xl">لا توجد فروع مسجلة حالياً.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((b) => (
                        <Card key={b.id} className="border-border hover:shadow-lg transition-all relative overflow-hidden bg-card flex flex-col justify-between">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-bold">{b.name}</CardTitle>
                                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">{b.code}</span>
                                        </div>
                                    </div>
                                    <Badge variant={b.status === 'Active' ? 'default' : 'secondary'} className={b.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'}>
                                        {b.status === 'Active' ? 'نشط' : 'غير نشط'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3 text-sm text-muted-foreground flex-1">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <span>{b.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="font-mono">{b.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span>المدير: <span className="font-semibold text-foreground">{b.manager}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span>التوقيت: <span className="font-mono text-xs">{b.timezone}</span></span>
                                </div>
                            </CardContent>

                            <div className="p-3 border-t border-border/40 bg-muted/10 flex items-center justify-end gap-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleOpenEdit(b)}
                                    className="h-8 gap-1.5 hover:bg-muted"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    تعديل
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setBranchToDelete(b)}
                                    className="h-8 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    حذف
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Branch Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="rtl text-right max-w-md">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary shrink-0" />
                                {editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد للنظام'}
                            </DialogTitle>
                            <DialogDescription>
                                إدخال بيانات الفرع الجغرافية ومعلومات الاتصال والمشرف المسؤول.
                            </DialogDescription>
                        </DialogHeader>

                        {editingBranch && (
                            <LockWarningBanner
                                lockData={lockData}
                                isLockedByOther={isLockedByOther}
                                forceUnlock={forceUnlock}
                            />
                        )}

                        <fieldset disabled={isLockedByOther} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="branchName">اسم الفرع</Label>
                                    <Input 
                                        id="branchName" 
                                        required 
                                        value={formValues.name} 
                                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branchCode">رمز الفرع (الكود)</Label>
                                    <Input 
                                        id="branchCode" 
                                        required 
                                        placeholder="JED-02"
                                        value={formValues.code} 
                                        onChange={(e) => setFormValues({ ...formValues, code: e.target.value })} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branchAddress">العنوان الجغرافي</Label>
                                <Input 
                                    id="branchAddress" 
                                    required 
                                    value={formValues.address} 
                                    onChange={(e) => setFormValues({ ...formValues, address: e.target.value })} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branchPhone">رقم هاتف الفرع</Label>
                                <Input 
                                    id="branchPhone" 
                                    required 
                                    value={formValues.phone} 
                                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="branchManager">المدير المسؤول</Label>
                                    <Input 
                                        id="branchManager" 
                                        required 
                                        value={formValues.manager} 
                                        onChange={(e) => setFormValues({ ...formValues, manager: e.target.value })} 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="branchStatus">حالة الفرع</Label>
                                    <select 
                                        id="branchStatus"
                                        value={formValues.status}
                                        onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg text-sm p-2.5 text-foreground focus:outline-none"
                                    >
                                        <option value="Active">نشط</option>
                                        <option value="Inactive">غير نشط</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branchTimezone">المنطقة الزمنية</Label>
                                <Input 
                                    id="branchTimezone" 
                                    required 
                                    value={formValues.timezone} 
                                    onChange={(e) => setFormValues({ ...formValues, timezone: e.target.value })} 
                                />
                            </div>
                        </fieldset>

                        <DialogFooter className="flex flex-row-reverse gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
                            <Button 
                                type="submit" 
                                disabled={createBranchMutation.isPending || updateBranchMutation.isPending || isLockedByOther} 
                                className="bg-primary text-primary-foreground"
                            >
                                {editingBranch ? 'تعديل وحفظ' : 'إضافة فرع'}
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

            {/* Delete Branch Confirmation */}
            <Dialog open={!!branchToDelete} onOpenChange={() => setBranchToDelete(null)}>
                <DialogContent className="rtl text-right max-w-sm">
                    <DialogHeader>
                        <DialogTitle>حذف الفرع نهائياً</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من حذف فرع <span className="font-semibold text-foreground">«{branchToDelete?.name}»</span>؟ سيؤدي هذا لحذف بيانات الموقع وربط الموظفين بفرع آخر.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
                        <Button variant="outline" onClick={() => setBranchToDelete(null)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteBranchMutation.isPending}>
                            حذف نهائي
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBranches;

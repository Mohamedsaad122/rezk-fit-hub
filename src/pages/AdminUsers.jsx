import React, { useState } from 'react';
import { 
    useAdminUsers, 
    useCreateAdminUser, 
    useUpdateAdminUser, 
    useDeleteAdminUser 
} from '@/hooks/use-admin-users';
import { useBranches } from '@/hooks/use-branches';
import { Card, CardContent } from '@/components/ui/card';
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
    Search, UserPlus, Edit2, Trash2, Ban, CheckCircle, 
    Filter, ChevronLeft, ChevronRight, UserCog 
} from 'lucide-react';
import { useEntityLock, useMergeConflict } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';
import { MergeConflictDialog } from '@/components/MergeConflictDialog';

export const AdminUsers = () => {
    // Filter states
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('All');
    const [status, setStatus] = useState('All');
    const [branch, setBranch] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [page, setPage] = useState(1);

    const { data: users, meta, isLoading } = useAdminUsers({
        search,
        role,
        status,
        branch,
        sortBy,
        page,
        limit: 5
    });

    const { data: branchesList = [] } = useBranches();

    // Mutations
    const createUserMutation = useCreateAdminUser();
    const updateUserMutation = useUpdateAdminUser();
    const deleteUserMutation = useDeleteAdminUser();

    // Dialog state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formValues, setFormValues] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Coach',
        status: 'Active',
        branch: '',
        notes: ''
    });

    // Delete confirmation state
    const [userToDelete, setUserToDelete] = useState(null);

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'AdminUser',
        editingUser?.id,
        isFormOpen && !!editingUser,
        'الكوتش أحمد',
        '👨‍و'
    );

    const { mergeRequest, createMergeRequest, resolveMergeConflict } = useMergeConflict('AdminUser', editingUser?.id);
    const [isConflictOpen, setIsConflictOpen] = useState(false);

    const handleOpenCreate = () => {
        setEditingUser(null);
        setFormValues({
            fullName: '',
            email: '',
            phone: '',
            role: 'Coach',
            status: 'Active',
            branch: branchesList[0]?.name || 'فرع الرياض الرئيسي',
            notes: ''
        });
        setIsFormOpen(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setFormValues({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            branch: user.branch,
            notes: user.notes || ''
        });
        setIsFormOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (editingUser && (window.simulateConflict || Math.random() < 0.05)) {
            const concurrentChange = { ...editingUser, fullName: editingUser.fullName + ' (تعديل متزامن)', role: 'Admin' };
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
        if (editingUser) {
            updateUserMutation.mutate({
                id: editingUser.id,
                data
            }, {
                onSuccess: () => setIsFormOpen(false)
            });
        } else {
            createUserMutation.mutate(data, {
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
        if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.id, {
                onSuccess: () => setUserToDelete(null)
            });
        }
    };

    const toggleUserStatus = (user) => {
        const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        updateUserMutation.mutate({
            id: user.id,
            data: { status: nextStatus }
        });
    };

    const roles = ['Super Admin', 'Admin', 'Coach', 'Nutritionist', 'Receptionist'];
    const statuses = ['Active', 'Inactive', 'Suspended'];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 rtl text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">إدارة مستخدمي النظام</h1>
                    <p className="text-muted-foreground text-sm mt-1">إنشاء وتعديل وإلغاء تنشيط حسابات الموظفين والمدربين والمسؤولين.</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 self-start sm:self-auto bg-gradient-primary text-white">
                    <UserPlus className="w-4 h-4" />
                    إضافة مستخدم جديد
                </Button>
            </div>

            {/* Filters Section */}
            <Card className="border-border">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="ابحث بالاسم، البريد أو رقم الهاتف..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pr-10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                            <select 
                                value={role} 
                                onChange={(e) => { setRole(e.target.value); setPage(1); }}
                                className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                            >
                                <option value="All">كل الأدوار</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <select 
                            value={status} 
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                        >
                            <option value="All">كل الحالات</option>
                            <option value="Active">نشط</option>
                            <option value="Inactive">غير نشط</option>
                            <option value="Suspended">معلق</option>
                        </select>

                        <select 
                            value={branch} 
                            onChange={(e) => { setBranch(e.target.value); setPage(1); }}
                            className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                        >
                            <option value="All">كل الفروع</option>
                            {branchesList.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                        </select>

                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                        >
                            <option value="Newest">الأحدث تسجيلاً</option>
                            <option value="NameAsc">الاسم تصاعدياً</option>
                            <option value="NameDesc">الاسم تنازلياً</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">المستخدم</th>
                                <th className="px-6 py-4">الدور الوظيفي</th>
                                <th className="px-6 py-4">الفرع</th>
                                <th className="px-6 py-4">الحالة</th>
                                <th className="px-6 py-4">آخر ظهور</th>
                                <th className="px-6 py-4 text-left">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">جاري تحميل بيانات المستخدمين...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">لا يوجد مستخدمون متطابقون مع الفلاتر المحددة.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shrink-0 font-bold text-sm">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{user.fullName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{user.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{user.branch}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                                                ${user.status === 'Inactive' ? 'bg-gray-500/10 text-gray-400' : ''}
                                                ${user.status === 'Suspended' ? 'bg-red-500/10 text-red-500' : ''}
                                            `}>
                                                <span className={`w-1.5 h-1.5 rounded-full 
                                                    ${user.status === 'Active' ? 'bg-emerald-500' : ''}
                                                    ${user.status === 'Inactive' ? 'bg-gray-400' : ''}
                                                    ${user.status === 'Suspended' ? 'bg-red-500' : ''}
                                                `} />
                                                {user.status === 'Active' ? 'نشط' : user.status === 'Inactive' ? 'غير نشط' : 'معلق'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ar-SA', {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            }) : 'لم يسجل دخول بعد'}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => toggleUserStatus(user)}
                                                    title={user.status === 'Active' ? 'تعليق الحساب' : 'تنشيط الحساب'}
                                                    className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground"
                                                >
                                                    {user.status === 'Active' ? <Ban className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                </Button>

                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>

                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => setUserToDelete(user)}
                                                    className="w-8 h-8 rounded-lg hover:bg-muted text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                {!isLoading && meta.totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                        <span className="text-xs text-muted-foreground">
                            عرض الصفحة {meta.page} من أصل {meta.totalPages} (الإجمالي {meta.total} مستخدمين)
                        </span>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={meta.page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronRight className="w-4 h-4" />
                                السابق
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            >
                                التالي
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Create / Edit User Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="rtl text-right max-w-md">
                    <form onSubmit={handleSave}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserCog className="w-5 h-5 text-primary shrink-0" />
                                {editingUser ? 'تحديث بيانات حساب المستخدم' : 'إنشاء حساب مستخدم جديد'}
                            </DialogTitle>
                            <DialogDescription>
                                تعبئة بيانات المستخدم الوظيفية وتحديد الدور الإداري المناسب والفرع المخصص.
                            </DialogDescription>
                        </DialogHeader>

                        {editingUser && (
                            <LockWarningBanner
                                lockData={lockData}
                                isLockedByOther={isLockedByOther}
                                forceUnlock={forceUnlock}
                            />
                        )}

                        <fieldset disabled={isLockedByOther} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">الاسم الكامل</Label>
                                <Input 
                                    id="fullName" 
                                    required 
                                    value={formValues.fullName} 
                                    onChange={(e) => setFormValues({ ...formValues, fullName: e.target.value })} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    required 
                                    value={formValues.email} 
                                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">رقم الجوال</Label>
                                <Input 
                                    id="phone" 
                                    required 
                                    placeholder="+9665xxxxxxxx" 
                                    value={formValues.phone} 
                                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">الدور الإداري</Label>
                                    <select 
                                        id="role"
                                        value={formValues.role}
                                        onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg text-sm p-2.5 text-foreground focus:outline-none"
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">الحالة</Label>
                                    <select 
                                        id="status"
                                        value={formValues.status}
                                        onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg text-sm p-2.5 text-foreground focus:outline-none"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branch">الفرع المخصص</Label>
                                <select 
                                    id="branch"
                                    value={formValues.branch}
                                    onChange={(e) => setFormValues({ ...formValues, branch: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg text-sm p-2.5 text-foreground focus:outline-none"
                                >
                                    {branchesList.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                    {branchesList.length === 0 && <option value="فرع الرياض الرئيسي">فرع الرياض الرئيسي</option>}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">ملاحظات ومهام وظيفية</Label>
                                <Input 
                                    id="notes" 
                                    value={formValues.notes} 
                                    onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })} 
                                />
                            </div>
                        </fieldset>

                        <DialogFooter className="flex flex-row-reverse gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
                            <Button 
                                type="submit" 
                                disabled={createUserMutation.isPending || updateUserMutation.isPending || isLockedByOther} 
                                className="bg-primary text-primary-foreground"
                            >
                                {editingUser ? 'تعديل وحفظ' : 'إنشاء حساب'}
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

            {/* Delete User Confirmation */}
            <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <DialogContent className="rtl text-right max-w-sm">
                    <DialogHeader>
                        <DialogTitle>تأكيد حذف الحساب</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد من رغبتك في حذف حساب المستخدم <span className="font-semibold text-foreground">«{userToDelete?.fullName}»</span> نهائياً من النظام؟ لا يمكن التراجع عن هذا الإجراء.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
                        <Button variant="outline" onClick={() => setUserToDelete(null)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteUserMutation.isPending}>
                            حذف نهائي
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminUsers;

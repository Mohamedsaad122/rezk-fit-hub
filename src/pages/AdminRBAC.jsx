import React, { useState } from 'react';
import { useAdminStore } from '@/store/admin.store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toastService } from '@/services/toast.service';
import { Shield, Save, CheckSquare, Square, Info } from 'lucide-react';
import { useEntityLock } from '@/hooks/use-collaboration';
import { LockWarningBanner } from '@/components/LockWarningBanner';

export const AdminRBAC = () => {
    const { permissionMatrix, togglePermission } = useAdminStore();
    const [selectedRole, setSelectedRole] = useState('Coach');

    const { lockData, isLockedByOther, forceUnlock } = useEntityLock(
        'RBAC',
        'matrix',
        true,
        'الكوتش أحمد',
        '👨‍و'
    );

    const roles = ['Super Admin', 'Admin', 'Coach', 'Nutritionist', 'Receptionist'];
    
    const modules = [
        'Dashboard', 'Clients', 'Calendar', 'Tasks', 'Exercises', 
        'Nutrition', 'Analytics', 'Messages', 'Documents', 
        'Notifications', 'Settings', 'Users', 'Roles', 'Audit Logs'
    ];

    const permissions = ['View', 'Create', 'Update', 'Delete', 'Export', 'Manage'];

    const handleSaveMatrix = () => {
        toastService.success(`تم حفظ مصفوفة الصلاحيات لدور: ${selectedRole} بنجاح`);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 rtl text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">إدارة الصلاحيات والأدوار (RBAC)</h1>
                    <p className="text-muted-foreground text-sm mt-1">تحديد الامتيازات والصلاحيات الدقيقة لكل دور وظيفي في المنصة.</p>
                </div>
                <Button 
                    onClick={handleSaveMatrix} 
                    className="gap-2 bg-gradient-primary text-white"
                    disabled={isLockedByOther}
                >
                    <Save className="w-4 h-4" />
                    حفظ مصفوفة الصلاحيات
                </Button>
            </div>

            <LockWarningBanner
                lockData={lockData}
                isLockedByOther={isLockedByOther}
                forceUnlock={forceUnlock}
            />

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                {/* Roles Selector */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 bg-card border border-border p-2 rounded-xl">
                    {roles.map((r) => (
                        <button
                            key={r}
                            onClick={() => setSelectedRole(r)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-right whitespace-nowrap lg:w-full
                                ${selectedRole === r 
                                    ? 'bg-primary text-primary-foreground shadow-md font-semibold' 
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }
                            `}
                        >
                            <Shield className="w-4 h-4 shrink-0" />
                            <span>{r}</span>
                        </button>
                    ))}
                </div>

                {/* Permissions Matrix Table */}
                <div className="lg:col-span-3">
                    <Card className="border-border shadow-lg">
                        <CardHeader className="border-b border-border/40 pb-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Info className="w-4 h-4 shrink-0" />
                                <span className="text-xs text-muted-foreground">صلاحيات «Super Admin» مفعلة بالكامل افتراضياً لجميع الأقسام والأفعال.</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-right min-w-[600px]">
                                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-foreground">القسم / الوحدة</th>
                                        {permissions.map(p => (
                                            <th key={p} className="px-4 py-4 text-center">{p}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {modules.map((moduleName) => {
                                        const rolePermissions = permissionMatrix[selectedRole]?.[moduleName] || [];
                                        const isSuper = selectedRole === 'Super Admin';

                                        return (
                                            <tr key={moduleName} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-foreground">{moduleName}</td>
                                                {permissions.map((p) => {
                                                    const isChecked = rolePermissions.includes(p) || isSuper;
                                                    return (
                                                        <td key={p} className="px-4 py-4 text-center">
                                                            <button
                                                                type="button"
                                                                disabled={isSuper || isLockedByOther}
                                                                onClick={() => togglePermission(selectedRole, moduleName, p)}
                                                                className={`w-6 h-6 inline-flex items-center justify-center rounded transition-all focus:outline-none
                                                                    ${isSuper || isLockedByOther
                                                                        ? 'text-primary/40 cursor-not-allowed' 
                                                                        : isChecked
                                                                            ? 'text-primary hover:bg-primary/10'
                                                                            : 'text-muted-foreground hover:bg-muted'
                                                                    }
                                                                `}
                                                            >
                                                                {isChecked ? (
                                                                    <CheckSquare className="w-5 h-5 shrink-0" />
                                                                ) : (
                                                                    <Square className="w-5 h-5 shrink-0" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminRBAC;

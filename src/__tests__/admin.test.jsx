import { describe, it, expect, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { AdminUserRepository } from '../repositories/adminUser.repository';
import { BranchRepository } from '../repositories/branch.repository';
import { AuditLogRepository } from '../repositories/auditLog.repository';
import { useAdminStore } from '../store/admin.store';
import { AdminUserSchema } from '../contracts/adminUser.contract';
import { BranchSchema } from '../contracts/branch.contract';
import { AuditLogSchema } from '../contracts/auditLog.contract';
import { SystemSettingsSchema } from '../contracts/systemSettings.contract';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

describe('Sprint 3.9 System Administration, RBAC & Enterprise Audit Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
        useAdminStore.getState().resetStore();
    });

    describe('1. Zod Contract Schemas Validation', () => {
        it('should validate a valid admin user record', () => {
            const user = {
                id: 10,
                fullName: 'محمد سعد',
                email: 'mohamed.saad@rezkfit.com',
                phone: '+966509998877',
                avatar: null,
                role: 'Coach',
                status: 'Active',
                lastLogin: null,
                createdAt: new Date().toISOString(),
                branch: 'فرع جدة',
                notes: 'مدرب حديد وقوة بدنية'
            };
            const result = AdminUserSchema.safeParse(user);
            expect(result.success).toBe(true);
        });

        it('should fail validation on invalid role for admin user', () => {
            const user = {
                id: 11,
                fullName: 'سعيد القحطاني',
                email: 'saeed@rezkfit.com',
                phone: '+966509998811',
                avatar: null,
                role: 'Super Manager', // Invalid role
                status: 'Active',
                lastLogin: null,
                createdAt: new Date().toISOString(),
                branch: 'فرع الرياض الرئيسي',
                notes: ''
            };
            const result = AdminUserSchema.safeParse(user);
            expect(result.success).toBe(false);
        });

        it('should validate a valid branch record', () => {
            const branch = {
                id: 5,
                name: 'فرع الدمام',
                code: 'DMM-05',
                address: 'طريق الملك عبدالله، الدمام',
                phone: '+966138889900',
                manager: 'كابتن علي كمال',
                status: 'Active',
                timezone: 'Asia/Riyadh'
            };
            const result = BranchSchema.safeParse(branch);
            expect(result.success).toBe(true);
        });

        it('should validate system settings schema integrity', () => {
            const mockSettings = {
                general: {
                    siteName: "Rezk Fit",
                    supportEmail: "info@rezkfit.com",
                    contactPhone: "+966110009988"
                },
                security: {
                    passwordExpiryDays: 30,
                    enableTwoFactor: false,
                    sessionTimeoutMinutes: 15
                },
                notifications: {
                    emailAlerts: true,
                    smsAlerts: true,
                    pushAlerts: false
                },
                appearance: {
                    theme: "dark",
                    primaryColor: "blue",
                    sidebarCollapsed: true
                },
                localization: {
                    defaultLanguage: "ar",
                    timezone: "Asia/Riyadh",
                    dateFormat: "YYYY/MM/DD"
                }
            };
            const result = SystemSettingsSchema.safeParse(mockSettings);
            expect(result.success).toBe(true);
        });

        it('should validate audit log validation schema', () => {
            const log = {
                id: 15,
                action: 'User Login',
                entity: 'Authentication',
                user: 'أحمد عبد الله',
                date: new Date().toISOString(),
                ip: '127.0.0.1',
                device: 'Chrome / Windows',
                status: 'Success',
                details: 'تسجيل دخول من لوحة التحكم'
            };
            const result = AuditLogSchema.safeParse(log);
            expect(result.success).toBe(true);
        });
    });

    describe('2. Zustand Store Admin State & Actions', () => {
        it('should initialize default settings and support updates', () => {
            const store = useAdminStore.getState();
            expect(store.settings.general.siteName).toBe('Rezk Fit Hub');

            store.updateSettings('general', { siteName: 'نادي رزق الرياضي' });
            const updated = useAdminStore.getState();
            expect(updated.settings.general.siteName).toBe('نادي رزق الرياضي');
        });

        it('should toggle module permissions for a role in the permission matrix', () => {
            const store = useAdminStore.getState();
            
            // Initial view of Coach for Settings
            const beforePermissions = store.permissionMatrix['Coach']?.['Settings'] || [];
            expect(beforePermissions.includes('View')).toBe(false);

            // Toggle Settings View permission
            store.togglePermission('Coach', 'Settings', 'View');
            const afterPermissions = useAdminStore.getState().permissionMatrix['Coach']?.['Settings'] || [];
            expect(afterPermissions.includes('View')).toBe(true);

            // Toggle back to off
            store.togglePermission('Coach', 'Settings', 'View');
            const finalPermissions = useAdminStore.getState().permissionMatrix['Coach']?.['Settings'] || [];
            expect(finalPermissions.includes('View')).toBe(false);
        });
    });

    describe('3. Repository CRUD and In-Memory Data Flow', () => {
        it('should retrieve list of admin users and execute creation', async () => {
            const users = await AdminUserRepository.getAll();
            expect(users.data.length).toBeGreaterThan(0);

            const beforeCount = users.data.length;
            const newUser = await AdminUserRepository.create({
                fullName: 'سلطان المطيري',
                email: 'sultan@rezkfit.com',
                phone: '+966500002211',
                avatar: null,
                role: 'Nutritionist',
                status: 'Active',
                branch: 'فرع الرياض الرئيسي',
                notes: 'أخصائي تغذية كيتو وبورليفتينج'
            });

            expect(newUser.id).toBeDefined();
            expect(newUser.fullName).toBe('سلطان المطيري');

            const afterUsers = await AdminUserRepository.getAll();
            expect(afterUsers.data.length).toBe(beforeCount + 1);
        });

        it('should update admin user details and toggle status', async () => {
            const users = await AdminUserRepository.getAll();
            const targetUser = users.data[0];

            const updated = await AdminUserRepository.update(targetUser.id, {
                fullName: 'أحمد عبد الله المحدث',
                status: 'Suspended'
            });
            expect(updated.fullName).toBe('أحمد عبد الله المحدث');
            expect(updated.status).toBe('Suspended');

            const checked = await AdminUserRepository.getById(targetUser.id);
            expect(checked.fullName).toBe('أحمد عبد الله المحدث');
        });

        it('should retrieve branches and update status', async () => {
            const branches = await BranchRepository.getAll();
            expect(branches.data.length).toBeGreaterThan(0);

            const beforeCount = branches.data.length;
            const newBranch = await BranchRepository.create({
                name: 'فرع تبوك',
                code: 'TAB-08',
                address: 'شارع الملك عبدالعزيز، تبوك',
                phone: '+966147778899',
                manager: 'خالد العنزي',
                status: 'Active',
                timezone: 'Asia/Riyadh'
            });

            expect(newBranch.id).toBeDefined();
            expect(newBranch.name).toBe('فرع تبوك');

            const afterBranches = await BranchRepository.getAll();
            expect(afterBranches.data.length).toBe(beforeCount + 1);
        });

        it('should automatically generate audit logs on database mutations', async () => {
            const logsBefore = await AuditLogRepository.getAll();
            const beforeCount = logsBefore.data.length;

            // Trigger user creation to fire generateAuditLog in mockDatabase
            await AdminUserRepository.create({
                fullName: 'فيصل السديري',
                email: 'faisal@rezkfit.com',
                phone: '+966509993322',
                avatar: null,
                role: 'Admin',
                status: 'Active',
                branch: 'فرع جدة',
                notes: 'مسؤول العمليات والامتثال'
            });

            const logsAfter = await AuditLogRepository.getAll();
            expect(logsAfter.data.length).toBe(beforeCount + 1);
            expect(logsAfter.data[0].action).toBe('User Created');
            expect(logsAfter.data[0].details).toContain('فيصل السديري');
        });
    });
});

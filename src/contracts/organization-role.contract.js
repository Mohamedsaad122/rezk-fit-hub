import { z } from 'zod';

export const ModulePermissionsSchema = z.record(z.array(z.string()));

export const OrganizationRoleSchema = z.object({
    role: z.string(),
    name: z.string(),
    permissions: ModulePermissionsSchema
});

export const PermissionMatrixSchema = z.object({
    organizationId: z.union([z.string(), z.number()]),
    rolePermissions: z.record(ModulePermissionsSchema),
    teamPermissions: z.record(z.record(ModulePermissionsSchema)).optional(),
    customOverrides: z.record(ModulePermissionsSchema).optional() // maps memberId -> ModulePermissions
});

export default OrganizationRoleSchema;

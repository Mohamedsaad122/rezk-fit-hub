import { z } from 'zod';

export const AuditSecurityLogSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    eventType: z.enum(['AUTH_SUCCESS', 'AUTH_FAILURE', 'MFA_VERIFY', 'MFA_SETUP', 'SSO_LOGIN', 'SESSION_REVOKED', 'POLICY_VIOLATION', 'SECRET_ACCESS', 'PRIVILEGE_ESCALATION']),
    userId: z.union([z.string(), z.number()]).nullable().optional(),
    ipAddress: z.string(),
    location: z.string().nullable().optional(),
    details: z.string(),
    riskScore: z.number().default(0),
    timestamp: z.string()
});

export const AuditSecurityLogListSchema = z.array(AuditSecurityLogSchema);

export default AuditSecurityLogSchema;

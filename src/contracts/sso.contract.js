import { z } from 'zod';

export const SsoConfigSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    providerType: z.enum(['SAML2', 'OIDC', 'OAuth2', 'LDAP']),
    providerName: z.enum(['AzureAD', 'GoogleWorkspace', 'Okta', 'Auth0', 'ActiveDirectory']),
    entryPoint: z.string().url(),
    issuer: z.string(),
    certFingerprint: z.string().optional().nullable(),
    clientId: z.string().optional().nullable(),
    clientSecret: z.string().optional().nullable(),
    status: z.enum(['Active', 'Disabled']).default('Active'),
    createdAt: z.string()
});

export const SsoConfigListSchema = z.array(SsoConfigSchema);

export default SsoConfigSchema;

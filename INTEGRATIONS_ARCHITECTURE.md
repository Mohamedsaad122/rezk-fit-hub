# Enterprise Integrations & Third-Party Ecosystem Architecture

Rezk Fit Hub provides a robust integrations platform for connecting with external enterprise services. To prevent vendor lock-in and support dynamic switching of backend providers, the system implements an **Adapter-based architecture**.

## Architecture Layers

```
┌────────────────────────────────────────────────────────┐
│                      Client / UI                       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Service Layer                       │
│  (StorageService, EmailService, SmsService, etc.)      │
└───────────────────────────┬────────────────────────────┘
                            │ (Resolves Active Provider)
┌───────────────────────────▼────────────────────────────┐
│                  Provider Manager                      │
│             (ProviderManagerService)                   │
└───────────────────────────┬────────────────────────────┘
                            │ (Selects Adapter Instance)
┌───────────────────────────▼────────────────────────────┐
│                    Adapters Layer                      │
│ (S3, Drive, Cloudinary, SendGrid, Twilio, Stripe, etc.)│
└────────────────────────────────────────────────────────┘
```

### 1. Client / UI
Interacts with the integrations via standardized React hooks (e.g. `useIntegrations`). The UI remains completely agnostic of credentials, URLs, or API configurations.

### 2. Service Layer
Exposes standard method interfaces (e.g., `uploadFile`, `sendEmail`, `sendSms`, `syncWithProvider`, `processIncomingWebhook`) for use in the business logic.

### 3. Provider Manager
Controls runtime bindings. It gets and sets the current active provider. It enables switching active backends on-the-fly without service interruption.

### 4. Adapters Layer
Contains concrete adapter implementations. Each adapter conforms to a strict method signature. It wraps provider-specific SDK calls, signature schemes, or REST endpoints.

---

## Key Core Principles

### Tenant Isolation
To ensure strict security boundaries in a multi-tenant SaaS ecosystem:
* All settings, credentials, and connection logs are logically segmented using `tenantId`.
* Query parameters and mutations are bound to the active tenant session (provided by `TenantRepository.getActiveTenantId()`).
* Database mocks and repository methods enforce the active tenant filter on all retrieval methods.

### Backward Compatibility
* Adapters fall back gracefully to a robust `Mock` configuration.
* All existing hooks, stores, and parameters are preserved, preventing regressions on pre-existing screens and dashboards.

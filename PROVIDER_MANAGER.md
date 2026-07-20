# Provider Manager Abstraction

Rezk Fit Hub handles third-party SaaS integrations via the `ProviderManagerService` to allow on-the-fly adapter resolution.

## Design

### 1. Unified Configuration Registry
* Tracks active bindings for SMS, Email, and Storage providers.
* Configured using tenant isolation boundaries via Zustand and DevTools.

### 2. Runtime Switching
* Switches active bindings dynamically (e.g. SMTP -> SendGrid, AWS S3 -> Google Drive).
* Switching triggers immediate updates on state hooks (`useIntegrationsStore`).
* The change takes effect for all subsequent operations without server reboot.

### 3. Modular Extensibility
* Third-party vendors can be integrated by writing a simple adapter implementing the defined interface and registering it in the adapters map.

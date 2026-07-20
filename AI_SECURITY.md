# AI Platform Security & Compliance

This document covers privacy, data isolation, and API keys protection guidelines.

## Rules
* **Multi-Tenant Scoping**: All chat history and generated insights are isolated by `tenantId`.
* **API Keys Safety**: Keys must be managed inside secure tenant vaults; never leaked to frontend bundles or shared.
* **Personally Identifiable Information (PII) Sanitization**: Anonymizes sensitive metrics prior to routing to external LLM gateways.

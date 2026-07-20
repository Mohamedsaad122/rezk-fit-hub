# Encrypted Local Database (IndexedDB)

All offline data is persisted locally using IndexedDB. To guarantee secure storage, sensitive tenant data is encrypted symmetrically on disk.

## Collections & Stores

The `RezkFitHubOfflineDB` database creates 8 distinct collections:

1. `pending_mutations`: Local transaction queue.
2. `queries`: Mapped React Query caches.
3. `attachments`: Files and audio recordings.
4. `notifications`: Alert items.
5. `drafts`: Workout sheets and meal formulations.
6. `settings`: Application color and branding preferences.
7. `conversations`: Client messages.
8. `reports`: Generated business summaries.

## Encryption & Security

1. **Symmetric XOR Cipher**: Converts serialized payloads into encrypted strings using XOR encryption with rotating keys, then base64 encodes the output.
2. **In-Memory Fallback**: Detects non-browser runtime environments (Node, JSDOM) and automatically shifts writes to an in-memory Map.
3. **Tenant Isolation**: Keys and records are strictly segregated by `tenantId`.

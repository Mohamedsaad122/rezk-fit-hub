# Transactional Synchronization Engine (Sync Engine)

The synchronization engine monitors local state mutations, queues transactions during disconnects, and processes them sequentially with prioritization upon reconnection.

## Sequence Flow

```
   Offline Action
        │
        ▼
 ┌──────────────┐
 │ Enqueue item │ ──► Saves to IndexedDB & SyncStore
 └──────────────┘
        │
        ├──[ If Online ]──► Process immediately
        ▼
 ┌──────────────┐
 │ processQueue │ ──► Sorts by priority & timestamp
 └──────┬───────┘
        │
        ├─► Execute item
        │      ├── Success ─► Remove from queue
        │      ├── Conflict ─► Add to conflict store & hold
        │      └── Error ─► Retry up to 3 times, then discard
```

## Prioritization Matrix

Mutations are sorted by a numerical `priority` field:
- **Priority 3 (High)**: Settings updates, license registrations, and payments.
- **Priority 2 (Medium)**: Nutrition plans and workout configurations.
- **Priority 1 (Low)**: Chat messages, notifications read flags, and comments.

Sorting logic:
`priority` (descending) -> `timestamp` (ascending).

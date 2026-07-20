# Data Conflict Resolution

When local and remote datasets undergo modifications simultaneously, a conflict is detected and resolved using structured rules.

## Conflict Detection

Conflicts are caught when a PUT/PATCH mutation fails on the server with a version mismatch error (`409 Conflict` or custom payload markers). The Sync Engine:
1. Catches the error.
2. Marks the queue transaction status as `Conflict`.
3. Adds the item to the Zustand `conflicts` store.

## Resolution Strategies

Four strategies are supported:

### 1. Last Write Wins (LWW)
Compares timestamps (`updatedAt` / `timestamp`). Keeps the record with the newer timestamp.

### 2. Field-Level Merge
Merges fields from both records. If a key is present in both and values differ, it retains the local change.

### 3. Version Comparison
Compares numeric version codes (`version`). The larger version number wins.

### 4. Manual Resolution
Allows client administrators to resolve field-by-field values through the **Conflict Center** UI.

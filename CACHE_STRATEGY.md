# Cache Strategy & Offline Hydration

Rezk Fit Hub caches read queries locally to ensure instant view load times and immediate accessibility when internet access is lost.

## Core Flow

1. **Write-Through**: When a network query resolves, it is persisted to the local IndexedDB `queries` cache collection.
2. **Hydration**: During client boot, the cache is hydrated from IndexedDB.
3. **Staleness / Expiration**: When reading a cached query, its expiration time is checked. If it is older than the allowed threshold, it is automatically invalidated and deleted.

## Caching Lifespans

Different types of queries have distinct TTLs:
- **Default TTL**: 1 Hour (`1000 * 60 * 60`).
- **Short TTL (Live metrics)**: 5 Minutes.
- **Long TTL (Settings / Preferences)**: 24 Hours.

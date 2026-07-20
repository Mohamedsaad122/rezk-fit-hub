# Enterprise Offline-First Platform Architecture

Rezk Fit Hub implements a resilient Offline-First design enabling complete application capabilities (exercise planning, nutrition drafts, settings updates, notifications, and messaging) when internet access is disrupted, automatically reconciling state when reconnected.

## Core Pillars

```
┌────────────────────────────────────────────────────────┐
│                        App UI                          │
└───────────────────────────┬────────────────────────────┘
                            │ (Uses Offline Stores/State)
┌───────────────────────────▼────────────────────────────┐
│                    Offline Manager                     │
│                  (OfflineManager.js)                   │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│ Connectivity│      │ Cache Mgr   │      │ Sync Engine │
│   Manager   │      │ (Cache Mgr) │      │ (Queue loop)│
└─────────────┘      └──────┬──────┘      └──────┬──────┘
                            │                    │
                     ┌──────▼──────┐      ┌──────▼──────┐
                     │ IndexedDB   │      │ Conflict    │
                     │ (Encrypted) │      │  Resolver   │
                     └─────────────┘      └─────────────┘
```

### 1. Connectivity Tracking
The `ConnectivityManager` hooks into browser events to track availability, updating latency scores and updating state flags.

### 2. Sockets & Real-time Squelch
During offline sessions, real-time socket listeners are paused to prevent connection loop exhausts, resuming smoothly upon network restoration.

### 3. Local Object Database (IndexedDB)
Offline changes are immediately serialized, encrypted using tenant keys, and stored locally in IndexDB collections rather than state-only variables.

### 4. Background Sync loop
A dedicated worker-compatible scheduler runs tasks in the background, retrying queued mutations, updating progress bars, and alerting on conflict states.

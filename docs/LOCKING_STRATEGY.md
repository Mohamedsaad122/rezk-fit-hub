# Rezk Fit Hub — Editing Lock Strategy

This document details the synchronization logic, heartbeat intervals, and lock recovery behaviors implemented for concurrent editing safety.

## Overview

To prevent concurrent write conflicts, Rezk Fit Hub implements a **Soft Lock-out Model** with heartbeat renewals.

```mermaid
sequenceDiagram
    participant UserA as Coach A (Editing)
    participant Server as WebSocket Server / Simulator
    participant UserB as Coach B (Viewer)

    UserA->>Server: acquireLock(entityType, entityId)
    Server-->>UserA: returns success (Lock acquired for 30s)
    Server->>UserB: broadcast(ENTITY_LOCKED, { lockedBy: 'Coach A' })
    Note over UserB: Renders LockWarningBanner & disables inputs
    
    loop Every 10 seconds
        UserA->>Server: renewLock(entityType, entityId)
        Server-->>UserA: renews timeout to +30s
    end

    UserA->>Server: releaseLock(entityType, entityId)
    Server->>UserB: broadcast(ENTITY_UNLOCKED)
    Note over UserB: Hides banner & enables input forms
```

## Key Mechanisms

### 1. Lock Duration & Heartbeat Renewals
- **Acquire Lock**: Triggered when a user opens an Edit Dialog. Locks are set with an initial timeout of **30 seconds**.
- **Heartbeat renewal**: A background interval runs every **10 seconds** inside the `useEntityLock` hook to refresh the active lock.
- **Expiration**: If a user loses connection or closes the tab without saving, the lock automatically expires after 30 seconds, restoring edit capabilities for other staff.

### 2. Lock Warning Banner & State Constraints
- When a page or dialog detects a lock owned by another user:
  - The `LockWarningBanner` displays the avatar and name of the editing owner.
  - All form controls (`Input`, `Select`, `Textarea`, `Button`) are disabled via `<fieldset disabled={isLockedByOther}>` wrappers.
  - A **Force Unlock** bypass button is visible for Administrators to release locks in emergency situations.

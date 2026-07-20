# Real-time Integration & Socket Architecture

This document describes the unified connection management, Pub/Sub event bus, and automatic cache synchronization architecture implementing Sprint 4.1 in Rezk Fit Hub.

---

## Architecture Flow

```
┌────────────────────────────────────────────────────────┐
│                   App Load Initialization              │
│  - SocketService.connect() starts connection.          │
│  - initQuerySynchronizer() links Bus events to Cache.  │
│  - mockRealtime starts timer loop if Mock Mode is ON.  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
  [ Mock Mode ]                           [ Socket Mode ]
        │                                       │
        ▼                                       ▼
  (mockRealtime timer)                   (WebSocket Server)
        │                                       │
        └───────────────────┬───────────────────┘
                            │
                            ▼ (Triggers Event)
                [ eventBus.publish(event) ]
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
  [ UI Listeners ]                      [ Query Cache Synchronizer ]
  (e.g., typing indicators,             (Invalidates caches, appends
   incoming chat popups)                 messages, refreshes counters)
```

---

## 1. Connection Store & Lifecycles
Connection diagnostics are stored inside the Zustand `useRealtimeStore` (`src/realtime/connection-state.js`):
* `isConnected`: Active connection status.
* `latency`: Real-time roundtrip heartbeat time in milliseconds.
* `reconnectAttempts`: Track reconnection counts.
* `transport` & `serverVersion`.

---

## 2. Event Bus (Pub/Sub)
The Event Bus (`src/realtime/event-bus.js`) allows components and services to listen to real-time events without directly importing WS/Socket clients:
```javascript
import { SocketService } from '@/realtime/socket.service';
import { SOCKET_EVENTS } from '@/realtime/socket-events';

// Subscribe to messages
const unsubscribe = SocketService.subscribe(SOCKET_EVENTS.MESSAGE_SENT, (msg) => {
    console.log("New message arrived:", msg);
});

// Clean up inside hooks or useEffect unmounts
unsubscribe();
```

---

## 3. Cache Synchronization Policies
The Query Synchronizer (`src/realtime/query-synchronizer.js`) captures events and manages caches:
* `CLIENT_UPDATED` -> Invalidates Trainees lists and updates detail caches.
* `TASK_COMPLETED` -> Invalidates tasks tables and metrics.
* `MESSAGE_SENT` -> Appends the new message directly to active thread cache, avoiding unnecessary refetches.
* `NOTIFICATION_CREATED` -> Updates badges counter and lists.

---

## 4. Reconnect Backoff Delay Strategy
When a socket connection is interrupted, the system automatically triggers reconnects with exponential backoff:
$$Delay = \min(1000 \times 2^{\text{attempts}}, 30000)\text{ ms}$$
This prevents hammering the database server while providing prompt restoration when network is recovered.

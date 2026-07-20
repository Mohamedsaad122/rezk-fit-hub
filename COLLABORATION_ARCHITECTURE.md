# Enterprise Live Collaboration & Presence Architecture

This document describes the design patterns, protocols, and states implementing the Enterprise Live Collaboration & Presence system (Sprint 4.2) in Rezk Fit Hub.

---

## 1. Presence System

### Lifecycle & Heartbeats
User presence status is tracked via Zustand store (`src/store/presence.store.js`) and hooks (`src/hooks/use-presence-manager.js`):
* **Status States**: `online` (active), `away` (idle), `busy` (focused/DND), `offline`/`invisible`.
* **Idle Detection**: If no user activity (mouse moves, scrolls, keystrokes) is registered for 3 minutes, the presence manager transitions status from `online` to `away`.
* **Heartbeat Updates**: The presence manager sends heartbeat ping frames every 10 seconds via `SocketService.emit(SOCKET_EVENTS.PRESENCE_UPDATED, payload)` to keep connection leases active.

---

## 2. Typing Indicators

### Debounce & Timeout Flow
Typing state broadcasts follow a debounced lifecycle to avoid spamming network pings:
```
[User Keystroke] ──► (Not Typing?) ──► Emit: MESSAGE_TYPING (Immediate)
       │
       ▼
(Reset Timer: 2.5 seconds) ──► (Timeout Fires?) ──► Emit: MESSAGE_STOPPED_TYPING
```
* **Composer Integration**: Handled natively within the input composer (`src/components/MessageComposer.jsx`) and client messaging tabs.
* **Multi-User Banner**: Displays dynamic pluralized banners ("سارة أحمد يكتب الآن...", "سارة أحمد ومحمد علي يكتبان الآن...") when multiple users write simultaneously inside the same conversation thread.

---

## 3. Read Receipts & Delivery States

Checkmarks update dynamically in 3 distinct states based on message headers:
* **Sent** (Single check): Message received by the server.
* **Delivered** (Double grey check): Message successfully pushed to client device.
* **Read** (Double colored blue check): Recipient opened the chat thread.
* **Reader List**: Hovering over the read indicators reveals seen timestamps and a list of reader names who viewed the message.

---

## 4. Message Reactions

Supported reactions: 👍 ❤️ 🔥 😂 👏 🎉 😮 😢
* **Realtime Mutations**: Handled via `addReaction` and `removeReaction` methods inside `MessageRepository` and synced using TanStack Query.
* **Click-to-Toggle**: Users can click directly on existing reaction bubbles to toggle (add/remove) their vote on a specific reaction.

---

## 5. Cache Synchronization Policies

All collaboration events trigger direct cache modifications in TanStack Query via `query-synchronizer.js`:
* `MESSAGE_EDITED`: In-place mutation of the specific message object inside `['messages', 'thread', conversationId]`.
* `MESSAGE_DELETED`: Filters out the deleted message from the active thread list cache.
* `MESSAGE_REACTION_ADDED` / `MESSAGE_REACTION_REMOVED`: Appends or decrements the emojis counts inside the cached list array inline.
* `MESSAGES_READ`: Iterates and marks all messages in the active thread cache as read.
* `PRESENCE_UPDATED`: Invalidate conversations cache and client details lists for immediate visual state update.

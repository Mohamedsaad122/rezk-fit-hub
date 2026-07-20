# Webhooks Engine & Delivery Policies

Rezk Fit Hub supports outgoing webhooks to allow external services to react to platform events.

## Features

### 1. Webhook Registration
Enables registering third-party listener endpoints with custom URLs and events (e.g., `INVOICE_PAID`, `MEMBER_JOINED`).

### 2. Signature Verification
To prevent replay attacks and ensure authenticity, payloads are signed with a secret key.
* The system computes a HMAC-SHA256 signature representation of the payload.
* Receivers must verify the signature header.

### 3. Retry Policy & Backoff
* Webhook delivery attempts are retried up to 3 times on failed connections.
* Immediate retry is attempted on failure.

### 4. Dead-Letter Queue (DLQ)
* If delivery fails after 3 attempts, the event log is marked as `[DLQ]` and logged as `Failed`.
* Allows engineers to inspect and debug faulty receiver endpoints.

### 5. Delivery History & Logs
* Logs statusCode, payload, status, attempt counts, and timestamps for auditing.

### 6. Event Replay
* Outages can be recovered by replaying any delivery event from history logs.

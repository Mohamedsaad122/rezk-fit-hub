# Calendar Synchronization Engine

Synchronizes trainer schedules and booking slots between Rezk Fit Hub and external calendars.

## Features

### 1. Unified Calendar Adapters
* Supports **Google Calendar** and **Microsoft Outlook Calendar**.
* Implements a generic `sync()` interface return type containing status, items synced count, and potential remote API errors.

### 2. Manual and Automatic Sync
* Trainers and admins can trigger sync manually via the dashboard.
* Background runners capture log records.

### 3. Sync Log Audit
* Stores result tokens, counts, timestamps, and descriptive error messages on failure.
* Segmented by tenant context.

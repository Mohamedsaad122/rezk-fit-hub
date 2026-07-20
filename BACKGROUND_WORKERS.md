# Background Workers & Job Queue

Manages the scheduling, execution, retry limits, and failure timeouts of background jobs.

## Architecture

- **Job Enqueue**: Pushes to `backgroundJobs` collection with target retry configurations.
- **Worker Execution**: Scans for `Pending` items, runs them, and resolves failures by decrementing retry budgets.
- **Isolations**: Workers respect tenant context scopes.

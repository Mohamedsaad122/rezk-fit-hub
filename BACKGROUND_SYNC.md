# Background Synchronization & Jobs Scheduler

The scheduler handles periodic tasks and registers worker-level events, automatically starting queue syncs and updating the store metrics.

## Job Registration

To schedule a recurring task, use `BackgroundJobService.scheduleSyncJob`:

```javascript
import { BackgroundJobService } from '@/services/background-job.service';

// Sync every 5 minutes
const job = await BackgroundJobService.scheduleSyncJob('Periodic Data Sync', 1000 * 60 * 5);
```

## Lifecycle States

Each job has a lifecycle status:
- **Pending**: Job is scheduled and waiting for its next interval.
- **Running**: Job is currently executing its task function.
- **Success**: The execution completed without errors.
- **Failed**: Execution failed or the device was offline (rescheduled).

## Offline Graceful Postponement

If the scheduler attempts to execute a task while `isOnline` is false:
- The task is postponed and marked `Failed` (with a retry count update).
- A new trigger is scheduled for `nextRun = Date.now() + intervalMs`.

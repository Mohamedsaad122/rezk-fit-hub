# Event Automation & Realtime Event Broker

Brokers trigger events and maps them to workflow launches.

## Supported Triggers
- `ClientCreated` / `ClientUpdated` / `ClientDeleted`
- `WorkoutAssigned` / `WorkoutCompleted`
- `InvoiceGenerated`
- `CronSchedule`

## Events Published
- `WORKFLOW_STARTED`
- `WORKFLOW_COMPLETED`
- `WORKFLOW_FAILED`
- `APPROVAL_REQUESTED`
- `APPROVAL_APPROVED`
- `APPROVAL_REJECTED`
- `AUTOMATION_TRIGGERED`
- `BACKGROUND_JOB_STARTED`
- `BACKGROUND_JOB_COMPLETED`

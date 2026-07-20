# Subscription Lifecycle

This guide documents the subscription state machine transitions, trials, active statuses, and expirations.

## State Transitions
* **Trial**: Period of limited days before billing.
* **Active**: Paid subscription allowing access up to plan limits.
* **Past Due**: Payment fails on renewal; grace period.
* **Suspended**: Access blocked due to failure to pay.
* **Cancelled**: User cancels the plan; active until current period ends.
* **Expired**: subscription expires.
* **Renewed**: successful payment extends subscription end date.

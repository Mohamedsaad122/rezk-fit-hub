# Alert Engine

System alert triggers, escalation policies, and resolve pathways.

## Usage
```javascript
import AlertsService from '@/services/alerts.service';

await AlertsService.triggerAlert(
    'CPU Usage High',
    'CPU exceeded 90% for 5m',
    'Critical',
    'Infrastructure'
);
```

# Infrastructure Health Monitoring

Ping latency checks, health indicators, database and storage service statuses.

## Usage
```javascript
import HealthService from '@/services/health.service';

const health = await HealthService.getSystemHealth();
```

# Distributed Tracing Engine

Contextual distributed request execution tracing.

## Usage
```javascript
import TracingService from '@/services/tracing.service';

const trace = await TracingService.createTraceSpan(
    'GET /api/trainees',
    'corr-abc-123',
    45,
    'Success',
    null,
    { tenantId: '1' }
);
```

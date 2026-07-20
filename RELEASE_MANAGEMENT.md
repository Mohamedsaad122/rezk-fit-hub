# Release Management

Canary weight adjustments, blue-green deployment mappings, and instant rollbacks.

## Usage
```javascript
import ReleaseService from '@/services/release.service';

await ReleaseService.deployRelease('1.4.0-canary', 'Canary', 'New workout generator', 25);
```

# Logging Engine

Structured logging service across six levels.

## Usage
```javascript
import LoggingService from '@/services/logging.service';

LoggingService.info('Billing', 'User paid invoice', { invoiceId: 12 });
LoggingService.error('Auth', 'SSO Login Failed', { error: 'Invalid SAML token' });
```

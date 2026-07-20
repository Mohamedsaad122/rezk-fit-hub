# Rate Limiting & Throttling Specifications

Rezk Fit Hub protects gateway resources through rate limitation policies.

## Gateway Rules

### 1. Default Tier
- **Limit**: 60 requests per minute.
- **Window**: 60,000 ms.
- **Reset**: Sliding window reset.

### 2. OAuth Apps
- **Limit**: 300 requests per minute.

## Exceeded Limit Response

When client calls exceed window capacity, the API Gateway responds with HTTP Status `429 Too Many Requests`:

```json
{
  "error": "Rate limit exceeded. Try again after 2026-07-19T03:30:00Z"
}
```
"Retry-After" headers are automatically set with reset times.

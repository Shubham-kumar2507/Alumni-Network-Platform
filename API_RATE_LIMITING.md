# API Rate Limiting & Throttling

## Rate Limiting Policy

### Default Limits
- Authenticated users: 1000 requests/hour
- Unauthenticated users: 100 requests/hour
- API keys: 5000 requests/hour

### Endpoint-Specific Limits
- Login: 5 attempts/minute
- Password reset: 3 attempts/hour
- Create post: 50 posts/day
- Send message: 100 messages/hour

## Implementation

### Backend
```php
$this->middleware('throttle:60,1')->only(['create', 'store']);
$this->middleware('throttle:10,1')->only(['login']);
```

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

## Handling Limits

### Response When Limited
```json
{
  "error": "Too many requests",
  "retry_after": 3600
}
```

## Bypass Options
- Premium accounts: 10x limit
- Verified users: 2x limit
- API keys: Custom limits

## Monitoring
- Track usage per endpoint
- Alert on unusual patterns
- DDoS detection
- Abuse prevention

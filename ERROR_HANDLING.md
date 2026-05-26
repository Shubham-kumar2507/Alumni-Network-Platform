# Error Handling & Status Codes

## HTTP Status Codes

### Success (2xx)
- 200: OK - Request successful
- 201: Created - Resource created
- 204: No Content - Request successful, no content

### Client Errors (4xx)
- 400: Bad Request - Invalid input
- 401: Unauthorized - Authentication required
- 403: Forbidden - Access denied
- 404: Not Found - Resource not found
- 422: Unprocessable Entity - Validation failed
- 429: Too Many Requests - Rate limited

### Server Errors (5xx)
- 500: Internal Server Error
- 502: Bad Gateway
- 503: Service Unavailable
- 504: Gateway Timeout

## Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": ["error message"]
  },
  "timestamp": "2026-05-26T10:30:00Z"
}
```

## Error Codes

### Authentication
- AUTH_001: Invalid credentials
- AUTH_002: Token expired
- AUTH_003: Token invalid

### Validation
- VALIDATION_001: Email required
- VALIDATION_002: Email invalid
- VALIDATION_003: Password too weak

### Resource
- RESOURCE_001: Not found
- RESOURCE_002: Already exists
- RESOURCE_003: Access denied

## Handling Errors in Frontend

```javascript
try {
  const response = await axios.get('/api/endpoint');
} catch (error) {
  if (error.response) {
    console.log(error.response.status);
    console.log(error.response.data);
  }
}
```

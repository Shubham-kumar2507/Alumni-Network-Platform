# Contributing Guide

## How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style

### Frontend (React/JavaScript)
- Use functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for complex logic
- Follow Airbnb style guide

### Backend (PHP/Laravel)
- Follow PSR-12 coding standard
- Use type hints for parameters and returns
- Add docblocks for classes and methods
- Use meaningful variable and function names

## Testing

### Frontend
```bash
npm run test
```

### Backend
```bash
php artisan test
```

## Performance Considerations
- Minimize API calls
- Use pagination for large lists
- Implement lazy loading for images
- Cache frequently accessed data
- Use database indexing for large tables

## Security Considerations
- Validate all user inputs
- Use HTTPS for all communication
- Implement rate limiting
- Use environment variables for secrets
- Regular security audits
- Keep dependencies updated

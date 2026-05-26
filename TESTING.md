# Testing Guide

## Testing Strategy

### Frontend Testing
- Unit tests with Jest
- Component tests with React Testing Library
- Integration tests for user flows
- E2E tests with Cypress

### Backend Testing
- Unit tests for business logic
- Feature tests for API endpoints
- Database transaction tests
- Integration tests

## Running Tests

### Frontend
```bash
cd frontend
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Backend
```bash
cd backend
php artisan test                 # Run all tests
php artisan test --filter=Auth   # Run specific test
php artisan test --coverage      # Coverage report
```

## Test Examples

### Frontend Component Test
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
```

### Backend API Test
```php
test('can login user', function () {
    $response = $this->post('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123'
    ]);
    
    $response->assertStatus(200);
});
```

## Coverage Requirements
- Minimum 80% code coverage
- 100% coverage for critical features
- All public APIs must have tests
- Security-sensitive code fully tested

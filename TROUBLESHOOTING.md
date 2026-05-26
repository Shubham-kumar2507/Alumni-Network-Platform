# Troubleshooting Guide

## Common Issues and Solutions

### Frontend Issues

#### 1. Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port 5173 Already in Use
```bash
# Kill process using port
# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

#### 3. API Connection Errors
- Check backend is running on correct port
- Verify API URL in environment
- Check CORS configuration
- Verify authentication token

### Backend Issues

#### 1. Database Connection Error
- Check MySQL is running
- Verify .env database credentials
- Ensure database exists
- Check database permissions

#### 2. Migrations Failed
```bash
php artisan migrate:rollback
php artisan migrate
```

#### 3. Composer Issues
```bash
composer clear-cache
composer install --no-cache
```

### Authentication Issues

#### 1. Login Not Working
- Verify user exists in database
- Check password reset required
- Verify email verification status
- Check token generation

#### 2. Unauthorized Errors (401/403)
- Verify token exists
- Check token expiration
- Verify user has required permissions
- Check CORS headers

### Performance Issues

#### 1. Slow API Response
- Check database indexes
- Verify query optimization
- Use pagination for large results
- Enable caching

#### 2. Large Bundle Size
- Check for unused dependencies
- Enable tree-shaking
- Use code splitting
- Optimize images

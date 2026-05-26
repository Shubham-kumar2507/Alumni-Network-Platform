# Security & Authentication

## Authentication Flow

### Registration
1. User provides email, password, and role (alumni/student)
2. System validates input and checks email uniqueness
3. Password is hashed using bcrypt
4. User record created in database
5. Verification email sent

### Login
1. User provides email and password
2. System retrieves user by email
3. Password compared with stored hash
4. If valid, JWT token generated
5. Token returned to client

### Token Management
- Token expires after 24 hours
- Refresh token for obtaining new token
- Tokens stored securely in httpOnly cookies
- Token validation on each API request

## Security Best Practices

### Frontend
- Never store sensitive data in localStorage
- Always use HTTPS
- Implement CSRF protection
- Validate user input
- Sanitize HTML content
- Regular security updates

### Backend
- Use prepared statements
- Implement rate limiting
- Validate and sanitize inputs
- Use CORS properly
- Implement logging and monitoring
- Keep dependencies updated
- Use environment variables
- Regular security audits

## Password Policy
- Minimum 8 characters
- Mix of uppercase and lowercase
- At least one number
- At least one special character
- Regular password change recommended
- Password reset via email

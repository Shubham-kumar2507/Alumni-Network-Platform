# Configuration Files

## Backend Configuration

### Environment Variables (.env)
```
APP_NAME=AlumniNet
APP_ENV=production
APP_KEY=base64:xxxxx
APP_DEBUG=false
APP_URL=https://alumninet.example.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=alumni_network
DB_USERNAME=admin
DB_PASSWORD=secure_password

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=xxx
MAIL_PASSWORD=xxx
MAIL_FROM_ADDRESS=noreply@alumninet.in
```

## Frontend Configuration

### Environment Variables (.env)
```
VITE_API_URL=https://api.alumninet.example.com
VITE_APP_NAME=AlumniNet
VITE_APP_URL=https://alumninet.example.com
```

### Vite Configuration
- Hot Module Replacement enabled
- Optimized chunk splitting
- Image compression
- CSS autoprefixing

## Development Tools
- ESLint for code quality
- Prettier for code formatting
- Jest for testing
- Cypress for E2E testing

## Recommended IDE Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Laravel Extension Pack
- PHP Intelephense

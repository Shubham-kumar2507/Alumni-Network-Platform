# Deployment Guide

## Hosting Requirements
- Linux server or cloud instance
- PHP 8.1+ runtime
- Node.js 16+ for frontend build
- MySQL 5.7+ database
- SSL certificate

## Backend Deployment (Laravel)

### 1. Upload to Server
```bash
git clone https://github.com/Shubham-kumar2507/Alumni-Network-Platform.git
cd Alumni-Network-Platform/backend
```

### 2. Install Dependencies
```bash
composer install --optimize-autoloader --no-dev
```

### 3. Environment Setup
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Database Migration
```bash
php artisan migrate --force
php artisan db:seed
```

### 5. Configure Web Server (Nginx/Apache)
Point document root to `/backend/public`

## Frontend Deployment

### 1. Build for Production
```bash
cd frontend
npm install
npm run build
```

### 2. Upload Build Files
- Upload contents of `dist/` folder to web server
- Configure server to serve from dist folder

### 3. API Configuration
Update API endpoints to production backend URL

## Post-Deployment
- Set up SSL/TLS
- Configure CORS for frontend
- Setup database backups
- Enable error logging
- Configure CDN for static assets

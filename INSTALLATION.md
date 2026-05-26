# Installation Guide

## Prerequisites
- PHP 8.1+
- Node.js 16+
- MySQL 5.7+
- Composer
- npm

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup
```bash
php artisan migrate
php artisan db:seed
```

### 4. Start Server
```bash
php artisan serve
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

## Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Database: MySQL on localhost:3306

# Architecture Overview

## Frontend Architecture (React + Vite)
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **Styling**: Tailwind CSS 4.3.0
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v7

### Frontend Structure
```
frontend/
├── src/
│   ├── api/           # API integration
│   ├── assets/        # Static assets
│   ├── components/    # Reusable components
│   ├── context/       # React context (Auth, Theme)
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   │   ├── alumni/
│   │   ├── student/
│   │   └── auth/
│   └── App.jsx        # Main app component
```

## Backend Architecture (Laravel 11)
- **Framework**: Laravel 11
- **Database**: MySQL
- **ORM**: Eloquent
- **API**: RESTful API
- **Authentication**: Laravel Sanctum

### Backend Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   ├── Models/
│   │   ├── User
│   │   ├── Alumni
│   │   ├── Student
│   │   └── ...
│   └── Providers/
├── config/            # Configuration files
├── database/
│   ├── migrations/    # Database migrations
│   └── seeders/       # Database seeders
└── routes/
    ├── api.php        # API routes
    └── web.php        # Web routes
```

## Data Flow
1. Frontend sends request to Backend API
2. Backend processes request and authenticates user
3. Backend queries database using Eloquent ORM
4. Frontend receives response and updates UI
5. Context API manages global state

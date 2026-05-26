# API Documentation

## Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- POST /api/auth/refresh - Refresh token
- GET /api/auth/me - Get current user

## Alumni Endpoints
- GET /api/alumni - List all alumni
- GET /api/alumni/{id} - Get alumni profile
- PUT /api/alumni/{id} - Update alumni profile
- GET /api/alumni/{id}/connections - Get alumni connections
- POST /api/alumni/{id}/mentor-requests - Accept mentor requests

## Student Endpoints
- GET /api/students - List all students
- GET /api/students/{id} - Get student profile
- PUT /api/students/{id} - Update student profile
- GET /api/students/mentors - Find mentors
- POST /api/students/mentor-requests - Send mentor request

## Chat Endpoints
- GET /api/messages - Get messages
- POST /api/messages - Send message
- GET /api/conversations - List conversations

## Event Endpoints
- GET /api/events - List events
- POST /api/events - Create event
- POST /api/events/{id}/join - Join event

## Referral Endpoints
- GET /api/referrals - List referrals
- POST /api/referrals - Create referral
- PUT /api/referrals/{id} - Update referral status

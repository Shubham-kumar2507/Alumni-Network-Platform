# Feature: Referral System

## Overview
The referral system enables alumni to refer students for job opportunities.

## Key Features

### Creating Referrals
- Alumni can post job opportunities
- Include company, role, and requirements
- Set referral deadline
- Specify referral benefits

### Managing Referrals
- Students browse available referrals
- Apply for referrals directly
- Track application status
- Get feedback on applications

### Referral Process
1. Alumni posts referral opportunity
2. Students discover and apply
3. Alumni reviews applications
4. Alumni submits referral to company
5. Student gets interview opportunity
6. Track final outcome (hired/rejected/pending)

### Notification System
- New referral notifications
- Application status updates
- Feedback notifications
- Success notifications

## Implementation Details

### Database Schema
- Referrals table: job details, deadline, status
- Applications table: student, referral, status
- Feedback table: comments and ratings

### Frontend Components
- ReferralList component
- ReferralDetail component
- ApplicationForm component
- StatusTracker component

### Backend Endpoints
- GET /api/referrals - List referrals
- POST /api/referrals - Create referral
- GET /api/referrals/{id} - Get details
- POST /api/referrals/{id}/apply - Apply for referral
- GET /api/my-applications - View applications

## Metrics
- Total referrals made
- Successful conversions
- Average time to hire
- Top performing referrers
- Industry-wise distribution

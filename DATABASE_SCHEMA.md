# Database Schema

## Users Table
- id (Primary Key)
- name
- email (Unique)
- password
- email_verified_at
- profile_photo_path
- bio
- role (alumni/student)
- created_at
- updated_at

## Alumni Table
- id (Primary Key)
- user_id (Foreign Key)
- graduation_year
- company
- job_title
- industry
- experience_years

## Students Table
- id (Primary Key)
- user_id (Foreign Key)
- enrollment_year
- graduation_year
- branch
- cgpa

## Skills Table
- id (Primary Key)
- user_id (Foreign Key)
- skill_name
- proficiency_level

## Connection Requests Table
- id (Primary Key)
- sender_id (Foreign Key -> Users)
- receiver_id (Foreign Key -> Users)
- status (pending/accepted/rejected)
- created_at

## Mentor Requests Table
- id (Primary Key)
- student_id (Foreign Key)
- mentor_id (Foreign Key)
- status (pending/accepted/rejected)
- created_at

## Messages Table
- id (Primary Key)
- sender_id (Foreign Key -> Users)
- receiver_id (Foreign Key -> Users)
- content
- read_at
- created_at

## Events Table
- id (Primary Key)
- title
- description
- date
- location
- created_by (Foreign Key)

## Referrals Table
- id (Primary Key)
- referrer_id (Foreign Key)
- student_id (Foreign Key)
- job_title
- company
- status (pending/applied/rejected)

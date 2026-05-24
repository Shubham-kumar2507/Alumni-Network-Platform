<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'avatar', 'is_active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function alumni()
    {
        return $this->hasOne(Alumni::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'user_skills');
    }

    public function sentConnections()
    {
        return $this->hasMany(ConnectionRequest::class, 'sender_id');
    }

    public function receivedConnections()
    {
        return $this->hasMany(ConnectionRequest::class, 'receiver_id');
    }

    public function mentorRequests()
    {
        return $this->hasMany(MentorRequest::class, 'student_id');
    }

    public function menteeRequests()
    {
        return $this->hasMany(MentorRequest::class, 'alumni_id');
    }

    public function referralsSent()
    {
        return $this->hasMany(Referral::class, 'student_id');
    }

    public function referralsReceived()
    {
        return $this->hasMany(Referral::class, 'alumni_id');
    }

    public function isStudent(): bool { return $this->role === 'student'; }
    public function isAlumni(): bool  { return $this->role === 'alumni'; }
    public function isAdmin(): bool   { return $this->role === 'admin'; }

    public function getAvatarUrlAttribute(): string
    {
        return $this->avatar
            ? asset('storage/' . $this->avatar)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=6366f1&color=fff';
    }
}

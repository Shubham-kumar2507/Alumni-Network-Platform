<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $table = 'alumni';

    protected $fillable = [
        'user_id', 'company', 'job_role', 'industry', 'experience_years',
        'bio', 'linkedin', 'github', 'is_mentor', 'graduation_year', 'college', 'branch', 'phone',
    ];

    protected $casts = ['is_mentor' => 'boolean'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

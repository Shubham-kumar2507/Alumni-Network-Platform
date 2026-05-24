<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id', 'branch', 'college', 'graduation_year',
        'bio', 'resume_path', 'linkedin', 'github', 'phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

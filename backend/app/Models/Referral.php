<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Referral extends Model
{
    protected $fillable = [
        'student_id', 'alumni_id', 'job_title', 'company', 'message', 'comments', 'status'
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id')->with(['student', 'skills']);
    }

    public function alumni()
    {
        return $this->belongsTo(User::class, 'alumni_id')->with(['alumni']);
    }
}

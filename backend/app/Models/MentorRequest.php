<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentorRequest extends Model
{
    protected $fillable = ['student_id', 'alumni_id', 'message', 'status'];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id')->with(['student', 'skills']);
    }

    public function alumni()
    {
        return $this->belongsTo(User::class, 'alumni_id')->with(['alumni', 'skills']);
    }
}
